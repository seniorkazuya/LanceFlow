# LanceFlow — Staging demo guide (real UI)

**Staging URL:** https://lance-flow-web.vercel.app  
**Health:** https://lance-flow-web.vercel.app/api/health  

Deploys from the `staging` branch (see [DEPLOY_STAGING.md](./DEPLOY_STAGING.md)). Production `main` is a separate release line and may lag staging visually until the next version tag.

---

## Is this our UI?

Yes. The current staging app includes:

| Layer | What you should see |
|--------|---------------------|
| **Landing** (`/`) | Dark mesh background, dot grid, centered hero, **brand identity** glass panel with monogram + lockup images, **three pillars** cards, footer with optional `staging · <git-sha>` |
| **Sign-in** (`/auth/signin`) | Glass card, highlighted logo |
| **App** (`/dashboard`, etc.) | Sidebar with logo, role-aware nav |

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

There is no separate `/landing` route — `/` is the public marketing entry.

---

## How to use (staging)

### 1. Open the landing page

Go to https://lance-flow-web.vercel.app/ and confirm:

- Top nav: **lanceflow** + **Open app**
- Hero: “Where strong action meets seamless flow”
- Section **brand identity** with two highlighted images
- Section **three pillars**

### 2. Sign in

1. Click **Get started** or go to `/auth/signin`.
2. Use credentials configured on Vercel for this project:
   - `DEV_AUTH_EMAIL`
   - `DEV_AUTH_PASSWORD`
   - `AUTH_SECRET` must also be set (server-side).

If sign-in fails, check Vercel → Project → Settings → Environment Variables (Preview/Production for the staging-linked project).

Default local example (from `.env.example`):

- Email: `ops@lanceflow.test`
- Password: whatever you set in `DEV_AUTH_PASSWORD`

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
