import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@lanceflow/types'],
};

export default nextConfig;
