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
});
