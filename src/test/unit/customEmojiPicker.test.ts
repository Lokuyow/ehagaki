import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const pickerMocks = vi.hoisted(() => ({
    cacheCustomEmojiImages: vi.fn(),
    fetchCustomEmojiList: vi.fn(),
    readCachedCustomEmojiItems: vi.fn(),
    writeCachedCustomEmojiItems: vi.fn(),
}));

vi.mock('../../lib/customEmoji', async (importOriginal) => ({
    ...await importOriginal<typeof import('../../lib/customEmoji')>(),
    cacheCustomEmojiImages: pickerMocks.cacheCustomEmojiImages,
    fetchCustomEmojiList: pickerMocks.fetchCustomEmojiList,
    readCachedCustomEmojiItems: pickerMocks.readCachedCustomEmojiItems,
    writeCachedCustomEmojiItems: pickerMocks.writeCachedCustomEmojiItems,
}));

vi.mock('svelte-i18n', () => ({
    _: readable((key: string) => key),
}));

import CustomEmojiPicker from '../../components/CustomEmojiPicker.svelte';
import { customEmojiStore } from '../../stores/customEmojiStore.svelte';

const cachedEmoji = {
    shortcode: 'inukoukaijidai',
    shortcodeLower: 'inukoukaijidai',
    src: 'https://images.kinoko.pw/drive/b18ca0e4-6c64-48ab-b766-e83070f119ba.webp',
    identityKey: 'inukoukaijidai\u0000https://images.kinoko.pw/drive/b18ca0e4-6c64-48ab-b766-e83070f119ba.webp',
    setAddress: null,
    sortIndex: 0,
    sourceType: 'kind10030',
    sourceAddress: null,
};

const freshEmoji = (shortcode: string) => ({
    ...cachedEmoji,
    shortcode,
    shortcodeLower: shortcode,
    src: `https://example.com/${shortcode}.webp`,
    identityKey: `${shortcode}\u0000https://example.com/${shortcode}.webp`,
});

const originalScrollTo = HTMLElement.prototype.scrollTo;

beforeEach(() => {
    customEmojiStore.reset();
    pickerMocks.readCachedCustomEmojiItems.mockResolvedValue([cachedEmoji]);
    pickerMocks.fetchCustomEmojiList.mockResolvedValue([cachedEmoji]);
    pickerMocks.writeCachedCustomEmojiItems.mockResolvedValue(undefined);
    vi.stubGlobal('ResizeObserver', class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
        configurable: true,
        value: vi.fn(),
    });
});

afterEach(() => {
    if (originalScrollTo) {
        Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
            configurable: true,
            value: originalScrollTo,
        });
    } else {
        Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
    }
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

describe('CustomEmojiPicker image cache', () => {
    it('requests on-demand caching after an emoji image is displayed and deduplicates repeated load events', async () => {
        render(CustomEmojiPicker, {
            props: {
                open: true,
                rxNostr: {} as never,
                pubkey: 'pubkey',
            },
        });

        const image = await screen.findByAltText(':inukoukaijidai:');
        pickerMocks.cacheCustomEmojiImages.mockClear();
        await fireEvent.load(image);
        await fireEvent.load(image);

        expect(pickerMocks.cacheCustomEmojiImages).toHaveBeenCalledTimes(1);
        expect(pickerMocks.cacheCustomEmojiImages).toHaveBeenCalledWith([
            'https://images.kinoko.pw/drive/b18ca0e4-6c64-48ab-b766-e83070f119ba.webp',
        ]);
    });

    it('does not reset the viewport when the loaded emoji list changes', async () => {
        let resolveFetch!: (items: Array<typeof cachedEmoji>) => void;
        pickerMocks.fetchCustomEmojiList.mockReturnValue(
            new Promise((resolve) => {
                resolveFetch = resolve;
            }),
        );

        render(CustomEmojiPicker, {
            props: {
                open: true,
                rxNostr: {} as never,
                pubkey: 'pubkey',
            },
        });

        await screen.findByAltText(':inukoukaijidai:');
        const scrollViewport = document.querySelector<HTMLElement>(
            '.custom-emoji-scroll-viewport',
        )!;
        scrollViewport.scrollTop = 120;
        await fireEvent.scroll(scrollViewport);
        (HTMLElement.prototype.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        resolveFetch([cachedEmoji, freshEmoji('fresh')]);
        await vi.waitFor(() => {
            expect(screen.getByAltText(':fresh:')).toBeTruthy();
        });

        expect(scrollViewport.scrollTop).toBe(120);
        expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalledWith({ top: 0 });
    });

    it('resets the viewport when search changes and when the picker reopens', async () => {
        const { rerender } = render(CustomEmojiPicker, {
            props: {
                open: true,
                rxNostr: {} as never,
                pubkey: 'pubkey',
            },
        });

        const searchInput = await screen.findByPlaceholderText('customEmoji.search_placeholder');
        const viewport = document.querySelector<HTMLElement>('.custom-emoji-scroll-viewport')!;
        viewport.scrollTop = 120;
        await fireEvent.scroll(viewport);
        (HTMLElement.prototype.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        await fireEvent.input(searchInput, { target: { value: 'fresh' } });
        await vi.waitFor(() => {
            expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledWith({ top: 0 });
        });

        (HTMLElement.prototype.scrollTo as ReturnType<typeof vi.fn>).mockClear();
        await fireEvent.input(searchInput, { target: { value: '' } });
        await fireEvent.scroll(viewport);
        viewport.scrollTop = 120;
        await rerender({ open: false, rxNostr: {} as never, pubkey: 'pubkey' });
        (HTMLElement.prototype.scrollTo as ReturnType<typeof vi.fn>).mockClear();
        await rerender({ open: true, rxNostr: {} as never, pubkey: 'pubkey' });

        await vi.waitFor(() => {
            expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledWith({ top: 0 });
        });
    });
});
