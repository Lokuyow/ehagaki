import type { RxNostr } from "rx-nostr";
import {
    channelContextCoordinator,
    type ChannelContextCoordinator,
    type ChannelContextCoordinatorRefreshResult,
    type ChannelContextCoordinatorSnapshot,
} from "./channelContextCoordinator";
import {
    buildEffectiveChannelContext,
    prepareExternalChannelContext,
    type ChannelContextExternalSource,
    type ChannelContextProvenance,
} from "./channelContextRuntime";
import {
    decodeDraftChannelContext,
} from "./draftChannelContext";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    DraftChannelData,
    RelayConfig,
} from "./types";
import type {
    ChannelContextRuntimeQuality,
    ChannelContextRuntimeState,
} from "./channelContextRuntime";

export interface ChannelContextApplyControllerDeps {
    getCurrentChannelContext(): ChannelContextState | null;
    setChannelContext(
        context: ChannelContextState,
        provenance: ChannelContextProvenance | null,
        ownerToken: symbol,
    ): void;
    setRuntimeState?(state: ChannelContextRuntimeState): void;
    getChannelContextOwnerToken(): symbol | null;
    clearChannelContext(): void;
    coordinator?: ChannelContextCoordinator;
    logger?: Pick<Console, "error">;
}

export interface ApplyExternalChannelContextParams {
    query: ChannelContextQueryTarget;
    source: ChannelContextExternalSource;
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
}

export interface ApplyDraftChannelContextParams {
    channelData: DraftChannelData;
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
}

export interface ApplyPostHistoryChannelContextParams {
    query: ChannelContextQueryTarget;
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
}

export interface ChannelContextApplyHandle {
    cacheReady: Promise<ChannelContextCoordinatorSnapshot>;
    refresh: Promise<ChannelContextCoordinatorRefreshResult>;
    release(): void;
}

export interface ChannelContextApplyController {
    applyExternal(params: ApplyExternalChannelContextParams): ChannelContextApplyHandle;
    applyDraft(params: ApplyDraftChannelContextParams): ChannelContextApplyHandle;
    applyPostHistory(
        params: ApplyPostHistoryChannelContextParams,
    ): ChannelContextApplyHandle;
    clear(): void;
    dispose(): void;
}

