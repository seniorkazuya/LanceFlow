export {
  archiveClient,
  createClient,
  getClientById,
  listClients,
  updateClient,
  type ClientMutationResult,
} from './service';
export {
  CLIENT_STATUSES,
  type ClientRecord,
  type ClientStatus,
  type CreateClientInput,
  type UpdateClientInput,
} from './types';
export { validateCreateClientInput, validateUpdateClientInput } from './validate';
