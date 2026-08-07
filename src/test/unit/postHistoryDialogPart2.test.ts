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

    it('長い投稿本文は折りたたみ表示し、ボタンで展開できる', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'long-post',
                content: [
                    'line1',
                    'line2',
                    'line3',
                    'line4',
                    'line5',
                    'line6 https://example.com/image.jpg',
                ].join('\n'),
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
            }),
        ]);

        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const toggleButton = await screen.findByRole('button', {
            name: 'もっと見る',
        });

        expect(toggleButton).toBeTruthy();
        expect(screen.getByTitle('image.jpg')).toBeTruthy();
        await fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: '折りたたむ' })).toBeTruthy();
        await fireEvent.click(screen.getByRole('button', { name: '折りたたむ' }));
        expect(screen.getByRole('button', { name: 'もっと見る' })).toBeTruthy();
    });

    it('メディアのみの投稿では本文プレビュー要素を表示しない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'media-only',
                content: [
                    'https://example.com/image-1.jpg',
                    'https://example.com/image-2.jpg',
                ].join('\n'),
                media: [
                    {
                        url: 'https://example.com/image-1.jpg',
                        mimeType: 'image/jpeg',
                    },
                    {
                        url: 'https://example.com/image-2.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
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
            expect(screen.getByTitle('image-1.jpg')).toBeTruthy();
            expect(screen.getByTitle('image-2.jpg')).toBeTruthy();
        });

        expect(container.querySelector('.post-history-preview-text')).toBeNull();
        expect(screen.getByTitle('image-1.jpg')).toBeTruthy();
        expect(screen.getByTitle('image-2.jpg')).toBeTruthy();
    });

    it('fullscreen viewer 内の操作では投稿履歴ダイアログを閉じない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'fullscreen-safe',
                content: 'fullscreen target',
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
            }),
        ]);

        const onClose = vi.fn();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('fullscreen target');

        const fullscreenRoot = document.createElement('div');
        fullscreenRoot.className = 'ehagaki-pswp';
        const fullscreenButton = document.createElement('button');
        fullscreenButton.type = 'button';
        fullscreenRoot.appendChild(fullscreenButton);
        document.body.appendChild(fullscreenRoot);

        try {
            await fireEvent.pointerDown(fullscreenButton);
            await fireEvent.pointerUp(fullscreenButton);
            await fireEvent.click(fullscreenButton);
            await new Promise((resolve) => setTimeout(resolve, 40));

            expect(onClose).not.toHaveBeenCalled();
            expect(await openSearchBar()).toBeTruthy();
        } finally {
            fullscreenRoot.remove();
        }
    });

    it('fullscreen viewer 表示中は外側へフォーカスが逃げない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'focus-safe',
                content: 'focus target',
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
            }),
        ]);
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor).mockResolvedValue({
            cacheKey: 'https://example.com/image.jpg',
            url: 'https://example.com/image.jpg',
            mimeType: 'image/jpeg',
            size: 10,
            source: 'uploaded',
            kind: 'image',
        });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl).mockResolvedValue({
            cacheKey: 'https://example.com/image.jpg',
            url: 'https://example.com/image.jpg',
            mimeType: 'image/jpeg',
            size: 10,
            source: 'uploaded',
            kind: 'image',
            objectUrl: 'blob:image-preview',
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('focus target');
        await waitFor(() => {
            expect(screen.getByRole('button', { name: '開く image.jpg' })).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: '開く image.jpg' }));
        await waitFor(() => {
            expect(document.querySelector('.ehagaki-pswp')).toBeTruthy();
        });

        const outsideButton = document.createElement('button');
        outsideButton.type = 'button';
        outsideButton.textContent = 'outside';
        document.body.appendChild(outsideButton);

        try {
            outsideButton.focus();

            await waitFor(() => {
                expect(document.activeElement).toBe(outsideButton);
            });
        } finally {
            outsideButton.remove();
        }
    });

    it('reply/quote callback がある場合は preview 下に両方のボタンを表示し、折りたたみボタンと共存する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'replyable-post',
                content: [
                    'line1',
                    'line2',
                    'line3',
                    'line4',
                    'line5',
                    'line6',
                ].join('\n'),
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                onQuotePost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        expect(await screen.findByRole('button', { name: 'リプライ' })).toBeTruthy();
        expect(screen.getByRole('button', { name: '引用' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'もっと見る' })).toBeTruthy();
    });

    it('リプライボタン押下で callback 実行後にダイアログを閉じる', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'reply-target',
                content: '返信したい投稿',
                media: [],
            }),
        ]);
        const onClose = vi.fn();
        const onReplyPost = vi.fn();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                onReplyPost,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('返信したい投稿');
        await fireEvent.click(await screen.findByRole('button', { name: 'リプライ' }));

        expect(onReplyPost).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'reply-target' }),
        );
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('引用ボタン押下で callback 実行後にダイアログを閉じる', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'quote-target',
                content: '引用したい投稿',
                media: [],
            }),
        ]);
        const onClose = vi.fn();
        const onQuotePost = vi.fn();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                onQuotePost,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('引用したい投稿');
        await fireEvent.click(await screen.findByRole('button', { name: '引用' }));

        expect(onQuotePost).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'quote-target' }),
        );
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('投稿日時が今日なら時刻のみを表示する', async () => {
        vi.useFakeTimers();
        const now = Date.UTC(2025, 0, 1, 12, 0, 0);
        vi.setSystemTime(now);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'recent',
                postedAt: now - 60 * 60 * 1000,
                content: '最近の投稿',
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
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(now - 60 * 60 * 1000));

        await waitFor(() => {
            expect(screen.getByText(expected)).toBeTruthy();
            expect(screen.getByText('最近の投稿')).toBeTruthy();
        });
    });

    it('投稿日時が昨日なら月日時刻を表示する', async () => {
        vi.useFakeTimers();
        const now = new Date(2025, 0, 2, 0, 30, 0).getTime();
        const postedAt = new Date(2025, 0, 1, 23, 30, 0).getTime();
        vi.setSystemTime(now);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'recent-cross-date',
                postedAt,
                content: '日付を跨いだ投稿',
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
        }).format(new Date(postedAt));

        await waitFor(() => {
            expect(screen.getByText(expected)).toBeTruthy();
            expect(screen.getByText('日付を跨いだ投稿')).toBeTruthy();
        });
    });


});
