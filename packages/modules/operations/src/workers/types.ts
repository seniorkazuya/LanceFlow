export type WorkerRecord = {
  id: string;
  email: string;
  displayName: string;
  status: string;
  skillTags: string[];
  activeAssignmentCount: number;
};

export type UpdateWorkerSkillsInput = {
  skillTags: string[];
};
