import type { RxNostr } from "rx-nostr";
import { ProfileManager } from "../profileManager";
import {
    postHistoryReplyFetchService,
    type PostHistoryReplyFetchService,
    type PostHistoryReplyFetchTask,
} from "../postHistoryReplyFetchService";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";
import type { PostHistoryRecord, PostHistoryReplyEventRecord } from "../storage/ehagakiDb";
import {
    postHistoryReplyEventsRepository,
    type PostHistoryReplyEventsRepository,
} from "../storage/postHistoryReplyEventsRepository";
import {
    profilesRepository,
    type ProfilesRepository,
} from "../storage/profilesRepository";
import { cloneNostrEvent, isSignedNostrEvent } from "../postHistoryEventUtils";

export type PostHistoryRepliesStatus =
    | "unloaded"
    | "loading"
    | "loaded"
    | "failed";

export interface PostHistoryReplyDisplayItem {
    event: NostrEvent;
    profile: ProfileData | null;
    relayUrls: string[];
    isOwnReply: boolean;
}

export interface PostHistoryRepliesState {
    status: PostHistoryRepliesStatus;
    visible: boolean;
    replies: PostHistoryReplyDisplayItem[];
    error: string | null;
}

interface UsePostHistoryRepliesParams {
    getShow: () => boolean;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    replyEventsRepositoryImpl?: Pick<
        PostHistoryReplyEventsRepository,
        "getDirectReplies" | "upsertDirectReplies"
    >;
    profilesRepositoryImpl?: Pick<ProfilesRepository, "get">;
    replyFetchService?: Pick<PostHistoryReplyFetchService, "fetchDirectReplies">;
}

function buildInitialState(): PostHistoryRepliesState {
    return {
        status: "unloaded",
        visible: false,
        replies: [],
        error: null,
    };
}

function toEventFromReplyRecord(record: PostHistoryReplyEventRecord): NostrEvent {
    if (isSignedNostrEvent(record.rawEvent)) {
        return cloneNostrEvent(record.rawEvent);
    }

    return {
        id: record.eventId,
        pubkey: record.authorPubkey,
        kind: record.kind,
        content: record.content,
        tags: record.tags.map((tag) => [...tag]),
        created_at: record.createdAt,
        sig: "",
    };
}

function sortReplyItems(items: PostHistoryReplyDisplayItem[]): PostHistoryReplyDisplayItem[] {
    return [...items].sort((left, right) => {
        if (left.event.created_at !== right.event.created_at) {
            return left.event.created_at - right.event.created_at;
        }

        return left.event.id.localeCompare(right.event.id);
    });
}

function buildRelayHints(post: PostHistoryRecord): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...post.relayHints,
        ...post.acceptedRelays,
        ...(post.fetchedRelays ?? []),
    ], { limit: 8 });
}

