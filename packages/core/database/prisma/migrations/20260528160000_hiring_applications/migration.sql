-- HIRE-001: candidate applications with resume storage key

CREATE TABLE "hiring_applications" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role_applied" TEXT NOT NULL,
    "resume_storage_key" TEXT NOT NULL,
    "resume_file_name" TEXT NOT NULL,
    "resume_mime_type" TEXT,
    "resume_size_bytes" INTEGER NOT NULL,
    "consent_given" BOOLEAN NOT NULL,
    "consent_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hiring_applications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "hiring_applications_email_idx" ON "hiring_applications"("email");
CREATE INDEX "hiring_applications_role_applied_status_idx" ON "hiring_applications"("role_applied", "status");
