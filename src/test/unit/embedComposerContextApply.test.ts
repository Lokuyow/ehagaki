import { describe, expect, it, vi } from 'vitest';

import {
    applyEmbedComposerContent,
    buildEmbedComposerContextPatch,
} from '../../lib/embedComposerContextApply';
import { encodeComposerContextReference } from '../../lib/embedComposerContextNotification';
import type { ReplyQuoteComposerState } from '../../lib/types';

describe('embedComposerContextApply', () => {
    describe('applyEmbedComposerContent', () => {
        it('content が undefined の場合は何もしない', () => {
            const handlers = {
                clearUrlQueryContentStore: vi.fn(),
                updateUrlQueryContentStore: vi.fn(),
                resetPostContent: vi.fn(),
                insertTextContent: vi.fn(),
            };

            applyEmbedComposerContent(undefined, handlers);

            expect(handlers.clearUrlQueryContentStore).not.toHaveBeenCalled();
            expect(handlers.updateUrlQueryContentStore).not.toHaveBeenCalled();
            expect(handlers.resetPostContent).not.toHaveBeenCalled();
            expect(handlers.insertTextContent).not.toHaveBeenCalled();
        });

        it('content が null の場合は clear と reset を呼ぶ', () => {
            const handlers = {
                clearUrlQueryContentStore: vi.fn(),
                updateUrlQueryContentStore: vi.fn(),
                resetPostContent: vi.fn(),
            };

            applyEmbedComposerContent(null, handlers);

            expect(handlers.clearUrlQueryContentStore).toHaveBeenCalledTimes(1);
            expect(handlers.resetPostContent).toHaveBeenCalledTimes(1);
            expect(handlers.updateUrlQueryContentStore).not.toHaveBeenCalled();
        });

        it('insertTextContent がある場合は editor に挿入して clear する', () => {
            const handlers = {
                clearUrlQueryContentStore: vi.fn(),
                updateUrlQueryContentStore: vi.fn(),
                insertTextContent: vi.fn(),
            };

            applyEmbedComposerContent('hello', handlers);

            expect(handlers.insertTextContent).toHaveBeenCalledWith('hello');
            expect(handlers.clearUrlQueryContentStore).toHaveBeenCalledTimes(1);
            expect(handlers.updateUrlQueryContentStore).not.toHaveBeenCalled();
        });

        it('insertTextContent がない場合は url query store を更新する', () => {
            const handlers = {
                clearUrlQueryContentStore: vi.fn(),
                updateUrlQueryContentStore: vi.fn(),
            };

            applyEmbedComposerContent('hello', handlers);

            expect(handlers.updateUrlQueryContentStore).toHaveBeenCalledWith('hello');
            expect(handlers.clearUrlQueryContentStore).not.toHaveBeenCalled();
        });
    });

    describe('buildEmbedComposerContextPatch', () => {
        it('channel が null の場合は channel patch に null を返す', () => {
            const patch = buildEmbedComposerContextPatch(
                { channel: null },
                { reply: null, quotes: [] },
            );

            expect(patch.channelContext).toBeNull();
            expect(patch.replyQuoteQuery).toBeUndefined();
        });

        it('channel payload がある場合は normalized channel patch を返す', () => {
            const channelReference = encodeComposerContextReference({
                eventId: '11'.repeat(32),
                relayHints: ['wss://relay.example.com'],
                authorPubkey: '22'.repeat(32),
            });

            const patch = buildEmbedComposerContextPatch({
                channel: {
                    reference: channelReference,
                    relays: ['wss://write.example.com'],
                    name: ' General ',
                },
            }, {
                reply: null,
                quotes: [],
            });

            expect(patch.channelContext).toEqual({
                eventId: '11'.repeat(32),
                relayHints: ['wss://relay.example.com/'],
                channelRelays: ['wss://write.example.com'],
                name: 'General',
                about: null,
                picture: null,
            });
        });

        it('reply/quotes を clear する payload の場合は reply patch に null を返す', () => {
            const currentReplyQuoteState: ReplyQuoteComposerState = {
                reply: {
                    mode: 'reply',
                    eventId: '11'.repeat(32),
                    relayHints: [],
                    authorPubkey: null,
                    quoteNotificationEnabled: false,
                    authorDisplayName: null,
                    authorPicture: null,
                    referencedEvent: null,
                    rootEventId: null,
                    rootRelayHint: null,
                    rootPubkey: null,
                    loading: false,
                    error: null,
                },
                quotes: [],
            };

            const patch = buildEmbedComposerContextPatch({
                reply: null,
                quotes: [],
            }, currentReplyQuoteState);

            expect(patch.replyQuoteQuery).toBeNull();
        });

        it('reply payload がある場合は normalized reply patch を返す', () => {
            const replyReference = encodeComposerContextReference({
                eventId: '33'.repeat(32),
                relayHints: ['wss://reply-relay.example.com'],
                authorPubkey: null,
            });

            const patch = buildEmbedComposerContextPatch({
                reply: replyReference,
                quotes: [],
            }, {
                reply: null,
                quotes: [],
            });

            expect(patch.replyQuoteQuery).toEqual({
                reply: {
                    eventId: '33'.repeat(32),
                    relayHints: ['wss://reply-relay.example.com/'],
                    authorPubkey: null,
                },
                quotes: [],
            });
        });

        it('content only の payload では channel/reply patch を返さない', () => {
            const patch = buildEmbedComposerContextPatch({
                content: 'content only update',
            }, {
                reply: null,
                quotes: [],
            });

            expect(patch.channelContext).toBeUndefined();
            expect(patch.replyQuoteQuery).toBeUndefined();
        });
    });
});
