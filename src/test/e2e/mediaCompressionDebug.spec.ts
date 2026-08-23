import { expect, test } from '@playwright/test';

test.describe('media compression debug panel', () => {
    test('is query-gated and supports expand, Copy, Clear, and narrow viewports', async ({ page }) => {
        await page.goto('media-compression-debug-playwright.html');
        await expect(page.locator('.media-debug-panel')).toHaveCount(0);

        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1');
        const panel = page.locator('.media-debug-panel');
        const toggle = page.getByRole('button', { name: /Media Compression Debug/ });
        await expect(panel).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(panel.locator('pre')).toHaveCount(0);

        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('button', { name: 'Run video decode benchmark' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Run MediaBunny transform pipeline benchmark' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Run legacy-like Canvas pipeline benchmark' })).toHaveCount(0);
        await expect(panel.locator('pre')).toContainText('Conversion #1');
        await expect(panel.locator('pre')).toContainText('Normal audio transcode');
        await expect(panel.locator('pre')).toContainText('video rate control: subjective-quality');
        await expect(panel.locator('pre')).toContainText('effective audio encoding mode: quality');
        await expect(panel.locator('pre')).toContainText('audio path: native-aac');

        const geometry = await panel.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return {
                right: rect.right,
                bottom: rect.bottom,
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                documentWidth: document.documentElement.scrollWidth,
            };
        });
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
        expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);

        await page.getByRole('button', { name: 'Copy' }).click();
        await expect(page.getByRole('status')).toHaveText(/Copied|Copy failed|Clipboard unavailable/);

        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(panel.locator('pre')).toContainText('No conversions recorded.');
        await expect(panel.locator('pre')).toContainText('Reload the page before Conversion #1');
    });

    test('shows forced audio packet-copy mode without changing the narrow layout', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1&media-debug-audio=copy');
        const panel = page.locator('.media-debug-panel');
        const toggle = page.getByRole('button', { name: /Media Compression Debug/ });
        await toggle.click();

        await expect(panel.locator('pre')).toContainText('Forced audio packet copy');
        await expect(panel.locator('pre')).toContainText('audio diagnostic mode: force-packet-copy');
        await expect(panel.locator('pre')).toContainText('Video latency: quality (default)');
        await expect(panel.locator('pre')).toContainText('video latency mode: quality (MediaBunny default)');
        await expect(panel.locator('pre')).toContainText('effective audio encoding mode: packet-copy');
        await expect(panel.locator('pre')).toContainText('audio path: packet-copy');
        await expect(panel.locator('pre')).toContainText('reason: debug-forced-packet-copy');
        await expect(panel.locator('pre')).toContainText('output audio: 48000 Hz / 2ch');

        const geometry = await panel.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return {
                right: rect.right,
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: window.innerWidth,
            };
        });
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
    });

    test('shows explicit variable-bitrate video rate control only for the complete A/B query', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1&media-debug-audio=copy&media-debug-video-rate-control=bitrate');
        const panel = page.locator('.media-debug-panel');
        await page.getByRole('button', { name: /Media Compression Debug/ }).click();

        await expect(panel.locator('pre')).toContainText('Forced audio packet copy');
        await expect(panel.locator('pre')).toContainText('video rate control: explicit-bitrate');
        await expect(panel.locator('pre')).toContainText('configured video bitrate: 400000 bps');
        await expect(panel.locator('pre')).toContainText('bitrate mode: variable');
        await expect(panel.locator('pre')).toContainText('audio path: packet-copy');
        await expect(panel.locator('pre')).toContainText('target: 640x360');

        const geometry = await panel.evaluate((element) => ({
            right: element.getBoundingClientRect().right,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
        }));
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);

        await page.getByRole('button', { name: 'Copy' }).click();
        await expect(page.getByRole('status').filter({ hasText: /Copied|Copy failed|Clipboard unavailable/ })).toBeVisible();
        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(panel.locator('pre')).toContainText('No conversions recorded.');
    });

    test('shows the realtime video latency experiment with packet stats', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1&media-debug-audio=copy&media-debug-video-latency=realtime');
        const panel = page.locator('.media-debug-panel');
        await page.getByRole('button', { name: /Media Compression Debug/ }).click();

        await expect(panel.locator('pre')).toContainText('Forced audio packet copy');
        await expect(panel.locator('pre')).toContainText('Video latency: realtime');
        await expect(panel.locator('pre')).toContainText('video diagnostic mode: realtime');
        await expect(panel.locator('pre')).toContainText('input frames: 627');
        await expect(panel.locator('pre')).toContainText('output frames: 620');
        await expect(panel.locator('pre')).toContainText('input video stats scan:');
        await expect(panel.locator('pre')).toContainText('output video stats scan:');

        const geometry = await panel.evaluate((element) => ({
            right: element.getBoundingClientRect().right,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
        }));
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);

        await page.getByRole('button', { name: 'Copy' }).click();
        await expect(page.getByRole('status')).toHaveText(/Copied|Copy failed|Clipboard unavailable/);
        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(panel.locator('pre')).toContainText('No conversions recorded.');
    });

    test('runs the raw WebCodecs benchmark only when its full query gate is present', async ({ page }) => {
        await page.goto('media-compression-debug-playwright.html?media-debug-raw-video-encoder=1');
        await expect(page.locator('.media-debug-panel')).toHaveCount(0);

        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1&media-debug-raw-video-encoder=1');
        const panel = page.locator('.media-debug-panel');
        await page.getByRole('button', { name: /Media Compression Debug/ }).click();
        const runButton = page.getByRole('button', { name: /HTMLCanvas VideoEncoder benchmark/ });
        const offscreenRunButton = page.getByRole('button', { name: /OffscreenCanvas VideoEncoder benchmark/ });
        await expect(runButton).toBeVisible();
        await expect(offscreenRunButton).toBeVisible();
        await expect(panel.locator('pre')).toContainText('Raw native VideoEncoder benchmark: enabled (manual run)');
        await expect(panel.locator('pre')).toContainText('Normal audio transcode');

        await runButton.click();
        await expect(runButton).toBeDisabled();
        await expect(page.locator('[role="status"]').filter({ hasText: 'Raw benchmark:' })).toHaveText('Raw benchmark: running');
        await page.evaluate(() => {
            (window as Window & { completeRawVideoEncoderBenchmark?: () => void }).completeRawVideoEncoderBenchmark?.();
        });

        await expect(page.locator('[role="status"]').filter({ hasText: 'Raw benchmark:' })).toHaveText('Raw benchmark: completed');
        await expect(panel.locator('pre')).toContainText('Raw VideoEncoder Benchmark #1');
        await expect(panel.locator('pre')).toContainText('codec: avc1.64001E');
        await expect(panel.locator('pre')).toContainText('canvas/source kind: html-canvas');
        await expect(panel.locator('pre')).toContainText('frames submitted: 3');
        await expect(panel.locator('pre')).toContainText('Timing (overlaps; do not sum)');

        await offscreenRunButton.click();
        await expect(offscreenRunButton).toBeDisabled();
        await expect(page.locator('[role="status"]').filter({ hasText: 'OffscreenCanvas benchmark:' })).toHaveText('OffscreenCanvas benchmark: running');
        await page.evaluate(() => {
            (window as Window & { completeOffscreenCanvasVideoEncoderBenchmark?: () => void }).completeOffscreenCanvasVideoEncoderBenchmark?.();
        });

        await expect(page.locator('[role="status"]').filter({ hasText: 'OffscreenCanvas benchmark:' })).toHaveText('OffscreenCanvas benchmark: completed');
        await expect(panel.locator('pre')).toContainText('Raw VideoEncoder Benchmark #2');
        await expect(panel.locator('pre')).toContainText('canvas/source kind: offscreen-canvas');

        const geometry = await panel.evaluate((element) => ({
            right: element.getBoundingClientRect().right,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
        }));
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);

        await page.getByRole('button', { name: 'Copy' }).click();
        await expect(page.getByRole('status').filter({ hasText: /Copied|Copy failed|Clipboard unavailable/ })).toBeVisible();
        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(panel.locator('pre')).not.toContainText('Raw VideoEncoder Benchmark #1');
        await expect(panel.locator('pre')).not.toContainText('Raw VideoEncoder Benchmark #2');
    });

    test('runs the manual decode benchmark only when its full query gate is present', async ({ page }) => {
        await page.goto('media-compression-debug-playwright.html?media-debug-video-decode-benchmark=1');
        await expect(page.locator('.media-debug-panel')).toHaveCount(0);

        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1&media-debug-video-decode-benchmark=1');
        const panel = page.locator('.media-debug-panel');
        await page.getByRole('button', { name: /Media Compression Debug/ }).click();
        const runButton = page.getByRole('button', { name: 'Run video decode benchmark' });
        await expect(runButton).toBeVisible();
        await expect(panel.locator('pre')).toContainText('Video decode benchmark: enabled (manual run)');

        const fileChooserPromise = page.waitForEvent('filechooser');
        await runButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles({
            name: 'private.mov',
            mimeType: 'video/quicktime',
            buffer: Buffer.from('video'),
        });
        await expect(page.getByRole('button', { name: /video decode benchmark/ })).toBeDisabled();
        await expect(page.locator('[role="status"]').filter({ hasText: 'Video decode benchmark:' })).toHaveText('Video decode benchmark: running');
        await page.evaluate(() => {
            (window as Window & { completeVideoDecodeBenchmark?: () => void }).completeVideoDecodeBenchmark?.();
        });

        await expect(page.locator('[role="status"]').filter({ hasText: 'Video decode benchmark:' })).toHaveText('Video decode benchmark: completed');
        await expect(panel.locator('pre')).toContainText('Video Decode Benchmark #1');
        await expect(panel.locator('pre')).toContainText('samples decoded: 627');
        await expect(panel.locator('pre')).toContainText('sample #627: +6270.0 ms');
        await expect(panel.locator('pre')).not.toContainText('private.mov');

        const geometry = await panel.evaluate((element) => ({
            right: element.getBoundingClientRect().right,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
        }));
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);

        await page.getByRole('button', { name: 'Copy' }).click();
        await expect(page.getByRole('status').filter({ hasText: /Copied|Copy failed|Clipboard unavailable/ })).toBeVisible();
        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(panel.locator('pre')).not.toContainText('Video Decode Benchmark #1');
    });

    test('runs the real video pipeline benchmark only after its full query gate and file selection', async ({ page }) => {
        await page.goto('media-compression-debug-playwright.html?media-debug-video-pipeline-benchmark=1');
        await expect(page.locator('.media-debug-panel')).toHaveCount(0);

        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1&media-debug-video-pipeline-benchmark=1');
        const panel = page.locator('.media-debug-panel');
        await page.getByRole('button', { name: /Media Compression Debug/ }).click();
        const transformRunButton = page.getByRole('button', { name: /MediaBunny transform pipeline benchmark/ });
        const canvasRunButton = page.getByRole('button', { name: /legacy-like Canvas pipeline benchmark/ });
        await expect(transformRunButton).toBeVisible();
        await expect(canvasRunButton).toBeVisible();
        await expect(panel.locator('pre')).toContainText('Real video pipeline benchmark: enabled (manual run)');

        const fileChooserPromise = page.waitForEvent('filechooser');
        await transformRunButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles({
            name: 'private.mov',
            mimeType: 'video/quicktime',
            buffer: Buffer.from('video'),
        });
        await expect(transformRunButton).toBeDisabled();
        await expect(canvasRunButton).toBeDisabled();
        await expect(page.locator('[role="status"]').filter({ hasText: 'MediaBunny transform pipeline benchmark:' })).toHaveText('MediaBunny transform pipeline benchmark: running');
        await page.evaluate(() => {
            (window as Window & { completeRealVideoPipelineBenchmark?: () => void }).completeRealVideoPipelineBenchmark?.();
        });

        await expect(page.locator('[role="status"]').filter({ hasText: 'MediaBunny transform pipeline benchmark:' })).toHaveText('MediaBunny transform pipeline benchmark: completed');
        await expect(panel.locator('pre')).toContainText('Real Video Pipeline Benchmark #1');
        await expect(panel.locator('pre')).toContainText('pipeline kind: mediabunny-transform');
        await expect(panel.locator('pre')).toContainText('source display: 1080x1920');
        await expect(panel.locator('pre')).toContainText('target: 360x640');
        await expect(panel.locator('pre')).toContainText('samples processed: 627');
        await expect(panel.locator('pre')).toContainText('encoded chunks: 627');
        await expect(panel.locator('pre')).toContainText('key chunks: 1');
        await expect(panel.locator('pre')).toContainText('Timing (overlaps; do not sum)');
        await expect(panel.locator('pre')).not.toContainText('private.mov');

        const canvasFileChooserPromise = page.waitForEvent('filechooser');
        await canvasRunButton.click();
        const canvasFileChooser = await canvasFileChooserPromise;
        await canvasFileChooser.setFiles({
            name: 'private.mov',
            mimeType: 'video/quicktime',
            buffer: Buffer.from('video'),
        });
        await expect(canvasRunButton).toBeDisabled();
        await expect(transformRunButton).toBeDisabled();
        await expect(page.locator('[role="status"]').filter({ hasText: 'Legacy-like Canvas pipeline benchmark:' })).toHaveText('Legacy-like Canvas pipeline benchmark: running');
        await page.evaluate(() => {
            (window as Window & { completeLegacyLikeCanvasPipelineBenchmark?: () => void }).completeLegacyLikeCanvasPipelineBenchmark?.();
        });
        await expect(page.locator('[role="status"]').filter({ hasText: 'Legacy-like Canvas pipeline benchmark:' })).toHaveText('Legacy-like Canvas pipeline benchmark: completed');
        await expect(panel.locator('pre')).toContainText('Legacy-like Canvas Pipeline Benchmark #1');
        await expect(panel.locator('pre')).toContainText('pipeline kind: legacy-like-html-canvas');
        await expect(panel.locator('pre')).toContainText('Canvas draw / rotation / resize: 500.0 ms');

        await page.getByRole('button', { name: 'Copy' }).click();
        await expect(page.getByRole('status').filter({ hasText: /Copied|Copy failed|Clipboard unavailable/ })).toBeVisible();
        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(panel.locator('pre')).not.toContainText('Real Video Pipeline Benchmark #1');
    });
});
