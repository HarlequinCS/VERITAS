'use server'

import { createClient } from '@/utils/supabase/server'

type ProfileResult = { error?: string; success?: boolean } | null

const VALID_ROLES = ['Analyst', 'Lead', 'Developer']

export async function updateProfile(
  _prevState: ProfileResult,
  formData: FormData,
): Promise<ProfileResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated.' }

  const username = (formData.get('username') as string)?.trim()
  const role = formData.get('role') as string

  if (!username) return { error: 'Display name is required.' }
  if (!VALID_ROLES.includes(role)) return { error: 'Invalid role selection.' }

  const { data: updated, error: dbErr } = await supabase
    .from('users')
    .update({ username, role })
    .eq('user_id', user.id)
    .select('user_id')

  if (dbErr) return { error: dbErr.message }
  if (!updated || updated.length === 0)
    return { error: 'Profile could not be saved. Please try again.' }

  const { error: metaErr } = await supabase.auth.updateUser({
    data: { onboarded: true },
  })

  if (metaErr) return { error: metaErr.message }
  return { success: true }
}
