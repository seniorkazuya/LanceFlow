## Story

<!-- e.g. DEV-003 — CI pipeline -->

**Story ID:**  
**Story doc:** `documents/stories/<STORY-ID>.md`

## Summary

<!-- What changed and why (1–3 sentences) -->

## Acceptance criteria

<!-- Copy from story file; check off -->

- [ ]
- [ ]

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] DevOps / CI
- [ ] Docs only

## Checklist

- [ ] Branch name: `feature/<STORY-ID>-<slug>`
- [ ] `pnpm lint` / `pnpm typecheck` / `pnpm build` pass locally (or CI green)
- [ ] Module boundaries respected ([MODULAR_ARCHITECTURE.md](../documents/docs/MODULAR_ARCHITECTURE.md))
- [ ] No secrets committed

## Client status (required when merging to `staging`)

> **Clients read:** [PROJECT_STATUS.md](../documents/docs/PROJECT_STATUS.md) · **Board:** [LanceFlow Build #4](https://github.com/users/seniorkazuya/projects/4) ([update guide](../documents/docs/GITHUB_PROJECT_UPDATES.md))

- [ ] Updated **Active story**, **Just completed**, and **Staging demo** in `PROJECT_STATUS.md`
- [ ] PR title or branch includes story ID (e.g. `[OPS-006]`) so **Sync GitHub Project** workflow moves the card automatically
- [ ] If needed, updated `.github/project/board-sync.json` for stories without a PR
- [ ] Story file `documents/stories/<STORY-ID>.md` status field updated

## Screenshots / demo

<!-- If UI changed -->

## Related

<!-- Closes #issue -->
