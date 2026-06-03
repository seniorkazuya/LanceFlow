import {
  COMMUNICATION_FORMULA_VERSION,
  type CommunicationScores,
} from './schema';

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9'-]/g, ''))
    .filter((w) => w.length > 0);
}

/** Heuristic written-communication scores from resume/cover letter text (AI-001 fallback). */
export function scoreCommunicationHeuristic(text: string): CommunicationScores {
  const trimmed = text.trim();
  const wordList = words(trimmed);
  const sentenceList = sentences(trimmed);
  const wordCount = wordList.length;
  const sentenceCount = Math.max(sentenceList.length, 1);
  const avgWordsPerSentence = wordCount / sentenceCount;

  const typoSignals =
    (trimmed.match(/\b(teh|recieve|seperate|definately|alot)\b/gi) ?? []).length +
    (trimmed.match(/[A-Z]{4,}/g) ?? []).length * 0.5;
  const grammarBase = 72 - typoSignals * 8;
  const grammar =
    grammarBase +
    (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 28 ? 12 : -10) +
    (trimmed.match(/[.!?]{2,}/g) ? -8 : 0);

  const clarityBase = 65;
  const clarity =
    clarityBase +
    (wordCount >= 120 ? 15 : wordCount >= 60 ? 8 : -12) +
    (avgWordsPerSentence >= 6 && avgWordsPerSentence <= 22 ? 12 : -8) +
    (sentenceCount >= 4 ? 8 : 0);

  const persuasionVerbs =
    trimmed.match(
      /\b(led|drove|delivered|achieved|increased|reduced|improved|built|launched|closed|won|grew)\b/gi
    ) ?? [];
  const metrics = trimmed.match(/\b\d{1,3}(%|k|m)?\b/gi) ?? [];
  const persuasion =
    58 +
    Math.min(22, persuasionVerbs.length * 4) +
    Math.min(15, metrics.length * 3) +
    (trimmed.match(/\b(customer|client|revenue|pipeline|conversion)\b/gi) ? 8 : 0);

  return {
    grammar: clampScore(grammar),
    clarity: clampScore(clarity),
    persuasion: clampScore(persuasion),
    formulaVersion: COMMUNICATION_FORMULA_VERSION,
    source: 'heuristic',
  };
}
