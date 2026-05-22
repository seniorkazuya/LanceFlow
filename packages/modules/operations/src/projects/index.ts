export {
  allowedTransitionsFrom,
  createProject,
  getProjectById,
  listProjects,
  transitionProject,
  updateProject,
  type ProjectMutationResult,
} from './service';
export { canTransition } from './transitions';
export {
  PROJECT_STATUSES,
  type CreateProjectInput,
  type ProjectRecord,
  type ProjectStatus,
  type UpdateProjectInput,
} from './types';
