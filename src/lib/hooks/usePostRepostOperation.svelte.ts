import type { RxNostr } from "rx-nostr";
import { onDestroy } from "svelte";
import { postRepostService, type PostRepostResult, type PostRepostService } from "../postRepostService";
import { isPostHistoryRawEventConsistent } from "../postHistoryEventUtils";
import type { PostHistoryRecord } from "../storage/ehagakiDb";

export type RepostPostHandler = (post: PostHistoryRecord, resolveRelayHint?: () => Promise<string[]>) => Promise<PostRepostResult>;
export function usePostRepostOperation(params: { getPubkey: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined; onSaved: (ids: string[]) => void | Promise<void>; service?: PostRepostService }) {
    const service = params.service ?? postRepostService;
    let pending = $state(false);
    let failedSaves = $state.raw<PostRepostResult[]>([]);
    let generation = 0;
    $effect(() => { params.getPubkey(); params.getRxNostr(); generation++; });
    onDestroy(() => { generation++; });
    const execute: RepostPostHandler = async (post, resolveRelayHint) => {
        if (pending || post.deletedAt !== undefined || post.kind !== 1
            || !isPostHistoryRawEventConsistent(post.rawEvent, post)) return { success: false, error: "invalid_repost_target" };
        pending = true;
        const current = generation;
        const owner = params.getPubkey();
        const rx = params.getRxNostr();
        const isCurrent = () => generation === current && params.getPubkey() === owner && params.getRxNostr() === rx;
        try {
            const result = await service.repost({ target: post.rawEvent,
                relayHints: [...(post.fetchedRelays ?? []), ...post.acceptedRelays, ...post.relayHints],
                rxNostr: rx, isCurrent, resolveRelayHint });
            if (result.retryInput) failedSaves = [...failedSaves, result];
            if (!isCurrent()) return { ...result, error: "repost_stale" };
            if (result.historySaved && result.eventId) await params.onSaved([result.eventId]);
            return result;
        } finally { pending = false; }
    };
    return { get pending() { return pending; },
        get saveFailure() { return failedSaves.find(result => result.retryInput?.event.pubkey === params.getPubkey()) ?? null; }, execute,
        async retrySave(result: PostRepostResult) {
            if (pending || !result.retryInput || params.getPubkey() !== result.retryInput.event.pubkey) return false;
            pending = true;
            const current = generation;
            const owner = params.getPubkey();
            const rx = params.getRxNostr();
            try {
                const saved = await service.retrySave(result.retryInput);
                if (saved) failedSaves = failedSaves.filter(item => item.retryInput?.event.id !== result.retryInput!.event.id);
                if (generation !== current || params.getPubkey() !== owner || params.getRxNostr() !== rx) return false;
                if (saved) await params.onSaved([result.retryInput.event.id]);
                return saved;
            } finally { pending = false; }
        } };
}
