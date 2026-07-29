import { expect, test, type Page } from '@playwright/test';

type HarnessState = {
    ready: boolean;
    prefetchApplied: boolean;
    loadStarts: number;
    loadCompletions: number;
    fetchStarts: number;
    fetchCompletions: number;
    releaseLatestList(): void;
};

type HarnessWindow = Window & typeof globalThis & {
    __CUSTOM_EMOJI_PICKER_HARNESS__?: HarnessState;
    __CUSTOM_EMOJI_PICKER_RAF__?: {
        callbacks: Map<number, FrameRequestCallback>;
        nextId: number;
    };
    __CUSTOM_EMOJI_PICKER_SCROLL_CALLS__?: Array<{
        method: string;
        args: unknown[];
    }>;
};

test.describe('custom emoji picker initial relay refresh', () => {
    test('keeps a prefetched list visible while the first relay result arrives', async ({ page }) => {
        await page.goto('custom-emoji-picker-playwright.html');
        await page.waitForFunction(() =>
            Boolean((window as HarnessWindow).__CUSTOM_EMOJI_PICKER_HARNESS__?.ready),
        );
        await expect.poll(() => page.evaluate(() =>
            (window as HarnessWindow).__CUSTOM_EMOJI_PICKER_HARNESS__?.prefetchApplied,
        )).toBe(true);

        await expect(page.getByAltText(':cached-0:')).toBeVisible();

        const viewport = page.locator('.custom-emoji-scroll-viewport');
        await expect(viewport).toHaveCount(1);
        await viewport.evaluate((element) => {
            const scrollable = element as HTMLElement;
            scrollable.scrollTop = 120;
            scrollable.dispatchEvent(new Event('scroll'));
        });
        await page.evaluate(() => {
            const callbacks = new Map<number, FrameRequestCallback>();
            let nextId = 1;
            const harnessWindow = window as HarnessWindow;
            harnessWindow.__CUSTOM_EMOJI_PICKER_RAF__ = { callbacks, nextId };
            window.requestAnimationFrame = (callback) => {
                const id = harnessWindow.__CUSTOM_EMOJI_PICKER_RAF__!.nextId++;
                callbacks.set(id, callback);
                return id;
            };
            window.cancelAnimationFrame = (id) => callbacks.delete(id);
            harnessWindow.__CUSTOM_EMOJI_PICKER_SCROLL_CALLS__ = [];
            const calls = harnessWindow.__CUSTOM_EMOJI_PICKER_SCROLL_CALLS__;
            Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
                configurable: true,
                value: (...args: unknown[]) => {
                    calls.push({ method: 'scrollTo', args });
                },
            });
            Object.defineProperty(Element.prototype, 'scrollIntoView', {
                configurable: true,
                value: (...args: unknown[]) => {
                    calls.push({ method: 'scrollIntoView', args });
                },
            });
            harnessWindow.__CUSTOM_EMOJI_PICKER_HARNESS__!.releaseLatestList();
        });

        await expect(page.getByAltText(':fresh:')).toBeVisible();
        await expect(page.locator('.custom-emoji-loading')).toHaveCount(0);
        await expect.poll(() => page.evaluate(() =>
            (window as HarnessWindow).__CUSTOM_EMOJI_PICKER_SCROLL_CALLS__,
        )).toEqual([]);
        await expect.poll(() => viewport.evaluate((element) =>
            (element as HTMLElement).scrollTop,
        )).toBe(120);
        await expect(page.locator('.custom-emoji-scroll-viewport')).toHaveCount(1);
        await expect.poll(() => page.evaluate(() => {
            const harness = (window as HarnessWindow).__CUSTOM_EMOJI_PICKER_HARNESS__!;
            return {
                loadStarts: harness.loadStarts,
                loadCompletions: harness.loadCompletions,
                fetchStarts: harness.fetchStarts,
                fetchCompletions: harness.fetchCompletions,
            };
        }), { timeout: 15_000 }).toEqual({
            loadStarts: 1,
            loadCompletions: 1,
            fetchStarts: 1,
            fetchCompletions: 1,
        });
    });
});
