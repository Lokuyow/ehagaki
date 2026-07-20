import { nip19 } from 'nostr-tools';
import type { ChannelContextState, ReplyQuoteComposerState, ReplyQuoteState } from './types';
import type { EmbedChannelContextPayload, EmbedComposerContextUpdatedPayload } from './embedProtocol';
import type { ChannelContextProvenance } from './channelContextRuntime';

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
    channelProvenance: ChannelContextProvenance | null = null,
    now = Date.now(),
): EmbedComposerContextUpdatedPayload {
    return {
        timestamp: now,
        reply: state.reply
            ? encodeComposerContextReference(state.reply)
            : null,
        quotes: state.quotes.map((quote) => encodeComposerContextReference(quote)),
        channel: channelContext
            ? buildChannelContextPayload(channelContext, channelProvenance)
            : null,
    };
}

function buildChannelContextPayload(
    channelContext: ChannelContextState,
    provenance: ChannelContextProvenance | null,
): EmbedChannelContextPayload {
    const metadataOverrides = provenance?.metadataOverrides ?? {};
    const hasOverride = (field: 'name' | 'about' | 'picture') =>
        Object.prototype.hasOwnProperty.call(metadataOverrides, field);
    return {
        reference: encodeComposerContextReference({
            eventId: channelContext.eventId,
            relayHints: channelContext.relayHints,
            authorPubkey: null,
        }),
        ...(channelContext.channelRelays?.length
            ? { relays: [...channelContext.channelRelays] }
            : {}),
        ...(hasOverride('name')
            ? { name: channelContext.name }
            : channelContext.name ? { name: channelContext.name } : {}),
        ...(hasOverride('about')
            ? { about: channelContext.about }
            : channelContext.about ? { about: channelContext.about } : {}),
        ...(hasOverride('picture')
            ? { picture: channelContext.picture }
            : channelContext.picture ? { picture: channelContext.picture } : {}),
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
