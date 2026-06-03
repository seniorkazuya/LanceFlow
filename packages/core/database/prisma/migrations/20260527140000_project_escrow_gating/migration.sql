-- PAY-002: escrow hold and Ops override for work gating
ALTER TABLE "ops_projects" ADD COLUMN "escrow_held" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ops_projects" ADD COLUMN "escrow_override_reason" TEXT;
ALTER TABLE "ops_projects" ADD COLUMN "escrow_override_by" TEXT;
ALTER TABLE "ops_projects" ADD COLUMN "escrow_override_at" TIMESTAMP(3);
