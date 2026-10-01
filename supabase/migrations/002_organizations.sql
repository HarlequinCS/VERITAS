-- Organizations, memberships, and invitations.

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  require_mfa BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'analyst', 'developer', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'analyst', 'developer', 'viewer')),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  invited_by UUID REFERENCES public.users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_select_member ON public.organizations;
CREATE POLICY organizations_select_member ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.org_id = organizations.id
        AND m.user_id = auth.uid()
        AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS memberships_select_own_org ON public.memberships;
CREATE POLICY memberships_select_own_org ON public.memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships mine
      WHERE mine.org_id = memberships.org_id
        AND mine.user_id = auth.uid()
        AND mine.status = 'active'
    )
  );

DROP POLICY IF EXISTS invitations_select_admin ON public.invitations;
CREATE POLICY invitations_select_admin ON public.invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships mine
      WHERE mine.org_id = invitations.org_id
        AND mine.user_id = auth.uid()
        AND mine.status = 'active'
        AND mine.role IN ('owner', 'admin')
    )
  );

CREATE OR REPLACE FUNCTION public.is_org_admin(p_org UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE org_id = p_org
      AND user_id = auth.uid()
      AND status = 'active'
      AND role IN ('owner', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.create_invitation(
  p_org UUID,
  p_email TEXT,
  p_role TEXT,
  p_token_hash TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF NOT public.is_org_admin(p_org) THEN
    RAISE EXCEPTION 'Only an owner or admin can invite members';
  END IF;
  IF p_role NOT IN ('admin', 'analyst', 'developer', 'viewer') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  INSERT INTO public.invitations (org_id, email, role, token_hash, expires_at, invited_by)
  VALUES (p_org, lower(btrim(p_email)), p_role, p_token_hash, NOW() + INTERVAL '7 days', auth.uid())
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_invitation(p_token_hash TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
  caller_email TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to accept this invite';
  END IF;

  SELECT * INTO inv
  FROM public.invitations
  WHERE token_hash = p_token_hash
    AND accepted_at IS NULL
    AND expires_at > NOW();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite is invalid or expired';
  END IF;

  SELECT email INTO caller_email FROM public.users WHERE user_id = auth.uid();
  IF caller_email IS NULL OR lower(caller_email) <> lower(inv.email) THEN
    RAISE EXCEPTION 'This invite was sent to a different email';
  END IF;

  INSERT INTO public.memberships (org_id, user_id, role, status)
  VALUES (inv.org_id, auth.uid(), inv.role, 'active')
  ON CONFLICT (org_id, user_id)
  DO UPDATE SET role = EXCLUDED.role, status = 'active';

  UPDATE public.invitations SET accepted_at = NOW() WHERE id = inv.id;
  RETURN inv.org_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_member_role(p_org UUID, p_user UUID, p_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_org_admin(p_org) THEN
    RAISE EXCEPTION 'Only an owner or admin can change roles';
  END IF;
  IF p_user = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own role';
  END IF;
  IF p_role NOT IN ('admin', 'analyst', 'developer', 'viewer') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  UPDATE public.memberships
  SET role = p_role
  WHERE org_id = p_org AND user_id = p_user AND status = 'active' AND role <> 'owner';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_member_status(p_org UUID, p_user UUID, p_status TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_org_admin(p_org) THEN
    RAISE EXCEPTION 'Only an owner or admin can change member status';
  END IF;
  IF p_user = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own status';
  END IF;
  IF p_status NOT IN ('active', 'suspended', 'removed') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE public.memberships
  SET status = p_status
  WHERE org_id = p_org AND user_id = p_user AND role <> 'owner';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_org_require_mfa(p_org UUID, p_required BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_org_admin(p_org) THEN
    RAISE EXCEPTION 'Only an owner or admin can change MFA policy';
  END IF;
  UPDATE public.organizations SET require_mfa = p_required WHERE id = p_org;
END;
$$;

CREATE OR REPLACE FUNCTION public.my_access(p_org UUID DEFAULT NULL)
RETURNS TABLE(status TEXT, require_mfa BOOLEAN, role TEXT, access_org UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.status, o.require_mfa, m.role, m.org_id
  FROM public.memberships m
  JOIN public.organizations o ON o.id = m.org_id
  WHERE m.user_id = auth.uid()
    AND (p_org IS NULL OR m.org_id = p_org)
  ORDER BY m.created_at
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.org_directory(p_org UUID)
RETURNS TABLE(user_id UUID, email TEXT, display_name TEXT, username TEXT, role TEXT, status TEXT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE org_id = p_org AND user_id = auth.uid() AND status <> 'removed'
  ) THEN
    RAISE EXCEPTION 'Not a member of this organization';
  END IF;

  RETURN QUERY
  SELECT u.user_id, u.email, u.display_name, u.username, m.role, m.status
  FROM public.memberships m
  JOIN public.users u ON u.user_id = m.user_id
  WHERE m.org_id = p_org
  ORDER BY u.email;
END;
$$;

REVOKE ALL ON FUNCTION public.is_org_admin(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_invitation(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_invitation(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_member_role(UUID, UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_member_status(UUID, UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_org_require_mfa(UUID, BOOLEAN) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invitation(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_invitation(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_member_role(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_member_status(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_org_require_mfa(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_access(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.org_directory(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.my_access(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.org_directory(UUID) FROM PUBLIC;

-- Backfill one personal org and an owner membership per existing user.
INSERT INTO public.organizations (name, slug)
SELECT
  split_part(u.email, '@', 1) || ' workspace',
  u.user_id::text
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.memberships m WHERE m.user_id = u.user_id
);

INSERT INTO public.memberships (org_id, user_id, role, status)
SELECT o.id, u.user_id, 'owner', 'active'
FROM public.users u
JOIN public.organizations o ON o.slug = u.user_id::text
WHERE NOT EXISTS (
  SELECT 1 FROM public.memberships m WHERE m.user_id = u.user_id AND m.org_id = o.id
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org UUID;
  display TEXT;
BEGIN
  display := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));

  INSERT INTO public.users (user_id, email, username, display_name, role)
  VALUES (NEW.id, NEW.email, display, display, 'Analyst');

  INSERT INTO public.organizations (name, slug)
  VALUES (display || ' workspace', NEW.id::text)
  RETURNING id INTO new_org;

  INSERT INTO public.memberships (org_id, user_id, role, status)
  VALUES (new_org, NEW.id, 'owner', 'active');

  RETURN NEW;
END;
$$;
