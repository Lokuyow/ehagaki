import DOMPurify from 'dompurify';
import { nip19 } from 'nostr-tools';
import { DRAFT_PREVIEW_LENGTH } from './constants';
import { createSanitizedDraftContainer } from './draftHtmlSanitizer';
import type {
    Draft,
    DraftChannelData,
    DraftReplyQuoteData,
    DraftReplyQuoteEntryData,
    MediaGalleryItem,
} from './types';

export type DraftContextKind = 'channel' | 'reply' | 'quote';

export interface DraftContextLabels {
    channel: string;
    reply: string;
    quote: string;
    image: string;
    video: string;
}

export interface DraftContextDisplayItem {
    kind: DraftContextKind;
    label: string;
    name: string;
    detail: string;
}

export interface DraftListDisplay {
    title: string;
    bodyPreview: string;
    contexts: DraftContextDisplayItem[];
}

function sanitizeText(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    return DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    }).trim();
}

function shortenIdentifier(value: string): string {
    if (value.length <= 16) {
        return value;
    }

    return `${value.slice(0, 10)}...${value.slice(-4)}`;
}

function formatPubkey(pubkey: string | null): string {
    if (!pubkey) {
        return '';
    }

    try {
        const npub = nip19.npubEncode(pubkey);
        return `${npub.slice(0, 12)}...${npub.slice(-4)}`;
    } catch {
        return shortenIdentifier(pubkey);
    }
}

function getReplyQuoteName(entry: DraftReplyQuoteEntryData): string {
    return entry.authorDisplayName?.trim()
        || formatPubkey(entry.authorPubkey)
        || shortenIdentifier(entry.eventId);
}

function getChannelName(channel: DraftChannelData): string {
    return channel.name?.trim() || `ID: ${shortenIdentifier(channel.eventId)}`;
}

function isSelectionReplyQuoteData(
    data: DraftReplyQuoteData,
): data is { reply: DraftReplyQuoteEntryData | null; quotes: DraftReplyQuoteEntryData[] } {
    return 'reply' in data || 'quotes' in data;
}

function getReplyEntry(data?: DraftReplyQuoteData): DraftReplyQuoteEntryData | null {
    if (!data) {
        return null;
    }

    if (isSelectionReplyQuoteData(data)) {
        return data.reply ?? null;
    }

    return data.mode === 'reply' ? data : null;
}

function getQuoteEntries(data?: DraftReplyQuoteData): DraftReplyQuoteEntryData[] {
    if (!data) {
        return [];
    }

    if (isSelectionReplyQuoteData(data)) {
        return data.quotes;
    }

    return data.mode === 'quote' ? [data] : [];
}

function getCustomEmojiShortcode(element: Element): string {
    const shortcode = element.getAttribute('data-shortcode')?.trim();
    if (shortcode) {
        return shortcode.replace(/^:+|:+$/g, '');
    }

    const alt = element.getAttribute('alt')?.trim() ?? '';
    const altMatch = alt.match(/^:([^:]+):$/);
    return altMatch?.[1]?.trim() ?? '';
}

function replaceCustomEmojiWithShortcodeText(container: HTMLElement, documentObj: Document): void {
    container
        .querySelectorAll('img[data-custom-emoji], img.custom-emoji-inline[alt]')
        .forEach((element) => {
            const shortcode = getCustomEmojiShortcode(element);
            if (shortcode) {
                element.replaceWith(documentObj.createTextNode(`:${shortcode}:`));
            }
        });
}

function hasGalleryMedia(galleryItems: MediaGalleryItem[] | undefined, type: 'image' | 'video'): boolean {
    return galleryItems?.some((item) => !item.isPlaceholder && item.type === type) ?? false;
}

function createBodyPreview(
    draft: Draft,
    labels: DraftContextLabels,
    documentObj: Document,
): string {
    const container = createSanitizedDraftContainer(draft.content, documentObj);
    replaceCustomEmojiWithShortcodeText(container, documentObj);

    const hasEditorImage = container.querySelector('img:not([data-custom-emoji]):not(.custom-emoji-inline[alt])') !== null;
    const hasEditorVideo = container.querySelector('video') !== null;
    const mediaLabels: string[] = [];

    if (hasEditorImage || hasGalleryMedia(draft.galleryItems, 'image')) {
        mediaLabels.push(labels.image);
    }
    if (hasEditorVideo || hasGalleryMedia(draft.galleryItems, 'video')) {
        mediaLabels.push(labels.video);
    }

    const text = container.textContent || container.innerText || '';
    const firstLine = text.split('\n').find((line) => line.trim())?.trim() ?? '';
    const mediaText = mediaLabels.join('');

    if (!firstLine) {
        return mediaText;
    }

    if (!mediaText) {
        return firstLine.length > DRAFT_PREVIEW_LENGTH
            ? `${firstLine.substring(0, DRAFT_PREVIEW_LENGTH)}...`
            : firstLine;
    }

    const combined = `${firstLine} ${mediaText}`;
    if (combined.length <= DRAFT_PREVIEW_LENGTH) {
        return combined;
    }

    const maxTextLength = DRAFT_PREVIEW_LENGTH - mediaText.length - 4;
    return maxTextLength > 0
        ? `${firstLine.substring(0, maxTextLength)}... ${mediaText}`
        : mediaText;
}

export function createDraftListDisplay(
    draft: Draft,
    labels: DraftContextLabels,
    documentObj: Document = document,
): DraftListDisplay {
    const contexts: DraftContextDisplayItem[] = [];

    if (draft.channelData) {
        contexts.push({
            kind: 'channel',
            label: labels.channel,
            name: getChannelName(draft.channelData),
            detail: sanitizeText(draft.channelData.about),
        });
    }

    const reply = getReplyEntry(draft.replyQuoteData);
    if (reply) {
        contexts.push({
            kind: 'reply',
            label: labels.reply,
            name: getReplyQuoteName(reply),
            detail: sanitizeText(reply.referencedEvent?.content),
        });
    }

    getQuoteEntries(draft.replyQuoteData).forEach((quote) => {
        contexts.push({
            kind: 'quote',
            label: labels.quote,
            name: getReplyQuoteName(quote),
            detail: sanitizeText(quote.referencedEvent?.content),
        });
    });

    const bodyPreview = createBodyPreview(draft, labels, documentObj);
    const title = contexts.length > 0
        ? contexts.map((context) => `${context.label}: ${context.name}`).join(' / ')
        : bodyPreview || draft.preview;

    return {
        title,
        bodyPreview,
        contexts,
    };
}
