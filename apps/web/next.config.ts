import { withSentryConfig } from '@sentry/nextjs';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  transpilePackages: [
    '@lanceflow/types',
    '@lanceflow/config',
    '@lanceflow/auth',
    '@lanceflow/database',
    '@lanceflow/ui',
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }
    return config;
  },
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
