-- AI-001 — written communication scores (grammar, clarity, persuasion)
ALTER TABLE "hiring_applications"
  ADD COLUMN "communication_scores" JSONB,
  ADD COLUMN "communication_scored_at" TIMESTAMP(3),
  ADD COLUMN "communication_llm_calls" INTEGER NOT NULL DEFAULT 0;
