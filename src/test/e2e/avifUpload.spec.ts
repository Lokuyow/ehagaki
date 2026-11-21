import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const fixtures = {
    still: readFileSync(new URL('../fixtures/avif/still.avif', import.meta.url)),
    animated: readFileSync(new URL('../fixtures/avif/animated.avif', import.meta.url)),
};
type AvifHarness = {
    startReaction(): void;
    read(): Promise<{
        uploads: { name: string; type: string; width: number; height: number; size: number; sha256: string; alpha: number }[];
        gallery: { src: string; mimeType?: string; isPlaceholder: boolean }[];
        isUploading: boolean;
        wire: { content: string; emoji: string[][] } | null;
    }>;
};
type HarnessWindow = Window & { __REACTION__: AvifHarness };
const read = (page: Page) => page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.read());
const mimeType = 'image/avif';

test.beforeEach(async ({ page, browserName }) => {
    if (browserName !== 'webkit') return;
    const nativeAvif = await page.evaluate(async base64 => {
        const image = new Image();
        image.src = 'data:image/avif;base64,' + base64;
        return image.decode().then(() => image.naturalWidth === 384, () => false);
    }, fixtures.still.toString('base64'));
    test.skip(!nativeAvif, 'This WebKit build has no native AVIF decoder');
});

const scenarios = [
    { mode: 'post', input: 'picker', format: 'still' },
    { mode: 'post', input: 'drop', format: 'animated' },
    { mode: 'reaction', input: 'paste', format: 'still' },
    { mode: 'reaction', input: 'picker', format: 'animated' },
] as const;

for (const { mode, input, format } of scenarios) {
    test([mode, 'preserves', format, 'AVIF through', input].join(' '), async ({ page }) => {
        const bytes = fixtures[format];
        const name = format + '.AVIF';
        const freePlacement = input === 'drop';
        const returnedPath = mode === 'post' && !freePlacement ? 'avif-media' : 'remote.AVIF?token=1';
        await page.addInitScript(() => localStorage.setItem('imageQualityLevel', 'high'));
        await page.route(/\/(avif-media|remote\.AVIF)(\?|$)/, route => route.fulfill({ contentType: mimeType, body: bytes }));
        await page.route('**/reaction-fixture-upload', route => route.fulfill({
            json: { url: new URL(returnedPath, route.request().url()).href },
        }));
        await page.goto('post-reaction-playwright.html?uploaded' + (freePlacement ? '&free' : ''));
        await page.waitForFunction(() => !!(window as unknown as HarnessWindow).__REACTION__);
        if (mode === 'reaction') await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());

        const editor = page.locator('.tiptap-editor');
        if (input === 'picker') {
            const picker = page.locator('input[type=file]');
            await expect(picker).toHaveAttribute('accept', /\.avif/);
            await picker.setInputFiles({ name, mimeType, buffer: bytes });
        } else {
            await editor.evaluate((element, { bytes, input, name }) => {
                const transfer = new DataTransfer();
                const type = input === 'paste' ? '' : 'application/octet-stream';
                transfer.items.add(new File([new Uint8Array(bytes)], name, { type }));
                if (input === 'paste') {
                    const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
                    Object.defineProperty(event, 'clipboardData', { value: transfer });
                    element.dispatchEvent(event);
                } else {
                    element.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
                }
            }, { bytes: [...bytes], input, name });
        }

        await expect.poll(async () => (await read(page)).uploads.length).toBe(1);
        await expect.poll(async () => (await read(page)).isUploading).toBe(false);
        const uploaded = (await read(page)).uploads[0];
        expect(uploaded).toMatchObject({
            name, type: mimeType, width: 384, height: 256, size: bytes.length,
            sha256: createHash('sha256').update(bytes).digest('hex'),
        });
        if (format === 'still') expect(uploaded.alpha).toBe(0);

        const preview = page.locator(freePlacement ? '.tiptap-editor img' : '.media-gallery img').first();
        await expect(preview).toBeVisible();
        await expect.poll(() => preview.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(384);
        if (!freePlacement) expect((await read(page)).gallery[0]).toMatchObject({ mimeType, isPlaceholder: false });
        if (format === 'animated') {
            const box = (await preview.boundingBox())!;
            const clip = { x: Math.floor(box.x + box.width / 3), y: Math.floor(box.y + box.height / 2), width: 4, height: 4 };
            const sample = async () => createHash('sha256').update(await page.screenshot({ clip, animations: 'allow' })).digest('hex');
            const firstFrame = await sample();
            await expect.poll(sample).not.toBe(firstFrame);
        }
        if (mode === 'reaction') {
            await page.getByRole('button', { name: '投稿', exact: true }).click();
            await expect.poll(async () => (await read(page)).wire?.emoji).toEqual([
                ['emoji', format, new URL(returnedPath, page.url()).href],
            ]);
        }
    });
}

test('URL-only AVIF renders in a previously stored history record', async ({ page }) => {
    await page.route('**/remote.AVIF?token=1', route => route.fulfill({ contentType: mimeType, body: fixtures.still }));
    await page.goto('post-reaction-playwright.html?old-avif-history');
    await page.waitForFunction(() => !!(window as unknown as HarnessWindow).__REACTION__);
    await page.getByTestId('open-history').click();
    const imageButton = page.getByRole('button', { name: '開く remote.AVIF', exact: true });
    await expect(imageButton).toBeVisible({ timeout: 15_000 });
    const preview = imageButton.locator('img');
    await expect(preview).toBeVisible();
    await expect.poll(() => preview.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(384);
});
