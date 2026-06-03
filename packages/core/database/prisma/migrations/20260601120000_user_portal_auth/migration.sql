-- Portal sign-up: email/password for client and developer accounts
ALTER TABLE "users" ADD COLUMN "account_type" TEXT NOT NULL DEFAULT 'staff';
ALTER TABLE "users" ADD COLUMN "password_hash" TEXT;
