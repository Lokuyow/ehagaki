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

    it('同期成功でも実質変更がなければ synced を表示しない', async () => {
        repositoryMock.countForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1);
        repositoryMock.getPage
            .mockResolvedValueOnce([createRecord()])
            .mockResolvedValueOnce([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'success',
                events: [
                    {
                        event: {
                            id: 'b'.repeat(64),
                            pubkey: 'a'.repeat(64),
                            kind: 1,
                            content: '投稿本文',
                            tags: [],
                            created_at: 1_700_000_000,
                            sig: 'c'.repeat(128),
                        },
                        relayUrls: ['wss://relay.example.com/'],
                    },
                ],
                fetchedAt: 5000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(repositoryMock.upsertFetchedEvents).toHaveBeenCalledOnce();
            expect(screen.queryByText('リレーとの同期が完了しました')).toBeNull();
            expectDefaultMediaReplacement();
        });
    });

    it('dialog-open-refresh 失敗でも既存一覧を維持し失敗表示を出さない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'error',
                events: [],
                fetchedAt: 5000,
                nextUntil: null,
                hasMore: false,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーから取得できませんでした')).toBeNull();
            expectDefaultMediaReplacement();
        });

        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('初期同期が timeout でも失敗表示を出さず既存一覧を維持する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'timeout',
                events: [],
                fetchedAt: 5000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expectDefaultMediaReplacement();
            expect(screen.queryByText('リレーから取得できませんでした')).toBeNull();
        });

        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('close 後に reopen すると同期状態を初期化して再試行する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getPage.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'error',
                    events: [],
                    fetchedAt: 1000,
                    nextUntil: null,
                    hasMore: false,
                    relayUrls: [],
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [],
                    fetchedAt: 2000,
                    nextUntil: null,
                    hasMore: false,
                    relayUrls: [],
                }),
                cancel: vi.fn(),
            });

        const onClose = vi.fn();
        const { rerender } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('リレーから取得できませんでした')).toBeTruthy();
        });

        await rerender({
            show: false,
            onClose,
            pubkeyHex: 'a'.repeat(64),
            rxNostr: {} as any,
        });

        await rerender({
            show: true,
            onClose,
            pubkeyHex: 'a'.repeat(64),
            rxNostr: {} as any,
        });

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
            expect(screen.queryByText('リレーから取得できませんでした')).toBeNull();
        });
    });

    it('投稿履歴一覧を表示し、neventコピー成功を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([createRecord()]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expectDefaultMediaReplacement();
            expect(screen.queryByText('メディア: image 1')).toBeNull();
        });

        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('menuitem', { name: 'neventをコピー' }));

        await waitFor(() => {
            expect(screen.queryByRole('menuitem', { name: 'neventをコピー' })).toBeNull();
        });

        expect(nostrUtilsMock.toNevent).toHaveBeenCalledWith(expect.objectContaining({
            eventId: 'b'.repeat(64),
            authorPubkey: 'a'.repeat(64),
            kind: 1,
            acceptedRelays: ['wss://accepted.example.com/'],
            relayHints: ['wss://hint.example.com/'],
        }));
        expect(clipboardMock.tryCopyToClipboard).toHaveBeenCalledWith(
            'nevent1mock',
            'nevent',
            navigator,
            window,
        );
        expect(await screen.findByText('コピーしました')).toBeTruthy();
        await fireEvent.click(actionTrigger);
        expect(await screen.findByRole('menuitem', { name: 'neventをコピー' })).toBeTruthy();
        expect(screen.queryByRole('menuitem', { name: 'コピーしました' })).toBeNull();
    });

    it('自分の投稿にだけ削除ボタンを表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'mine', content: '自分の投稿', media: [] }),
            createRecord({
                eventId: 'other',
                pubkeyHex: 'b'.repeat(64),
                content: '他人の投稿',
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
            expect(screen.getByText('自分の投稿')).toBeTruthy();
            expect(screen.getByText('他人の投稿')).toBeTruthy();
        });

        expect(screen.getAllByRole('button', { name: 'アクションを表示' })).toHaveLength(2);

        const actionTriggers = screen.getAllByRole('button', { name: 'アクションを表示' });
        await fireEvent.click(actionTriggers[0]);
        expect(await screen.findByRole('menuitem', { name: '削除' })).toBeTruthy();
    });

    it('deletedAt がある投稿では削除状態を表示し、削除ボタンを出さない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'deleted-post',
                content: '削除済み投稿',
                media: [],
                deletedAt: 999,
                deletionEventId: 'delete-event-id',
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
            expect(screen.getAllByText('削除リクエスト済み')).toHaveLength(2);
        });

        expect(screen.queryByRole('menuitem', { name: '削除' })).toBeNull();
    });

    it('削除ボタンで確認ダイアログを開き、理由入力欄を表示しない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'delete-target', content: '削除対象本文', media: [] }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('削除対象本文');
        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('menuitem', { name: '削除' }));

        await waitFor(() => {
            expect(screen.getAllByText('この投稿の削除リクエストをリレーへ送信します。').length).toBeGreaterThan(0);
            expect(screen.getByText('削除はリレーへのリクエストであり、完全な削除は保証されません。')).toBeTruthy();
            expect(screen.getAllByText('削除対象本文').length).toBeGreaterThan(0);
        });

        expect(screen.queryByRole('textbox')).toBeNull();
    });


});
