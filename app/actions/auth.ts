'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

type AuthResult = { error: string; success?: boolean }

// Helper: extract a guaranteed string message from any thrown value.
// IMPORTANT: re-throw Next.js special signals (redirect, notFound, etc.)
// so they propagate correctly and don't get swallowed as "{}".
function isNextInternalSignal(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const digest = (err as Record<string, unknown>).digest
  if (typeof digest === 'string') {
    return digest.startsWith('NEXT_REDIRECT') || digest.startsWith('NEXT_NOT_FOUND')
  }
  return false
}

function toMessage(err: unknown): string {
  if (isNextInternalSignal(err)) throw err          // let Next.js handle it
  if (typeof err === 'string' && err) return err
  if (err instanceof Error && err.message) return err.message
  return 'Something went wrong. Please try again.'
}

// ---------------------------------------------------------------------------
// Turnstile server-side verification
// ---------------------------------------------------------------------------
async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY ?? '',
      response: token,
    })
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Sign In — returns result, caller redirects
// ---------------------------------------------------------------------------
export async function signInUser(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email    = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    const turnstileToken = formData.get('cf-turnstile-token') as string

    if (!email || !password)
      return { error: 'Email and password are required.' }

    if (!turnstileToken) return { error: 'Turnstile verification is required.' }
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) return { error: 'Turnstile verification failed. Please try again.' }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      console.error('[signInUser] Supabase error object:', error)
      const msg = error.message === '{}' || !error.message 
        ? 'Could not connect to the authentication server. Please check your network or try again later.' 
        : error.message
      return { error: msg }
    }

    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    console.error('[signInUser]', err)
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Sign Up — returns result, caller redirects
// ---------------------------------------------------------------------------
export async function signUpUser(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email    = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    const username = (formData.get('username') as string)?.trim()
    const turnstileToken = formData.get('cf-turnstile-token') as string

    if (!email || !password || !username)
      return { error: 'All fields are required.' }
    if (password.length < 8)
      return { error: 'Password must be at least 8 characters.' }

    if (!turnstileToken) return { error: 'Turnstile verification is required.' }
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) return { error: 'Turnstile verification failed. Please try again.' }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scanwithveritas.tech'}/auth/confirmed`,
      },
    })

    if (error) {
      console.error('[signUpUser] Supabase error object:', error)
      const msg = error.message === '{}' || !error.message 
        ? 'Could not connect to the authentication server. Please check your network or try again later.' 
        : error.message
      return { error: msg }
    }

    // When email confirmation is enabled, Supabase does NOT error on a
    // duplicate email (to prevent enumeration). It instead returns a user
    // with an empty `identities` array. Detect that and surface a clear error.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      return { error: 'An account with this email already exists. Please sign in instead.' }
    }

    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    console.error('[signUpUser]', err)
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Request password reset — emails a recovery code
// ---------------------------------------------------------------------------
export async function requestPasswordReset(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    if (!email) return { error: 'Email address is required.' }

    const supabase = await createClient()
    const { data: exists, error: dbError } = await supabase.rpc('user_email_exists', {
      p_email: email,
    })

    if (dbError) {
      console.error('[requestPasswordReset] DB lookup error:', dbError)
      return { error: 'Could not send a reset code. Please try again later.' }
    }

    if (exists) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scanwithveritas.tech'
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/confirm?next=/auth/reset-password`,
      })
      if (error) {
        console.error('[requestPasswordReset] Supabase error object:', error)
        return { error: 'Could not send a reset code. Please try again later.' }
      }
    }

    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    console.error('[requestPasswordReset]', err)
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Step 1: check the emailed code once and keep the recovery session.
// ---------------------------------------------------------------------------
export async function verifyResetCode(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const code = (formData.get('code') as string)?.replace(/\s/g, '') ?? ''

    if (!email) return { error: 'Email address is required.' }
    if (!/^\d{6,10}$/.test(code))
      return { error: 'Enter the verification code from your email.' }

    const supabase = await createClient()
    const verified = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery',
    })
    if (verified.error) {
      console.error('[verifyResetCode] verifyOtp:', verified.error.message)
      return { error: 'That code is invalid or has expired. Request a new one.' }
    }

    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    console.error('[verifyResetCode]', err)
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Step 2: set the password on the open recovery session. A mismatch does
// not require the code again.
// ---------------------------------------------------------------------------
export async function finishPasswordReset(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
    const password = formData.get('password') as string
    const confirm = formData.get('confirmPassword') as string

    if (!password || !confirm)
      return { error: 'Please enter and confirm your new password.' }
    if (password.length < 8)
      return { error: 'Choose a password with at least 8 characters.' }
    if (password !== confirm)
      return { error: 'Those passwords do not match. Enter the same password in both fields.' }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return { error: 'Your reset session expired. Request a new code.' }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error('[finishPasswordReset] updateUser:', error.message)
      return { error: 'Could not update your password. Try again with a different password.' }
    }

    await supabase.auth.signOut()
    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    console.error('[finishPasswordReset]', err)
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Update password — used by the reset-password page after a recovery session
// has been established.
// ---------------------------------------------------------------------------
export async function updatePassword(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
    const password = formData.get('password') as string
    const confirm = formData.get('confirmPassword') as string

    if (!password || !confirm)
      return { error: 'Please enter and confirm your new password.' }
    if (password.length < 8)
      return { error: 'Password must be at least 8 characters.' }
    if (password !== confirm)
      return { error: 'Passwords do not match.' }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return { error: 'Your reset link has expired. Please request a new one.' }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error('[updatePassword] Supabase error object:', error)
      const msg = error.message === '{}' || !error.message
        ? 'Could not update your password. Please try again later.'
        : error.message
      return { error: msg }
    }

    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    console.error('[updatePassword]', err)
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Sign In with OAuth provider (Google / GitHub)
// ---------------------------------------------------------------------------
export async function signInWithProvider(
  provider: 'google' | 'github',
  flow: 'signin' | 'signup' = 'signup'
): Promise<void> {
  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scanwithveritas.tech'
  const queryParams: Record<string, string> = {}
  if (provider === 'google') {
    queryParams.prompt = 'select_account'
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${siteUrl}/auth/callback?flow=${flow}`,
      queryParams,
    },
  })

  if (error || !data.url) {
    redirect(
      `/auth?error=${encodeURIComponent(error?.message ?? 'OAuth initialization failed')}`
    )
  }

  redirect(data.url)
}

// ---------------------------------------------------------------------------
// Attach Google or GitHub to the account that is already signed in.
// ---------------------------------------------------------------------------
export async function linkProvider(formData: FormData): Promise<void> {
  const provider = formData.get('provider')
  if (provider !== 'google' && provider !== 'github') {
    redirect('/account/security')
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scanwithveritas.tech'
  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      redirectTo: `${siteUrl}/auth/callback?flow=link`,
    },
  })

  if (error || !data?.url) {
    redirect(
      `/account/security?error=${encodeURIComponent(error?.message ?? 'Could not connect that sign-in method.')}`
    )
  }

  redirect(data.url)
}

export async function setAccountPassword(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
    const password = formData.get('password') as string
    const confirm = formData.get('confirmPassword') as string

    if (!password || !confirm)
      return { error: 'Please enter and confirm a password.' }
    if (password.length < 8)
      return { error: 'Password must be at least 8 characters.' }
    if (password !== confirm)
      return { error: 'Passwords do not match.' }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: 'Sign in before setting a password.' }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { error: error.message || 'Could not set your password.' }
    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Sign Out
// ---------------------------------------------------------------------------
export async function signOutUser(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth')
}
