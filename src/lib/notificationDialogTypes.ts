import type { RepostPostHandler } from './hooks/usePostRepostOperation.svelte';
import type { PostRepostResult } from './postRepostService';
import type { RxNostr } from 'rx-nostr';
import type { RelayConfig } from './types';
import type { PostHistoryRecord } from './storage/ehagakiDb';
import type { PostHistoryInboundInteractionsSyncRequest } from './postHistoryInboundInteractionsSyncService';
    export interface NotificationDialogProps {
        show?: boolean;
        pubkeyHex: string | null;
        rxNostr?: RxNostr;
        relayConfig?: RelayConfig | null;
        returnFocus?: HTMLElement | null;
        onClose: () => void;
        onReplyPost: (post: PostHistoryRecord) => Promise<boolean>;
        onOpenTarget?: (post: PostHistoryRecord) => void;
        onQuotePost?: (post: PostHistoryRecord) => boolean;
        onRepostPost?: RepostPostHandler;
        repostPending?: boolean;
        repostSaveFailure?: PostRepostResult | null;
        onRetryRepostSave?: (result: PostRepostResult) => Promise<boolean>;
        onReactionPost: (post: PostHistoryRecord) => Promise<boolean>;
        reconcileDirectReplyCandidates?: PostHistoryInboundInteractionsSyncRequest['reconcileDirectReplyCandidates'];
    }
