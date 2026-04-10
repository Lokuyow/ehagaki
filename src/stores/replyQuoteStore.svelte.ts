import type { ReplyQuoteState, ReplyQuoteMode, NostrEvent } from '../lib/types';

// --- リプライ・引用状態管理 ---
let replyQuote = $state<ReplyQuoteState | null>(null);

export const replyQuoteState = {
    get value() { return replyQuote; },
};

export function setReplyQuote(params: {
    mode: ReplyQuoteMode;
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
}): void {
    replyQuote = {
        mode: params.mode,
        eventId: params.eventId,
        relayHints: params.relayHints,
        authorPubkey: params.authorPubkey,
        authorDisplayName: null,
        referencedEvent: null,
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        loading: true,
        error: null,
    };
}

export function updateReferencedEvent(
    event: NostrEvent,
    threadInfo?: {
        rootEventId: string | null;
        rootRelayHint: string | null;
        rootPubkey: string | null;
    }
): void {
    if (!replyQuote) return;
    replyQuote.referencedEvent = event;
    replyQuote.authorPubkey = event.pubkey;
    replyQuote.loading = false;
    replyQuote.error = null;
    if (threadInfo) {
        replyQuote.rootEventId = threadInfo.rootEventId;
        replyQuote.rootRelayHint = threadInfo.rootRelayHint;
        replyQuote.rootPubkey = threadInfo.rootPubkey;
    }
}

export function setReplyQuoteError(error: string): void {
    if (!replyQuote) return;
    replyQuote.loading = false;
    replyQuote.error = error;
}

export function updateAuthorDisplayName(name: string): void {
    if (!replyQuote) return;
    replyQuote.authorDisplayName = name;
}

export function clearReplyQuote(): void {
    replyQuote = null;
}
