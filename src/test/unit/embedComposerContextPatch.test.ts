import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    buildPatchedChannelContext,
    buildPatchedReplyQuoteQuery,
} from '../../lib/embedComposerContextPatch';
import { encodeComposerContextReference } from '../../lib/embedComposerContextNotification';
import type { ReplyQuoteComposerState, ReplyQuoteState } from '../../lib/types';

function createReference(
    mode: 'reply' | 'quote',
    eventId: string,
    relayHints: string[] = [],
    authorPubkey: string | null = null,
): ReplyQuoteState {
    return {
        mode,
        eventId,
        relayHints,
        authorPubkey,
        quoteNotificationEnabled: false,
        authorDisplayName: null,
        authorPicture: null,
        referencedEvent: null,
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        loading: false,
        error: null,
    };
}

const emptyState: ReplyQuoteComposerState = {
    reply: null,
    quotes: [],
};

describe('embedComposerContextPatch', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('channel が未指定の場合は undefined、null の場合は null を返す', () => {
        expect(buildPatchedChannelContext({})).toBeUndefined();
        expect(buildPatchedChannelContext({ channel: null })).toBeNull();
    });

    it('channel payload を ChannelContextQueryTarget に変換する', () => {
        const eventId = '11'.repeat(32);
        const authorPubkey = '22'.repeat(32);
        const reference = encodeComposerContextReference({
            eventId,
            relayHints: ['wss://relay.example.com'],
            authorPubkey,
        });

        expect(buildPatchedChannelContext({
            channel: {
                reference,
                relays: ['wss://write.example.com'],
                name: ' General ',
                about: ' Public chat ',
                picture: ' https://example.com/channel.png ',
            },
        })).toEqual({
            eventId,
            relayHints: ['wss://relay.example.com/'],
            channelRelays: ['wss://write.example.com'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        });
    });

    it('無効な channel payload は invalid_composer_context を投げる', () => {
        vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => buildPatchedChannelContext({
            channel: {
                reference: 'invalid',
            },
        })).toThrow('invalid_composer_context');
    });

    it('reply だけを差し替え、既存 quotes は維持する', () => {
        const nextReplyId = '33'.repeat(32);
        const existingQuoteId = '44'.repeat(32);
        const currentState: ReplyQuoteComposerState = {
            reply: createReference('reply', '11'.repeat(32)),
            quotes: [
                createReference('quote', existingQuoteId, ['wss://quote.example.com'], '55'.repeat(32)),
            ],
        };
        const reply = encodeComposerContextReference({
            eventId: nextReplyId,
            relayHints: [],
            authorPubkey: null,
        });

        expect(buildPatchedReplyQuoteQuery({ reply }, currentState)).toEqual({
            reply: {
                eventId: nextReplyId,
                relayHints: [],
                authorPubkey: null,
            },
            quotes: [
                {
                    eventId: existingQuoteId,
                    relayHints: ['wss://quote.example.com'],
                    authorPubkey: '55'.repeat(32),
                },
            ],
        });
    });

    it('reply と quotes を両方 null にすると null を返す', () => {
        const currentState: ReplyQuoteComposerState = {
            reply: createReference('reply', '11'.repeat(32)),
            quotes: [createReference('quote', '22'.repeat(32))],
        };

        expect(buildPatchedReplyQuoteQuery({
            reply: null,
            quotes: null,
        }, currentState)).toBeNull();
    });

    it('reply/quotes が未指定の場合は undefined を返す', () => {
        expect(buildPatchedReplyQuoteQuery({}, emptyState)).toBeUndefined();
    });

    it('無効な reply payload は invalid_composer_context を投げる', () => {
        vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => buildPatchedReplyQuoteQuery({
            reply: 'invalid',
        }, emptyState)).toThrow('invalid_composer_context');
    });
});
