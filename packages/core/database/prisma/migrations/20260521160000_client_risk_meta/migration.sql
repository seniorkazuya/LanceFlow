-- AlterTable
ALTER TABLE "ops_clients" ADD COLUMN "risk_score_source" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "ops_clients" ADD COLUMN "risk_formula_version" TEXT;
ALTER TABLE "ops_clients" ADD COLUMN "risk_override_reason" TEXT;
