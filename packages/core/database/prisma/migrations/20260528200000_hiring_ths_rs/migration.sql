-- HIRE-004: THS / RS scores and hiring recommendation on applications
ALTER TABLE "hiring_applications" ADD COLUMN "ths_score" INTEGER;
ALTER TABLE "hiring_applications" ADD COLUMN "rs_score" INTEGER;
ALTER TABLE "hiring_applications" ADD COLUMN "hiring_recommendation" TEXT;
ALTER TABLE "hiring_applications" ADD COLUMN "ths_rs_formula_version" TEXT;
ALTER TABLE "hiring_applications" ADD COLUMN "ths_rs_scored_at" TIMESTAMP(3);
