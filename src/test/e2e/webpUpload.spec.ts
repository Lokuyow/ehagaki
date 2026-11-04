import { writeFile } from 'node:fs/promises';
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

test('static document keeps text resolution through native and WASM encoding', async ({ page }, testInfo) => {
    await page.goto('post-reaction-playwright.html');
    const result = await page.evaluate(async () => {
        const modulePath = new URL('src/lib/imageCompressionService.ts', location.href).href;
        const { ImageCompressionService } = await import(modulePath);
        const source = document.createElement('canvas'); source.width = 2000; source.height = 7038;
        const context = source.getContext('2d')!;
        context.fillStyle = '#fff'; context.fillRect(0, 0, source.width, source.height);
        context.fillStyle = '#111'; context.font = '24px sans-serif';
        for (let y = 50; y < source.height; y += 45) context.fillText('文書の可読性：濁点・小さい文字・細線 0123456789', 20, y);
        const png = await new Promise<Blob>(resolve => source.toBlob(blob => resolve(blob!), 'image/png'));
        // Padding leaves the valid PNG intact while avoiding original-size fallback in this encoder test.
        const file = new File([png, new Uint8Array(3_000_000)], 'document.png', { type: 'image/png' });
        source.width = source.height = 0;
        const results = [];
        for (const native of [true, false]) {
            const service = new ImageCompressionService({ canEncodeMimeType: () => native }, { getItem: () => 'medium' }, () => false);
            const start = performance.now(); const output = await service.compress(file);
            const url = URL.createObjectURL(output.file);
            const image = new Image(); image.src = url; await image.decode();
            const crop = document.createElement('canvas'); crop.width = 600; crop.height = 100;
            crop.getContext('2d')!.drawImage(image, 0, 0);
            results.push({ native, compressed: output.wasCompressed, width: image.naturalWidth, height: image.naturalHeight,
                size: output.file.size, type: output.file.type, ms: performance.now() - start, preview: crop.toDataURL() });
            URL.revokeObjectURL(url);
        }
        return results;
    });
    for (const output of result) {
        expect(output).toMatchObject({ compressed: true, width: 1024, height: 3603, type: 'image/webp' });
        const previewPath = testInfo.outputPath(`${output.native ? 'native' : 'wasm'}-text.png`);
        await writeFile(previewPath, Buffer.from(output.preview.split(',')[1], 'base64'));
        await testInfo.attach('text-preview', { path: previewPath, contentType: 'image/png' });
    }
    await testInfo.attach('encoding-metrics.json', { body: JSON.stringify(result.map(({ preview, ...metrics }) => metrics)), contentType: 'application/json' });
});

test('static encoding preserves transparency and browser-decoded EXIF orientation', async ({ page }) => {
    await page.goto('post-reaction-playwright.html');
    const result = await page.evaluate(async () => {
        const { ImageCompressionService } = await import(new URL('src/lib/imageCompressionService.ts', location.href).href);
        const service = new ImageCompressionService({ canEncodeMimeType: () => true }, { getItem: () => 'medium' }, () => false);
        const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 800;
        const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#00f'; ctx.fillRect(0,0,600,800);
        const png = await new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'));
        const alphaOutput = await service.compress(new File([png,new Uint8Array(100000)],'alpha.png',{type:'image/png'}));
        const load = async (blob: Blob) => { const url=URL.createObjectURL(blob);const image=new Image();image.src=url;await image.decode();URL.revokeObjectURL(url);return image; };
        const alphaImage=await load(alphaOutput.file);ctx.clearRect(0,0,1200,800);ctx.drawImage(alphaImage,0,0);
        const alpha=ctx.getImageData(1100,400,1,1).data[3];
        ctx.fillStyle='#fff';ctx.fillRect(0,0,1200,800);ctx.fillStyle='#00f';ctx.fillRect(0,0,600,400);
        const jpeg=await new Promise<Blob>(resolve=>canvas.toBlob(blob=>resolve(blob!),'image/jpeg',.95));
        const bytes=new Uint8Array(await jpeg.arrayBuffer()); const orientations=[];
        for(const orientation of [2,6,8]) {
            const hex='ffe100224578696600004d4d002a0000000800010112000300000001'+orientation.toString(16).padStart(4,'0')+'000000000000';
            const exif=Uint8Array.from(hex.match(/../g)!, value=>parseInt(value,16));
            const input=new File([bytes.slice(0,2),exif,bytes.slice(2),new Uint8Array(100000)],'oriented.jpg',{type:'image/jpeg'});
            const reference=await load(input);const output=await service.compress(input);const image=await load(output.file);
            const pixels=(img: HTMLImageElement)=> {canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;ctx.drawImage(img,0,0);return [...ctx.getImageData(10,10,1,1).data];};
            orientations.push({orientation,compressed:output.wasCompressed,width:image.naturalWidth,height:image.naturalHeight,reference:[reference.naturalWidth,reference.naturalHeight],pixel:pixels(image),expected:pixels(reference)});
        }
        return {alpha,compressed:alphaOutput.wasCompressed,orientations};
    });
    expect(result.alpha).toBe(0);expect(result.compressed).toBe(true);
    for(const item of result.orientations) {
        expect(item.compressed).toBe(true);expect([item.width,item.height]).toEqual(item.reference);
        expect(item.reference).toEqual(item.orientation===2?[1200,800]:[800,1200]);
        item.pixel.forEach((value:number,index:number)=>expect(Math.abs(value-item.expected[index])).toBeLessThan(15));
    }
});
