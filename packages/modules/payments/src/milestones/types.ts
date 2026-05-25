export type ProjectMilestoneInput = {
  label: string;
  percentPct: number;
};

export type ProjectMilestoneRecord = {
  id: string;
  projectId: string;
  label: string;
  percentPct: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SetProjectMilestonesInput = {
  milestones: ProjectMilestoneInput[];
};
