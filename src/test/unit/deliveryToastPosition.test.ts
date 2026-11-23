import { afterEach, describe, expect, it, vi } from 'vitest';
import { positionDeliveryToasts } from '../../lib/relay/deliveryToastPosition';
import type { AppRuntimeEnvironment } from '../../lib/appRuntimeEnvironment';

describe('positionDeliveryToasts', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        document.documentElement.removeAttribute('style');
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('フォーカス移動だけで下部バーが動いても、レイアウト変数の更新で置き直す', async () => {
        vi.stubGlobal('ResizeObserver', class {
            observe() {}
            disconnect() {}
        });
        const frames: FrameRequestCallback[] = [];
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            frames.push(callback);
            return frames.length;
        });
        vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
        const flushFrames = () => frames.splice(0).forEach((callback) => callback(0));
        const flushMutations = () => new Promise<void>((resolve) => queueMicrotask(resolve));

        const bar = document.createElement('div');
        bar.className = 'footer-button-bar';
        const toast = document.createElement('div');
        toast.append(document.createElement('button'));
        document.body.append(bar, toast);

        let barTop = 684;
        vi.spyOn(bar, 'getBoundingClientRect').mockImplementation(() =>
            ({ top: barTop, bottom: barTop + 50, left: 0, right: 400, width: 400, height: 50 }) as DOMRect);

        const runtime = {
            window,
            domRoot: document,
            styleTarget: document.documentElement,
            overlayTarget: document.body,
            layoutTarget: document.body,
            layoutMode: 'viewport',
        } as unknown as AppRuntimeEnvironment;
        const place = vi.fn();
        const dispose = positionDeliveryToasts(toast, runtime, place);
        try {
            flushFrames();
            const initialTop = Number(/top:([\d.]+)px/.exec(place.mock.lastCall![0].style)![1]);

            // キーボード表示中にエディタへフォーカスが戻り、バーがキーボード上へ移る
            barTop = 450;
            document.documentElement.style.setProperty('--keyboard-button-bar-bottom', '300px');
            await flushMutations();
            flushFrames();

            const movedTop = Number(/top:([\d.]+)px/.exec(place.mock.lastCall![0].style)![1]);
            expect(movedTop).toBeLessThan(initialTop);
            expect(movedTop + 32).toBeLessThanOrEqual(barTop - 12);
        } finally {
            dispose();
        }
    });
});
