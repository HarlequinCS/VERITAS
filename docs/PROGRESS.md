# VERITAS Project Progress

Last updated: 2026-06-21

---

## Project Architecture

VERITAS is a Web Vulnerability Scanner SaaS platform built as a Next.js monorepo with a Python FastAPI backend.

| Layer | Stack | Path |
|---|---|---|
| **Root App** | Next.js 15 + React 19 + Tailwind CSS 3 | `/` |
| **Frontend App** | Next.js 15 + React 19 + Tailwind CSS 3 (auth-focused) | `/frontend/` |
| **Backend API** | FastAPI + SQLAlchemy + psycopg2 | `/backend/` |
| **Database** | Supabase PostgreSQL + Auth | Cloud-hosted |

---

## 1. Authentication System (Root App — `/`)

### 1.1 Server Actions (`app/actions/auth.ts`)
| Action | Status | Details |
|---|---|---|
| `verifyTurnstile` | Done | Cloudflare Turnstile server-side verification |
| `signUpUser` | Done | Email/Password + username metadata + Turnstile validation |
| `signInUser` | Done | Email/Password + Turnstile validation |
| `signInWithProvider` | Done | Google/GitHub OAuth with `redirectTo: /auth/callback` |
| `signOutUser` | Done | Supabase signOut + redirect to `/auth` |

### 1.2 Auth Pages & Routes
| Route | File | Status | Features |
|---|---|---|---|
| `/auth` | `app/auth/page.tsx` | Done | Login form (email/password) + Google/GitHub OAuth buttons + Turnstile |
| `/register` | `app/register/page.tsx` | Done | Registration form with email, username, password + Turnstile + brand panel |
| `/auth/callback` | `app/auth/callback/route.ts` | Done | OAuth code exchange + **defensive user row verification** + fallback insert |
| `/forgot-password` | `app/forgot-password/page.tsx` | Exists | Layout placeholder |

### 1.3 Middleware (`middleware.ts`)
- Session refresh via Supabase SSR client
- Route protection: redirects unauthenticated users from `/dashboard`, `/scans`, etc. to `/auth`
- Redirects `/login` → `/auth`
- Redirects logged-in users away from `/auth` and `/register` → `/dashboard`

---

## 2. Authentication System (Frontend App — `/frontend/`)

A parallel auth implementation exists in `/frontend/` for development/testing purposes. It mirrors the root app auth system with the same Server Actions, pages, and callback logic. This is excluded from the root `tsconfig.json` to prevent build conflicts.

---

## 3. Database & Supabase Integration

### 3.1 Supabase Auth Configuration
- Project URL: `https://umcaodwuytmlmpfjttfk.supabase.co`
- SSR client configured with cookie-based session management (`@supabase/ssr`)
- Environment variables in `.env.local` (gitignored)

### 3.2 Database Trigger (`supabase/triggers.sql`)
Created and deployed:
```sql
-- handle_new_user() trigger on auth.users AFTER INSERT
-- Auto-creates public.users row with:
--   user_id  → new.id
--   email    → new.email
--   username → COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1))
--   role     → 'Analyst' (hardcoded default)
```

### 3.3 Defensive Callback Fallback (`app/auth/callback/route.ts`)
If the trigger ever misses (disabled, race condition), the OAuth callback:
1. Exchanges code for session
2. Queries `public.users` to verify row exists
3. If missing, inserts fallback row with same logic as trigger
4. Redirects to `/dashboard`

### 3.4 Users Table Schema (`public.users`)
| Column | Type | Notes |
|---|---|---|
| `user_id` | UUID PK | References `auth.users(id)` ON DELETE CASCADE |
| `email` | TEXT NOT NULL | From auth user |
| `username` | TEXT NOT NULL | From form metadata or derived from email prefix |
| `role` | TEXT NOT NULL DEFAULT 'Analyst' | All new users get 'Analyst' |
| `created_at` | TIMESTAMPTZ | Auto-set to NOW() |

RLS is enabled on the table.

---

## 4. Backend API (`/backend/`)

| File | Purpose | Status |
|---|---|---|
| `main.py` | FastAPI app with health check (`/`) and DB test (`/test-db`) | Done |
| `database.py` | SQLAlchemy engine, session factory, `get_db()` dependency | Done |
| `worker.py` | Async scan worker (Celery/Redis placeholder) | Skeleton |
| `.env` | DATABASE_URL for Supabase connection | Done |

### Endpoints
- `GET /` — Health check
- `GET /test-db` — Database connectivity test (executes `SELECT NOW()`)

---

## 5. Marketing & Landing Pages

