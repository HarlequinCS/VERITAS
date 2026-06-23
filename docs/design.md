# VERITAS: SCAN. SIMULATE. SOLVE.
### Design Document — SaaS Platform for Enterprise Security Teams
**Version 1.0 | Confidential**

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Design Philosophy](#2-design-philosophy)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Design System — Components](#5-design-system--components)
6. [Page Layouts](#6-page-layouts)
   - [Landing Page](#61-landing-page)
   - [Dashboard / App UI](#62-dashboard--app-ui)
   - [Pricing Page](#63-pricing-page)
   - [Blog / Threat Intel Feed](#64-blog--threat-intel-feed)
7. [Animation & Motion](#7-animation--motion)
8. [Iconography & Imagery](#8-iconography--imagery)
9. [Responsive Behavior](#9-responsive-behavior)
10. [Accessibility](#10-accessibility)
11. [Tech Stack Recommendations](#11-tech-stack-recommendations)

---

## 1. Brand Identity

### Name
**VERITAS** — Latin for *truth*. The platform surfaces truth from noise: real threats, real vulnerabilities, real solutions.

### Tagline
> **SCAN. SIMULATE. SOLVE.**

### Brand Voice
- Authoritative, precise, minimal
- No marketing fluff — speaks like a senior security engineer
- Terminal-first: communicate in commands, not slogans
- Trust through confidence, not hype

### Logo Concept
- Monogram mark: `V` constructed from two diagonal scan lines forming a downward chevron, with a subtle pulse ring around it
- Wordmark: `VERITAS` in spaced uppercase `Share Tech Mono`, with a blinking cursor `_` after the final letter in hero contexts
- Lock-up variants: horizontal (nav), stacked (splash), icon-only (favicon, app icon)

---

## 2. Design Philosophy

VERITAS borrows from real Security Operations Centre (SOC) aesthetics — the kind of interface a Tier 3 analyst trusts their life to at 2am. Every design decision must pass this filter:

> *"Would a senior security engineer trust this interface during a live incident?"*

### Core Principles

**Terminal-first**
The UI draws from command-line culture. Monospace type, scanlines, blinking cursors, and status codes are design elements — not decorations.

**Signal over noise**
Enterprise users are alert-fatigued. The design must ruthlessly distinguish critical from informational. Red is sacred — it only appears for real threats.

**Ambient intelligence**
The interface should feel *alive* — subtle animations suggest live data flows, not decoration. Nothing animates without purpose.

**Dark by default**
There is no light mode. SOC environments are dim. Eyes are adapted. Dark mode is not an option — it is the product.

**Precision spacing**
Generous whitespace on a dark background creates focus. Dense but never cluttered.

---

## 3. Color System

### Base Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-base` | `#020809` | Page background |
| `--color-bg-surface` | `#0D1117` | Cards, panels, modals |
| `--color-bg-elevated` | `#161B22` | Dropdowns, tooltips, sidebars |
| `--color-bg-overlay` | `#1C2128` | Hover states, selected rows |
| `--color-border` | `#21262D` | Dividers, card borders |
| `--color-border-subtle` | `#161B22` | Subtle inner borders |

### Accent Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#00FF9C` | Primary CTA, active states, key data |
| `--color-primary-dim` | `#00CC7A` | Hover on primary |
| `--color-primary-glow` | `rgba(0,255,156,0.15)` | Glow shadows, focus rings |
| `--color-secondary` | `#00D4FF` | Secondary actions, links, charts |
| `--color-secondary-glow` | `rgba(0,212,255,0.12)` | Secondary glow effects |
| `--color-threat` | `#FF003C` | Critical threats, errors, alerts |
| `--color-threat-dim` | `rgba(255,0,60,0.15)` | Threat background tint |
| `--color-warning` | `#FF9500` | Medium severity, warnings |
| `--color-warning-dim` | `rgba(255,149,0,0.12)` | Warning background tint |
| `--color-safe` | `#00FF9C` | Cleared/resolved status (same as primary) |
| `--color-neutral` | `#8B949E` | Tertiary text, muted labels |

### Text Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#E6EDF3` | Body text, headings |
| `--color-text-secondary` | `#8B949E` | Subheadings, labels |
| `--color-text-muted` | `#484F58` | Disabled, placeholder text |
| `--color-text-accent` | `#00FF9C` | Highlighted values, active links |
| `--color-text-code` | `#79C0FF` | Inline code, terminal output |

### Semantic Severity Scale

| Level | Color | Label |
|---|---|---|
| CRITICAL | `#FF003C` | Immediate action required |
| HIGH | `#FF6B35` | Urgent |
| MEDIUM | `#FF9500` | Monitor |
| LOW | `#FFD60A` | Informational |
| SAFE | `#00FF9C` | Cleared |
| UNKNOWN | `#8B949E` | Pending scan |

---

## 4. Typography

### Font Stack

| Role | Font | Fallback |
|---|---|---|
| Display / Hero | `Orbitron` | `Share Tech Mono`, monospace |
| UI / Body | `Inter` | `system-ui`, sans-serif |
| Terminal / Code | `JetBrains Mono` | `Fira Code`, `Courier New`, monospace |
| Labels / Caps | `Share Tech Mono` | monospace |

> Load via Google Fonts: `Orbitron:wght@400;700;900`, `Inter:wght@400;500;600`, `JetBrains Mono:wght@400;500`

### Type Scale

| Name | Size | Weight | Font | Usage |
|---|---|---|---|---|
| `display-xl` | 72px / 4.5rem | 900 | Orbitron | Hero headline |
| `display-lg` | 56px / 3.5rem | 700 | Orbitron | Section titles |
| `display-md` | 40px / 2.5rem | 700 | Orbitron | Page headers |
| `heading-lg` | 28px / 1.75rem | 600 | Inter | Card headers |
| `heading-md` | 22px / 1.375rem | 600 | Inter | Sub-headers |
| `heading-sm` | 18px / 1.125rem | 600 | Inter | Widget titles |
| `body-lg` | 16px / 1rem | 400 | Inter | Primary body |
| `body-sm` | 14px / 0.875rem | 400 | Inter | Secondary body |
| `label` | 12px / 0.75rem | 500 | Share Tech Mono | Tags, badges, caps |
| `caption` | 11px / 0.6875rem | 400 | Inter | Tooltips, footnotes |
| `terminal` | 14px / 0.875rem | 400 | JetBrains Mono | Code, logs, commands |
| `terminal-sm` | 12px / 0.75rem | 400 | JetBrains Mono | Inline code, IPs |

### Type Rules

- Line height: `1.6` for body, `1.2` for headings, `1.5` for terminal text
- Letter spacing: `+0.05em` for `label` and uppercase text; `+0.12em` for `display-xl`
- Never use pure white (`#FFFFFF`) — use `--color-text-primary` (`#E6EDF3`)
- Terminal text always uses `--color-text-code` (`#79C0FF`) on dark surface

---

## 5. Design System — Components

### 5.1 Buttons

**Primary Button**
```
Background:   var(--color-primary)           #00FF9C
Text:         #020809  (dark on bright)
Border:       none
Border-radius: 2px  (sharp, not soft — military feel)
Padding:       12px 28px
Font:          Share Tech Mono, 13px, 500, letter-spacing 0.08em, UPPERCASE
Box-shadow:   0 0 16px rgba(0,255,156,0.35)

Hover:         background #00CC7A, box-shadow intensified
Active:        background #009959, scale(0.98)
Disabled:      opacity 0.3, cursor not-allowed
```

**Secondary Button**
```
Background:    transparent
Text:          var(--color-primary)
Border:        1px solid var(--color-primary)
Border-radius: 2px
Padding:       11px 27px
Box-shadow:    none

Hover:         background var(--color-primary-glow)
```

**Danger Button**
```
Background:    transparent
Text:          var(--color-threat)
Border:        1px solid var(--color-threat)
Border-radius: 2px

Hover:         background var(--color-threat-dim)
```

**Ghost / Terminal Button**
```
Background:    var(--color-bg-elevated)
Text:          var(--color-text-secondary)
Border:        1px solid var(--color-border)
Font:          JetBrains Mono

Hover:         border-color var(--color-secondary), text var(--color-secondary)
```

---

### 5.2 Cards

**Base Card**
```
Background:    var(--color-bg-surface)  #0D1117
Border:        1px solid var(--color-border)  #21262D
Border-radius: 4px
Padding:       24px
Box-shadow:    0 1px 3px rgba(0,0,0,0.4)

Hover (if interactive):
  border-color: var(--color-secondary)
  box-shadow:   0 0 20px rgba(0,212,255,0.08)
```

**Threat Card (active incident)**
```
Border-left:   3px solid var(--color-threat)
Background:    linear-gradient(to right, var(--color-threat-dim), var(--color-bg-surface))
Animation:     subtle pulse on left border
```

**Stat/Metric Card**
```
Layout:        vertical, label on top, large number below
Label:         Share Tech Mono, 11px, --color-text-secondary, UPPERCASE
Value:         Orbitron, 36px, 700, --color-primary or --color-text-primary
Sub-label:     Inter, 12px, --color-text-muted (e.g. "vs last 30 days +12%")
```

**Terminal Card**
```
Background:    #010506
Border:        1px solid var(--color-border)
Border-radius: 4px
Font:          JetBrains Mono
Header bar:    var(--color-bg-elevated) with 3 dot controls (red, yellow, green)
Content:       --color-text-code, line-height 1.6
Cursor:        blinking █ at end of last line
```

---

### 5.3 Badges & Status Indicators

**Severity Badge**
```
Shape:         pill (border-radius: 999px)
Padding:       3px 10px
Font:          Share Tech Mono, 10px, 600, UPPERCASE, letter-spacing 0.1em
Variants:
  CRITICAL  → background rgba(255,0,60,0.15),   text #FF003C,  border 1px solid rgba(255,0,60,0.4)
  HIGH      → background rgba(255,107,53,0.12), text #FF6B35,  border 1px solid rgba(255,107,53,0.35)
  MEDIUM    → background rgba(255,149,0,0.12),  text #FF9500,  border 1px solid rgba(255,149,0,0.3)
  LOW       → background rgba(255,214,10,0.10), text #FFD60A,  border 1px solid rgba(255,214,10,0.3)
  SAFE      → background rgba(0,255,156,0.10),  text #00FF9C,  border 1px solid rgba(0,255,156,0.3)
  UNKNOWN   → background rgba(139,148,158,0.1), text #8B949E,  border 1px solid rgba(139,148,158,0.3)
```

**Live Pulse Indicator**
```
Shape:         8px circle
Color:         var(--color-threat) for active incidents, var(--color-primary) for live/connected
Animation:     keyframe scale 1→1.4→1, opacity 1→0, infinite 1.2s ease-out
Usage:         next to "LIVE", "SCANNING", "CONNECTED" labels
```

**Status Dot Row**
```
Layout:        horizontal, dot + label
Dot size:      6px
Colors:        match severity scale above
Font:          Share Tech Mono, 11px
```

---

### 5.4 Navigation

**Top Navigation Bar**
```
Height:        60px
Background:    var(--color-bg-base) with bottom border 1px var(--color-border)
Blur effect:   backdrop-filter: blur(8px) — sticky position
Layout:        [Logo] ··· [Nav links] ··· [Search] [Notifications] [User Avatar]

Nav links:
  Font:        Share Tech Mono, 12px, UPPERCASE, letter-spacing 0.08em
  Default:     --color-text-secondary
  Hover:       --color-text-primary, underline in --color-secondary
  Active:      --color-primary
  
Notification bell:
  Badge:       var(--color-threat), white number, 10px
```

**Sidebar (Dashboard)**
```
Width:         240px (collapsed: 64px)
Background:    var(--color-bg-surface)
Border-right:  1px solid var(--color-border)

Section headers:
  Font:        Share Tech Mono, 10px, --color-text-muted, UPPERCASE
  Margin:      24px top

Nav items:
  Height:      40px, padding 0 16px
  Icon:        20px, left-aligned
  Font:        Inter, 14px
  Default:     --color-text-secondary
  Hover:       --color-bg-overlay, --color-text-primary
  Active:      left border 2px --color-primary, background var(--color-primary-glow)
  
Collapsed:     icons only, tooltip on hover
```

---

### 5.5 Data Tables

```
Header row:
  Background:  var(--color-bg-elevated)
  Font:        Share Tech Mono, 11px, --color-text-muted, UPPERCASE, letter-spacing 0.08em
  Border-bottom: 1px solid var(--color-border)

Body rows:
  Background:  transparent
  Font:        Inter, 14px, --color-text-primary
  Border-bottom: 1px solid var(--color-border) at opacity 0.5
  Hover:       background var(--color-bg-overlay)
  
  Critical row highlight:
    Background: var(--color-threat-dim)
    Left border: 2px solid var(--color-threat)

Pagination:
  Font:        Share Tech Mono, 12px
  Controls:    ghost buttons with secondary color
  
Column types:
  IP addresses:   JetBrains Mono, --color-text-code
  Timestamps:     JetBrains Mono, --color-text-muted
  Severity:       badge component
  Actions:        icon buttons (ghost)
```

---

### 5.6 Forms & Inputs

**Text Input**
```
Background:    var(--color-bg-elevated)
Border:        1px solid var(--color-border)
Border-radius: 2px
Padding:       10px 14px
Font:          Inter, 14px, --color-text-primary
Placeholder:   --color-text-muted

Focus:
  border-color: var(--color-secondary)
  box-shadow:   0 0 0 3px rgba(0,212,255,0.12)
  outline:      none

Error:
  border-color: var(--color-threat)
  box-shadow:   0 0 0 3px rgba(255,0,60,0.12)
```

**Terminal Input (command prompt)**
```
Background:    #010506
Font:          JetBrains Mono, 14px, --color-text-code
Prefix:        "VERITAS@SOC:~$ " in --color-primary
Border:        none, bottom-only 1px --color-border
Cursor:        blinking | caret
```

**Toggle / Switch**
```
Off:  background var(--color-border), knob #8B949E
On:   background var(--color-primary), knob #020809
Size: 40px × 22px
Animation: smooth 150ms ease
```

---

### 5.7 Charts & Data Visualization

**General Rules**
- Always use dark surfaces: no white chart backgrounds
- Primary data series: `--color-primary` (#00FF9C)
- Secondary series: `--color-secondary` (#00D4FF)
- Warning series: `#FF9500`
- Critical/alert series: `#FF003C`
- Grid lines: `--color-border` at opacity 0.4, dashed
- Axis labels: Share Tech Mono, 10px, `--color-text-muted`
- Tooltips: card component with terminal font for values

**Line Chart (Threat Activity Over Time)**
```
Line:        2px stroke, --color-primary
Area fill:   gradient from rgba(0,255,156,0.2) to transparent
Data points: 4px circles, filled on hover
Glow:        filter: drop-shadow(0 0 4px rgba(0,255,156,0.6)) on line
```

**Radial / Gauge (Risk Score)**
```
Track:       var(--color-bg-elevated), full circle
Fill:        arc from 0 to value, color based on severity
Value text:  Orbitron, 48px, center
Label:       Share Tech Mono, 11px, --color-text-secondary
```

**Bar Chart (Attack Vectors)**
```
Bars:        2px rounded tops, color-coded by category
Spacing:     20% gap between bars
Hover:       brightness 120%, tooltip
```

---

### 5.8 Toast Notifications & Alerts

**Toast**
```
Position:      top-right, 16px from edge
Width:         360px
Background:    var(--color-bg-elevated)
Border-left:   3px solid (severity color)
Border-radius: 2px
Padding:       14px 16px
Font:          Inter, 13px
Animation:     slide in from right, auto-dismiss 5s with progress bar
```

**Banner Alert (top of page)**
```
Full-width strip:
  CRITICAL → background var(--color-threat), text #020809, blinking left indicator
  WARNING  → background var(--color-warning), text #020809
  INFO     → background var(--color-secondary), text #020809
```

---

### 5.9 Modal / Drawer

**Modal**
```
Overlay:       rgba(2,8,9,0.85), backdrop-blur(4px)
Panel:         var(--color-bg-surface), border 1px var(--color-border)
Border-radius: 4px
Max-width:     600px (default), 900px (wide)
Header:        border-bottom 1px var(--color-border), Orbitron heading
Footer:        border-top 1px var(--color-border), right-aligned actions
Animation:     scale 0.95→1 + fade in, 200ms ease
```

**Drawer (Side Panel)**
```
Width:         480px
Side:          right
Background:    var(--color-bg-surface)
Border-left:   1px solid var(--color-border)
Animation:     slide in from right, 250ms ease
Overlay:       same as modal
```

---

## 6. Page Layouts

### 6.1 Landing Page

The landing page is a full-immersion experience. It must communicate capability, trust, and power in under 5 seconds.

---

#### Section 1 — Hero (Full Viewport)

```
Layout:       100vw × 100vh, dark bg, overflow hidden
Background:   --color-bg-base with subtle matrix-rain canvas layer (opacity 0.04)
              Subtle radial gradient: rgba(0,255,156,0.04) from center
```

**Top Navigation (fixed)**
- Logo left, links center: PLATFORM / FEATURES / PRICING / BLOG
- Right: `REQUEST DEMO` (primary button), `SIGN IN` (ghost)
- Background: transparent → `var(--color-bg-base)` on scroll with blur

**Globe (center-left, 55% viewport)**
- 3D rotating globe using Three.js or Globe.gl
- Earth rendered as dark topography mesh (`#0D1117` land, `#020809` ocean)
- Neon green glowing nodes at major threat source cities (Moscow, Beijing, Tehran, São Paulo, Bucharest, etc.)
- Animated arc beams connecting nodes — threat traffic visualization
- User can click to rotate, scroll to zoom
- Pulsing rings radiate outward from hotspot nodes
- Atmosphere glow: faint cyan rim light

**Hero Copy (center-right)**
```
Tag:           [ ▸ LIVE THREAT INTELLIGENCE ] — Share Tech Mono, blinking dot
Headline:      VERITAS
               Orbitron, 72px, 900 weight
               Each letter animates in with glitch effect on load
               
Tagline:       SCAN. SIMULATE. SOLVE.
               Share Tech Mono, 20px, letter-spacing 0.25em, --color-primary
               
Body:          "The enterprise-grade cybersecurity platform that finds your 
                vulnerabilities before adversaries do."
               Inter, 18px, --color-text-secondary, max-width 480px
               
CTA row:       [START FREE TRIAL] [WATCH DEMO ▸]
               
Proof stat row:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  4.2M+          850+          99.7%
  Threats        Enterprise    Uptime SLA
  Neutralized    Clients
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  (counter animation on scroll into view)
```

**Ticker bar (bottom of hero)**
```
Full-width scrolling marquee, Share Tech Mono, 11px, --color-text-muted
Content: live-style threat feed
"[ CVE-2024-4993 ] CRITICAL ▸ RCE vulnerability in OpenSSH ···  [ 14:32:07 UTC ] 
 New C2 beacon detected · Origin: AS15169 ··· [ ALERT ] Ransomware group ALPHV 
 targeting financial sector ···"
```

---

#### Section 2 — Feature Pillars (3 columns)

Centered layout, 3-column grid on desktop, stacked on mobile.

```
Section header:
  Label:     [ CORE CAPABILITIES ] — Share Tech Mono, --color-primary
  Title:     "Three modules. One mission."  — Orbitron, 40px
  
Column 1: SCAN
  Icon:       Animated radar sweep SVG, --color-primary
  Headline:   "Discover every attack surface"
  Body:       Real-time asset discovery, port scanning, CVE correlation, 
              cloud-native coverage across AWS / Azure / GCP.
  Link:       LEARN MORE → with underline animate

Column 2: SIMULATE
  Icon:       Animated branching attack-path SVG, --color-secondary
  Headline:   "Attack yourself before they do"
  Body:       Automated red team simulations. MITRE ATT&CK mapped. 
              Breach-and-attack simulation without agent installation.
  Badge:      [ NEW ] in --color-primary

Column 3: SOLVE
  Icon:       Animated checkmark resolving an alert, --color-safe
  Headline:   "Remediate with precision"
  Body:       AI-prioritized fix recommendations. Ticket auto-creation in 
              Jira / ServiceNow. SLA tracking. Compliance reporting.
```

---

#### Section 3 — Product Preview (Dashboard Teaser)

Full-width dark section with a floating, tilted dashboard screenshot or live interactive mockup.

```
Layout:         centered with 2 floating side cards (depth effect)
Main panel:     screenshot of Dashboard UI with scanline overlay
                slight 3D tilt: rotateX(8deg) rotateY(-5deg) on load
                hover: straightens to rotateX(0) rotateY(0) — parallax
Side cards:     
  Left:  Threat Alert card (Critical, floating, slight shadow)
  Right: Scan Complete card (100%, --color-primary pulse)
  
Section copy above:
  "A command centre built for your team."
  Sub: "One pane of glass. Every asset. Every threat. Every fix."
```

---

#### Section 4 — How It Works (3-step flow)

```
Layout:     horizontal stepper on desktop, vertical on mobile

Step 1:  CONNECT
  Icon:    cloud plug connector
  Text:    "Connect your environment in under 10 minutes. 
            Agentless. API-first."

Step 2:  SCAN & SIMULATE  
  Icon:    scanning pulse
  Text:    "VERITAS maps your attack surface and runs continuous simulations."

Step 3:  PRIORITIZE & FIX
  Icon:    targeted crosshair resolving to checkmark
  Text:    "AI ranks findings by real exploitability. Your team 
            fixes what actually matters."

Connector line between steps:
  Style:  dashed, animated dash-offset, --color-border
  Nodes:  small circles at each step junction
```

---

#### Section 5 — Social Proof / Trust Rail

```
Logo marquee:  scrolling row of enterprise customer logos 
               (greyscale, opacity 0.5 → full on hover)
               Separated by thin vertical dividers

Testimonial card:
  Quote:     "VERITAS found a critical RCE in our production environment 
              that our previous vendor missed for 8 months."
  Name:      [Name], CISO — [Fortune 500 Company]
  Design:    terminal card style, quote in --color-text-code
```

---

#### Section 6 — CTA Banner

```
Background:   subtle neon green radial gradient on dark
Headline:     "Every second you wait, attackers aren't."
Sub:          "Deploy VERITAS across your environment today."
CTA:          [ REQUEST ENTERPRISE DEMO ]  [ TALK TO SALES ]
```

---

#### Section 7 — Footer

```
Layout:       4-column grid
Col 1:        Logo + tagline + social icons (LinkedIn, Twitter/X, GitHub)
Col 2:        Platform → Features, Pricing, Changelog, Status
Col 3:        Resources → Blog, Threat Intel, Docs, API Reference
Col 4:        Company → About, Careers, Security, Contact

Bottom bar:   © 2025 VERITAS Inc. · Privacy Policy · Terms of Service
              Right-aligned: SOC 2 Type II | ISO 27001 | GDPR badges

Font:         Inter, 13px
Background:   var(--color-bg-surface), top border 1px var(--color-border)
```

---

### 6.2 Dashboard / App UI

The dashboard is the heart of the product. It's where analysts live.

---

#### Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  TOPBAR (60px)  — Logo, Global Search, Alerts, User  │
├───────────┬──────────────────────────────────────────┤
│           │  HEADER BAR — Breadcrumb, Page title,   │
│ SIDEBAR   │  date range, Export, Action buttons      │
│ (240px)   ├──────────────────────────────────────────┤
│           │                                          │
│ Collapsed │   MAIN CONTENT AREA                      │
│ → 64px    │   (scrollable)                           │
│           │                                          │
└───────────┴──────────────────────────────────────────┘
```

#### Sidebar Sections
```
OVERVIEW
  ▸ Command Centre
  ▸ Threat Map

SCAN
  ▸ Asset Inventory
  ▸ Scan Scheduler
  ▸ Findings

SIMULATE
  ▸ Attack Simulations
  ▸ Red Team Reports
  ▸ ATT&CK Coverage

SOLVE
  ▸ Remediation Queue
  ▸ Tickets
  ▸ SLA Tracker

COMPLIANCE
  ▸ Reports
  ▸ Frameworks

SETTINGS
  ▸ Integrations
  ▸ Team & Access
  ▸ Audit Log
```

---

#### Command Centre (Home Dashboard)

**Row 1 — KPI Strip (4 stat cards)**
```
[  4,291        ]  [  127 CRITICAL   ]  [  98.4%      ]  [  14:32        ]
[  Assets Live  ]  [  Open Findings  ]  [  Coverage   ]  [  Scan: ACTIVE ]
```

**Row 2 — Threat Activity Chart (wide) + Risk Score Gauge (narrow)**
```
Left (8/12):   Line chart — Threat detections over last 30 days
               Toggle: 7D / 30D / 90D / Custom

Right (4/12):  Radial gauge — Overall Risk Score: 72/100
               Color: MEDIUM (#FF9500)
               Below gauge: breakdown by category
```

**Row 3 — Active Incidents Table + Top Attack Vectors**
```
Left (7/12):   Incidents table
               Columns: Severity | Asset | CVE | Detected | Status | Actions
               Rows color-coded by severity
               Live blinking dot on CRITICAL rows

Right (5/12):  Horizontal bar chart — Attack vectors
               SQL Injection ████████████ 34%
               Phishing     ████████     24%
               Brute Force  ██████       18%
               ...
```

**Row 4 — Recent Scan Activity + Terminal Log**
```
Left (6/12):   Scan activity feed (card list)
               Each item: [scan type] [asset] [result badge] [time ago]

Right (6/12):  Live log terminal
               Background #010506, JetBrains Mono
               Auto-scrolling with pause on hover
               Color-coded log levels:
                 [INFO]     → --color-text-muted
                 [SUCCESS]  → --color-primary
                 [WARNING]  → --color-warning
                 [CRITICAL] → --color-threat
```

---

#### Findings Page

Full-width data table with advanced filters.

```
Filter bar (top):
  Dropdowns: Severity | Asset Type | CVE Status | Date Range | Team
  Search:    "Search CVE, asset, IP..." — terminal input style

Table:
  Columns: # | Severity | CVE ID | Asset | Description | CVSS | Discovered | Status | Assignee
  Row actions: View | Assign | Suppress | Create Ticket
  
Detail drawer (right panel, 480px):
  CVE details, CVSS breakdown, affected assets, recommended fix, 
  references, exploit availability indicator, 
  "GENERATE TICKET" CTA
```

---

### 6.3 Pricing Page

SOC-inspired tiered pricing with "clearance level" naming convention.

---

#### Pricing Header
```
Label:    [ ACCESS TIERS ]
Title:    "Choose Your Clearance Level"
Toggle:   [ MONTHLY ]  [ ANNUAL — SAVE 20% ]
Sub:      "All plans include SOC 2 Type II certified infrastructure."
```

---

#### Pricing Tiers (3-column cards)

**TIER 1 — ANALYST**
```
Tag:       Entry Level
Price:     $299 / month (per organization, up to 500 assets)
Color:     --color-secondary
Features:
  ✓ Asset Discovery (up to 500)
  ✓ Continuous Vulnerability Scanning
  ✓ CVE Correlation
  ✓ Dashboard & Reporting
  ✓ Email Alerts
  ✓ 5 User Seats
  ✗ Attack Simulation
  ✗ Red Team Reports
  ✗ Custom Integrations
CTA:       [ START FREE TRIAL ]
```

**TIER 2 — OPERATOR** *(Recommended — highlighted)*
```
Tag:       Most Popular
Price:     $899 / month (up to 2,000 assets)
Color:     --color-primary
Badge:     [ RECOMMENDED ] in --color-primary
Border:    glow box-shadow in --color-primary-glow
Features:
  ✓ Everything in ANALYST
  ✓ Attack Simulations (unlimited)
  ✓ MITRE ATT&CK Mapping
  ✓ Red Team Reports
  ✓ Jira / ServiceNow Integration
  ✓ 20 User Seats
  ✓ Slack Alerts
  ✓ API Access
  ✗ Dedicated SOC Support
CTA:       [ START FREE TRIAL ]
```

**TIER 3 — COMMANDER**
```
Tag:       Enterprise
Price:     Custom
Color:     #B08AFF (purple accent for elite tier)
Features:
  ✓ Everything in OPERATOR
  ✓ Unlimited Assets
  ✓ Dedicated SOC Analyst Support
  ✓ Custom Threat Intelligence Feeds
  ✓ On-Prem / Air-Gap Deployment Option
  ✓ Unlimited User Seats
  ✓ SLA Guarantee (99.9% uptime)
  ✓ Quarterly Security Review
  ✓ Custom Compliance Reports (PCI-DSS, HIPAA, ISO 27001)
CTA:       [ CONTACT SALES ]
```

---

#### Pricing Add-ons
```
Table of optional add-ons:
  Penetration Testing Service   | $2,500 / engagement
  Threat Intel Premium Feed     | $199 / month
  Additional Asset Pack (+500)  | $99 / month
  Additional User Seats (+10)   | $49 / month
```

#### FAQ (Accordion)
Terminal-style expandable items with `+` / `−` toggle.

---

### 6.4 Blog / Threat Intel Feed

Positioned as authoritative security research and live threat intelligence.

---

#### Page Header
```
Label:    [ THREAT INTELLIGENCE ]
Title:    "From the VERITAS SOC"
Sub:      "Research, advisories, and real-time threat coverage 
           from our security intelligence team."
```

---

#### Featured Article (Hero Card)
```
Full-width card, 50% image (dark security illustration) + 50% copy
Tag:      [ CRITICAL ADVISORY ] in --color-threat
Date:     Share Tech Mono, --color-text-muted
Title:    Large Orbitron headline
Excerpt:  Inter body
CTA:      READ ADVISORY →
```

---

#### Content Grid
3-column grid below the feature article.

**Article Card**
```
Background:    var(--color-bg-surface)
Border:        1px solid var(--color-border)
Border-radius: 4px
Image:         top, 16:9 ratio, dark illustration style

Category tags (top of image):
  [ THREAT RESEARCH ] [ VULNERABILITY ] [ MALWARE ANALYSIS ]
  [ RED TEAM ] [ COMPLIANCE ] [ SOC TIPS ]
  
Body:
  Date:     Share Tech Mono, 11px, --color-text-muted
  Title:    Inter, 18px, 600, --color-text-primary
  Excerpt:  Inter, 14px, --color-text-secondary, 2-line clamp
  
Footer:
  Author avatar + name | Read time: X min
  
Hover:
  border-color → --color-secondary
  title color  → --color-secondary
```

---

#### Sidebar Widgets (if 2-column layout used)

**LIVE THREAT FEED**
```
Scrollable list of live CVEs and advisories
Each item: severity dot + CVE ID + short description + time ago
Background: terminal card
Font: JetBrains Mono, 12px
```

**VULNERABILITY COUNTER**
```
Stat card:
  "CRITICAL CVEs (last 30 days)"
  Large number in --color-threat
  Mini sparkline chart below
```

---

## 7. Animation & Motion

### Motion Principles
- Purpose over decoration: every animation communicates state or guides attention
- Performance first: prefer CSS animations and transforms; avoid layout-triggering properties
- Respect `prefers-reduced-motion`: all non-essential animations disabled

### Animation Library

**Glitch Text**
```css
@keyframes glitch {
  0%   { clip-path: inset(0 0 98% 0); transform: translateX(-4px); }
  10%  { clip-path: inset(40% 0 50% 0); transform: translateX(4px); }
  20%  { clip-path: inset(20% 0 70% 0); transform: translateX(-2px); }
  100% { clip-path: inset(0 0 0 0); transform: translateX(0); }
}
Duration: 0.3s on load, trigger on hover for nav items
```

**Terminal Typing Cursor**
```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
Duration: 0.8s, ease-in-out, infinite
Apply to: ::after pseudo-element with content "█"
```

**Pulse Ring (threat indicators)**
```css
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}
Duration: 1.5s, ease-out, infinite
```

**Scan Line Sweep**
```css
@keyframes scan {
  0%   { top: -5%; }
  100% { top: 105%; }
}
Element: 2px horizontal line, rgba(0,255,156,0.15) background
Duration: 4s, linear, infinite
Apply to: hero section overlay, loading states
```

**Counter Roll (stats)**
```
Library: CountUp.js or custom requestAnimationFrame
Duration: 2s ease-out
Trigger: IntersectionObserver when stat enters viewport
```

**Globe**
```
Library:     Globe.gl (Three.js wrapper) or react-globe.gl
Auto-rotate: 0.3 deg/frame, pause on user interaction
Arc speed:   random 1.5–2.5s per arc, random source/target pairs
Node pulse:  scale 1→1.6 every 2s, random offset per node
Atmosphere:  enabled, color #00D4FF at 0.15 opacity
```

**Page Transitions**
```
Scroll reveals: opacity 0→1 + translateY(20px→0), 0.5s ease-out
Stagger delay:  60ms per child item in grids/lists
Trigger:        IntersectionObserver, threshold 0.1
```

---

## 8. Iconography & Imagery

### Icons
- Primary library: **Lucide Icons** (clean, minimal, consistent stroke)
- Security-specific: supplement with custom SVGs for: radar, attack paths, shields, network nodes
- Size scale: 16px (inline), 20px (UI), 24px (cards), 32px (features), 48px (hero)
- Color: inherit from context; never hardcoded
- Never use filled/solid icons alongside outline icons in the same section

### Illustrations
- Dark, technical, minimal vector illustrations
- Style: isometric or flat; no photorealistic renders
- Color palette strictly adheres to brand colors
- Backgrounds always `--color-bg-base` or transparent
- No stock-photo style imagery in the product UI

### Photography (Blog/Marketing only)
- High contrast, dark-tinted
- Subject matter: server rooms, analysts at screens, code terminals, network infrastructure
- Apply: `mix-blend-mode: luminosity` + dark overlay for brand consistency

---

## 9. Responsive Behavior

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column, hamburger nav, stacked sections |
| Tablet | 640–1024px | 2-column content, collapsed sidebar |
| Desktop | 1024–1440px | Full layout, 240px sidebar |
| Wide | > 1440px | Max content width 1360px, centered |

### Mobile Adaptations
- Globe: simplified 2D world map SVG with pulsing nodes (Three.js too heavy for mobile)
- Sidebar: off-canvas drawer, toggle with hamburger
- Dashboard tables: horizontal scroll with sticky first column
- Pricing: stacked cards, default to Annual toggle
- Terminal card: reduced to 6 visible lines with scroll

---

## 10. Accessibility

- **WCAG 2.1 AA** minimum compliance target
- All neon-on-dark color combinations verified for 4.5:1 contrast ratio minimum
  - `#00FF9C` on `#020809` — ratio: 12.6:1 ✓
  - `#00D4FF` on `#0D1117` — ratio: 8.3:1 ✓
  - `#FF003C` on `#020809` — ratio: 5.7:1 ✓
- Focus states: visible 2px outline in `--color-primary` on all interactive elements
- Skip-to-main link: visually hidden, appears on Tab key
- All animations: respect `prefers-reduced-motion: reduce`
- All icons used functionally: include `aria-label` or paired visible text
- Data tables: proper `<thead>`, `<th scope>`, ARIA labels
- Forms: visible labels (not just placeholders), error messages linked via `aria-describedby`
- Globe: non-interactive fallback for screen readers with text summary of threat data

---

## 11. Tech Stack Recommendations

### Frontend Framework
- **Next.js 14+** (App Router) — SSR for marketing pages, client components for dashboard

### Styling
- **Tailwind CSS** with custom design token config (`tailwind.config.js`)
- CSS custom properties for all color/typography tokens

### 3D Globe
- **Globe.gl** (`npm install globe.gl`) — easiest to implement with built-in arcs, points, and atmosphere
- Alternative: **react-globe.gl** for React integration

### Charts
- **Recharts** (React) or **Chart.js** with custom dark theme
- **D3.js** for custom threat map / attack path visualizations

### Animation
- **Framer Motion** — page transitions, scroll reveals, interactive states
- **GSAP** — complex timeline animations (hero text glitch, counter roll)
- **Lottie** — pre-built security-themed micro-animations

### Terminal / Code
- **xterm.js** — for live terminal output components in the dashboard

### Icons
- **Lucide React** (`npm install lucide-react`)

### Backend (SaaS)
- **Supabase** or **PlanetScale** — database
- **Clerk** or **Auth.js** — authentication
- **Stripe** — billing/subscription management (aligned with Pricing tiers)

---

*Document ends. Version 1.0 — VERITAS Design System.*
*Prepared for internal development use. All rights reserved.*