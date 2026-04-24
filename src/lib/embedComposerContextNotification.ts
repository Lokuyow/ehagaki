import { nip19 } from 'nostr-tools';
import type { ChannelContextState, ReplyQuoteComposerState, ReplyQuoteState } from './types';
import type { EmbedChannelContextPayload, EmbedComposerContextUpdatedPayload } from './embedProtocol';

export function encodeComposerContextReference(
    reference: Pick<ReplyQuoteState, 'eventId' | 'relayHints' | 'authorPubkey'>,
): string {
    if (reference.relayHints.length > 0 || reference.authorPubkey) {
        return nip19.neventEncode({
            id: reference.eventId,
            relays: reference.relayHints,
            ...(reference.authorPubkey ? { author: reference.authorPubkey } : {}),
        });
    }

    return nip19.noteEncode(reference.eventId);
}

export function buildComposerContextUpdatedPayload(
    state: ReplyQuoteComposerState,
    channelContext: ChannelContextState | null,
    now = Date.now(),
): EmbedComposerContextUpdatedPayload {
    return {
        timestamp: now,
        reply: state.reply
            ? encodeComposerContextReference(state.reply)
            : null,
        quotes: state.quotes.map((quote) => encodeComposerContextReference(quote)),
        channel: channelContext
            ? buildChannelContextPayload(channelContext)
            : null,
    };
}

function buildChannelContextPayload(
    channelContext: ChannelContextState,
): EmbedChannelContextPayload {
    return {
        reference: encodeComposerContextReference({
            eventId: channelContext.eventId,
            relayHints: channelContext.relayHints,
            authorPubkey: null,
        }),
        ...(channelContext.name ? { name: channelContext.name } : {}),
        ...(channelContext.about ? { about: channelContext.about } : {}),
        ...(channelContext.picture ? { picture: channelContext.picture } : {}),
    };
}

export function buildComposerContextSignature(
    payload: Pick<EmbedComposerContextUpdatedPayload, 'reply' | 'quotes' | 'channel'>,
): string {
    return JSON.stringify({
        reply: payload.reply,
        quotes: payload.quotes,
        channel: payload.channel ?? null,
    });
}