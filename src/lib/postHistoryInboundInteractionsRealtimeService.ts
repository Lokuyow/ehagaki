import { NOTIFICATION_KINDS } from './notification';
import { notificationRepository, type NotificationRepository } from './storage/notificationRepository';
import { createRxForwardReq, type RxNostr } from "rx-nostr";
import { classifyPostHistoryInboundInteraction } from "./postHistoryInboundInteractionClassifier";
import { matchesReactionReferenceTarget, parseReactionReference } from "./reactionReference";
import { resolvePostHistoryRelayUrls } from "./postHistoryRelayResolver";
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
import { usePostHistoryRelayEvents } from "./postHistoryRawEventVerification";
import { ehagakiDb } from "./storage/ehagakiDb";
import { getPostHistoryChildWriteGeneration } from "./storage/postHistoryLocalWriteScope";

export const POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_RELAY_LIMIT = 6;
export const POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_SINCE_OVERLAP_SECONDS = 60;
/** Maximum distinct events waiting per subscription, excluding the active packet. */
export const POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_QUEUE_LIMIT = 32;

export interface PostHistoryInboundInteractionsRealtimeSubscribeRequest {
    includeNotifications?: boolean;
    isActive?: () => boolean;
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
    /** Number of distinct events waiting to be processed. */
    pendingCount: () => number;
}

export interface PostHistoryInboundInteractionsRealtimeServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "getExistingEventIdsForPubkey" | "getByEventId">;
    postHistoryChildInteractionsRepository?: Pick<PostHistoryChildInteractionsRepository, "upsertChildInteractions">;
    notificationRepository?: Pick<NotificationRepository, "upsert">;
    getChildWriteGeneration?: () => Promise<number>;
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

interface PendingInboundPacket {
    event: NostrEvent;
    relayUrls: string[];
    expectedChildGeneration: Promise<number>;
}

export class PostHistoryInboundInteractionsRealtimeService {
    private postHistoryRepository: Pick<PostHistoryRepository, "getExistingEventIdsForPubkey" | "getByEventId">;
    private postHistoryChildInteractionsRepository: Pick<PostHistoryChildInteractionsRepository, "upsertChildInteractions">;
    private notificationRepository: Pick<NotificationRepository, "upsert">;
    private getChildWriteGeneration: () => Promise<number>;
    private console: Pick<Console, "warn" | "error">;
    private now: () => number;

