import type { PostHistoryRecord } from './storage/ehagakiDb';
import type {
    ApplyReplyQuoteQueryParams,
    HydrateReplyQuoteReferencesParams,
} from './bootstrap/externalInputBootstrap';
import type { PostHistoryChannelContextApplyHandle } from './postHistoryChannelContextApply';
import type { ChannelContextQueryTarget } from './types';
import {
    buildPostHistoryReferenceTarget,
    buildPostHistoryReplyChannelContextQuery,
    buildPostHistoryReplySeedEvents,
} from './postHistoryReplyUtils';

export interface PostHistoryDialogApplyControllerDependencies {
    startChannelContextQuery(
        channelContextQuery: ChannelContextQueryTarget,
    ): PostHistoryChannelContextApplyHandle;
    applyReplyQuoteQuery(params: ApplyReplyQuoteQueryParams): Promise<void>;
    hydrateReplyQuoteReferences(
        params: HydrateReplyQuoteReferencesParams,
    ): Promise<void>;
    getReplyQuoteApplyParams(): Pick<
        ApplyReplyQuoteQueryParams,
        | 'rxNostr'
        | 'relayConfig'
        | 'setReplyQuote'
        | 'updateReferencedEvent'
        | 'setReplyQuoteError'
    >;
    clearChannelContext(): void;
    hasReplyOrQuotes(): boolean;
    clearReplyQuote(): void;
    addQuoteReference(
        reference: HydrateReplyQuoteReferencesParams['references'][number],
    ): boolean;
    focusEditor(): void;
    logger?: Pick<Console, 'error'>;
}

export interface PostHistoryDialogApplyController {
    applyReply(post: PostHistoryRecord): Promise<boolean>;
    applyQuote(post: PostHistoryRecord): void;
}

const FALLBACK_LOGGER: Pick<Console, 'error'> = console;

export function createPostHistoryDialogApplyController(
    deps: PostHistoryDialogApplyControllerDependencies,
): PostHistoryDialogApplyController {
    const logger = deps.logger ?? FALLBACK_LOGGER;
    let currentChannelApplyHandle: PostHistoryChannelContextApplyHandle | null = null;

    function applyChannelContext(post: PostHistoryRecord): boolean {
        currentChannelApplyHandle?.release();
        currentChannelApplyHandle = null;
        const channelContextQuery = buildPostHistoryReplyChannelContextQuery(post);

        if (channelContextQuery) {
            try {
                currentChannelApplyHandle = deps.startChannelContextQuery(channelContextQuery);
                return true;
            } catch (error) {
                logger.error('投稿履歴からのチャンネル適用に失敗:', error);
                return false;
            }
        }

        deps.clearChannelContext();
        return post.kind !== 42;
    }

    async function applyReply(post: PostHistoryRecord): Promise<boolean> {
        const preloadedEvents = buildPostHistoryReplySeedEvents(post);
        const referenceTarget = buildPostHistoryReferenceTarget(post);

        if (!applyChannelContext(post)) {
            return false;
        }

        void deps.applyReplyQuoteQuery({
            replyQuoteQuery: {
                reply: {
                    ...referenceTarget,
                },
                quotes: [],
            },
            ...deps.getReplyQuoteApplyParams(),
            ...(preloadedEvents ? { preloadedEvents } : {}),
        }).catch((error) => {
            logger.error('投稿履歴からのリプライhydrateに失敗:', error);
        });

        deps.focusEditor();
        return true;
    }

    function applyQuote(post: PostHistoryRecord): void {
        const referenceTarget = buildPostHistoryReferenceTarget(post);

        void applyChannelContext(post);

        if (deps.hasReplyOrQuotes()) {
            deps.clearReplyQuote();
        }

        if (!deps.addQuoteReference(referenceTarget)) {
            deps.focusEditor();
            return;
        }

        const preloadedEvents = buildPostHistoryReplySeedEvents(post);

        void deps.hydrateReplyQuoteReferences({
            references: [referenceTarget],
            ...deps.getReplyQuoteApplyParams(),
            ...(preloadedEvents ? { preloadedEvents } : {}),
        }).catch((error) => {
            logger.error('投稿履歴からの引用適用に失敗:', error);
        });

        deps.focusEditor();
    }

    return {
        applyReply,
        applyQuote,
    };
}
