-- CreateTable
CREATE TABLE "ops_clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "risk_score" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ops_clients_pkey" PRIMARY KEY ("id")
);
