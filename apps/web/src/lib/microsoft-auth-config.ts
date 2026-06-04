import { loadMonorepoEnv } from '@/lib/load-monorepo-env';

function microsoftEnvReady(): boolean {
  loadMonorepoEnv();
  return Boolean(
    process.env.AZURE_AD_CLIENT_ID?.trim() && process.env.AZURE_AD_CLIENT_SECRET?.trim()
  );
}

export function isMicrosoftAuthConfigured(): boolean {
  return microsoftEnvReady();
}

export function getMicrosoftOAuthCredentials(): {
  clientId: string;
  clientSecret: string;
  tenantId: string;
} | null {
  if (!microsoftEnvReady()) return null;
  return {
    clientId: process.env.AZURE_AD_CLIENT_ID!.trim(),
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!.trim(),
    tenantId: process.env.AZURE_AD_TENANT_ID?.trim() || 'common',
  };
}
