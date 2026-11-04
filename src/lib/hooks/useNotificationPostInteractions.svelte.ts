import { setContext, getContext, onDestroy } from 'svelte';
import { liveQuery } from 'dexie';
import type { NotificationDialogProps } from '../notificationDialogTypes';
import type { PostHistoryRecord } from '../storage/ehagakiDb';
import { usePostEventOperations } from './usePostEventOperations.svelte';
import { postHistoryDeletionRequestsRepository as deletions } from '../storage/postHistoryDeletionRequestsRepository';
function uniquePosts(values: PostHistoryRecord[]) {
    const result = new Map<string, PostHistoryRecord>();
    for (const post of values) {
        const previous = result.get(post.eventId);
        result.set(post.eventId, { ...post, relayHints: [...new Set([...(previous?.relayHints ?? []), ...post.relayHints])] });
    }
    return [...result.values()];
}
const key = Symbol('notification-post-interactions');
export function useNotificationPostInteractions(props: () => NotificationDialogProps, active: () => boolean) {
    let disposed = false;
    const activeInput = active; active = () => !disposed && activeInput();
    onDestroy(() => { disposed = true; });
    let registrations = $state.raw<Record<string, PostHistoryRecord>>({});
    let deleted = $state.raw<Set<string>>(new Set());
    const operations = usePostEventOperations(() => props().rxNostr, active, () => `${props().pubkeyHex}:${JSON.stringify(props().relayConfig)}`);
    $effect(() => {
        const targets = uniquePosts(Object.values(registrations));
        if (!active() || !targets.length) return;
        let current = true;
        const sub = liveQuery(() => deletions.getDeletedTargets(targets.map(post => ({ targetEventId: post.eventId, targetAuthorPubkey: post.pubkeyHex })))).subscribe(map => {
            if (current) { const next = new Set([...map.values()].flatMap(ids => [...ids])); if (next.size !== deleted.size || [...next].some(id => !deleted.has(id))) deleted = next; }
        });
        return () => { current = false; sub.unsubscribe(); };
    });
    onDestroy(() => operations.reset());
    const api = { operations, active, props,
        isDeleted: (id: string) => deleted.has(id),
        register(id: string, post: PostHistoryRecord) { registrations = { ...registrations, [id]: post }; },
        unregister(id: string) { const next = { ...registrations }; delete next[id]; registrations = next; },
        deleted(id: string) { deleted = new Set([...deleted, id]); }
    };
    setContext(key, api); return api;
}
export const getNotificationPostInteractions = () => getContext<ReturnType<typeof useNotificationPostInteractions>>(key);
