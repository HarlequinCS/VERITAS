import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify your email | VERITAS',
}

export default function VerifyEmailPage() {
  return (
    <main
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        minHeight: '100vh',
        background: '#080b14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: '100%',
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(255,255,255,.09)',
          borderRadius: 20,
          padding: '2.5rem',
          textAlign: 'center',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 24px 64px rgba(0,0,0,.5)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
        <h1 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 .75rem' }}>
          Check your inbox
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '.9375rem', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
          We sent a verification link to your email address. Click it to activate your VERITAS account.
        </p>
        <Link
          href="/login"
          style={{
            display: 'inline-block',
            padding: '.75rem 2rem',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            borderRadius: 10,
            color: '#fff',
            fontWeight: 600,
            fontSize: '.9375rem',
            textDecoration: 'none',
          }}
        >
          Back to login
        </Link>
      </div>
    </main>
  )
}
