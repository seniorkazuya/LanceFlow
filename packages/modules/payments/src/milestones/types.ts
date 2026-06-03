export type ProjectMilestoneInput = {
  label: string;
  percentPct: number;
  /** ISO date YYYY-MM-DD — drives linked payment schedule for AUTO-005 (PAY-003). */
  dueDate?: string | null;
  /** Required when dueDate is set — amount for milestone-linked reminder schedule. */
  amountCents?: number | null;
};

export type ProjectMilestoneRecord = {
  id: string;
  projectId: string;
  label: string;
  percentPct: number;
  dueDate: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SetProjectMilestonesInput = {
  milestones: ProjectMilestoneInput[];
};
