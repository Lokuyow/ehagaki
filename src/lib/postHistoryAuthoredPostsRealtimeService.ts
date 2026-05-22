import { createRxForwardReq, type RxNostr } from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_AUTHORED_POSTS_REALTIME_RELAY_LIMIT = 6;
export const POST_HISTORY_AUTHORED_POSTS_REALTIME_SINCE_OVERLAP_SECONDS = 60;

export interface PostHistoryAuthoredPostsRealtimeSubscribeRequest {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    relayLimit?: number;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
}

export interface PostHistoryAuthoredPostsRealtimeSubscription {
    stop: () => void;
    waitForIdle: () => Promise<void>;
}

export interface PostHistoryAuthoredPostsRealtimeServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    console?: Pick<Console, "warn" | "error">;
    now?: () => number;
}

type SubscriptionLike = {
    unsubscribe?: () => void;
};

function normalizeRelayLimit(relayLimit: number | undefined): number {
    return Number.isFinite(relayLimit)
        ? Math.max(1, Math.trunc(relayLimit ?? POST_HISTORY_AUTHORED_POSTS_REALTIME_RELAY_LIMIT))
        : POST_HISTORY_AUTHORED_POSTS_REALTIME_RELAY_LIMIT;
}

export class PostHistoryAuthoredPostsRealtimeService {
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    private console: Pick<Console, "warn" | "error">;
    private now: () => number;

    constructor(deps: PostHistoryAuthoredPostsRealtimeServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { warn: () => undefined, error: () => undefined });
        this.now = deps.now ?? Date.now;
    }

    subscribe(
        rxNostr: RxNostr,
        params: PostHistoryAuthoredPostsRealtimeSubscribeRequest,
    ): PostHistoryAuthoredPostsRealtimeSubscription {
        let active = true;
        let subscription: SubscriptionLike | undefined;
        let workQueue: Promise<void> = Promise.resolve();
        const relayUrls = this.resolveRelayUrls(
            params.relayConfig,
            normalizeRelayLimit(params.relayLimit),
        );
        const subscribedSince = Math.max(
            0,
            Math.floor(this.now() / 1000) - POST_HISTORY_AUTHORED_POSTS_REALTIME_SINCE_OVERLAP_SECONDS,
        );

        try {
            if (typeof (rxNostr as { use?: unknown }).use !== "function") {
                active = false;
                return {
                    stop: () => undefined,
                    waitForIdle: () => workQueue,
                };
            }

            const rxReq = createRxForwardReq();
            subscription = rxNostr.use(rxReq, {
                on: relayUrls.length > 0
                    ? { relays: relayUrls }
                    : { defaultReadRelays: true },
            }).subscribe({
                next: (packet: { event?: NostrEvent; from?: string }) => {
                    workQueue = workQueue
                        .then(() => this.processPacket(packet, params, () => active))
                        .catch((error) => {
                            this.console.error("post_history_authored_posts_realtime_packet_error", error);
                        });
                },
                error: (error: unknown) => {
                    this.console.error("post_history_authored_posts_realtime_subscription_error", error);
                },
            });

            rxReq.emit({
                authors: [params.ownerPubkeyHex],
                kinds: [1, 42],
                since: subscribedSince,
            } as never);
        } catch (error) {
            active = false;
            subscription?.unsubscribe?.();
            subscription = undefined;
            this.console.error("post_history_authored_posts_realtime_request_error", error);
        }

        return {
            stop: () => {
                active = false;
                subscription?.unsubscribe?.();
                subscription = undefined;
            },
            waitForIdle: () => workQueue,
        };
    }

    private async processPacket(
        packet: { event?: NostrEvent; from?: string },
        params: PostHistoryAuthoredPostsRealtimeSubscribeRequest,
        isActive: () => boolean,
    ): Promise<void> {
        const event = packet.event;
        if (
            !isActive()
            || !event?.id
            || event.pubkey !== params.ownerPubkeyHex
            || (event.kind !== 1 && event.kind !== 42)
        ) {
            return;
        }

        const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof packet.from === "string" ? [packet.from] : [],
            { limit: 1 },
        )[0];
        const result = await this.postHistoryRepository.upsertFetchedEvents({
            events: [{
                event,
                ...(relayUrl ? { relayUrls: [relayUrl] } : {}),
            }],
            fetchedAt: this.now(),
        });
        if (
            !isActive()
            || result.insertedCount + result.updatedCount + result.unchangedCount === 0
        ) {
            return;
        }

        try {
            await params.onSavedSelfPosts?.([event.id]);
        } catch (error) {
            this.console.warn("post_history_authored_posts_realtime_saved_callback_error", error);
        }
    }

    private resolveRelayUrls(relayConfig: RelayConfig | null | undefined, relayLimit: number): string[] {
        const configuredRelays = relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
            : [];
        const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(configuredRelays, {
            limit: relayLimit,
        });

        return relayUrls.length > 0
            ? relayUrls
            : RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS, { limit: relayLimit });
    }
}

export const postHistoryAuthoredPostsRealtimeService =
    new PostHistoryAuthoredPostsRealtimeService();
