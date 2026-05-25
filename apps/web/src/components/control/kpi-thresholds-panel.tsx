'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button, GlassCard, Input } from '@lanceflow/ui';

type ThresholdsResponse = {
  kpiScore: { greenMin: number; yellowMin: number };
  clientRisk: { greenMax: number; yellowMax: number; highRiskMinScore: number };
};

export function KpiThresholdsPanel() {
  const [data, setData] = useState<ThresholdsResponse | null>(null);
  const [kpiGreen, setKpiGreen] = useState('');
  const [kpiYellow, setKpiYellow] = useState('');
  const [riskGreen, setRiskGreen] = useState('');
  const [riskYellow, setRiskYellow] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/control-center/thresholds');
      const json = (await res.json()) as ThresholdsResponse & { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Failed to load thresholds');
        return;
      }
      setData(json);
      setKpiGreen(String(json.kpiScore.greenMin));
      setKpiYellow(String(json.kpiScore.yellowMin));
      setRiskGreen(String(json.clientRisk.greenMax));
      setRiskYellow(String(json.clientRisk.yellowMax));
    } catch {
      setError('Failed to load thresholds');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/control-center/thresholds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpiScore: { greenMin: Number(kpiGreen), yellowMin: Number(kpiYellow) },
          clientRisk: { greenMax: Number(riskGreen), yellowMax: Number(riskYellow) },
        }),
      });
      const json = (await res.json()) as ThresholdsResponse & {
        error?: string;
        errors?: { field: string; message: string }[];
      };
      if (!res.ok) {
        const detail = json.errors?.map((e) => e.message).join(' · ') ?? json.error ?? 'Save failed';
        setError(detail);
        return;
      }
      setData(json);
      setMessage('Thresholds saved — changes are audited.');
      setKpiGreen(String(json.kpiScore.greenMin));
      setKpiYellow(String(json.kpiScore.yellowMin));
      setRiskGreen(String(json.clientRisk.greenMax));
      setRiskYellow(String(json.clientRisk.yellowMax));
    } catch {
      setError('Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading && !data) {
    return <p className="text-sm text-muted-foreground">Loading signal thresholds…</p>;
  }

  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">Signal thresholds</p>
          <p className="mt-1 text-sm text-muted-foreground">
            CEO-only. Green / yellow / red bands for KPI scores and client risk (audited).
          </p>
        </div>
        <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={() => void save()}>
          {saving ? 'Saving…' : 'Save thresholds'}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <fieldset className="space-y-3">
          <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            KPI score (higher is better)
          </legend>
          <label className="block text-sm">
            <span className="text-muted-foreground">Green at ≥</span>
            <Input
              className="mt-1"
              type="number"
              min={0}
              max={100}
              value={kpiGreen}
              onChange={(e) => setKpiGreen(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Yellow at ≥</span>
            <Input
              className="mt-1"
              type="number"
              min={0}
              max={100}
              value={kpiYellow}
              onChange={(e) => setKpiYellow(e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Client risk (lower is better)
          </legend>
          <label className="block text-sm">
            <span className="text-muted-foreground">Green at ≤</span>
            <Input
              className="mt-1"
              type="number"
              min={0}
              max={100}
              value={riskGreen}
              onChange={(e) => setRiskGreen(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Yellow at ≤</span>
            <Input
              className="mt-1"
              type="number"
              min={0}
              max={100}
              value={riskYellow}
              onChange={(e) => setRiskYellow(e.target.value)}
            />
          </label>
          {data ? (
            <p className="text-xs text-muted-foreground">
              High-risk client count uses score ≥ {data.clientRisk.highRiskMinScore}
            </p>
          ) : null}
        </fieldset>
      </div>
    </GlassCard>
  );
}
