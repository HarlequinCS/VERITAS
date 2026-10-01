-- Profile fields. Role stays on public.users until memberships exist,
-- but a signed-in user can no longer change it.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT,
  ADD COLUMN IF NOT EXISTS locale TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

UPDATE public.users
SET display_name = username
WHERE display_name IS NULL AND username IS NOT NULL;

CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_role text;
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    jwt_role := COALESCE(auth.jwt() ->> 'role', '');
    IF jwt_role IS DISTINCT FROM 'service_role' THEN
      RAISE EXCEPTION 'Profile updates cannot change role';
    END IF;
  END IF;

  IF NEW.display_name IS NOT NULL AND btrim(NEW.display_name) <> '' THEN
    NEW.username := btrim(NEW.display_name);
    NEW.display_name := btrim(NEW.display_name);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_prevent_role_change ON public.users;
CREATE TRIGGER users_prevent_role_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_change();
