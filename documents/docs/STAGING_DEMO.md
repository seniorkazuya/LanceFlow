# LanceFlow — Staging demo guide (real UI)

**Staging URL:** https://lance-flow-web.vercel.app  
**Health:** https://lance-flow-web.vercel.app/api/health  

Deploys from the `staging` branch (see [DEPLOY_STAGING.md](./DEPLOY_STAGING.md)). Production `main` is a separate release line and may lag staging visually until the next version tag.

---

## Is this our UI?

Yes. The current staging app includes:

| Layer | What you should see |
|--------|---------------------|
| **Landing** (`/`) | Hero, **brand identity** panel, **Foundation** (employee/client promises), **how it works** (4 steps), **org roles** table, **three pillars**, CTA, footer with optional `staging · <git-sha>` |
| **Sign-in** (`/auth/signin`) | Glass card, highlighted logo, shared `Input` fields |
| **App** (`/dashboard`, etc.) | Sidebar with logo, dot-grid main area, `PageHeader` + `GlassCard` on dashboard, control, and hiring |

If you still see plain text (“Platform scaffold active · Roles: …”) with no images or glass panels, the browser is showing an **old cached build**. Hard refresh: **Ctrl+Shift+R** (Windows) or open in a private window.

---

## Where is the landing page?

The marketing landing page **is the site root**:

| URL | Page |
|-----|------|
| https://lance-flow-web.vercel.app/ | **Landing** (`LandingPage` component) |
| `/auth/signin` | Sign-in |
| `/dashboard` | App home (requires login) |
| `/control` | Control Center (CEO / Ops only) |
| `/hiring/ceo-queue` | Hiring CEO queue (not Engineers) |
| `/audit` | Audit log (CEO only) |

There is no separate `/landing` route — `/` is the public marketing entry.

---

## How to use (staging)

### 1. Open the landing page

Go to https://lance-flow-web.vercel.app/ and confirm:

- Top nav: **lanceflow** + **Open app**
- Hero: “Where strong action meets seamless flow”
- Sections **brand identity**, **foundation**, **how it works**, **organizational model**, **three pillars**

### 2. Sign in

1. Click **Get started** or go to `/auth/signin`.
2. Use credentials configured on Vercel for this project:
   - `DEV_AUTH_EMAIL`
   - `DEV_AUTH_PASSWORD`
   - `AUTH_SECRET` must also be set (server-side).

If sign-in fails with **Invalid email or password**, see [Troubleshooting sign-in](#troubleshooting-sign-in) below.

Default local example (from `.env.example`):

- Email: `ops@lanceflow.test`
- Password: whatever you set in `DEV_AUTH_PASSWORD` **in that environment** (local `.env` ≠ Vercel unless you copy the same values)

First sign-in creates/updates the user as **OPS_MANAGER** in the database.

### 3. Use the app shell

After sign-in you land on **Dashboard**:

- **Sidebar** — items depend on role (CORE-003 RBAC):
  - Everyone: Dashboard
  - CEO / Ops: + Control Center
  - CEO / Ops / Caller / Bidder: + Hiring CEO Queue
  - Engineer: Dashboard only
- **Sign out** — header button

### 4. Quick API checks (optional)

| Endpoint | Expect |
|----------|--------|
| `GET /api/health` | `status: ok`, database/redis checks |
| `GET /api/me` | 401 when logged out; user JSON when logged in |
| `GET /api/control/summary` | 200 for Ops/CEO; 403 for Engineer |
| `GET /api/hiring/ceo-queue` | 403 for Engineer |

---

## Troubleshooting sign-in

Sign-in uses a **single allowed email/password pair** from server env vars (`packages/core/auth/src/credentials.ts`):

```ts
email === process.env.DEV_AUTH_EMAIL
password === process.env.DEV_AUTH_PASSWORD  // exact match, case-sensitive
```

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| *Invalid email or password* | Vercel `DEV_AUTH_PASSWORD` ≠ password you typed | Vercel → **lance-flow-web** → Settings → Environment Variables → set `DEV_AUTH_PASSWORD` to your password → **Redeploy** |
| Same error | `DEV_AUTH_EMAIL` / `DEV_AUTH_PASSWORD` not set on Vercel | Add both + `AUTH_SECRET` + `AUTH_URL` (see [DEPLOY_STAGING.md](./DEPLOY_STAGING.md)) |
| Same error | Email typo or extra spaces | Use exactly `ops@lanceflow.test` (matches CI default) |
| Works locally, not on staging | Only updated local `.env` | Copy the same `DEV_AUTH_*` and `AUTH_SECRET` into Vercel |

**Your case:** `ops@lanceflow.test` + `smoothm!n!on` works only if Vercel has **exactly** those values. Local `.env` does not apply to https://lance-flow-web.vercel.app.

**Checklist for Vercel (Production + Preview):**

1. `DEV_AUTH_EMAIL` = `ops@lanceflow.test`
2. `DEV_AUTH_PASSWORD` = `smoothm!n!on` (or change your login to match whatever is on Vercel)
3. `AUTH_SECRET` = long random string (32+ chars)
4. `AUTH_URL` = `https://lance-flow-web.vercel.app`
5. `DATABASE_URL` = Neon staging URL
6. Redeploy after saving variables

**Diagnostic URL:** https://lance-flow-web.vercel.app/api/diagnostics/auth  
(Do not use `/api/auth/setup` — NextAuth returns `"Bad request."` there.)

Full fix guide: [FIX_STAGING_LOGIN.md](./FIX_STAGING_LOGIN.md)

**Vercel redeploy failed?** Use GitHub instead: **Actions → Deploy Staging → Run workflow** on branch `staging`.  
Or push any commit to `staging` — that triggers deploy automatically.

---

## LanceFlow vs [Screenpipe Teams](https://screenpi.pe/team)

We used Screenpipe as a **visual reference**, not a pixel copy:

| Screenpipe | LanceFlow staging |
|------------|-------------------|
| Long enterprise scroll (pricing, comparison tables, logos) | Shorter **foundation** landing: hero + brand panel + 3 pillars |
| Product = workflow capture / agents | Product = **rules, RBAC, performance ecosystem** |
| Neutral / product-agnostic brand | **Your** monogram + lockup from `documents/*.png` |
| Heavy social proof (NVIDIA, Google, …) | Trust bullets (RBAC, role shell, rules) |

Similarities: near-black base, glass cards, uppercase section labels, pill CTAs, centered hero, teal accents.

To get closer to Screenpipe later (CORE-005+): logo strip, “how it works” steps, pricing block, Foundation doc narrative — without copying their product story.

---

## Current project status (M1)

| Story | Status |
|-------|--------|
| CORE-001–003 | Done (DB, auth, RBAC) |
| CORE-004 | Done (design system + shell + brand UI) |
| CORE-005 | In progress (marketing copy from Foundation doc) |
| Release on `main` | v0.2.1 — does not include latest staging UI until next release |

See [PROJECT_STATUS.md](./PROJECT_STATUS.md).

---

## Local parity

```bash
pnpm install
# .env with AUTH_SECRET, DEV_AUTH_*, DATABASE_URL
pnpm db:migrate:deploy
pnpm dev
```

Open http://localhost:3000 — same routes as staging.
