import type { KpiSignalThresholdUpdateInput, KpiSignalThresholdsConfig } from './types';

export type ThresholdValidationError = { field: string; message: string };

function isIntInRange(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

export function validateThresholdUpdate(
  input: KpiSignalThresholdUpdateInput,
  current: KpiSignalThresholdsConfig
): { ok: true; next: KpiSignalThresholdsConfig } | { ok: false; errors: ThresholdValidationError[] } {
  const errors: ThresholdValidationError[] = [];
  const next: KpiSignalThresholdsConfig = {
    kpiScore: { ...current.kpiScore },
    clientRisk: { ...current.clientRisk },
  };

  if (input.kpiScore) {
    const greenMin = input.kpiScore.greenMin ?? next.kpiScore.greenMin;
    const yellowMin = input.kpiScore.yellowMin ?? next.kpiScore.yellowMin;
    if (!isIntInRange(greenMin)) {
      errors.push({ field: 'kpiScore.greenMin', message: 'Must be an integer 0–100' });
    }
    if (!isIntInRange(yellowMin)) {
      errors.push({ field: 'kpiScore.yellowMin', message: 'Must be an integer 0–100' });
    }
    if (greenMin <= yellowMin) {
      errors.push({
        field: 'kpiScore',
        message: 'greenMin must be greater than yellowMin (higher bar for green)',
      });
    }
    if (errors.length === 0) {
      next.kpiScore = { ...next.kpiScore, greenMin, yellowMin };
    }
  }

  if (input.clientRisk) {
    const greenMax = input.clientRisk.greenMax ?? next.clientRisk.greenMax;
    const yellowMax = input.clientRisk.yellowMax ?? next.clientRisk.yellowMax;
    if (!isIntInRange(greenMax)) {
      errors.push({ field: 'clientRisk.greenMax', message: 'Must be an integer 0–100' });
    }
    if (!isIntInRange(yellowMax)) {
      errors.push({ field: 'clientRisk.yellowMax', message: 'Must be an integer 0–100' });
    }
    if (greenMax >= yellowMax) {
      errors.push({
        field: 'clientRisk',
        message: 'greenMax must be less than yellowMax (lower scores are safer)',
      });
    }
    if (errors.length === 0) {
      next.clientRisk = { ...next.clientRisk, greenMax, yellowMax };
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  if (!input.kpiScore && !input.clientRisk) {
    return { ok: false, errors: [{ field: 'body', message: 'No threshold fields provided' }] };
  }
  return { ok: true, next };
}
