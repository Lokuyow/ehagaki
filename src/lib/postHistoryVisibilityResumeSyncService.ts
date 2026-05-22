import type { RxNostr } from "rx-nostr";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "./postHistoryInboundReplyReconciliationService";
import {
    type PostHistoryInboundInteractionsSyncResult,
} from "./postHistoryInboundInteractionsSyncService";
import {
    type PostHistoryRelayFetchResult,
} from "./postHistoryRelayFetchService";
import {
    postHistoryLightweightSyncCoordinator,
    type PostHistoryLightweightSyncCoordinator,
} from "./postHistoryLightweightSyncCoordinator";
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
    isActive?: () => boolean;
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
    lightweightSyncCoordinator?: Pick<PostHistoryLightweightSyncCoordinator, "runAuthored" | "runInbound">;
}

export class PostHistoryVisibilityResumeSyncService {
    private lightweightSyncCoordinator: Pick<
        PostHistoryLightweightSyncCoordinator,
        "runAuthored" | "runInbound"
    >;

    constructor(deps: PostHistoryVisibilityResumeSyncServiceDeps = {}) {
        this.lightweightSyncCoordinator =
            deps.lightweightSyncCoordinator ?? postHistoryLightweightSyncCoordinator;
    }

    syncAfterVisibilityResume(
        rxNostr: RxNostr,
        params: PostHistoryVisibilityResumeSyncRequest,
    ): PostHistoryVisibilityResumeSyncTask {
        let active = true;
        const isActive = () => active && params.isActive?.() !== false;
        const authoredTask = this.lightweightSyncCoordinator.runAuthored(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: "visibility-resume",
            since: Math.max(
                0,
                params.hiddenAtSeconds - POST_HISTORY_VISIBILITY_RESUME_AUTHORED_OVERLAP_SECONDS,
            ),
            onSavedSelfPosts: params.onSavedSelfPosts,
            isActive,
        });
        const inboundTask = this.lightweightSyncCoordinator.runInbound(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: "visibility-resume",
            reconcileDirectReplyCandidates: params.reconcileDirectReplyCandidates,
            isActive,
        });

        const promise = Promise.all([
            authoredTask.promise,
            inboundTask.promise,
        ]).then(([authored, inbound]) => ({
            authored: authored.fetchResult,
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
}

export const postHistoryVisibilityResumeSyncService =
    new PostHistoryVisibilityResumeSyncService();
