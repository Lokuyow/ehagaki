import {
    createRxBackwardReq,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";

const POST_HISTORY_DELETION_FETCH_TIMEOUT_MS = 4_000;
const POST_HISTORY_DELETION_FETCH_RELAY_LIMIT = 8;

export interface PostHistoryDeletionFetchTarget {
    event: NostrEvent;
    relayUrls?: string[];
}

export interface PostHistoryDeletionFetchRequest {
    targets: PostHistoryDeletionFetchTarget[];
    relayHints?: string[];
    relayConfig?: RelayConfig | null;
    timeoutMs?: number;
}

export interface PostHistoryDeletionFetchedEvent {
    event: NostrEvent;
    relayUrls: string[];
}

export interface PostHistoryDeletionFetchResult {
    status: "success" | "timeout" | "error" | "cancelled";
    events: PostHistoryDeletionFetchedEvent[];
    fetchedAt: number;
    relayUrls: string[];
}

export interface PostHistoryDeletionFetchTask {
    promise: Promise<PostHistoryDeletionFetchResult>;
    cancel: () => void;
}

export interface PostHistoryDeletionFetchServiceDeps {
    console?: Console;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
    now?: () => number;
}

type EventAccumulator = {
    event: NostrEvent;
    relayUrls: Set<string>;
};

function groupTargetIdsByAuthor(targets: PostHistoryDeletionFetchTarget[]): Map<string, string[]> {
    const groupedIds = new Map<string, Set<string>>();
    for (const target of targets) {
        if (!target.event?.id || !target.event.pubkey) {
            continue;
        }

        const ids = groupedIds.get(target.event.pubkey) ?? new Set<string>();
        ids.add(target.event.id);
        groupedIds.set(target.event.pubkey, ids);
    }

    return new Map(Array.from(groupedIds.entries()).map(([pubkey, ids]) => [
        pubkey,
        Array.from(ids),
    ]));
}

function toResultEvents(eventsById: Map<string, EventAccumulator>): PostHistoryDeletionFetchedEvent[] {
    return Array.from(eventsById.values())
        .map((item) => ({
            event: item.event,
            relayUrls: Array.from(item.relayUrls).sort((left, right) => left.localeCompare(right)),
        }))
        .sort((left, right) => {
            if (left.event.created_at !== right.event.created_at) {
                return left.event.created_at - right.event.created_at;
            }

            return left.event.id.localeCompare(right.event.id);
        });
}

export class PostHistoryDeletionFetchService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private now: () => number;

    constructor(deps: PostHistoryDeletionFetchServiceDeps = {}) {
        this.console = deps.console ?? (
            typeof console !== "undefined"
                ? console
                : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console
        );
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
        this.now = deps.now ?? Date.now;
    }

    fetchDeletionRequests(
        rxNostr: RxNostr,
        params: PostHistoryDeletionFetchRequest,
    ): PostHistoryDeletionFetchTask {
        const groupedTargetIds = groupTargetIdsByAuthor(params.targets);
        const relayUrls = this.resolveRelayUrls(params);
        const eventsById = new Map<string, EventAccumulator>();
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((status: PostHistoryDeletionFetchResult["status"]) => void) | undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const buildResult = (
            status: PostHistoryDeletionFetchResult["status"],
        ): PostHistoryDeletionFetchResult => ({
            status,
            events: toResultEvents(eventsById),
            fetchedAt: this.now(),
            relayUrls,
        });

        const safeResolveFactory = (
            resolve: (result: PostHistoryDeletionFetchResult) => void,
        ) => (status: PostHistoryDeletionFetchResult["status"]) => {
            if (resolved) {
                return;
            }

            resolved = true;
            cleanup();
            resolve(buildResult(status));
        };

        const promise = new Promise<PostHistoryDeletionFetchResult>((resolve) => {
                const safeResolve = safeResolveFactory(resolve);
                resolveTask = safeResolve;

            if (groupedTargetIds.size === 0) {
                safeResolve("success");
                return;
            }

            try {
                const rxReq = createRxBackwardReq();
                subscription = rxNostr.use(rxReq, {
                    on: relayUrls.length > 0
                        ? { relays: relayUrls }
                        : { defaultReadRelays: true },
                }).subscribe({
                        next: (packet: { event?: NostrEvent; from?: string }) => {
                            this.handlePacket(eventsById, packet);
                        },
                    complete: () => safeResolve("success"),
                    error: (error: unknown) => {
                        this.console.error("post_history_deletion_fetch_error", error);
                        safeResolve("error");
                    },
                });

                for (const [author, eventIds] of groupedTargetIds.entries()) {
                    rxReq.emit({
                        kinds: [5],
                        authors: [author],
                        "#e": eventIds,
                    } as never);
                }
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("post_history_deletion_fetch_timeout");
                    safeResolve("timeout");
                }, params.timeoutMs ?? POST_HISTORY_DELETION_FETCH_TIMEOUT_MS);
            } catch (error) {
                this.console.error("post_history_deletion_fetch_request_error", error);
                safeResolve("error");
            }
        });

        return {
            promise,
            cancel: () => {
                resolveTask?.("cancelled");
            },
        };
    }

    private handlePacket(
        eventsById: Map<string, EventAccumulator>,
        packet: { event?: NostrEvent; from?: string },
    ): void {
        const event = packet.event;
        if (!event?.id || event.kind !== 5) {
            return;
        }

        const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof packet.from === "string" ? [packet.from] : [],
            { limit: 1 },
        )[0];
        const existing = eventsById.get(event.id);

        if (!existing) {
            eventsById.set(event.id, {
                event,
                relayUrls: new Set(relayUrl ? [relayUrl] : []),
            });
            return;
        }

        if (!isSameSignedNostrEvent(existing.event, event)) {
            this.console.warn("post_history_deletion_fetch_packet_conflict", event.id);
            return;
        }

        if (relayUrl) {
            existing.relayUrls.add(relayUrl);
        }
    }

    private resolveRelayUrls(params: PostHistoryDeletionFetchRequest): string[] {
        const configuredRelays = params.relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(params.relayConfig),
                ...RelayConfigUtils.extractWriteRelays(params.relayConfig),
            ]
            : [];
        const targetRelays = params.targets.flatMap((target) => target.relayUrls ?? []);
        const relays = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...targetRelays,
            ...(params.relayHints ?? []),
            ...configuredRelays,
        ], { limit: POST_HISTORY_DELETION_FETCH_RELAY_LIMIT });

        return relays.length > 0
            ? relays
            : RelayConfigUtils.sanitizeExternalRelayUrls(
                FALLBACK_RELAYS,
                { limit: POST_HISTORY_DELETION_FETCH_RELAY_LIMIT },
            );
    }
}

export const postHistoryDeletionFetchService = new PostHistoryDeletionFetchService();
