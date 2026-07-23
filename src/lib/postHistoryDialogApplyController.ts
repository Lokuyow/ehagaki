import type { PostHistoryRecord } from './storage/ehagakiDb';
import type {
    ApplyReplyQuoteQueryParams,
    HydrateReplyQuoteReferencesParams,
} from './bootstrap/externalInputBootstrap';
import type { ChannelContextApplyHandle } from './channelContextApplyController';
import type { ChannelContextQueryTarget, ReplyQuoteQueryTarget } from './types';
import { buildPostHistoryComposerEventTarget } from './postHistoryReplyUtils';
import { createComposerTargetApplyController } from './composerTargetApplyController';

export interface PostHistoryDialogApplyControllerDependencies {
    startChannelContextQuery(
        channelContextQuery: ChannelContextQueryTarget,
    ): ChannelContextApplyHandle;
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
        reference: ReplyQuoteQueryTarget,
    ): HydrateReplyQuoteReferencesParams['references'][number] | null;
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
    const applyController = createComposerTargetApplyController({
        startChannelContextQuery: (query) => deps.startChannelContextQuery(query),
        applyReplyQuoteQuery: deps.applyReplyQuoteQuery,
        hydrateReplyQuoteReferences: deps.hydrateReplyQuoteReferences,
        getReplyQuoteApplyParams: deps.getReplyQuoteApplyParams,
        clearChannelContext: deps.clearChannelContext,
        hasReplyOrQuotes: deps.hasReplyOrQuotes,
        clearReplyQuote: deps.clearReplyQuote,
        clearReplyReference: () => undefined,
        addQuoteReference: deps.addQuoteReference,
        focusEditor: deps.focusEditor,
        logger: deps.logger ?? FALLBACK_LOGGER,
    });

    return {
        async applyReply(post) {
            return applyController.applyReply(
                buildPostHistoryComposerEventTarget(post),
            );
        },
        applyQuote(post) {
            applyController.applyQuote(
                buildPostHistoryComposerEventTarget(post),
            );
        },
    };
}
