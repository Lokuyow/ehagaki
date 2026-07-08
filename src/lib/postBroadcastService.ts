import type { RxNostr } from "rx-nostr";
import { writeRelaysStore } from "../stores/relayStore.svelte";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { NostrEvent, PostResult } from "./types";

export interface PostBroadcastServiceDeps {
    writeRelaysStore?: {
        value: string[];
    };
    console?: Console;
}

function createFallbackConsole(): Console {
    return {
        log: () => undefined,
        warn: () => undefined,
        error: () => undefined,
    } as Console;
}

export function resolveBroadcastEvent(
    post: Pick<PostHistoryRecord, "rawEvent">,
): NostrEvent | null {
    const event = post.rawEvent;
    if (!event || typeof event !== "object") {
        return null;
    }

    const candidate = event as Partial<NostrEvent>;
    if (
        typeof candidate.id !== "string" ||
        typeof candidate.pubkey !== "string" ||
        typeof candidate.created_at !== "number" ||
        typeof candidate.kind !== "number" ||
        !Array.isArray(candidate.tags) ||
        typeof candidate.content !== "string" ||
        typeof candidate.sig !== "string"
    ) {
        return null;
    }

    return candidate as NostrEvent;
}

export class PostBroadcastService {
    private readonly deps: Required<PostBroadcastServiceDeps>;

    constructor(deps: PostBroadcastServiceDeps = {}) {
        this.deps = {
            writeRelaysStore: deps.writeRelaysStore ?? writeRelaysStore,
            console:
                deps.console
                ?? (typeof globalThis.console !== "undefined"
                    ? globalThis.console
                    : createFallbackConsole()),
        };
    }

    async broadcast(params: {
        post: PostHistoryRecord;
        rxNostr?: RxNostr;
    }): Promise<PostResult> {
        if (!params.rxNostr) {
            return { success: false, error: "nostr_not_ready" };
        }

        const rxNostr = params.rxNostr;
        const event = resolveBroadcastEvent(params.post);
        if (!event) {
            return { success: false, error: "invalid_event" };
        }

        const writeRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            this.deps.writeRelaysStore.value,
        );
        if (writeRelays.length === 0) {
            return { success: false, error: "no_write_relays" };
        }

        return new Promise((resolve) => {
            let resolved = false;
            let rejectedCount = 0;
            let totalCount = 0;
            let subscription: { unsubscribe?: () => void } | null = null;

            const safeUnsubscribe = () => {
                try {
                    subscription?.unsubscribe?.();
                } catch {
                    // ignore unsubscribe errors
                }
            };

            const safeResolve = (result: PostResult) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                safeUnsubscribe();
                resolve(result);
            };

            subscription = rxNostr
                .send(event, {
                    completeOn: "all-ok",
                    on: { relays: writeRelays },
                })
                .subscribe({
                    next: (packet: any) => {
                        totalCount++;
                        if (packet.ok) {
                            safeResolve({
                                success: true,
                                eventId:
                                    packet.event?.id ??
                                    packet.eventId ??
                                    event.id,
                                acceptedRelays: packet.from
                                    ? [packet.from]
                                    : undefined,
                            });
                            return;
                        }

                        rejectedCount++;
                    },
                    error: (error: unknown) => {
                        this.deps.console.error(
                            "post_broadcast_send_failed",
                            error,
                        );
                        safeResolve({
                            success: false,
                            error: "post_network_error",
                        });
                    },
                    complete: () => {
                        if (totalCount > 0 && rejectedCount === totalCount) {
                            safeResolve({
                                success: false,
                                error: "post_rejected",
                            });
                            return;
                        }

                        safeResolve({
                            success: false,
                            error: "post_timeout",
                        });
                    },
                });
        });
    }
}

export const postBroadcastService = new PostBroadcastService();
