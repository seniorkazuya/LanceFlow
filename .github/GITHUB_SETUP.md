# GitHub setup (DEV-002)

Applied configuration for **seniorkazuya/LanceFlow**.

## Branch protection

| Branch | PR required | Approvals | Notes |
|--------|-------------|-----------|--------|
| `main` | Yes | **1** | Production releases |
| `staging` | Yes | **0** | Solo maintainer can merge story PRs; add 1+ when team grows |

Shared: dismiss stale reviews, enforce admins, no force push, no branch delete.  
**Status checks:** off until DEV-003 (CI).

Re-apply:

```bash
gh api --method PUT repos/seniorkazuya/LanceFlow/branches/main/protection \
  --input .github/scripts/apply-branch-protection.json

gh api --method PUT repos/seniorkazuya/LanceFlow/branches/staging/protection \
  --input .github/scripts/apply-branch-protection-staging.json
```

When a second engineer joins, set staging approvals to **1** (use `apply-branch-protection.json` for staging).

## GitHub Project

Create board **LanceFlow Build** manually (CLI needs extra token scope):

```bash
gh auth refresh -s project,read:project
gh project create --owner seniorkazuya --title "LanceFlow Build"
```

Columns: Backlog → Ready → In Progress → In Review → QA / Staging → Done.  
See [DEVOPS_GUIDE.md](../documents/docs/DEVOPS_GUIDE.md) §2.4.

## Collaborators

**Settings → Collaborators** — add team members with **Write** access. Organization teams require GitHub Team plan.
