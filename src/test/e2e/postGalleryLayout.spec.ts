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
        await expect(page.getByRole('textbox', { name: '投稿エディター' })).toBeVisible();

        const welcomeDialog = page.locator('.welcome-dialog');
        if (await welcomeDialog.isVisible().catch(() => false)) {
            await welcomeDialog.getByRole('button', { name: 'はじめる' }).click();
        }

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

    test('restores editor height immediately after gallery clear in the normal app', async ({ page }) => {
        await page.setViewportSize({ width: 900, height: 1600 });
        await page.goto('/ehagaki/');

        const editor = page.getByRole('textbox', { name: '投稿エディター' });
        const editorContent = editor.locator('.tiptap-editor');
        await expect(editorContent).toBeVisible();

        const welcomeDialog = page.locator('.welcome-dialog');
        if (await welcomeDialog.isVisible().catch(() => false)) {
            await welcomeDialog.getByRole('button', { name: 'はじめる' }).click();
        }

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
