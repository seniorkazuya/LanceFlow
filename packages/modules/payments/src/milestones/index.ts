export {
  listProjectMilestones,
  setProjectMilestones,
  type SetProjectMilestonesResult,
} from './service';
export { validateProjectMilestones } from './validate';
export { syncMilestoneLinkedSchedules, type MilestoneScheduleSyncResult } from './sync';
export type {
  ProjectMilestoneInput,
  ProjectMilestoneRecord,
  SetProjectMilestonesInput,
} from './types';
