import type { PostHistoryWarmupResult } from './postHistoryPrefetch';

export interface PostHistoryWarmupControllerDependencies {
    getCurrentPubkeyHex(): string | null;
    prefetchLatestPostHistoryDescriptors(pubkeyHex: string): Promise<PostHistoryWarmupResult>;
}

export interface PostHistoryWarmupController {
    warmLatestPostHistoryDescriptors(): Promise<PostHistoryWarmupResult>;
}

export function createPostHistoryWarmupController(
    deps: PostHistoryWarmupControllerDependencies,
): PostHistoryWarmupController {
    let warmupPubkey: string | null = null;
    let warmupResult: PostHistoryWarmupResult | null = null;
    let warmupPromise: Promise<PostHistoryWarmupResult> | null = null;

    function resetState(pubkeyHex: string | null): void {
        warmupPubkey = pubkeyHex;
        warmupResult = null;
        warmupPromise = null;
    }

    async function warmLatestPostHistoryDescriptors(): Promise<PostHistoryWarmupResult> {
        const pubkeyHex = deps.getCurrentPubkeyHex();

        if (!pubkeyHex) {
            resetState(null);
            return { status: 'skipped', urlCount: 0 };
        }

        if (warmupPubkey !== pubkeyHex) {
            resetState(pubkeyHex);
        }

        if (warmupPromise) {
            return warmupPromise;
        }

        if (warmupResult && warmupResult.status !== 'failed') {
            return warmupResult;
        }

        const activePubkeyHex = pubkeyHex;
        const nextPromise = deps
            .prefetchLatestPostHistoryDescriptors(activePubkeyHex)
            .then((result) => {
                if (warmupPubkey === activePubkeyHex) {
                    warmupResult = result;
                }

                return result;
            })
            .finally(() => {
                if (warmupPubkey === activePubkeyHex) {
                    warmupPromise = null;
                }
            });

        warmupPromise = nextPromise;
        return nextPromise;
    }

    return {
        warmLatestPostHistoryDescriptors,
    };
}
