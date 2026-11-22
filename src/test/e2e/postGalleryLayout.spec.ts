import { expect, test, type Page } from '@playwright/test';

type LayoutSnapshot = {
    editor: { top: number; bottom: number; height: number };
    gallery: { top: number; bottom: number; height: number } | null;
    post: { top: number; bottom: number; height: number };
    toolbar: { top: number; bottom: number; height: number };
    editorToToolbar: number;
    postToToolbar: number;
    editorText: string;
};

async function readLayout(page: Page): Promise<LayoutSnapshot> {
    return page.evaluate(() => {
        const readBox = (selector: string) => {
            const element = document.querySelector<HTMLElement>(selector);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom, height: rect.height };
        };

        const editor = readBox('.editor-container');
        const post = readBox('.post-container');
        const toolbar = readBox('.footer-button-bar');
        const gallery = readBox('.media-gallery');
        const editorElement = document.querySelector('.tiptap-editor');

        if (!editor || !post || !toolbar || !(editorElement instanceof HTMLElement)) {
            throw new Error('Composer layout elements are not ready');
        }

        return {
            editor,
            gallery,
            post,
            toolbar,
            editorToToolbar: toolbar.top - editor.bottom,
            postToToolbar: toolbar.top - post.bottom,
            editorText: editorElement.textContent ?? '',
        };
    });
}

async function waitForAnimationFrame(page: Page): Promise<void> {
    await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
}

async function waitForFrames(page: Page, count: number): Promise<void> {
    for (let index = 0; index < count; index += 1) {
        await waitForAnimationFrame(page);
    }
}

