'use client';

import { Button, Input, StatusBadge } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { notifyError, notifySuccess } from '@/lib/notify';

type Suggestion = {
  userId: string;
  displayName: string;
  email: string;
  skillTags: string[];
  activeAssignmentCount: number;
  skillMatchPct: number;
  rankScore: number;
};

type AssignmentPanelProps = {
  projectId: string;
  projectStatus: string;
};

const ASSIGNABLE = ['pending_approval', 'active'];

export function ProjectAssignmentPanel({ projectId, projectStatus }: AssignmentPanelProps) {
  const router = useRouter();
  const [skillsRaw, setSkillsRaw] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAssign = ASSIGNABLE.includes(projectStatus);

  const loadSuggestions = useCallback(async () => {
    setError(null);
    setLoading(true);
    const params = new URLSearchParams();
    if (skillsRaw.trim()) params.set('skills', skillsRaw);
    const res = await fetch(
      `/api/projects/${projectId}/assignment-suggestions?${params.toString()}`
    );
    setLoading(false);
    if (!res.ok) {
      setError('Could not load suggestions');
      notifyError('Could not load suggestions');
      return;
    }
    const data = (await res.json()) as { items: Suggestion[] };
    setSuggestions(data.items);
  }, [projectId, skillsRaw]);

  async function assignEngineer(userId: string) {
    setError(null);
    setAssigningId(userId);
    const requiredSkills = skillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch(`/api/projects/${projectId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, requiredSkills }),
    });

    setAssigningId(null);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      const message = data.errors?.[0]?.message ?? 'Assign failed';
      setError(message);
      notifyError(message);
      return;
    }

    notifySuccess('Engineer assigned');
    router.refresh();
    await loadSuggestions();
  }

  if (!canAssign) {
    return (
      <p className="text-sm text-muted-foreground">
        Move project to <strong>pending approval</strong> or <strong>active</strong> to assign
        engineers.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Required skills</span>
        <span className="text-xs text-muted-foreground">
          Comma-separated tags used for ranking (OPS-005 formula v1).
        </span>
        <Input
          value={skillsRaw}
          onChange={(e) => setSkillsRaw(e.target.value)}
          placeholder="react, typescript, node"
        />
      </label>
      <Button type="button" size="sm" variant="secondary" disabled={loading} onClick={loadSuggestions}>
        {loading ? 'Ranking…' : 'Rank engineers'}
      </Button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {suggestions.length > 0 ? (
        <ul className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.06]">
          {suggestions.map((row, index) => (
            <li
              key={row.userId}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  {index === 0 ? '★ ' : ''}
                  {row.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Match {row.skillMatchPct}% · Workload {row.activeAssignmentCount} · Score{' '}
                  {row.rankScore}
                </p>
                {row.skillTags.length > 0 ? (
                  <p className="text-xs text-muted-foreground">{row.skillTags.join(' · ')}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={row.rankScore >= 40 ? 'success' : 'warning'}
                  label={`${row.rankScore}`}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={assigningId === row.userId}
                  onClick={() => assignEngineer(row.userId)}
                >
                  {assigningId === row.userId ? 'Assigning…' : 'Assign'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
