-- PAY-003: milestone due dates drive linked payment schedules for AUTO-005 reminders

ALTER TABLE "project_milestones" ADD COLUMN "due_date" DATE;

ALTER TABLE "payment_schedules" ADD COLUMN "milestone_id" TEXT;

CREATE UNIQUE INDEX "payment_schedules_milestone_id_key" ON "payment_schedules"("milestone_id");

ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "project_milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
