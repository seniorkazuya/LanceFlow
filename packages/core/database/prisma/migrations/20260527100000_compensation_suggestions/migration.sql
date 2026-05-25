-- KPI-006: bonus/penalty suggestions from KPI scores (Ops approves)
CREATE TABLE "compensation_suggestions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "period_key" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "percent_bps" INTEGER NOT NULL,
    "kpi_score" INTEGER NOT NULL,
    "formula_version" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compensation_suggestions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "compensation_suggestions_user_id_period_key_key" ON "compensation_suggestions"("user_id", "period_key");
CREATE INDEX "compensation_suggestions_status_period_key_idx" ON "compensation_suggestions"("status", "period_key");

ALTER TABLE "compensation_suggestions" ADD CONSTRAINT "compensation_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
