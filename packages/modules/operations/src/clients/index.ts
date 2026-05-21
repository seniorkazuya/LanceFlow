export {
  archiveClient,
  createClient,
  getClientById,
  listClients,
  updateClient,
  type ClientMutationResult,
} from './service';
export { evaluateClientRisk, overrideClientRisk } from './risk';
export {
  CLIENT_RISK_FORMULA_V0,
  computeClientRiskV0,
  riskBand,
  riskBandLabel,
  type ClientRiskV0Input,
  type RiskBand,
} from './risk-v0';
export {
  CLIENT_STATUSES,
  type ClientRecord,
  type ClientStatus,
  type CreateClientInput,
  type OverrideClientRiskInput,
  type RiskScoreSource,
  type UpdateClientInput,
} from './types';
export {
  validateCreateClientInput,
  validateOverrideClientRiskInput,
  validateUpdateClientInput,
} from './validate';
