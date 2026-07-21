import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Auth confirmation handler for email-link flows (currently password recovery).
 *
 * Supabase emails a link that lands here with either:
 *   - `?code=...`              (PKCE flow — exchange for a session), or
 *   - `?token_hash=...&type=…` (older OTP flow — verify the token).
 *
 * The code/token MUST be exchanged server-side because the PKCE code verifier
 * lives in an httpOnly cookie set when the reset email was requested.
 * After establishing the session we redirect to `next` (e.g. /auth/reset-password).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, origin))
    console.error('[auth/confirm] exchangeCodeForSession error:', error.message)
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(new URL(next, origin))
    console.error('[auth/confirm] verifyOtp error:', error.message)
  }

  // Failed or missing token — bounce back with a clear message.
  return NextResponse.redirect(
    new URL(
      '/forgot-password?error=Reset+link+is+invalid+or+has+expired.+Please+request+a+new+one.',
      origin
    )
  )
}
