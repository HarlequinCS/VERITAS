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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/confirmed`,
      },
    })

    if (error) {
      console.error('[signUpUser] Supabase error object:', error)
      const msg = error.message === '{}' || !error.message 
        ? 'Could not connect to the authentication server. Please check your network or try again later.' 
        : error.message
      return { error: msg }
    }

    return { error: '', success: true }
  } catch (err) {
    if (isNextInternalSignal(err)) throw err
    console.error('[signUpUser]', err)
    return { error: toMessage(err) }
  }
}

// ---------------------------------------------------------------------------
// Sign In with OAuth provider (Google / GitHub)
// ---------------------------------------------------------------------------
export async function signInWithProvider(
  provider: 'google' | 'github'
): Promise<void> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
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
// Sign Out
// ---------------------------------------------------------------------------
export async function signOutUser(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth')
}
