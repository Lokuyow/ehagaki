// @ts-nocheck
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        svelte(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'eHagaki',
                short_name: 'eHagaki',
                description: '軽量なポストオンリー型Nostrクライアントで、デバイス上で画像を圧縮することにより高速かつデータ効率に優れたアップロードを実現します。',
                theme_color: '#699f43ff',
                icons: [
                    {
                        src: '/src/assets/hagaki_2mai.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/src/assets/hagaki_2mai.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
});