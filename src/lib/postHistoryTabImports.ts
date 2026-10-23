// Share code-only imports between intent preloading and the mounted dialog.
// Failed imports remain retryable; no account or tab instances live here.
let postsImport: Promise<typeof import("../components/PostHistoryTabContent.svelte")> | null = null;
let mediaImport: Promise<typeof import("../components/UploadedMediaTabContent.svelte")> | null = null;

export function importPostHistoryPosts() {
    return postsImport ??= import("../components/PostHistoryTabContent.svelte").catch((error) => {
        postsImport = null;
        throw error;
    });
}

export function importPostHistoryMedia() {
    return mediaImport ??= import("../components/UploadedMediaTabContent.svelte").catch((error) => {
        mediaImport = null;
        throw error;
    });
}
