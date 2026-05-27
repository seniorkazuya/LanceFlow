-- HIRE-006 — effective hiring decision + override audit fields
ALTER TABLE "hiring_applications"
  ADD COLUMN "hiring_decision" TEXT,
  ADD COLUMN "hiring_decision_source" TEXT,
  ADD COLUMN "hiring_decision_at" TIMESTAMP(3),
  ADD COLUMN "hiring_decision_override_reason" TEXT,
  ADD COLUMN "rp_score" INTEGER;

UPDATE "hiring_applications"
SET
  "hiring_decision" = "hiring_recommendation",
  "hiring_decision_source" = 'rule',
  "hiring_decision_at" = "ths_rs_scored_at"
WHERE "hiring_recommendation" IS NOT NULL;
