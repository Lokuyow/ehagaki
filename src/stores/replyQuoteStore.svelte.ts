import type {
    ReplyQuoteState,
    ReplyQuoteMode,
    NostrEvent,
    DraftReplyQuoteData,
    ReplyQuoteComposerState,
    ReplyQuoteQueryResult,
    ReplyQuoteQueryTarget,
    DraftReplyQuoteEntryData,
    ReplyNotificationRecipient,
} from '../lib/types';
import { settingsStore } from './settingsStore.svelte';

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
        quoteNotificationEnabled:
            params.mode === 'quote'
                ? settingsStore.quoteNotificationEnabled
                : false,
        replyNotificationRecipients: [],
        authorDisplayName: null,
        authorPicture: null,
        referencedEvent: null,
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        loading: true,
        error: null,
    };
}

function createDraftEntryState(data: DraftReplyQuoteEntryData): ReplyQuoteState {
    const normalizePresentationValue = (value: unknown): string | null =>
        typeof value === 'string' && value.trim() ? value.trim() : null;

    return {
        ...data,
        quoteNotificationEnabled: data.quoteNotificationEnabled === true,
        authorDisplayName: normalizePresentationValue(data.authorDisplayName),
        authorPicture: normalizePresentationValue(data.authorPicture),
        replyNotificationRecipients: data.replyNotificationRecipients
            ? data.replyNotificationRecipients.map((recipient) => ({
                ...recipient,
                displayName: normalizePresentationValue(recipient.displayName),
                picture: normalizePresentationValue(recipient.picture),
            }))
            : createLegacyReplyNotificationRecipients(data),
        loading: false,
        error: null,
    };
}

function createLegacyReplyNotificationRecipients(
    data: DraftReplyQuoteEntryData,
): ReplyNotificationRecipient[] {
    if (data.mode !== 'reply' || !data.referencedEvent) {
        return [];
    }

    const directPubkey = data.referencedEvent.pubkey || data.authorPubkey;
    const seen = new Set<string>();
    return data.referencedEvent.tags.flatMap((tag) => {
        const pubkey = tag[0] === 'p' ? tag[1] : undefined;
        if (!pubkey || pubkey === directPubkey || seen.has(pubkey)) {
            return [];
        }
        seen.add(pubkey);
        return [{ pubkey, displayName: null, picture: null, enabled: false }];
    });
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

export function initializeReplyNotificationRecipients(
    eventId: string,
    event: NostrEvent,
): void {
    updateMatchingReferences(eventId, (reference) => {
        if (reference.mode !== 'reply') {
            return;
        }

        const seen = new Set<string>();
        reference.replyNotificationRecipients = event.tags.flatMap((tag) => {
            const pubkey = tag[0] === 'p' ? tag[1] : undefined;
            if (!pubkey || pubkey === event.pubkey || seen.has(pubkey)) {
                return [];
            }
            seen.add(pubkey);
            return [{
                pubkey,
                displayName: null,
                picture: null,
                enabled: settingsStore.replyNotificationEnabled,
            }];
        });
    });
    notifyReplyQuoteChanged();
}

export function updateReplyNotificationRecipientProfile(
    eventId: string,
    pubkey: string,
    profile: {
        displayName: string | null;
        picture: string | null;
    },
): void {
    const displayName = profile.displayName?.trim() || null;
    const picture = profile.picture?.trim() || null;
    let changed = false;
    updateMatchingReferences(eventId, (reference) => {
        for (const recipient of reference.replyNotificationRecipients ?? []) {
            if (
                recipient.pubkey !== pubkey
                || (
                    recipient.displayName === displayName
                    && recipient.picture === picture
                )
            ) {
                continue;
            }
            recipient.displayName = displayName;
            recipient.picture = picture;
            changed = true;
        }
    });
    if (changed) {
        notifyReplyQuoteChanged();
    }
}

export function setReplyNotificationRecipientEnabled(
    eventId: string,
    pubkey: string,
    enabled: boolean,
): void {
    let changed = false;
    updateMatchingReferences(eventId, (reference) => {
        const recipient = reference.replyNotificationRecipients?.find(
            (item) => item.pubkey === pubkey,
        );
        if (recipient && recipient.enabled !== enabled) {
            recipient.enabled = enabled;
            changed = true;
        }
    });
    if (changed) {
        notifyReplyQuoteChanged();
    }
}

export function setReplyQuoteError(eventId: string, error: string): void {
    updateMatchingReferences(eventId, (reference) => {
        reference.loading = false;
        reference.error = error;
    });
    notifyReplyQuoteChanged();
}

export function updateAuthorProfile(
    eventId: string,
    pubkey: string,
    profile: {
        displayName: string | null;
        picture: string | null;
    },
): void {
    const displayName = profile.displayName?.trim() || null;
    const picture = profile.picture?.trim() || null;
    let changed = false;
    updateMatchingReferences(eventId, (reference) => {
        if (
            reference.authorPubkey !== pubkey
            || (
                reference.authorDisplayName === displayName
                && reference.authorPicture === picture
            )
        ) {
            return;
        }
        reference.authorDisplayName = displayName;
        reference.authorPicture = picture;
        changed = true;
    });
    if (changed) {
        notifyReplyQuoteChanged();
    }
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

export function addQuoteReference(reference: ReplyQuoteQueryTarget): boolean {
    if (replyQuote.quotes.some((quote) => quote.eventId === reference.eventId)) {
        return false;
    }

    replyQuote.quotes = [
        ...replyQuote.quotes,
        createReplyQuoteState({
            mode: 'quote',
            ...reference,
        }),
    ];
    notifyReplyQuoteChanged();
    return true;
}

export function setQuoteNotificationEnabled(eventId: string, enabled: boolean): void {
    let changed = false;
    replyQuote.quotes.forEach((quote) => {
        if (quote.eventId === eventId && quote.quoteNotificationEnabled !== enabled) {
            quote.quoteNotificationEnabled = enabled;
            changed = true;
        }
    });

    if (changed) {
        notifyReplyQuoteChanged();
    }
}

export function clearReplyQuote(): void {
    replyQuote = {
        reply: null,
        quotes: [],
    };
    notifyReplyQuoteChanged();
}
