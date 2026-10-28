import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { createWebpFixture } from '../webpFixture';

const webp = Buffer.from(createWebpFixture());
const sha256 = createHash('sha256').update(webp).digest('hex');
type WebpState = {
    uploads: { width: number; height: number; type: string; size: number; name: string; sha256: string }[];
    gallery: { src: string; mimeType?: string; isPlaceholder: boolean }[];
    isUploading: boolean;
    wire: { content: string; emoji: string[][] } | null;
};
type WebpHarness = { startReaction(): void; read(): Promise<WebpState> };
type HarnessWindow = Window & { __REACTION__: WebpHarness };
const read = (page: Page) => page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.read());

for (const reaction of [false, true]) for (const input of ['picker', 'paste', 'drop'] as const) {
    test(`${reaction ? 'reaction' : 'normal post'} preserves animated WebP through ${input}`, async ({ page }, testInfo) => {
        const pageErrors: string[] = [];
        page.on('pageerror', error => pageErrors.push(error.message));
        await page.route('**/webp-fixture.webp', route => route.fulfill({ contentType: 'image/webp', body: webp }));
        await page.route('**/reaction-fixture-upload', route => route.fulfill({ json: { url: new URL('webp-fixture.webp', route.request().url()).href } }));
        await page.goto(`post-reaction-playwright.html?uploaded${input === 'drop' ? '&free' : ''}`);
        await page.waitForFunction(() => !!(window as unknown as HarnessWindow).__REACTION__);
        if (reaction) await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
        const editor = page.locator('.tiptap-editor');
        await expect(editor).toBeVisible();
        if (reaction) {
            await expect(page.locator('input[type=file]')).toHaveAttribute('accept', /image\/webp/);
            await expect(page.locator('input[type=file]')).not.toHaveAttribute('multiple');
        }
        if (input === 'picker') {
            await page.locator('input[type=file]').setInputFiles({ name: 'animation.webp', mimeType: 'image/webp', buffer: webp });
        } else {
            await editor.evaluate((element, { bytes, input }) => {
                const transfer = new DataTransfer();
                transfer.items.add(new File([new Uint8Array(bytes)], 'animation.webp', { type: 'image/webp' }));
                const event = input === 'paste'
                    ? new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: transfer })
                    : new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer });
                // Firefox drops constructor-supplied clipboardData on synthetic paste events.
                if (input === 'paste') Object.defineProperty(event, 'clipboardData', { value: transfer });
                element.dispatchEvent(event);
            }, { bytes: [...webp], input });
        }
        await expect.poll(async () => (await read(page)).uploads.length).toBe(1);
        await expect.poll(async () => (await read(page)).isUploading).toBe(false);
        expect((await read(page)).uploads[0]).toMatchObject({ width: 256, height: 192, type: 'image/webp', size: webp.length, name: 'animation.webp', sha256 });
        const preview = page.locator(reaction || input !== 'drop' ? '.media-gallery img' : '.tiptap-editor img').first();
        await expect(preview).toBeVisible();
        await expect.poll(() => preview.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(256);
        if (input === 'picker') {
            // Sample pixels away from the overlaid buttons, whose transitions are unrelated to WebP frames.
            const box = (await preview.boundingBox())!;
            const clip = { x: Math.floor(box.x + box.width / 4), y: Math.floor(box.y + box.height / 2), width: 4, height: 4 };
            const sample = async () => createHash('sha256').update(await page.screenshot({ clip, animations: 'allow' })).digest('hex');
            const first = await sample();
            await expect.poll(sample).not.toBe(first);
            await preview.screenshot({ path: testInfo.outputPath('animated-webp-preview.png'), animations: 'allow' });
        }
        if (reaction) {
            expect((await read(page)).gallery[0]).toMatchObject({ mimeType: 'image/webp', isPlaceholder: false });
            await expect(editor).toBeEmpty();
            await expect(page.getByRole('button', { name: '投稿', exact: true })).toBeEnabled();
            await page.getByRole('button', { name: '投稿', exact: true }).click();
            await expect.poll(async () => (await read(page)).wire?.content).toBe(':animation:');
            expect((await read(page)).wire?.emoji).toEqual([['emoji', 'animation', new URL('webp-fixture.webp', page.url()).href]]);
        }
        expect(pageErrors).toEqual([]);
    });
}
