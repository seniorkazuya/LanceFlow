export type DailyReportRecord = {
  id: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  engineerName: string;
  reportDate: Date;
  hours: number;
  progressPct: number;
  issues: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MissingDailyReport = {
  userId: string;
  engineerName: string;
  engineerEmail: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  reportDate: Date;
};

export type SubmitDailyReportInput = {
  projectId: string;
  hours: number;
  progressPct: number;
  issues?: string | null;
  reportDate?: Date;
};

export type EngineerAssignmentOption = {
  projectId: string;
  projectTitle: string;
  clientName: string;
};
