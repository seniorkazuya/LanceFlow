import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@lanceflow/types', '@lanceflow/config'],
};

const sentryEnabled = Boolean(process.env.SENTRY_DSN);

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
      disableLogger: true,
      widenClientFileUpload: true,
      automaticVercelMonitors: false,
    })
  : nextConfig;
