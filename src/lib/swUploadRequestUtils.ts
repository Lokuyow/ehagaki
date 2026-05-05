export interface ExtractedSharedMedia {
    images?: Array<{
        type?: string;
        size?: number;
    }>;
}

export function summarizeExtractedSharedMedia(
    extractedData: ExtractedSharedMedia,
): {
    hasImages: boolean;
    imageCount: number;
    firstImageType: string | undefined;
    firstImageSize: number | undefined;
} {
    return {
        hasImages: Boolean(extractedData.images?.length),
        imageCount: extractedData.images?.length ?? 0,
        firstImageType: extractedData.images?.[0]?.type,
        firstImageSize: extractedData.images?.[0]?.size,
    };
}

export async function resolveUploadRequestOutcome<TSharedMedia>({
    extractedData,
    location,
    redirectClient,
    createRedirectResponse,
    setSharedMediaCache,
}: {
    extractedData: TSharedMedia | null;
    location: Pick<Location, 'origin'>;
    redirectClient: () => Promise<Response>;
    createRedirectResponse: (
        path?: string,
        error?: string | null,
        location?: Pick<Location, 'origin'>,
    ) => Response;
    setSharedMediaCache: (sharedMedia: TSharedMedia) => void;
}): Promise<Response> {
    if (!extractedData) {
        return createRedirectResponse(undefined, 'no-image', location);
    }

    setSharedMediaCache(extractedData);
    return await redirectClient();
}