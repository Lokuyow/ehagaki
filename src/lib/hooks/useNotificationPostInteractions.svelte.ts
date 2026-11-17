import { setContext, getContext, onDestroy, untrack } from 'svelte';
import { liveQuery } from 'dexie';
import type { NotificationDialogProps } from '../notificationDialogTypes';
import type { PostHistoryRecord } from '../storage/ehagakiDb';
import { usePostEventOperations } from './usePostEventOperations.svelte';
import type { usePostHistoryEmojiState } from './usePostHistoryEmojiState.svelte';
import { postHistoryDeletionRequestsRepository as deletions } from '../storage/postHistoryDeletionRequestsRepository';

type DeletionTarget = Pick<PostHistoryRecord, 'eventId' | 'pubkeyHex'>;

/** A mounted card's text, read by the list-level collapse and emoji state. */
export interface NotificationPreviewEntry {
    eventId: string;
    content: string;
    emojiUrls: string[];
}

export interface NotificationPreviewSupport {
    previewRef: (node: HTMLElement, eventId: string) => { destroy?: () => void } | void;
    isPostExpanded: (post: { eventId: string; content: string }) => boolean;
    shouldCollapsePost: (post: { eventId: string; content: string }) => boolean;
    togglePostExpanded: (eventId: string) => void;
    readonly emojiLoadStateByUrl: ReturnType<typeof usePostHistoryEmojiState>['emojiLoadStateByUrl'];
    readonly emojiImageMetaByUrl: ReturnType<typeof usePostHistoryEmojiState>['emojiImageMetaByUrl'];
}

const key = Symbol('notification-post-interactions');
export function useNotificationPostInteractions(props: () => NotificationDialogProps, active: () => boolean) {
    let disposed = false;
    const activeInput = active; active = () => !disposed && activeInput();
    onDestroy(() => { disposed = true; });
    let registrations = $state.raw<Record<string, DeletionTarget>>({});
    let previews = $state.raw<Record<string, NotificationPreviewEntry>>({});
    let preview: NotificationPreviewSupport | null = null;
    let deleted = $state.raw<Set<string>>(new Set());
    const operations = usePostEventOperations(() => props().rxNostr, active, () => `${props().pubkeyHex}:${JSON.stringify(props().relayConfig)}`);
    // Cards register as they come into view; the query only restarts when the
    // set of watched targets changes, not on every registration object.
    const targetKey = $derived([...new Set(Object.values(registrations).map(post => `${post.eventId}\n${post.pubkeyHex}`))].sort().join('\n\n'));
    $effect(() => {
        const watched = targetKey;
        if (!active() || !watched) return;
        const targets = untrack(() => watched.split('\n\n').map(item => {
            const [targetEventId, targetAuthorPubkey] = item.split('\n');
            return { targetEventId, targetAuthorPubkey };
        }));
        let current = true;
        const sub = liveQuery(() => deletions.getDeletedTargets(targets)).subscribe(map => {
            if (current) { const next = new Set([...map.values()].flatMap(ids => [...ids])); if (next.size !== deleted.size || [...next].some(id => !deleted.has(id))) deleted = next; }
        });
        return () => { current = false; sub.unsubscribe(); };
    });
    onDestroy(() => operations.reset());
    const api = { operations, active, props,
        isDeleted: (id: string) => deleted.has(id),
        register(id: string, post: DeletionTarget) {
            const previous = registrations[id];
            if (previous?.eventId === post.eventId && previous.pubkeyHex === post.pubkeyHex) return;
            registrations = { ...registrations, [id]: { eventId: post.eventId, pubkeyHex: post.pubkeyHex } };
        },
        unregister(id: string) { if (!(id in registrations)) return; const next = { ...registrations }; delete next[id]; registrations = next; },
        deleted(id: string) { deleted = new Set([...deleted, id]); },
        get previews() { return previews; },
        registerPreview(entry: NotificationPreviewEntry) {
            const previous = previews[entry.eventId];
            if (previous?.content === entry.content && previous.emojiUrls.length === entry.emojiUrls.length
                && previous.emojiUrls.every((url, index) => url === entry.emojiUrls[index])) return;
            previews = { ...previews, [entry.eventId]: entry };
        },
        unregisterPreview(id: string) { if (!(id in previews)) return; const next = { ...previews }; delete next[id]; previews = next; },
        /** Provided by the list so every card shares one collapse and emoji state. */
        setPreviewSupport(value: NotificationPreviewSupport) { preview = value; },
        get preview() { return preview; },
    };
    setContext(key, api); return api;
}
export const getNotificationPostInteractions = () => getContext<ReturnType<typeof useNotificationPostInteractions>>(key);
