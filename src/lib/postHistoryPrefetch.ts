import { collectPostHistoryMediaUrls } from './postHistoryDialogUtils';
import { postMediaCacheService } from './postMediaCacheService';
import { POST_HISTORY_PAGE_SIZE } from './postHistoryRelayFetchService';
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from './storage/postHistoryRepository';

export type PostHistoryWarmupStatus =
    | 'prefetched'
    | 'empty'
    | 'skipped'
    | 'failed';

export interface PostHistoryWarmupResult {
    status: PostHistoryWarmupStatus;
    urlCount: number;
}

type PostHistoryWarmupRepository = Pick<PostHistoryRepository, 'getPage'>;

interface PostHistoryWarmupMediaCacheService {
    canUsePersistentCache(): boolean;
    prefetchCachedMediaDescriptors(urls: string[]): Promise<void>;
}

export interface PrefetchLatestPostHistoryDescriptorsOptions {
    pubkeyHex: string | null | undefined;
    postHistoryRepository?: PostHistoryWarmupRepository;
    postMediaCacheService?: PostHistoryWarmupMediaCacheService;
    pageSize?: number;
}

interface IdleWindowLike {
    requestIdleCallback?: (
        callback: () => void,
        options?: { timeout?: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
}

export interface SchedulePostHistoryWarmupOnIdleOptions {
    windowObj?: IdleWindowLike;
    setTimeoutFn?: typeof setTimeout;
    clearTimeoutFn?: typeof clearTimeout;
    timeoutMs?: number;
    fallbackDelayMs?: number;
}

export interface ScheduledPostHistoryWarmup {
    cancel: () => void;
}

export async function prefetchLatestPostHistoryDescriptors({
    pubkeyHex,
    postHistoryRepository: repository = postHistoryRepository,
    postMediaCacheService: mediaCacheService = postMediaCacheService,
    pageSize = POST_HISTORY_PAGE_SIZE,
}: PrefetchLatestPostHistoryDescriptorsOptions): Promise<PostHistoryWarmupResult> {
    const normalizedPubkeyHex = pubkeyHex?.trim();
    if (!normalizedPubkeyHex) {
        return { status: 'skipped', urlCount: 0 };
    }

    if (!mediaCacheService.canUsePersistentCache()) {
        return { status: 'skipped', urlCount: 0 };
    }

    try {
        const posts = await repository.getPage({
            pubkeyHex: normalizedPubkeyHex,
            page: 1,
            pageSize,
        });
        const urls = collectPostHistoryMediaUrls(posts);
        if (urls.length === 0) {
            return { status: 'empty', urlCount: 0 };
        }

        await mediaCacheService.prefetchCachedMediaDescriptors(urls);
        return { status: 'prefetched', urlCount: urls.length };
    } catch {
        return { status: 'failed', urlCount: 0 };
    }
}

export function schedulePostHistoryWarmupOnIdle(
    task: () => void,
    {
        windowObj = typeof window === 'undefined'
            ? undefined
            : (window as IdleWindowLike),
        setTimeoutFn = setTimeout,
        clearTimeoutFn = clearTimeout,
        timeoutMs = 2000,
        fallbackDelayMs = 0,
    }: SchedulePostHistoryWarmupOnIdleOptions = {},
): ScheduledPostHistoryWarmup {
    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const cleanup = () => {
        if (idleHandle !== null && typeof windowObj?.cancelIdleCallback === 'function') {
            windowObj.cancelIdleCallback(idleHandle);
            idleHandle = null;
        }

        if (timeoutHandle !== null) {
            clearTimeoutFn(timeoutHandle);
            timeoutHandle = null;
        }
    };

    const runTask = () => {
        if (cancelled) {
            return;
        }

        cancelled = true;
        cleanup();
        task();
    };

    if (typeof windowObj?.requestIdleCallback === 'function') {
        idleHandle = windowObj.requestIdleCallback(runTask, { timeout: timeoutMs });
    } else {
        timeoutHandle = setTimeoutFn(runTask, fallbackDelayMs);
    }

    return {
        cancel() {
            if (cancelled) {
                return;
            }

            cancelled = true;
            cleanup();
        },
    };
}