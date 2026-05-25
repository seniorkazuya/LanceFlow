-- HIRE-002: structured resume parse output on applications
ALTER TABLE "hiring_applications" ADD COLUMN "resume_parsed" JSONB;
ALTER TABLE "hiring_applications" ADD COLUMN "resume_parsed_at" TIMESTAMP(3);
ALTER TABLE "hiring_applications" ADD COLUMN "resume_parse_version" TEXT;
