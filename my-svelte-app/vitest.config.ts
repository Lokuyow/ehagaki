import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    testTimeout: 10000, // 10秒のタイムアウト
    pool: 'forks', // forkプールを使用してメモリ分離
    poolOptions: {
      forks: {
        singleFork: true, // 単一フォークでメモリ使用量を制限
      }
    },
    env: {
      NODE_ENV: 'test',
      NODE_OPTIONS: '--max-old-space-size=2048' // 2GBのメモリ制限
    }
  },
  resolve: {
    alias: {
      // テスト環境でのPWA仮想モジュールのモック
      'virtual:pwa-register/svelte': new URL('./src/test/mocks/pwa-register.ts', import.meta.url).pathname
    }
  }
});