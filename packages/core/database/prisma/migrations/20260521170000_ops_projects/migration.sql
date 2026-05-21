-- CreateTable
CREATE TABLE "ops_projects" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scope_clarity_pct" INTEGER,
    "profit_margin_pct" INTEGER,
    "client_risk_at_create" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ops_projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ops_projects" ADD CONSTRAINT "ops_projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "ops_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
