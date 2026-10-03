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
import { getNip65RelayDirectory } from "./nip65RelayDirectory";
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
    channelPictureCacheEligible: boolean;
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
    lookupAuthorWriteRelaysFn?: (pubkeyHex: string) => Promise<string[]>;
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

const BLOCKING_KIND_42_CHANNEL_ISSUES = new Set([
    "missing-channel-root",
    "invalid-channel-root",
    "conflicting-channel-roots",
]);

function hasBlockingKind42ChannelIssue(
    issues: ReturnType<typeof parseKind42ThreadReferences>["issues"],
): boolean {
    return issues.some((issue) => BLOCKING_KIND_42_CHANNEL_ISSUES.has(issue));
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
    const lookupAuthorWriteRelaysFn = deps.lookupAuthorWriteRelaysFn
        ? (pubkeyHex: string, _rxNostr: RxNostr) => deps.lookupAuthorWriteRelaysFn!(pubkeyHex)
        : (pubkeyHex: string, rxNostr: RxNostr) =>
            getNip65RelayDirectory(rxNostr).lookup(pubkeyHex).then((entry) => entry.writeRelays);

    function resolve(params: ResolveComposerTargetParams): ComposerTargetResolveTask {
        let cancelled = false;
        const eventTasks = new Set<ReferencedEventFetchTask>();
        let channelHandle: ChannelContextCoordinatorHandle | null = null;
        let resolveCancellation!: () => void;
        const cancellation = new Promise<void>((resolve) => {
            resolveCancellation = resolve;
        });

        const promise = (async (): Promise<ComposerTargetResolveResult> => {
            params.onPhase?.("event-loading");
            const baseTask = replyQuoteService.fetchReferencedEventTask(
                params.pointer.eventId,
                params.pointer.relayHints,
                params.rxNostr,
                params.relayConfig,
            );
            eventTasks.add(baseTask);
            let authorTask: ReferencedEventFetchTask | null = null;
            let retrievalFinished = false;
            const discoveryTask = params.pointer.authorHint
                ? lookupAuthorWriteRelaysFn(params.pointer.authorHint, params.rxNostr)
                    .then((writeRelays) => {
                        if (cancelled || retrievalFinished || writeRelays.length === 0) {
                            return null;
                        }
                        const explicitHints = new Set(
                            RelayConfigUtils.sanitizeExternalRelayUrls(params.pointer.relayHints),
                        );
                        const authorRelays = RelayConfigUtils.sanitizeExternalRelayUrls(writeRelays)
                            .filter((relay) => !explicitHints.has(relay));
                        if (authorRelays.length === 0) return null;
                        authorTask = replyQuoteService.fetchReferencedEventTask(
                            params.pointer.eventId,
                            [],
                            params.rxNostr,
                            params.relayConfig,
                            5000,
                            authorRelays,
                        );
                        eventTasks.add(authorTask);
                        return authorTask;
                    })
                    .catch(() => null)
                : Promise.resolve(null);

            const fetchedOrCancelled = await Promise.race([
                new Promise<{ state: "result"; result: Awaited<typeof baseTask.promise> }>((resolve) => {
                    let baseResult: Awaited<typeof baseTask.promise> | null = null;
                    let authorResult: Awaited<typeof baseTask.promise> | null = null;
                    let authorSearchDone = !params.pointer.authorHint;
                    let settled = false;
                    const finish = (
                        result: Awaited<typeof baseTask.promise>,
                        winner: ReferencedEventFetchTask,
                    ) => {
                        if (settled) return;
                        settled = true;
                        retrievalFinished = true;
                        for (const task of eventTasks) {
                            if (task !== winner) task.cancel();
                        }
                        resolve({ state: "result", result });
                    };
                    const maybeFinish = () => {
                        if (!baseResult || !authorSearchDone) return;
                        if (authorResult?.status === "found") {
                            if (authorTask) finish(authorResult, authorTask);
                            return;
                        }
                        if (baseResult.status === "found") {
                            finish(baseResult, baseTask);
                            return;
                        }
                        const result = baseResult.status !== "not-found"
                            ? baseResult
                            : authorResult ?? baseResult;
                        finish(
                            result,
                            authorTask && result === authorResult ? authorTask : baseTask,
                        );
                    };

                    void baseTask.promise.then((result) => {
                        if (cancelled) return;
                        baseResult = result;
                        if (result.status === "found") finish(result, baseTask);
                        else maybeFinish();
                    }).catch(() => {
                        if (cancelled) return;
                        baseResult = { status: "error" };
                        maybeFinish();
                    });
                    void discoveryTask.then((discoveredTask) => {
                        if (cancelled || settled) return;
                        if (!discoveredTask) {
                            authorSearchDone = true;
                            maybeFinish();
                            return;
                        }
                        void discoveredTask.promise.then((result) => {
                            if (cancelled) return;
                            authorResult = result;
                            authorSearchDone = true;
                            if (result.status === "found" && authorTask) finish(result, authorTask);
                            else maybeFinish();
                        }).catch(() => {
                            if (cancelled) return;
                            authorResult = { status: "error" };
                            authorSearchDone = true;
                            maybeFinish();
                        });
                    });
                }),
                cancellation.then(() => ({ state: "cancelled" as const })),
            ]);
            if (fetchedOrCancelled.state === "cancelled") return { status: "cancelled" };
            const fetched = fetchedOrCancelled.result;
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
            let channelPictureCacheEligible = false;
            if (event.kind === 40 || event.kind === 42) {
                const references = event.kind === 42
                    ? parseKind42ThreadReferences(event)
                    : null;
                const channelEventId = event.kind === 40
                    ? event.id
                    : references?.channelEventId ?? null;
                if (
                    !channelEventId
                    || (
                        event.kind === 42
                        && references
                        && hasBlockingKind42ChannelIssue(references.issues)
                    )
                ) {
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
                channelPictureCacheEligible =
                    snapshot.cache?.resolutionQuality === "verified-metadata";
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
                    channelPictureCacheEligible,
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
                resolveCancellation();
                for (const eventTask of eventTasks) eventTask.cancel();
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
