import type { SharedImageMetadata, SharedImageStoreState } from '../lib/types';

// --- 共有画像管理 ---
export const sharedImageStore = $state<SharedImageStoreState>({
    file: null,
    metadata: undefined,
    received: false
});

export function updateSharedImageStore(file: File | null, metadata?: SharedImageMetadata): void {
    sharedImageStore.file = file;
    sharedImageStore.metadata = metadata;
    sharedImageStore.received = !!file;
}

export function clearSharedImageStore(): void {
    sharedImageStore.file = null;
    sharedImageStore.metadata = undefined;
    sharedImageStore.received = false;
}

export function getSharedImageFile(): File | null {
    return sharedImageStore.file;
}

export function getSharedImageMetadata(): SharedImageMetadata | undefined {
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
