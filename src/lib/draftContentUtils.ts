import type {
    ChannelContextState,
    Draft,
    DraftChannelData,
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
    | 'quoteNotificationEnabled'
    | 'authorDisplayName'
    | 'referencedEvent'
    | 'rootEventId'
    | 'rootRelayHint'
    | 'rootPubkey'
>;
interface CreateDraftSavePayloadParams {
    htmlContent: string;
    galleryItems: MediaGalleryItem[];
    channelContextState: ChannelContextState | null;
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
    restoreChannelContext: (channelData: DraftChannelData) => void;
    clearChannelContext: () => void;
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

function isCustomEmojiElement(element: Element): boolean {
    return element.matches('img[data-custom-emoji], img.custom-emoji-inline[alt]');
}

function buildDraftReplyQuoteEntry(
    replyQuoteState: DraftReplyQuoteStateLike,
): DraftReplyQuoteEntryData {
    return {
        mode: replyQuoteState.mode,
        eventId: replyQuoteState.eventId,
        relayHints: replyQuoteState.relayHints,
        authorPubkey: replyQuoteState.authorPubkey,
        quoteNotificationEnabled: replyQuoteState.quoteNotificationEnabled,
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

function buildDraftChannelData(
    channelContextState: ChannelContextState | null,
): DraftChannelData | undefined {
    if (!channelContextState) {
        return undefined;
    }

    return {
        ...channelContextState,
        relayHints: [...channelContextState.relayHints],
        ...(channelContextState.channelRelays
            ? { channelRelays: [...channelContextState.channelRelays] }
            : {}),
    };
}

export function createDraftSavePayload({
    htmlContent,
    galleryItems,
    channelContextState,
    replyQuoteState,
}: CreateDraftSavePayloadParams): {
    content: string;
    galleryItems: MediaGalleryItem[];
    channelData?: DraftChannelData;
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
        channelData: buildDraftChannelData(channelContextState),
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
        if (isCustomEmojiElement(img)) {
            return;
        }

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
    restoreChannelContext,
    clearChannelContext,
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

    if (draft.channelData) {
        restoreChannelContext(draft.channelData);
    } else {
        clearChannelContext();
    }
}
