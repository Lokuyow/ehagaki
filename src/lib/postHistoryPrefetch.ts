import { collectPostHistoryMediaUrls } from './postHistoryDialogUtils';
import { postMediaCacheService } from './postMediaCacheService';
import { POST_HISTORY_PAGE_SIZE } from './postHistoryRelayFetchService';
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from './storage/postHistoryRepository';
import {
    buildPostHistoryVisibleKindsKey,
    postHistoryVisibleRangeRepository,
    type PostHistoryVisibleRangeRepository,
} from './storage/postHistoryVisibleRangeRepository';
import {
    postHistoryJumpCacheAnchorRepository,
    type PostHistoryJumpCacheAnchorRepository,
} from './storage/postHistoryJumpCacheAnchorRepository';
import type { PostHistoryRecord } from './storage/ehagakiDb';
import { POST_HISTORY_FETCH_KINDS } from './postHistoryRelayFetchService';

export type PostHistoryWarmupStatus =
    | 'prefetched'
    | 'empty'
    | 'skipped'
    | 'failed';

export interface PostHistoryWarmupResult {
    status: PostHistoryWarmupStatus;
    urlCount: number;
    latestPosts: PostHistoryRecord[];
    visibleUntil: number | null;
    hasJumpCacheAnchors: boolean;
}

type PostHistoryWarmupRepository = Pick<
    PostHistoryRepository,
    'getLatestVisibleChunk'
>;

interface PostHistoryWarmupMediaCacheService {
    canUsePersistentCache(): boolean;
    prefetchCachedMediaDescriptors(urls: string[]): Promise<void>;
}

export interface PrefetchLatestPostHistoryDescriptorsOptions {
    pubkeyHex: string | null | undefined;
    postHistoryRepository?: PostHistoryWarmupRepository;
    postHistoryVisibleRangeRepository?: Pick<
        PostHistoryVisibleRangeRepository,
        'get'
    >;
    postHistoryJumpCacheAnchorRepository?: Pick<
        PostHistoryJumpCacheAnchorRepository,
        'getForPubkey'
    >;
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
    postHistoryVisibleRangeRepository: visibleRangeRepository =
        postHistoryVisibleRangeRepository,
    postHistoryJumpCacheAnchorRepository: jumpCacheAnchorRepository =
        postHistoryJumpCacheAnchorRepository,
    postMediaCacheService: mediaCacheService = postMediaCacheService,
    pageSize = POST_HISTORY_PAGE_SIZE,
}: PrefetchLatestPostHistoryDescriptorsOptions): Promise<PostHistoryWarmupResult> {
    const normalizedPubkeyHex = pubkeyHex?.trim();
    if (!normalizedPubkeyHex) {
        return {
            status: 'skipped',
            urlCount: 0,
            latestPosts: [],
            visibleUntil: null,
            hasJumpCacheAnchors: false,
        };
    }

    try {
        const visibleRange = await visibleRangeRepository.get(
            normalizedPubkeyHex,
            buildPostHistoryVisibleKindsKey([...POST_HISTORY_FETCH_KINDS]),
        );
        const visibleUntil = visibleRange?.visibleUntil ?? null;
        const [posts, anchors] = await Promise.all([
            repository.getLatestVisibleChunk({
                pubkeyHex: normalizedPubkeyHex,
                limit: pageSize,
                visibleUntil,
            }),
            jumpCacheAnchorRepository.getForPubkey(normalizedPubkeyHex, {
                maxCount: 1,
            }),
        ]);
        const urls = collectPostHistoryMediaUrls(posts);
        if (mediaCacheService.canUsePersistentCache() && urls.length > 0) {
            await mediaCacheService.prefetchCachedMediaDescriptors(urls);
        }

        return {
            status: urls.length > 0 ? 'prefetched' : 'empty',
            urlCount: urls.length,
            latestPosts: posts,
            visibleUntil,
            hasJumpCacheAnchors: anchors.length > 0,
        };
    } catch {
        return {
            status: 'failed',
            urlCount: 0,
            latestPosts: [],
            visibleUntil: null,
            hasJumpCacheAnchors: false,
        };
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
        timeoutMs = 10_000,
        fallbackDelayMs = 3_000,
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
