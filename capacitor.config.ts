import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fogghabit.app',
  appName: '福格习惯',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
