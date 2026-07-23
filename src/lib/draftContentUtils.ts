import type {
    ChannelContextState,
    Draft,
    DraftChannelData,
    DraftReplyQuoteData,
    MediaGalleryItem,
    ReplyQuoteComposerState,
    ReplyQuoteState,
    DraftReplyQuoteEntryData,
    DraftReplyNotificationRecipientData,
    NostrEvent,
} from './types';
import { createSanitizedDraftContainer, sanitizeDraftHtml } from './draftHtmlSanitizer';
import { serializeDraftChannelContext } from './draftChannelContext';
import type { ChannelContextProvenance } from './channelContextRuntime';

type DraftReplyQuoteStateLike = Pick<
    ReplyQuoteState,
    | 'mode'
    | 'eventId'
    | 'relayHints'
    | 'authorPubkey'
    | 'quoteNotificationEnabled'
    | 'replyNotificationRecipients'
    | 'authorDisplayName'
    | 'authorPicture'
    | 'referencedEvent'
    | 'rootEventId'
    | 'rootRelayHint'
    | 'rootPubkey'
>;
interface CreateDraftSavePayloadParams {
    htmlContent: string;
    galleryItems: MediaGalleryItem[];
    channelContextState: ChannelContextState | null;
    channelContextProvenance?: ChannelContextProvenance | null;
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

function cloneStringArray(value: string[] | null | undefined): string[] {
    return Array.from(value ?? []);
}

function normalizePresentationValue(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function buildDraftReplyNotificationRecipient(
    recipient: NonNullable<ReplyQuoteState['replyNotificationRecipients']>[number],
): DraftReplyNotificationRecipientData {
    const picture = normalizePresentationValue(recipient.picture);
    return {
        pubkey: recipient.pubkey,
        displayName: normalizePresentationValue(recipient.displayName),
        ...(picture ? { picture } : {}),
        enabled: recipient.enabled,
    };
}

function cloneReferencedEvent(event: NostrEvent | null): NostrEvent | null {
    if (!event) {
        return null;
    }

    return {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        kind: event.kind,
        tags: event.tags.map((tag) => Array.from(tag)),
        content: event.content,
        sig: event.sig,
    };
}

function buildDraftReplyQuoteEntry(
    replyQuoteState: DraftReplyQuoteStateLike,
): DraftReplyQuoteEntryData {
    const authorPicture = normalizePresentationValue(replyQuoteState.authorPicture);
    const replyNotificationRecipients = replyQuoteState.replyNotificationRecipients?.map(
        buildDraftReplyNotificationRecipient,
    );
    return {
        mode: replyQuoteState.mode,
        eventId: replyQuoteState.eventId,
        relayHints: cloneStringArray(replyQuoteState.relayHints),
        authorPubkey: replyQuoteState.authorPubkey,
        quoteNotificationEnabled: replyQuoteState.quoteNotificationEnabled,
        ...(replyNotificationRecipients ? { replyNotificationRecipients } : {}),
        authorDisplayName: normalizePresentationValue(replyQuoteState.authorDisplayName),
        ...(authorPicture ? { authorPicture } : {}),
        referencedEvent: cloneReferencedEvent(replyQuoteState.referencedEvent),
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

function buildDraftGalleryItem(item: MediaGalleryItem): MediaGalleryItem {
    return {
        id: item.id,
        type: item.type,
        src: item.src,
        isPlaceholder: false,
        ...(item.blurhash ? { blurhash: item.blurhash } : {}),
        ...(item.ox ? { ox: item.ox } : {}),
        ...(item.x ? { x: item.x } : {}),
        ...(item.dimensions ? { dimensions: { ...item.dimensions } } : {}),
        ...(item.size ? { size: item.size } : {}),
        ...(item.mimeType ? { mimeType: item.mimeType } : {}),
        ...(item.alt ? { alt: item.alt } : {}),
        ...(item.dim ? { dim: item.dim } : {}),
        ...(item.uploadProtocol ? { uploadProtocol: item.uploadProtocol } : {}),
    };
}

export function createDraftSavePayload({
    htmlContent,
    galleryItems,
    channelContextState,
    channelContextProvenance = null,
    replyQuoteState,
}: CreateDraftSavePayloadParams): {
    content: string;
    galleryItems: MediaGalleryItem[];
    channelData?: DraftChannelData;
    replyQuoteData?: DraftReplyQuoteData;
} | null {
    const sanitizedHtmlContent = sanitizeDraftHtml(htmlContent);
    const persistedGalleryItems = galleryItems
        .filter((item) => !item.isPlaceholder)
        .map(buildDraftGalleryItem);
    const channelData = serializeDraftChannelContext(
        channelContextState,
        channelContextProvenance,
    );
    const replyQuoteData = buildDraftReplyQuoteData(replyQuoteState);
    const hasComposerContext = !!channelData || !!replyQuoteData;

    if (
        (!sanitizedHtmlContent || sanitizedHtmlContent === '<p></p>') &&
        persistedGalleryItems.length === 0 &&
        !hasComposerContext
    ) {
        return null;
    }

    return {
        content: sanitizedHtmlContent,
        galleryItems: persistedGalleryItems,
        channelData,
        replyQuoteData,
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
            size: (() => {
                const raw = img.getAttribute('size');
                if (!raw) return undefined;
                const parsed = Number(raw);
                return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
            })(),
            uploadProtocol: (img.getAttribute('uploadprotocol') ?? undefined) as MediaGalleryItem['uploadProtocol'],
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
