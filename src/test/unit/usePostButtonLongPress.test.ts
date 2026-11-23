import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';

import PostButtonLongPressHarness from './fixtures/PostButtonLongPressHarness.svelte';
import { POST_LONG_PRESS_DURATION_MS } from '../../lib/hooks/usePostButtonLongPress.svelte';

function pointer(type: string, pointerType = 'touch'): Event {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    return event;
}

describe('usePostButtonLongPress', () => {
    beforeEach(() => {
        vi.useFakeTimers({
            toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('タッチで必要時間押し続けると 1 回だけ完了し、続く click は投稿しない', async () => {
        const onComplete = vi.fn();
        render(PostButtonLongPressHarness, { props: { onComplete } });
        const button = screen.getByRole('button');

        button.dispatchEvent(pointer('pointerdown'));
        await tick();
        expect(button.dataset.ringVisible).toBe('true');

        await vi.advanceTimersByTimeAsync(POST_LONG_PRESS_DURATION_MS + 50);
        expect(onComplete).toHaveBeenCalledTimes(1);

        button.dispatchEvent(pointer('pointerup'));
        button.click();
        expect(onComplete).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(300);
        expect(button.dataset.ringVisible).toBe('false');
    });

    it('完了前に離すと 1 回だけ通知して巻き戻り、投稿しない', async () => {
        const onComplete = vi.fn();
        const onReleaseEarly = vi.fn();
        render(PostButtonLongPressHarness, { props: { onComplete, onReleaseEarly } });
        const button = screen.getByRole('button');

        button.dispatchEvent(pointer('pointerdown'));
        await vi.advanceTimersByTimeAsync(100);
        button.dispatchEvent(pointer('pointerup'));
        // タッチでは pointerup の後に pointerleave も届く
        button.dispatchEvent(pointer('pointerleave'));

        expect(onReleaseEarly).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(1000);
        expect(button.dataset.ringVisible).toBe('false');
        expect(Number(button.dataset.progress)).toBe(0);
        expect(onComplete).not.toHaveBeenCalled();
    });

    it('長押し中に破棄されたら投稿しない', async () => {
        const onComplete = vi.fn();
        const view = render(PostButtonLongPressHarness, { props: { onComplete } });
        const button = screen.getByRole('button');

        button.dispatchEvent(pointer('pointerdown'));
        await vi.advanceTimersByTimeAsync(100);
        view.unmount();
        await vi.advanceTimersByTimeAsync(1000);

        expect(onComplete).not.toHaveBeenCalled();
    });

    it('無効時やマウス操作では長押しを始めない', async () => {
        const onComplete = vi.fn();
        const view = render(PostButtonLongPressHarness, { props: { onComplete, disabled: true } });
        const button = screen.getByRole('button');

        button.dispatchEvent(pointer('pointerdown'));
        await vi.advanceTimersByTimeAsync(1000);
        expect(onComplete).not.toHaveBeenCalled();
        expect(button.dataset.ringVisible).toBe('false');

        await view.rerender({ onComplete, disabled: false });
        button.dispatchEvent(pointer('pointerdown', 'mouse'));
        await vi.advanceTimersByTimeAsync(1000);
        expect(button.dataset.ringVisible).toBe('false');
        // マウスでは通常の click で投稿する
        button.click();
        expect(onComplete).toHaveBeenCalledTimes(1);
    });
});
