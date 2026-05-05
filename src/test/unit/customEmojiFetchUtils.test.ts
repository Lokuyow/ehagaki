import { describe, expect, it } from 'vitest';

import { buildCustomEmojiListFromFetchedEvents } from '../../lib/customEmojiFetchUtils';
import {
    getKind10030EmojiSetAddresses,
    mergeCustomEmojiItems,
    parseEmojiSetAddress,
    parseEmojiTags,
} from '../../lib/customEmoji';

describe('customEmojiFetchUtils', () => {
    it('kind 10030 direct items と kind 30030 set items を address 順で結合する', () => {
        const result = buildCustomEmojiListFromFetchedEvents({
            listEvent: {
                kind: 10030,
                tags: [
                    ['emoji', 'blobcat', 'https://example.com/blobcat.webp'],
                    ['a', '30030:pubkey:funny'],
                    ['a', '30030:pubkey:party'],
                ],
            },
            setEvents: [
                {
                    kind: 30030,
                    pubkey: 'pubkey',
                    created_at: 20,
                    tags: [
                        ['d', 'funny'],
                        ['emoji', 'catjam', 'https://example.com/catjam.webp'],
                    ],
                },
                {
                    kind: 30030,
                    pubkey: 'pubkey',
                    created_at: 30,
                    tags: [
                        ['d', 'party'],
                        ['emoji', 'party', 'https://example.com/party.webp'],
                    ],
                },
            ],
            parseEmojiTags,
            getKind10030EmojiSetAddresses,
            parseEmojiSetAddress,
            mergeCustomEmojiItems,
        });

        expect(result.map(({ shortcode, sortIndex, setAddress }) => ({ shortcode, sortIndex, setAddress }))).toEqual([
            { shortcode: 'blobcat', sortIndex: 0, setAddress: null },
            { shortcode: 'catjam', sortIndex: 1, setAddress: '30030:pubkey:funny' },
            { shortcode: 'party', sortIndex: 2, setAddress: '30030:pubkey:party' },
        ]);
    });

    it('同じ set address では最新 created_at の event を採用する', () => {
        const result = buildCustomEmojiListFromFetchedEvents({
            listEvent: {
                kind: 10030,
                tags: [
                    ['a', '30030:pubkey:funny'],
                ],
            },
            setEvents: [
                {
                    kind: 30030,
                    pubkey: 'pubkey',
                    created_at: 10,
                    tags: [
                        ['d', 'funny'],
                        ['emoji', 'oldcat', 'https://example.com/oldcat.webp'],
                    ],
                },
                {
                    kind: 30030,
                    pubkey: 'pubkey',
                    created_at: 20,
                    tags: [
                        ['d', 'funny'],
                        ['emoji', 'newcat', 'https://example.com/newcat.webp'],
                    ],
                },
            ],
            parseEmojiTags,
            getKind10030EmojiSetAddresses,
            parseEmojiSetAddress,
            mergeCustomEmojiItems,
        });

        expect(result.map(({ shortcode, src }) => ({ shortcode, src }))).toEqual([
            { shortcode: 'newcat', src: 'https://example.com/newcat.webp' },
        ]);
    });
});