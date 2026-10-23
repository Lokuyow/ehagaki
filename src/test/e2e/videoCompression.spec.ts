import { expect, test } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { build, preview, type PreviewServer } from 'vite';
import type { VideoCompressionReport } from './videoCompressionHarness';

let outputDirectory: string;
let server: PreviewServer | undefined;
let harnessUrl: string;

test.beforeAll(async () => {
    outputDirectory = await mkdtemp(join(tmpdir(), 'ehagaki-video-compression-'));
    await build({
        configFile: resolve('vite.config.ts'),
        base: '/ehagaki/',
        logLevel: 'silent',
        build: {
            outDir: outputDirectory,
            emptyOutDir: true,
            rolldownOptions: { input: resolve('src/test/e2e/video-compression.html') },
        },
    });
    server = await preview({
        configFile: false,
        base: '/ehagaki/',
        logLevel: 'silent',
        build: { outDir: outputDirectory },
        preview: { host: '127.0.0.1', port: 0, strictPort: true },
    });
    const address = server.httpServer.address();
    if (!address || typeof address === 'string') throw new Error('Preview port is unavailable');
    harnessUrl = `http://127.0.0.1:${address.port}/ehagaki/src/test/e2e/video-compression.html`;
});

test.afterAll(async () => {
    const previewServer = server;
    if (previewServer) await new Promise<void>((resolve, reject) => previewServer.httpServer.close(error => error ? reject(error) : resolve()));
    if (outputDirectory) await rm(outputDirectory, { recursive: true, force: true });
});

for (const forceAacFallback of [false, true]) {
    test(`production compression preserves video and audio (AAC fallback: ${forceAacFallback})`, async ({ page }) => {
        if (forceAacFallback) {
            await page.addInitScript(() => {
                const nativeSupport = AudioEncoder.isConfigSupported.bind(AudioEncoder);
                AudioEncoder.isConfigSupported = async config => config.codec.startsWith('mp4a')
                    ? { supported: false, config }
                    : nativeSupport(config);
            });
        }
        const failedAssets: string[] = [];
        page.on('requestfailed', request => failedAssets.push(new URL(request.url()).pathname));
        await page.goto(harnessUrl);
        const result = await page.evaluate(async () => {
            const harness = Reflect.get(window, '__VIDEO_COMPRESSION_HARNESS__') as {
                run(mode: 'compress'): Promise<VideoCompressionReport>;
            };
            return harness.run('compress');
        });
        expect(result.wasCompressed).toBe(true);
        expect(result.outputBytes).toBeLessThan(result.inputBytes);
        expect(result).toMatchObject({
            width: 320, height: 180, audioTrackCount: 1, audioChannels: 1,
            audioSampleRate: 44_100, audible: true, videoReady: true,
        });
        expect(result.progress).toContain(100);
        expect(result.progress.every(value => value >= 0 && value <= 100)).toBe(true);
        expect(failedAssets).toEqual([]);
    });
}

test('production compression keeps the original when cancelled', async ({ page }) => {
    await page.goto(harnessUrl);
    const result = await page.evaluate(async () => {
        const harness = Reflect.get(window, '__VIDEO_COMPRESSION_HARNESS__') as {
            run(mode: 'abort'): Promise<VideoCompressionReport>;
        };
        return harness.run('abort');
    });
    expect(result).toMatchObject({ wasCompressed: false, wasSkipped: true, aborted: true, keptOriginal: true });
});

test('production compression keeps the original when AVC encoding is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
        const nativeSupport = VideoEncoder.isConfigSupported.bind(VideoEncoder);
        VideoEncoder.isConfigSupported = async config => config.codec.startsWith('avc')
            ? { supported: false, config }
            : nativeSupport(config);
    });
    await page.goto(harnessUrl);
    const result = await page.evaluate(async () => {
        const harness = Reflect.get(window, '__VIDEO_COMPRESSION_HARNESS__') as {
            run(mode: 'compress'): Promise<VideoCompressionReport>;
        };
        return harness.run('compress');
    });
    expect(result).toMatchObject({ wasCompressed: false, wasSkipped: true, keptOriginal: true });
});
