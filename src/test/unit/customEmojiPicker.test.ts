import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const pickerMocks = vi.hoisted(() => ({
    cacheCustomEmojiImages: vi.fn(),
    load: vi.fn().mockResolvedValue(undefined),
    items: [
        {
            shortcode: 'inukoukaijidai',
            shortcodeLower: 'inukoukaijidai',
            src: 'https://images.kinoko.pw/drive/b18ca0e4-6c64-48ab-b766-e83070f119ba.webp',
            identityKey: 'inukoukaijidai\u0000https://images.kinoko.pw/drive/b18ca0e4-6c64-48ab-b766-e83070f119ba.webp',
            setAddress: null,
            sortIndex: 0,
            sourceType: 'kind10030',
            sourceAddress: null,
        },
    ],
}));

vi.mock('../../lib/customEmoji', async (importOriginal) => ({
    ...await importOriginal<typeof import('../../lib/customEmoji')>(),
    cacheCustomEmojiImages: pickerMocks.cacheCustomEmojiImages,
}));

vi.mock('../../stores/customEmojiStore.svelte', () => ({
    customEmojiStore: {
        get items() {
            return pickerMocks.items;
        },
        get loading() {
            return false;
        },
        load: pickerMocks.load,
    },
}));

vi.mock('svelte-i18n', () => ({
    _: readable((key: string) => key),
}));

import CustomEmojiPicker from '../../components/CustomEmojiPicker.svelte';

const originalScrollTo = HTMLElement.prototype.scrollTo;

beforeEach(() => {
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
            },
        });

        const image = await screen.findByAltText(':inukoukaijidai:');
        await fireEvent.load(image);
        await fireEvent.load(image);

        expect(pickerMocks.cacheCustomEmojiImages).toHaveBeenCalledTimes(1);
        expect(pickerMocks.cacheCustomEmojiImages).toHaveBeenCalledWith([
            'https://images.kinoko.pw/drive/b18ca0e4-6c64-48ab-b766-e83070f119ba.webp',
        ]);
    });
});
