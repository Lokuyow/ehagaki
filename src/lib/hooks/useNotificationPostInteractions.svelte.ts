import { setContext, getContext, onDestroy, untrack } from 'svelte';
import { postHistoryChildInteractionsRepository } from '../storage/postHistoryChildInteractionsRepository';
import { createSensitivePayloadBodyLoader } from '../sensitiveContentPayloadReader';
import type { NostrEvent } from '../types';
import { liveQuery } from 'dexie';
import type { NotificationDialogProps } from '../notificationDialogTypes';
import type { PostHistoryRecord } from '../storage/ehagakiDb';
import { usePostHistoryThreadGraph } from './usePostHistoryThreadGraph.svelte';
import { usePostEventOperations } from './usePostEventOperations.svelte';
import { postHistoryVisibleRangeChildInteractionRepairService as repair } from '../postHistoryVisibleRangeChildInteractionRepairService';
import { postHistoryDeletionRequestsRepository as deletions } from '../storage/postHistoryDeletionRequestsRepository';
import { createPostHistoryProfileSyncCoordinator } from '../postHistoryProfileSync';
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
    let incomplete = $state.raw<Set<string>>(new Set());
    function setIncomplete(ids: string[], failed: boolean) {
        const next = new Set(incomplete);
        for (const id of ids) { if (failed) next.add(id); else next.delete(id); }
        incomplete = next;
    }
    const profiles = createPostHistoryProfileSyncCoordinator({ getShow: active, getRxNostr: () => props().rxNostr });
    const graph = usePostHistoryThreadGraph({ getShow: active, getPubkeyHex: () => props().pubkeyHex,
        getRxNostr: () => props().rxNostr, getRelayConfig: () => props().relayConfig, profileSyncCoordinator: profiles,
        onDeletedPost: id => { deleted = new Set([...deleted, id]); } });
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
    $effect(() => {
        const values = Object.values(registrations);
        const posts = uniquePosts(values);
        const { pubkeyHex, rxNostr, relayConfig } = props();
        if (!active() || !posts.length) return;
        let current = true;
        let task: ReturnType<typeof repair.repairVisibleRangeChildInteractions> | null = null;
        let reactions: ReturnType<typeof repair.repairRelatedCardReactions> | null = null;
        const owned = () => current && active() && props().pubkeyHex === pubkeyHex && props().rxNostr === rxNostr && props().relayConfig === relayConfig;
        void untrack(async () => {
            await graph.loadCachedChildInteractionStateForPosts(posts, undefined, owned);
            if (!owned() || !rxNostr || !pubkeyHex) return;
            task = repair.repairVisibleRangeChildInteractions(rxNostr, { ownerPubkeyHex: pubkeyHex, includeOtherAuthors: true, visiblePosts: posts, relayConfig, isActive: owned });
            reactions = repair.repairRelatedCardReactions(rxNostr, { targets: posts.filter(post => ![1, 42, 1111].includes(post.kind)).map(post => ({ eventId: post.eventId, targetAuthorPubkey: post.pubkeyHex, targetKind: post.kind, relayHints: post.relayHints })), relayConfig, isActive: owned });
            const [result, reactionResult] = await Promise.all([task.promise, reactions.promise]);
            if (!owned()) return;
            setIncomplete(result.checkedParentEventIds, false);
            setIncomplete(result.incompleteParentEventIds, true);
            if (reactionResult.status !== 'cancelled') setIncomplete(reactionResult.targetEventIds, reactionResult.status !== 'success');
            if (owned()) await graph.loadCachedChildInteractionStateForPosts(posts, posts.map(post => post.eventId), owned);
        }).catch(() => { if (owned()) setIncomplete(posts.map(post => post.eventId), true); });
        return () => { current = false; task?.cancel(); reactions?.cancel(); };
    });
    $effect(() => {
        const posts = uniquePosts(Object.values(registrations));
        if (!active() || !posts.length) return;
        let current = true;
        const sub = liveQuery(() => postHistoryChildInteractionsRepository.getChildInteractionsForParents(posts.map(post => post.eventId))).subscribe({
            next: () => { if (current && active()) void graph.loadCachedChildInteractionStateForPosts(posts, posts.map(post => post.eventId), () => current && active()); },
            error: () => {}
        });
        return () => { current = false; sub.unsubscribe(); };
    });
    onDestroy(() => { operations.reset(); profiles.dispose(); });
    const api = { graph, operations, active, props,
        sensitiveBody(event: NostrEvent, relayHints: string[]) {
            return createSensitivePayloadBodyLoader({ structure: event, relayHints, rxNostr: props().rxNostr, relayConfig: props().relayConfig, ownerPubkey: props().pubkeyHex });
        },
        isDeleted: (id: string) => deleted.has(id),
        isIncomplete: (id: string) => incomplete.has(id),
        register(id: string, post: PostHistoryRecord) { registrations = { ...registrations, [id]: post }; },
        unregister(id: string) { const next = { ...registrations }; delete next[id]; registrations = next; },
        async refresh(post: PostHistoryRecord) { if (!active()) return; await graph.refreshRelatedEvents(post); if (active() && graph.getAnchorState(post).relatedEventsStatus === 'success') setIncomplete([post.eventId], false); },
        deleted(id: string) { deleted = new Set([...deleted, id]); }
    };
    setContext(key, api); return api;
}
export const getNotificationPostInteractions = () => getContext<ReturnType<typeof useNotificationPostInteractions>>(key);
