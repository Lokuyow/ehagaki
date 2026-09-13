import { devices, expect, test, type Page, type Locator } from '@playwright/test';

async function beginLongPress(page: Page, button: Locator, nativeTouch: boolean) {
    if (nativeTouch) {
        const session = await page.context().newCDPSession(page);
        const box = await button.boundingBox();
        if (!box) throw new Error('No submit button box');
        await session.send('Input.dispatchTouchEvent', {
            type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
        });
        return async () => {
            await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            await session.detach();
        };
    }
    // WebKit has no CDP touch hold API. Test the real pointer handler with a
    // synthetic touch pointer, separately from Chromium's native touch input.
    await button.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 1, bubbles: true });
    return async () => {
        await button.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 1, bubbles: true });
        await button.dispatchEvent('click');
    };
}

async function observeFocus(editor: Locator) {
    await editor.evaluate((element) => {
        const state = { blurs: 0, focusCalls: 0, invalidAttributes: [] as string[] };
        (window as any).__focusObservation = state;
        element.addEventListener('blur', () => state.blurs++);
        element.addEventListener('focus', () => state.focusCalls++);
        new MutationObserver((records) => {
            for (const record of records) {
                const value = element.getAttribute(record.attributeName!);
                if (value === 'none' || value === 'false' || record.oldValue === 'none' || record.oldValue === 'false') {
                    state.invalidAttributes.push(record.attributeName!);
                }
            }
        }).observe(element, { attributes: true, attributeOldValue: true, attributeFilter: ['contenteditable', 'inputmode'] });
    });
}

async function finishSubmission(page: Page, success: boolean) {
    await page.evaluate((ok) => (window as any).__postSubmitHarness.finish(ok), success);
}

async function endComposition(editor: Locator, text: string) {
    await editor.evaluate((element, value) => {
        element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: value }));
        // Intentionally update after compositionend in this same task. Reading
        // synchronously in that handler would capture the old document.
        element.querySelector('p')!.textContent = value;
        element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
    }, text);
}

test('long-press submits once without losing focus and freezes the document until success', async ({ page, browserName, isMobile }) => {
    await page.goto('post-editor-sending-playwright.html?withSubmit=1');
    const editor = page.locator('.tiptap-editor');
    await editor.click();
    await page.keyboard.type('frozen draft');
    const button = page.locator('button.post-button');
    await expect(button).toBeEnabled();
    await observeFocus(editor);
    const release = await beginLongPress(page, button, browserName === 'chromium' && isMobile);
    await expect(page.getByTestId('sending-state')).toHaveText('sending');
    // Sending must begin before releasing the pointer.
    await expect(editor).toBeFocused();
    await release();
    await expect(editor).toHaveAttribute('contenteditable', 'true');
    await expect(page.getByRole('textbox')).toMatchAriaSnapshot('- textbox "投稿エディター" [disabled]');
    for (const key of ['x', 'Enter', 'Shift+Enter', 'Backspace', 'Control+z', 'Control+y']) await page.keyboard.press(key);
    for (const type of ['paste', 'cut', 'drop']) {
        await editor.evaluate((element, type) => {
            const transfer = new DataTransfer();
            transfer.setData('text/plain', 'blocked');
            const event = type === 'drop'
                ? new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: transfer })
                : new ClipboardEvent(type, { bubbles: true, cancelable: true, clipboardData: transfer });
            element.dispatchEvent(event);
        }, type);
    }
    await editor.evaluate((element) => {
        const ed = (window as any).__currentEditor;
        ed.view.dispatch(ed.state.tr.insertText('blocked').setMeta('composition', 1));
        element.querySelector('p')!.textContent = 'uncancellable native input';
        element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', isComposing: true }));
    });
    await expect(editor).toHaveText('frozen draft');
    expect(await page.evaluate(() => (window as any).__currentEditor.state.doc.textContent)).toBe('frozen draft');
    expect(await page.evaluate(() => (window as any).__postSubmitHarness.submissions.length)).toBe(1);
    await finishSubmission(page, true);
    await expect(editor).toHaveText('');
    await expect(editor).toBeFocused();
    expect(await page.evaluate(() => (window as any).__focusObservation)).toEqual({ blurs: 0, focusCalls: 0, invalidAttributes: [] });
});

