import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import { ChannelContextService } from "../channelContextService";
import {
    buildChannelRelayHints,
    toChannelDisplayState,
    type ChannelDisplayState,
} from "../postHistoryDialogUtils";
import {
    channelMetadataRepository,
} from "../storage/channelMetadataRepository";
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
    const channelContextService = new ChannelContextService();

    let channelDisplayByEventId = $state<Record<string, ChannelDisplayState>>(
        {},
    );
    let channelResolutionRequestId = 0;
    let currentChannelAbortController: AbortController | null = null;
    let currentChannelRequestIds: string[] = [];
    const pendingChannelEventIds = new Set<string>();

    function clearCurrentChannelResolution(): void {
        currentChannelRequestIds.forEach((channelEventId) => {
            pendingChannelEventIds.delete(channelEventId);
        });
        currentChannelRequestIds = [];
        currentChannelAbortController = null;
    }

    function cancelCurrentChannelResolution(): void {
        currentChannelAbortController?.abort();
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
        void (async () => {
            const cachedRecords =
                await channelMetadataRepository.getMany(channelEventIds);

            if (!getShow() || requestId !== channelResolutionRequestId) {
                return;
            }

            const cachedById = new Map(
                cachedRecords.map((record) => [record.channelEventId, record]),
            );

            channelDisplayByEventId = {
                ...channelDisplayByEventId,
                ...Object.fromEntries(
                    channelEventIds.map((channelEventId) => {
                        const cachedRecord = cachedById.get(channelEventId) ?? null;
                        return [
                            channelEventId,
                            toChannelDisplayState(
                                cachedRecord,
                                !!getRxNostr() && !getIsSearchMode(),
                            ) satisfies ChannelDisplayState,
                        ];
                    }),
                ),
            };

            const rxNostr = getRxNostr();
            if (!rxNostr || getIsSearchMode()) {
                return;
            }

            const refreshTargets = channelEventIds.filter((channelEventId) => {
                const cachedRecord = cachedById.get(channelEventId) ?? null;
                return (
                    channelMetadataRepository.shouldRefresh(cachedRecord) &&
                    !pendingChannelEventIds.has(channelEventId)
                );
            });

            if (refreshTargets.length === 0) {
                return;
            }

            const abortController = new AbortController();
            currentChannelAbortController = abortController;
            currentChannelRequestIds = [...refreshTargets];
            refreshTargets.forEach((channelEventId) => {
                pendingChannelEventIds.add(channelEventId);
            });

            const resolvedChannels = await Promise.all(
                refreshTargets.map(async (channelEventId) => {
                    const sourcePost = channelPosts.find(
                        (post) => post.channelEventId === channelEventId,
                    );
                    const cachedRecord = cachedById.get(channelEventId) ?? null;
                    const relayHints = buildChannelRelayHints(
                        sourcePost,
                        cachedRecord,
                    );

                    try {
                        const resolution =
                            await channelContextService.resolveChannelMetadata(
                                {
                                    eventId: channelEventId,
                                    relayHints,
                                },
                                rxNostr,
                                getRelayConfig(),
                                { signal: abortController.signal },
                            );

                        if (
                            abortController.signal.aborted ||
                            currentChannelAbortController !== abortController ||
                            resolution.status === "aborted"
                        ) {
                            return null;
                        }

                        if (resolution.status === "failed") {
                            await channelMetadataRepository.markFetchFailed(channelEventId);
                            return {
                                channelEventId,
                                status: cachedRecord?.name ? "resolved" : "failed",
                                name: cachedRecord?.name ?? null,
                            } satisfies { channelEventId: string } & ChannelDisplayState;
                        }

                        const savedRecord = resolution.status === "resolved"
                            ? await channelMetadataRepository.upsertResolvedChannel({
                                channelEventId: resolution.metadata.channelEventId,
                                quality: "verified-metadata",
                                metadataLookup: resolution.metadataLookup,
                                name: resolution.metadata.name,
                                about: resolution.metadata.about,
                                picture: resolution.metadata.picture,
                                relays: resolution.metadata.channelRelays,
                                verifiedSourceRelays: resolution.metadata.verifiedSourceRelays,
                                creatorPubkey: resolution.metadata.creatorPubkey,
                                createEventCreatedAt: resolution.metadata.createEventCreatedAt,
                                ...(resolution.metadata.metadataEventId
                                    ? { metadataEventId: resolution.metadata.metadataEventId }
                                    : {}),
                                ...(typeof resolution.metadata.metadataCreatedAt === "number"
                                    ? { metadataCreatedAt: resolution.metadata.metadataCreatedAt }
                                    : {}),
                            })
                            : await channelMetadataRepository.upsertResolvedChannel({
                                channelEventId: resolution.channelEventId,
                                quality: "verified-root-only",
                                metadataLookup: resolution.metadataLookup,
                                verifiedSourceRelays: resolution.verifiedSourceRelays,
                                creatorPubkey: resolution.creatorPubkey,
                                createEventCreatedAt: resolution.createEventCreatedAt,
                            });

                        return {
                            channelEventId,
                            status: savedRecord.name ? "resolved" : "failed",
                            name: savedRecord.name,
                        } satisfies { channelEventId: string } & ChannelDisplayState;
                    } catch {
                        if (abortController.signal.aborted) return null;
                        await channelMetadataRepository.markFetchFailed(channelEventId);
                        return {
                            channelEventId,
                            status: cachedRecord?.name ? "resolved" : "failed",
                            name: cachedRecord?.name ?? null,
                        } satisfies { channelEventId: string } & ChannelDisplayState;
                    }
                }),
            );

            if (
                !getShow() ||
                requestId !== channelResolutionRequestId ||
                currentChannelAbortController !== abortController ||
                abortController.signal.aborted
            ) {
                return;
            }

            clearCurrentChannelResolution();
            channelDisplayByEventId = {
                ...channelDisplayByEventId,
                ...Object.fromEntries(
                    resolvedChannels
                        .filter(
                            (
                                result,
                            ): result is {
                                channelEventId: string;
                                status: "resolved" | "failed";
                                name: string | null;
                            } => result !== null,
                        )
                        .map((result) => [
                            result.channelEventId,
                            {
                                status: result.status,
                                name: result.name,
                            } satisfies ChannelDisplayState,
                        ]),
                ),
            };
        })().catch((error) => {
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
