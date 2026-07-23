import { validateEvent, verifyEvent } from "nostr-tools";
import type { RxNostr } from "rx-nostr";
import {
    channelContextCoordinator,
    type ChannelContextCoordinator,
    type ChannelContextCoordinatorHandle,
    type ChannelContextCoordinatorSnapshot,
} from "./channelContextCoordinator";
import { parseKind42ThreadReferences } from "./postHistoryNip10Utils";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    ReplyQuoteService,
    type ReferencedEventFetchTask,
} from "./replyQuoteService";
import type { RelayProfileService } from "./relayProfileService";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    NostrEvent,
    ProfileData,
    RelayConfig,
} from "./types";
import type { ComposerTargetPointer } from "./composerTargetUtils";

export type ComposerTargetResolvePhase =
    | "event-loading"
    | "channel-loading"
    | "profile-loading";

export interface ComposerResolvedTarget {
    event: NostrEvent;
    relayHints: string[];
    authorProfile: ProfileData | null;
    channelContext: ChannelContextState | null;
    channelCreatorPubkey: string | null;
    channelCreatorProfile: ProfileData | null;
    channelQuery: ChannelContextQueryTarget | null;
}

export type ComposerTargetResolveResult =
    | { status: "resolved"; target: ComposerResolvedTarget }
    | {
        status: "error";
        reason:
            | "not-found"
            | "timeout"
            | "network"
            | "mismatch"
            | "invalid-event"
            | "channel-unavailable";
        event?: NostrEvent;
        relayHints?: string[];
        authorProfile?: ProfileData | null;
    }
    | { status: "cancelled" };

export interface ComposerTargetResolveTask {
    promise: Promise<ComposerTargetResolveResult>;
    cancel(): void;
}

interface ComposerTargetResolverDeps {
    replyQuoteService?: Pick<ReplyQuoteService, "fetchReferencedEventTask">;
    channelCoordinator?: Pick<ChannelContextCoordinator, "resolveInternal">;
    verifyEventFn?: (event: NostrEvent) => boolean;
}

export interface ResolveComposerTargetParams {
    pointer: ComposerTargetPointer;
    rxNostr: RxNostr;
    relayConfig?: RelayConfig | null;
    profileService?: Pick<RelayProfileService, "fetchProfileRealtime">;
    onPhase?: (phase: ComposerTargetResolvePhase) => void;
}

function hasVerifiedChannel(snapshot: ChannelContextCoordinatorSnapshot): boolean {
    return snapshot.cache?.resolutionQuality === "verified-root-only"
        || snapshot.cache?.resolutionQuality === "verified-metadata";
}

function resolveFinalChannelSnapshot(
    cached: ChannelContextCoordinatorSnapshot,
    refreshed: Awaited<ChannelContextCoordinatorHandle["refresh"]>,
): ChannelContextCoordinatorSnapshot {
    return hasVerifiedChannel(refreshed.snapshot)
        ? refreshed.snapshot
        : cached;
}

