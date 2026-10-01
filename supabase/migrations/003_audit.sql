CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(user_id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_select_admin ON public.audit_events;
CREATE POLICY audit_select_admin ON public.audit_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships mine
      WHERE mine.org_id = audit_events.org_id
        AND mine.user_id = auth.uid()
        AND mine.status = 'active'
        AND mine.role IN ('owner', 'admin')
    )
  );

CREATE OR REPLACE FUNCTION public.write_audit(
  p_action TEXT,
  p_target TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_ip TEXT DEFAULT NULL,
  p_org UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  org UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated';
  END IF;

  org := COALESCE(
    p_org,
    (
      SELECT m.org_id
      FROM public.memberships m
      WHERE m.user_id = auth.uid() AND m.status = 'active'
      ORDER BY m.created_at
      LIMIT 1
    )
  );

  INSERT INTO public.audit_events (org_id, actor_id, action, target, metadata, ip)
  VALUES (org, auth.uid(), p_action, p_target, COALESCE(p_metadata, '{}'::jsonb), p_ip)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.write_audit(TEXT, TEXT, JSONB, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.write_audit(TEXT, TEXT, JSONB, TEXT, UUID) TO authenticated;
