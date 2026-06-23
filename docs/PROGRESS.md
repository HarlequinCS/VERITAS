# VERITAS Project Progress

Last updated: 2026-06-23

---

## Project Architecture

VERITAS is a Web Vulnerability Scanner SaaS platform built as a Next.js monorepo with a Python FastAPI backend.

| Layer | Stack | Path |
|---|---|---|
| **Root App** | Next.js 15 + React 19 + Tailwind CSS 3 | `/` |
| **Frontend App** | Next.js 15 + React 19 (auth-focused, secondary) | `/frontend/` |
| **Backend API** | FastAPI + SQLAlchemy + psycopg2 | `/backend/` |
| **Database** | Supabase PostgreSQL + Auth | Cloud-hosted |
| **Email** | Nodemailer + Mailgun SMTP (`smtp.mailgun.org:587`) | `lib/mailer.ts` |

---

## 1. Routes & Pages (26 total)

### 1.1 Landing / Marketing (`app/(marketing)/`)

| Route | File | Type | Status |
|---|---|---|---|
| `/` | `page.tsx` | Server | Done — Hero with 3D Earth globe (Globe.gl), CISA KEV threat arcs, feature pillars, product preview, how-it-works, social proof, CTA, footer |
| `/features/[slug]` | `features/[slug]/page.tsx` | Server (dynamic) | Done — Static content per slug |
| `/pricing` | `pricing/page.tsx` | Server | Done — Tiered cards (Analyst / Operator / Commander) |
| `/blog` | `blog/page.tsx` | Server | Done — Blog listing layout |
| `/contact` | `contact/page.tsx` | Server | Done — Contact form layout |
| `/security` | `security/page.tsx` | Server | Done — Static security page |
| `/status` | `status/page.tsx` | Server | Done — Service status page |

### 1.2 Auth (`app/auth/`)

| Route | File | Type | Status |
|---|---|---|---|
| `/auth` | `page.tsx` | Client | Done — Login form (email/password) + Google/GitHub OAuth + SSO |
| `/register` | (root `register/page.tsx`) | Client | Done — Registration (email, username, password) |
| `/auth/callback` | `callback/route.ts` | Route handler | Done — OAuth code exchange + defensive users row insert + welcome email |
| `/auth/confirmed` | `confirmed/page.tsx` | Client | Done — Post-email-confirmation page, sends welcome email |
| `/auth/verify-email` | `verify-email/page.tsx` | Server | Done — Informational page after registration |
| `/forgot-password` | (root `forgot-password/page.tsx`) | Server | Done — Password reset layout |

### 1.3 Authenticated App (`app/(app)/`)

| Route | File | Type | Status |
|---|---|---|---|
| `/dashboard` | `dashboard/page.tsx` | Server | **Done** — Real data from users, scan_sessions, detected_vulnerabilities. Profile setup form for new users (onboarded check). OwaspDistribution, ScanSessionTable, ThreatHeatmap, AgentStatusGrid |
| `/account` | `account/page.tsx` | Server | Done — Displays real username, role, email from public.users |
| `/scans/live` | `scans/live/page.tsx` | Server | Done — Live scan monitor with real data |
| `/targets/new` | `targets/new/page.tsx` | Client | Done — New target setup form |
| `/vulnerabilities/[id]` | `vulnerabilities/[id]/page.tsx` | Server (dynamic) | Done — Vulnerability detail page |
| `/reports` | `reports/page.tsx` | Client | Done — Report builder with real severity counts |
| `/report` | (root `report/page.tsx`) | Server | Done — Single report view |
| `/tickets` | `tickets/page.tsx` | Server | Done — Remediation tickets layout |
| `/notifications` | `notifications/page.tsx` | Server | Done — Notifications page |
| `/settings` | `settings/page.tsx` | Server | Done — Workspace settings |
| `/founder/ops` | (root `founder/ops/page.tsx`) | Client | Done — **Hidden** founder admin console: server monitoring, token/rate usage, platform health, scan throughput chart |

### 1.4 API Routes

| Route | File | Status | Description |
|---|---|---|---|
| `/api/threat-map` | `api/threat-map/route.ts` | Done | CISA KEV proxy with 1-hour revalidation; fallback to mock data |

---

## 2. Authentication System

### 2.1 Server Actions (`app/actions/`)

