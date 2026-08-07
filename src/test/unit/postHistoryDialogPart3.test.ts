import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PostHistoryDialog,
    channelContextServiceMock,
    channelMetadataRepositoryMock,
    cleanupPostHistoryDialogHarness,
    clipboardMock,
    customEmojiImageMetaRepositoryMock,
    customEmojiMock,
    localSearchServiceMock,
    nostrUtilsMock,
    postDeletionServiceMock,
    postMediaCacheServiceMock,
    relayFetchServiceMock,
    repairServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
    visibleRangeRepositoryMock,
} from './postHistoryDialogTestHarness';
function createRecord(overrides: Record<string, any> = {}) {
    return {
        id: 'event-1',
        eventId: 'b'.repeat(64),
        pubkeyHex: 'a'.repeat(64),
        kind: 1,
        content: '投稿本文\nhttps://example.com/image.jpg',
        tags: [],
        createdAt: 1_700_000_000,
        postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        relayHints: ['wss://hint.example.com/'],
        acceptedRelays: ['wss://accepted.example.com/'],
        media: [
            {
                url: 'https://example.com/image.jpg',
                mimeType: 'image/jpeg',
            },
        ],
        rawEvent: {},
        updatedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        schemaVersion: 2,
        ...overrides,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((resolvePromise) => {
        resolve = resolvePromise;
    });

    return { promise, resolve };
}

function expectDefaultMediaReplacement(): void {
    expect(screen.getByText('投稿本文')).toBeTruthy();
    expect(screen.getByTitle('image.jpg')).toBeTruthy();
    expect(screen.queryByText('https://example.com/image.jpg')).toBeNull();
}

async function openPostHistoryMenu(): Promise<void> {
    const trigger = await screen.findByRole('button', { name: '投稿履歴メニューを開く' });
    await fireEvent.click(trigger);
}

async function openSearchBar(): Promise<HTMLInputElement> {
    await openPostHistoryMenu();
    await fireEvent.click(await screen.findByRole('menuitem', { name: '検索' }));
    return screen.findByRole('searchbox', { name: '検索' }) as Promise<HTMLInputElement>;
}

async function findRepairButton(): Promise<HTMLElement> {
    const existing = screen.queryByRole('menuitem', { name: /表示中の投稿付近を再取得|再取得中\.\.\./ });
    if (existing) {
        return existing as HTMLElement;
    }

    await openPostHistoryMenu();
    return screen.findByRole('menuitem', { name: /表示中の投稿付近を再取得|再取得中\.\.\./ }) as Promise<HTMLElement>;
}

describe('PostHistoryDialog', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness({ listingMode: 'page-adapter' });
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('[recent-date-format] 投稿日時が今年なら月日時刻を表示する', async () => {
        const now = Date.UTC(2025, 5, 1, 12, 0, 0);
        const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'within-year',
                postedAt: now - 100 * 24 * 60 * 60 * 1000,
                content: '今年の投稿',
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const expected = new Intl.DateTimeFormat(undefined, {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(now - 100 * 24 * 60 * 60 * 1000));

        await waitFor(() => {
            expect(screen.getByText(expected)).toBeTruthy();
            expect(screen.getByText('今年の投稿')).toBeTruthy();
        });

        dateNowSpy.mockRestore();
    });

    it('[recent-date-format] 投稿日時が去年なら年月日を表示する', async () => {
        const now = new Date(2025, 0, 1, 12, 0, 0).getTime();
        const postedAt = new Date(2024, 11, 31, 12, 0, 0).getTime();
        const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'within-year-cross-year',
                postedAt,
                content: '年を跨いだ投稿',
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const expected = new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }).format(new Date(postedAt));

        await waitFor(() => {
            expect(screen.getByText(expected)).toBeTruthy();
            expect(screen.getByText('年を跨いだ投稿')).toBeTruthy();
        });

        dateNowSpy.mockRestore();
    });

    it('[emoji-preload] 保存済み emoji tag から custom emoji を描画し、同一 URL は一度だけ preload する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'emoji-post-1',
                content: 'one :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
            createRecord({
                eventId: 'emoji-post-2',
                content: 'two :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledTimes(1);
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                'https://example.com/blobcat.webp',
            );
        });

        const images = await screen.findAllByRole('img', { name: ':blobcat:' });
        expect(images).toHaveLength(2);
    });

    it('[emoji-placeholder] loading 中は shortcode ではなく placeholder を表示し、保存済み寸法から幅を確保する', async () => {
        const deferred = createDeferred<{
            ready: boolean;
            width: number;
            height: number;
            aspectRatio: number;
        }>();
        customEmojiMock.preloadCustomEmojiImageWithMeta.mockReturnValue(deferred.promise);
        customEmojiImageMetaRepositoryMock.getMany.mockResolvedValue({
            'https://example.com/blobcat.webp': {
                url: 'https://example.com/blobcat.webp',
                width: 60,
                height: 30,
                aspectRatio: 2,
                fetchedAt: 1000,
                lastAccessedAt: 1000,
                updatedAt: 1000,
                schemaVersion: 1,
            },
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'emoji-loading',
                content: 'loading :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
        ]);

        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                'https://example.com/blobcat.webp',
            );
            expect(customEmojiImageMetaRepositoryMock.getMany).toHaveBeenCalledWith([
                'https://example.com/blobcat.webp',
            ]);
        });

        await waitFor(() => {
            const slot = document.querySelector('.post-history-custom-emoji-slot');
            expect(slot).toBeTruthy();
            expect(slot?.getAttribute('style')).toContain('60px');
            expect(screen.queryByRole('img', { name: ':blobcat:' })).toBeNull();
            expect(screen.queryByText(':blobcat:')).toBeNull();
        });

        deferred.resolve({
            ready: true,
            width: 120,
            height: 60,
            aspectRatio: 2,
        });
    });

    it('[emoji-preload-failure] custom emoji の preload に失敗した場合は shortcode のまま表示する', async () => {
        customEmojiMock.preloadCustomEmojiImageWithMeta.mockResolvedValue({
            ready: false,
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'emoji-failed',
                content: 'broken :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                'https://example.com/blobcat.webp',
            );
        });

        expect(screen.queryByRole('img', { name: ':blobcat:' })).toBeNull();
        expect(screen.getByText(':blobcat:')).toBeTruthy();
    });


});
