-- AUTO-002: store versioned rule outcomes for automated decisions
CREATE TABLE "rule_decisions" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "rule_key" TEXT NOT NULL,
    "formula_version" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "outcome" TEXT NOT NULL,
    "explanation" JSONB,
    "overridden" BOOLEAN NOT NULL DEFAULT false,
    "actor_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rule_decisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "rule_decisions_entity_type_entity_id_idx" ON "rule_decisions"("entity_type", "entity_id");
