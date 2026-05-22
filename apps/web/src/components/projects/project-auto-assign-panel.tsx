'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { Button, Input } from '@lanceflow/ui';

import { completeMutation, notifyError } from '@/lib/notify';

type Suggestion = {
  userId: string;
  displayName: string;
  email: string;
  rankScore: number;
};

type Props = {
  projectId: string;
  projectStatus: string;
  autoAssignEnabled: boolean;
};

export function ProjectAutoAssignPanel({
  projectId,
  projectStatus,
  autoAssignEnabled,
}: Props) {
  const router = useRouter();
  const [skillsRaw, setSkillsRaw] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [overrideUserId, setOverrideUserId] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [loading, setLoading] = useState<'run' | 'override' | 'suggestions' | null>(null);
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);

  const loadSuggestions = useCallback(async () => {
    setLoading('suggestions');
    const params = new URLSearchParams();
    if (skillsRaw.trim()) params.set('skills', skillsRaw);
    const res = await fetch(
      `/api/projects/${projectId}/assignment-suggestions?${params.toString()}`
    );
    setLoading(null);
    if (!res.ok) {
      notifyError('Could not load engineers');
      return;
    }
    const data = (await res.json()) as { items: Suggestion[] };
    setSuggestions(data.items);
    if (data.items.length > 0 && !overrideUserId) {
      setOverrideUserId(data.items[0].userId);
    }
  }, [projectId, skillsRaw, overrideUserId]);

  if (!autoAssignEnabled || projectStatus !== 'active') {
    return null;
  }

  function requiredSkills(): string[] {
    return skillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function runAutoAssign() {
    setLoading('run');
    try {
      const res = await fetch(`/api/projects/${projectId}/auto-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requiredSkills: requiredSkills() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.errors?.[0]?.message ?? data.error ?? 'Auto-assign failed';
        notifyError(msg);
        return;
      }

      if (data.skipped) {
        setLastOutcome(`skipped: ${data.reason}`);
        notifyError(`Auto-assign skipped (${data.reason})`);
        return;
      }

      setLastOutcome(data.decision?.outcome ?? 'unknown');
      const successMessage = data.assigned
        ? 'Top-ranked engineer assigned'
        : 'Auto-assign evaluated — no assignment made';
      await completeMutation(router, { successMessage });
    } catch {
      notifyError('Auto-assign request failed');
    } finally {
      setLoading(null);
    }
  }

  async function applyOverride() {
    if (!overrideUserId.trim()) {
      notifyError('Select an engineer for override');
      return;
    }
    setLoading('override');
    try {
      const res = await fetch(`/api/projects/${projectId}/assign-override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: overrideUserId.trim(),
          reason: overrideReason.trim(),
          requiredSkills: requiredSkills(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.errors?.[0]?.message ?? data.error ?? 'Override failed';
        notifyError(msg);
        return;
      }

      setLastOutcome('override');
      await completeMutation(router, { successMessage: 'Assignment override applied' });
    } catch {
      notifyError('Override request failed');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm font-medium text-foreground">Auto-assign on activate (AUTO-003)</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Uses OPS-005 ranking when a project becomes active. Override requires an audited reason.
      </p>
      <div className="mt-3">
        <label className="text-xs text-muted-foreground" htmlFor={`skills-${projectId}`}>
          Required skills (comma-separated, optional)
        </label>
        <Input
          id={`skills-${projectId}`}
          className="mt-1"
          value={skillsRaw}
          onChange={(e) => setSkillsRaw(e.target.value)}
          placeholder="react, node"
        />
      </div>
      {lastOutcome ? (
        <p className="mt-2 text-xs text-muted-foreground">Last outcome: {lastOutcome}</p>
      ) : null}
      <Button
        type="button"
        size="sm"
        className="mt-3"
        disabled={loading !== null}
        onClick={runAutoAssign}
      >
        {loading === 'run' ? 'Assigning…' : 'Run auto-assign'}
      </Button>

      <div className="mt-6 border-t border-white/[0.06] pt-4">
        <p className="text-sm font-medium text-foreground">Manual override (audited)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading !== null}
            onClick={loadSuggestions}
          >
            {loading === 'suggestions' ? 'Loading…' : 'Load engineers'}
          </Button>
        </div>
        {suggestions.length > 0 ? (
          <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto text-sm">
            {suggestions.map((row) => (
              <li key={row.userId}>
                <label className="flex cursor-pointer items-start gap-2">
                  <input
                    type="radio"
                    name={`override-${projectId}`}
                    checked={overrideUserId === row.userId}
                    onChange={() => setOverrideUserId(row.userId)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium text-foreground">{row.displayName}</span>
                    <span className="block text-xs text-muted-foreground">
                      Score {row.rankScore} · {row.email}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : null}
        <Input
          className="mt-2"
          value={overrideReason}
          onChange={(e) => setOverrideReason(e.target.value)}
          placeholder="Reason (min 8 characters)"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mt-3"
          disabled={loading !== null}
          onClick={applyOverride}
        >
          {loading === 'override' ? 'Saving…' : 'Apply override'}
        </Button>
      </div>
    </div>
  );
}
