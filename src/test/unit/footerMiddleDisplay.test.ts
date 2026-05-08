import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => key);
const hideImageSizeInfo = vi.hoisted(() => vi.fn());

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

import FooterMiddleDisplay from '../../components/FooterMiddleDisplay.svelte';

describe('FooterMiddleDisplay', () => {
    beforeEach(() => {
        hideImageSizeInfo.mockClear();
    });

    it('hides image size info when the footer center is clicked', async () => {
        render(FooterMiddleDisplay);

        const footerCenter = screen.getByRole('button');
        await fireEvent.click(footerCenter);

        expect(hideImageSizeInfo).toHaveBeenCalledOnce();
    });
});
