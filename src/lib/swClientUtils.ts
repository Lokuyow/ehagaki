export function createSharedClientUrl(basePath: string, origin: string): string {
    const url = new URL(basePath, origin);
    url.searchParams.set('shared', 'true');
    return url.href;
}

export async function persistSharedMediaIfPresent<T>(params: {
    sharedCache: T | null | undefined;
    persist: (sharedCache: T) => Promise<void>;
    onPersisted?: () => void;
    onError?: (error: unknown) => void;
}): Promise<boolean> {
    const { sharedCache, persist, onPersisted, onError } = params;

    if (!sharedCache) {
        return false;
    }

    try {
        await persist(sharedCache);
        onPersisted?.();
        return true;
    } catch (error) {
        onError?.(error);
        return false;
    }
}