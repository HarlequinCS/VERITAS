import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | VERITAS',
    default: 'Auth | VERITAS',
  },
  description: 'Secure access to the VERITAS Web Vulnerability Scanner.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-shell">
      {children}
    </div>
  )
}
