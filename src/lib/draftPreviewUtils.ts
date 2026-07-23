import { createSanitizedDraftContainer } from './draftHtmlSanitizer';
import { DRAFT_PREVIEW_LENGTH } from './constants';
import { get as getStore } from 'svelte/store';
import { locale, _ } from 'svelte-i18n';
import type { MediaGalleryItem } from './types';
import type { DraftChannelData, DraftReplyQuoteData } from './types';
import { getDraftEffectiveChannelContext } from './draftChannelContext';

export interface DraftPreviewParts {
    firstLine: string;
    hasImage: boolean;
    hasVideo: boolean;
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
            if (!shortcode) {
                return;
            }

            element.replaceWith(documentObj.createTextNode(`:${shortcode}:`));
        });
}

function hasGalleryMedia(galleryItems: MediaGalleryItem[] | undefined, type: 'image' | 'video'): boolean {
    return galleryItems?.some((item) => !item.isPlaceholder && item.type === type) ?? false;
}

export function extractDraftPreviewParts(
    htmlContent: string,
    galleryItems: MediaGalleryItem[] | undefined,
    documentObj: Document,
): DraftPreviewParts {
    const container = createSanitizedDraftContainer(htmlContent, documentObj);
    replaceCustomEmojiWithShortcodeText(container, documentObj);

    const hasEditorImage = container.querySelector('img:not([data-custom-emoji]):not(.custom-emoji-inline[alt])') !== null;
    const hasEditorVideo = container.querySelector('video') !== null;
    const text = container.textContent || container.innerText || '';
    const firstLine = text.split('\n').filter((line) => line.trim())[0] ?? '';

    return {
        firstLine,
        hasImage: hasEditorImage || hasGalleryMedia(galleryItems, 'image'),
        hasVideo: hasEditorVideo || hasGalleryMedia(galleryItems, 'video'),
    };
}

export function generateDraftPreview(
    htmlContent: string,
    galleryItems?: MediaGalleryItem[],
    replyQuoteData?: DraftReplyQuoteData,
    channelData?: DraftChannelData,
): string {
    const { firstLine, hasImage, hasVideo } = extractDraftPreviewParts(
        htmlContent,
        galleryItems,
        document,
    );

    const loc = (getStore(locale) as string) || 'en';
    const t = getStore(_) as (id: string | { id: string }, values?: Record<string, any>) => string;

    let imageLabel = '[画像]';
    let videoLabel = '[動画]';
    try {
        imageLabel = t('draft.media.image') || (loc.startsWith('ja') ? '[画像]' : '[Image]');
        videoLabel = t('draft.media.video') || (loc.startsWith('ja') ? '[動画]' : '[Video]');
    } catch {
        imageLabel = loc.startsWith('ja') ? '[画像]' : '[Image]';
        videoLabel = loc.startsWith('ja') ? '[動画]' : '[Video]';
    }

    let replyLabel = '[リプライ]';
    let quoteLabel = '[引用]';
    try {
        replyLabel = t('draft.media.reply') || (loc.startsWith('ja') ? '[リプライ]' : '[Reply]');
        quoteLabel = t('draft.media.quote') || (loc.startsWith('ja') ? '[引用]' : '[Quote]');
    } catch {
        replyLabel = loc.startsWith('ja') ? '[リプライ]' : '[Reply]';
        quoteLabel = loc.startsWith('ja') ? '[引用]' : '[Quote]';
    }

    const mediaLabels: string[] = [];
    const hasReply = !!replyQuoteData
        && ('reply' in replyQuoteData ? !!replyQuoteData.reply : replyQuoteData.mode === 'reply');
    const quoteCount = !replyQuoteData
        ? 0
        : 'quotes' in replyQuoteData
            ? replyQuoteData.quotes.length
            : replyQuoteData.mode === 'quote'
                ? 1
                : 0;
    if (hasReply) mediaLabels.push(replyLabel);
    if (quoteCount > 0) mediaLabels.push(quoteLabel);
    const channelContext = channelData
        ? getDraftEffectiveChannelContext(channelData)
        : null;
    if (channelContext?.name) mediaLabels.push(`#${channelContext.name}`);
    if (hasImage) mediaLabels.push(imageLabel);
    if (hasVideo) mediaLabels.push(videoLabel);
    const mediaText = mediaLabels.join('');

    if (firstLine) {
        if (mediaText) {
            const combined = `${firstLine} ${mediaText}`;
            if (combined.length > DRAFT_PREVIEW_LENGTH) {
                const maxTextLength = DRAFT_PREVIEW_LENGTH - mediaText.length - 2;
                if (maxTextLength > 0) {
                    return `${firstLine.substring(0, maxTextLength)}… ${mediaText}`;
                }
                return mediaText;
            }
            return combined;
        }
        if (firstLine.length > DRAFT_PREVIEW_LENGTH) {
            return firstLine.substring(0, DRAFT_PREVIEW_LENGTH) + '…';
        }
        return firstLine;
    }

    if (mediaText) {
        return mediaText;
    }

    try {
        return t('draft.no_content') || (loc.startsWith('ja') ? '(内容なし)' : '(No content)');
    } catch {
        return loc.startsWith('ja') ? '(内容なし)' : '(No content)';
    }
}
