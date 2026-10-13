import type { RxNostr } from "rx-nostr";
import type { RepostPostHandler } from "./hooks/usePostRepostOperation.svelte";
import type { PostRepostResult } from "./postRepostService";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { NostrEvent, RelayConfig } from "./types";
import type { PostHistoryInboundDirectReplyCandidate, PostHistoryInboundReplyReconciliationResult } from "./postHistoryInboundReplyReconciliationService";
export interface PostHistoryDialogProps {
        show: boolean;
        onClose: () => void;
        onReplyPost?: (
            post: PostHistoryRecord,
        ) => void | boolean | Promise<boolean>;
        onQuotePost?: (post: PostHistoryRecord) => void;
        onReactionPost?: (post: PostHistoryRecord) => boolean | Promise<boolean>;
        onRepostPost?: RepostPostHandler;
        repostPending?: boolean;
        onRetryRepostSave?: (result: PostRepostResult) => Promise<boolean>;
        repostSaveFailure?: PostRepostResult | null;
        pubkeyHex?: string | null;
        rxNostr?: RxNostr;
        relayConfig?: RelayConfig | null;
        latestPostedEvent?: NostrEvent | null;
        inboundInteractionSave?: {
            revision: number;
            parentEventIds: string[];
        } | null;
        authoredSelfPostSave?: {
            revision: number;
            eventIds: string[];
        } | null;
        reconcileInboundDirectReplyCandidates?: (
            candidates: PostHistoryInboundDirectReplyCandidate[],
        ) => Promise<PostHistoryInboundReplyReconciliationResult>;
        notifySavedAuthoredPosts?: (
            eventIds: string[],
        ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    }
