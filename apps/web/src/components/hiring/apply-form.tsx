'use client';

import { HIRING_APPLY_ROLES, MAX_RESUME_BYTES } from '@lanceflow/hiring/client';
import { useState } from 'react';

const ROLE_LABELS: Record<(typeof HIRING_APPLY_ROLES)[number], string> = {
  ENGINEER: 'Engineer',
  BIDDER: 'Bidder',
  CALLER: 'Caller',
};

type FieldError = { field: string; message: string };

type HiringApplyFormProps = {
  defaultFullName?: string;
  defaultEmail?: string;
  signedIn?: boolean;
};

export function HiringApplyForm({
  defaultFullName = '',
  defaultEmail = '',
  signedIn = false,
}: HiringApplyFormProps = {}) {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

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
      setFormKey((key) => key + 1);
    } catch {
      setErrors([{ field: 'form', message: 'Network error — try again' }]);
    }

    setPending(false);
  }

  function errorFor(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  return (
    <div className="card apply-form-card">
      <p className="apply-form-eyebrow">Application</p>
      {signedIn ? (
        <p className="apply-form-intro">
          Your account is active. Submit your resume and choose the role track you are applying
          for (Engineer, Bidder, or Caller). Ops will review you in the hiring pipeline.
        </p>
      ) : null}

      <form key={formKey} onSubmit={onSubmit} className="apply-form" noValidate>
        <div className="field">
          <label htmlFor="apply-fullName">Full name</label>
          <input
            id="apply-fullName"
            name="fullName"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            defaultValue={defaultFullName}
            placeholder="Your full name"
          />
          {errorFor('fullName') ? <span className="field-error">{errorFor('fullName')}</span> : null}
        </div>

        <div className="field">
          <label htmlFor="apply-email">Email</label>
          <input
            id="apply-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaultEmail}
            readOnly={signedIn && Boolean(defaultEmail)}
            placeholder="you@email.com"
          />
          {errorFor('email') ? <span className="field-error">{errorFor('email')}</span> : null}
        </div>

        <div className="field">
          <label htmlFor="apply-role">Role</label>
          <select id="apply-role" name="roleApplied" required defaultValue="">
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
            <span className="field-error">{errorFor('roleApplied')}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="apply-resume">Resume (PDF or Word, max 5MB)</label>
          <input
            id="apply-resume"
            name="resume"
            type="file"
            required
            className="file-input"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          {errorFor('resume') ? <span className="field-error">{errorFor('resume')}</span> : null}
        </div>

        <label className="consent-row">
          <input name="consentGiven" type="checkbox" required />
          <span>
            I consent to LanceFlow storing my application and resume for hiring evaluation, and
            contacting me about this application.
          </span>
        </label>
        {errorFor('consentGiven') ? (
          <p className="field-error">{errorFor('consentGiven')}</p>
        ) : null}

        {errorFor('form') ? (
          <p role="alert" className="field-error">
            {errorFor('form')}
          </p>
        ) : null}

        {success ? (
          <p role="status" className="form-success">
            {success}
          </p>
        ) : null}

        <button className="btn btn-primary apply-submit" type="submit" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </div>
  );
}
