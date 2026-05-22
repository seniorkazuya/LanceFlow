export type RuleDecisionRecord = {
  id: string;
  entityType: string;
  entityId: string;
  ruleKey: string;
  formulaVersion: string;
  inputs: Record<string, unknown>;
  outcome: string;
  explanation: string[];
  overridden: boolean;
  actorId: string | null;
  createdAt: Date;
};

export type CreateRuleDecisionInput = {
  entityType: string;
  entityId: string;
  ruleKey: string;
  formulaVersion: string;
  inputs: Record<string, unknown>;
  outcome: string;
  explanation: string[];
  actorId?: string | null;
};
