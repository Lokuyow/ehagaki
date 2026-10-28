import { RelayOperation } from "./relay/operation";
import { useRelayQuery, type RelayQuerySummary } from "./relay/query";
import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { usePostHistoryRelayEvents } from "./postHistoryRawEventVerification";
import { postHistoryDeletionFetchService } from "./postHistoryDeletionFetchService";
import { buildPostHistoryDirectReplyParentContext, validatePostHistoryDirectReplyRelation } from "./postHistoryDirectReplyRelationUtils";
import { parseReactionReference, matchesReactionReferenceTarget } from "./reactionReference";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { mergeHostReadDefaultsWithHints } from "./hostRelayRuntime";
import { RelayConfigUtils } from "./relayConfigUtils";
import { FALLBACK_RELAYS } from "./relayLists";
import type { NostrEvent, RelayConfig } from "./types";

export type RelatedEventsStatus = "success" | "partial" | "failed" | "cancelled";
export interface RelatedEventItem { event: NostrEvent; relayUrls: string[] }
export interface RelatedEventsResult {
    status: RelatedEventsStatus;
    events: RelatedEventItem[];
    deletions: RelatedEventItem[];
    targets: NostrEvent[];
    fetchedAt: number;
    repliesComplete: boolean;
}
export interface RelatedEventsTask { promise: Promise<RelatedEventsResult>; cancel(): void }

/** A bounded, one-shot check. Never retries or treats missing deletions as permanent evidence. */
export function fetchPostHistoryRelatedEvents(rxNostr: RxNostr, params: {
    event: NostrEvent;
    knownChildren: RelatedEventItem[];
    relayHints: string[];
    relayConfig?: RelayConfig | null;
}): RelatedEventsTask {
    const config = params.relayConfig;
    const hints = [...params.relayHints, ...params.knownChildren.flatMap(x => x.relayUrls)];
    const configured = config ? [...RelayConfigUtils.extractReadRelays(config), ...RelayConfigUtils.extractWriteRelays(config)] : [];
    const fallback = RelayConfigUtils.sanitizeExternalRelayUrls([...hints, ...configured], { limit: 8 });
    const relays = RelayConfigUtils.sanitizeExternalRelayUrls(mergeHostReadDefaultsWithHints(hints, 8) ?? (fallback.length ? fallback : FALLBACK_RELAYS), { limit: 8 });
    const target = { eventId: params.event.id, targetAuthorPubkey: params.event.pubkey, targetKind: params.event.kind };
    const parent = buildPostHistoryDirectReplyParentContext({ event: params.event });
    const children = new Map<string, RelatedEventItem>();
    const deletions = new Map<string, RelatedEventItem>();
    const cancels = new Set<() => void>();
    let cancelled = false;
    const started = Date.now();
    const operation = new RelayOperation(3_000, () => { [...cancels].forEach(cancel => cancel()); });
    const add = (map: Map<string, RelatedEventItem>, item: RelatedEventItem) => {
        const existing = map.get(item.event.id);
        if (existing && !isSameSignedNostrEvent(existing.event, item.event)) return;
        map.set(item.event.id, { event: item.event, relayUrls: [...new Set([...(existing?.relayUrls ?? []), ...item.relayUrls])] });
    };
    const isChild = (event: NostrEvent) => {
        if (event.kind === 7) {
            const reference = parseReactionReference(event).reference;
            return !!reference && matchesReactionReferenceTarget(reference, target);
        }
        return !!parent && validatePostHistoryDirectReplyRelation({ child: event, parent }).valid;
    };
    const collect = (kinds: number[]): Promise<RelatedEventsStatus> => new Promise(resolve => {
        const id = `related-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const req = createRxBackwardReq(id);
        let summary: RelayQuerySummary | undefined;
        const counts = new Map<string, number>();
        let done = false;
        let sub: { unsubscribe(): void } | undefined;
        let messages: { unsubscribe(): void } | undefined;
        const finish = (status: RelatedEventsStatus) => {
            if (done) return;
            done = true;
            sub?.unsubscribe(); messages?.unsubscribe(); cancels.delete(cancel);
            resolve(status);
        };
        const cancel = () => finish("cancelled");
        cancels.add(cancel);
        try {
            messages = rxNostr.createAllMessageObservable().subscribe(packet => {
                if (!Array.isArray(packet.message)) return;
                if (packet.message[1] !== `${id}:0`) return;
                if (packet.message[0] === "EVENT") counts.set(packet.from, (counts.get(packet.from) ?? 0) + 1);
            });
            sub = useRelayQuery(rxNostr, req, { on: { relays } }, {
                operation, deadlineAt: started + 2_000, quorum: false,
                source: (request, on) => usePostHistoryRelayEvents(rxNostr, request, on),
                onEnd: result => { summary = result; },
            }).subscribe({
                next: packet => { if (!done && isChild(packet.event)) add(children, { event: packet.event, relayUrls: [packet.from] }); },
                complete: () => finish(summary?.complete && [...counts.values()].every(n => n < 100) ? "success" : "partial"),
                error: () => finish("failed"),
            });
            if (done) { sub.unsubscribe(); return; }
            req.emit({ kinds, "#e": [params.event.id], limit: 100 }); req.over();
        } catch { finish("failed"); }
    });
    const deletionCheck = async (targets: NostrEvent[], timeoutMs: number): Promise<RelatedEventsStatus> => {
        if (!targets.length) return "success";
        if (timeoutMs <= 0) return "partial";
        if (cancelled) return "cancelled";
        const task = postHistoryDeletionFetchService.fetchDeletionRequests(rxNostr, {
            targets: targets.map(event => ({ event })), relayHints: relays,
            relayConfig: config, requireRelayEose: true, timeoutMs: Math.max(1, timeoutMs),
            operation, deadlineAt: Date.now() + timeoutMs,
        });
        cancels.add(task.cancel);
        const result = await task.promise;
        cancels.delete(task.cancel);
        result.events.forEach(item => add(deletions, item));
        return result.status === "success" ? "success" : result.status === "cancelled" ? "cancelled" : "partial";
    };
    const promise = (async (): Promise<RelatedEventsResult> => {
        const knownTargets = [params.event, ...params.knownChildren.filter(x => isChild(x.event)).map(x => x.event)];
        const replyKinds = params.event.kind === 42 ? [42] : params.event.kind === 1111 ? [1111] : [1, 1111];
        const statuses = await Promise.all([collect(replyKinds), collect([7]), deletionCheck(knownTargets, Math.max(0, 2_000 - (Date.now() - started)))]);
        const knownIds = new Set(knownTargets.map(x => x.id));
        const newTargets = [...children.values()].map(x => x.event).filter(x => !knownIds.has(x.id));
        if (!cancelled) statuses.push(await deletionCheck(newTargets, Math.min(1_000, Math.max(0, 3_000 - (Date.now() - started)))));
        operation.finish();
        return {
            status: cancelled ? "cancelled" : statuses[0] === "failed" && statuses[1] === "failed" && !children.size && !deletions.size ? "failed" : statuses.every(x => x === "success") ? "success" : "partial",
            events: [...children.values()], deletions: [...deletions.values()], targets: [...knownTargets, ...newTargets],
            fetchedAt: Date.now(), repliesComplete: statuses[0] === "success",
        };
    })();
    return { promise, cancel() { cancelled = true; [...cancels].forEach(cancel => cancel()); operation.finish("cancelled"); } };
}
