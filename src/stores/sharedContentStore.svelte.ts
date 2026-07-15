import type { SharedMediaData, SharedMediaMetadata, SharedMediaStoreState } from '../lib/types';

// --- 共有メディア管理 ---
export const sharedMediaStore = $state<SharedMediaStoreState>({
    files: [],
    metadata: undefined,
    title: '',
    text: '',
    url: '',
    shareId: null,
    bodyStatus: 'not-applicable',
    automaticRetryCount: 0,
    received: false
});

export function updateSharedMediaStore(data: SharedMediaData): void {
    sharedMediaStore.files = data.images;
    sharedMediaStore.metadata = data.metadata;
    sharedMediaStore.title = data.title ?? '';
    sharedMediaStore.text = data.text ?? '';
    sharedMediaStore.url = data.url ?? '';
    sharedMediaStore.shareId = data.shareId ?? null;
    sharedMediaStore.bodyStatus = data.bodyStatus ?? 'not-applicable';
    sharedMediaStore.automaticRetryCount = data.automaticRetryCount ?? 0;
    sharedMediaStore.received = data.images.length > 0 || !!data.title || !!data.text || !!data.url;
}

export function clearSharedMediaStore(): void {
    sharedMediaStore.files = [];
    sharedMediaStore.metadata = undefined;
    sharedMediaStore.title = '';
    sharedMediaStore.text = '';
    sharedMediaStore.url = '';
    sharedMediaStore.shareId = null;
    sharedMediaStore.bodyStatus = 'not-applicable';
    sharedMediaStore.automaticRetryCount = 0;
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