test('composition long-press waits for the final document and keeps one intent', async ({ page, browserName, isMobile }) => {
    await page.goto('post-editor-sending-playwright.html?withSubmit=1');
    const editor = page.locator('.tiptap-editor');
    await editor.click();
    await page.keyboard.type('draft');
    const button = page.locator('button.post-button');
    await expect(button).toBeEnabled();
    await editor.dispatchEvent('compositionstart', { data: 'draft' });
    await observeFocus(editor);
    const release = await beginLongPress(page, button, browserName === 'chromium' && isMobile);
    await expect(page.getByTestId('submit-pending')).toHaveText('pending');
    await release();
    await page.evaluate(() => {
        const container = document.querySelector('.editor-container') as any;
        container.__uploadFiles([new File(['blocked'], 'blocked.png', { type: 'image/png' })]);
    });
    await expect(editor.locator('img')).toHaveCount(0);
    await page.evaluate(() => { void (document.querySelector('.editor-container') as any).__submitPost(); });
    expect(await page.evaluate(() => (window as any).__postSubmitHarness.submissions.length)).toBe(0);
    await expect(page.getByRole('textbox')).not.toHaveAttribute('aria-disabled');
    await endComposition(editor, '日本語の最終確定');
    await expect(page.getByTestId('sending-state')).toHaveText('sending');
    expect(await page.evaluate(() => (window as any).__postSubmitHarness.submissions.map((p: any) => p.content))).toEqual(['日本語の最終確定']);
    await expect(editor).toHaveText('日本語の最終確定');
    await finishSubmission(page, false);
    await expect(page.getByTestId('sending-state')).toHaveText('idle');
    await expect(editor).toHaveText('日本語の最終確定');
    await expect(editor).toBeFocused();
    expect(await page.evaluate(() => (window as any).__focusObservation)).toEqual({ blurs: 0, focusCalls: 0, invalidAttributes: [] });
    await page.keyboard.type('再編集');
    await expect(editor).toContainText('再編集');
});

test('unfocused submission does not acquire focus on success or failure', async ({ page, browserName, isMobile }) => {
    for (const success of [true, false]) {
        await page.goto('post-editor-sending-playwright.html?withSubmit=1');
        const editor = page.locator('.tiptap-editor');
        await editor.click();
        await page.keyboard.type('unfocused draft');
        await page.getByTestId('toggle-picker').focus();
        await observeFocus(editor);
        const button = page.locator('button.post-button');
        await expect(button).toBeEnabled();
        const release = await beginLongPress(page, button, browserName === 'chromium' && isMobile);
        await expect(page.getByTestId('sending-state')).toHaveText('sending');
        await release();
        await finishSubmission(page, success);
        await expect(page.getByTestId('sending-state')).toHaveText('idle');
        await expect(editor).not.toBeFocused();
        await expect(editor).toHaveText(success ? '' : 'unfocused draft');
        expect(await page.evaluate(() => (window as any).__focusObservation.focusCalls)).toBe(0);
    }
});

test('composition intent transfers to secret confirmation and is consumed or cancelled once', async ({ page }) => {
    // Deliberately invalid checksum: exercises detection without containing a key.
    const detectedText = `nsec1${'q'.repeat(58)}`;
    for (const confirm of [false, true]) {
        await page.goto('post-editor-sending-playwright.html?withSubmit=1');
        const editor = page.locator('.tiptap-editor');
        await editor.click();
        await page.keyboard.type('draft');
        await expect(page.locator('button.post-button')).toBeEnabled();
        await editor.dispatchEvent('compositionstart');
        await page.evaluate(() => { void (document.querySelector('.editor-container') as any).__submitPost(); });
        await expect(page.getByTestId('submit-pending')).toHaveText('pending');
        await endComposition(editor, detectedText);
        const dialog = page.locator('.secretkey-warning-dialog');
        await expect(dialog).toBeVisible();
        await expect(page.getByTestId('submit-pending')).toHaveText('idle');
        await page.evaluate(() => { void (document.querySelector('.editor-container') as any).__submitPost(); });
        expect(await page.evaluate(() => (window as any).__postSubmitHarness.submissions.length)).toBe(0);
        // The confirmation owns its snapshot, not the mutable editor document.
        await page.evaluate(() => (window as any).__currentEditor.commands.setContent('<p>changed after dialog</p>'));
        await dialog.getByRole('button', { name: confirm ? '投稿' : 'キャンセル', exact: true }).click();
        await expect(dialog).not.toBeVisible();
        if (confirm) {
            await expect(page.getByTestId('sending-state')).toHaveText('sending');
            expect(await page.evaluate((expected) => {
                const sent = (window as any).__postSubmitHarness.submissions;
                return sent.length === 1 && sent[0].content === expected;
            }, detectedText)).toBe(true);
            await finishSubmission(page, true);
            await expect(editor).toHaveText('');
        } else {
            await editor.dispatchEvent('compositionend');
            await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
            expect(await page.evaluate(() => (window as any).__postSubmitHarness.submissions.length)).toBe(0);
            await expect(editor).toHaveText('changed after dialog');
        }
    }
});

for (const reason of ['empty', 'revoked', 'destroyed'] as const) {
    test(`discards a composition submission when ${reason}`, async ({ page }) => {
        await page.goto('post-editor-sending-playwright.html?withSubmit=1');
        const editor = page.locator('.tiptap-editor');
        await editor.click();
        await page.keyboard.type('draft');
        await expect(page.locator('button.post-button')).toBeEnabled();
        await editor.dispatchEvent('compositionstart');
        await page.evaluate(() => { void (document.querySelector('.editor-container') as any).__submitPost(); });
        await expect(page.getByTestId('submit-pending')).toHaveText('pending');
        if (reason === 'destroyed') {
            await page.getByTestId('unmount-editor').evaluate((el: HTMLButtonElement) => el.click());
        } else {
            if (reason === 'revoked') await page.getByTestId('revoke-posting').evaluate((el: HTMLButtonElement) => el.click());
            await endComposition(editor, reason === 'empty' ? '' : '最終確定');
        }
        await expect(page.getByTestId('submit-pending')).toHaveText('idle');
        expect(await page.evaluate(() => (window as any).__postSubmitHarness.submissions.length)).toBe(0);
    });
}

