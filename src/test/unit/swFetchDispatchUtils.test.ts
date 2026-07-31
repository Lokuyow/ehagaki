import { describe, expect, it, vi } from 'vitest';

import { dispatchServiceWorkerFetchRoute } from '../../lib/swFetchDispatchUtils';

describe('swFetchDispatchUtils', () => {
    const createHandlers = () => {
        const uploadHandler = vi.fn(async () => new Response(null, { status: 200 }));
        const profileImageHandler = vi.fn(async () => new Response(null, { status: 200 }));
        const channelImageHandler = vi.fn(async () => new Response(null, { status: 200 }));
        const customEmojiImageHandler = vi.fn(async () => new Response(null, { status: 200 }));

        return {
            uploadHandler,
            profileImageHandler,
            channelImageHandler,
            customEmojiImageHandler,
        };
    };

    it('upload route の handler を実行する', async () => {
        const response = new Response(null, { status: 200 });
        const uploadHandler = vi.fn(async () => response);
        const profileImageHandler = vi.fn(async () => new Response(null, { status: 200 }));
        const channelImageHandler = vi.fn(async () => new Response(null, { status: 200 }));
        const customEmojiImageHandler = vi.fn(async () => new Response(null, { status: 200 }));

        const result = await dispatchServiceWorkerFetchRoute({
            route: 'upload',
            uploadHandler,
            profileImageHandler,
            channelImageHandler,
            customEmojiImageHandler,
        });

        expect(result).toBe(response);
        expect(uploadHandler).toHaveBeenCalledOnce();
        expect(profileImageHandler).not.toHaveBeenCalled();
        expect(channelImageHandler).not.toHaveBeenCalled();
        expect(customEmojiImageHandler).not.toHaveBeenCalled();
    });

    it('profile-image route の handler を実行する', async () => {
        const response = new Response(null, { status: 200 });
        const uploadHandler = vi.fn(async () => new Response(null, { status: 200 }));
        const profileImageHandler = vi.fn(async () => response);
        const channelImageHandler = vi.fn(async () => new Response(null, { status: 200 }));
        const customEmojiImageHandler = vi.fn(async () => new Response(null, { status: 200 }));

        const result = await dispatchServiceWorkerFetchRoute({
            route: 'profile-image',
            uploadHandler,
            profileImageHandler,
            channelImageHandler,
            customEmojiImageHandler,
        });

        expect(result).toBe(response);
        expect(profileImageHandler).toHaveBeenCalledOnce();
        expect(uploadHandler).not.toHaveBeenCalled();
        expect(channelImageHandler).not.toHaveBeenCalled();
        expect(customEmojiImageHandler).not.toHaveBeenCalled();
    });

    it('channel-image route の handler を実行する', async () => {
        const response = new Response(null, { status: 200 });
        const { uploadHandler, profileImageHandler, channelImageHandler, customEmojiImageHandler } = createHandlers();
        channelImageHandler.mockResolvedValueOnce(response);

        const result = await dispatchServiceWorkerFetchRoute({
            route: 'channel-image',
            uploadHandler,
            profileImageHandler,
            channelImageHandler,
            customEmojiImageHandler,
        });

        expect(result).toBe(response);
        expect(channelImageHandler).toHaveBeenCalledOnce();
        expect(uploadHandler).not.toHaveBeenCalled();
        expect(profileImageHandler).not.toHaveBeenCalled();
        expect(customEmojiImageHandler).not.toHaveBeenCalled();
    });

    it('custom-emoji-image route の handler を実行する', async () => {
        const response = new Response(null, { status: 200 });
        const { uploadHandler, profileImageHandler, channelImageHandler, customEmojiImageHandler } = createHandlers();
        customEmojiImageHandler.mockResolvedValueOnce(response);

        const result = await dispatchServiceWorkerFetchRoute({
            route: 'custom-emoji-image',
            uploadHandler,
            profileImageHandler,
            channelImageHandler,
            customEmojiImageHandler,
        });

        expect(result).toBe(response);
        expect(customEmojiImageHandler).toHaveBeenCalledOnce();
        expect(uploadHandler).not.toHaveBeenCalled();
        expect(profileImageHandler).not.toHaveBeenCalled();
        expect(channelImageHandler).not.toHaveBeenCalled();
    });

    it('route が無い時は undefined を返す', async () => {
        const result = await dispatchServiceWorkerFetchRoute({
            route: null,
            uploadHandler: vi.fn(),
            profileImageHandler: vi.fn(),
            channelImageHandler: vi.fn(),
            customEmojiImageHandler: vi.fn(),
        });

        expect(result).toBeUndefined();
    });
});