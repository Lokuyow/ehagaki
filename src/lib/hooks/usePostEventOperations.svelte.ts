import { onDestroy } from 'svelte';
import type { PostResult } from '../types';
import type { DeletionRequestResult } from '../postDeletionService';
import type { RxNostr } from 'rx-nostr';
import type { PostHistoryRecord } from '../storage/ehagakiDb';
import { postBroadcastService } from '../postBroadcastService';
import { postDeletionService } from '../postDeletionService';
export function usePostEventOperations(getRx: () => RxNostr | undefined, getActive: () => boolean, getScope: () => unknown = () => undefined) {
    let pending = $state<Record<string, boolean>>({});
    let generation = 0;
    let previousRx: RxNostr | undefined;
    let previousActive: boolean | undefined;
    let previousScope: unknown;
    $effect(() => {
        const rx = getRx(), active = getActive(), scope = getScope();
        if (rx !== previousRx || active !== previousActive || scope !== previousScope) generation++;
        previousRx = rx; previousActive = active; previousScope = scope;
    });
    onDestroy(() => { generation++; });
    async function run<T>(key: string, operation: () => Promise<T>): Promise<T | null> {
        if (!getActive() || pending[key]) return null;
        const epoch = generation;
        pending = { ...pending, [key]: true };
        try { const result = await operation(); return getActive() && epoch === generation ? result : null; }
        finally { pending = { ...pending, [key]: false }; }
    }
    return { isPending: (id: string) => !!pending[id],
        broadcast: (post: PostHistoryRecord) => run(`broadcast:${post.eventId}`, () => postBroadcastService.broadcast({ post, rxNostr: getRx() }).catch((): PostResult => ({ success: false, error: 'broadcast_failed' }))),
        deletePost: (post: PostHistoryRecord) => run(`delete:${post.eventId}`, () => postDeletionService.requestDeletion({ post, rxNostr: getRx() }).catch((): DeletionRequestResult => ({ success: false, error: 'deletion_failed' }))),
        reset() { generation++; }
    };
}
