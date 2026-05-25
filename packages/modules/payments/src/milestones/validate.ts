import type { ProjectMilestoneInput } from './types';

export type MilestoneValidationError = { field: string; message: string };

/** PAY-001 — milestone percentages must sum to exactly 100. */
export function validateProjectMilestones(
  milestones: ProjectMilestoneInput[]
): MilestoneValidationError[] {
  const errors: MilestoneValidationError[] = [];

  if (!milestones.length) {
    errors.push({ field: 'milestones', message: 'At least one milestone is required' });
    return errors;
  }

  if (milestones.length > 20) {
    errors.push({ field: 'milestones', message: 'Maximum 20 milestones per project' });
  }

  let sum = 0;
  milestones.forEach((m, index) => {
    const label = m.label?.trim() ?? '';
    if (!label) {
      errors.push({ field: `milestones[${index}].label`, message: 'Label is required' });
    } else if (label.length > 120) {
      errors.push({ field: `milestones[${index}].label`, message: 'Label must be 120 characters or less' });
    }

    if (!Number.isInteger(m.percentPct) || m.percentPct < 1 || m.percentPct > 100) {
      errors.push({
        field: `milestones[${index}].percentPct`,
        message: 'percentPct must be an integer from 1 to 100',
      });
    } else {
      sum += m.percentPct;
    }
  });

  if (sum !== 100) {
    errors.push({
      field: 'milestones',
      message: `Milestone percentages must sum to 100 (current sum: ${sum})`,
    });
  }

  return errors;
}
