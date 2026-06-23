'use client'

import { useActionState, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signInUser, signInWithProvider } from '@/app/actions/auth'

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
const initialState = { error: null }

// ---------------------------------------------------------------------------
// OAuth error surfaced from URL ?error= param (needs Suspense boundary)
// ---------------------------------------------------------------------------
function OAuthErrorBanner() {
  const params = useSearchParams()
  const err = params.get('error')
  if (!err) return null
  return (
    <div className="auth-error" role="alert">
      <span className="auth-error__icon" aria-hidden={true}>⚠</span>
      {decodeURIComponent(err)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Google SVG icon
// ---------------------------------------------------------------------------
const GoogleIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden={true}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

// ---------------------------------------------------------------------------
// GitHub SVG icon
// ---------------------------------------------------------------------------
const GitHubIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden={true}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

// ---------------------------------------------------------------------------
// Login Page
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInUser, initialState)

  // Separate transitions for each OAuth provider — independent loading states
  const [googlePending, startGoogle] = useTransition()
  const [githubPending, startGitHub] = useTransition()

  function handleOAuth(provider: 'google' | 'github') {
    if (provider === 'google') {
      startGoogle(() => signInWithProvider('google'))
    } else {
      startGitHub(() => signInWithProvider('github'))
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb--top" aria-hidden={true} />
      <div className="auth-orb auth-orb--bottom" aria-hidden={true} />

      <div className="auth-card">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="auth-card__header">
          <div className="auth-logo" aria-label="VERITAS">
            <span className="auth-logo__icon">⬡</span>
            <span className="auth-logo__text">VERITAS</span>
          </div>
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to your VERITAS workspace</p>
        </div>

        {/* ── OAuth error from redirect ───────────────────────── */}
        <Suspense>
          <OAuthErrorBanner />
        </Suspense>

        {/* ── OAuth buttons ───────────────────────────────────── */}
        <div className="auth-oauth-group">
          <button
            id="login-google"
            type="button"
            disabled={googlePending || githubPending}
            onClick={() => handleOAuth('google')}
            className="auth-oauth-btn"
          >
            {googlePending
              ? <span className="auth-btn__spinner" aria-hidden={true} />
              : GoogleIcon}
            <span>{googlePending ? 'Redirecting…' : 'Google'}</span>
          </button>

          <button
            id="login-github"
            type="button"
            disabled={googlePending || githubPending}
            onClick={() => handleOAuth('github')}
            className="auth-oauth-btn"
          >
            {githubPending
              ? <span className="auth-btn__spinner" aria-hidden={true} />
              : GitHubIcon}
            <span>{githubPending ? 'Redirecting…' : 'GitHub'}</span>
          </button>
        </div>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div className="auth-divider">
          <span className="auth-divider__line" />
          <span className="auth-divider__label">or continue with email</span>
          <span className="auth-divider__line" />
        </div>

        {/* ── Email / Password form ────────────────────────────── */}
        <form action={formAction} className="auth-form" noValidate>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden={true}>✉</span>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <Link href="/forgot-password" className="auth-link auth-link--small">
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden={true}>🔒</span>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Your password"
                required
                className="auth-input"
              />
            </div>
          </div>

          {/* Error */}
          {state?.error && (
            <div className="auth-error" role="alert">
              <span className="auth-error__icon" aria-hidden={true}>⚠</span>
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={isPending}
            className="auth-btn"
          >
            {isPending && <span className="auth-btn__spinner" aria-hidden={true} />}
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* ── Footer ──────────────────────────────────────────── */}
        <p className="auth-card__footer">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="auth-link">Create one</Link>
        </p>
      </div>

      <style>{authStyles}</style>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .auth-page {
    font-family: 'Inter', system-ui, sans-serif;
    min-height: 100vh;
    background: #080b14;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .auth-orb {
    position: absolute; border-radius: 50%;
    filter: blur(120px); pointer-events: none; z-index: 0;
  }
  .auth-orb--top {
    width: 500px; height: 500px; top: -200px; right: -100px;
    background: radial-gradient(circle, rgba(99,102,241,.35) 0%, transparent 70%);
  }
  .auth-orb--bottom {
    width: 400px; height: 400px; bottom: -150px; left: -100px;
    background: radial-gradient(circle, rgba(16,185,129,.25) 0%, transparent 70%);
  }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 20px; padding: 2.5rem;
    backdrop-filter: blur(16px);
    box-shadow: 0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04) inset;
    animation: card-in .5s cubic-bezier(.22,1,.36,1) both;
    display: flex; flex-direction: column; gap: 1.25rem;
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Header */
  .auth-card__header { text-align: center; }
  .auth-logo { display: inline-flex; align-items: center; gap: .5rem; margin-bottom: 1rem; }
  .auth-logo__icon {
    font-size: 1.5rem;
    background: linear-gradient(135deg, #6366f1, #10b981);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .auth-logo__text { font-size: 1.125rem; font-weight: 700; letter-spacing: .12em; color: #fff; }
  .auth-card__title { font-size: 1.5rem; font-weight: 700; color: #f8fafc; margin: 0 0 .25rem; }
  .auth-card__subtitle { font-size: .875rem; color: #94a3b8; margin: 0; }

  /* OAuth */
  .auth-oauth-group { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .auth-oauth-btn {
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    padding: .6875rem 1rem;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 10px; color: #e2e8f0;
    font-family: inherit; font-size: .875rem; font-weight: 500;
    cursor: pointer; width: 100%;
    transition: background .2s, border-color .2s, transform .15s;
  }
  .auth-oauth-btn:hover:not(:disabled) {
    background: rgba(255,255,255,.1);
    border-color: rgba(255,255,255,.2);
    transform: translateY(-1px);
  }
  .auth-oauth-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* Divider */
  .auth-divider { display: flex; align-items: center; gap: .75rem; }
  .auth-divider__line { flex: 1; height: 1px; background: rgba(255,255,255,.08); }
  .auth-divider__label { font-size: .75rem; color: #475569; white-space: nowrap; }

  /* Form */
  .auth-form { display: flex; flex-direction: column; gap: 1rem; }
  .auth-field { display: flex; flex-direction: column; gap: .375rem; }
  .auth-label-row { display: flex; align-items: center; justify-content: space-between; }
  .auth-label { font-size: .8125rem; font-weight: 500; color: #cbd5e1; letter-spacing: .02em; }

  .auth-input-wrap { position: relative; display: flex; align-items: center; }
  .auth-input-icon {
    position: absolute; left: .875rem; font-size: .875rem;
    color: #475569; pointer-events: none; line-height: 1;
  }
  .auth-input {
    width: 100%; padding: .75rem .875rem .75rem 2.5rem;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; color: #f1f5f9; font-size: .9375rem;
    font-family: inherit; outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .auth-input::placeholder { color: #475569; }
  .auth-input:focus {
    border-color: #6366f1; background: rgba(99,102,241,.08);
    box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  }

  /* Error */
  .auth-error {
    display: flex; align-items: center; gap: .5rem;
    padding: .75rem 1rem;
    background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25);
    border-radius: 10px; color: #fca5a5; font-size: .875rem;
    animation: shake .4s ease;
  }
  .auth-error__icon { font-size: 1rem; flex-shrink: 0; }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-4px); }
    40%,80%  { transform: translateX(4px); }
  }

  /* Primary button */
  .auth-btn {
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    padding: .8125rem 1.5rem;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none; border-radius: 10px; color: #fff;
    font-family: inherit; font-size: .9375rem; font-weight: 600;
    cursor: pointer; letter-spacing: .01em;
    transition: opacity .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(99,102,241,.35);
  }
  .auth-btn:hover:not(:disabled) {
    opacity: .9; transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(99,102,241,.45);
  }
  .auth-btn:active:not(:disabled) { transform: translateY(0); }
  .auth-btn:disabled { opacity: .45; cursor: not-allowed; }

  /* Spinner */
  .auth-btn__spinner {
    display: inline-block;
    width: 16px; height: 16px; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin .65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Footer */
  .auth-card__footer { text-align: center; font-size: .875rem; color: #64748b; }
  .auth-link { color: #818cf8; font-weight: 500; text-decoration: none; transition: color .15s; }
  .auth-link--small { font-size: .8125rem; }
  .auth-link:hover { color: #a5b4fc; text-decoration: underline; }
`
