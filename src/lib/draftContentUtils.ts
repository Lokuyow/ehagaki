import type { Draft, DraftReplyQuoteData, MediaGalleryItem, ReplyQuoteState } from './types';

type DraftReplyQuoteStateLike = Pick<
    ReplyQuoteState,
    | 'mode'
    | 'eventId'
    | 'relayHints'
    | 'authorPubkey'
    | 'authorDisplayName'
    | 'referencedEvent'
    | 'rootEventId'
    | 'rootRelayHint'
    | 'rootPubkey'
>;

interface CreateDraftSavePayloadParams {
    htmlContent: string;
    galleryItems: MediaGalleryItem[];
    replyQuoteState: DraftReplyQuoteStateLike | null;
}

interface ExtractMediaToGalleryHtmlParams {
    htmlContent: string;
    document: Document;
    addGalleryItem: (item: MediaGalleryItem) => void;
    generateMediaItemId: () => string;
}

interface ApplyDraftToComposerParams {
    draft: Draft;
    isGalleryMode: boolean;
    document: Document;
    clearGallery: () => void;
    addGalleryItem: (item: MediaGalleryItem) => void;
    loadDraftContent: (content: string) => void;
    appendMediaToEditor: (items: MediaGalleryItem[]) => void;
    generateMediaItemId: () => string;
    restoreReplyQuote: (replyQuoteData: DraftReplyQuoteData) => void;
    clearReplyQuote: () => void;
}

function removeMediaElement(element: Element, root: HTMLDivElement): void {
    const parent = element.parentElement;
    if (parent && parent !== root && parent.children.length === 1) {
        parent.remove();
        return;
    }

    element.remove();
}

export function buildDraftReplyQuoteData(
    replyQuoteState: DraftReplyQuoteStateLike | null,
): DraftReplyQuoteData | undefined {
    if (!replyQuoteState) {
        return undefined;
    }

    return {
        mode: replyQuoteState.mode,
        eventId: replyQuoteState.eventId,
        relayHints: replyQuoteState.relayHints,
        authorPubkey: replyQuoteState.authorPubkey,
        authorDisplayName: replyQuoteState.authorDisplayName,
        referencedEvent: replyQuoteState.referencedEvent,
        rootEventId: replyQuoteState.rootEventId,
        rootRelayHint: replyQuoteState.rootRelayHint,
        rootPubkey: replyQuoteState.rootPubkey,
    };
}

export function createDraftSavePayload({
    htmlContent,
    galleryItems,
    replyQuoteState,
}: CreateDraftSavePayloadParams): {
    content: string;
    galleryItems: MediaGalleryItem[];
    replyQuoteData?: DraftReplyQuoteData;
} | null {
    const persistedGalleryItems = galleryItems.filter((item) => !item.isPlaceholder);

    if ((!htmlContent || htmlContent === '<p></p>') && persistedGalleryItems.length === 0) {
        return null;
    }

    return {
        content: htmlContent,
        galleryItems: persistedGalleryItems,
        replyQuoteData: buildDraftReplyQuoteData(replyQuoteState),
    };
}

export function extractMediaToGalleryHtml({
    htmlContent,
    document,
    addGalleryItem,
    generateMediaItemId,
}: ExtractMediaToGalleryHtmlParams): string {
    if (!htmlContent) {
        return htmlContent;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    tempDiv.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (!src || img.getAttribute('isPlaceholder') === 'true') {
            return;
        }

        addGalleryItem({
            id: generateMediaItemId(),
            type: 'image',
            src,
            isPlaceholder: false,
            blurhash: img.getAttribute('blurhash') ?? undefined,
            alt: img.getAttribute('alt') ?? undefined,
            dim: img.getAttribute('dim') ?? undefined,
        });
        removeMediaElement(img, tempDiv);
    });

    tempDiv.querySelectorAll('video').forEach((video) => {
        const src = video.getAttribute('src');
        if (!src || video.getAttribute('isPlaceholder') === 'true') {
            return;
        }

        addGalleryItem({
            id: generateMediaItemId(),
            type: 'video',
            src,
            isPlaceholder: false,
        });
        removeMediaElement(video, tempDiv);
    });

    return tempDiv.innerHTML;
}

export function applyDraftToComposer({
    draft,
    isGalleryMode,
    document,
    clearGallery,
    addGalleryItem,
    loadDraftContent,
    appendMediaToEditor,
    generateMediaItemId,
    restoreReplyQuote,
    clearReplyQuote,
}: ApplyDraftToComposerParams): void {
    if (isGalleryMode) {
        clearGallery();

        draft.galleryItems?.forEach((item) => addGalleryItem(item));

        loadDraftContent(
            extractMediaToGalleryHtml({
                htmlContent: draft.content,
                document,
                addGalleryItem,
                generateMediaItemId,
            }),
        );
    } else {
        loadDraftContent(draft.content);
        if (draft.galleryItems?.length) {
            appendMediaToEditor(draft.galleryItems);
        }
    }

    if (draft.replyQuoteData) {
        restoreReplyQuote(draft.replyQuoteData);
    } else {
        clearReplyQuote();
    }
}