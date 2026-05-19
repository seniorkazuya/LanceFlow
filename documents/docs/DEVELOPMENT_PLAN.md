# LanceFlow — Detailed Development Plan

A phased plan to build LanceFlow as a **structured lancing platform**: talent operations, client delivery, AI-assisted hiring, and CEO-light automation.

**Related:** [PLANNING_SUMMARY_AND_GUIDE.md](./PLANNING_SUMMARY_AND_GUIDE.md) · [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md) (62 stories + prompts) · [DEVOPS_AND_GITHUB_WORKFLOW.md](./DEVOPS_AND_GITHUB_WORKFLOW.md) · [MODULAR_ARCHITECTURE.md](./MODULAR_ARCHITECTURE.md) · [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## 1. Vision & Scope

### 1.1 Product definition

**LanceFlow Platform** — internal + client-facing system that:

1. Onboards and scores talent (AI hiring engine)  
2. Runs projects with automated assignment, KPIs, and payments  
3. Gives leadership a **Control Center** (signals, not spreadsheets)  
4. Enforces SOPs, risk controls, and exception-only management  

### 1.2 Out of scope for MVP (defer)

- Public marketplace listing (open bidding by strangers)  
- Full autonomous LLM client negotiations without human Caller/Bidder  
- Internal audit team module (25+ employees stage)  
- CTO / multi-department HRIS replacement  

### 1.3 Assumptions

- Initial users: employees (Callers, Bidders, Engineers), Operations Manager, CEO  
- Clients interact via controlled channels (portal and/or integrated comms), not chaotic chat  
- Payments may integrate Stripe / Wise / manual mark-paid in early phases  

---

## 2. Recommended Technology Stack

| Layer | Recommendation | Notes |
|-------|----------------|-------|
| **Frontend** | Next.js (App Router) + TypeScript | Marketing site + authenticated app |
| **UI** | Tailwind + shadcn/ui | Fast dashboards, status colors (green/yellow/red) |
| **API** | Next.js API routes or NestJS (if team splits BE/FE) | Start monolith; extract services later |
| **Database** | PostgreSQL | Relational fit for KPIs, audits, formulas |
| **ORM** | Prisma or Drizzle | Migrations, type safety |
| **Auth** | Clerk, Auth0, or NextAuth | RBAC: CEO, Ops, Caller, Bidder, Engineer |
| **Queue / jobs** | BullMQ + Redis | Reminders, scoring jobs, nightly KPI rollup |
| **File storage** | S3-compatible | Resumes, recordings, portfolios |
| **AI / LLM** | OpenAI / Anthropic APIs | Resume parse, EI scenarios, transcript analysis |
| **Speech** | Whisper API or Deepgram | Interview transcription |
| **Observability** | Sentry + structured logs | Override audit trail critical |
| **Infra** | Vercel + managed Postgres (Neon/Supabase) or AWS | Scale when hiring volume grows |

---

## 3. System Architecture (target)

```
┌─────────────────────────────────────────────────────────────────┐
│                     LanceFlow Web Application                    │
│  (Marketing / Employee Portal / Client Portal / Control Center)  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                        API Gateway / BFF                         │
│   Auth · RBAC · Rate limits · Audit log                          │
└─────┬──────────────┬──────────────┬──────────────┬──────────────┘
      │              │              │              │
┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
│ Operations │  │  Hiring   │  │  Rules    │  │ Analytics │
│  Service   │  │  Service  │  │  Engine   │  │  Service  │
│ projects   │  │ ATS score │  │ auto approve│ KPI rollup │
│ assignments│  │ interview │  │ assign pay │ dashboards │
│ daily rpt  │  │ risk RP   │  │ fraud flag │ forecasts  │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │              │
      └──────────────┴──────────────┴──────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │ + Redis (jobs)  │
                    │ + Object store  │
                    └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │ External APIs   │
                    │ LLM · STT · Email│
                    │ Payments (later)│
                    └─────────────────┘
```

---

## 4. Domain Modules

### 4.1 Core entities

| Entity | Key attributes |
|--------|----------------|
| `User` | role(s), status, workload, skill tags |
| `Client` | risk score, payment history, communication reliability |
| `Project` | scope clarity %, margin %, status, milestones |
| `Assignment` | worker, skill match score, workload snapshot |
| `DailyReport` | user, date, hours, progress %, blockers |
| `KPIRecord` | role-specific computed score, period |
| `Payment` | due date, status, escalation level |
| `Candidate` | pipeline stage, THS, RS, RP, decision |
| `Interview` | recording URL, transcript, analyzer outputs |
| `RuleDecision` | rule id, inputs, outcome, override flag |
| `AuditLog` | actor, action, before/after, formula version |

### 4.2 Rules engine (config-driven)

Store formulas as versioned config (DB JSON or code constants v1):

- Project auto-approval  
- Task assignment ranking  
- Payment escalation timeline  
- Role KPI weights  
- Hiring THS / RS / RP (role-specific weight profiles)  

**Requirement:** Every automated outcome stores inputs + formula version for explainability.

---

## 5. Development Phases

### Phase 0 — Foundation (Weeks 1–2)

**Goal:** Repo, auth, roles, basic UI shell.

| Task | Deliverable |
|------|-------------|
| Monorepo / app scaffold | Next.js + TS + lint + CI |
| Database schema v0 | Users, roles, audit_logs |
| RBAC middleware | CEO, OpsManager, Caller, Bidder, Engineer |
| Design system | Layout, nav, status badges (green/yellow/red) |
| Brand pages | LanceFlow story (from Foundation doc) |

**Exit criteria:** Role-based login; empty Control Center route protected for CEO/Ops.

---

### Phase 1 — Operations Core (Weeks 3–6)

**Goal:** Run work without manual CEO assignment.

| Task | Deliverable |
|------|-------------|
| Client CRUD + risk score manual/semi-auto v0 | Client profile, risk 0–100 |
| Project lifecycle | Draft → pending approval → active → delivered → closed |
| Scope clarity & margin fields | Inputs for approval rules (manual entry first) |
| Worker skills + workload | Skill tags, active assignment count |
| Assignment algorithm v1 | `skill_match * weight - workload_penalty` |
| Daily self-reporting | Required form; missing report flags |
| SOP document store | Markdown/PDF links per process type |

**Exit criteria:** Ops Manager can create project, assign worker, collect daily reports.

---

### Phase 2 — Automation Level 1 (Weeks 7–10)

**Goal:** 60–70% reduction in routine CEO decisions (per automate doc).

| Task | Deliverable |
|------|-------------|
| Rules engine service | Evaluate project approval rule |
| Auto-approve projects | Exception queue for CEO/Ops |
| Auto task assignment | On project activate |
| Payment schedule + reminders | Job: due → day 3 escalate → day 7 risk |
| Client risk pre-screen API | Score before bid accepted |
| Notification service | Email/in-app for escalations |

**Exit criteria:** Projects meeting thresholds never hit CEO queue; payment reminders run without human.

---

### Phase 3 — KPI & Control Center (Weeks 11–14)

**Goal:** CEO dashboard ~10 min/day; exception-only management.

| Task | Deliverable |
|------|-------------|
| KPI calculators | Worker, Bidder, Caller formulas (nightly job) |
| Bonus/penalty rules v1 | Threshold-based suggestions (Ops approves) |
| Control Center dashboard | Revenue, margin, risk, delays, payments, rankings |
| Signal coloring | Green/yellow/red thresholds per metric |
| Exception inbox | Disputes, high-value, fraud severity = red only |
| Ops Manager console | Workflow, assignment override, performance view |

**Exit criteria:** CEO sees aggregated signals; drills into red items only.

---

### Phase 4 — Payments & Trust (Weeks 15–18)

**Goal:** Stop chasing payments; protect delivery.

| Task | Deliverable |
|------|-------------|
| Milestone model | % breakdown per project |
| Escrow / hold workflow | Work blocked if milestone unpaid (integrate provider or manual escrow flag) |
| Automated payment reminders | Linked to milestones |
| Fraud triggers v1 | Revenue mismatch, delay patterns, missing reports |
| Dispute SOP workflow | Ticket type with escalation path |

**Exit criteria:** Project cannot advance milestone without payment state satisfied (or Ops override logged).

---

### Phase 5 — Hiring ATS MVP (Weeks 19–24)

**Goal:** Structured pipeline + basic THS/RS without full AI maturity.

| Task | Deliverable |
|------|-------------|
| Candidate application portal | Resume upload, role selection |
| Resume parser integration | Extract structured fields (LLM or dedicated API) |
| Manual + semi-auto assessments | Technical test hook (external or embedded) |
| THS / RS calculators v1 | Formulas from Hiring template; configurable weights |
| Pipeline dashboard | Stages, score distribution, time-to-hire |
| Decision output | Reject / Hold / Hire / Fast Track |
| Email templates | Auto notify candidate on decision |
| CEO filtered view | Top 5%, high RP, high RS only |

**Exit criteria:** End-to-end hire flow with scores; CEO not reviewing every applicant.

---

### Phase 6 — AI Hiring Advanced (Weeks 25–32)

**Goal:** Enterprise hiring engine from Hiring template.

| Task | Deliverable |
|------|-------------|
| English / communication analyzer | Grammar, clarity on written samples |
| EI scenario simulator | Angry client, price objection, miscommunication (LLM rubric) |
| Interview recording upload | STT pipeline → transcript store |
| Transcript analyzer | Filler words, tone, technical depth, stress score |
| Role-specific weight profiles | Caller / Bidder / Engineer models |
| Revenue Potential (RP) index | Close probability × deal size × delivery capacity |
| Predicted future performance (PF) | Model v1 from historical hires (after data exists) |
| Continuous learning job | 6-month predicted vs actual KPI → weight adjustment proposal |
| Safeguards | 10% audit sample, override log, formula versioning |

**Exit criteria:** Full candidate summary card matches spec (THS, RS, RP, salary multiplier, fast-track).

---

### Phase 7 — Fraud, Audit & Scale (Weeks 33+)

**Goal:** 50+ employee readiness.

| Task | Deliverable |
|------|-------------|
| Advanced fraud graph | Cross-user comms patterns (policy-compliant) |
| Internal audit role | Read-only audit workspace |
| Hiring ROI calculator | Cost per hire vs RP realized |
| Diversity / pipeline metrics | Optional compliance reporting |
| Performance-based promotion flags | Career path triggers from KPI history |
| Cross-role Caller → Bidder qualification | Rule-based eligibility workflow |

---

## 6. Data Model Sketch (Phase 1–3)

```sql
-- Illustrative; implement via Prisma migrations

users (id, email, role, display_name, status, created_at)
clients (id, name, risk_score, payment_history_json, ...)
projects (id, client_id, title, status, scope_clarity, profit_margin_pct, client_risk_at_create, ...)
assignments (id, project_id, user_id, skill_score, assigned_at, released_at)
daily_reports (id, user_id, project_id, report_date, hours, progress_pct, issues_text, ...)
payments (id, project_id, milestone, amount, due_at, status, escalation_level, ...)
kpi_records (id, user_id, role, period_start, period_end, score, components_json, ...)
rule_decisions (id, entity_type, entity_id, rule_key, inputs_json, outcome, formula_version, ...)
candidates (id, role_applied, stage, ths, rs, rp_band, decision, ...)
audit_logs (id, actor_id, action, entity, payload, created_at)
```

---

## 7. API Surface (high level)

| Area | Example endpoints |
|------|-------------------|
| Auth | `POST /auth/session`, role claims |
| Clients | `GET/POST /clients`, `POST /clients/:id/risk-evaluate` |
| Projects | `CRUD /projects`, `POST /projects/:id/approve`, `POST /projects/:id/assign` |
| Reports | `POST /daily-reports`, `GET /reports/missing` |
| KPI | `GET /kpi/users/:id`, `GET /kpi/leaderboard` |
| Dashboard | `GET /control-center/summary`, `GET /control-center/exceptions` |
| Payments | `GET/POST /payments`, `POST /payments/:id/remind` |
| Hiring | `POST /candidates`, `POST /candidates/:id/score`, `GET /candidates/ceo-queue` |
| Rules | `GET /rules/versions`, `POST /decisions/:id/override` |

---

## 8. AI Integration Plan

| Use case | Approach | Phase |
|----------|----------|-------|
| Resume parsing | LLM structured JSON extraction + validation | 5 |
| EI scenarios | Rubric-scored LLM evaluation of candidate responses | 6 |
| Interview analysis | STT + LLM feature extraction (professionalism, stress) | 6 |
| Client risk bot | Weighted score from client history + LLM on comms sample | 2–4 |
| Fraud patterns | Rules first; ML anomaly detection later | 4, 7 |
| Weight tuning | Batch job: regression / simple optimizer on hire outcomes | 6+ |

**Cost control:** Queue long-running AI jobs; cache parse results; cap transcript length.

---

## 9. Security & Compliance

- RBAC strictly enforced on all routes  
- PII encryption at rest for resumes and recordings  
- Consent for interview recording; retention policy  
- Immutable audit log for overrides and hiring decisions  
- Least-privilege Ops vs CEO vs Engineer data access  
- GDPR-style export/delete for candidate data (if operating internationally)  

---

## 10. Testing Strategy

| Type | Focus |
|------|--------|
| Unit | Rules engine formulas (approval, THS, RS, KPI) |
| Integration | Assignment algorithm, payment escalation jobs |
| E2E | Apply → score → hire; project → assign → report → KPI |
| Load | Nightly KPI job with 100+ users |
| AI eval | Golden-set transcripts/resumes; regression on prompt changes |

---

## 11. Team & Roles (building the product)

| Role | Responsibility |
|------|----------------|
| Product / CEO | Prioritize phases, define thresholds, SOP content |
| Full-stack engineer | Phases 0–4 |
| Backend / data engineer | Rules engine, KPI jobs, hiring pipeline |
| ML/AI engineer (part-time) | Phases 5–6 parsers and analyzers |
| Designer | Brand + Control Center UX |
| Ops Manager (pilot user) | UAT from Phase 1 |

---

## 12. Milestone Timeline (summary)

| Phase | Weeks | Theme |
|-------|-------|--------|
| 0 | 1–2 | Scaffold + RBAC |
| 1 | 3–6 | Operations core |
| 2 | 7–10 | Auto rules (approval, assign, payments) |
| 3 | 11–14 | KPI + Control Center |
| 4 | 15–18 | Milestones + escrow + fraud v1 |
| 5 | 19–24 | ATS + hiring scores MVP |
| 6 | 25–32 | Full AI hiring |
| 7 | 33+ | Audit, scale, optimization |

**Estimated MVP (operational platform):** ~14 weeks (Phases 0–3)  
**Estimated hiring automation MVP:** ~24 weeks (through Phase 5)  
**Full vision alignment:** ~32+ weeks (Phase 6–7)

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Over-automation before data quality | Manual override + Ops role; gradual rule rollout |
| AI hiring bias | Audits, explainability, human review band for RS 50–70 |
| Low adoption of daily reports | Blockers on KPI/bonus; Ops follow-up queue |
| Payment integration complexity | Manual escrow flag in Phase 4; Stripe later |
| Scope creep (marketplace features) | Stick to internal structured ecosystem per Foundation |

---

## 14. Definition of Done (platform v1)

- [ ] All roles authenticated with correct permissions  
- [ ] Projects flow with auto-approval and auto-assignment when rules pass  
- [ ] Daily reports drive KPI scores for Worker, Bidder, Caller  
- [ ] Control Center shows green/yellow/red with exception queue  
- [ ] Client risk evaluated before bid acceptance  
- [ ] Milestone payments with automated reminders and work gating  
- [ ] Hiring pipeline produces THS, RS, RP and CEO-filtered queue  
- [ ] Audit log captures overrides and formula versions  
- [ ] SOPs linked and visible per workflow  

---

## 15. Next Steps (immediate)

1. Confirm stack choice (Next.js monolith vs split backend).  
2. Initialize repository and Phase 0 schema.  
3. Write SOP v0 documents (bidding, delivery, payment follow-up) in parallel—content blocks automation.  
4. Define numeric thresholds with CEO (risk 60, margin 25%, scope 80%, etc.).  
5. Pilot with 3–5 users: one Caller, one Bidder, two Engineers, one Ops Manager.  

---

*Development plan derived from Foundation.docx, Hiring template.docx, and how to automate.docx — May 2026.*
