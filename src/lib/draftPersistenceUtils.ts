import type { Draft, DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from './types';

type DraftPreviewBuilder = (
    htmlContent: string,
    galleryItems?: MediaGalleryItem[],
    replyQuoteData?: DraftReplyQuoteData,
    channelData?: DraftChannelData,
) => string;

export function createPersistedDraft({
    id,
    htmlContent,
    timestamp,
    galleryItems,
    replyQuoteData,
    channelData,
    buildPreview,
}: {
    id: string;
    htmlContent: string;
    timestamp: number;
    galleryItems?: MediaGalleryItem[];
    replyQuoteData?: DraftReplyQuoteData;
    channelData?: DraftChannelData;
    buildPreview: DraftPreviewBuilder;
}): Draft {
    return {
        id,
        content: htmlContent,
        preview: buildPreview(htmlContent, galleryItems, replyQuoteData, channelData),
        timestamp,
        galleryItems: galleryItems && galleryItems.length > 0 ? galleryItems : undefined,
        channelData: channelData || undefined,
        replyQuoteData: replyQuoteData || undefined,
    };
}