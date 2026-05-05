import { describe, expect, it, vi } from 'vitest';

import {
    resolveServiceWorkerFetchRoute,
    resolveServiceWorkerMessageRoute,
} from '../../lib/swRoutingUtils';

describe('swRoutingUtils', () => {
    it('resolveServiceWorkerFetchRoute は upload を優先する', () => {
        const result = resolveServiceWorkerFetchRoute({
            request: { method: 'POST', destination: '' } as Request,
            url: new URL('https://example.com/upload'),
            currentOrigin: 'https://example.com',
            isUploadRequest: vi.fn(() => true),
            isProfileImageRequest: vi.fn(() => false),
        });

        expect(result).toBe('upload');
    });

    it('resolveServiceWorkerFetchRoute は外部 origin の upload を除外し profile image を返せる', () => {
        const result = resolveServiceWorkerFetchRoute({
            request: { method: 'POST', destination: '' } as Request,
            url: new URL('https://cdn.example.com/image.jpg?profile=true'),
            currentOrigin: 'https://example.com',
            isUploadRequest: vi.fn(() => true),
            isProfileImageRequest: vi.fn(() => true),
        });

        expect(result).toBe('profile-image');
    });

    it('resolveServiceWorkerFetchRoute は通常画像を custom emoji として扱う', () => {
        const result = resolveServiceWorkerFetchRoute({
            request: { method: 'GET', destination: 'image' } as Request,
            url: new URL('https://cdn.example.com/emoji.png'),
            currentOrigin: 'https://example.com',
            isUploadRequest: vi.fn(() => false),
            isProfileImageRequest: vi.fn(() => false),
        });

        expect(result).toBe('custom-emoji-image');
    });

    it('resolveServiceWorkerMessageRoute は type を action より優先する', () => {
        expect(
            resolveServiceWorkerMessageRoute({
                type: 'GET_VERSION',
                action: 'clearProfileCache',
            }),
        ).toEqual({ kind: 'type', name: 'GET_VERSION' });
    });

    it('resolveServiceWorkerMessageRoute は action だけの時に action route を返す', () => {
        expect(
            resolveServiceWorkerMessageRoute({
                action: 'getSharedMedia',
            }),
        ).toEqual({ kind: 'action', name: 'getSharedMedia' });
    });
});