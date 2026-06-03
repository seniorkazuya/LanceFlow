-- HIRE-003: coding assessment score on applications
ALTER TABLE "hiring_applications" ADD COLUMN "technical_score" INTEGER;
ALTER TABLE "hiring_applications" ADD COLUMN "technical_score_at" TIMESTAMP(3);
ALTER TABLE "hiring_applications" ADD COLUMN "technical_score_source" TEXT;
