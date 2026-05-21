export type DevAuthConfig = {
  email: string;
  password: string;
};

/** Dev/staging credentials from env; omit in production unless explicitly configured. */
export function resolveDevAuthConfig(): DevAuthConfig | null {
  const email = process.env.DEV_AUTH_EMAIL?.trim();
  const password = process.env.DEV_AUTH_PASSWORD?.trim();
  if (!email || !password) return null;
  return { email, password };
}

export function validateDevCredentials(
  email: string,
  password: string,
  config: DevAuthConfig
): boolean {
  return email.trim() === config.email && password.trim() === config.password;
}
