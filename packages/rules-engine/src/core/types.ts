/** Human-readable steps produced during rule evaluation. */
export type RuleExplanation = readonly string[];

export type RuleEvaluation<TOutput> = {
  value: TOutput;
  explanation: RuleExplanation;
};

export type RuleDefinition<TInput, TOutput> = {
  formulaVersion: string;
  evaluate: (input: TInput) => RuleEvaluation<TOutput>;
};

export type RuleResult<TInput, TOutput> = {
  ok: true;
  formulaVersion: string;
  value: TOutput;
  explanation: RuleExplanation;
  inputs: TInput;
};

export type RuleFailure<TInput> = {
  ok: false;
  formulaVersion: string;
  error: string;
  inputs: TInput;
};

export type RuleOutcome<TInput, TOutput> =
  | RuleResult<TInput, TOutput>
  | RuleFailure<TInput>;
