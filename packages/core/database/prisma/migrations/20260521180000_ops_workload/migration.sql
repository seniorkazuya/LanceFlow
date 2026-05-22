-- OPS-004: engineer skill tags and assignment workload tracking
ALTER TABLE "users" ADD COLUMN "skill_tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "ops_assignments" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_score" INTEGER,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at" TIMESTAMP(3),

    CONSTRAINT "ops_assignments_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ops_assignments" ADD CONSTRAINT "ops_assignments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ops_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ops_assignments" ADD CONSTRAINT "ops_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
