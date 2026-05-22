'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@lanceflow/ui';

import { completeMutation, notifyError, notifySuccess } from '@/lib/notify';

type Props = {
  projectId: string;
  projectStatus: string;
};

export function ProjectAutoApprovePanel({ projectId, projectStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);

  if (projectStatus !== 'pending_approval') {
    return null;
  }

  async function runAutoApprove() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/auto-approve`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data.errors?.[0]?.message ?? data.error ?? 'Auto-approval failed';
        notifyError(msg);
        return;
      }

      setLastOutcome(data.decision?.outcome ?? 'unknown');
      const successMessage =
        data.approved && data.transitioned
          ? 'Project auto-approved and activated'
          : 'Auto-approval evaluated — thresholds not met';
      await completeMutation(router, { successMessage });
    } catch {
      notifyError('Auto-approval request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm font-medium text-foreground">Auto-approval (AUTO-002)</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Approves when client risk &lt; 60, margin &gt; 25%, and scope &gt; 80%. Stores a
        RuleDecision for audit.
      </p>
      {lastOutcome ? (
        <p className="mt-2 text-xs text-muted-foreground">Last outcome: {lastOutcome}</p>
      ) : null}
      <Button
        type="button"
        size="sm"
        className="mt-3"
        disabled={loading}
        onClick={runAutoApprove}
      >
        {loading ? 'Evaluating…' : 'Run auto-approval'}
      </Button>
    </div>
  );
}
