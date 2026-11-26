import { verifyRxNostrPatch } from "./scripts/verifyRxNostrPatch.mjs";
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { HASHED_PRECACHE_ASSET_PATTERN } from './src/lib/swPrecacheInstall.ts';
import { APP_BROWSER_TARGETS } from './scripts/browserTargets.ts';
import {
  fixedLegacyBridgeEmitPlugin,
  loadFixedLegacyBridgeManifest,
} from './scripts/fixedLegacyBridge.ts';

// previewモード判定（vite preview時は process.argv に 'preview' が含まれる）
const isPreview = process.argv.some(arg => arg.includes('preview')) ||
  process.env.VITE_PREVIEW === 'true' ||
  process.env.NODE_ENV === 'preview';

// GitHub Pages is the production app. All Vercel deployments are test builds.
const isTestBuild = Boolean(process.env.VERCEL);
const baseUrl = isTestBuild ? '/' : '/ehagaki/';
const appName = isTestBuild ? 'eHagaki Test' : 'eHagaki';
const pwaIconDirectory = isTestBuild ? 'pwa-test/' : '';
const vercelPreviewHost = process.env.VERCEL_ENV === 'preview' ? process.env.VERCEL_URL : undefined;
const socialSiteUrl = isTestBuild
  ? new URL(`https://${vercelPreviewHost || 'ehagaki-test.vercel.app'}/`).href
  : 'https://lokuyow.github.io/ehagaki/';
const socialImageUrl = new URL(isTestBuild ? 'ehagaki_ogp_test.png' : 'ehagaki_ogp.webp', socialSiteUrl).href;
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
verifyRxNostrPatch();

export default defineConfig({
  base: baseUrl,
  define: {
    __EHAGAKI_COMPOSER_LITE__: 'false',
    __EHAGAKI_TEST_BUILD__: JSON.stringify(isTestBuild),
  },
  optimizeDeps: {
    exclude: ['@jsquash/webp']
  },
  worker: {
    format: 'es',
    // Worker output is precached by the service worker and shares the regular
    // hashed asset namespace with the application build.
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name]-bridge-[hash].js',
        chunkFileNames: 'assets/[name]-bridge-[hash].js'
      }
    }
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    target: APP_BROWSER_TARGETS,
    cssTarget: APP_BROWSER_TARGETS,
    // Keep runtime color-scheme switching and color values from Vite 7.
    cssMinify: 'esbuild',
    emptyOutDir: true,
    // Preserve the existing warning budget; optional codec chunks remain lazy.
    chunkSizeWarningLimit: 680,
    rolldownOptions: {
      external: [],
      output: {
        // Keep all application assets in the hashed deployment namespace.
        entryFileNames: 'assets/[name]-bridge-[hash].js',
        chunkFileNames: 'assets/[name]-bridge-[hash].js',
        assetFileNames: 'assets/[name]-bridge-[hash][extname]',
        codeSplitting: {
          groups: [
            // Svelte's runtime is shared by the entry graph and every vendor group
            // that depends on it. Capture it first so recursive dependency capture
            // by vendor-editor/vendor-ui does not make the entry preload them.
            { name: 'vendor-svelte', test: /node_modules[\\/](?:svelte|esm-env|clsx)[\\/]/ },
            { name: 'vendor-editor', test: /node_modules[\\/](?:@tiptap[\\/]|prosemirror-|svelte-tiptap)/ },
            // The entry needs only a few nostr-tools helpers before App loads.
            // Keep those statically reachable modules out of the full vendor chunk.
            { name: 'vendor-nostr-initial', test: /node_modules[\\/](?:nostr-tools|rx-nostr|@rx-nostr[\\/]|@noble[\\/]|@scure[\\/])/, tags: ['$initial'] },
            { name: 'vendor-nostr', test: /node_modules[\\/](?:nostr-tools|rx-nostr|@rx-nostr[\\/]|@noble[\\/])/ },
            // Keep the optional AAC encoder outside MediaBunny's shared chunk.
            { name: 'vendor-video', test: /node_modules[\\/]mediabunny[\\/]/ },
            { name: 'vendor-image', test: /node_modules[\\/](?:blurhash)[\\/]/ },
            { name: 'vendor-zap', test: /node_modules[\\/]nostr-zap/ },
            { name: 'vendor-ui', test: /node_modules[\\/]bits-ui[\\/]/ },
            { name: 'vendor-i18n', test: /node_modules[\\/](?:svelte-i18n|intl-messageformat|@formatjs[\\/]|deepmerge)/ },
          ],
        }
      }
    }
  },
  plugins: [
    fixedLegacyBridgeEmitPlugin(fixedLegacyBridgeManifest),
    svelte(),
    {
      name: 'ehagaki-branding',
      transformIndexHtml: {
        order: 'pre',
        handler: html => html
          .replaceAll('%EHAGAKI_APP_NAME%', appName)
          .replaceAll('%EHAGAKI_SOCIAL_SITE_URL%', socialSiteUrl)
          .replaceAll('%EHAGAKI_SOCIAL_IMAGE_URL%', socialImageUrl)
          .replaceAll('%EHAGAKI_PWA_ICON_DIRECTORY%', pwaIconDirectory),
      },
    },
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      devOptions: {
        enabled: isPreview, // previewモードのみ有効、devは無効
        type: 'module' // 明示的にtypeを指定
      },
      scope: baseUrl,
      manifest: {
        name: appName,
        short_name: appName,
        description: '投稿専用Nostrクライアント。デバイス上で画像・動画を圧縮してからアップロード。エディター内に直接コンテンツを表示。',
        display: 'standalone',
        theme_color: '#2b664b',
        background_color: '#364029',
        icons: [
          {
            src: `${baseUrl}${pwaIconDirectory}ehagaki_icon_x192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: `${baseUrl}${pwaIconDirectory}ehagaki_icon_x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: `${baseUrl}${pwaIconDirectory}maskable_icon_x192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: `${baseUrl}${pwaIconDirectory}maskable_icon_x512.png`,
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
                accept: ['image/*', 'video/*', '.avif']
              }
            ]
          }
        }
      },
      injectManifest: {
        swSrc: 'public/sw.js',
        // Let the plugin derive swDest from build.outDir, including test builds.
        rollupFormat: 'iife',
        injectionPoint: 'self.__WB_MANIFEST',
        // Content-hashed URLs already identify the version (also under /ehagaki/).
        dontCacheBustURLsMatching: HASHED_PRECACHE_ASSET_PATTERN,
        globPatterns: [
          '**/*.{js,css,html}',
          'assets/**/*.{js,css,png,jpg,jpeg,svg,gif,webp,ico}',
          '*.{png,jpg,jpeg,svg,gif,webp,ico}',
          'icons/**/*.{png,jpg,jpeg,svg,gif,webp,ico}',
          ...(isTestBuild ? ['pwa-test/*.png'] : []),
        ],
        // Vercel環境での追加設定
        globIgnores: [
          '**/node_modules/**/*',
          'sw.js',
          'workbox-*.js',
          'ehagaki_ogp_test.png',
          // Embed Playground pages and the redirect stubs for their old URLs.
          'playground/**',
          'host-owned-composer-lite-example.html',
          'web-component-parent-client-example.html',
          'embed-parent-client-example.html',
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
    watch: {
      // Agent worktrees live under .claude/ in the main checkout. Watching their
      // tens of thousands of files saturates the fs threadpool on Windows and
      // keeps the dev server from listening.
      ignored: ['**/.claude/**'],
    },
  }
});