export function createChannelContextApplyController(
    deps: ChannelContextApplyControllerDeps,
): ChannelContextApplyController {
    const coordinator = deps.coordinator ?? channelContextCoordinator;
    const logger = deps.logger ?? console;
    let generation = 0;
    let currentRelease: (() => void) | null = null;

    const releaseCurrent = () => {
        currentRelease?.();
        currentRelease = null;
    };

    const getSnapshotQuality = (
        snapshot: ChannelContextCoordinatorSnapshot,
        fallback: ChannelContextRuntimeQuality | null,
    ): ChannelContextRuntimeQuality | null =>
        snapshot.cache?.resolutionQuality ?? fallback;

    const hasResolvedPresentation = (
        snapshot: ChannelContextCoordinatorSnapshot,
        quality: ChannelContextRuntimeQuality | null,
        provenance: ChannelContextProvenance | null,
    ): boolean =>
        quality === "verified-metadata"
        || (() => {
            const effective = buildEffectiveChannelContext(
                snapshot.context,
                provenance,
            );
            return !!effective.name || !!effective.about || !!effective.picture;
        })();

    const applyPrepared = ({
        coordinatorQuery,
        provenance,
        ownerLabel,
        initialQuality,
        rxNostr,
        relayConfig,
    }: {
        coordinatorQuery: ChannelContextQueryTarget;
        provenance: ChannelContextProvenance | null;
        ownerLabel: string;
        initialQuality: ChannelContextRuntimeQuality | null;
        rxNostr?: RxNostr;
        relayConfig?: RelayConfig | null;
    }): ChannelContextApplyHandle => {
        generation += 1;
        const applyGeneration = generation;
        releaseCurrent();

        const ownerToken = Symbol(`${ownerLabel}:${coordinatorQuery.eventId}`);
        const resolution = coordinator.resolveInternal(
            coordinatorQuery,
            rxNostr,
            relayConfig,
        );
        let active = true;
        const isCurrent = () => active
            && generation === applyGeneration
            && deps.getCurrentChannelContext()?.eventId === coordinatorQuery.eventId
            && deps.getChannelContextOwnerToken() === ownerToken;
        const setRuntime = (state: ChannelContextRuntimeState) => {
            if (isCurrent()) deps.setRuntimeState?.(state);
        };
        const applySnapshot = (snapshot: ChannelContextCoordinatorSnapshot) => {
            if (!isCurrent()) return;
            deps.setChannelContext(snapshot.context, provenance, ownerToken);
        };

        deps.setChannelContext(resolution.initial.context, provenance, ownerToken);
        const initialSnapshotQuality = getSnapshotQuality(
            resolution.initial,
            initialQuality,
        );
        setRuntime({
            phase: hasResolvedPresentation(
                resolution.initial,
                initialSnapshotQuality,
                provenance,
            )
                ? "refreshing"
                : "loading",
            quality: initialSnapshotQuality,
            source: resolution.initial.source,
        });

        const release = () => {
            if (!active) return;
            active = false;
            resolution.release();
            if (generation === applyGeneration) {
                currentRelease = null;
            }
        };
        currentRelease = release;

        const cacheReady = resolution.cacheReady
            .then((snapshot) => {
                applySnapshot(snapshot);
                const quality = getSnapshotQuality(snapshot, initialQuality);
                setRuntime({
                    phase: hasResolvedPresentation(snapshot, quality, provenance)
                        ? "refreshing"
                        : "loading",
                    quality,
                    source: snapshot.source,
                });
                return snapshot;
            })
            .catch((error) => {
                logger.error("チャンネルキャッシュの適用に失敗しました:", error);
                return resolution.initial;
            });
        const refresh = resolution.refresh
            .then((result) => {
                if (
                    result.status === "updated"
                    || (result.status === "failed" && result.snapshot.source === "network")
                ) {
                    applySnapshot(result.snapshot);
                }
                if (result.status !== "aborted") {
                    const quality = getSnapshotQuality(
                        result.snapshot,
                        initialQuality,
                    );
                    const hasPresentation = hasResolvedPresentation(
                        result.snapshot,
                        quality,
                        provenance,
                    );
                    setRuntime({
                        phase: result.status === "failed"
                            ? hasPresentation
                                ? "refresh-failed"
                                : "unavailable"
                            : hasPresentation
                                ? "ready"
                                : "unavailable",
                        quality,
                        source: result.snapshot.source,
                    });
                }
                return result;
            })
            .catch((error) => {
                logger.error("チャンネルのバックグラウンド更新に失敗しました:", error);
                const quality = getSnapshotQuality(
                    resolution.initial,
                    initialQuality,
                );
                setRuntime({
                    phase: hasResolvedPresentation(
                        resolution.initial,
                        quality,
                        provenance,
                    )
                        ? "refresh-failed"
                        : "unavailable",
                    quality,
                    source: resolution.initial.source,
                });
                return {
                    status: "failed" as const,
                    snapshot: resolution.initial,
                };
            });

        return { cacheReady, refresh, release };
    };

    return {
        applyExternal({ query, source, rxNostr, relayConfig }) {
            const { coordinatorQuery, provenance } = prepareExternalChannelContext(
                query,
                source,
            );
            return applyPrepared({
                coordinatorQuery,
                provenance,
                ownerLabel: "external-channel",
                initialQuality: null,
                rxNostr,
                relayConfig,
            });
        },

        applyDraft({ channelData, rxNostr, relayConfig }) {
            const { query, provenance } = decodeDraftChannelContext(channelData);
            return applyPrepared({
                coordinatorQuery: query,
                provenance,
                ownerLabel: "draft-channel",
                initialQuality: "legacy-seed",
                rxNostr,
                relayConfig,
            });
        },

        applyPostHistory({ query, rxNostr, relayConfig }) {
            return applyPrepared({
                coordinatorQuery: query,
                provenance: null,
                ownerLabel: "post-history-channel",
                initialQuality: null,
                rxNostr,
                relayConfig,
            });
        },

        clear() {
            generation += 1;
            releaseCurrent();
            deps.clearChannelContext();
        },

        dispose() {
            generation += 1;
            releaseCurrent();
        },
    };
}
