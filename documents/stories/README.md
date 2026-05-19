# Story index

Each story includes a **Development prompt** section for Cursor/agents.

Workflow: [DEVOPS_AND_GITHUB_WORKFLOW.md](../docs/DEVOPS_AND_GITHUB_WORKFLOW.md)

| ID | Title | Epic | Milestone | Depends |
|----|-------|------|-----------|---------|
| [DEV-001](./DEV-001.md) | Monorepo scaffold and Turborepo | E0 Platform | M0 | None |
| [DEV-002](./DEV-002.md) | GitHub repository and branch protection | E0 Platform | M0 | DEV-001 |
| [DEV-003](./DEV-003.md) | CI pipeline (lint, typecheck, test, build) | E0 Platform | M0 | DEV-001 |
| [DEV-004](./DEV-004.md) | Staging deployment pipeline | E0 Platform | M0 | DEV-003 |
| [DEV-005](./DEV-005.md) | Production deployment and approvals | E0 Platform | M0 | DEV-004 |
| [DEV-006](./DEV-006.md) | Docker Compose local stack | E0 Platform | M0 | DEV-001 |
| [DEV-007](./DEV-007.md) | Observability baseline | E0 Platform | M0 | DEV-004 |
| [DEV-008](./DEV-008.md) | Client status automation | E0 Platform | M0 | DEV-002 |
| [CORE-001](./CORE-001.md) | Database package and Prisma schema v0 | E1 Foundation | M1 | DEV-001 |
| [CORE-002](./CORE-002.md) | Authentication and sessions | E1 Foundation | M1 | CORE-001 |
| [CORE-003](./CORE-003.md) | RBAC policies and middleware | E1 Foundation | M1 | CORE-002 |
| [CORE-004](./CORE-004.md) | Design system and app shell | E1 Foundation | M1 | DEV-001 |
| [CORE-005](./CORE-005.md) | Marketing and brand pages | E1 Foundation | M1 | CORE-004 |
| [CORE-006](./CORE-006.md) | Audit log service | E1 Foundation | M1 | CORE-001 |
| [OPS-001](./OPS-001.md) | Client module CRUD | E2 Operations | M2 | CORE-003 |
| [OPS-002](./OPS-002.md) | Client risk score v0 | E2 Operations | M2 | OPS-001 |
| [OPS-003](./OPS-003.md) | Project lifecycle | E2 Operations | M2 | OPS-001 |
| [OPS-004](./OPS-004.md) | Worker skills and workload | E2 Operations | M2 | CORE-003 |
| [OPS-005](./OPS-005.md) | Assignment algorithm v1 | E2 Operations | M2 | OPS-003,OPS-004 |
| [OPS-006](./OPS-006.md) | Daily self-reporting | E2 Operations | M2 | OPS-003 |
| [OPS-007](./OPS-007.md) | SOP document store | E2 Operations | M2 | OPS-001 |
| [OPS-008](./OPS-008.md) | Ops Manager console shell | E2 Operations | M2 | OPS-001,OPS-003 |
| [AUTO-001](./AUTO-001.md) | Rules engine core | E3 Automation | M3 | CORE-006 |
| [AUTO-002](./AUTO-002.md) | Project auto-approval | E3 Automation | M3 | AUTO-001,OPS-003 |
| [AUTO-003](./AUTO-003.md) | Auto task assignment on activate | E3 Automation | M3 | AUTO-001,OPS-005 |
| [AUTO-004](./AUTO-004.md) | Payment schedule entity | E3 Automation | M3 | OPS-003 |
| [AUTO-005](./AUTO-005.md) | Payment reminder and escalation jobs | E3 Automation | M3 | AUTO-004 |
| [AUTO-006](./AUTO-006.md) | Client risk pre-screen API | E3 Automation | M3 | OPS-002 |
| [AUTO-007](./AUTO-007.md) | Notification service | E3 Automation | M3 | DEV-004 |
| [AUTO-008](./AUTO-008.md) | Exception queue for leadership | E3 Automation | M3 | AUTO-002 |
| [KPI-001](./KPI-001.md) | KPI calculators by role | E4 Analytics | M4 | OPS-006 |
| [KPI-002](./KPI-002.md) | Nightly KPI rollup job | E4 Analytics | M4 | KPI-001 |
| [KPI-003](./KPI-003.md) | Control Center summary API | E4 Analytics | M4 | KPI-002,AUTO-008 |
| [KPI-004](./KPI-004.md) | Control Center dashboard UI | E4 Analytics | M4 | KPI-003 |
| [KPI-005](./KPI-005.md) | Signal threshold configuration | E4 Analytics | M4 | KPI-003 |
| [KPI-006](./KPI-006.md) | Bonus and penalty suggestions | E4 Analytics | M4 | KPI-001 |
| [PAY-001](./PAY-001.md) | Project milestone model | E5 Payments | M5 | OPS-003 |
| [PAY-002](./PAY-002.md) | Escrow and work gating | E5 Payments | M5 | PAY-001 |
| [PAY-003](./PAY-003.md) | Milestone-linked payment reminders | E5 Payments | M5 | PAY-001,AUTO-005 |
| [PAY-004](./PAY-004.md) | Fraud triggers v1 | E5 Payments | M5 | KPI-002,OPS-006 |
| [PAY-005](./PAY-005.md) | Dispute workflow | E5 Payments | M5 | OPS-007 |
| [HIRE-001](./HIRE-001.md) | Candidate application portal | E6 Hiring | M6 | CORE-003 |
| [HIRE-002](./HIRE-002.md) | Resume parser integration | E6 Hiring | M6 | HIRE-001 |
| [HIRE-003](./HIRE-003.md) | Technical assessment hook | E6 Hiring | M6 | HIRE-001 |
| [HIRE-004](./HIRE-004.md) | THS and RS calculators v1 | E6 Hiring | M6 | HIRE-002,AUTO-001 |
| [HIRE-005](./HIRE-005.md) | Hiring pipeline dashboard | E6 Hiring | M6 | HIRE-004 |
| [HIRE-006](./HIRE-006.md) | Hiring decision engine output | E6 Hiring | M6 | HIRE-004 |
| [HIRE-007](./HIRE-007.md) | CEO filtered hiring queue | E6 Hiring | M6 | HIRE-006 |
| [HIRE-008](./HIRE-008.md) | Candidate email notifications | E6 Hiring | M6 | HIRE-006,AUTO-007 |
| [AI-001](./AI-001.md) | English and communication analyzer | E7 AI Hiring | M7 | HIRE-002 |
| [AI-002](./AI-002.md) | EI scenario simulator | E7 AI Hiring | M7 | HIRE-001 |
| [AI-003](./AI-003.md) | Interview STT pipeline | E7 AI Hiring | M7 | HIRE-001 |
| [AI-004](./AI-004.md) | Interview transcript analyzer | E7 AI Hiring | M7 | AI-003 |
| [AI-005](./AI-005.md) | Role-specific hiring weight profiles | E7 AI Hiring | M7 | HIRE-004 |
| [AI-006](./AI-006.md) | Revenue Potential index | E7 AI Hiring | M7 | HIRE-004 |
| [AI-007](./AI-007.md) | Continuous learning weight proposal | E7 AI Hiring | M7 | KPI-002,HIRE-004 |
| [AI-008](./AI-008.md) | Hiring audit safeguards | E7 AI Hiring | M7 | HIRE-006 |
| [SCALE-001](./SCALE-001.md) | Advanced fraud detection | E8 Scale | M8 | PAY-004 |
| [SCALE-002](./SCALE-002.md) | Internal audit role workspace | E8 Scale | M8 | CORE-003 |
| [SCALE-003](./SCALE-003.md) | Hiring ROI calculator | E8 Scale | M8 | HIRE-007,KPI-002 |
| [SCALE-004](./SCALE-004.md) | Promotion fast-track flags | E8 Scale | M8 | KPI-002 |
| [SCALE-005](./SCALE-005.md) | Caller to Bidder qualification workflow | E8 Scale | M8 | KPI-001 |
