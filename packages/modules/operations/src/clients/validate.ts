import { CLIENT_STATUSES, type ClientValidationError, type CreateClientInput, type UpdateClientInput } from './types';

export function validateCreateClientInput(input: CreateClientInput): ClientValidationError[] {
  const errors: ClientValidationError[] = [];
  const name = input.name?.trim();
  if (!name) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.length > 200) {
    errors.push({ field: 'name', message: 'Name must be 200 characters or fewer' });
  }

  if (input.contactEmail !== undefined && input.contactEmail !== null) {
    const email = input.contactEmail.trim();
    if (email && !email.includes('@')) {
      errors.push({ field: 'contactEmail', message: 'Invalid email' });
    }
  }

  if (input.riskScore !== undefined) {
    if (!Number.isInteger(input.riskScore) || input.riskScore < 0 || input.riskScore > 100) {
      errors.push({ field: 'riskScore', message: 'Risk score must be 0–100' });
    }
  }

  return errors;
}

export function validateUpdateClientInput(input: UpdateClientInput): ClientValidationError[] {
  const errors: ClientValidationError[] = [];

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (name.length > 200) {
      errors.push({ field: 'name', message: 'Name must be 200 characters or fewer' });
    }
  }

  if (input.contactEmail !== undefined && input.contactEmail !== null) {
    const email = input.contactEmail.trim();
    if (email && !email.includes('@')) {
      errors.push({ field: 'contactEmail', message: 'Invalid email' });
    }
  }

  if (input.status !== undefined && !CLIENT_STATUSES.includes(input.status)) {
    errors.push({ field: 'status', message: 'Invalid status' });
  }

  if (input.riskScore !== undefined) {
    if (!Number.isInteger(input.riskScore) || input.riskScore < 0 || input.riskScore > 100) {
      errors.push({ field: 'riskScore', message: 'Risk score must be 0–100' });
    }
  }

  return errors;
}
