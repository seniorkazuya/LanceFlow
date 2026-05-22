import type {
  RuleDefinition,
  RuleError,
  RuleExplanation,
  RuleOutcome,
  RuleResult,
} from './types';

export function evaluateRule<TInput, TOutput>(
  rule: RuleDefinition<TInput, TOutput>,
  input: TInput
): RuleResult<TInput, TOutput> {
  const { value, explanation } = rule.evaluate(input);
  return {
    ok: true,
    formulaVersion: rule.formulaVersion,
    value,
    explanation,
    inputs: input,
  };
}

export function evaluateRuleSafe<TInput, TOutput>(
  rule: RuleDefinition<TInput, TOutput>,
  input: TInput,
  validate?: (input: TInput) => string | null
): RuleOutcome<TInput, TOutput> {
  if (validate) {
    const message = validate(input);
    if (message) {
      const err: RuleError<TInput, TOutput> = {
        ok: false,
        formulaVersion: rule.formulaVersion,
        error: message,
        inputs: input,
      };
      return err;
    }
  }
  return evaluateRule(rule, input);
}

export function formatExplanation(explanation: RuleExplanation): string {
  return explanation.join(' → ');
}
