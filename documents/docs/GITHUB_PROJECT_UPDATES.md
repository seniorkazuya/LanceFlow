# LanceFlow Build — GitHub Project updates

> **Board:** [LanceFlow Build (project #4)](https://github.com/users/seniorkazuya/projects/4)  
> **Automation:** `.github/workflows/sync-github-project.yml` applies [board-sync.json](../../.github/project/board-sync.json) via GraphQL.

---

## Automatic sync (recommended)

The repo syncs **project #4** when:

| Trigger | Effect |
|---------|--------|
| Push to `staging` / `main` updating `board-sync.json` or `PROJECT_STATUS.md` | Full board sync from manifest |
| PR **opened** to `staging` | Story in PR title/branch → **In Review** |
| PR **merged** to `staging` | → **QA / Staging** (+ commits manifest) |
| PR **merged** to `main` | → **Done** |
| **Actions → Sync GitHub Project → Run workflow** | Manual full sync |

### One-time setup (required)

1. **Link the project to the repo**  
   Open [project #4](https://github.com/users/seniorkazuya/projects/4) → **⋯** → **Settings** → link repository **seniorkazuya/LanceFlow**.

2. **Grant Projects API access (pick one)**  
   - **Option A (CI):** Rely on `GITHUB_TOKEN` with `projects: write` (works when project is linked to the repo).  
   - **Option B (fallback):** Create a classic PAT with `project` + `read:project`, add repo secret **`PROJECTS_TOKEN`**.

3. **Local `gh` (optional, for debugging)**  
   ```bash
   gh auth refresh -h github.com -s read:project,project
   node .github/scripts/sync-github-project.mjs --dry-run
   ```

4. **Merge automation to `staging`**  
   Push the workflow + manifest on a PR to `staging`, then merge so Actions can run.

---

## Column mapping

| Column | When to move the card |
|--------|------------------------|
| **Backlog** | Story planned, not started |
| **Ready** | Refined, dependencies met, no open branch |
| **In Progress** | Feature branch open (set manually in manifest if needed) |
| **In Review** | PR open to `staging` |
| **QA / Staging** | Merged to `staging`; staging deploy / UAT |
| **Done** | On `main` / released with tag |

---

## Story status (2026-05-22 — matches board-sync.json)

| Story | Column | GitHub issue | Notes |
|-------|--------|--------------|--------|
| DEV-001 … DEV-008 | **Done** | #7, #8, #9, #17, #23, #25, #34, #36 | M0 complete |
| CORE-001 … CORE-006 | **Done** | #39, #45, #49, #51, #52, #61 | M1 complete |
| OPS-001 | **Done** | — | Production v0.3.0 |
| OPS-002 | **Done** | — | Production v0.3.0 |
| OPS-003 | **QA / Staging** | — | Merged; ships with v0.4.0 |
| OPS-004 | **QA / Staging** | — | Merged; ships with v0.4.0 |
| OPS-005 | **QA / Staging** | — | Merged; ships with v0.4.0 |
| OPS-006 | **QA / Staging** | — | Merged to staging |
| OPS-007 | **Backlog** | — | SOP store |
| OPS-008 | **Backlog** | — | Ops console |

After **PR #70** merges to `main`, set OPS-003–005 to **Done** in [board-sync.json](../../.github/project/board-sync.json) (or merge release PR with story IDs in title).

---

## Update progress manually

Edit **`.github/project/board-sync.json`** (`stories.<ID>.column`) and push to `staging` — the workflow syncs the board.

Also update:

- [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) — client-facing summary  
- `documents/stories/<STORY-ID>.md` — **Status** field  

---

## Manual update (no CI)

1. Open [LanceFlow Build #4](https://github.com/users/seniorkazuya/projects/4).  
2. Drag cards to match the table above.  
3. Card titles should start with `OPS-003` etc. so automation can match them.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Workflow fails `INSUFFICIENT_SCOPES` | Link project to repo + add `PROJECTS_TOKEN`, or refresh `gh auth` locally |
| Column name mismatch | Status field options must match manifest `columns` exactly |
| Card not moving | Add story to `board-sync.json` or create card titled `OPS-00x — …` |
| No commit after merge | Branch protection may block bot commits; merge manifest update manually |

---

*Last sync manifest: 2026-05-22 · Automation: DEV-008 extension*

Board template: [GITHUB_PROJECT_BOARD.md](./GITHUB_PROJECT_BOARD.md)
