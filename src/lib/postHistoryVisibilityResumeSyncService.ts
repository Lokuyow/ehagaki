import type { RxNostr } from "rx-nostr";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "./postHistoryInboundReplyReconciliationService";
import {
    postHistoryInboundInteractionsSyncService,
    type PostHistoryInboundInteractionsSyncResult,
    type PostHistoryInboundInteractionsSyncService,
    type PostHistoryInboundInteractionsSyncTask,
} from "./postHistoryInboundInteractionsSyncService";
import {
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchService,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import type { RelayConfig } from "./types";

export const POST_HISTORY_VISIBILITY_RESUME_AUTHORED_OVERLAP_SECONDS = 60;

export interface PostHistoryVisibilityResumeSyncRequest {
    ownerPubkeyHex: string;
    hiddenAtSeconds: number;
    relayConfig?: RelayConfig | null;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
}

export interface PostHistoryVisibilityResumeSyncResult {
    authored: PostHistoryRelayFetchResult;
    inbound: PostHistoryInboundInteractionsSyncResult;
    savedSelfPostEventIds: string[];
}

export interface PostHistoryVisibilityResumeSyncTask {
    promise: Promise<PostHistoryVisibilityResumeSyncResult>;
    cancel: () => void;
}

export interface PostHistoryVisibilityResumeSyncServiceDeps {
    postHistoryRelayFetchService?: Pick<PostHistoryRelayFetchService, "fetchLatest">;
    postHistoryInboundInteractionsSyncService?: Pick<
        PostHistoryInboundInteractionsSyncService,
        "syncRecent"
    >;
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    console?: Pick<Console, "warn">;
}

function resolveFetchedEventIds(events: PostHistoryRelayFetchResult["events"]): string[] {
    return events
        .map((item) => item.event.id)
        .filter((eventId) => !!eventId);
}

export class PostHistoryVisibilityResumeSyncService {
    private postHistoryRelayFetchService: Pick<PostHistoryRelayFetchService, "fetchLatest">;
    private postHistoryInboundInteractionsSyncService: Pick<
        PostHistoryInboundInteractionsSyncService,
        "syncRecent"
    >;
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    private console: Pick<Console, "warn">;

    constructor(deps: PostHistoryVisibilityResumeSyncServiceDeps = {}) {
        this.postHistoryRelayFetchService =
            deps.postHistoryRelayFetchService ?? postHistoryRelayFetchService;
        this.postHistoryInboundInteractionsSyncService =
            deps.postHistoryInboundInteractionsSyncService ?? postHistoryInboundInteractionsSyncService;
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { warn: () => undefined });
    }

    syncAfterVisibilityResume(
        rxNostr: RxNostr,
        params: PostHistoryVisibilityResumeSyncRequest,
    ): PostHistoryVisibilityResumeSyncTask {
        let active = true;
        const authoredTask = this.postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: "visibility-resume",
            since: Math.max(
                0,
                params.hiddenAtSeconds - POST_HISTORY_VISIBILITY_RESUME_AUTHORED_OVERLAP_SECONDS,
            ),
        });
        const inboundTask = this.postHistoryInboundInteractionsSyncService.syncRecent(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: "visibility-resume",
            reconcileDirectReplyCandidates: params.reconcileDirectReplyCandidates,
        });

        const promise = Promise.all([
            this.saveAuthoredResult(authoredTask, params, () => active),
            inboundTask.promise,
        ]).then(([authored, inbound]) => ({
            authored: authored.result,
            inbound,
            savedSelfPostEventIds: authored.savedSelfPostEventIds,
        }));

        return {
            promise,
            cancel: () => {
                active = false;
                authoredTask.cancel();
                inboundTask.cancel();
            },
        };
    }

    private async saveAuthoredResult(
        task: PostHistoryRelayFetchTask,
        params: PostHistoryVisibilityResumeSyncRequest,
        isActive: () => boolean,
    ): Promise<{ result: PostHistoryRelayFetchResult; savedSelfPostEventIds: string[] }> {
        const result = await task.promise;
        if (!isActive() || result.status === "cancelled" || result.events.length === 0) {
            return { result, savedSelfPostEventIds: [] };
        }

        await this.postHistoryRepository.upsertFetchedEvents({
            events: result.events,
            fetchedAt: result.fetchedAt,
        });
        if (!isActive()) {
            return { result, savedSelfPostEventIds: [] };
        }

        const savedSelfPostEventIds = resolveFetchedEventIds(result.events);
        if (savedSelfPostEventIds.length === 0) {
            return { result, savedSelfPostEventIds };
        }

        try {
            await params.onSavedSelfPosts?.(savedSelfPostEventIds);
        } catch (error) {
            this.console.warn("post_history_visibility_resume_authored_callback_error", error);
        }

        return { result, savedSelfPostEventIds };
    }
}

export const postHistoryVisibilityResumeSyncService =
    new PostHistoryVisibilityResumeSyncService();
