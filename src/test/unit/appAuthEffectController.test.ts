import { describe, expect, it, vi } from 'vitest';

import { createAppAuthEffectController } from '../../lib/appAuthEffectController';

describe('createAppAuthEffectController', () => {
    it('認証済み pubkey があれば custom emoji cache を同期する', () => {
        const customEmojiStore = {
            prefetchCache: vi.fn(),
        };
        const customEmojiUsageStore = {
            load: vi.fn(),
        };
        const controller = createAppAuthEffectController({
            customEmojiStore,
            customEmojiUsageStore,
        });

        controller.runAuthenticatedCustomEmojiPrefetch({
            isAuthenticated: true,
            pubkey: 'a'.repeat(64),
        } as any);

        expect(customEmojiStore.prefetchCache).toHaveBeenCalledWith({
            pubkey: 'a'.repeat(64),
        });
        expect(customEmojiUsageStore.load).toHaveBeenCalledWith({
            pubkey: 'a'.repeat(64),
        });
    });

    it('未認証なら custom emoji cache を同期しない', () => {
        const customEmojiStore = {
            prefetchCache: vi.fn(),
        };
        const customEmojiUsageStore = {
            load: vi.fn(),
        };
        const controller = createAppAuthEffectController({
            customEmojiStore,
            customEmojiUsageStore,
        });

        controller.runAuthenticatedCustomEmojiPrefetch({
            isAuthenticated: false,
            pubkey: 'a'.repeat(64),
        } as any);
        controller.runAuthenticatedCustomEmojiPrefetch(null);

        expect(customEmojiStore.prefetchCache).not.toHaveBeenCalled();
        expect(customEmojiUsageStore.load).not.toHaveBeenCalled();
    });

    it('auth identity 変更時の nip46 check status は idle に戻す', () => {
        const controller = createAppAuthEffectController({
            customEmojiStore: { prefetchCache: vi.fn() },
            customEmojiUsageStore: { load: vi.fn() },
        });

        expect(
            controller.resolveNip46ConnectionCheckStatusOnAuthIdentityChange(),
        ).toBe('idle');
    });
});
