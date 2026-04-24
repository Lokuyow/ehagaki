import type { DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from './types';

type BooleanDialogStore = {
    set: (value: boolean) => void;
};

type PendingDraftContent = {
    content: string;
    galleryItems: MediaGalleryItem[];
    channelData?: DraftChannelData;
    replyQuoteData?: DraftReplyQuoteData;
};

type PendingDraftStore = {
    readonly value: PendingDraftContent | null;
    set: (value: PendingDraftContent | null) => void;
};

export function createDialogVisibilityHandlers(store: BooleanDialogStore) {
    return {
        open: () => store.set(true),
        close: () => store.set(false),
        handleOpenChange: (open: boolean) => {
            if (!open) {
                store.set(false);
            }
        },
    };
}

export function createDraftLimitConfirmHandlers(params: {
    pendingDraftContentStore: PendingDraftStore;
    showDraftLimitConfirmStore: BooleanDialogStore;
    saveDraftWithReplaceOldest: (
        content: string,
        galleryItems: MediaGalleryItem[],
        replyQuoteData?: DraftReplyQuoteData,
        channelData?: DraftChannelData,
    ) => void;
}) {
    const clear = () => {
        params.pendingDraftContentStore.set(null);
        params.showDraftLimitConfirmStore.set(false);
    };

    return {
        stage: (payload: PendingDraftContent) => {
            params.pendingDraftContentStore.set(payload);
            params.showDraftLimitConfirmStore.set(true);
        },
        confirm: () => {
            const pending = params.pendingDraftContentStore.value;

            if (pending) {
                params.saveDraftWithReplaceOldest(
                    pending.content,
                    pending.galleryItems,
                    pending.replyQuoteData,
                    pending.channelData,
                );
            }

            clear();
        },
        cancel: clear,
        handleOpenChange: (open: boolean) => {
            if (!open) {
                clear();
            }
        },
    };
}

export type { PendingDraftContent };