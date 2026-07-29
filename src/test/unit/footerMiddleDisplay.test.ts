import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => key);
const hideImageSizeInfo = vi.hoisted(() => vi.fn());
const copyDevLogWithFallback = vi.hoisted(() => vi.fn());
const shouldShowDevLog = vi.hoisted(() => vi.fn(() => true));
const devLogStore = vi.hoisted(() => {
    let value: string[] = [];
    const listeners = new Set<(nextValue: string[]) => void>();

    return {
        subscribe(run: (nextValue: string[]) => void) {
            run(value);
            listeners.add(run);
            return () => {
                listeners.delete(run);
            };
        },
        set(nextValue: string[]) {
            value = nextValue;
            listeners.forEach((listener) => listener(value));
        },
        update(updater: (currentValue: string[]) => string[]) {
            value = updater(value);
            listeners.forEach((listener) => listener(value));
        },
    };
});

const footerDisplayState = {
    sharedMediaError: null as string | null,
    progressDisplay: null as any,
    imageSizeDisplay: {
        originalLine: 'PNG 1.0MB',
        resultLine: '→ JPG 500KB',
    },
    showingInfo: true,
    handleAbortAll: vi.fn(),
    hideImageSizeInfo,
};

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

vi.mock('../../lib/hooks/useFooterMiddleDisplay.svelte', () => ({
    useFooterMiddleDisplay: vi.fn(() => footerDisplayState),
}));

vi.mock('../../lib/debug', () => ({
    devLog: devLogStore,
    copyDevLogWithFallback,
    shouldShowDevLog,
}));

import FooterMiddleDisplay from '../../components/FooterMiddleDisplay.svelte';
import { devLog } from '../../lib/debug';

describe('FooterMiddleDisplay', () => {
    beforeEach(() => {
        hideImageSizeInfo.mockClear();
        copyDevLogWithFallback.mockReset();
        copyDevLogWithFallback.mockResolvedValue(undefined);
        devLog.set([]);
        shouldShowDevLog.mockReturnValue(true);
    });

    it('hides image size info when the footer center is clicked', async () => {
        render(FooterMiddleDisplay);

        const footerCenter = screen.getByRole('button');
        await fireEvent.click(footerCenter);

        expect(hideImageSizeInfo).toHaveBeenCalledOnce();
    });

    it('copies the dev log once when the button is clicked', async () => {
        devLog.set(['alpha', 'beta']);
        render(FooterMiddleDisplay);

        const button = screen.getByRole('button', { name: '開発者ログをコピー' });
        await fireEvent.click(button);

        expect(copyDevLogWithFallback).toHaveBeenCalledTimes(1);
        expect(copyDevLogWithFallback).toHaveBeenCalledWith(['beta', 'alpha']);
    });

    it('does not copy more than once when touchend is followed by click', async () => {
        devLog.set(['alpha', 'beta']);
        render(FooterMiddleDisplay);

        const button = screen.getByRole('button', { name: '開発者ログをコピー' });
        await fireEvent.touchEnd(button);
        await fireEvent.click(button);

        expect(copyDevLogWithFallback).toHaveBeenCalledTimes(1);
    });
});
