import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendWelcomeEmail } from '@/lib/welcome-email'

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
  const flow = searchParams.get('flow')  // 'signin' | 'signup' | null

  // Guard: no code means the user denied access or hit this URL directly
  if (!code) {
    return NextResponse.redirect(
      new URL('/auth?error=Authentication+was+cancelled+or+denied', origin)
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(
      new URL(
        `/auth?error=${encodeURIComponent(error.message)}`,
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

  // ── Sign-in flow check: reject new users trying to sign in ─────────
  if (flow === 'signin' && user && user.user_metadata?.onboarded !== true) {
    // Clear session first so the redirect doesn't carry auth cookies
    await supabase.auth.signOut()

    // Clean up the auth user if service role key is available
    try {
      const admin = createAdminClient()
      await admin.auth.admin.deleteUser(user.id)
    } catch {
      // orphan is harmless — no session means they see the error page
    }

    return NextResponse.redirect(
      new URL('/auth?error=' + encodeURIComponent(
        'No account found with this provider. Please sign up first.'
      ), origin)
    )
  }

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

    // Send welcome email to OAuth users (non-blocking)
    const provider = user.app_metadata?.provider as string | undefined
    const method = provider === 'github' ? 'GitHub' as const : 'Google' as const
    const uname =
      (user.user_metadata?.username as string) ??
      user.email?.split('@')[0] ??
      'there'

    sendWelcomeEmail({
      email: user.email!,
      username: uname,
      method,
    }).catch((e) => console.error('[auth/callback] welcome email error:', e))
  }

  // Session set — redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', origin))
}
