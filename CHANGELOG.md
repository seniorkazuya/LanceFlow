# Changelog

All notable changes to the LanceFlow application are documented here.

## [Unreleased]

### Added

- **DEV-007** — `@lanceflow/config` health checks, structured API JSON logs, optional Sentry, `/api/health` DB+Redis status
- **DEV-006** — Docker Compose (Postgres 16, Redis 7, optional MinIO profile), README local stack docs
- **DEV-005** — Deploy Production workflow (tag `v*` + manual), DEPLOY_PRODUCTION.md with rollback runbook
- **DEV-004** — Deploy Staging workflow (Neon migrate, Vercel, health check), initial Prisma migration, DEPLOY_STAGING.md
- **DEV-003** — GitHub Actions CI (lint, typecheck, test, build), Vitest unit/integration tests, ESLint for web
- **DEV-002** — GitHub PR/issue templates, CODEOWNERS, Dependabot, branch protection on `main`/`staging`, setup docs
- **DEV-001** — Monorepo with Turborepo, Next.js 15 (`apps/web`), `@lanceflow/types`, `@lanceflow/database` (Prisma schema placeholder), `/api/health`

## [0.1.0] — 2026-05-21

M0 platform release: monorepo, CI, staging deployment (Vercel + Neon), production deploy workflow, Docker local stack.
