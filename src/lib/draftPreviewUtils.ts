import { createSanitizedDraftContainer } from './draftHtmlSanitizer';
import type { MediaGalleryItem } from './types';

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
