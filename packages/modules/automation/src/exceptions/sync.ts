import { prisma } from '@lanceflow/database';

import type { UpsertExceptionInput } from './types';

const STALE_PENDING_DAYS = 3;
const HIGH_CLIENT_RISK = 60;
const CRITICAL_CLIENT_RISK = 70;

/** Derive open leadership exceptions from current operational signals. */
export async function collectExceptionCandidates(): Promise<UpsertExceptionInput[]> {
  const items: UpsertExceptionInput[] = [];
  const now = Date.now();
  const staleCutoff = new Date(now - STALE_PENDING_DAYS * 86_400_000);

  const pendingProjects = await prisma.project.findMany({
    where: { status: 'pending_approval' },
    include: { client: { select: { name: true, riskScore: true } } },
    take: 50,
  });

  for (const project of pendingProjects) {
    const stale = project.updatedAt < staleCutoff;
    items.push({
      sourceKey: `project:pending:${project.id}`,
      severity: stale ? 'danger' : 'warning',
      category: 'project_approval',
      title: `Project awaiting approval: ${project.title}`,
      summary: stale
        ? `Pending over ${STALE_PENDING_DAYS} days · client ${project.client.name} · risk ${project.client.riskScore}`
        : `Client ${project.client.name} · margin ${project.profitMarginPct ?? '—'}% · scope ${project.scopeClarityPct ?? '—'}%`,
      entityType: 'project',
      entityId: project.id,
      metadata: { status: project.status, clientRisk: project.client.riskScore },
    });
  }

  const decisions = await prisma.ruleDecision.findMany({
    where: {
      overridden: false,
      outcome: {
        in: ['rejected', 'review_required', 'do_not_proceed', 'no_candidate', 'skipped'],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const seenDecisionKeys = new Set<string>();
  for (const row of decisions) {
    const dedupe = `${row.ruleKey}:${row.entityType}:${row.entityId}`;
    if (seenDecisionKeys.has(dedupe)) continue;
    seenDecisionKeys.add(dedupe);

    const severity =
      row.outcome === 'rejected' || row.outcome === 'do_not_proceed'
        ? 'danger'
        : row.outcome === 'review_required' || row.outcome === 'no_candidate'
          ? 'warning'
          : 'warning';

    items.push({
      sourceKey: `rule:${row.ruleKey}:${row.entityId}`,
      severity,
      category: 'rule_decision',
      title: `Rule ${row.ruleKey} — ${row.outcome}`,
      summary: `Entity ${row.entityType} ${row.entityId} needs leadership review`,
      entityType: row.entityType,
      entityId: row.entityId,
      metadata: { outcome: row.outcome, formulaVersion: row.formulaVersion },
    });
  }

  const escalatedPayments = await prisma.paymentSchedule.findMany({
    where: { status: 'scheduled', escalationLevel: { gte: 2 } },
    include: { project: { select: { title: true } } },
    take: 50,
  });

  for (const payment of escalatedPayments) {
    items.push({
      sourceKey: `payment:escalation:${payment.id}`,
      severity: payment.escalationLevel >= 3 ? 'danger' : 'warning',
      category: 'payment',
      title: `Overdue payment · ${payment.project.title}`,
      summary: `Due ${payment.dueDate.toISOString().slice(0, 10)} · escalation L${payment.escalationLevel} · ${(payment.amountCents / 100).toFixed(2)} ${payment.currency}`,
      entityType: 'payment_schedule',
      entityId: payment.id,
      metadata: {
        projectId: payment.projectId,
        escalationLevel: payment.escalationLevel,
      },
    });
  }

  const riskyClients = await prisma.client.findMany({
    where: { status: 'active', riskScore: { gte: HIGH_CLIENT_RISK } },
    take: 50,
  });

  for (const client of riskyClients) {
    items.push({
      sourceKey: `client:risk:${client.id}`,
      severity: client.riskScore >= CRITICAL_CLIENT_RISK ? 'danger' : 'warning',
      category: 'client_risk',
      title: `Elevated client risk: ${client.name}`,
      summary: `Risk score ${client.riskScore} · source ${client.riskScoreSource}`,
      entityType: 'client',
      entityId: client.id,
      metadata: { riskScore: client.riskScore },
    });
  }

  const activeWithoutEngineer = await prisma.project.findMany({
    where: { status: 'active' },
    include: {
      assignments: { where: { releasedAt: null }, select: { id: true } },
    },
    take: 50,
  });

  for (const project of activeWithoutEngineer) {
    if (project.assignments.length > 0) continue;
    items.push({
      sourceKey: `project:no-assign:${project.id}`,
      severity: 'warning',
      category: 'assignment',
      title: `Active project without engineer: ${project.title}`,
      summary: 'Project is active but has no active assignment',
      entityType: 'project',
      entityId: project.id,
    });
  }

  return items;
}
