import { applyDraftToComposer, createDraftSavePayload } from './draftContentUtils';
import type {
    ChannelContextState,
    Draft,
    DraftChannelData,
    DraftReplyQuoteData,
    MediaGalleryItem,
    ReplyQuoteComposerState,
} from './types';
import type { ChannelContextProvenance } from './channelContextRuntime';

interface DraftSaveResult {
    success: boolean;
    needsConfirmation?: boolean;
}

interface DraftLimitConfirmationPayload {
    content: string;
    galleryItems: MediaGalleryItem[];
    channelData?: DraftChannelData;
    replyQuoteData?: DraftReplyQuoteData;
}

export interface DraftComposerControllerDependencies {
    getEditorHtml(): string | undefined;
    getGalleryItems(): MediaGalleryItem[];
    getChannelContextState(): ChannelContextState | null;
    getChannelContextProvenance?(): ChannelContextProvenance | null;
    getReplyQuoteState(): ReplyQuoteComposerState;
    getPubkeyHex(): string | null;
    saveDraft(
        content: string,
        galleryItems: MediaGalleryItem[],
        replyQuoteData: DraftReplyQuoteData | undefined,
        channelData: DraftChannelData | undefined,
        options: { pubkeyHex: string | null },
    ): Promise<DraftSaveResult>;
    stageDraftLimitConfirm(payload: DraftLimitConfirmationPayload): void;
    isGalleryMode(): boolean;
    document: Document;
    clearGallery(): void;
    addGalleryItem(item: MediaGalleryItem): void;
    loadDraftContent(content: string): void;
    appendMediaToEditor(items: MediaGalleryItem[]): void;
    generateMediaItemId(): string;
    restoreChannelContext(channelData: DraftChannelData): void;
    clearChannelContext(): void;
    restoreReplyQuote(replyQuoteData: DraftReplyQuoteData): void;
    clearReplyQuote(): void;
}

export interface DraftComposerController {
    saveDraftFromComposer(): Promise<boolean>;
    applyDraftToComposer(draft: Draft): void;
}

export function createDraftComposerController(
    deps: DraftComposerControllerDependencies,
): DraftComposerController {
    async function saveDraftFromComposer(): Promise<boolean> {
        const htmlContent = deps.getEditorHtml();
        if (!htmlContent) {
            return false;
        }

        const payload = createDraftSavePayload({
            htmlContent,
            galleryItems: deps.getGalleryItems(),
            channelContextState: deps.getChannelContextState(),
            channelContextProvenance:
                deps.getChannelContextProvenance?.() ?? null,
            replyQuoteState: deps.getReplyQuoteState(),
        });

        if (!payload) {
            return false;
        }

        const result = await deps.saveDraft(
            payload.content,
            payload.galleryItems,
            payload.replyQuoteData,
            payload.channelData,
            { pubkeyHex: deps.getPubkeyHex() },
        );

        if (result.needsConfirmation) {
            deps.stageDraftLimitConfirm({
                content: payload.content,
                galleryItems: payload.galleryItems,
                channelData: payload.channelData,
                replyQuoteData: payload.replyQuoteData,
            });
            return false;
        }

        return result.success;
    }

    function applyDraft(draft: Draft): void {
        applyDraftToComposer({
            draft,
            isGalleryMode: deps.isGalleryMode(),
            document: deps.document,
            clearGallery: deps.clearGallery,
            addGalleryItem: deps.addGalleryItem,
            loadDraftContent: deps.loadDraftContent,
            appendMediaToEditor: deps.appendMediaToEditor,
            generateMediaItemId: deps.generateMediaItemId,
            restoreChannelContext: deps.restoreChannelContext,
            clearChannelContext: deps.clearChannelContext,
            restoreReplyQuote: deps.restoreReplyQuote,
            clearReplyQuote: deps.clearReplyQuote,
        });
    }

    return {
        saveDraftFromComposer,
        applyDraftToComposer: applyDraft,
    };
}
