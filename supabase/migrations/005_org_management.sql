ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS invitations_one_pending
  ON public.invitations (org_id, email)
  WHERE accepted_at IS NULL AND revoked_at IS NULL AND rejected_at IS NULL;

CREATE OR REPLACE FUNCTION public.is_org_owner(p_org UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.organizations o ON o.id = m.org_id
    WHERE m.org_id = p_org
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND m.role = 'owner'
      AND o.deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(p_org UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.organizations o ON o.id = m.org_id
    WHERE m.org_id = p_org
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND m.role IN ('owner', 'admin')
      AND o.deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.create_organization(
  p_name TEXT,
  p_slug TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  clean_slug TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to create an organization';
  END IF;
  IF btrim(p_name) = '' OR char_length(btrim(p_name)) > 80 THEN
    RAISE EXCEPTION 'Organization name must be 1 to 80 characters';
  END IF;
  clean_slug := lower(regexp_replace(btrim(p_slug), '[^a-zA-Z0-9]+', '-', 'g'));
  clean_slug := trim(both '-' from clean_slug);
  IF clean_slug = '' OR char_length(clean_slug) > 60 THEN
    RAISE EXCEPTION 'Choose a shorter slug using letters and numbers';
  END IF;
  IF EXISTS (SELECT 1 FROM public.organizations WHERE slug = clean_slug) THEN
    RAISE EXCEPTION 'That organization address is already used';
  END IF;

  INSERT INTO public.organizations (name, slug, description)
  VALUES (btrim(p_name), clean_slug, NULLIF(btrim(COALESCE(p_description, '')), ''))
  RETURNING id INTO new_id;

  INSERT INTO public.memberships (org_id, user_id, role, status)
  VALUES (new_id, auth.uid(), 'owner', 'active');

  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_organization(
  p_org UUID,
  p_name TEXT,
  p_description TEXT,
  p_logo_url TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_org_owner(p_org) THEN
    RAISE EXCEPTION 'Only the owner can edit this organization';
  END IF;
  IF btrim(p_name) = '' OR char_length(btrim(p_name)) > 80 THEN
    RAISE EXCEPTION 'Organization name must be 1 to 80 characters';
  END IF;

  UPDATE public.organizations
  SET name = btrim(p_name),
      description = NULLIF(btrim(COALESCE(p_description, '')), ''),
      logo_url = NULLIF(btrim(COALESCE(p_logo_url, '')), '')
  WHERE id = p_org AND deleted_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.soft_delete_organization(p_org UUID, p_confirm TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_name TEXT;
BEGIN
  IF NOT public.is_org_owner(p_org) THEN
    RAISE EXCEPTION 'Only the owner can delete this organization';
  END IF;

  SELECT name INTO org_name FROM public.organizations WHERE id = p_org AND deleted_at IS NULL;
  IF org_name IS NULL OR p_confirm IS DISTINCT FROM org_name THEN
    RAISE EXCEPTION 'Type the organization name to confirm deletion';
  END IF;

  UPDATE public.organizations SET deleted_at = NOW() WHERE id = p_org;
  UPDATE public.memberships SET status = 'removed' WHERE org_id = p_org AND status = 'active';
  UPDATE public.invitations
  SET revoked_at = NOW()
  WHERE org_id = p_org AND accepted_at IS NULL AND revoked_at IS NULL AND rejected_at IS NULL;
END;
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
  clean_email TEXT;
BEGIN
  IF NOT public.is_org_admin(p_org) THEN
    RAISE EXCEPTION 'Only an owner or admin can invite members';
  END IF;
  IF p_role NOT IN ('admin', 'analyst', 'developer', 'viewer') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;
  clean_email := lower(btrim(p_email));

  IF EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.users u ON u.user_id = m.user_id
    WHERE m.org_id = p_org AND m.status = 'active' AND lower(u.email) = clean_email
  ) THEN
    RAISE EXCEPTION 'That person is already a member';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.invitations
    WHERE org_id = p_org AND email = clean_email
      AND accepted_at IS NULL AND revoked_at IS NULL AND rejected_at IS NULL
      AND expires_at > NOW()
  ) THEN
    RAISE EXCEPTION 'A pending invite already exists for that email';
  END IF;

  INSERT INTO public.invitations (org_id, email, role, token_hash, expires_at, invited_by)
  VALUES (p_org, clean_email, p_role, p_token_hash, NOW() + INTERVAL '7 days', auth.uid())
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

  SELECT * INTO inv FROM public.invitations WHERE token_hash = p_token_hash;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite is invalid or expired';
  END IF;
  IF inv.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'This invite was revoked';
  END IF;
  IF inv.rejected_at IS NOT NULL THEN
    RAISE EXCEPTION 'This invite was declined';
  END IF;
  IF inv.accepted_at IS NOT NULL OR inv.expires_at <= NOW() THEN
    RAISE EXCEPTION 'Invite is invalid or expired';
  END IF;
  IF EXISTS (SELECT 1 FROM public.organizations WHERE id = inv.org_id AND deleted_at IS NOT NULL) THEN
    RAISE EXCEPTION 'This organization is no longer available';
  END IF;

  SELECT email INTO caller_email FROM public.users WHERE user_id = auth.uid();
  IF caller_email IS NULL OR lower(caller_email) <> lower(inv.email) THEN
    RAISE EXCEPTION 'This invite was sent to a different email';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.memberships
    WHERE org_id = inv.org_id AND user_id = auth.uid() AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'You are already a member of this organization';
  END IF;

  INSERT INTO public.memberships (org_id, user_id, role, status)
  VALUES (inv.org_id, auth.uid(), inv.role, 'active')
  ON CONFLICT (org_id, user_id)
  DO UPDATE SET role = EXCLUDED.role, status = 'active'
  WHERE public.memberships.status <> 'active';

  UPDATE public.invitations SET accepted_at = NOW() WHERE id = inv.id;
  RETURN inv.org_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_invitation(p_token_hash TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
  caller_email TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to decline this invite';
  END IF;
  SELECT * INTO inv FROM public.invitations WHERE token_hash = p_token_hash AND accepted_at IS NULL AND revoked_at IS NULL AND rejected_at IS NULL;
  IF NOT FOUND OR inv.expires_at <= NOW() THEN
    RAISE EXCEPTION 'Invite is invalid or expired';
  END IF;
  SELECT email INTO caller_email FROM public.users WHERE user_id = auth.uid();
  IF caller_email IS NULL OR lower(caller_email) <> lower(inv.email) THEN
    RAISE EXCEPTION 'This invite was sent to a different email';
  END IF;
  UPDATE public.invitations SET rejected_at = NOW() WHERE id = inv.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_invitation(p_invite UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org UUID;
BEGIN
  SELECT org_id INTO org FROM public.invitations WHERE id = p_invite AND accepted_at IS NULL AND revoked_at IS NULL;
  IF org IS NULL OR NOT public.is_org_admin(org) THEN
    RAISE EXCEPTION 'Only an owner or admin can revoke this invite';
  END IF;
  UPDATE public.invitations SET revoked_at = NOW() WHERE id = p_invite;
END;
$$;

CREATE OR REPLACE FUNCTION public.resend_invitation(p_invite UUID, p_token_hash TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org UUID;
BEGIN
  SELECT org_id INTO org FROM public.invitations
  WHERE id = p_invite AND accepted_at IS NULL AND revoked_at IS NULL AND rejected_at IS NULL;
  IF org IS NULL OR NOT public.is_org_admin(org) THEN
    RAISE EXCEPTION 'Only an owner or admin can resend this invite';
  END IF;
  UPDATE public.invitations
  SET token_hash = p_token_hash, expires_at = NOW() + INTERVAL '7 days'
  WHERE id = p_invite;
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
    AND m.status = 'active'
    AND o.deleted_at IS NULL
    AND (p_org IS NULL OR m.org_id = p_org)
  ORDER BY m.created_at
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.is_org_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_organization(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_organization(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.soft_delete_organization(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_invitation(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resend_invitation(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.my_organizations()
RETURNS TABLE (
  org_id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  logo_url TEXT,
  role TEXT,
  status TEXT,
  require_mfa BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.name, o.slug, o.description, o.logo_url, m.role, m.status, o.require_mfa
  FROM public.memberships m
  JOIN public.organizations o ON o.id = m.org_id
  WHERE m.user_id = auth.uid()
    AND m.status = 'active'
    AND o.deleted_at IS NULL
  ORDER BY o.created_at;
$$;

GRANT EXECUTE ON FUNCTION public.my_organizations() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_org_member(p_org UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.organizations o ON o.id = m.org_id
    WHERE m.org_id = p_org
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND o.deleted_at IS NULL
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_org_member(UUID) TO authenticated;

DROP POLICY IF EXISTS organizations_select_member ON public.organizations;
CREATE POLICY organizations_select_member ON public.organizations
  FOR SELECT USING (public.is_org_member(id));

DROP POLICY IF EXISTS memberships_select_own_org ON public.memberships;
CREATE POLICY memberships_select_own_org ON public.memberships
  FOR SELECT USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS invitations_select_admin ON public.invitations;
CREATE POLICY invitations_select_admin ON public.invitations
  FOR SELECT USING (public.is_org_admin(org_id));

DROP POLICY IF EXISTS audit_select_admin ON public.audit_events;
CREATE POLICY audit_select_admin ON public.audit_events
  FOR SELECT USING (public.is_org_admin(org_id));

CREATE OR REPLACE FUNCTION public.org_directory(p_org UUID)
RETURNS TABLE(user_id UUID, email TEXT, display_name TEXT, username TEXT, role TEXT, status TEXT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_org_member(p_org) THEN
    RAISE EXCEPTION 'Not a member of this organization';
  END IF;

  RETURN QUERY
  SELECT u.user_id, u.email::text, u.display_name::text, u.username::text, m.role, m.status
  FROM public.memberships m
  JOIN public.users u ON u.user_id = m.user_id
  WHERE m.org_id = p_org
  ORDER BY u.email;
END;
$$;
