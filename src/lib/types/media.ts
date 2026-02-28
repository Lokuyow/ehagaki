// --- Image, Media Gallery, SharedMedia関連型定義 ---

export interface ImageDimensions {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
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
    mimeType?: string;
    alt?: string;
    dim?: string;
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
    received: boolean;
}

export interface SharedMediaData {
    images: File[];
    metadata?: SharedMediaMetadata[];
}

export interface SharedMediaProcessingResult {
    success: boolean;
    data?: SharedMediaData;
    error?: string;
    fromServiceWorker?: boolean;
    fromIndexedDB?: boolean;
}
