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
import type { SaveDraftResult } from './draftManager';

interface DraftLimitConfirmationPayload {
    content: string;
    galleryItems: MediaGalleryItem[];
    channelData?: DraftChannelData;
    replyQuoteData?: DraftReplyQuoteData;
    pubkeyHex: string | null;
}

export type DraftSaveAttemptResult =
    | { status: 'saved' }
    | { status: 'confirmation-required' }
    | { status: 'not-saveable' }
    | { status: 'failed' };

export interface DraftSaveCompletedEvent {
    draftId: string;
    pubkeyHex: string | null;
}

type DraftSaveCompletedListener = (event: DraftSaveCompletedEvent) => void;

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
    ): Promise<SaveDraftResult>;
    saveDraftWithReplaceOldest(
        content: string,
        galleryItems: MediaGalleryItem[],
        replyQuoteData: DraftReplyQuoteData | undefined,
        channelData: DraftChannelData | undefined,
        options: { pubkeyHex: string | null },
    ): Promise<{ status: 'saved'; draft: Draft }>;
    openDraftLimitConfirm(): void;
    closeDraftLimitConfirm(): void;
    logger?: Pick<Console, 'error'>;
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
    saveDraftFromComposer(): Promise<DraftSaveAttemptResult>;
    confirmPendingDraftSave(): Promise<DraftSaveAttemptResult>;
    cancelPendingDraftSave(): void;
    subscribeToDraftSaveCompleted(listener: DraftSaveCompletedListener): () => void;
    applyDraftToComposer(draft: Draft): void;
}

export function createDraftComposerController(
    deps: DraftComposerControllerDependencies,
): DraftComposerController {
    let pendingDraftSave: DraftLimitConfirmationPayload | null = null;
    let pendingConfirmationPromise: Promise<DraftSaveAttemptResult> | null = null;
    const saveCompletedListeners = new Set<DraftSaveCompletedListener>();

    function notifyDraftSaveCompleted(event: DraftSaveCompletedEvent): void {
        for (const listener of saveCompletedListeners) {
            try {
                listener(event);
            } catch (error) {
                deps.logger?.error('下書き保存完了通知の処理に失敗:', error);
            }
        }
    }

    async function saveDraftFromComposer(): Promise<DraftSaveAttemptResult> {
        const htmlContent = deps.getEditorHtml();
        if (!htmlContent) {
            return { status: 'not-saveable' };
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
            return { status: 'not-saveable' };
        }

        const pubkeyHex = deps.getPubkeyHex();

        try {
            const result = await deps.saveDraft(
                payload.content,
                payload.galleryItems,
                payload.replyQuoteData,
                payload.channelData,
                { pubkeyHex },
            );

            if (result.status === 'confirmation-required') {
                pendingDraftSave = {
                    content: payload.content,
                    galleryItems: payload.galleryItems,
                    channelData: payload.channelData,
                    replyQuoteData: payload.replyQuoteData,
                    pubkeyHex,
                };
                deps.openDraftLimitConfirm();
                return { status: 'confirmation-required' };
            }

            notifyDraftSaveCompleted({
                draftId: result.draft.id,
                pubkeyHex,
            });
            return { status: 'saved' };
        } catch (error) {
            deps.logger?.error('下書き保存に失敗:', error);
            return { status: 'failed' };
        }
    }

    async function confirmPendingDraftSave(): Promise<DraftSaveAttemptResult> {
        if (pendingConfirmationPromise) {
            return pendingConfirmationPromise;
        }

        const pending = pendingDraftSave;
        if (!pending) {
            return { status: 'not-saveable' };
        }

        pendingConfirmationPromise = (async () => {
            try {
                const result = await deps.saveDraftWithReplaceOldest(
                    pending.content,
                    pending.galleryItems,
                    pending.replyQuoteData,
                    pending.channelData,
                    { pubkeyHex: pending.pubkeyHex },
                );
                pendingDraftSave = null;
                notifyDraftSaveCompleted({
                    draftId: result.draft.id,
                    pubkeyHex: pending.pubkeyHex,
                });
                deps.closeDraftLimitConfirm();
                return { status: 'saved' };
            } catch (error) {
                deps.logger?.error('下書きの置換保存に失敗:', error);
                return { status: 'failed' };
            } finally {
                pendingConfirmationPromise = null;
            }
        })();

        return pendingConfirmationPromise;
    }

    function cancelPendingDraftSave(): void {
        pendingDraftSave = null;
        deps.closeDraftLimitConfirm();
    }

    function subscribeToDraftSaveCompleted(
        listener: DraftSaveCompletedListener,
    ): () => void {
        saveCompletedListeners.add(listener);
        return () => {
            saveCompletedListeners.delete(listener);
        };
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
        confirmPendingDraftSave,
        cancelPendingDraftSave,
        subscribeToDraftSaveCompleted,
        applyDraftToComposer: applyDraft,
    };
}
