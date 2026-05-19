# LanceFlow — Documentation

Structured performance ecosystem — *Where Strong Action Meets Seamless Flow.*

## Planning sources

- `Foundation.docx` — Brand and positioning  
- `Hiring template.docx` — AI hiring engine  
- `how to automate.docx` — CEO automation and KPIs  

## Build documentation

| Document | Audience | Description |
|----------|----------|-------------|
| [docs/PLANNING_SUMMARY_AND_GUIDE.md](docs/PLANNING_SUMMARY_AND_GUIDE.md) | Everyone | Vision, roles, formulas, principles |
| [docs/STORY_DEVELOPMENT_PLAN.md](docs/STORY_DEVELOPMENT_PLAN.md) | Engineering | **62 stories**, sprints, dependencies |
| [docs/MODULAR_ARCHITECTURE.md](docs/MODULAR_ARCHITECTURE.md) | Engineering | Monorepo modules, extension points |
| [docs/DEVOPS_AND_GITHUB_WORKFLOW.md](docs/DEVOPS_AND_GITHUB_WORKFLOW.md) | Engineering | Branches, PR, CI/CD, review |
| [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) | **Clients** | Live milestone progress & demo URLs |
| [docs/DEVOPS_GUIDE.md](docs/DEVOPS_GUIDE.md) | Engineering | GitHub, PR, CI/CD, deploy (step-by-step) |
| [docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) | Reference | Original phased plan |

## User stories (with dev prompts)

- **[stories/README.md](stories/README.md)** — Index of all 62 stories  
- Each `stories/<STORY-ID>.md` includes acceptance criteria and a **copy-paste development prompt** for Cursor/agents  

## Scripts

- `scripts/generate_stories.py` — Regenerate story files after template changes  

## Quick start for developers

1. Read `docs/MODULAR_ARCHITECTURE.md` and `docs/DEVOPS_AND_GITHUB_WORKFLOW.md`  
2. Pick a story from `stories/` (check dependencies)  
3. Branch `feature/<STORY-ID>-<slug>`  
4. Paste the story’s **Development prompt** into your agent session  
5. PR to `staging`; update `docs/PROJECT_STATUS.md` when client-visible  
