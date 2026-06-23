'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ---------------------------------------------------------------------------
// Cloudflare Turnstile server-side verification
// ---------------------------------------------------------------------------
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY is not configured.')
  if (!token) return false

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    }
  )

  if (!res.ok) return false
  const data = await res.json()
  return data.success === true
}

// ---------------------------------------------------------------------------
// Sign Up (Email / Password)
// ---------------------------------------------------------------------------
export async function signUpUser(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const token    = formData.get('cf-turnstile-response') as string
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const username = (formData.get('username') as string)?.trim()

  const ok = await verifyTurnstile(token)
  if (!ok) return { error: 'Bot verification failed. Please try again.' }

  if (!email || !password || !username)
    return { error: 'All fields are required.' }

  if (password.length < 8)
    return { error: 'Password must be at least 8 characters.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })

  if (error) return { error: error.message }
  redirect('/auth/verify-email')
}

// ---------------------------------------------------------------------------
// Sign In (Email / Password)
// ---------------------------------------------------------------------------
export async function signInUser(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const token    = formData.get('cf-turnstile-response') as string
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  const ok = await verifyTurnstile(token)
  if (!ok) return { error: 'Bot verification failed. Please try again.' }

  if (!email || !password)
    return { error: 'Email and password are required.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/dashboard')
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
      redirectTo: 'http://localhost:3000/auth/callback',
    },
  })

  if (error || !data.url) {
    redirect(
      `/login?error=${encodeURIComponent(error?.message ?? 'OAuth initialization failed')}`
    )
  }

  // Send browser to the OAuth provider (Google or GitHub)
  redirect(data.url)
}
