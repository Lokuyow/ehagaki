import { describe, expect, it, vi } from 'vitest';

import { createMockConsole } from '../helpers';
import {
    processServiceWorkerUploadRequest,
    resolveUploadRequestOutcome,
    summarizeExtractedSharedMedia,
    type ExtractedSharedMedia,
} from '../../lib/swUploadRequestUtils';

const EXAMPLE_LOCATION: Pick<Location, 'origin'> = { origin: 'https://example.com' };

const createRedirectResponseSpy = () => vi.fn(() => new Response(null, { status: 303 }));

const createProcessServiceWorkerUploadRequestDeps = ({
    formData = vi.fn(async () => new FormData()),
    logger = createMockConsole(),
    extractMediaFromFormData = vi.fn(async () => null),
    redirectClient = vi.fn(async () => new Response(null, { status: 200 })),
    createRedirectResponse = createRedirectResponseSpy(),
    setSharedMediaCache = vi.fn((_sharedMedia: ExtractedSharedMedia) => undefined),
    requestUrl = 'https://example.com/upload',
}: {
    formData?: () => Promise<FormData>;
    logger?: ReturnType<typeof createMockConsole>;
    extractMediaFromFormData?: (formData: FormData) => Promise<ExtractedSharedMedia | null>;
    redirectClient?: () => Promise<Response>;
    createRedirectResponse?: (path?: string, error?: string | null, location?: Pick<Location, 'origin'>) => Response;
    setSharedMediaCache?: (sharedMedia: ExtractedSharedMedia) => void;
    requestUrl?: string;
} = {}) => ({
    request: { url: requestUrl, formData },
    location: EXAMPLE_LOCATION,
    logger,
    extractMediaFromFormData,
    redirectClient,
    createRedirectResponse,
    setSharedMediaCache,
});

describe('swUploadRequestUtils', () => {
    it('summarizeExtractedSharedMedia は images の概要を返す', () => {
        expect(
            summarizeExtractedSharedMedia({
                images: [{ type: 'image/png', size: 123 }],
            }),
        ).toEqual({
            hasImages: true,
            imageCount: 1,
            firstImageType: 'image/png',
            firstImageSize: 123,
        });
    });

    it('resolveUploadRequestOutcome は media がない時に no-image redirect を返す', async () => {
        const createRedirectResponse = createRedirectResponseSpy();
        const redirectClient = vi.fn();
        const setSharedMediaCache = vi.fn();

        const result = await resolveUploadRequestOutcome({
            extractedData: null,
            location: EXAMPLE_LOCATION,
            redirectClient,
            createRedirectResponse,
            setSharedMediaCache,
        });

        expect(result.status).toBe(303);
        expect(createRedirectResponse).toHaveBeenCalledWith(undefined, 'no-image', EXAMPLE_LOCATION);
        expect(redirectClient).not.toHaveBeenCalled();
        expect(setSharedMediaCache).not.toHaveBeenCalled();
    });

    it('resolveUploadRequestOutcome は media を cache して redirectClient を呼ぶ', async () => {
        const redirectResponse = new Response(null, { status: 200 });
        const redirectClient = vi.fn(async () => redirectResponse);
        const setSharedMediaCache = vi.fn();
        const media = { images: [{ type: 'image/png', size: 123 }] };

        const result = await resolveUploadRequestOutcome({
            extractedData: media,
            location: EXAMPLE_LOCATION,
            redirectClient,
            createRedirectResponse: vi.fn(),
            setSharedMediaCache,
        });

        expect(result).toBe(redirectResponse);
        expect(setSharedMediaCache).toHaveBeenCalledWith(media);
        expect(redirectClient).toHaveBeenCalledOnce();
    });

    it('processServiceWorkerUploadRequest は media がない時に warning を出して no-image redirect を返す', async () => {
        const createRedirectResponse = createRedirectResponseSpy();
        const logger = createMockConsole();

        const result = await processServiceWorkerUploadRequest({
            ...createProcessServiceWorkerUploadRequestDeps({
                logger,
                createRedirectResponse,
                formData: vi.fn(async () => new FormData()),
                extractMediaFromFormData: vi.fn(async () => null),
            }),
        });

        expect(result.status).toBe(303);
        expect(logger.log).toHaveBeenCalledWith('SW: Processing upload request', 'https://example.com/upload');
        expect(logger.warn).toHaveBeenCalledWith('SW: No media data found in FormData');
        expect(createRedirectResponse).toHaveBeenCalledWith(undefined, 'no-image', EXAMPLE_LOCATION);
    });

    it('processServiceWorkerUploadRequest は error 時に processing-error redirect を返す', async () => {
        const error = new Error('broken formdata');
        const logger = createMockConsole();
        const createRedirectResponse = createRedirectResponseSpy();

        const result = await processServiceWorkerUploadRequest({
            ...createProcessServiceWorkerUploadRequestDeps({
                logger,
                createRedirectResponse,
                formData: vi.fn(async () => {
                    throw error;
                }),
                extractMediaFromFormData: vi.fn(async () => null),
            }),
        });

        expect(result.status).toBe(303);
        expect(logger.error).toHaveBeenCalledWith('SW: Upload processing error:', error);
        expect(createRedirectResponse).toHaveBeenCalledWith(undefined, 'processing-error', EXAMPLE_LOCATION);
    });
});