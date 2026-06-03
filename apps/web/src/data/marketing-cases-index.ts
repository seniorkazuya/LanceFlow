import { CASE_DATA } from '@/data/marketing-cases';
import type { MarketingCase } from '@/data/marketing-case-types';

const cases = CASE_DATA as MarketingCase[];

export function getAllMarketingCases(): MarketingCase[] {
  return cases;
}

export function getMarketingCase(id: string): MarketingCase | undefined {
  return cases.find((c) => c.id === id);
}

export function getMarketingCaseIds(): string[] {
  return cases.map((c) => c.id);
}
