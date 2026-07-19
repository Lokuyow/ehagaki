import { onDestroy, untrack } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    channelContextCoordinator,
    type ChannelContextCoordinatorHandle,
} from "../channelContextCoordinator";
import { CHANNEL_TEMPORARY_READ_RELAY_LIMIT } from "../channelContextConstants";
import { RelayConfigUtils } from "../relayConfigUtils";
import {
    buildChannelRelayHints,
    toChannelDisplayState,
    type ChannelDisplayState,
} from "../postHistoryDialogUtils";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import type { RelayConfig } from "../types";

interface UsePostHistoryChannelDisplayParams {
    getShow: () => boolean;
    getPosts: () => PostHistoryRecord[];
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getIsSearchMode: () => boolean;
}

export function usePostHistoryChannelDisplay({
    getShow,
    getPosts,
    getRxNostr,
    getRelayConfig,
    getIsSearchMode,
}: UsePostHistoryChannelDisplayParams) {
    let channelDisplayByEventId = $state<Record<string, ChannelDisplayState>>(
        {},
    );
    let channelResolutionRequestId = 0;
    let currentHandles: ChannelContextCoordinatorHandle[] = [];

    function clearCurrentChannelResolution(): void {
        currentHandles = [];
    }

    function cancelCurrentChannelResolution(): void {
        currentHandles.forEach((handle) => handle.release());
        clearCurrentChannelResolution();
    }

    function resetState(): void {
        cancelCurrentChannelResolution();
        channelDisplayByEventId = {};
    }

    function getChannelText(
        post: PostHistoryRecord,
        translate: (key: string) => string,
    ): string | null {
        if (post.kind !== 42) {
            return null;
        }

        if (!post.channelEventId) {
            return translate("postHistory.channelUnknown");
        }

        const channelDisplay = channelDisplayByEventId[post.channelEventId];
        if (!channelDisplay || channelDisplay.status === "loading") {
            return translate("postHistory.channelLoading");
        }

        if (channelDisplay.status === "resolved" && channelDisplay.name) {
            return channelDisplay.name;
        }

        return translate("postHistory.channelUnknown");
    }

    $effect(() => {
        if (getShow()) {
            return;
        }

        resetState();
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        return () => {
            cancelCurrentChannelResolution();
        };
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        cancelCurrentChannelResolution();

        const channelPosts = getPosts().filter((post) => post.kind === 42);
        if (channelPosts.length === 0) {
            return;
        }

        const channelEventIds = Array.from(
            new Set(
                channelPosts
                    .map((post) => post.channelEventId)
                    .filter(
                        (channelEventId): channelEventId is string =>
                            typeof channelEventId === "string",
                    ),
            ),
        );

        if (channelEventIds.length === 0) {
            return;
        }

        const requestId = ++channelResolutionRequestId;
        const rxNostr = getIsSearchMode() ? undefined : getRxNostr();
        const handles = channelEventIds.map((channelEventId) => {
            const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
                channelPosts
                    .filter((post) => post.channelEventId === channelEventId)
                    .flatMap((post) => buildChannelRelayHints(post, null)),
                { limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT },
            );
            return channelContextCoordinator.resolveInternal(
                { eventId: channelEventId, relayHints },
                rxNostr,
                getRelayConfig(),
            );
        });
        currentHandles = handles;

        channelDisplayByEventId = {
            ...untrack(() => channelDisplayByEventId),
            ...Object.fromEntries(channelEventIds.map((channelEventId) => [
                channelEventId,
                { status: "loading", name: null } satisfies ChannelDisplayState,
            ])),
        };

        void Promise.all(handles.map((handle) => handle.cacheReady))
            .then((snapshots) => {
                if (!getShow() || requestId !== channelResolutionRequestId) return;
                channelDisplayByEventId = {
                    ...channelDisplayByEventId,
                    ...Object.fromEntries(snapshots.map((snapshot) => [
                        snapshot.context.eventId,
                        toChannelDisplayState(snapshot.cache, !!rxNostr),
                    ])),
                };
            })
            .catch((error) => {
                console.error("チャンネル表示のキャッシュ解決に失敗しました:", error);
            });

        void Promise.all(handles.map((handle) => handle.refresh))
            .then((results) => {
                if (!getShow() || requestId !== channelResolutionRequestId) return;
                clearCurrentChannelResolution();
                channelDisplayByEventId = {
                    ...channelDisplayByEventId,
                    ...Object.fromEntries(results.map((result) => [
                        result.snapshot.context.eventId,
                        {
                            status: result.snapshot.context.name ? "resolved" : "failed",
                            name: result.snapshot.context.name,
                        } satisfies ChannelDisplayState,
                    ])),
                };
            })
            .catch((error) => {
                if (requestId === channelResolutionRequestId) {
                    clearCurrentChannelResolution();
                }
                console.error("チャンネル表示のバックグラウンド解決に失敗しました:", error);
            });
    });

    onDestroy(() => {
        cancelCurrentChannelResolution();
    });

    return {
        getChannelText,
        cancelCurrentChannelResolution,
    };
}
