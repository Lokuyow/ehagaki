import { expect, test } from '@playwright/test';

test.describe('post editor sending state', () => {
    test('keeps the content readable and blocks editing in light and dark themes', async ({ page }) => {
        for (const colorScheme of ['light', 'dark'] as const) {
            await page.emulateMedia({ colorScheme });
            await page.goto('post-editor-sending-playwright.html');

            const editorContainer = page.getByRole('textbox', { name: '投稿エディター' });
            const editor = editorContainer.locator('.tiptap-editor');
            await expect(editor).toHaveAttribute('contenteditable', 'true');

            await editor.click();
            await page.keyboard.type('送信中も確認する本文');
            await expect(editor).toContainText('送信中も確認する本文');

            await page.getByTestId('toggle-sending').click();
            await expect(page.getByTestId('sending-state')).toHaveText('sending');
            await expect(editorContainer).toHaveClass(/sending/);
            await expect(editorContainer).toHaveAttribute('aria-disabled', 'true');
            await expect(editor).toHaveAttribute('contenteditable', 'false');
            await expect(editor).toContainText('送信中も確認する本文');
            await expect.poll(() => editor.evaluate((element) => getComputedStyle(element).opacity)).toBe('0.72');

            await editor.click();
            await page.keyboard.type('変更不可');
            await expect(editor).toHaveText('送信中も確認する本文');

            await page.getByTestId('toggle-sending').click();
            await expect(page.getByTestId('sending-state')).toHaveText('idle');
            await expect(editor).toHaveAttribute('contenteditable', 'true');
            await expect(editorContainer).not.toHaveClass(/sending/);
            await expect(editorContainer).not.toHaveAttribute('aria-disabled');

            await editor.click();
            await page.keyboard.type('編集再開');
            await expect(editor).toContainText('編集再開');
        }
    });

    test('contains a large active-account avatar inside the empty-editor placeholder', async ({ page }) => {
        await page.goto('post-editor-sending-playwright.html?withProfileAvatar=1');

        const editorContainer = page.getByRole('textbox', { name: '投稿エディター' });
        const editor = editorContainer.locator('.tiptap-editor');
        const wrapper = page.locator('.editor-account-placeholder');
        const image = wrapper.locator('img');

        await expect(image).toHaveJSProperty('naturalWidth', 512);
        await expect(image).toHaveJSProperty('naturalHeight', 512);

        const geometry = await page.evaluate(() => {
            const wrapper = document.querySelector('.editor-account-placeholder');
            const root = wrapper?.querySelector('.editor-account-placeholder-avatar');
            const image = wrapper?.querySelector('img');
            const paragraph = document.querySelector('.tiptap-editor p');
            if (!wrapper || !root || !image || !paragraph) {
                throw new Error('Editor placeholder geometry nodes were not found.');
            }

            const wrapperRect = wrapper.getBoundingClientRect();
            const rootRect = root.getBoundingClientRect();
            const imageRect = image.getBoundingClientRect();
            const paragraphRect = paragraph.getBoundingClientRect();
            const editorRect = document.querySelector('.editor-container')?.getBoundingClientRect();
            if (!editorRect) {
                throw new Error('Editor container geometry was not found.');
            }
            const paddingLeft = Number.parseFloat(getComputedStyle(paragraph, '::before').paddingLeft) || 0;

            return {
                editor: { x: editorRect.x, y: editorRect.y, width: editorRect.width, height: editorRect.height },
                wrapper: { x: wrapperRect.x, y: wrapperRect.y, width: wrapperRect.width, height: wrapperRect.height },
                root: { x: rootRect.x, y: rootRect.y, width: rootRect.width, height: rootRect.height },
                image: { x: imageRect.x, y: imageRect.y, width: imageRect.width, height: imageRect.height },
                paragraph: { x: paragraphRect.x, y: paragraphRect.y, width: paragraphRect.width, height: paragraphRect.height },
                placeholderTextStart: paragraphRect.x + paddingLeft,
                placeholderTextPaddingLeft: paddingLeft,
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: document.documentElement.clientWidth,
            };
        });

        expect(geometry.wrapper.width).toBeCloseTo(28, 0);
        expect(geometry.wrapper.height).toBeCloseTo(28, 0);
        expect(geometry.wrapper.x - geometry.editor.x).toBeCloseTo(14, 0);
        expect(geometry.placeholderTextPaddingLeft).toBeCloseTo(38, 0);
        expect(geometry.placeholderTextStart - geometry.editor.x).toBeCloseTo(48, 0);
        expect(geometry.placeholderTextStart - (geometry.wrapper.x + geometry.wrapper.width)).toBeCloseTo(6, 0);
        expect(geometry.root.width).toBeLessThanOrEqual(geometry.wrapper.width + 0.5);
        expect(geometry.root.height).toBeLessThanOrEqual(geometry.wrapper.height + 0.5);
        expect(geometry.image.width).toBeLessThanOrEqual(geometry.wrapper.width + 0.5);
        expect(geometry.image.height).toBeLessThanOrEqual(geometry.wrapper.height + 0.5);
        expect(geometry.image.x).toBeGreaterThanOrEqual(geometry.wrapper.x - 0.5);
        expect(geometry.image.y).toBeGreaterThanOrEqual(geometry.wrapper.y - 0.5);
        expect(geometry.image.x + geometry.image.width).toBeLessThanOrEqual(geometry.wrapper.x + geometry.wrapper.width + 0.5);
        expect(geometry.image.y + geometry.image.height).toBeLessThanOrEqual(geometry.wrapper.y + geometry.wrapper.height + 0.5);
        expect(geometry.image.x + geometry.image.width).toBeLessThanOrEqual(geometry.placeholderTextStart + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);

        const selectionState = await page.evaluate(() => {
            const wrapper = document.querySelector('.editor-account-placeholder');
            const image = wrapper?.querySelector('img');
            if (!wrapper || !image) throw new Error('Editor placeholder selection nodes were not found.');
            const wrapperStyle = getComputedStyle(wrapper);
            const imageStyle = getComputedStyle(image);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            return {
                wrapperUserSelect: wrapperStyle.getPropertyValue('user-select'),
                wrapperWebkitUserSelect: wrapperStyle.getPropertyValue('-webkit-user-select'),
                imageUserSelect: imageStyle.getPropertyValue('user-select'),
                imageWebkitUserSelect: imageStyle.getPropertyValue('-webkit-user-select'),
            };
        });
        expect([selectionState.wrapperUserSelect, selectionState.wrapperWebkitUserSelect]).toContain('none');
        expect([selectionState.imageUserSelect, selectionState.imageWebkitUserSelect]).toContain('none');

        await page.mouse.dblclick(geometry.wrapper.x + geometry.wrapper.width / 2, geometry.wrapper.y + geometry.wrapper.height / 2);
        const browserSelection = await page.evaluate(() => {
            const image = document.querySelector('.editor-account-placeholder img');
            const selection = window.getSelection();
            return {
                containsImage: Boolean(image && selection?.containsNode(image, true)),
                activeElementIsEditor: document.activeElement === document.querySelector('.tiptap-editor'),
            };
        });
        expect(browserSelection.containsImage).toBe(false);
        expect(browserSelection.activeElementIsEditor).toBe(true);

        const clickPoint = await wrapper.boundingBox();
        if (!clickPoint) throw new Error('Editor placeholder wrapper has no box.');
        await page.mouse.click(clickPoint.x + clickPoint.width / 2, clickPoint.y + clickPoint.height / 2);
        await expect.poll(() => page.locator('.tiptap-editor').evaluate((element) => document.activeElement === element)).toBe(true);

        await editor.pressSequentially('geometry');
        await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
        const afterInput = await page.evaluate(() => ({
            placeholderVisible: document.querySelector('.tiptap-editor p')?.classList.contains('is-editor-empty') ?? false,
            avatarVisible: Boolean(document.querySelector('.editor-account-placeholder')),
        }));
        expect(afterInput).toEqual({ placeholderVisible: false, avatarVisible: false });

        await editor.locator('p').dblclick();
        await expect.poll(() => page.evaluate(() => window.getSelection()?.toString() ?? '')).toContain('geometry');

        for (let index = 0; index < 'geometry'.length; index += 1) {
            await page.keyboard.press('Backspace');
        }
        await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
        const afterDelete = await page.evaluate(() => ({
            placeholderVisible: document.querySelector('.tiptap-editor p')?.classList.contains('is-editor-empty') ?? false,
            avatarVisible: Boolean(document.querySelector('.editor-account-placeholder')),
        }));
        expect(afterDelete).toEqual({ placeholderVisible: true, avatarVisible: true });

        await page.goto('post-editor-sending-playwright.html?withFallbackAvatar=1');
        const fallbackWrapper = page.locator('.editor-account-placeholder');
        await expect(fallbackWrapper.locator('.editor-account-placeholder-fallback')).toBeVisible();
        const fallbackGeometry = await fallbackWrapper.locator('.editor-account-placeholder-fallback').boundingBox();
        const wrapperGeometry = await fallbackWrapper.boundingBox();
        if (!fallbackGeometry || !wrapperGeometry) throw new Error('Fallback geometry was not found.');
        expect(wrapperGeometry.width).toBeCloseTo(28, 0);
        expect(wrapperGeometry.height).toBeCloseTo(28, 0);
        expect(fallbackGeometry.width).toBeLessThanOrEqual(wrapperGeometry.width + 0.5);
        expect(fallbackGeometry.height).toBeLessThanOrEqual(wrapperGeometry.height + 0.5);
    });

    test('preserves the open picker and restores editor focus after a successful post', async ({ page }) => {
        await page.goto('post-editor-sending-playwright.html');

        const editorContainer = page.getByRole('textbox', { name: '投稿エディター' });
        const editor = editorContainer.locator('.tiptap-editor');
        const pickerToggle = page.getByTestId('toggle-picker');
        const pickerHost = page.getByTestId('custom-emoji-picker-host');

        await editor.click();
        await page.keyboard.type('投稿成功後にクリアされる本文');
        await pickerToggle.click();
        await expect(pickerHost).toBeVisible();
        await expect(page.getByAltText(':sending-safe:')).toBeVisible();

        const pickerIdentity = await pickerHost.locator('.custom-emoji-picker').elementHandle();
        if (!pickerIdentity) throw new Error('Custom emoji picker was not mounted.');

        await page.getByTestId('toggle-sending').click();
        await expect(editor).toHaveAttribute('contenteditable', 'false');
        await expect(pickerHost).toBeVisible();

        const contentBeforePickerSelection = await editor.textContent();
        await page.getByAltText(':sending-safe:').click();
        await expect(editor).toHaveText(contentBeforePickerSelection ?? '');

        await page.getByTestId('complete-post').click();
        await expect(editor).toHaveAttribute('contenteditable', 'true');
        await expect(editor).toHaveText('');
        await expect(pickerHost).toBeVisible();
        await expect.poll(() => editor.evaluate((element) => document.activeElement === element)).toBe(true);
        expect(await pickerHost.evaluate((element, picker) => element.querySelector('.custom-emoji-picker') === picker, pickerIdentity)).toBe(true);
    });

    test('preserves a closed picker after a failed post', async ({ page }) => {
        await page.goto('post-editor-sending-playwright.html');

        const editor = page.getByRole('textbox', { name: '投稿エディター' }).locator('.tiptap-editor');
        await editor.click();
        await page.keyboard.type('失敗する本文');

        await page.getByTestId('toggle-sending').click();
        await page.getByTestId('fail-post').click();

        await expect(page.getByTestId('custom-emoji-picker-host')).toHaveCount(0);
        await expect(editor).toHaveText('失敗する本文');

        await page.goto('post-editor-sending-playwright.html');
        await page.getByTestId('toggle-picker').click();
        await expect(page.getByTestId('custom-emoji-picker-host')).toBeVisible();
        await page.getByTestId('toggle-sending').click();
        await page.getByTestId('fail-post').click();
        await expect(page.getByTestId('custom-emoji-picker-host')).toBeVisible();
    });

    test('preserves the App picker when the App post status enters and leaves sending', async ({ page }) => {
        await page.goto('app-composer-picker-playwright.html');

        const pickerButton = page.getByRole('button', { name: 'カスタム絵文字' });
        const pickerRegion = page.locator('.custom-emoji-picker-region');

        await expect(pickerButton).toBeVisible();
        const welcomeDialog = page.locator('.welcome-dialog');
        if (await welcomeDialog.isVisible().catch(() => false)) {
            await welcomeDialog.getByRole('button', { name: 'はじめる' }).click();
        }
        await page.evaluate(() => {
            const harness = (window as Window & typeof globalThis & {
                __APP_COMPOSER_PICKER_HARNESS__?: { setAuthenticated(): void };
            }).__APP_COMPOSER_PICKER_HARNESS__;
            if (!harness) throw new Error('App composer picker harness is not ready.');
            harness.setAuthenticated();
        });
        await expect(pickerButton).toBeEnabled();

        await pickerButton.click();
        await expect(pickerRegion).toBeVisible();

        const pickerIdentity = await pickerRegion.locator('.custom-emoji-picker').elementHandle();
        if (!pickerIdentity) throw new Error('App custom emoji picker was not mounted.');

        await page.evaluate(() => {
            const harness = (window as Window & typeof globalThis & {
                __APP_COMPOSER_PICKER_HARNESS__?: { setSending(): void };
            }).__APP_COMPOSER_PICKER_HARNESS__;
            if (!harness) throw new Error('App composer picker harness is not ready.');
            harness.setSending();
        });
        await expect(pickerRegion).toBeVisible();
        await expect(pickerButton).toBeDisabled();

        await page.evaluate(() => {
            const harness = (window as Window & typeof globalThis & {
                __APP_COMPOSER_PICKER_HARNESS__?: { setIdle(): void };
            }).__APP_COMPOSER_PICKER_HARNESS__;
            if (!harness) throw new Error('App composer picker harness is not ready.');
            harness.setIdle();
        });
        await expect(pickerRegion).toBeVisible();
        await expect(pickerButton).toBeEnabled();
        expect(await pickerRegion.evaluate((element, picker) => element.querySelector('.custom-emoji-picker') === picker, pickerIdentity)).toBe(true);
    });
});
