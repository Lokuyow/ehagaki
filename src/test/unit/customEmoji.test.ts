import { describe, expect, it } from 'vitest';
import {
    clampCustomEmojiPickerHeight,
    getCustomEmojiCacheBatches,
    getCustomEmojiListCacheKey,
    getKind10030EmojiSetAddresses,
    mergeCustomEmojiItems,
    parseEmojiSetAddress,
    parseEmojiTags,
    readCachedCustomEmojiItems,
    writeCachedCustomEmojiItems,
} from '../../lib/customEmoji';

describe('customEmoji', () => {
    it('parses valid emoji tags and ignores invalid entries', () => {
        expect(
            parseEmojiTags(
                [
                    ['emoji', ':blobcat:', 'https://example.com/blobcat.webp'],
                    ['emoji', 'bad', 'notaurl'],
                    ['p', 'not-emoji'],
                ],
                '30030:pubkey:set',
            ),
        ).toEqual([
            {
                shortcode: 'blobcat',
                src: 'https://example.com/blobcat.webp',
                setAddress: '30030:pubkey:set',
            },
        ]);
    });

    it('parses kind 30030 addresses from kind 10030 tags', () => {
        expect(parseEmojiSetAddress('30030:pubkey:funny')).toEqual({
            kind: 30030,
            pubkey: 'pubkey',
            identifier: 'funny',
            address: '30030:pubkey:funny',
        });

        expect(
            getKind10030EmojiSetAddresses({
                kind: 10030,
                tags: [
                    ['a', '30030:pubkey:funny'],
                    ['a', '30030:pubkey:funny'],
                    ['a', '1:pubkey:wrong'],
                ],
            }),
        ).toEqual(['30030:pubkey:funny']);
    });

    it('keeps first shortcode when merging emoji candidates', () => {
        expect(
            mergeCustomEmojiItems([
                [{ shortcode: 'blobcat', src: 'https://example.com/a.webp' }],
                [{ shortcode: 'blobcat', src: 'https://example.com/b.webp' }],
                [{ shortcode: 'party', src: 'https://example.com/party.webp' }],
            ]),
        ).toEqual([
            { shortcode: 'blobcat', src: 'https://example.com/a.webp' },
            { shortcode: 'party', src: 'https://example.com/party.webp' },
        ]);
    });

    it('clamps picker height to the supported viewport range', () => {
        expect(clampCustomEmojiPickerHeight(20, 1000)).toBe(42);
        expect(clampCustomEmojiPickerHeight(900, 1000)).toBe(600);
        expect(clampCustomEmojiPickerHeight(240, 1000)).toBe(240);
        expect(clampCustomEmojiPickerHeight(900, 1000, 320)).toBe(320);
        expect(clampCustomEmojiPickerHeight(900, 1000, 720)).toBe(720);
    });

    it('batches custom emoji cache urls and ignores duplicates or invalid urls', () => {
        expect(
            getCustomEmojiCacheBatches(
                [
                    'https://example.com/a.webp',
                    'notaurl',
                    'https://example.com/a.webp',
                    'https://example.com/b.webp',
                    'https://example.com/c.webp',
                ],
                3,
                2,
            ),
        ).toEqual([
            ['https://example.com/a.webp', 'https://example.com/b.webp'],
            ['https://example.com/c.webp'],
        ]);
    });

    it('restores cached custom emoji items from local storage metadata', () => {
        const values = new Map<string, string>();
        const storage = {
            getItem: (key: string) => values.get(key) ?? null,
            setItem: (key: string, value: string) => values.set(key, value),
        };

        writeCachedCustomEmojiItems(storage, 'pubkey', [
            { shortcode: ':blobcat:', src: 'https://example.com/blobcat.webp' },
            { shortcode: 'blobcat', src: 'https://example.com/other.webp' },
            { shortcode: 'bad', src: 'notaurl' },
            { shortcode: 'party', src: 'https://example.com/party.webp', setAddress: '30030:pubkey:set' },
        ]);

        expect(values.has(getCustomEmojiListCacheKey('pubkey'))).toBe(true);
        expect(readCachedCustomEmojiItems(storage, 'pubkey')).toEqual([
            { shortcode: 'blobcat', src: 'https://example.com/blobcat.webp', setAddress: null },
            { shortcode: 'party', src: 'https://example.com/party.webp', setAddress: '30030:pubkey:set' },
        ]);
    });

    it('ignores broken cached custom emoji metadata', () => {
        const storage = {
            getItem: () => '{"version":1,"items":[{"shortcode":"bad","src":"notaurl"}',
        };

        expect(readCachedCustomEmojiItems(storage, 'pubkey')).toEqual([]);
        expect(readCachedCustomEmojiItems({ getItem: () => null }, 'pubkey')).toEqual([]);
    });
});
