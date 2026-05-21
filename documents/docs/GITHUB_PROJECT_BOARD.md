# LanceFlow Build — GitHub Project board template

Use this when creating or maintaining the **LanceFlow Build** board.

---

## Create the board (one-time)

1. GitHub → **Projects** → **New project** → **Board**
2. Title: **LanceFlow Build**
3. Link repository: **seniorkazuya/LanceFlow**

Or with CLI (after `gh auth refresh -h github.com -s project,read:project`):

```bash
gh project create --owner seniorkazuya --title "LanceFlow Build"
```

---

## Columns (in order)

| # | Column | Purpose |
|---|--------|---------|
| 1 | **Backlog** | Planned stories (DEV-xxx) |
| 2 | **Ready** | Refined, unblocked |
| 3 | **In Progress** | Feature branch open |
| 4 | **In Review** | PR open → `staging` |
| 5 | **QA / Staging** | Merged to `staging`; verify staging URL / UAT |
| 6 | **Done** | Released on `main` or accepted on staging |

---

## Card template

Each card = one story.

| Field | Example |
|-------|---------|
| **Title** | `DEV-007 — Observability` |
| **Linked issue** | `[DEV-007] Observability baseline` |
| **PR** | Link PR in card notes or description |
| **Staging URL** | https://lance-flow-web.vercel.app (after DEV-004) |

---

## Workflow per story

```text
Backlog → Ready → In Progress → In Review → QA/Staging → Done
```

| Event | Move card to |
|-------|----------------|
| Start branch | In Progress |
| Open PR to `staging` | In Review |
| Merge PR to `staging` | QA / Staging |
| Release to `main` / tag | Done |

See [GITHUB_PROJECT_UPDATES.md](./GITHUB_PROJECT_UPDATES.md) for current story → column mapping.

---

## Automation (DEV-008)

- **PR template** — checklist for `PROJECT_STATUS.md` + board
- **Workflow** — `.github/workflows/remind-project-status.yml` comments on PRs merged to `staging`
- **Repo About** — should link to [PROJECT_STATUS.md](./PROJECT_STATUS.md) (see [DEVOPS_GUIDE.md](./DEVOPS_GUIDE.md))

---

*DEV-008 — May 2026*
