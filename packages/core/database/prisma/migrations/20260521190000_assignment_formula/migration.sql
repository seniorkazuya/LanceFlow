-- OPS-005: store formula version on assignment snapshots
ALTER TABLE "ops_assignments" ADD COLUMN "formula_version" TEXT;
