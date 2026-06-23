import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * OAuth callback handler.
 *
 * Supabase redirects here after the user authorises with Google / GitHub.
 * The URL contains a `code` query param which we exchange for a session.
 * After exchange we verify the user row exists in public.users (the
 * handle_new_user() trigger should have inserted it) and then redirect
 * to /dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Guard: no code means the user denied access or hit this URL directly
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=Authentication+was+cancelled+or+denied', origin)
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message)}`,
        origin
      )
    )
  }

  // ---------------------------------------------------------------------------
  // Verify the user row exists in public.users.
  // The Supabase trigger handle_new_user() should have inserted it
  // automatically; we upsert defensively in case the trigger is ever
  // disabled or races.
  // ---------------------------------------------------------------------------
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: existing } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!existing) {
      const derivedUsername =
        (user.user_metadata?.username as string | undefined) ??
        user.email?.split('@')[0] ??
        'user'

      const { error: insertErr } = await supabase.from('users').insert({
        user_id: user.id,
        email: user.email,
        username: derivedUsername,
        role: 'Analyst',
      })

      if (insertErr) {
        console.error('[auth/callback] users insert fallback error:', insertErr.message)
      }
    }
  }

  // Session set — redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', origin))
}