test('App and iframe use the normal submission path without refocusing', async ({ page, browserName, isMobile }) => {
    await page.goto('app-composer-picker-playwright.html');
    await page.evaluate(() => (window as any).__APP_COMPOSER_PICKER_HARNESS__.setAuthenticated());
    const editor = page.locator('.tiptap-editor');
    await editor.click();
    await page.keyboard.type('App submit');
    await expect(page.locator('button.post-button')).toBeEnabled();
    await observeFocus(editor);
    const release = await beginLongPress(page, page.locator('button.post-button'), browserName === 'chromium' && isMobile);
    await expect.poll(() => page.evaluate(() => (window as any).__postSubmitHarness.submissions.length)).toBe(1);
    await release();
    await finishSubmission(page, true);
    await expect(editor).toHaveText('');
    await expect(editor).toBeFocused();
    expect(await page.evaluate(() => (window as any).__focusObservation.blurs)).toBe(0);

    const url = new URL('post-editor-sending-playwright.html?withSubmit=1', page.url()).href;
    const hostURL = new URL('submit-frame-host', page.url()).href;
    await page.route(hostURL, route => route.fulfill({
        contentType: 'text/html',
        body: `<iframe title="composer" src="${url}" style="width:320px;height:600px"></iframe>`,
    }));
    await page.goto(hostURL);
    const frame = page.frameLocator('iframe');
    const embeddedEditor = frame.locator('.tiptap-editor');
    await embeddedEditor.click();
    await page.keyboard.type('iframe submit');
    await expect(frame.locator('button.post-button')).toBeEnabled();
    await observeFocus(embeddedEditor);
    const releaseFrame = await beginLongPress(page, frame.locator('button.post-button'), browserName === 'chromium' && isMobile);
    await expect(frame.getByTestId('sending-state')).toHaveText('sending');
    await releaseFrame();
    await embeddedEditor.evaluate(() => (window as any).__postSubmitHarness.finish(true));
    await expect(embeddedEditor).toHaveText('');
    await expect(embeddedEditor).toBeFocused();
    expect(await embeddedEditor.evaluate(() => (window as any).__focusObservation.blurs)).toBe(0);
});

test.describe('Android composition submit', () => {
    const { defaultBrowserType: _browser, ...pixel } = devices['Pixel 7'];
    test.use(pixel);
    test('uses Chromium IME input through natural compositionend without missing the commit', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'CDP IME input is Chromium-only; WebKit uses the separate DOM event test');
        await page.goto('post-editor-sending-playwright.html?withSubmit=1');
        const editor = page.locator('.tiptap-editor');
        await editor.click();
        const cdp = await page.context().newCDPSession(page);
        await cdp.send('Input.imeSetComposition', { text: 'にほん', selectionStart: 3, selectionEnd: 3 });
        await expect(page.locator('button.post-button')).toBeEnabled();
        expect(await page.evaluate(() => (window as any).__currentEditor.storage.androidCompositionFix.isComposing)).toBe(true);
        await observeFocus(editor);
        const release = await beginLongPress(page, page.locator('button.post-button'), true);
        await expect(page.getByTestId('submit-pending')).toHaveText('pending');
        await release();
        await cdp.send('Input.insertText', { text: '日本' });
        await expect(page.getByTestId('sending-state')).toHaveText('sending');
        expect(await page.evaluate(() => (window as any).__postSubmitHarness.submissions.map((p: any) => p.content))).toEqual(['日本']);
        expect(await page.evaluate(() => (window as any).__currentEditor.storage.androidCompositionFix.keepAliveInterval)).toBeNull();
        await finishSubmission(page, true);
        await expect(editor).toHaveText('');
        await expect(editor).toBeFocused();
        expect(await page.evaluate(() => (window as any).__focusObservation.blurs)).toBe(0);
        await cdp.detach();
    });
});

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
            await expect(editor).toHaveAttribute('contenteditable', 'true');
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

        await editor.click();
        await page.getByTestId('toggle-sending').evaluate((button: HTMLButtonElement) => button.click());
        await expect(editor).toHaveAttribute('contenteditable', 'true');
        await expect(pickerHost).toBeVisible();

        const contentBeforePickerSelection = await editor.textContent();
        await page.getByAltText(':sending-safe:').click();
        await expect(editor).toHaveText(contentBeforePickerSelection ?? '');

        await page.getByTestId('complete-post').evaluate((button: HTMLButtonElement) => button.click());
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
