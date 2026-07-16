import { createRxForwardReq, type RxNostr } from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { classifyPostHistoryInboundInteraction } from "./postHistoryInboundInteractionClassifier";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "./postHistoryInboundReplyReconciliationService";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    buildPostHistoryDirectReplyParentContext,
    validatePostHistoryDirectReplyRelation,
} from "./postHistoryDirectReplyRelationUtils";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_RELAY_LIMIT = 6;
export const POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_SINCE_OVERLAP_SECONDS = 60;

export interface PostHistoryInboundInteractionsRealtimeSubscribeRequest {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    relayLimit?: number;
    onSavedInboundInteractions?: (parentEventIds: string[]) => void | Promise<void>;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
}

export interface PostHistoryInboundInteractionsRealtimeSubscription {
    stop: () => void;
    waitForIdle: () => Promise<void>;
}

export interface PostHistoryInboundInteractionsRealtimeServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "getExistingEventIdsForPubkey" | "getByEventId">;
    postHistoryChildInteractionsRepository?: Pick<PostHistoryChildInteractionsRepository, "upsertChildInteractions">;
    console?: Pick<Console, "warn" | "error">;
    now?: () => number;
}

type SubscriptionLike = {
    unsubscribe?: () => void;
};

function normalizeRelayLimit(relayLimit: number | undefined): number {
    return Number.isFinite(relayLimit)
        ? Math.max(1, Math.trunc(relayLimit ?? POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_RELAY_LIMIT))
        : POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_RELAY_LIMIT;
}

export class PostHistoryInboundInteractionsRealtimeService {
    private postHistoryRepository: Pick<PostHistoryRepository, "getExistingEventIdsForPubkey" | "getByEventId">;
    private postHistoryChildInteractionsRepository: Pick<PostHistoryChildInteractionsRepository, "upsertChildInteractions">;
    private console: Pick<Console, "warn" | "error">;
    private now: () => number;

    constructor(deps: PostHistoryInboundInteractionsRealtimeServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.postHistoryChildInteractionsRepository =
            deps.postHistoryChildInteractionsRepository ?? postHistoryChildInteractionsRepository;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { warn: () => undefined, error: () => undefined });
        this.now = deps.now ?? Date.now;
    }

    subscribe(
        rxNostr: RxNostr,
        params: PostHistoryInboundInteractionsRealtimeSubscribeRequest,
    ): PostHistoryInboundInteractionsRealtimeSubscription {
        let active = true;
        let subscription: SubscriptionLike | undefined;
        let workQueue: Promise<void> = Promise.resolve();
        const relayUrls = this.resolveRelayUrls(
            params.relayConfig,
            normalizeRelayLimit(params.relayLimit),
        );
        const subscribedSince = Math.max(
            0,
            Math.floor(this.now() / 1000) - POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_SINCE_OVERLAP_SECONDS,
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
                            this.console.error("post_history_inbound_interactions_realtime_packet_error", error);
                        });
                },
                error: (error: unknown) => {
                    this.console.error("post_history_inbound_interactions_realtime_subscription_error", error);
                },
            });

            rxReq.emit({
                kinds: [1, 7, 42],
                "#p": [params.ownerPubkeyHex],
                since: subscribedSince,
            } as never);
        } catch (error) {
            active = false;
            subscription?.unsubscribe?.();
            subscription = undefined;
            this.console.error("post_history_inbound_interactions_realtime_request_error", error);
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
        params: PostHistoryInboundInteractionsRealtimeSubscribeRequest,
        isActive: () => boolean,
    ): Promise<void> {
        const event = packet.event;
        if (!isActive() || !event?.id) {
            return;
        }

        const preliminary = classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: params.ownerPubkeyHex,
            ownerPostEventIds: new Set(),
        });
        if (
            preliminary.type !== "direct-reply-candidate"
            && preliminary.type !== "reaction"
        ) {
            return;
        }

        if (preliminary.type === "reaction") {
            if (!preliminary.targetEventId) {
                return;
            }

            const ownerPostEventIds = new Set(
                await this.postHistoryRepository.getExistingEventIdsForPubkey({
                    pubkeyHex: params.ownerPubkeyHex,
                    eventIds: [preliminary.targetEventId],
                }),
            );
            if (!isActive() || !ownerPostEventIds.has(preliminary.targetEventId)) {
                return;
            }

            const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
                typeof packet.from === "string" ? [packet.from] : [],
                { limit: 1 },
            )[0];
            const result = await this.postHistoryChildInteractionsRepository.upsertChildInteractions({
                parentEventId: preliminary.targetEventId,
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
                await params.onSavedInboundInteractions?.([preliminary.targetEventId]);
            } catch (error) {
                this.console.warn("post_history_inbound_interactions_realtime_saved_callback_error", error);
            }
            return;
        }

        if (!preliminary.parentEventId) {
            return;
        }

        if (params.reconcileDirectReplyCandidates) {
            await params.reconcileDirectReplyCandidates([{
                classification: preliminary,
                event,
                ...(packet.from ? { relayUrls: [packet.from] } : {}),
            }]);
            return;
        }

        const ownerPostEventIds = new Set(
            await this.postHistoryRepository.getExistingEventIdsForPubkey({
                pubkeyHex: params.ownerPubkeyHex,
                eventIds: [preliminary.parentEventId],
            }),
        );
        if (!isActive()) {
            return;
        }

        const classification = classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: params.ownerPubkeyHex,
            ownerPostEventIds,
        });
        if (classification.type !== "direct-reply" || !classification.parentEventId) {
            return;
        }

        const parentRecord = await this.postHistoryRepository.getByEventId(
            classification.parentEventId,
        );
        const parentContext = parentRecord
            ? buildPostHistoryDirectReplyParentContext({
                event: {
                    id: parentRecord.eventId,
                    kind: parentRecord.kind,
                    tags: parentRecord.tags,
                    created_at: parentRecord.createdAt,
                },
                relayHints: [
                    ...parentRecord.relayHints,
                    ...parentRecord.acceptedRelays,
                    ...(parentRecord.fetchedRelays ?? []),
                ],
            })
            : null;
        if (
            !parentContext
            || !validatePostHistoryDirectReplyRelation({ child: event, parent: parentContext }).valid
        ) {
            return;
        }

        const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof packet.from === "string" ? [packet.from] : [],
            { limit: 1 },
        )[0];
        const result = await this.postHistoryChildInteractionsRepository.upsertChildInteractions({
            parentEventId: classification.parentEventId,
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
            await params.onSavedInboundInteractions?.([classification.parentEventId]);
        } catch (error) {
            this.console.warn("post_history_inbound_interactions_realtime_saved_callback_error", error);
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

export const postHistoryInboundInteractionsRealtimeService =
    new PostHistoryInboundInteractionsRealtimeService();
