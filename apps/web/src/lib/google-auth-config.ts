import { loadMonorepoEnv } from '@/lib/load-monorepo-env';

function googleEnvReady(): boolean {
  loadMonorepoEnv();
  return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export function isGoogleAuthConfigured(): boolean {
  return googleEnvReady();
}

export function getGoogleOAuthCredentials(): { clientId: string; clientSecret: string } | null {
  if (!googleEnvReady()) return null;
  return {
    clientId: process.env.GOOGLE_CLIENT_ID!.trim(),
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
  };
}
