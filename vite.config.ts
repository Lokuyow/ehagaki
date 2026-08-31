import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';
import {
  fixedLegacyBridgeEmitPlugin,
  loadFixedLegacyBridgeManifest,
} from './scripts/fixedLegacyBridge';

// previewモード判定（vite preview時は process.argv に 'preview' が含まれる）
const isPreview = process.argv.some(arg => arg.includes('preview')) ||
  process.env.VITE_PREVIEW === 'true' ||
  process.env.NODE_ENV === 'preview';

// Vercel環境ではルートパス、それ以外では /ehagaki/ を使用
const baseUrl = process.env.VERCEL ? '/' : '/ehagaki/';
const webComponentDevProxyEnabled = process.env.EHAGAKI_WEB_COMPONENT_DEV_PROXY === 'true';
const webComponentDevServerPort = process.env.EHAGAKI_WEB_COMPONENT_DEV_PORT;
const webComponentDevProxyPath = `${baseUrl}web-component/`;
const webComponentDevProxy = webComponentDevProxyEnabled && webComponentDevServerPort
  ? {
      [webComponentDevProxyPath]: {
        target: `http://127.0.0.1:${webComponentDevServerPort}`,
        changeOrigin: true,
        rewrite: (requestPath: string) => requestPath.slice(webComponentDevProxyPath.length - 1),
      },
    }
  : undefined;
const fixedLegacyBridgeManifest = loadFixedLegacyBridgeManifest();
const fixedLegacyBridgePaths = fixedLegacyBridgeManifest.assets.map(asset => asset.path);

// https://vite.dev/config/
export default defineConfig({
  base: baseUrl,
  define: {
    __EHAGAKI_COMPOSER_LITE__: 'false',
  },
  optimizeDeps: {
    exclude: ['@jsquash/webp']
  },
  worker: {
    format: 'es',
    // Worker output is precached by the service worker and shares the regular
    // hashed asset namespace with the application build.
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-bridge-[hash].js',
        chunkFileNames: 'assets/[name]-bridge-[hash].js'
      }
    }
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    emptyOutDir: true,
    // Appは起動・投稿・認証・iframe同期に必要なコードで構成されるため、
    // 遅延化で初期転送量を減らせない残存サイズ673.37 kBに対して最小限の閾値を設定する。
    chunkSizeWarningLimit: 680,
    rollupOptions: {
      external: [],
      output: {
        // Keep all application assets in the hashed deployment namespace.
        entryFileNames: 'assets/[name]-bridge-[hash].js',
        chunkFileNames: 'assets/[name]-bridge-[hash].js',
        assetFileNames: 'assets/[name]-bridge-[hash][extname]',
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
          // 動画圧縮 (MediaBunny). The AAC encoder is dynamically imported
          // only when native AAC encoding is unavailable, so keep it separate.
          if (id.includes('node_modules/mediabunny')) {
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
          // i18n runtime and message-formatting dependencies
          if (id.includes('node_modules/svelte-i18n') ||
              id.includes('node_modules/intl-messageformat') ||
              id.includes('node_modules/@formatjs/') ||
              id.includes('node_modules/deepmerge')) {
            return 'vendor-i18n';
          }
        }
      }
    }
  },
  plugins: [
    fixedLegacyBridgeEmitPlugin(fixedLegacyBridgeManifest),
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
            title: 'title',
            text: 'text',
            url: 'url',
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
          'workbox-*.js',
          'host-owned-composer-lite-android-diagnostic/**/*',
          'host-owned-composer-lite-example.html',
          'web-component-parent-client-example.html',
          'web-component-parent-client-example.js',
          'embed-parent-client-example.html',
          'embed-parent-client-example.js',
          ...fixedLegacyBridgePaths
        ],
        additionalManifestEntries: fixedLegacyBridgePaths.map(url => ({
          url,
          revision: null,
        }))
      }
    })
  ],
  server: {
    allowedHosts: [
      '.ngrok-free.app'
    ],
    proxy: webComponentDevProxy,
  }
});
