'use client';

import { Button, GlassCard, Input, SectionLabel } from '@lanceflow/ui';
import { HIRING_APPLY_ROLES, MAX_RESUME_BYTES } from '@lanceflow/hiring';
import { useState } from 'react';

const ROLE_LABELS: Record<(typeof HIRING_APPLY_ROLES)[number], string> = {
  ENGINEER: 'Engineer',
  BIDDER: 'Bidder',
  CALLER: 'Caller',
};

type FieldError = { field: string; message: string };

export function HiringApplyForm() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setSuccess(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const file = form.get('resume');
    if (file instanceof File && file.size > MAX_RESUME_BYTES) {
      setErrors([
        {
          field: 'resume',
          message: `Resume must be ${MAX_RESUME_BYTES / (1024 * 1024)}MB or less`,
        },
      ]);
      setPending(false);
      return;
    }

    form.set('consentGiven', form.get('consentGiven') ? 'true' : 'false');

    try {
      const res = await fetch('/api/hiring/applications', { method: 'POST', body: form });
      const data = (await res.json()) as {
        errors?: FieldError[];
        message?: string;
        applicationId?: string;
      };

      if (!res.ok) {
        setErrors(data.errors ?? [{ field: 'form', message: 'Submission failed' }]);
        setPending(false);
        return;
      }

      setSuccess(data.message ?? 'Application received.');
      event.currentTarget.reset();
    } catch {
      setErrors([{ field: 'form', message: 'Network error — try again' }]);
    }

    setPending(false);
  }

  function errorFor(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  return (
    <GlassCard className="p-6 md:p-8">
      <SectionLabel>application</SectionLabel>
      <form onSubmit={onSubmit} className="mt-6 grid gap-5">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Full name</span>
          <Input name="fullName" required maxLength={120} autoComplete="name" />
          {errorFor('fullName') ? (
            <span className="text-destructive">{errorFor('fullName')}</span>
          ) : null}
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Email</span>
          <Input name="email" type="email" required autoComplete="email" />
          {errorFor('email') ? (
            <span className="text-destructive">{errorFor('email')}</span>
          ) : null}
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Role</span>
          <select
            name="roleApplied"
            required
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            defaultValue=""
          >
            <option value="" disabled>
              Select a role
            </option>
            {HIRING_APPLY_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
          {errorFor('roleApplied') ? (
            <span className="text-destructive">{errorFor('roleApplied')}</span>
          ) : null}
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Resume (PDF or Word, max 5MB)</span>
          <Input
            name="resume"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          {errorFor('resume') ? (
            <span className="text-destructive">{errorFor('resume')}</span>
          ) : null}
        </label>

        <label className="flex items-start gap-3 text-sm">
          <input
            name="consentGiven"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-input"
            required
          />
          <span className="text-muted-foreground">
            I consent to LanceFlow storing my application and resume for hiring evaluation, and
            contacting me about this application.
          </span>
        </label>
        {errorFor('consentGiven') ? (
          <p className="text-sm text-destructive">{errorFor('consentGiven')}</p>
        ) : null}

        {errorFor('form') ? (
          <p role="alert" className="text-sm text-destructive">
            {errorFor('form')}
          </p>
        ) : null}

        {success ? (
          <p role="status" className="text-sm text-primary">
            {success}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? 'Submitting…' : 'Submit application'}
        </Button>
      </form>
    </GlassCard>
  );
}
