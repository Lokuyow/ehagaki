/**
 * Shared test helper for creating mock JSON responses in upload-related tests.
 * Provides reusable utilities for constructing Response objects with proper JSON serialization and headers.
 */

/**
 * Options for creating a JSON response.
 */
export interface JsonResponseOptions {
    /** The HTTP status code (default: 200) */
    status?: number;
    /** The HTTP status text (default: 'OK' or corresponding status text) */
    statusText?: string;
    /** Additional headers to include (content-type is set automatically) */
    headers?: Record<string, string>;
}

/**
 * Status text map for common HTTP status codes
 */
const STATUS_TEXT_MAP: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    415: 'Unsupported Media Type',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
};

/**
 * Creates a Response object with JSON content.
 * Automatically sets the Content-Type header to 'application/json'.
 *
 * @param data - The data to serialize as JSON
 * @param options - Options for the response (status, statusText, headers)
 * @returns A Response object with JSON content
 *
 * @example
 * // Simple success response
 * const response = createJsonResponse({ success: true });
 *
 * @example
 * // With custom status and headers
 * const response = createJsonResponse(
 *   { error: 'Not Found' },
 *   { status: 404, headers: { 'X-Custom': 'value' } }
 * );
 */
export function createJsonResponse(
    data: any,
    options: JsonResponseOptions = {}
): Response {
    const {
        status = 200,
        statusText = STATUS_TEXT_MAP[status] || 'Unknown',
        headers = {},
    } = options;

    const responseHeaders = new Headers({
        'content-type': 'application/json',
        ...headers,
    });

    return new Response(JSON.stringify(data), {
        status,
        statusText,
        headers: responseHeaders,
    });
}

/**
 * Creates a Response object for a successful upload with Blossom protocol format.
 * Blossom uses PUT uploads and returns a specific JSON structure.
 *
 * @param data - The upload response data containing url, sha256, size, type
 * @param options - Additional response options
 * @returns A Response object with Blossom upload response format
 *
 * @example
 * const response = createBlossomUploadResponse({
 *   url: 'https://blossom.band/hash.png',
 *   sha256: 'a'.repeat(64),
 *   size: 1024,
 *   type: 'image/png',
 * });
 */
export function createBlossomUploadResponse(
    data: {
        url: string;
        sha256: string;
        size: number;
        type: string;
    },
    options: JsonResponseOptions = {}
): Response {
    return createJsonResponse(data, { status: 200, ...options });
}

/**
 * Creates a Response object for a NIP-96 upload processing response.
 * NIP-96 uses multipart form uploads and returns processing or success status.
 *
 * @param status - The upload status ('processing' or 'success')
 * @param data - Additional data for the specific status
 * @param options - Additional response options
 * @returns A Response object with NIP-96 format
 *
 * @example
 * // Processing response
 * const response = createNip96ProcessingResponse({
 *   processing_url: 'https://server.com/upload/123',
 * }, { status: 202 });
 *
 * @example
 * // Success response
 * const response = createNip96SuccessResponse({
 *   nip94_event: {
 *     tags: [
 *       ['url', 'https://server.com/image.png'],
 *       ['x', 'hash'],
 *       ['m', 'image/png'],
 *     ],
 *   },
 * });
 */
export function createNip96ProcessingResponse(
    data: { processing_url: string },
    options: JsonResponseOptions = {}
): Response {
    return createJsonResponse(
        { status: 'processing', ...data },
        { status: 202, ...options }
    );
}

export function createNip96SuccessResponse(
    data: { nip94_event: any },
    options: JsonResponseOptions = {}
): Response {
    return createJsonResponse(
        { status: 'success', ...data },
        { status: 200, ...options }
    );
}

/**
 * Creates an error response with JSON content.
 *
 * @param message - The error message
 * @param status - The HTTP status code (default: 400)
 * @param options - Additional response options
 * @returns A Response object with error content
 *
 * @example
 * const response = createJsonErrorResponse(
 *   'File too large',
 *   413
 * );
 */
export function createJsonErrorResponse(
    message: string,
    status: number = 400,
    options: JsonResponseOptions = {}
): Response {
    return createJsonResponse(
        { error: message },
        { status, ...options }
    );
}

/**
 * Creates a Response object with empty body and custom status.
 * Useful for HEAD requests and status-only responses.
 *
 * @param status - The HTTP status code
 * @param headers - Response headers
 * @returns A Response object with no body
 *
 * @example
 * const response = createEmptyResponse(200, {
 *   'X-Max-Upload-Size': String(10 * 1024 * 1024),
 * });
 */
export function createEmptyResponse(
    status: number = 200,
    headers: Record<string, string> = {}
): Response {
    return new Response(null, {
        status,
        statusText: STATUS_TEXT_MAP[status] || 'Unknown',
        headers,
    });
}

/**
 * Creates a text response with custom status.
 * Useful for error responses that return plain text instead of JSON.
 *
 * @param text - The response text content
 * @param status - The HTTP status code
 * @param options - Additional response options
 * @returns A Response object with text content
 *
 * @example
 * const response = createTextResponse('Not Found', 404);
 */
export function createTextResponse(
    text: string,
    status: number = 200,
    options: JsonResponseOptions = {}
): Response {
    const { statusText = STATUS_TEXT_MAP[status] || 'Unknown', headers = {} } = options;

    return new Response(text, {
        status,
        statusText,
        headers: {
            'content-type': 'text/plain',
            ...headers,
        },
    });
}
