-- KPI-005: configurable green/yellow/red signal thresholds
CREATE TABLE "kpi_signal_thresholds" (
    "metric_key" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "green_min" INTEGER,
    "yellow_min" INTEGER,
    "green_max" INTEGER,
    "yellow_max" INTEGER,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_signal_thresholds_pkey" PRIMARY KEY ("metric_key")
);

INSERT INTO "kpi_signal_thresholds" (
    "metric_key",
    "direction",
    "green_min",
    "yellow_min",
    "green_max",
    "yellow_max",
    "updated_at"
) VALUES
    ('kpi_score', 'asc', 70, 50, NULL, NULL, CURRENT_TIMESTAMP),
    ('client_risk', 'desc', NULL, NULL, 39, 59, CURRENT_TIMESTAMP);
