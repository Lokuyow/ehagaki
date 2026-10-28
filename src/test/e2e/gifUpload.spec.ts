import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { createGifFixture } from '../gifFixture';

const gif = Buffer.from(createGifFixture());
const sha256 = createHash('sha256').update(gif).digest('hex');
type GifState = {
    uploads: { width: number; height: number; type: string; size: number; name: string; sha256: string }[];
    gallery: { src: string; mimeType?: string; isPlaceholder: boolean }[];
    isUploading: boolean;
    wire: { content: string; emoji: string[][] } | null;
};
type GifHarness = { startReaction(): void; read(): Promise<GifState> };
type HarnessWindow = Window & { __REACTION__: GifHarness };
const read = (page: Page) => page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.read());

test('reaction rejects an undecodable GIF before transport', async ({ page }) => {
    await page.goto('post-reaction-playwright.html?uploaded');
    await page.waitForFunction(() => !!(window as unknown as HarnessWindow).__REACTION__);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
    // A valid header without image data must still fail the browser decode check.
    await page.locator('input[type=file]').setInputFiles({ name: 'broken.gif', mimeType: 'image/gif', buffer: gif.subarray(0, 13) });
    await expect(page.getByText('リアクション画像を変換できませんでした。画像はアップロードされていません。')).toBeVisible();
    expect((await read(page)).uploads).toEqual([]);
    expect((await read(page)).gallery).toEqual([]);
    expect((await read(page)).isUploading).toBe(false);
});

for (const reaction of [false, true]) for (const input of ['picker', 'paste', 'drop'] as const) {
    test(`${reaction ? 'reaction' : 'normal post'} preserves animated GIF through ${input}`, async ({ page }, testInfo) => {
        const pageErrors: string[] = [];
        page.on('pageerror', error => pageErrors.push(error.message));
        await page.route('**/gif-fixture.gif', route => route.fulfill({ contentType: 'image/gif', body: gif }));
        await page.route('**/reaction-fixture-upload', route => route.fulfill({ json: { url: new URL('gif-fixture.gif', route.request().url()).href } }));
        await page.goto(`post-reaction-playwright.html?uploaded${input === 'drop' ? '&free' : ''}`);
        await page.waitForFunction(() => !!(window as unknown as HarnessWindow).__REACTION__);
        if (reaction) await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
        const editor = page.locator('.tiptap-editor');
        await expect(editor).toBeVisible();
        if (reaction) {
            await expect(page.locator('input[type=file]')).toHaveAttribute('accept', /image\/gif/);
            await expect(page.locator('input[type=file]')).not.toHaveAttribute('multiple');
        }
        if (input === 'picker') {
            await page.locator('input[type=file]').setInputFiles({ name: 'animation.gif', mimeType: 'image/gif', buffer: gif });
        } else {
            await editor.evaluate((element, { bytes, input }) => {
                const transfer = new DataTransfer();
                transfer.items.add(new File([new Uint8Array(bytes)], 'animation.gif', { type: 'image/gif' }));
                const event = input === 'paste'
                    ? new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: transfer })
                    : new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer });
                // Firefox drops constructor-supplied clipboardData on synthetic paste events.
                if (input === 'paste') Object.defineProperty(event, 'clipboardData', { value: transfer });
                element.dispatchEvent(event);
            }, { bytes: [...gif], input });
        }
        await expect.poll(async () => (await read(page)).uploads.length).toBe(1);
        await expect.poll(async () => (await read(page)).isUploading).toBe(false);
        expect((await read(page)).uploads[0]).toMatchObject({ width: 256, height: 192, type: 'image/gif', size: gif.length, name: 'animation.gif', sha256 });
        const preview = page.locator(reaction || input !== 'drop' ? '.media-gallery img' : '.tiptap-editor img').first();
        await expect(preview).toBeVisible();
        await expect.poll(() => preview.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(256);
        if (input === 'picker') {
            // Sample pixels away from the overlaid buttons, whose transitions are unrelated to GIF frames.
            const box = (await preview.boundingBox())!;
            const clip = { x: Math.floor(box.x + box.width / 4), y: Math.floor(box.y + box.height / 2), width: 4, height: 4 };
            const sample = async () => createHash('sha256').update(await page.screenshot({ clip, animations: 'allow' })).digest('hex');
            const first = await sample();
            await expect.poll(sample).not.toBe(first);
            await preview.screenshot({ path: testInfo.outputPath('animated-gif-preview.png'), animations: 'allow' });
        }
        if (reaction) {
            expect((await read(page)).gallery[0]).toMatchObject({ mimeType: 'image/gif', isPlaceholder: false });
            await editor.fill('gif_reaction');
            await page.getByRole('button', { name: '投稿', exact: true }).click();
            await expect.poll(async () => (await read(page)).wire?.content).toBe(':gif_reaction:');
            expect((await read(page)).wire?.emoji).toEqual([['emoji', 'gif_reaction', new URL('gif-fixture.gif', page.url()).href]]);
        }
        expect(pageErrors).toEqual([]);
    });
}
