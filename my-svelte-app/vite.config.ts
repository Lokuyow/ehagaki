import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/ehagaki/',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      devOptions: {
        enabled: true,
      },
      scope: '/ehagaki/',
      manifest: {
        name: 'eHagaki',
        short_name: 'eHagaki',
        description: '軽量なポストオンリー型Nostrクライアントで、デバイス上で画像を圧縮することにより高速かつデータ効率に優れたアップロードを実現します。',
        display: 'standalone',
        theme_color: '#2b664bff',
        background_color: '#364029',
        icons: [
          {
            src: '/ehagaki/hagaki_2mai.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/ehagaki/hagaki_2mai.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        share_target: {
          action: '/ehagaki/upload',
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            files: [
              {
                name: 'image',
                accept: ['image/*']
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
        globPatterns: [
          '**/*.{js,css,html}',
          'assets/**/*.{js,css,png,jpg,jpeg,svg,gif,webp,ico}',
          '*.{png,jpg,jpeg,svg,gif,webp,ico}', // publicフォルダ直下のファイル
          'icons/**/*.{png,jpg,jpeg,svg,gif,webp,ico}' // ← 追加: public/icons配下
        ]
      }
    })
  ]
});
