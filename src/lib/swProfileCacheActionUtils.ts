import { getDuplicateProfileCacheRequests } from './swCacheUtils';

interface CacheActionLogger {
    log: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}

interface CacheDeleteStorage {
    delete: (cacheName: string) => Promise<boolean>;
}

interface RequestLike {
    url: string;
}

interface ProfileCache<TRequest extends RequestLike> {
    keys: () => Promise<TRequest[]>;
    delete: (request: TRequest) => Promise<boolean>;
}

interface CacheOpenStorage<TRequest extends RequestLike> {
    open: (cacheName: string) => Promise<ProfileCache<TRequest>>;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

export async function clearServiceWorkerProfileCache({
    cacheStorage,
    cacheName,
    logger,
}: {
    cacheStorage: CacheDeleteStorage;
    cacheName: string;
    logger: CacheActionLogger;
}): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const deleted = await cacheStorage.delete(cacheName);
        logger.log('プロフィール画像キャッシュクリア:', deleted);
        return { success: true };
    } catch (error) {
        logger.error('プロフィールキャッシュクリアエラー:', error);
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function cleanupServiceWorkerDuplicateProfileCache<
    TRequest extends RequestLike,
>({
    cacheStorage,
    cacheName,
    logger,
    getBaseUrl,
}: {
    cacheStorage: CacheOpenStorage<TRequest>;
    cacheName: string;
    logger: CacheActionLogger;
    getBaseUrl: (url: string) => string | null;
}): Promise<{ success: true; deletedCount: number } | { success: false; error: string }> {
    try {
        const cache = await cacheStorage.open(cacheName);
        const keys = await cache.keys();
        const duplicateKeys = getDuplicateProfileCacheRequests(keys, getBaseUrl);

        let deletedCount = 0;
        for (const duplicateKey of duplicateKeys) {
            await cache.delete(duplicateKey);
            deletedCount++;
            logger.log('重複キャッシュを削除:', duplicateKey.url);
        }

        logger.log(`重複プロフィールキャッシュクリーンアップ完了: ${deletedCount}件削除`);
        return { success: true, deletedCount };
    } catch (error) {
        logger.error('重複キャッシュクリーンアップエラー:', error);
        return { success: false, error: getErrorMessage(error) };
    }
}