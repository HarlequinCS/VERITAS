'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUpUser } from '@/app/actions/auth'

const initialState = { error: null }

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpUser, initialState)

  return (
    <main className="auth-page">
      {/* Background glow orbs */}
      <div className="auth-orb auth-orb--top" aria-hidden={true} />
      <div className="auth-orb auth-orb--bottom" aria-hidden={true} />

      <div className="auth-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-logo" aria-label="VERITAS">
            <span className="auth-logo__icon">⬡</span>
            <span className="auth-logo__text">VERITAS</span>
          </div>
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">
            Start scanning. No credit card required.
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="auth-form" noValidate>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden={true}>✉</span>
              <input
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                className="auth-input"
              />
            </div>
          </div>

          {/* Username */}
          <div className="auth-field">
            <label htmlFor="reg-username" className="auth-label">Username</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden={true}>@</span>
              <input
                id="reg-username"
                type="text"
                name="username"
                autoComplete="username"
                placeholder="yourhandle"
                required
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden={true}>🔒</span>
              <input
                id="reg-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
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
            type="submit"
            disabled={isPending}
            className="auth-btn"
          >
            {isPending ? (
              <span className="auth-btn__spinner" aria-hidden={true} />
            ) : null}
            {isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>

      <style>{authStyles}</style>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Inline styles (scoped to this page; no Tailwind dependency)
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

  /* Glow orbs */
  .auth-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .auth-orb--top {
    width: 500px; height: 500px;
    top: -200px; right: -100px;
    background: radial-gradient(circle, rgba(99,102,241,.35) 0%, transparent 70%);
  }
  .auth-orb--bottom {
    width: 400px; height: 400px;
    bottom: -150px; left: -100px;
    background: radial-gradient(circle, rgba(16,185,129,.25) 0%, transparent 70%);
  }

  /* Card */
  .auth-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 20px;
    padding: 2.5rem;
    backdrop-filter: blur(16px);
    box-shadow: 0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04) inset;
    animation: card-in .5s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Logo */
  .auth-card__header { text-align: center; margin-bottom: 2rem; }
  .auth-logo {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: 1.25rem;
  }
  .auth-logo__icon {
    font-size: 1.5rem;
    background: linear-gradient(135deg, #6366f1, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .auth-logo__text {
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: .12em;
    color: #fff;
  }
  .auth-card__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f8fafc;
    margin: 0 0 .375rem;
  }
  .auth-card__subtitle {
    font-size: .875rem;
    color: #94a3b8;
    margin: 0;
  }

  /* Form */
  .auth-form { display: flex; flex-direction: column; gap: 1.125rem; }

  .auth-field { display: flex; flex-direction: column; gap: .375rem; }
  .auth-label { font-size: .8125rem; font-weight: 500; color: #cbd5e1; letter-spacing: .02em; }

  .auth-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .auth-input-icon {
    position: absolute;
    left: .875rem;
    font-size: .875rem;
    color: #475569;
    pointer-events: none;
    line-height: 1;
  }
  .auth-input {
    width: 100%;
    padding: .75rem .875rem .75rem 2.5rem;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px;
    color: #f1f5f9;
    font-size: .9375rem;
    font-family: inherit;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .auth-input::placeholder { color: #475569; }
  .auth-input:focus {
    border-color: #6366f1;
    background: rgba(99,102,241,.08);
    box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  }

  /* Error */
  .auth-error {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .75rem 1rem;
    background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.25);
    border-radius: 10px;
    color: #fca5a5;
    font-size: .875rem;
    animation: shake .4s ease;
  }
  .auth-error__icon { font-size: 1rem; flex-shrink: 0; }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-4px); }
    40%,80%  { transform: translateX(4px); }
  }

  /* Button */
  .auth-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    padding: .8125rem 1.5rem;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: inherit;
    font-size: .9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(99,102,241,.35);
    letter-spacing: .01em;
    margin-top: .25rem;
  }
  .auth-btn:hover:not(:disabled) {
    opacity: .9;
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(99,102,241,.45);
  }
  .auth-btn:active:not(:disabled) { transform: translateY(0); }
  .auth-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  /* Spinner */
  .auth-btn__spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .65s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Footer */
  .auth-card__footer {
    text-align: center;
    margin: 1.5rem 0 0;
    font-size: .875rem;
    color: #64748b;
  }
  .auth-link { color: #818cf8; font-weight: 500; text-decoration: none; transition: color .15s; }
  .auth-link:hover { color: #a5b4fc; text-decoration: underline; }
`