export function usePostHistoryReplies({
    getShow,
    getRxNostr,
    getRelayConfig,
    replyEventsRepositoryImpl = postHistoryReplyEventsRepository,
    profilesRepositoryImpl = profilesRepository,
    replyFetchService = postHistoryReplyFetchService,
}: UsePostHistoryRepliesParams) {
    let stateByPostId = $state.raw<Record<string, PostHistoryRepliesState>>({});
    const tasksByPostId = new Map<string, PostHistoryReplyFetchTask>();
    let requestId = 0;

    function getRepliesState(post: PostHistoryRecord): PostHistoryRepliesState {
        return stateByPostId[post.eventId] ?? buildInitialState();
    }

    function updateRepliesState(
        postEventId: string,
        nextState: PostHistoryRepliesState,
    ): void {
        stateByPostId = {
            ...stateByPostId,
            [postEventId]: nextState,
        };
    }

    function cancelCurrentReplyFetches(): void {
        tasksByPostId.forEach((task) => task.cancel());
        tasksByPostId.clear();
    }

    function resetState(): void {
        cancelCurrentReplyFetches();
        requestId += 1;
        stateByPostId = {};
    }

    async function resolveProfile(
        event: NostrEvent,
        additionalRelays: string[] = [],
    ): Promise<ProfileData | null> {
        try {
            const cachedProfile = await profilesRepositoryImpl.get(event.pubkey);
            if (cachedProfile) {
                return cachedProfile;
            }
        } catch {
            // Fall through to the network path when available.
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            return null;
        }

        try {
            const profileManager = new ProfileManager(rxNostr as never);
            return await profileManager.fetchProfileData(event.pubkey, {
                additionalRelays,
                forceRemote: false,
            });
        } catch {
            return null;
        }
    }

    async function toDisplayItems(
        records: PostHistoryReplyEventRecord[],
        currentPubkey: string,
    ): Promise<PostHistoryReplyDisplayItem[]> {
        const items = await Promise.all(records.map(async (record) => {
            const event = toEventFromReplyRecord(record);
            return {
                event,
                profile: await resolveProfile(event, record.relayUrls),
                relayUrls: [...record.relayUrls],
                isOwnReply: event.pubkey === currentPubkey,
            };
        }));

        return sortReplyItems(items);
    }

    async function loadReplies(post: PostHistoryRecord, options: { force?: boolean } = {}): Promise<void> {
        const currentState = getRepliesState(post);
        if (currentState.status === "loading") {
            updateRepliesState(post.eventId, {
                ...currentState,
                visible: true,
            });
            return;
        }

        if (!options.force && currentState.status === "loaded") {
            updateRepliesState(post.eventId, {
                ...currentState,
                visible: currentState.replies.length > 0,
            });
            return;
        }

        const activeRequestId = ++requestId;
        updateRepliesState(post.eventId, {
            ...currentState,
            status: "loading",
            visible: true,
            error: null,
        });

        try {
            const cachedRecords = await replyEventsRepositoryImpl.getDirectReplies(post.eventId);
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            if (!options.force && cachedRecords.length > 0) {
                updateRepliesState(post.eventId, {
                    status: "loaded",
                    visible: true,
                    replies: await toDisplayItems(cachedRecords, post.pubkeyHex),
                    error: null,
                });
                return;
            }

            const rxNostr = getRxNostr();
            if (!rxNostr) {
                const replies = await toDisplayItems(cachedRecords, post.pubkeyHex);
                updateRepliesState(post.eventId, {
                    status: replies.length > 0 ? "loaded" : "failed",
                    visible: replies.length > 0,
                    replies,
                    error: cachedRecords.length > 0 ? null : "nostr_not_ready",
                });
                return;
            }

            tasksByPostId.get(post.eventId)?.cancel();
            const task = replyFetchService.fetchDirectReplies(rxNostr, {
                eventId: post.eventId,
                createdAt: post.createdAt,
                relayHints: buildRelayHints(post),
                relayConfig: getRelayConfig(),
            });
            tasksByPostId.set(post.eventId, task);

            const result = await task.promise;
            tasksByPostId.delete(post.eventId);
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            await replyEventsRepositoryImpl.upsertDirectReplies({
                parentEventId: post.eventId,
                events: result.events,
                fetchedAt: result.fetchedAt,
            });
            const nextRecords = await replyEventsRepositoryImpl.getDirectReplies(post.eventId);
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            const latestState = stateByPostId[post.eventId] ?? currentState;
            const replies = await toDisplayItems(nextRecords, post.pubkeyHex);
            updateRepliesState(post.eventId, {
                status: "loaded",
                visible: replies.length > 0 && latestState.visible,
                replies,
                error: null,
            });
        } catch {
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            const latestState = stateByPostId[post.eventId] ?? currentState;
            updateRepliesState(post.eventId, {
                ...latestState,
                status: "failed",
                visible: false,
                error: "fetch_failed",
            });
        }
    }

    function hideReplies(post: PostHistoryRecord): void {
        const currentState = getRepliesState(post);
        updateRepliesState(post.eventId, {
            ...currentState,
            visible: false,
        });
    }

    function toggleReplies(post: PostHistoryRecord): void {
        const currentState = getRepliesState(post);
        if (currentState.visible) {
            hideReplies(post);
            return;
        }

        void loadReplies(post);
    }

    function retryReplies(post: PostHistoryRecord): void {
        void loadReplies(post, { force: true });
    }

    $effect(() => {
        if (!getShow()) {
            resetState();
        }
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        return () => {
            cancelCurrentReplyFetches();
        };
    });

    return {
        getRepliesState,
        toggleReplies,
        retryReplies,
        cancelCurrentReplyFetches,
        resetState,
    };
}