| Action | File | Status | Details |
|---|---|---|---|
| `signUpUser` | `auth.ts` | Done | Email/password + username metadata; emailRedirectTo → `/auth/confirmed` |
| `signInUser` | `auth.ts` | Done | Email/password; returns `{ success: true }` — client calls `router.push("/dashboard")` |
| `signInWithProvider` | `auth.ts` | Done | Google/GitHub OAuth with `redirectTo: /auth/callback` |
| `signOutUser` | `auth.ts` | Done | `supabase.auth.signOut()` + redirect to `/auth` |
| `updateProfile` | `profile.ts` | Done | Saves `username` + `role` to `users` table; sets `user_metadata.onboarded = true` |
| `sendWelcomeAction` | `send-welcome.ts` | Done | Wraps `sendWelcomeEmail` for client-side use |

### 2.2 Critical Bug Fix — `redirect()` in `useActionState`

**Root cause:** Next.js `redirect()` throws a special internal error (`NEXT_REDIRECT`). When called inside a server action paired with `useActionState`, React catches this error and surfaces it as an empty object `{}` to the client — causing the auth forms to silently fail with no visible error.

**Fix:** All auth server actions (`signInUser`, `signUpUser`) now return `{ success: true }` instead of calling `redirect()`. The client component checks `state?.success` and calls `router.push()` accordingly.

### 2.3 Middleware (`middleware.ts`)

- Session refresh via Supabase SSR on every request
- Protects: `/dashboard`, `/scans`, `/vulnerabilities`, `/reports`, `/targets`, `/tickets`, `/account`, `/settings`, `/notifications`
- Redirects `/login` → `/auth`
- Redirects authenticated users away from `/auth` and `/register` → `/dashboard`

### 2.4 Turnstile Removal

Cloudflare Turnstile was present on the login and register pages but has been removed from both. Turnstile verification functions remain in `app/actions/auth.ts` but are not called.

### 2.5 OAuth Callback (`app/auth/callback/route.ts`)

1. Exchanges code for session via `exchangeCodeForSession`
2. Verifies user row exists in `public.users` (defensive — trigger may have raced)
3. If missing, inserts fallback row (`user_id`, `email`, `username`, `role: 'Analyst'`)
4. **Sends welcome email** (non-blocking) to OAuth users with provider detection (Google/GitHub)

---

## 3. Database & Supabase Integration

### 3.1 Project Details

- Project URL: `https://umcaodwuytmlmpfjttfk.supabase.co`
- Auth: SSR cookie-based via `@supabase/ssr` v0.12.0
- SMTP: Mailgun custom SMTP (`smtp.mailgun.org:587`) for `scanwithveritas.tech`
  - DNS verified, custom domain active
  - Supabase email confirmation templates branded with dark VERITAS theme
  - `emailRedirectTo` set to `/auth/confirmed`
- Environment: `.env.local` (gitignored) — Supabase keys, Mailgun credentials, NEXT_PUBLIC_SITE_URL

### 3.2 Trigger (`supabase/triggers.sql`)

Full normalized schema deployed:

- **`public.users`** — user_id (UUID PK FK), email, username, role (default 'Analyst'), created_at
- **`target_applications`** — target_id (UUID PK), user_id (FK), target_url, environment, auth_token_config, registered_at
- **`scan_sessions`** — session_id (UUID PK), target_id (FK), scan_status, scan_mode, start_time, end_time, created_at
- **`detected_vulnerabilities`** — vuln_id (UUID PK), session_id (FK), cwe_id, owasp_category, severity_level, endpoint_url, is_false_positive
- **`simulation_payload`**, **`execution_traces`**, **`ai_analysis_log`**, **`remediation_patches`**, **`remediation_tickets`** — full AI pipeline tables

Trigger `handle_new_user()` auto-creates `public.users` row on `auth.users AFTER INSERT`.

### 3.3 Users Table (`public.users`)

| Column | Type | Notes |
|---|---|---|
| `user_id` | UUID PK | References `auth.users(id)` ON DELETE CASCADE |
| `email` | TEXT NOT NULL | From auth user |
| `username` | TEXT NOT NULL | From form metadata or derived from email prefix |
| `role` | TEXT NOT NULL DEFAULT 'Analyst' | Valid values: Analyst, Lead, Developer |
| `created_at` | TIMESTAMPTZ | Auto-set to NOW() |

RLS enabled.

### 3.4 Welcome Email Flow

| Step | Component | Description |
|---|---|---|
| **Email/password sign-up** | `signUpUser` → `/auth/confirmed` | User registers → verification email sent by Supabase → user clicks link → lands on `/auth/confirmed` → welcome email sent via nodemailer |
| **OAuth sign-in** | `/auth/callback/route.ts` | OAuth callback exchanges code → inserts user row → **fire-and-forget** welcome email via nodemailer → redirects to `/dashboard` |

Welcome email features: VERITAS logo PNG, dark theme, mobile-responsive, single CTA button.

---

## 4. Design System