export function createComposerTargetResolver(
    deps: ComposerTargetResolverDeps = {},
) {
    const replyQuoteService = deps.replyQuoteService ?? new ReplyQuoteService();
    const coordinator = deps.channelCoordinator ?? channelContextCoordinator;
    const verifyEventFn = deps.verifyEventFn
        ?? ((event: NostrEvent) =>
            validateEvent(event as never) && verifyEvent(event as never));

    function resolve(params: ResolveComposerTargetParams): ComposerTargetResolveTask {
        let cancelled = false;
        let eventTask: ReferencedEventFetchTask | null = null;
        let channelHandle: ChannelContextCoordinatorHandle | null = null;

        const promise = (async (): Promise<ComposerTargetResolveResult> => {
            params.onPhase?.("event-loading");
            eventTask = replyQuoteService.fetchReferencedEventTask(
                params.pointer.eventId,
                params.pointer.relayHints,
                params.rxNostr,
                params.relayConfig,
            );
            const fetched = await eventTask.promise;
            if (cancelled || fetched.status === "cancelled") {
                return { status: "cancelled" };
            }
            if (fetched.status === "not-found") {
                return { status: "error", reason: "not-found" };
            }
            if (fetched.status === "timeout") {
                return { status: "error", reason: "timeout" };
            }
            if (fetched.status === "error") {
                return { status: "error", reason: "network" };
            }

            const event = fetched.event;
            if (!verifyEventFn(event)) {
                return { status: "error", reason: "invalid-event" };
            }
            if (
                event.id !== params.pointer.eventId
                || (
                    params.pointer.authorHint
                    && event.pubkey !== params.pointer.authorHint
                )
                || (
                    params.pointer.kindHint !== null
                    && event.kind !== params.pointer.kindHint
                )
            ) {
                return { status: "error", reason: "mismatch" };
            }

            const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
                [
                    ...params.pointer.relayHints,
                    ...(fetched.relayUrl ? [fetched.relayUrl] : []),
                ],
                { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
            );
            const authorProfilePromise = params.profileService
                ? params.profileService.fetchProfileRealtime(event.pubkey, {
                    additionalRelays: relayHints,
                }).catch(() => null)
                : Promise.resolve(null);

            let channelContext: ChannelContextState | null = null;
            let channelQuery: ChannelContextQueryTarget | null = null;
            let channelCreatorPubkey: string | null = null;
            if (event.kind === 40 || event.kind === 42) {
                const references = event.kind === 42
                    ? parseKind42ThreadReferences(event)
                    : null;
                const channelEventId = event.kind === 40
                    ? event.id
                    : references?.channelEventId ?? null;
                if (!channelEventId) {
                    const authorProfile = await authorProfilePromise;
                    return {
                        status: "error",
                        reason: "channel-unavailable",
                        event,
                        relayHints,
                        authorProfile,
                    };
                }

                params.onPhase?.("channel-loading");
                channelHandle = coordinator.resolveInternal(
                    {
                        eventId: channelEventId,
                        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
                            [
                                ...(references?.channelRelayHints ?? []),
                                ...relayHints,
                            ],
                        ),
                    },
                    params.rxNostr,
                    params.relayConfig,
                );
                const cached = await channelHandle.cacheReady;
                const refreshed = await channelHandle.refresh;
                if (cancelled) return { status: "cancelled" };
                const snapshot = resolveFinalChannelSnapshot(cached, refreshed);
                if (!hasVerifiedChannel(snapshot)) {
                    const authorProfile = await authorProfilePromise;
                    return {
                        status: "error",
                        reason: "channel-unavailable",
                        event,
                        relayHints,
                        authorProfile,
                    };
                }

                channelContext = snapshot.context;
                channelCreatorPubkey = snapshot.cache?.creatorPubkey ?? null;
                channelQuery = {
                    eventId: channelEventId,
                    relayHints: [...(snapshot.cache?.relayHints ?? [])],
                };
            }

            let authorProfile: ProfileData | null = null;
            let channelCreatorProfile: ProfileData | null = null;
            if (params.profileService) {
                params.onPhase?.("profile-loading");
                [authorProfile, channelCreatorProfile] = await Promise.all([
                    authorProfilePromise,
                    channelCreatorPubkey && channelCreatorPubkey !== event.pubkey
                        ? params.profileService.fetchProfileRealtime(
                            channelCreatorPubkey,
                            {
                                additionalRelays:
                                    channelQuery?.relayHints ?? [],
                            },
                        ).catch(() => null)
                        : Promise.resolve(null),
                ]);
                if (cancelled) return { status: "cancelled" };
                if (channelCreatorPubkey === event.pubkey) {
                    channelCreatorProfile = authorProfile;
                }
            }

            return {
                status: "resolved",
                target: {
                    event,
                    relayHints,
                    authorProfile,
                    channelContext,
                    channelCreatorPubkey,
                    channelCreatorProfile,
                    channelQuery,
                },
            };
        })().catch((): ComposerTargetResolveResult =>
            cancelled
                ? { status: "cancelled" }
                : { status: "error", reason: "network" }
        ).finally(() => {
            channelHandle?.release();
            channelHandle = null;
        });

        return {
            promise,
            cancel() {
                cancelled = true;
                eventTask?.cancel();
                channelHandle?.release();
                channelHandle = null;
            },
        };
    }

    return { resolve };
}

export type ComposerTargetResolver = ReturnType<
    typeof createComposerTargetResolver
>;
