import { describe, expect, it, vi } from 'vitest';
import { savePostedEventWithMediaCacheLink } from '../../lib/postHistoryMediaPersistence';

describe('savePostedEventWithMediaCacheLink', () => {
    it('投稿履歴保存後に抽出した media url を eventId へ関連付ける', async () => {
        const putPostedEvent = vi.fn(async () => undefined);
        const linkEventIdByUrls = vi.fn(async () => undefined);

        await savePostedEventWithMediaCacheLink({
            input: {
                event: {
                    id: 'event-1',
                    pubkey: 'a'.repeat(64),
                    kind: 1,
                    content: 'body https://example.com/video.mp4',
                    tags: [
                        ['imeta', 'url https://example.com/image.jpg', 'm image/jpeg'],
                    ],
                    created_at: 100,
                    sig: 'b'.repeat(128),
                },
            },
            postHistoryRepositoryImpl: { putPostedEvent },
            postMediaCacheRepositoryImpl: { linkEventIdByUrls },
        });

        expect(putPostedEvent).toHaveBeenCalledWith({
            event: expect.objectContaining({ id: 'event-1' }),
        });
        expect(linkEventIdByUrls).toHaveBeenCalledWith({
            eventId: 'event-1',
            urls: [
                'https://example.com/image.jpg',
                'https://example.com/video.mp4',
            ],
        });
    });

    it('media がなければ link を呼ばない', async () => {
        const putPostedEvent = vi.fn(async () => undefined);
        const linkEventIdByUrls = vi.fn(async () => undefined);

        await savePostedEventWithMediaCacheLink({
            input: {
                event: {
                    id: 'event-2',
                    pubkey: 'a'.repeat(64),
                    kind: 1,
                    content: 'plain body',
                    tags: [],
                    created_at: 100,
                    sig: 'b'.repeat(128),
                },
            },
            postHistoryRepositoryImpl: { putPostedEvent },
            postMediaCacheRepositoryImpl: { linkEventIdByUrls },
        });

        expect(putPostedEvent).toHaveBeenCalledOnce();
        expect(linkEventIdByUrls).not.toHaveBeenCalled();
    });
});