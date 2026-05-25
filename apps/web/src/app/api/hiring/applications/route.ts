import { parseHiringApplyRole, submitHiringApplication } from '@lanceflow/hiring';
import { NextResponse } from 'next/server';

import { withApiLogging } from '@/lib/api-route';

const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx']);

function mimeFromFileName(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'doc') return 'application/msword';
  if (ext === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return 'application/octet-stream';
}

/** Public candidate application (HIRE-001) — no auth. */
export const POST = withApiLogging('/api/hiring/applications', async (request: Request) => {
  const form = await request.formData();
  const fullName = String(form.get('fullName') ?? '');
  const email = String(form.get('email') ?? '');
  const roleRaw = String(form.get('roleApplied') ?? '');
  const consent = form.get('consentGiven') === 'true' || form.get('consentGiven') === 'on';
  const file = form.get('resume');

  const roleApplied = parseHiringApplyRole(roleRaw);
  if (!roleApplied) {
    return NextResponse.json(
      { errors: [{ field: 'roleApplied', message: 'Invalid role' }] },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { errors: [{ field: 'resume', message: 'Resume file is required' }] },
      { status: 400 }
    );
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { errors: [{ field: 'resume', message: 'Resume must be .pdf, .doc, or .docx' }] },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || mimeFromFileName(file.name);

  const result = await submitHiringApplication({
    fullName,
    email,
    roleApplied,
    consentGiven: consent,
    resumeFileName: file.name,
    resumeMimeType: mimeType,
    resumeBytes: bytes,
  });

  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json(
    {
      applicationId: result.application.id,
      message: 'Application received. Our team will follow up by email.',
    },
    { status: 201 }
  );
});
