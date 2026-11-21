import type { NostrEvent } from './types';
import { parsePostHistoryThreadReferences } from './postHistoryNip10Utils';
import { parsePostHistoryQuoteReferences } from './postHistoryQuoteUtils';
import { eventMentionsProfile } from './profileMention';

export const NOTIFICATION_KINDS = [1, 6, 7, 16, 42, 1111] as const;
export const NOTIFICATION_LOOKBACK_SECONDS = 7 * 24 * 60 * 60;
export function isNotificationEvent(event: NostrEvent, owner: string): boolean {
    return event.pubkey !== owner && (NOTIFICATION_KINDS as readonly number[]).includes(event.kind)
        && event.tags.some(tag => tag[0] === 'p' && tag[1] === owner);
}
export function notificationType(event: NostrEvent, owner?: string): 'mention' | 'reply' | 'quote' | 'reaction' | 'repost' {
    if (event.kind === 7) return 'reaction';
    if (event.kind === 6 || event.kind === 16) return 'repost';
    const quotes = parsePostHistoryQuoteReferences(event);
    const thread = parsePostHistoryThreadReferences(event);
    if (owner && eventMentionsProfile(event, owner)) {
        const parentAuthor = thread.parentPubkey ?? (thread.replyId ? thread.replyAuthorHint : thread.rootAuthorHint);
        if (quotes.some(quote => quote.authorHint === owner)) return 'quote';
        if (thread.parentId && parentAuthor === owner) return 'reply';
        return 'mention';
    }
    if (quotes.length) return 'quote';
    return thread.parentId ? 'reply' : 'mention';
}
