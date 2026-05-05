const TRANSPARENT_PNG_DATA = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

export function createTransparentImageResponse(statusCode = 200): Response {
    return new Response(TRANSPARENT_PNG_DATA, {
        status: statusCode,
        statusText: statusCode === 200 ? 'OK' : 'Error',
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': statusCode === 200 ? 'max-age=31536000' : 'no-cache',
            'Access-Control-Allow-Origin': '*',
        },
    });
}

export function createCorsRequest(
    url: string,
    options: RequestInit = {},
): Request {
    const { headers: optionHeaders, ...requestOptions } = options;
    const mode = requestOptions.mode ?? 'cors';
    const headers = new Headers({
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        ...(optionHeaders ?? {}),
    });

    return new Request(url, {
        method: 'GET',
        mode,
        credentials: 'omit',
        cache: requestOptions.cache ?? 'default',
        redirect: 'follow',
        ...requestOptions,
        headers,
    });
}

export function createServiceWorkerRedirectResponse({
    path,
    error = null,
    location,
    shared = true,
}: {
    path: string;
    error?: string | null;
    location: Pick<Location, 'origin'>;
    shared?: boolean;
}): Response {
    const url = new URL(path, location.origin);
    if (shared) {
        url.searchParams.set('shared', 'true');
    }
    if (error) {
        url.searchParams.set('error', error);
    }
    return Response.redirect(url.href, 303);
}

export async function extractSharedMediaFromFormData(
    formData: FormData,
    getTimestamp: () => string = () => new Date().toISOString(),
): Promise<{
    images: File[];
    metadata: Array<{
        name: string;
        type: string;
        size: number;
        timestamp: string;
    }>;
} | null> {
    const mediaFiles = formData.getAll('media');
    if (!mediaFiles || mediaFiles.length === 0) {
        return null;
    }

    const validFiles = mediaFiles.filter(
        (entry): entry is File => entry instanceof File && entry.size > 0,
    );
    if (validFiles.length === 0) {
        return null;
    }

    return {
        images: validFiles,
        metadata: validFiles.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            timestamp: getTimestamp(),
        })),
    };
}