import type { SharedImageMetadata, SharedImageStoreState } from '../lib/types';

// --- 共有画像管理 ---
export const sharedImageStore = $state<SharedImageStoreState>({
    files: [],
    metadata: undefined,
    received: false
});

export function updateSharedImageStore(files: File[], metadata?: SharedImageMetadata[]): void {
    sharedImageStore.files = files;
    sharedImageStore.metadata = metadata;
    sharedImageStore.received = files.length > 0;
}

export function clearSharedImageStore(): void {
    sharedImageStore.files = [];
    sharedImageStore.metadata = undefined;
    sharedImageStore.received = false;
}

export function getSharedImageFiles(): File[] {
    return sharedImageStore.files;
}

export function getSharedImageMetadata(): SharedImageMetadata[] | undefined {
    return sharedImageStore.metadata;
}

export function isSharedImageReceived(): boolean {
    return sharedImageStore.received;
}

// --- URLクエリコンテンツ管理 ---
export const urlQueryContentStore = $state<{
    content: string | null;
    received: boolean;
}>({
    content: null,
    received: false
});

export function updateUrlQueryContentStore(content: string | null): void {
    urlQueryContentStore.content = content;
    urlQueryContentStore.received = !!content;
}

export function clearUrlQueryContentStore(): void {
    urlQueryContentStore.content = null;
    urlQueryContentStore.received = false;
}
