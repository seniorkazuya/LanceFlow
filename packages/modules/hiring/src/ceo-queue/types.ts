export type HiringCeoQueueItem = {
  id: string;
  fullName: string;
  roleApplied: string;
  status: string;
  thsScore: number;
  rsScore: number;
  rpScore: number | null;
  decision: string | null;
  decisionSource: string | null;
  flags: ('top_5_percent' | 'high_rs' | 'high_rp')[];
  createdAt: string;
  scoredAt: string;
};

export type HiringCeoQueueSnapshot = {
  scope: 'hiring-ceo-queue';
  thresholds: {
    topPercent: number;
    highRsMinInclusive: number;
    highRpMinInclusive: number;
  };
  counts: {
    scoredTotal: number;
    returned: number;
  };
  items: HiringCeoQueueItem[];
  generatedAt: string;
};

