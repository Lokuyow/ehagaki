import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/ehagaki/',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      // srcDir/filenameの指定を削除
      // カスタムSWを使用するため、injectManifestに戻す
      strategies: 'injectManifest',
      // サービスワーカーのスコープを明示的に設定
      scope: '/ehagaki/',
      manifest: {
        name: 'eHagaki',
        short_name: 'eHagaki',
        description: '軽量なポストオンリー型Nostrクライアントで、デバイス上で画像を圧縮することにより高速かつデータ効率に優れたアップロードを実現します。',
        theme_color: '#699f43ff',
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
          // GitHub Pages用に絶対パスに変更
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
      // injectManifest 設定
      injectManifest: {
        swSrc: 'public/sw.js', // サービスワーカーのエントリポイントを明示
        swDest: 'dist/sw.js',
        rollupFormat: 'iife',
        injectionPoint: undefined
      },
      // 共有ターゲット機能のサポート
    })
  ]
});
