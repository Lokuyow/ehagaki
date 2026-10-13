import type { AuthService, UploadDestination } from "../types/upload";

export type ManagedUploadProtocol = "nip96" | "blossom";
export type UploadMediaDeleteId = { protocol: ManagedUploadProtocol; sha256: string };

export interface UploadedMediaItem {
    id: string;
    destinationId: string;
    protocol: ManagedUploadProtocol;
    serverUrl: string;
    kind: "image" | "video";
    url: string | null;
    mimeType?: string;
    uploadedAt?: number;
    size?: number;
    deleteId: UploadMediaDeleteId | null;
}

export interface UploadMediaContext {
    protocol: ManagedUploadProtocol;
    destinationId: string;
    serverUrl: string;
    endpoint: string;
}

export type UploadMediaPageCursor =
    | { protocol: "nip96"; page: number; count: number }
    | { protocol: "blossom"; cursor: string; limit: number };

export interface UploadMediaPage {
    items: UploadedMediaItem[];
    rawCount: number;
    excludedCount: number;
    invalidCount: number;
    nextPage: UploadMediaPageCursor | null;
    context: UploadMediaContext;
}

export interface UploadMediaOperationParams {
    destination: UploadDestination;
    expectedPubkey: string;
    assertSession: () => void;
    authService: AuthService;
    fetch: typeof fetch;
    signal?: AbortSignal;
    onDeleteDispatched?: () => void;
}

export interface UploadMediaListParams extends UploadMediaOperationParams {
    page?: UploadMediaPageCursor | null;
    context?: UploadMediaContext | null;
}

export interface UploadMediaDeleteParams extends UploadMediaOperationParams {
    item: UploadedMediaItem;
    context: UploadMediaContext;
}

export type UploadMediaErrorCode =
    | "unavailable" | "authentication" | "forbidden" | "payment"
    | "rateLimited" | "serverError" | "network" | "invalidResponse"
    | "invalidDestination" | "unknownDelete";

/** Carries safe diagnostics only; never retain request headers or signer errors. */
export class UploadMediaError extends Error {
    constructor(
        readonly code: UploadMediaErrorCode,
        readonly status?: number,
        readonly diagnostic?: string,
        readonly retryAt?: number,
    ) {
        super(code);
        this.name = "UploadMediaError";
    }
}
