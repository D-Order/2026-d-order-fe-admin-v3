import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@components': path.resolve(__dirname, '../src/components'),
          '@pages': path.resolve(__dirname, '../src/pages'),
          '@routes': path.resolve(__dirname, '../src/routes'),
          '@styles': path.resolve(__dirname, '../src/styles'),
          '@hooks': path.resolve(__dirname, '../src/hooks'),
          '@constants': path.resolve(__dirname, '../src/constants'),
          '@assets': path.resolve(__dirname, '../src/assets'),
          '@services': path.resolve(__dirname, '../src/services'),
        },
      },
    });
  },
};
export default config;
