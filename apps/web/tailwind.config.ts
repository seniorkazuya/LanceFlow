import type { Config } from 'tailwindcss';
import uiPreset from '@lanceflow/ui/tailwind-preset';

const config: Config = {
  presets: [uiPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/core/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
