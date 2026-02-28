import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import basicSsl from '@vitejs/plugin-basic-ssl';

// previewモード判定（vite preview時は process.argv に 'preview' が含まれる）
const isPreview = process.argv.some(arg => arg.includes('preview')) ||
  process.env.VITE_PREVIEW === 'true' ||
  process.env.NODE_ENV === 'preview';

// Vercel環境ではルートパス、それ以外では /ehagaki/ を使用
const baseUrl = process.env.VERCEL ? '/' : '/ehagaki/';

// https://vite.dev/config/
export default defineConfig({
  base: baseUrl,
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  worker: {
    format: 'es'
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          // Tiptap + ProseMirror (エディタコア)
          if (id.includes('node_modules/@tiptap/') ||
              id.includes('node_modules/prosemirror-') ||
              id.includes('node_modules/svelte-tiptap')) {
            return 'vendor-editor';
          }
          // Nostr関連ライブラリ
          if (id.includes('node_modules/nostr-tools') ||
              id.includes('node_modules/rx-nostr') ||
              id.includes('node_modules/@rx-nostr/') ||
              id.includes('node_modules/@noble/')) {
            return 'vendor-nostr';
          }
          // 動画圧縮 (mediabunny + ffmpeg)
          if (id.includes('node_modules/mediabunny') ||
              id.includes('node_modules/@ffmpeg/')) {
            return 'vendor-video';
          }
          // 画像圧縮 + blurhash
          if (id.includes('node_modules/browser-image-compression') ||
              id.includes('node_modules/blurhash')) {
            return 'vendor-image';
          }
          // Zap関連 (設定ダイアログでのみ使用)
          if (id.includes('node_modules/nostr-zap')) {
            return 'vendor-zap';
          }
          // bits-ui
          if (id.includes('node_modules/bits-ui')) {
            return 'vendor-ui';
          }
        }
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@ffmpeg/core/dist/esm/*',
          dest: 'ffmpeg-core'
        }
      ]
    }),
    svelte(),
    // basicSsl(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      devOptions: {
        enabled: isPreview, // previewモードのみ有効、devは無効
        type: 'module' // 明示的にtypeを指定
      },
      scope: baseUrl,
      manifest: {
        name: 'eHagaki',
        short_name: 'eHagaki',
        description: '投稿専用Nostrクライアント。デバイス上で画像・動画を圧縮してからアップロード。エディター内に直接コンテンツを表示。',
        display: 'standalone',
        theme_color: '#2b664b',
        background_color: '#364029',
        icons: [
          {
            src: `${baseUrl}ehagaki_icon_x192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: `${baseUrl}ehagaki_icon_x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: `${baseUrl}maskable_icon_x192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: `${baseUrl}maskable_icon_x512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        share_target: {
          action: `${baseUrl}upload`,
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            files: [
              {
                name: 'media',
                accept: ['image/*', 'video/*']
              }
            ]
          }
        }
      },
      injectManifest: {
        swSrc: 'public/sw.js',
        swDest: 'dist/sw.js',
        rollupFormat: 'iife',
        injectionPoint: 'self.__WB_MANIFEST',
        // Vercel環境でのキャッシュバスティングを改善
        dontCacheBustURLsMatching: /^\/assets\//,
        globPatterns: [
          '**/*.{js,css,html}',
          'assets/**/*.{js,css,png,jpg,jpeg,svg,gif,webp,ico}',
          '*.{png,jpg,jpeg,svg,gif,webp,ico}',
          'icons/**/*.{png,jpg,jpeg,svg,gif,webp,ico}'
        ],
        // Vercel環境での追加設定
        globIgnores: [
          '**/node_modules/**/*',
          'sw.js',
          'workbox-*.js'
        ]
      }
    })
  ],
  server: {
    allowedHosts: [
      '.ngrok-free.app'
    ]
  }
});
