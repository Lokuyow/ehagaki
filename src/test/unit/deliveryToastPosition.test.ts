import { afterEach, describe, expect, it, vi } from 'vitest';
import { positionDeliveryToasts } from '../../lib/relay/deliveryToastPosition';
import type { AppRuntimeEnvironment } from '../../lib/appRuntimeEnvironment';

describe('positionDeliveryToasts', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('下部バーのスライド完了時に置き直し、無関係な transition では置き直さない', () => {
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

        const bar = document.createElement('div');
        bar.className = 'footer-button-bar';
        const other = document.createElement('div');
        const toast = document.createElement('div');
        document.body.append(bar, other, toast);

        let barTop = 600;
        vi.spyOn(bar, 'getBoundingClientRect').mockImplementation(() =>
            ({ top: barTop, bottom: barTop + 50, left: 0, right: 400, width: 400, height: 50 }) as DOMRect);

        const runtime = {
            window,
            domRoot: document,
            overlayTarget: document.body,
            layoutTarget: document.body,
            layoutMode: 'viewport',
        } as unknown as AppRuntimeEnvironment;
        const place = vi.fn();
        const dispose = positionDeliveryToasts(toast, runtime, place);
        try {
            flushFrames();
            const calls = place.mock.calls.length;

            other.dispatchEvent(new Event('transitionend', { bubbles: true }));
            flushFrames();
            expect(place).toHaveBeenCalledTimes(calls);

            barTop = 300;
            bar.dispatchEvent(new Event('transitionend', { bubbles: true }));
            flushFrames();
            expect(place).toHaveBeenCalledTimes(calls + 1);
        } finally {
            dispose();
        }
    });
});
