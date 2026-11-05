import type { NostrEvent } from './types';
import { parsePostHistoryThreadReferences } from './postHistoryNip10Utils';
import { parsePostHistoryQuoteReferences } from './postHistoryQuoteUtils';

export const NOTIFICATION_KINDS = [1, 6, 7, 16, 42, 1111] as const;
export const NOTIFICATION_LOOKBACK_SECONDS = 7 * 24 * 60 * 60;
export function isNotificationEvent(event: NostrEvent, owner: string): boolean {
    return event.pubkey !== owner && (NOTIFICATION_KINDS as readonly number[]).includes(event.kind)
        && event.tags.some(tag => tag[0] === 'p' && tag[1] === owner);
}
export function notificationType(event: NostrEvent): 'mention' | 'reply' | 'quote' | 'reaction' | 'repost' {
    if (event.kind === 7) return 'reaction';
    if (event.kind === 6 || event.kind === 16) return 'repost';
    if (parsePostHistoryQuoteReferences(event).length) return 'quote';
    return parsePostHistoryThreadReferences(event).parentId ? 'reply' : 'mention';
}