test.describe('post gallery layout', () => {
    test('normal app uses the shared Base non-button surfaces', async ({ page }) => {
        await page.setViewportSize({ width: 900, height: 1600 });
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/ehagaki/');
        await expect(page.locator('.tiptap-editor')).toBeVisible();

        const welcomeDialog = page.locator('.welcome-dialog');
        if (await welcomeDialog.isVisible().catch(() => false)) {
            await welcomeDialog.getByRole('button', { name: 'はじめる' }).click();
        }
        await expect(page.getByRole('textbox', { name: '投稿エディター' })).toBeVisible();

        const result = await page.evaluate(() => {
            document.documentElement.style.setProperty('--base-color-user', '#d9e8f2');
            const colorToPixel = (color: string) => {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const context = canvas.getContext('2d')!;
                context.fillStyle = color;
                context.fillRect(0, 0, 1, 1);
                return Array.from(context.getImageData(0, 0, 1, 1).data);
            };
            const pixel = (selector: string) => {
                const element = document.querySelector<HTMLElement>(selector);
                if (!element) throw new Error(`Missing ${selector}`);
                return colorToPixel(getComputedStyle(element).backgroundColor);
            };
            return {
                background: pixel('.ehagaki-app-root'),
                editor: pixel('.editor-container'),
                footer: pixel('.footer-bar'),
                buttonbar: pixel('.footer-button-bar'),
            };
        });

        expect(result).toEqual({
            background: [242, 245, 246, 255],
            editor: [253, 254, 254, 255],
            footer: [219, 224, 227, 255],
            buttonbar: [242, 245, 246, 255],
        });
    });

    test('keeps responsive dimensions while reordering and deleting gallery items', async ({ page }) => {
        await page.setViewportSize({ width: 900, height: 800 });
        await page.goto('/ehagaki/');
        await expect(page.locator('.tiptap-editor')).toBeVisible();
        const welcome = page.locator('.welcome-dialog');
        if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'はじめる' }).click();

        await page.evaluate(async () => {
            const loadModule = (path: string) => import(/* @vite-ignore */ path);
            const [settings, gallery] = await Promise.all([
                loadModule('/ehagaki/src/stores/settingsStore.svelte.ts'),
                loadModule('/ehagaki/src/stores/mediaGalleryStore.svelte.ts'),
            ]);
            settings.settingsStore.mediaFreePlacement = false;
            const src = 'data:image/svg+xml,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="100"><rect width="100%" height="100%" fill="teal"/></svg>',
            );
            for (const alt of ['first image', 'second image', 'third image', 'fourth image']) {
                gallery.mediaGalleryStore.addItem({ id: alt, type: 'image', src, alt, isPlaceholder: false });
            }
        });

        const gallery = page.locator('.media-gallery');
        const cards = gallery.locator('.gallery-item');
        await expect(gallery).toHaveCSS('height', '320px');
        await expect(cards.first().locator('img')).toHaveCSS('width', '280px');
        await expect(cards.first().locator('img')).toHaveCSS('transform', 'matrix(1.5, 0, 0, 1.5, 0, 0)');

        const secondCard = await cards.nth(1).boundingBox();
        if (!secondCard) throw new Error('Second media card is missing');
        await cards.first().dragTo(cards.nth(1), {
            sourcePosition: { x: 24, y: 24 },
            targetPosition: { x: secondCard.width - 24, y: 24 },
        });
        await expect(cards.first().locator('img')).toHaveAttribute('alt', 'second image');
        await cards.first().locator('.media-delete-btn').click();
        await expect(cards).toHaveCount(3);
        await expect(cards.first().locator('img')).toHaveAttribute('alt', 'first image');

        await gallery.hover();
        await page.getByRole('button', { name: '次のメディアを表示' }).click();
        await expect.poll(() => gallery.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
        await page.getByRole('button', { name: '前のメディアを表示' }).click();
        await expect.poll(() => gallery.evaluate(node => node.scrollLeft)).toBe(0);

        await page.setViewportSize({ width: 360, height: 800 });
        await expect(gallery).toHaveCSS('height', '180px');
        await expect(cards.first().locator('img')).toHaveCSS('width', '160px');
    });

    test('restores editor height immediately after gallery clear in the normal app', async ({ page }) => {
        await page.setViewportSize({ width: 900, height: 1600 });
        await page.goto('/ehagaki/');

        const editor = page.getByRole('textbox', { name: '投稿エディター' });
        const editorContent = editor.locator('.tiptap-editor');
        // App bootstrap imports the editor asynchronously. Wait for that
        // lifecycle boundary before checking its rendered visibility.
        await page.locator('.tiptap-editor').waitFor({ state: 'attached' });
        await expect(page.locator('.tiptap-editor')).toBeVisible();

        const welcomeDialog = page.locator('.welcome-dialog');
        if (await welcomeDialog.isVisible().catch(() => false)) {
            await welcomeDialog.getByRole('button', { name: 'はじめる' }).click();
        }
        await expect(editorContent).toBeVisible();

        await editor.click();
        await page.keyboard.type('gallery layout regression');
        const initialLayout = await readLayout(page);
        expect(initialLayout.gallery).toBeNull();
        expect(initialLayout.editor.height).toBeGreaterThan(0);
        expect(initialLayout.editorToToolbar).toBeCloseTo(0, 0);
        expect(initialLayout.postToToolbar).toBeCloseTo(0, 0);

        await page.evaluate(async () => {
            const loadModule = (path: string) => import(/* @vite-ignore */ path);
            const [settingsModule, galleryModule] = await Promise.all([
                loadModule('/ehagaki/src/stores/settingsStore.svelte.ts'),
                loadModule('/ehagaki/src/stores/mediaGalleryStore.svelte.ts'),
            ]);

            settingsModule.settingsStore.mediaFreePlacement = false;
            galleryModule.mediaGalleryStore.addItem({
                id: 'post-gallery-layout-regression',
                type: 'image',
                src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
                isPlaceholder: false,
                mimeType: 'image/gif',
            });
        });

        await expect.poll(async () => (await readLayout(page)).gallery?.height ?? 0).toBeGreaterThan(0);
        await waitForFrames(page, 4);
        await editor.click();

        const galleryLayout = await readLayout(page);
        expect(galleryLayout.gallery).not.toBeNull();
        expect(galleryLayout.editor.height).toBeLessThan(initialLayout.editor.height);
        expect(
            Math.abs(
                initialLayout.editor.height
                - galleryLayout.editor.height
                - galleryLayout.gallery!.height,
            ),
        ).toBeLessThanOrEqual(2);
        expect(galleryLayout.postToToolbar).toBeCloseTo(0, 0);

        await page.evaluate(async () => {
            const loadModule = (path: string) => import(/* @vite-ignore */ path);
            const [galleryModule, editorModule, statusModule] = await Promise.all([
                loadModule('/ehagaki/src/stores/mediaGalleryStore.svelte.ts'),
                loadModule('/ehagaki/src/stores/editorStore.svelte.ts'),
                loadModule('/ehagaki/src/lib/postComponentUtils.ts'),
            ]);

            const handlers = statusModule.createPostStatusHandlers({
                updatePostStatus: editorModule.updatePostStatus,
                clearContentAfterSuccess: () => {
                    const currentEditor = editorModule.currentEditorStore.value;
                    if (!currentEditor) throw new Error('Editor is not ready');
                    currentEditor.chain().clearContent().run();
                    galleryModule.mediaGalleryStore.clearAll();
                },
            });

            handlers.markSending();
            handlers.markSuccess();
        });

        await expect.poll(async () => (await readLayout(page)).gallery === null).toBe(true);
        await waitForAnimationFrame(page);

        const restoredLayout = await readLayout(page);
        expect(restoredLayout.gallery).toBeNull();
        expect(restoredLayout.editor.height).toBeCloseTo(initialLayout.editor.height, 0);
        expect(restoredLayout.editorToToolbar).toBeCloseTo(0, 0);
        expect(restoredLayout.postToToolbar).toBeCloseTo(0, 0);
        expect(restoredLayout.editorText).toBe('');
        await expect(editorContent).toHaveText('');

        await editor.click();
        await page.keyboard.type('next post input');
        await expect(editorContent).toContainText('next post input');
    });
});
