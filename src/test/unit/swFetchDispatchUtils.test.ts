import { describe, expect, it, vi } from 'vitest';

import { dispatchServiceWorkerFetchRoute } from '../../lib/swFetchDispatchUtils';

describe('swFetchDispatchUtils', () => {
    it('upload route の handler を実行する', async () => {
        const response = new Response(null, { status: 200 });
        const uploadHandler = vi.fn(async () => response);

        const result = await dispatchServiceWorkerFetchRoute({
            route: 'upload',
            uploadHandler,
            profileImageHandler: vi.fn(),
            customEmojiImageHandler: vi.fn(),
        });

        expect(result).toBe(response);
        expect(uploadHandler).toHaveBeenCalledOnce();
    });

    it('profile-image route の handler を実行する', async () => {
        const response = new Response(null, { status: 200 });
        const profileImageHandler = vi.fn(async () => response);

        const result = await dispatchServiceWorkerFetchRoute({
            route: 'profile-image',
            uploadHandler: vi.fn(),
            profileImageHandler,
            customEmojiImageHandler: vi.fn(),
        });

        expect(result).toBe(response);
        expect(profileImageHandler).toHaveBeenCalledOnce();
    });

    it('route が無い時は undefined を返す', async () => {
        const result = await dispatchServiceWorkerFetchRoute({
            route: null,
            uploadHandler: vi.fn(),
            profileImageHandler: vi.fn(),
            customEmojiImageHandler: vi.fn(),
        });

        expect(result).toBeUndefined();
    });
});