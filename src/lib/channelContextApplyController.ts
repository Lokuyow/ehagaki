import type { RxNostr } from "rx-nostr";
import {
    channelContextCoordinator,
    type ChannelContextCoordinator,
    type ChannelContextCoordinatorRefreshResult,
    type ChannelContextCoordinatorSnapshot,
} from "./channelContextCoordinator";
import {
    prepareExternalChannelContext,
    type ChannelContextExternalSource,
    type ChannelContextProvenance,
} from "./channelContextRuntime";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    RelayConfig,
} from "./types";

export interface ChannelContextApplyControllerDeps {
    getCurrentChannelContext(): ChannelContextState | null;
    setChannelContext(
        context: ChannelContextState,
        provenance: ChannelContextProvenance,
        ownerToken: symbol,
    ): void;
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

export interface ChannelContextApplyHandle {
    cacheReady: Promise<ChannelContextCoordinatorSnapshot>;
    refresh: Promise<ChannelContextCoordinatorRefreshResult>;
    release(): void;
}

export interface ChannelContextApplyController {
    applyExternal(params: ApplyExternalChannelContextParams): ChannelContextApplyHandle;
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

    return {
        applyExternal({ query, source, rxNostr, relayConfig }) {
            generation += 1;
            const applyGeneration = generation;
            releaseCurrent();

            const { coordinatorQuery, provenance } = prepareExternalChannelContext(
                query,
                source,
            );
            const ownerToken = Symbol(`external-channel:${coordinatorQuery.eventId}`);
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
            const applySnapshot = (snapshot: ChannelContextCoordinatorSnapshot) => {
                if (!isCurrent()) return;
                deps.setChannelContext(snapshot.context, provenance, ownerToken);
            };

            deps.setChannelContext(resolution.initial.context, provenance, ownerToken);

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
                    return snapshot;
                })
                .catch((error) => {
                    logger.error("外部チャンネルキャッシュの適用に失敗しました:", error);
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
                    return result;
                })
                .catch((error) => {
                    logger.error("外部チャンネルのバックグラウンド更新に失敗しました:", error);
                    return {
                        status: "failed" as const,
                        snapshot: resolution.initial,
                    };
                });

            return { cacheReady, refresh, release };
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
