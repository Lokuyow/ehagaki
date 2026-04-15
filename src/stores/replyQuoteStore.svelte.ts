import type {
    ReplyQuoteState,
    ReplyQuoteMode,
    NostrEvent,
    DraftReplyQuoteData,
    ReplyQuoteComposerState,
    ReplyQuoteQueryResult,
    DraftReplyQuoteEntryData,
} from '../lib/types';

// --- リプライ・引用状態管理 ---
let replyQuote = $state<ReplyQuoteComposerState>({
    reply: null,
    quotes: [],
});

const replyQuoteChangeListeners = new Set<
    (state: ReplyQuoteComposerState) => void
>();

function createReplyQuoteState(params: {
    mode: ReplyQuoteMode;
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
}): ReplyQuoteState {
    return {
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

function createDraftEntryState(data: DraftReplyQuoteEntryData): ReplyQuoteState {
    return {
        ...data,
        loading: false,
        error: null,
    };
}

function isLegacyDraftReplyQuoteData(
    data: DraftReplyQuoteData,
): data is DraftReplyQuoteEntryData {
    return 'mode' in data && 'eventId' in data;
}

function updateMatchingReferences(
    eventId: string,
    updater: (state: ReplyQuoteState) => void,
): void {
    if (replyQuote.reply?.eventId === eventId) {
        updater(replyQuote.reply);
    }

    replyQuote.quotes.forEach((quote) => {
        if (quote.eventId === eventId) {
            updater(quote);
        }
    });
}

export const replyQuoteState = {
    get value() { return replyQuote; },
};

function notifyReplyQuoteChanged(): void {
    replyQuoteChangeListeners.forEach((listener) => {
        listener(replyQuote);
    });
}

export function onReplyQuoteChanged(
    listener: (state: ReplyQuoteComposerState) => void,
): () => void {
    replyQuoteChangeListeners.add(listener);
    return () => {
        replyQuoteChangeListeners.delete(listener);
    };
}

export function setReplyQuote(params: ReplyQuoteQueryResult): void {
    replyQuote = {
        reply: params.reply
            ? createReplyQuoteState({
                mode: 'reply',
                ...params.reply,
            })
            : null,
        quotes: params.quotes.map((quote) =>
            createReplyQuoteState({
                mode: 'quote',
                ...quote,
            }),
        ),
    };
    notifyReplyQuoteChanged();
}

export function updateReferencedEvent(
    eventId: string,
    event: NostrEvent,
    threadInfo?: {
        rootEventId: string | null;
        rootRelayHint: string | null;
        rootPubkey: string | null;
    }
): void {
    updateMatchingReferences(eventId, (reference) => {
        reference.referencedEvent = event;
        reference.authorPubkey = event.pubkey;
        reference.loading = false;
        reference.error = null;
        if (threadInfo) {
            reference.rootEventId = threadInfo.rootEventId;
            reference.rootRelayHint = threadInfo.rootRelayHint;
            reference.rootPubkey = threadInfo.rootPubkey;
        }
    });
    notifyReplyQuoteChanged();
}

export function setReplyQuoteError(eventId: string, error: string): void {
    updateMatchingReferences(eventId, (reference) => {
        reference.loading = false;
        reference.error = error;
    });
    notifyReplyQuoteChanged();
}

export function updateAuthorDisplayName(eventId: string, name: string): void {
    updateMatchingReferences(eventId, (reference) => {
        reference.authorDisplayName = name;
    });
    notifyReplyQuoteChanged();
}

export function restoreReplyQuote(data: DraftReplyQuoteData): void {
    if (isLegacyDraftReplyQuoteData(data)) {
        replyQuote = {
            reply: data.mode === 'reply' ? createDraftEntryState(data) : null,
            quotes: data.mode === 'quote' ? [createDraftEntryState(data)] : [],
        };
        notifyReplyQuoteChanged();
        return;
    }

    replyQuote = {
        reply: data.reply ? createDraftEntryState(data.reply) : null,
        quotes: data.quotes.map((quote) => createDraftEntryState(quote)),
    };
    notifyReplyQuoteChanged();
}

export function clearReplyReference(): void {
    replyQuote.reply = null;
    notifyReplyQuoteChanged();
}

export function removeQuoteReference(eventId: string): void {
    replyQuote.quotes = replyQuote.quotes.filter((quote) => quote.eventId !== eventId);
    notifyReplyQuoteChanged();
}

export function clearReplyQuote(): void {
    replyQuote = {
        reply: null,
        quotes: [],
    };
    notifyReplyQuoteChanged();
}
