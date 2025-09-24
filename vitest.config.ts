import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    testTimeout: 20000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      }
    },
    env: {
      NODE_ENV: 'test',
      NODE_OPTIONS: '--max-old-space-size=2048'
    }
  },
  resolve: {
    alias: {
      'virtual:pwa-register/svelte': '/src/test/mocks/pwa-register.ts'
    }
  },
  define: {
    'import.meta.vitest': undefined
  }
});