const sentryEnabled = Boolean(process.env.SENTRY_DSN?.trim());

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (sentryEnabled) {
      await import('../sentry.server.config');
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    if (sentryEnabled) {
      await import('../sentry.edge.config');
    }
  }
}
