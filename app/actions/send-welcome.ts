'use server'

import { sendWelcomeEmail } from "@/lib/welcome-email"

export async function sendWelcomeAction(data: {
  email: string
  username: string
  method: "Email & Password" | "Google" | "GitHub"
}) {
  try {
    await sendWelcomeEmail(data)
    return { ok: true }
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send email" }
  }
}
