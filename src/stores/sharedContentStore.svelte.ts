import type { SharedMediaMetadata, SharedMediaStoreState } from '../lib/types';

// --- 共有メディア管理 ---
export const sharedMediaStore = $state<SharedMediaStoreState>({
    files: [],
    metadata: undefined,
    received: false
});

export function updateSharedMediaStore(files: File[], metadata?: SharedMediaMetadata[]): void {
    sharedMediaStore.files = files;
    sharedMediaStore.metadata = metadata;
    sharedMediaStore.received = files.length > 0;
}

export function clearSharedMediaStore(): void {
    sharedMediaStore.files = [];
    sharedMediaStore.metadata = undefined;
    sharedMediaStore.received = false;
}

export function getSharedMediaFiles(): File[] {
    return sharedMediaStore.files;
}

export function getSharedMediaMetadata(): SharedMediaMetadata[] | undefined {
    return sharedMediaStore.metadata;
}

export function isSharedMediaReceived(): boolean {
    return sharedMediaStore.received;
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
