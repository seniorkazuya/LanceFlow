import type { HiringDecision } from '../types';

export type CandidateDecisionEmailContent = {
  subject: string;
  text: string;
  html: string;
};

function greeting(fullName: string): string {
  const trimmed = fullName.trim();
  return trimmed.length > 0 ? trimmed : 'there';
}

function roleLabel(roleApplied: string): string {
  const normalized = roleApplied.trim().replace(/_/g, ' ').toLowerCase();
  return normalized.length > 0 ? normalized : 'the role you applied for';
}

/** Reject / Hold / Hire templates (HIRE-008). Fast Track uses an expedited hire variant. */
export function buildCandidateDecisionEmail(input: {
  decision: HiringDecision;
  fullName: string;
  roleApplied: string;
}): CandidateDecisionEmailContent {
  const name = greeting(input.fullName);
  const role = roleLabel(input.roleApplied);

  switch (input.decision) {
    case 'Reject':
      return {
        subject: 'Update on your LanceFlow application',
        text: [
          `Hi ${name},`,
          '',
          `Thank you for applying for ${role} at LanceFlow.`,
          '',
          'After reviewing your application, we will not be moving forward at this time.',
          'We appreciate the time you invested and wish you success in your search.',
          '',
          '— LanceFlow Hiring',
        ].join('\n'),
        html: [
          `<p>Hi ${escapeHtml(name)},</p>`,
          `<p>Thank you for applying for <strong>${escapeHtml(role)}</strong> at LanceFlow.</p>`,
          '<p>After reviewing your application, we will not be moving forward at this time.</p>',
          '<p>We appreciate the time you invested and wish you success in your search.</p>',
          '<p>— LanceFlow Hiring</p>',
        ].join('\n'),
      };
    case 'Hold':
      return {
        subject: 'Your LanceFlow application is on hold',
        text: [
          `Hi ${name},`,
          '',
          `Thank you for applying for ${role} at LanceFlow.`,
          '',
          'Your application remains under review. We will reach out when there is a next step.',
          'No action is required from you right now.',
          '',
          '— LanceFlow Hiring',
        ].join('\n'),
        html: [
          `<p>Hi ${escapeHtml(name)},</p>`,
          `<p>Thank you for applying for <strong>${escapeHtml(role)}</strong> at LanceFlow.</p>`,
          '<p>Your application remains under review. We will reach out when there is a next step.</p>',
          '<p>No action is required from you right now.</p>',
          '<p>— LanceFlow Hiring</p>',
        ].join('\n'),
      };
    case 'Fast Track':
      return {
        subject: 'Next steps — LanceFlow application (fast track)',
        text: [
          `Hi ${name},`,
          '',
          `Great news — your application for ${role} is moving forward on our fast-track path.`,
          'Our team will contact you shortly with interview scheduling details.',
          '',
          '— LanceFlow Hiring',
        ].join('\n'),
        html: [
          `<p>Hi ${escapeHtml(name)},</p>`,
          `<p>Great news — your application for <strong>${escapeHtml(role)}</strong> is moving forward on our fast-track path.</p>`,
          '<p>Our team will contact you shortly with interview scheduling details.</p>',
          '<p>— LanceFlow Hiring</p>',
        ].join('\n'),
      };
    case 'Hire':
      return {
        subject: 'Next steps — LanceFlow application',
        text: [
          `Hi ${name},`,
          '',
          `Thank you for applying for ${role} at LanceFlow.`,
          '',
          'We would like to move forward with your application. Our team will contact you soon with next steps.',
          '',
          '— LanceFlow Hiring',
        ].join('\n'),
        html: [
          `<p>Hi ${escapeHtml(name)},</p>`,
          `<p>Thank you for applying for <strong>${escapeHtml(role)}</strong> at LanceFlow.</p>`,
          '<p>We would like to move forward with your application. Our team will contact you soon with next steps.</p>',
          '<p>— LanceFlow Hiring</p>',
        ].join('\n'),
      };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
