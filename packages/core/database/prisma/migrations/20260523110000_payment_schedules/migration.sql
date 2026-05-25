-- AUTO-004: payment schedule per project
CREATE TABLE "payment_schedules" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "due_date" DATE NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "escalation_level" INTEGER NOT NULL DEFAULT 0,
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_schedules_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payment_schedules_project_id_due_date_idx" ON "payment_schedules"("project_id", "due_date");

ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ops_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
