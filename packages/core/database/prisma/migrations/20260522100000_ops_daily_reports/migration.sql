-- OPS-006: daily self-reports (one per user/project/day)
CREATE TABLE "ops_daily_reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "report_date" DATE NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "progress_pct" INTEGER NOT NULL,
    "issues" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ops_daily_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ops_daily_reports_user_id_project_id_report_date_key" ON "ops_daily_reports"("user_id", "project_id", "report_date");

ALTER TABLE "ops_daily_reports" ADD CONSTRAINT "ops_daily_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ops_daily_reports" ADD CONSTRAINT "ops_daily_reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ops_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