### 4.1 Tailwind Configuration (`tailwind.config.ts`)

- **Colors**: `veritas-bg` (#050B14), `veritas-surface` (#0A1428), `veritas-electric` (#0088FF), `veritas-arc` (#00CCFF), `veritas-spark` (#66D9FF), `veritas-success` (#00CC88), severity scale
- **Fonts**: Inter (body), Orbitron (display), JetBrains Mono (terminal), Share Tech Mono (labels)
- **Animations**: `pulse-electric`, `scanline`, `drift-grid`, `fade-up`, `glitch`, `blink-cursor`, `pulse-ring`, `ticker`, `counter-roll`, `stream-in`
- **Shadows**: `glow-electric`, `glow-arc`, `glow-danger`, `card`
- **Gradients**: `electric-mix` (135deg #0088FF → #00CCFF), `arc-mix` (135deg #00CCFF → #0066FF)

### 4.2 Global Styles (`app/globals.css`)

- Dark theme by default (`color-scheme: dark`)
- Subtle radial gradient ambient backgrounds
- Custom scrollbar
- Glassmorphism utilities: `.glass`, `.glass-strong`, `.glass-nav`
- Grid background pattern: `.grid-bg`
- Scanline overlay: `.scanlines`
- Electric text gradient: `.electric-text`
- Electric glow ring: `.ring-electric`

### 4.3 Components (`/components/` — 32 files)

| Component | Purpose |
|---|---|
| `brand-logo.tsx` | VERITAS logo with nav/hero/header/compact variants |
| `universal-navbar.tsx` | Top navigation with auth state |
| `hero-globe.tsx` | 3D Earth (Globe.gl) with CISA KEV threat arcs, rings, hotspots |
| `hero-section.tsx` | Landing hero with collapsible threat map overlay, stat counters, ticker |
| `feature-pillars.tsx` | 3-column feature grid (Scan / Simulate / Solve) |
| `how-it-works.tsx` | 3-step process flow |
| `social-proof.tsx` | Trust signals / testimonials |
| `product-preview.tsx` | Dashboard screenshot preview with tilt |
| `cta-banner.tsx` | Call-to-action section |
| `site-footer.tsx` | Multi-column footer |
| `command-bar.tsx` | Top bar with breadcrumbs, search, notifications, user menu, logout |
| `primary-sidebar.tsx` | Dashboard sidebar navigation |
| `profile-setup-form.tsx` | First-login profile form: email (read-only), display name, role select |
| `ai-assistant-dock.tsx` | AI chat interface (slide-out panel) |
| `agent-status-grid.tsx` | Agent health monitoring |
| `scan-session-table.tsx` | Scan results table |
| `owasp-distribution.tsx` | OWASP category bar chart |
| `threat-heatmap.tsx` | 12-week threat activity heatmap |
| `live-activity-rail.tsx` | Activity feed sidebar |
| `live-terminal.tsx` | Animated terminal output |
| `stat-card.tsx` | KPI metric cards with sparkline |
| `severity-badge.tsx` | Severity level badges |
| `security-score-ring.tsx` | Risk score gauge |
| `diff-viewer.tsx` | Code diff view for patches |
| `poc-viewer.tsx` | Proof-of-concept display |
| `patch-terminal.tsx` | Patch application log |
| `phase-tracker.tsx` | Scan phase progress indicator |
| `http-trace-feed.tsx` | HTTP request log viewer |
| `report-top-bar.tsx` | Report page header |
| `telemetry-strip.tsx` | Live metrics strip |
| `launch-dashboard-cta.tsx` | Dashboard entry CTA |
| `mock-auth-provider.tsx` | Mock auth context (legacy, still present but unused) |

---

## 5. Backend API (`/backend/`)

| File | Purpose | Status |
|---|---|---|
| `main.py` | FastAPI app with `/` health check and `/test-db` endpoints | Done |
| `database.py` | SQLAlchemy engine + session factory for Supabase PostgreSQL | Done |
| `worker.py` | Celery + Redis placeholder for async scan orchestration | Skeleton |
| `requirements.txt` | fastapi, uvicorn, sqlalchemy, psycopg2-binary, celery, redis, playwright, openai | Done |
| `.env` | DATABASE_URL, REDIS_URL, OPENAI_API_KEY | Done |

---

## 6. Frontend App (`/frontend/`)

Parallel auth implementation for dev/testing. Mirrors root auth with same server actions, pages, and callback logic. Excluded from root `tsconfig.json`.

| Route | Status |
|---|---|
| `/` (home) | Placeholder |
| `/login` | Done |
| `/register` | Done |
| `/auth/callback` | Done |
| `/auth/verify-email` | Done |

---

## 7. Build Status

- Next.js 15.5.15 with Webpack
- 26 routes (17 static, 9 dynamic)
- 0 TypeScript errors
- 0 ESLint errors
- Pre-existing warning: `@supabase/supabase-js` uses `process.version` which is unsupported in Edge Runtime (harmless — middleware works correctly)

---

## 8. Completed This Session (2026-06-23)

### Auth Hardening & Email
- [x] Removed Cloudflare Turnstile from login and register pages
- [x] Fixed `{}` error bug: replaced `redirect()` in `useActionState` actions with `{ success: true }` + `router.push()`
- [x] Configured Mailgun SMTP for `scanwithveritas.tech` (DNS verified, custom domain active)
- [x] Updated Supabase email confirmation template with branded dark VERITAS HTML
- [x] Installed nodemailer + `@types/nodemailer`
- [x] Created `lib/mailer.ts` with Mailgun SMTP transporter
- [x] Created `lib/welcome-email.ts` with branded VERITAS HTML email (logo, dark theme, responsive)
- [x] Created `app/auth/confirmed/page.tsx` — post-email-confirmation landing that sends welcome email
- [x] Updated `signUpUser` to set `emailRedirectTo` to `/auth/confirmed`
- [x] Updated OAuth callback to send welcome email (fire-and-forget) for Google/GitHub sign-ups
- [x] Updated OAuth callback defensive insert to include `role: 'Analyst'`

### Profile Setup Flow
- [x] Created `app/actions/profile.ts` — `updateProfile` server action (saves username + role)
- [x] Created `components/profile-setup-form.tsx` — form with email (read-only), display name, role dropdown (Analyst/Lead/Developer)
- [x] Integrated into dashboard — checks `user.user_metadata?.onboarded`; shows form if not onboarded
- [x] After form submission: saves to `public.users`, sets `onboarded: true`, refreshes dashboard
- [x] Dashboard heading and CommandBar immediately reflect updated username/role

### Welcome Email Redesign
- [x] Replaced verbose feature-grid email with clean, minimal, professional design
- [x] Added VERITAS logo PNG from CDN
- [x] Responsive layout with mobile media query
- [x] Dark theme matching website (bg #050B14, card #0A1428, border #152545)
- [x] Single CTA button with electric gradient
- [x] "Scan · Prove · Patch" tagline in footer

---

## 9. Pending Work / Next Steps

### High Priority
- [ ] **End-to-end auth test**: Register → verify email → receive welcome email → login → profile setup → dashboard
- [ ] **OAuth test**: Google/GitHub sign-in → welcome email → profile setup → dashboard
- [ ] **Enable OAuth providers in Supabase Dashboard**: Configure Google and GitHub client IDs/secrets
- [ ] **Whitelist OAuth redirect URLs in Supabase**: Add `http://localhost:3000/auth/callback`

### Medium Priority
- [ ] **Backend integration**: Wire FastAPI endpoints to frontend for scan orchestration
- [ ] **ThreatHeatmap real data**: Currently deterministic mock; wire to `detected_vulnerabilities`
- [ ] **LiveActivityRail real data**: Currently hardcoded; wire to `execution_traces`
- [ ] **AgentStatusGrid real data**: Currently hardcoded; wire to backend worker health
- [ ] **Supabase Realtime**: Live scan status updates via Realtime subscriptions

### Low Priority / Future
- [ ] **Scan worker (Python)**: Implement Playwright-based vulnerability scanning in `backend/worker.py`
- [ ] **AI remediation pipeline**: Multi-agent GPT-4o loop for patch generation
- [ ] **Stripe billing**: Subscription tiers (Analyst / Operator / Commander)
- [ ] **Team/Organization**: Multi-tenant workspace model
- [ ] **Forgot password**: Wire Supabase password reset flow
- [ ] **Dark theme email for Supabase auth emails**: All transactional emails (password reset, etc.) should match brand

---

## How to Run

### Root App (Primary)
```bash
cd c:\laragon\www\mockupveritas
npm run dev
# http://localhost:3000
```

### Frontend App (Secondary)
```bash
cd c:\laragon\www\mockupveritas\frontend
npm run dev
# http://localhost:3001
```

### Backend API
```bash
cd c:\laragon\www\mockupveritas\backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Key URLs
| URL | Page |
|---|---|
| `http://localhost:3000` | Landing page |
| `http://localhost:3000/auth` | Login |
| `http://localhost:3000/register` | Register |
| `http://localhost:3000/dashboard` | Dashboard (protected) |
| `http://localhost:3000/founder/ops` | Founder console (hidden) |
