import {
  PROJECT_STATUSES,
  type CreateProjectInput,
  type ProjectStatus,
  type ProjectValidationError,
  type UpdateProjectInput,
} from './types';

function validatePct(field: string, value: number | null | undefined): ProjectValidationError[] {
  if (value === undefined || value === null) return [];
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    return [{ field, message: 'Must be an integer 0–100' }];
  }
  return [];
}

export function validateCreateProjectInput(input: CreateProjectInput): ProjectValidationError[] {
  const errors: ProjectValidationError[] = [];
  if (!input.clientId?.trim()) {
    errors.push({ field: 'clientId', message: 'Client is required' });
  }
  const title = input.title?.trim();
  if (!title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be 200 characters or fewer' });
  }
  errors.push(...validatePct('scopeClarityPct', input.scopeClarityPct));
  errors.push(...validatePct('profitMarginPct', input.profitMarginPct));
  return errors;
}

export function validateUpdateProjectInput(input: UpdateProjectInput): ProjectValidationError[] {
  const errors: ProjectValidationError[] = [];
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) errors.push({ field: 'title', message: 'Title is required' });
  }
  errors.push(...validatePct('scopeClarityPct', input.scopeClarityPct));
  errors.push(...validatePct('profitMarginPct', input.profitMarginPct));
  return errors;
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}
