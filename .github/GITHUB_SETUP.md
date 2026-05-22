# GitHub setup (DEV-002)

Applied configuration for **seniorkazuya/LanceFlow**.

## Branch protection

| Branch | PR required | Approvals | Notes |
|--------|-------------|-----------|--------|
| `main` | Yes | **1** | Production releases |
| `staging` | Yes | **0** | Solo maintainer can merge story PRs; add 1+ when team grows |

Shared: dismiss stale reviews, enforce admins, no force push, no branch delete.  
**Status checks:** `lint`, `typecheck`, `test`, `build` (after DEV-003; apply with `*-with-ci.json` scripts).

Re-apply:

```bash
gh api --method PUT repos/seniorkazuya/LanceFlow/branches/main/protection \
  --input .github/scripts/apply-branch-protection.json

gh api --method PUT repos/seniorkazuya/LanceFlow/branches/staging/protection \
  --input .github/scripts/apply-branch-protection-staging.json
```

**After DEV-003 (CI live):**

```bash
gh api --method PUT repos/seniorkazuya/LanceFlow/branches/main/protection \
  --input .github/scripts/apply-branch-protection-with-ci.json

gh api --method PUT repos/seniorkazuya/LanceFlow/branches/staging/protection \
  --input .github/scripts/apply-branch-protection-staging-with-ci.json
```

When a second engineer joins, set staging approvals to **1** (use `apply-branch-protection-staging-with-ci.json` for staging).

## GitHub Project

**Board:** [LanceFlow Build #4](https://github.com/users/seniorkazuya/projects/4)

1. Link project **#4** to this repository (project **Settings**).
2. Optional repo secret **`PROJECTS_TOKEN`** (classic PAT: `project`, `read:project`) if Actions cannot write the board.
3. Workflow **Sync GitHub Project** applies [`.github/project/board-sync.json`](../.github/project/board-sync.json).

Columns: Backlog → Ready → In Progress → In Review → QA / Staging → Done.  
See [GITHUB_PROJECT_UPDATES.md](../documents/docs/GITHUB_PROJECT_UPDATES.md) and [DEVOPS_GUIDE.md](../documents/docs/DEVOPS_GUIDE.md) §2.4.

## Collaborators

**Settings → Collaborators** — add team members with **Write** access. Organization teams require GitHub Team plan.
