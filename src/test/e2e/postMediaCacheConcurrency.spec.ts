import { test, expect } from '@playwright/test';
import { build } from 'esbuild';

let browserBundle: Promise<string> | undefined;
function getBrowserBundle(): Promise<string> {
    browserBundle ??= build({
        stdin: {
            resolveDir: process.cwd(),
            contents: "import { PostMediaCacheService } from './src/lib/postMediaCacheService.ts'; Object.assign(window, { postCacheProbe: new PostMediaCacheService() });",
        },
        bundle: true,
        write: false,
        format: 'iife',
        target: 'es2022',
        define: { 'import.meta.env': '{}', 'import.meta.env.BASE_URL': '"/ehagaki/"' },
    }).then(result => result.outputFiles[0].text);
    return browserBundle;
}

test('another tab can display a saved attachment while an unrelated save is held', async ({ context, page }) => {
    await context.route('**/post-media-cache-probe.html', route => route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><body></body>',
    }));
    const reader = await context.newPage();
    const bundle = await getBrowserBundle();
    for (const tab of [page, reader]) {
        await tab.goto('post-media-cache-probe.html');
        await tab.addScriptTag({ content: bundle });
    }
    await page.evaluate(async () => {
        const service = Reflect.get(window, 'postCacheProbe') as import('../../lib/postMediaCacheService').PostMediaCacheService;
        const url = (name: string) => new URL(name + '.svg', location.href).href;
        const image = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="17" height="7"/>'], { type: 'image/svg+xml' });
        await service.persistUploadedMedia({ url: url('saved'), file: image });
        const cachePut = Cache.prototype.put;
        const held = Promise.withResolvers<void>();
        const release = Promise.withResolvers<void>();
        Cache.prototype.put = async function (request, response) {
            if (request === url('held')) {
                held.resolve();
                await release.promise;
            }
            return cachePut.call(this, request, response);
        };
        const pending = service.persistUploadedMedia({ url: url('held'), file: image });
        Reflect.set(window, 'releasePostCacheProbe', () => { release.resolve(); return pending; });
        await held.promise;
    });
    try {
        await reader.evaluate(async () => {
            const service = Reflect.get(window, 'postCacheProbe') as import('../../lib/postMediaCacheService').PostMediaCacheService;
            const saved = await service.createCachedMediaObjectUrl(new URL('saved.svg', location.href).href);
            const image = new Image();
            image.src = saved?.objectUrl ?? '';
            document.body.append(image);
        });
        await expect.poll(() => reader.locator('img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(17);
    } finally {
        await page.evaluate(() => Reflect.get(window, 'releasePostCacheProbe')());
    }
});