    constructor(deps: PostHistoryInboundInteractionsRealtimeServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.postHistoryChildInteractionsRepository =
            deps.postHistoryChildInteractionsRepository ?? postHistoryChildInteractionsRepository;
        this.notificationRepository = deps.notificationRepository ?? notificationRepository;
        this.getChildWriteGeneration = deps.getChildWriteGeneration
            ?? (() => getPostHistoryChildWriteGeneration(ehagakiDb));
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
        const isActive = () => active && params.isActive?.() !== false;
        let subscription: SubscriptionLike | undefined;
        let chain: Promise<void> = Promise.resolve();
        let draining = false;
        const pendingByEventId = new Map<string, PendingInboundPacket>();
        const relayUrls = resolvePostHistoryRelayUrls(
            params.relayConfig,
            normalizeRelayLimit(params.relayLimit),
        );
        const subscribedSince = Math.max(
            0,
            Math.floor(this.now() / 1000) - POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_SINCE_OVERLAP_SECONDS,
        );
        const scheduleDrain = () => {
            if (draining) return;
            draining = true;
            chain = chain.then(async () => {
                try {
                    for (const [eventId, item] of pendingByEventId) {
                        if (!isActive()) {
                            pendingByEventId.clear();
                            return;
                        }
                        pendingByEventId.delete(eventId);
                        try {
                            await this.processPacket(item, params, isActive);
                        } catch (error) {
                            this.console.error(
                                "post_history_inbound_interactions_realtime_packet_error",
                                error,
                            );
                        }
                    }
                } finally {
                    draining = false;
                }
            });
        };
        const enqueuePacket = (packet: { event?: NostrEvent; from?: string }) => {
            if (!isActive()) return;
            const event = packet.event;
            if (!event?.id) return;
            const existing = pendingByEventId.get(event.id);
            // Keep accepted events in arrival order. Drop new IDs at capacity
            // before starting any DB work; a later receipt may be admitted.
            if (!existing && pendingByEventId.size >= POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_QUEUE_LIMIT) {
                return;
            }
            const relayUrls = typeof packet.from === "string"
                ? RelayConfigUtils.sanitizeExternalRelayUrls(
                    [...(existing?.relayUrls ?? []), packet.from],
                    { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
                )
                : existing?.relayUrls ?? [];
            if (existing) {
                // Same event from another relay. Keep the generation captured at
                // the first receipt so a later history clear cannot accept it.
                existing.event = event;
                existing.relayUrls = relayUrls;
                return;
            }

            // Start the generation read before this packet waits to be processed.
            // A history clear that commits after receipt must not become the
            // generation used to accept this packet.
            const expectedChildGeneration = this.getChildWriteGeneration();
            void expectedChildGeneration.catch(() => undefined);
            pendingByEventId.set(event.id, { event, relayUrls, expectedChildGeneration });
            scheduleDrain();
        };

        try {
            if (typeof (rxNostr as { use?: unknown }).use !== "function") {
                active = false;
                return {
                    stop: () => undefined,
                    waitForIdle: () => chain,
                    pendingCount: () => 0,
                };
            }

            const rxReq = createRxForwardReq();
            subscription = usePostHistoryRelayEvents(rxNostr, rxReq, {
                on: relayUrls.length > 0
                    ? { relays: relayUrls }
                    : { defaultReadRelays: true },
            }).subscribe({
                next: (packet: { event?: NostrEvent; from?: string }) => {
                    enqueuePacket(packet);
                },
                error: (error: unknown) => {
                    this.console.error("post_history_inbound_interactions_realtime_subscription_error", error);
                },
            });

            rxReq.emit([{
                kinds: params.includeNotifications === false ? [1, 42, 1111, 7] : [...NOTIFICATION_KINDS],
                "#p": [params.ownerPubkeyHex],
                since: subscribedSince,
            }, {
                kinds: [1111],
                "#P": [params.ownerPubkeyHex],
                since: subscribedSince,
            }]);
        } catch (error) {
            active = false;
            pendingByEventId.clear();
            subscription?.unsubscribe?.();
            subscription = undefined;
            this.console.error("post_history_inbound_interactions_realtime_request_error", error);
        }

        return {
            stop: () => {
                // This flag belongs to this subscription only. A later subscribe()
                // has its own queue and must still be able to write.
                active = false;
                pendingByEventId.clear();
                subscription?.unsubscribe?.();
                subscription = undefined;
            },
            waitForIdle: () => chain,
            pendingCount: () => pendingByEventId.size,
        };
    }

    private async processPacket(
        packet: PendingInboundPacket,
        params: PostHistoryInboundInteractionsRealtimeSubscribeRequest,
        isActive: () => boolean,
    ): Promise<void> {
        if (!isActive()) return;
        const expectedChildGeneration = await packet.expectedChildGeneration;
        const { event, relayUrls } = packet;
        if (!isActive()) {
            return;
        }

        if (params.includeNotifications !== false) {
            await this.notificationRepository.upsert(params.ownerPubkeyHex, [{ event, relayUrls }], isActive);
        }
        if (!isActive()) return;
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

            const parent = await this.postHistoryRepository.getByEventId(preliminary.targetEventId);
            const reference = parseReactionReference(event).reference;
            if (!isActive() || !parent || !reference || !matchesReactionReferenceTarget(reference, {
                eventId: parent.eventId, targetAuthorPubkey: params.ownerPubkeyHex, targetKind: parent.kind,
            })) return;

            const result = await this.postHistoryChildInteractionsRepository.upsertChildInteractions({
                parentEventId: preliminary.targetEventId,
                events: [{
                    event,
                    ...(relayUrls.length > 0 ? { relayUrls } : {}),
                }],
                fetchedAt: this.now(),
                expectedChildGeneration,
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
                ...(relayUrls.length > 0 ? { relayUrls } : {}),
                expectedChildGeneration,
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
        if (!isActive()) return;
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

        const result = await this.postHistoryChildInteractionsRepository.upsertChildInteractions({
            parentEventId: classification.parentEventId,
            events: [{
                event,
                ...(relayUrls.length > 0 ? { relayUrls } : {}),
            }],
            fetchedAt: this.now(),
            expectedChildGeneration,
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

}

export const postHistoryInboundInteractionsRealtimeService =
    new PostHistoryInboundInteractionsRealtimeService();
