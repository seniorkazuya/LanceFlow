# LanceFlow Build — GitHub Project updates

> **Board:** GitHub → **Projects** → **LanceFlow Build**  
> Update this board whenever a story’s status changes (merge, deploy, release).

The agent updates **issues** and **`PROJECT_STATUS.md`** automatically when possible. **Project board columns** require `gh` with Projects scope (see below).

---

## Column mapping

| Column | When to move the card |
|--------|------------------------|
| **Backlog** | Story planned, not started |
| **Ready** | Refined, dependencies met, no open branch |
| **In Progress** | Feature branch open |
| **In Review** | PR open to `staging` |
| **QA / Staging** | Merged to `staging`; staging deploy / UAT |
| **Done** | On `main` or released with tag |

---

## Story status (update board to match)

| Story | Suggested column | GitHub issue | Notes |
|-------|------------------|--------------|--------|
| DEV-001 | **Done** | #7 (closed) | Monorepo |
| DEV-002 | **Done** | #8 (closed) | GitHub templates, branch protection |
| DEV-003 | **Done** | #9 (closed) | CI pipeline |
| DEV-004 | **Done** or **QA / Staging** | #17 (closed) | Staging live: https://lance-flow-web.vercel.app |
| DEV-005 | **Done** | #23 (closed) | Workflow on `main`; prod deploy after tag |
| DEV-006 | **Done** | #25 (closed) | Docker Compose #24 |
| DEV-007 | **Ready** / **In Progress** | _create issue_ | Next story |
| DEV-008 | **Backlog** | _create issue when starting_ | |

---

## One-time: enable `gh` to update Projects

```bash
gh auth refresh -h github.com -s read:project,project
```

Complete the browser device login. Then:

```bash
gh project list --owner seniorkazuya
gh project view <PROJECT_NUMBER> --owner seniorkazuya
```

---

## Manual update (no CLI)

1. Open **https://github.com/users/seniorkazuya/projects** (or org projects).
2. Open **LanceFlow Build**.
3. Drag cards (or add from issues **#7, #8, #9, #17, #23**).
4. Link PR URLs on cards when in **In Review**.

---

## After each story (checklist)

- [ ] Close or update the GitHub **issue** (`[DEV-xxx]` title).
- [ ] Move card on **LanceFlow Build** to the column above.
- [ ] Update **`documents/docs/PROJECT_STATUS.md`**.
- [ ] Update **`documents/stories/DEV-xxx.md`** status field.

---

*Last sync: 2026-05-21 — M0 on `main` (#28); DEV-001–006 Done; DEV-007 next*
