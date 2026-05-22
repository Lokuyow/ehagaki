import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_SELF_PARENT_FETCH_TIMEOUT_MS = 5_000;
export const POST_HISTORY_SELF_PARENT_FETCH_RELAY_LIMIT = 6;

export interface PostHistorySelfParentFetchRequest {
    parentEventId: string;
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    timeoutMs?: number;
}

export interface PostHistorySelfParentFetchResult {
    event: NostrEvent | null;
    relayUrl: string | null;
}

export interface PostHistorySelfParentFetchTask {
    promise: Promise<PostHistorySelfParentFetchResult>;
    cancel: () => void;
}

export interface PostHistorySelfParentFetchServiceDeps {
    console?: Pick<Console, "warn" | "error">;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
}

type SubscriptionLike = {
    unsubscribe?: () => void;
};

export class PostHistorySelfParentFetchService {
    private console: Pick<Console, "warn" | "error">;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;

    constructor(deps: PostHistorySelfParentFetchServiceDeps = {}) {
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { warn: () => undefined, error: () => undefined });
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
    }

    fetchSelfParent(
        rxNostr: RxNostr,
        params: PostHistorySelfParentFetchRequest,
    ): PostHistorySelfParentFetchTask {
        let subscription: SubscriptionLike | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolved = false;
        let resolveTask: ((result: PostHistorySelfParentFetchResult) => void) | undefined;
        const relayUrls = this.resolveRelayUrls(params.relayConfig);

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const promise = new Promise<PostHistorySelfParentFetchResult>((resolve) => {
            const safeResolve = (result: PostHistorySelfParentFetchResult) => {
                if (resolved) {
                    return;
                }

                resolved = true;
                cleanup();
                resolve(result);
            };
            resolveTask = safeResolve;

            try {
                if (typeof (rxNostr as { use?: unknown }).use !== "function") {
                    safeResolve({ event: null, relayUrl: null });
                    return;
                }

                const rxReq = createRxBackwardReq();
                subscription = rxNostr.use(rxReq, {
                    on: relayUrls.length > 0
                        ? { relays: relayUrls }
                        : { defaultReadRelays: true },
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        const event = packet.event;
                        if (
                            event?.id !== params.parentEventId
                            || event.pubkey !== params.ownerPubkeyHex
                            || (event.kind !== 1 && event.kind !== 42)
                        ) {
                            return;
                        }

                        safeResolve({
                            event,
                            relayUrl: typeof packet.from === "string" ? packet.from : null,
                        });
                    },
                    complete: () => safeResolve({ event: null, relayUrl: null }),
                    error: (error: unknown) => {
                        this.console.error("post_history_self_parent_fetch_error", error);
                        safeResolve({ event: null, relayUrl: null });
                    },
                });

                rxReq.emit({
                    ids: [params.parentEventId],
                    authors: [params.ownerPubkeyHex],
                    kinds: [1, 42],
                } as never);
                rxReq.over();

                if (resolved) {
                    return;
                }

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("post_history_self_parent_fetch_timeout", params.parentEventId);
                    safeResolve({ event: null, relayUrl: null });
                }, params.timeoutMs ?? POST_HISTORY_SELF_PARENT_FETCH_TIMEOUT_MS);
            } catch (error) {
                this.console.error("post_history_self_parent_fetch_request_error", error);
                safeResolve({ event: null, relayUrl: null });
            }
        });

        return {
            promise,
            cancel: () => resolveTask?.({ event: null, relayUrl: null }),
        };
    }

    private resolveRelayUrls(relayConfig: RelayConfig | null | undefined): string[] {
        const configuredRelays = relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
            : [];
        const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(configuredRelays, {
            limit: POST_HISTORY_SELF_PARENT_FETCH_RELAY_LIMIT,
        });

        return relayUrls.length > 0
            ? relayUrls
            : RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS, {
                limit: POST_HISTORY_SELF_PARENT_FETCH_RELAY_LIMIT,
            });
    }
}

export const postHistorySelfParentFetchService = new PostHistorySelfParentFetchService();
