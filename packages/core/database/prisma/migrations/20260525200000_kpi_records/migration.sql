-- KPI-002: nightly role KPI records per user per period
CREATE TABLE "kpi_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "period_key" TEXT NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "formula_version" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "components" JSONB NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "kpi_records_user_id_period_key_key" ON "kpi_records"("user_id", "period_key");
CREATE INDEX "kpi_records_period_key_idx" ON "kpi_records"("period_key");

ALTER TABLE "kpi_records" ADD CONSTRAINT "kpi_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
