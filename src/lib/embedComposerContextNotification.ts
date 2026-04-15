import { nip19 } from 'nostr-tools';
import type { ReplyQuoteComposerState, ReplyQuoteState } from './types';
import type { EmbedComposerContextUpdatedPayload } from './embedProtocol';

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
    now = Date.now(),
): EmbedComposerContextUpdatedPayload {
    return {
        timestamp: now,
        reply: state.reply
            ? encodeComposerContextReference(state.reply)
            : null,
        quotes: state.quotes.map((quote) => encodeComposerContextReference(quote)),
    };
}

export function buildComposerContextSignature(
    payload: Pick<EmbedComposerContextUpdatedPayload, 'reply' | 'quotes'>,
): string {
    return JSON.stringify({
        reply: payload.reply,
        quotes: payload.quotes,
    });
}