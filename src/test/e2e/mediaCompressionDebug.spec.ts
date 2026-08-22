import { expect, test } from '@playwright/test';

test.describe('media compression debug panel', () => {
    test('is query-gated and supports expand, Copy, Clear, and narrow viewports', async ({ page }) => {
        await page.goto('media-compression-debug-playwright.html');
        await expect(page.locator('.media-debug-panel')).toHaveCount(0);

        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto('media-compression-debug-playwright.html?media-debug=1');
        const panel = page.locator('.media-debug-panel');
        const toggle = page.getByRole('button', { name: /Media Compression Debug/ });
        await expect(panel).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(panel.locator('pre')).toHaveCount(0);

        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(panel.locator('pre')).toContainText('Conversion #1');
        await expect(panel.locator('pre')).toContainText('audio path: native-aac');

        const geometry = await panel.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return {
                right: rect.right,
                bottom: rect.bottom,
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                documentWidth: document.documentElement.scrollWidth,
            };
        });
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);
        expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 0.5);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 0.5);

        await page.getByRole('button', { name: 'Copy' }).click();
        await expect(page.getByRole('status')).toHaveText(/Copied|Copy failed|Clipboard unavailable/);

        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(panel.locator('pre')).toContainText('No conversions recorded.');
        await expect(panel.locator('pre')).toContainText('Reload the page before Conversion #1');
    });
});
