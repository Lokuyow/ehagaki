import type { PostHistoryRecord } from './storage/ehagakiDb';
import type {
    ApplyChannelContextQueryParams,
    ApplyReplyQuoteQueryParams,
    HydrateReplyQuoteReferencesParams,
} from './bootstrap/externalInputBootstrap';
import {
    buildPostHistoryReferenceTarget,
    buildPostHistoryReplyChannelContextQuery,
    buildPostHistoryReplySeedEvents,
} from './postHistoryReplyUtils';

export interface PostHistoryDialogApplyControllerDependencies {
    applyChannelContextQuery(
        params: ApplyChannelContextQueryParams,
    ): Promise<void>;
    applyReplyQuoteQuery(params: ApplyReplyQuoteQueryParams): Promise<void>;
    hydrateReplyQuoteReferences(
        params: HydrateReplyQuoteReferencesParams,
    ): Promise<void>;
    getChannelContextApplyParams(): Pick<
        ApplyChannelContextQueryParams,
        'rxNostr' | 'relayConfig' | 'setChannelContext'
    >;
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

    async function applyChannelContext(post: PostHistoryRecord): Promise<boolean> {
        const channelContextQuery = buildPostHistoryReplyChannelContextQuery(post);

        if (channelContextQuery) {
            try {
                await deps.applyChannelContextQuery({
                    channelContextQuery,
                    ...deps.getChannelContextApplyParams(),
                });
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

        if (!await applyChannelContext(post)) {
            return false;
        }

        try {
            await deps.applyReplyQuoteQuery({
                replyQuoteQuery: {
                    reply: {
                        ...referenceTarget,
                    },
                    quotes: [],
                },
                ...deps.getReplyQuoteApplyParams(),
                ...(preloadedEvents ? { preloadedEvents } : {}),
            });
        } catch (error) {
            logger.error('投稿履歴からのリプライ適用に失敗:', error);
            if (post.kind === 42) {
                deps.clearChannelContext();
            }
            return false;
        }

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
