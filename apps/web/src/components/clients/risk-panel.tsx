import { riskBand, riskBandLabel, type ClientRecord } from '@lanceflow/operations';
import { GlassCard, SectionLabel, StatusBadge } from '@lanceflow/ui';

function riskStatus(score: number): 'success' | 'warning' | 'danger' {
  const band = riskBand(score);
  if (band === 'low') return 'success';
  if (band === 'medium') return 'warning';
  return 'danger';
}

function sourceLabel(source: ClientRecord['riskScoreSource']): string {
  switch (source) {
    case 'manual':
      return 'Manual override';
    case 'evaluated':
      return 'Formula evaluation';
    default:
      return 'Default (on create)';
  }
}

export type RiskPanelProps = {
  client: ClientRecord;
};

/** Prominent risk display for Ops and Bidder (OPS-002). */
export function RiskPanel({ client }: RiskPanelProps) {
  const band = riskBand(client.riskScore);

  return (
    <GlassCard variant="strong" className="p-5 md:p-6">
      <SectionLabel>client risk</SectionLabel>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
            {client.riskScore}
          </span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
        <StatusBadge status={riskStatus(client.riskScore)} label={riskBandLabel(band)} />
      </div>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Source</dt>
          <dd className="font-medium text-foreground">{sourceLabel(client.riskScoreSource)}</dd>
        </div>
        {client.riskFormulaVersion ? (
          <div>
            <dt className="text-muted-foreground">Formula</dt>
            <dd className="font-mono text-xs text-foreground">{client.riskFormulaVersion}</dd>
          </div>
        ) : null}
        {client.riskOverrideReason ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Override reason</dt>
            <dd className="text-foreground">{client.riskOverrideReason}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        Planning threshold: scores below 60 are safer for auto-approval paths (AUTO-006).
      </p>
    </GlassCard>
  );
}
