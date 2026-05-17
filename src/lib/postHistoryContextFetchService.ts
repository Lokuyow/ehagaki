import {
    createRxBackwardReq,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";

export interface PostHistoryContextFetchRequest {
    eventId: string;
    relayHints?: string[];
    relayConfig?: RelayConfig | null;
    timeoutMs?: number;
}

export interface PostHistoryContextFetchResult {
    event: NostrEvent | null;
    relayUrl: string | null;
}

export interface PostHistoryContextFetchTask {
    promise: Promise<PostHistoryContextFetchResult>;
    cancel: () => void;
}

export interface PostHistoryContextFetchServiceDeps {
    console?: Console;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
}

const DEFAULT_CONTEXT_FETCH_TIMEOUT_MS = 5_000;
const POST_HISTORY_CONTEXT_RELAY_LIMIT = 8;

export class PostHistoryContextFetchService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;

    constructor(deps: PostHistoryContextFetchServiceDeps = {}) {
        this.console = deps.console ?? (
            typeof console !== "undefined"
                ? console
                : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console
        );
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
    }

    fetchEventById(
        rxNostr: RxNostr,
        params: PostHistoryContextFetchRequest,
    ): PostHistoryContextFetchTask {
        const rxReq = createRxBackwardReq();
        const relayUrls = this.resolveRelayUrls(params.relayHints, params.relayConfig);
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((result: PostHistoryContextFetchResult) => void) | undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const safeResolveFactory = (
            resolve: (result: PostHistoryContextFetchResult) => void,
        ) => (result: PostHistoryContextFetchResult) => {
            if (resolved) {
                return;
            }
            resolved = true;
            cleanup();
            resolve(result);
        };

        const promise = new Promise<PostHistoryContextFetchResult>((resolve) => {
            const safeResolve = safeResolveFactory(resolve);
            resolveTask = safeResolve;

            try {
                subscription = rxNostr.use(rxReq, {
                    on: relayUrls.length > 0
                        ? { relays: relayUrls }
                        : { defaultReadRelays: true },
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        if (packet.event?.id !== params.eventId) {
                            return;
                        }

                        safeResolve({
                            event: packet.event,
                            relayUrl: typeof packet.from === "string" ? packet.from : null,
                        });
                    },
                    complete: () => {
                        safeResolve({ event: null, relayUrl: null });
                    },
                    error: (error: unknown) => {
                        this.console.error("post_history_context_fetch_error", error);
                        safeResolve({ event: null, relayUrl: null });
                    },
                });

                rxReq.emit({ ids: [params.eventId] });
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("post_history_context_fetch_timeout", params.eventId);
                    safeResolve({ event: null, relayUrl: null });
                }, params.timeoutMs ?? DEFAULT_CONTEXT_FETCH_TIMEOUT_MS);
            } catch (error) {
                this.console.error("post_history_context_fetch_request_error", error);
                safeResolve({ event: null, relayUrl: null });
            }
        });

        return {
            promise,
            cancel: () => {
                resolveTask?.({ event: null, relayUrl: null });
            },
        };
    }

    private resolveRelayUrls(
        relayHints: string[] | undefined,
        relayConfig: RelayConfig | null | undefined,
    ): string[] {
        const configuredRelays = relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
            : [];
        const relays = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...(relayHints ?? []),
            ...configuredRelays,
        ], { limit: POST_HISTORY_CONTEXT_RELAY_LIMIT });

        return relays.length > 0
            ? relays
            : RelayConfigUtils.sanitizeExternalRelayUrls(
                FALLBACK_RELAYS,
                { limit: POST_HISTORY_CONTEXT_RELAY_LIMIT },
            );
    }
}

export const postHistoryContextFetchService = new PostHistoryContextFetchService();
