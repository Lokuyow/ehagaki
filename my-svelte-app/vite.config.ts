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
        description: '投稿専用Nostrクライアント。デバイス上で画像を圧縮してからアップロード。エディター内に直接コンテンツを表示。',
        display: 'standalone',
        theme_color: '#2b664bff',
        background_color: '#364029',
        icons: [
          {
            src: '/ehagaki/ehagaki_icon_x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/ehagaki/ehagaki_icon_x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: "/ehagaki/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/ehagaki/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
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
