import {
    createRxBackwardReq,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./relayLists";
import {
    mergeHostReadDefaultsWithHints,
} from "./hostRelayRuntime";
import { RelayConfigUtils } from "./relayConfigUtils";
import { getNip65RelayDirectory } from "./nip65RelayDirectory";
import type { NostrEvent, RelayConfig } from "./types";
import { usePostHistoryRelayEvents } from "./postHistoryRawEventVerification";

export interface PostHistoryContextFetchRequest {
    eventId: string;
    authorHint?: string | null;
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
    lookupAuthorWriteRelaysFn?: (pubkeyHex: string) => Promise<string[]>;
}

const DEFAULT_CONTEXT_FETCH_TIMEOUT_MS = 5_000;
const POST_HISTORY_CONTEXT_RELAY_LIMIT = 8;

export class PostHistoryContextFetchService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private lookupAuthorWriteRelaysFn?: (pubkeyHex: string) => Promise<string[]>;

    constructor(deps: PostHistoryContextFetchServiceDeps = {}) {
        this.console = deps.console ?? (
            typeof console !== "undefined"
                ? console
                : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console
        );
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
        this.lookupAuthorWriteRelaysFn = deps.lookupAuthorWriteRelaysFn;
    }

    fetchEventById(
        rxNostr: RxNostr,
        params: PostHistoryContextFetchRequest,
    ): PostHistoryContextFetchTask {
        let resolved = false;
        const subscriptions = new Set<{ unsubscribe?: () => void }>();
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((result: PostHistoryContextFetchResult) => void) | undefined;
        const searchedRelays = new Set<string>();
        let baseSearchDone = false;
        let authorLookupDone = !params.authorHint;
        let authorSearchDone = true;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }
            for (const subscription of subscriptions) {
                subscription.unsubscribe?.();
            }
            subscriptions.clear();
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

            timeoutId = this.setTimeoutFn(() => {
                this.console.warn("post_history_context_fetch_timeout", params.eventId);
                safeResolve({ event: null, relayUrl: null });
            }, params.timeoutMs ?? DEFAULT_CONTEXT_FETCH_TIMEOUT_MS);

            const maybeResolveMissing = () => {
                if (baseSearchDone && authorLookupDone && authorSearchDone) {
                    safeResolve({ event: null, relayUrl: null });
                }
            };

            const startSearch = (relayUrls: string[], source: "base" | "author") => {
                if (resolved) return;
                const targets = relayUrls.filter((relay) => !searchedRelays.has(relay));
                targets.forEach((relay) => searchedRelays.add(relay));
                if (targets.length === 0) {
                    if (source === "base") baseSearchDone = true;
                    else authorSearchDone = true;
                    maybeResolveMissing();
                    return;
                }

                const rxReq = createRxBackwardReq();
                let searchResolved = false;
                const finishSearch = () => {
                    if (searchResolved) return;
                    searchResolved = true;
                    if (source === "base") baseSearchDone = true;
                    else authorSearchDone = true;
                    maybeResolveMissing();
                };

                try {
                    const subscription = usePostHistoryRelayEvents(rxNostr, rxReq, {
                        on: { relays: targets },
                    }).subscribe({
                        next: (packet: { event?: NostrEvent; from?: string }) => {
                            if (packet.event?.id !== params.eventId) return;
                            safeResolve({
                                event: packet.event,
                                relayUrl: typeof packet.from === "string" ? packet.from : null,
                            });
                        },
                        complete: finishSearch,
                        error: (error: unknown) => {
                            this.console.error("post_history_context_fetch_error", error);
                            finishSearch();
                        },
                    });
                    subscriptions.add(subscription);
                    if (resolved) {
                        cleanup();
                        return;
                    }
                    rxReq.emit({ ids: [params.eventId] });
                    rxReq.over();
                } catch (error) {
                    this.console.error("post_history_context_fetch_request_error", error);
                    finishSearch();
                }
            };

            const baseRelays = this.resolveRelayUrls(params.relayHints, params.relayConfig);
            startSearch(baseRelays, "base");

            if (params.authorHint) {
                const lookup = this.lookupAuthorWriteRelaysFn
                    ? this.lookupAuthorWriteRelaysFn(params.authorHint)
                    : getNip65RelayDirectory(rxNostr).lookup(params.authorHint)
                        .then((entry) => entry.writeRelays);
                void lookup
                    .then((authorRoutes) => {
                        authorLookupDone = true;
                        if (resolved) return;
                        const authorRelays = this.resolveRelayUrls(
                            authorRoutes,
                            params.relayConfig,
                        );
                        authorSearchDone = false;
                        startSearch(authorRelays, "author");
                    })
                    .catch(() => {
                        authorLookupDone = true;
                        maybeResolveMissing();
                    });
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
        const hostRelays = mergeHostReadDefaultsWithHints(
            relayHints,
            POST_HISTORY_CONTEXT_RELAY_LIMIT,
        );
        if (hostRelays) {
            return hostRelays;
        }
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