### 5.1 Pages (`app/(marketing)/`)
| Route | Status | Description |
|---|---|---|
| `/` (Home) | Done | Hero section, feature pillars, product preview, how-it-works, CTA, footer |
| `/features` | Exists | Feature detail page |
| `/contact` | Exists | Contact page |
| `/blog` | Exists | Blog listing |

### 5.2 App Shell (`app/(app)/`)
| Route | Status | Description |
|---|---|---|
| `/dashboard` | Exists | Main dashboard layout |
| `/account` | Exists | Account settings |
| `/notifications` | Exists | Notifications page |

---

## 6. Design System & Components

### 6.1 Tailwind Configuration (`tailwind.config.ts`)
Custom design tokens:
- **Colors**: `veritas-bg`, `veritas-surface`, `veritas-electric`, `veritas-arc`, severity scale
- **Fonts**: Inter (body), Orbitron (display), JetBrains Mono (terminal), Share Tech Mono (labels)
- **Animations**: `pulse-electric`, `scanline`, `drift-grid`, `fade-up`, `glitch`, `ticker`
- **Shadows**: `glow-electric`, `glow-arc`, `glow-danger`, `card`

### 6.2 Global Styles (`app/globals.css`)
- Dark theme by default (`color-scheme: dark`)
- Ambient radial gradient backgrounds
- Custom scrollbar styling
- Glassmorphism utilities (`.glass`, `.glass-strong`, `.glass-nav`)
- Grid background pattern (`.grid-bg`)

### 6.3 Reusable Components (`/components/`)
| Component | Purpose | Status |
|---|---|---|
| `brand-logo.tsx` | VERITAS logo with variants | Done |
| `universal-navbar.tsx` | Top navigation with auth state | Done |
| `hero-section.tsx` | Landing page hero | Done |
| `hero-globe.tsx` | 3D globe visualization | Done |
| `feature-pillars.tsx` | 3-column feature grid | Done |
| `how-it-works.tsx` | 3-step process flow | Done |
| `social-proof.tsx` | Testimonials / trust signals | Done |
| `cta-banner.tsx` | Call-to-action section | Done |
| `site-footer.tsx` | Multi-column footer | Done |
| `command-bar.tsx` | Global search/command palette | Done |
| `primary-sidebar.tsx` | Dashboard sidebar navigation | Done |
| `live-terminal.tsx` | Animated terminal output | Done |
| `scan-session-table.tsx` | Scan results data table | Done |
| `security-score-ring.tsx` | Risk score gauge | Done |
| `severity-badge.tsx` | Severity level badges | Done |
| `threat-heatmap.tsx` | Threat visualization | Done |
| `owasp-distribution.tsx` | OWASP category chart | Done |
| `ai-assistant-dock.tsx` | AI chat interface | Done |
| `agent-status-grid.tsx` | Agent health monitoring | Done |
| `diff-viewer.tsx` | Code diff for patches | Done |
| `poc-viewer.tsx` | Proof-of-concept display | Done |
| `telemetry-strip.tsx` | Live metrics ticker | Done |
| `live-activity-rail.tsx` | Activity feed sidebar | Done |
| `phase-tracker.tsx` | Scan phase progress | Done |
| `patch-terminal.tsx` | Patch application log | Done |
| `http-trace-feed.tsx` | HTTP request log viewer | Done |
| `stat-card.tsx` | KPI metric cards | Done |
| `report-top-bar.tsx` | Report page header | Done |
| `launch-dashboard-cta.tsx` | Dashboard entry CTA | Done |
| `mock-auth-provider.tsx` | Auth context provider | Done |
| `product-preview.tsx` | Dashboard screenshot preview | Done |

---

## 7. API Routes (`app/api/`)

| Route | Status | Description |
|---|---|---|
| `/api/threat-map` | Exists | Threat intelligence map data endpoint |

---

## 8. Completed This Session (2026-06-21)

### Auth System Hardening
- [x] Verified `signUpUser` passes `username` in `options.data` metadata
- [x] Verified `signInWithProvider` uses correct `redirectTo: /auth/callback`
- [x] Created `supabase/triggers.sql` with `handle_new_user()` trigger
- [x] Deployed trigger to Supabase project (`umcaodwuytmlmpfjttfk`)
- [x] Updated root `app/auth/callback/route.ts` with defensive user row verification
- [x] Updated frontend `frontend/app/auth/callback/route.ts` with same defensive logic
- [x] Verified registration form has correct `name` attributes: `email`, `username`, `password`
- [x] Verified login page has Google/GitHub OAuth buttons wired to `signInWithProvider`
- [x] Verified Turnstile integration on both login and register pages

