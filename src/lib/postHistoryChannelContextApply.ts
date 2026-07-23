import type { RxNostr } from "rx-nostr";
import {
    channelContextCoordinator,
    type ChannelContextCoordinator,
} from "./channelContextCoordinator";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    RelayConfig,
} from "./types";
import type {
    ChannelContextRuntimeQuality,
    ChannelContextRuntimeState,
} from "./channelContextRuntime";

export interface StartPostHistoryChannelContextApplyParams {
    channelContextQuery: ChannelContextQueryTarget;
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    getCurrentChannelContext(): ChannelContextState | null;
    setChannelContext(context: ChannelContextState): void;
    setRuntimeState?(state: ChannelContextRuntimeState): void;
    coordinator?: ChannelContextCoordinator;
    logger?: Pick<Console, "error">;
}

export interface PostHistoryChannelContextApplyHandle {
    release(): void;
}

export function startPostHistoryChannelContextApply({
    channelContextQuery,
    rxNostr,
    relayConfig,
    getCurrentChannelContext,
    setChannelContext,
    setRuntimeState,
    coordinator = channelContextCoordinator,
    logger = console,
}: StartPostHistoryChannelContextApplyParams): PostHistoryChannelContextApplyHandle {
    const handle = coordinator.resolveInternal(
        channelContextQuery,
        rxNostr,
        relayConfig,
    );
    const eventId = channelContextQuery.eventId;
    let active = true;
    const getQuality = (
        snapshot: typeof handle.initial,
    ): ChannelContextRuntimeQuality | null =>
        snapshot.cache?.resolutionQuality ?? null;
    const hasPresentation = (snapshot: typeof handle.initial): boolean =>
        getQuality(snapshot) === "verified-metadata"
        || !!snapshot.context.name
        || !!snapshot.context.about
        || !!snapshot.context.picture;
    const setRuntimeIfCurrent = (state: ChannelContextRuntimeState) => {
        if (active && getCurrentChannelContext()?.eventId === eventId) {
            setRuntimeState?.(state);
        }
    };
    const applyIfCurrent = (context: ChannelContextState) => {
        if (active && getCurrentChannelContext()?.eventId === eventId) {
            setChannelContext(context);
        }
    };

    setChannelContext(handle.initial.context);
    setRuntimeIfCurrent({
        phase: hasPresentation(handle.initial) ? "refreshing" : "loading",
        quality: getQuality(handle.initial),
        source: handle.initial.source,
    });

    void handle.cacheReady
        .then((snapshot) => {
            applyIfCurrent(snapshot.context);
            setRuntimeIfCurrent({
                phase: hasPresentation(snapshot) ? "refreshing" : "loading",
                quality: getQuality(snapshot),
                source: snapshot.source,
            });
        })
        .catch((error) => {
            logger.error("投稿履歴のチャンネルキャッシュ適用に失敗しました:", error);
        });
    void handle.refresh
        .then((result) => {
            if (
                result.status === "updated"
                || (result.status === "failed" && result.snapshot.source === "network")
            ) {
                applyIfCurrent(result.snapshot.context);
            }
            if (result.status !== "aborted") {
                const presentationAvailable = hasPresentation(result.snapshot);
                setRuntimeIfCurrent({
                    phase: result.status === "failed"
                        ? presentationAvailable
                            ? "refresh-failed"
                            : "unavailable"
                        : presentationAvailable
                            ? "ready"
                            : "unavailable",
                    quality: getQuality(result.snapshot),
                    source: result.snapshot.source,
                });
            }
        })
        .catch((error) => {
            logger.error("投稿履歴のチャンネル更新に失敗しました:", error);
        });

    return {
        release: () => {
            if (!active) return;
            active = false;
            handle.release();
        },
    };
}
