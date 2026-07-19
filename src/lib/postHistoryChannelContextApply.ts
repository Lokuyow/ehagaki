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

export interface StartPostHistoryChannelContextApplyParams {
    channelContextQuery: ChannelContextQueryTarget;
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    getCurrentChannelContext(): ChannelContextState | null;
    setChannelContext(context: ChannelContextState): void;
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
    coordinator = channelContextCoordinator,
    logger = console,
}: StartPostHistoryChannelContextApplyParams): PostHistoryChannelContextApplyHandle {
    const handle = coordinator.resolveInternal(
        channelContextQuery,
        rxNostr,
        relayConfig,
    );
    const eventId = channelContextQuery.eventId;
    const applyIfCurrent = (context: ChannelContextState) => {
        if (getCurrentChannelContext()?.eventId === eventId) {
            setChannelContext(context);
        }
    };

    setChannelContext(handle.initial.context);

    void handle.cacheReady
        .then((snapshot) => applyIfCurrent(snapshot.context))
        .catch((error) => {
            logger.error("投稿履歴のチャンネルキャッシュ適用に失敗しました:", error);
        });
    void handle.refresh
        .then((result) => {
            if (result.status === "updated") {
                applyIfCurrent(result.snapshot.context);
            }
        })
        .catch((error) => {
            logger.error("投稿履歴のチャンネル更新に失敗しました:", error);
        });

    return { release: handle.release };
}