### Database Schema Alignment (Normalized Schema)
- [x] Rewrote `supabase/triggers.sql` with full normalized schema from `database.md`
  - `target_applications`, `scan_sessions`, `detected_vulnerabilities`
  - `simulation_payload`, `execution_traces`, `ai_analysis_log`
  - `remediation_patches`, `remediation_tickets`
  - RLS policies on all core tables
- [x] Fixed `scan_sessions.scan_mode` missing column with `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- [x] Dropped old `public.scans` table (replaced by normalized tables)

### Frontend Data Fetching (Real Data)
- [x] `app/(app)/dashboard/page.tsx` — async Server Component
  - Fetches user profile from `public.users`
  - Fetches scan sessions joined with `target_applications`
  - Fetches severity counts from `detected_vulnerabilities`
  - Computes duration from `start_time` / `end_time`
  - Aggregates OWASP category distribution for `OwaspDistribution`
  - Passes real data to `ScanSessionTable`, `StatCard`, `OwaspDistribution`
  - Empty state CTA when no scans exist
- [x] `components/scan-session-table.tsx` — accepts typed `sessions` prop, renders empty state
- [x] `components/owasp-distribution.tsx` — accepts optional `data` prop, falls back to placeholder
- [x] `app/(app)/scans/live/page.tsx` — async Server Component
  - Fetches latest `scan_sessions` joined with `target_applications`
  - Displays real target URL, session ID, and scan status
- [x] `app/(app)/reports/page.tsx` — fetches real severity counts from `detected_vulnerabilities`
  - Dynamic findings list in report preview
  - Executive summary shows real critical/high counts

### User Profile & Logout
- [x] `app/(app)/layout.tsx` — async layout fetches real user profile (`username`, `role`)
- [x] `components/command-bar.tsx` — accepts `username`/`role` props, replaces hardcoded "Maya Khoury"
- [x] `app/(app)/account/page.tsx` — async Server Component, shows real username, role, email
- [x] Added Log Out buttons to CommandBar (top-right header) and Account page
- [x] Wired logout to `signOutUser` server action

### TypeScript & Build
- [x] Fixed TypeScript errors with Supabase nested selects (array extraction)
- [x] TypeScript compiles cleanly (`npx tsc --noEmit`)
- [x] Cleaned `.next` build cache to resolve runtime bundling issues

---

## 9. Pending Work / Next Steps

### High Priority
- [ ] **Fix OAuth callback runtime error**: `Cannot read properties of undefined (reading 'call')` in `utils/supabase/server.ts` when OAuth callback fires (clear `.next` cache and restart dev server)
- [ ] **Verify end-to-end auth flow**: Register with email → verify email → login → check `public.users` row
- [ ] **Test OAuth flow**: Sign in with Google/GitHub → verify `public.users` row created → redirect to `/dashboard`
- [ ] **Enable OAuth providers in Supabase Dashboard**: Configure Google and GitHub client IDs/secrets
- [ ] **Whitelist redirect URLs in Supabase**: Add `http://localhost:3000/auth/callback`

### Medium Priority
- [ ] **Backend integration**: Connect FastAPI endpoints to frontend for scan orchestration
- [ ] **User role management**: Admin interface for upgrading users from `Analyst` to `Admin`
- [ ] **Forgot password flow**: Implement `/forgot-password` page with Supabase password reset
- [ ] **Email verification page**: Complete `/auth/verify-email` page styling
- [ ] **ThreatHeatmap real data**: Currently deterministic mock; wire to `detected_vulnerabilities` severity over time
- [ ] **LiveActivityRail real data**: Currently hardcoded items; wire to `execution_traces` or scan events
- [ ] **AgentStatusGrid real data**: Currently hardcoded metrics; wire to backend worker health

### Low Priority / Future
- [ ] **Scan worker (Python)**: Implement actual vulnerability scanning logic in `backend/worker.py`
- [ ] **Real-time updates**: Supabase Realtime for live scan status
- [ ] **Billing integration**: Stripe for subscription tiers (Analyst / Operator / Commander)
- [ ] **Team/Organization support**: Multi-tenant workspace model

---

## How to Run

### Root App (Primary)
```bash
cd c:\laragon\www\mockupveritas
npm run dev
# Runs on http://localhost:3000
```

### Frontend App (Secondary)
```bash
cd c:\laragon\www\mockupveritas\frontend
npm run dev
# Runs on http://localhost:3001 (if 3000 is in use)
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
| `http://localhost:3000/auth` | Login |
| `http://localhost:3000/register` | Register |
| `http://localhost:3000/dashboard` | Dashboard (protected) |
| `http://localhost:3000/` | Landing page |

