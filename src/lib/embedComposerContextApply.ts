import type { EmbedComposerSetContextPayload } from './embedProtocol';
import type { ReplyQuoteComposerState } from './types';
import {
    buildPatchedChannelContext,
    buildPatchedReplyQuoteQuery,
} from './embedComposerContextPatch';

export interface EmbedComposerContentHandlers {
    clearUrlQueryContentStore: () => void;
    updateUrlQueryContentStore: (content: string) => void;
    resetPostContent?: () => void;
    insertTextContent?: (content: string) => void;
}

export interface EmbedComposerContextPatch {
    channelContext: ReturnType<typeof buildPatchedChannelContext>;
    replyQuoteQuery: ReturnType<typeof buildPatchedReplyQuoteQuery>;
}

export function applyEmbedComposerContent(
    content: string | null | undefined,
    handlers: EmbedComposerContentHandlers,
): void {
    if (content === undefined) {
        return;
    }

    if (content === null) {
        handlers.clearUrlQueryContentStore();
        handlers.resetPostContent?.();
        return;
    }

    if (handlers.insertTextContent) {
        handlers.insertTextContent(content);
        handlers.clearUrlQueryContentStore();
        return;
    }

    handlers.updateUrlQueryContentStore(content);
}

export function buildEmbedComposerContextPatch(
    payload: EmbedComposerSetContextPayload,
    currentReplyQuoteState: ReplyQuoteComposerState,
): EmbedComposerContextPatch {
    return {
        channelContext: buildPatchedChannelContext(payload),
        replyQuoteQuery: buildPatchedReplyQuoteQuery(payload, currentReplyQuoteState),
    };
}