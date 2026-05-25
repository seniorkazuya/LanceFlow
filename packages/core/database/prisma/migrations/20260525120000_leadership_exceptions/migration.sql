-- AUTO-008: leadership exception inbox
CREATE TABLE "leadership_exceptions" (
    "id" TEXT NOT NULL,
    "source_key" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "acknowledged_at" TIMESTAMP(3),
    "acknowledged_by" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_exceptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "leadership_exceptions_source_key_key" ON "leadership_exceptions"("source_key");
CREATE INDEX "leadership_exceptions_status_severity_idx" ON "leadership_exceptions"("status", "severity");
