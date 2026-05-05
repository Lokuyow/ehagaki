import { describe, expect, it, vi } from 'vitest';

import { logServiceWorkerFetchRoute } from '../../lib/swFetchRouteLogUtils';

describe('swFetchRouteLogUtils', () => {
    it('upload route では内部アップロードログを出す', () => {
        const logger = { log: vi.fn() };

        logServiceWorkerFetchRoute({
            route: 'upload',
            url: new URL('https://example.com/upload'),
            requestUrl: 'https://example.com/upload',
            currentOrigin: 'https://example.com',
            logger,
        });

        expect(logger.log).toHaveBeenCalledWith(
            'SW: 内部アップロードリクエストを処理',
            'https://example.com/upload',
        );
    });

    it('外部 profile-image route では外部プロフィール画像ログを出す', () => {
        const logger = { log: vi.fn() };

        logServiceWorkerFetchRoute({
            route: 'profile-image',
            url: new URL('https://external.com/profile.jpg?profile=true'),
            requestUrl: 'https://external.com/profile.jpg?profile=true',
            currentOrigin: 'https://example.com',
            logger,
        });

        expect(logger.log).toHaveBeenCalledWith(
            'SW: 外部プロフィール画像リクエストを処理:',
            'https://external.com/profile.jpg?profile=true',
        );
    });

    it('same-origin の profile-image では追加ログを出さない', () => {
        const logger = { log: vi.fn() };

        logServiceWorkerFetchRoute({
            route: 'profile-image',
            url: new URL('https://example.com/profile.jpg?profile=true'),
            requestUrl: 'https://example.com/profile.jpg?profile=true',
            currentOrigin: 'https://example.com',
            logger,
        });

        expect(logger.log).not.toHaveBeenCalled();
    });
});