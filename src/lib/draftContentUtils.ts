import type {
    Draft,
    DraftReplyQuoteData,
    MediaGalleryItem,
    ReplyQuoteComposerState,
    ReplyQuoteState,
    DraftReplyQuoteEntryData,
} from './types';
import { createSanitizedDraftContainer, sanitizeDraftHtml } from './draftHtmlSanitizer';

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
    replyQuoteState: ReplyQuoteComposerState;
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

function buildDraftReplyQuoteEntry(
    replyQuoteState: DraftReplyQuoteStateLike,
): DraftReplyQuoteEntryData {
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

export function buildDraftReplyQuoteData(
    replyQuoteState: ReplyQuoteComposerState,
): DraftReplyQuoteData | undefined {
    if (!replyQuoteState.reply && replyQuoteState.quotes.length === 0) {
        return undefined;
    }

    return {
        reply: replyQuoteState.reply
            ? buildDraftReplyQuoteEntry(replyQuoteState.reply)
            : null,
        quotes: replyQuoteState.quotes.map((quote) => buildDraftReplyQuoteEntry(quote)),
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
    const sanitizedHtmlContent = sanitizeDraftHtml(htmlContent);
    const persistedGalleryItems = galleryItems.filter((item) => !item.isPlaceholder);

    if ((!sanitizedHtmlContent || sanitizedHtmlContent === '<p></p>') && persistedGalleryItems.length === 0) {
        return null;
    }

    return {
        content: sanitizedHtmlContent,
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

    const tempDiv = createSanitizedDraftContainer(htmlContent, document);

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