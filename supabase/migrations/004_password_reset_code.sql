-- Lets the forgot-password page check an address before sending a code,
-- without the service-role key.

CREATE OR REPLACE FUNCTION public.user_email_exists(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE lower(email) = lower(btrim(p_email))
  );
$$;

REVOKE ALL ON FUNCTION public.user_email_exists(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.user_email_exists(TEXT) TO anon, authenticated;
