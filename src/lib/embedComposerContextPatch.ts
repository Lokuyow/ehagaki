import type { EmbedComposerSetContextPayload } from './embedProtocol';
import type {
    ChannelContextQueryTarget,
    ReplyQuoteComposerState,
    ReplyQuoteQueryResult,
    ReplyQuoteState,
} from './types';
import {
    getChannelFromEmbedPayload,
    getReplyQuoteFromEmbedPayload,
} from './urlQueryHandler';

function createReplyQuoteQueryTarget(reference: ReplyQuoteState) {
    return {
        eventId: reference.eventId,
        relayHints: [...reference.relayHints],
        authorPubkey: reference.authorPubkey,
    };
}

export function buildPatchedChannelContext(
    payload: EmbedComposerSetContextPayload,
): ChannelContextQueryTarget | null | undefined {
    if (payload.channel === undefined) {
        return undefined;
    }

    if (payload.channel === null) {
        return null;
    }

    const decoded = getChannelFromEmbedPayload(payload);

    if (!decoded) {
        throw new Error('invalid_composer_context');
    }

    return decoded;
}

function getCurrentReplyQuoteQuery(
    current: ReplyQuoteComposerState,
): ReplyQuoteQueryResult | null {
    if (!current.reply && current.quotes.length === 0) {
        return null;
    }

    return {
        reply: current.reply ? createReplyQuoteQueryTarget(current.reply) : null,
        quotes: current.quotes.map((quote) => createReplyQuoteQueryTarget(quote)),
    };
}

export function buildPatchedReplyQuoteQuery(
    payload: EmbedComposerSetContextPayload,
    currentState: ReplyQuoteComposerState,
): ReplyQuoteQueryResult | null | undefined {
    const touchesReply = payload.reply !== undefined;
    const touchesQuotes = payload.quotes !== undefined;

    if (!touchesReply && !touchesQuotes) {
        return undefined;
    }

    const decodedPatch = getReplyQuoteFromEmbedPayload(payload);
    const current = getCurrentReplyQuoteQuery(currentState);

    let nextReply = current?.reply ?? null;
    let nextQuotes = current?.quotes ?? [];

    if (touchesReply) {
        if (payload.reply === null) {
            nextReply = null;
        } else {
            if (!decodedPatch?.reply) {
                throw new Error('invalid_composer_context');
            }
            nextReply = decodedPatch.reply;
        }
    }

    if (touchesQuotes) {
        if (payload.quotes === null) {
            nextQuotes = [];
        } else {
            if (
                (payload.quotes?.length ?? 0) > 0 &&
                (!decodedPatch || decodedPatch.quotes.length === 0)
            ) {
                throw new Error('invalid_composer_context');
            }

            nextQuotes = decodedPatch?.quotes ?? [];
        }
    }

    if (!nextReply && nextQuotes.length === 0) {
        return null;
    }

    return {
        reply: nextReply,
        quotes: nextQuotes,
    };
}
