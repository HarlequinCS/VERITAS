-- -----------------------------------------------------------------------------
-- Drop legacy scans table (replaced by normalized schema below)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.scans CASCADE;

-- -----------------------------------------------------------------------------
-- 1. target_applications
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.target_applications (
  target_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  environment TEXT CHECK (environment IN ('Production','Staging','Development','Testing')),
  auth_token_config JSONB,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.target_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS target_apps_select_own ON public.target_applications;
CREATE POLICY target_apps_select_own ON public.target_applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS target_apps_insert_own ON public.target_applications;
CREATE POLICY target_apps_insert_own ON public.target_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS target_apps_update_own ON public.target_applications;
CREATE POLICY target_apps_update_own ON public.target_applications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS target_apps_delete_own ON public.target_applications;
CREATE POLICY target_apps_delete_own ON public.target_applications
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. scan_sessions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scan_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id UUID REFERENCES public.target_applications(target_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_status TEXT NOT NULL CHECK (scan_status IN ('Running','Completed','Failed')),
  scan_mode TEXT CHECK (scan_mode IN ('Black Box','White Box')),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  total_vulnerabilities_found INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add scan_mode if table was created before this column existed
ALTER TABLE public.scan_sessions ADD COLUMN IF NOT EXISTS scan_mode TEXT CHECK (scan_mode IN ('Black Box','White Box'));

ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS scan_sessions_select_own ON public.scan_sessions;
CREATE POLICY scan_sessions_select_own ON public.scan_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS scan_sessions_insert_own ON public.scan_sessions;
CREATE POLICY scan_sessions_insert_own ON public.scan_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. detected_vulnerabilities
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.detected_vulnerabilities (
  vuln_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.scan_sessions(session_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cwe_id TEXT,
  owasp_category TEXT,
  severity_level TEXT CHECK (severity_level IN ('Critical','High','Medium','Low','Info')),
  endpoint_url TEXT,
  is_false_positive BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.detected_vulnerabilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS detected_vulns_select_own ON public.detected_vulnerabilities;
CREATE POLICY detected_vulns_select_own ON public.detected_vulnerabilities
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS detected_vulns_insert_own ON public.detected_vulnerabilities;
CREATE POLICY detected_vulns_insert_own ON public.detected_vulnerabilities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 4. simulation_payload
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.simulation_payload (
  payload_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vuln_id UUID REFERENCES public.detected_vulnerabilities(vuln_id) ON DELETE CASCADE,
  payload_content TEXT NOT NULL,
  injection_method TEXT,
  generated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.simulation_payload ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payload_select_own ON public.simulation_payload;
CREATE POLICY payload_select_own ON public.simulation_payload
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.detected_vulnerabilities WHERE vuln_id = simulation_payload.vuln_id)
  );

-- -----------------------------------------------------------------------------
-- 5. execution_traces
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.execution_traces (
  trace_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id UUID REFERENCES public.simulation_payload(payload_id) ON DELETE CASCADE,
  http_status_code INTEGER,
  dom_state_change TEXT,
  response_body_snippet TEXT,
  exploit_successful BOOLEAN DEFAULT FALSE,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.execution_traces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS traces_select_own ON public.execution_traces;
CREATE POLICY traces_select_own ON public.execution_traces
  FOR SELECT USING (
    auth.uid() = (
      SELECT dv.user_id FROM public.simulation_payload sp
      JOIN public.detected_vulnerabilities dv ON dv.vuln_id = sp.vuln_id
      WHERE sp.payload_id = execution_traces.payload_id
    )
  );

-- -----------------------------------------------------------------------------
-- 6. ai_analysis_log
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_analysis_log (
  analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id UUID REFERENCES public.execution_traces(trace_id) ON DELETE CASCADE,
  root_cause_description TEXT,
  confidence_score DECIMAL(5,2),
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_analysis_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS analysis_select_own ON public.ai_analysis_log;
CREATE POLICY analysis_select_own ON public.ai_analysis_log
  FOR SELECT USING (
    auth.uid() = (
      SELECT dv.user_id FROM public.execution_traces et
      JOIN public.simulation_payload sp ON sp.payload_id = et.payload_id
      JOIN public.detected_vulnerabilities dv ON dv.vuln_id = sp.vuln_id
      WHERE et.trace_id = ai_analysis_log.trace_id
    )
  );

-- -----------------------------------------------------------------------------
-- 7. remediation_patches
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remediation_patches (
  patch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.ai_analysis_log(analysis_id) ON DELETE CASCADE,
  framework_language TEXT,
  vulnerable_code_snippet TEXT,
  patched_code_snippet TEXT,
  implementation_instructions TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.remediation_patches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS patches_select_own ON public.remediation_patches;
CREATE POLICY patches_select_own ON public.remediation_patches
  FOR SELECT USING (
    auth.uid() = (
      SELECT dv.user_id FROM public.ai_analysis_log al
      JOIN public.execution_traces et ON et.trace_id = al.trace_id
      JOIN public.simulation_payload sp ON sp.payload_id = et.payload_id
      JOIN public.detected_vulnerabilities dv ON dv.vuln_id = sp.vuln_id
      WHERE al.analysis_id = remediation_patches.analysis_id
    )
  );

-- -----------------------------------------------------------------------------
-- 8. remediation_tickets
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.remediation_tickets (
  ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vuln_id UUID REFERENCES public.detected_vulnerabilities(vuln_id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.users(user_id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.users(user_id) ON DELETE SET NULL,
  ticket_status TEXT CHECK (ticket_status IN ('Open','In Progress','Resolved','Closed')),
  sla_due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.remediation_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tickets_select_own ON public.remediation_tickets;
CREATE POLICY tickets_select_own ON public.remediation_tickets
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.detected_vulnerabilities WHERE vuln_id = remediation_tickets.vuln_id)
  );

DROP POLICY IF EXISTS tickets_insert_own ON public.remediation_tickets;
CREATE POLICY tickets_insert_own ON public.remediation_tickets
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.detected_vulnerabilities WHERE vuln_id = remediation_tickets.vuln_id)
  );

-- -----------------------------------------------------------------------------
-- Trigger: auto-create public.users row on new auth.user
-- -----------------------------------------------------------------------------

-- 1. Ensure the public.users table exists (adjust columns if your schema differs)
CREATE TABLE IF NOT EXISTS public.users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email   TEXT NOT NULL,
  username TEXT NOT NULL,
  role    TEXT NOT NULL DEFAULT 'Analyst',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS on the table (recommended)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2a. RLS policies so a signed-in user can read/update their own row.
--     Without these, RLS denies all access by default: the dashboard
--     SELECT returns nothing and the profile UPDATE silently affects 0 rows.
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (user_id, email, username, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'Analyst'
  );
  RETURN new;
END;
$$;

-- 4. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
