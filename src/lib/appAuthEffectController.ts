import type { AuthState } from './types';

interface CustomEmojiStoreLike {
    prefetchCache(params: { pubkey: string }): unknown;
}

interface CustomEmojiUsageStoreLike {
    load(params: { pubkey: string }): unknown;
}

export interface AppAuthEffectControllerDependencies {
    customEmojiStore: CustomEmojiStoreLike;
    customEmojiUsageStore: CustomEmojiUsageStoreLike;
}

export interface AppAuthEffectController {
    runAuthenticatedCustomEmojiPrefetch(auth: AuthState | null | undefined): void;
    resolveNip46ConnectionCheckStatusOnAuthIdentityChange(): 'idle';
}

export function createAppAuthEffectController(
    deps: AppAuthEffectControllerDependencies,
): AppAuthEffectController {
    function runAuthenticatedCustomEmojiPrefetch(
        auth: AuthState | null | undefined,
    ): void {
        const pubkey = auth?.pubkey;
        if (!pubkey || !auth?.isAuthenticated) {
            return;
        }

        void deps.customEmojiStore.prefetchCache({ pubkey });
        void deps.customEmojiUsageStore.load({ pubkey });
    }

    function resolveNip46ConnectionCheckStatusOnAuthIdentityChange(): 'idle' {
        return 'idle';
    }

    return {
        runAuthenticatedCustomEmojiPrefetch,
        resolveNip46ConnectionCheckStatusOnAuthIdentityChange,
    };
}
