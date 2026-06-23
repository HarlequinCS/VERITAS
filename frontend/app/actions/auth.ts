'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ---------------------------------------------------------------------------
// Sign Up (Email / Password)
// ---------------------------------------------------------------------------
export async function signUpUser(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const username = (formData.get('username') as string)?.trim()

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
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

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
