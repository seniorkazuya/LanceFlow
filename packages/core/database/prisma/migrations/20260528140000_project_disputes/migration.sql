-- PAY-005: dispute workflow per project

CREATE TABLE "project_disputes" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'open',
    "sop_link_id" TEXT,
    "escalated_at" TIMESTAMP(3),
    "escalated_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "resolution_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_disputes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "project_disputes_project_id_status_idx" ON "project_disputes"("project_id", "status");

ALTER TABLE "project_disputes" ADD CONSTRAINT "project_disputes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ops_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
