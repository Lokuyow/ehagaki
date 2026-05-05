export interface ExtractedSharedMedia {
    images?: Array<{
        type?: string;
        size?: number;
    }>;
}

interface UploadRequestLogger {
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
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

export async function processServiceWorkerUploadRequest<TSharedMedia extends ExtractedSharedMedia>({
    request,
    location,
    logger,
    extractMediaFromFormData,
    redirectClient,
    createRedirectResponse,
    setSharedMediaCache,
    summarizeExtractedData = summarizeExtractedSharedMedia,
}: {
    request: Pick<Request, 'url' | 'formData'>;
    location: Pick<Location, 'origin'>;
    logger: UploadRequestLogger;
    extractMediaFromFormData: (formData: FormData) => Promise<TSharedMedia | null>;
    redirectClient: () => Promise<Response>;
    createRedirectResponse: (
        path?: string,
        error?: string | null,
        location?: Pick<Location, 'origin'>,
    ) => Response;
    setSharedMediaCache: (sharedMedia: TSharedMedia) => void;
    summarizeExtractedData?: (extractedData: TSharedMedia) => unknown;
}): Promise<Response> {
    try {
        logger.log('SW: Processing upload request', request.url);

        const formData = await request.formData();
        const extractedData = await extractMediaFromFormData(formData);

        if (!extractedData) {
            logger.warn('SW: No media data found in FormData');
        } else {
            logger.log(
                'SW: Media data extracted successfully',
                summarizeExtractedData(extractedData),
            );
        }

        return await resolveUploadRequestOutcome({
            extractedData,
            location,
            redirectClient,
            createRedirectResponse,
            setSharedMediaCache,
        });
    } catch (error) {
        logger.error('SW: Upload processing error:', error);
        return createRedirectResponse(undefined, 'processing-error', location);
    }
}