// --- Image, Media Gallery, SharedMedia関連型定義 ---

export interface ImageDimensions {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
}

// Fullscreen media navigation
export interface FullscreenMediaItem {
    id?: string;
    src: string;
    alt?: string;
    type: 'image' | 'video';
    width?: number;
    height?: number;
    dim?: string;
}

// Media Gallery types
export interface MediaGalleryItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    isPlaceholder: boolean;
    blurhash?: string;
    ox?: string;
    x?: string;
    dimensions?: ImageDimensions;
    size?: number;
    mimeType?: string;
    alt?: string;
    dim?: string;
    uploadProtocol?: 'blossom' | 'nip96' | 'custom-http';
}

export interface SharedMediaMetadata {
    name?: string;
    type?: string;
    size?: number;
    timestamp?: string;
}

export interface SharedMediaStoreState {
    files: File[];
    metadata?: SharedMediaMetadata[];
    title: string;
    text: string;
    url: string;
    shareId: string | null;
    bodyStatus: SharedBodyStatus;
    automaticRetryCount: number;
    received: boolean;
}

export type SharedBodyStatus = 'pending' | 'applied' | 'not-applicable';

export interface SharedMediaData {
    images: File[];
    metadata?: SharedMediaMetadata[];
    title?: string;
    text?: string;
    url?: string;
    shareId?: string;
    bodyStatus?: SharedBodyStatus;
    automaticRetryCount?: number;
}

export interface SharedMediaProcessingResult {
    success: boolean;
    data?: SharedMediaData;
    error?: string;
    fromServiceWorker?: boolean;
    fromIndexedDB?: boolean;
}
