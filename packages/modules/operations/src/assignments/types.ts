export type AssignmentRecord = {
  id: string;
  projectId: string;
  userId: string;
  engineerName: string;
  engineerEmail: string;
  skillScore: number | null;
  formulaVersion: string | null;
  assignedAt: Date;
  releasedAt: Date | null;
};

export type AssignmentSuggestion = {
  userId: string;
  displayName: string;
  email: string;
  skillTags: string[];
  activeAssignmentCount: number;
  skillMatchPct: number;
  rankScore: number;
};

export type AssignEngineerInput = {
  userId: string;
  requiredSkills: string[];
};
