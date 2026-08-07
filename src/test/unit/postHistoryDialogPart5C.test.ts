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

    it('[unmount-cleanup] unmount 時に進行中の同期を cleanup する', async () => {
        const cancel = vi.fn();
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getPage.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: new Promise(() => undefined),
            cancel,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledOnce();
        });

        view.unmount();
        expect(cancel).toHaveBeenCalledOnce();
    });

    it('[nevent-copy-failure] neventコピー失敗を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                content: '投稿本文',
                media: [],
                relayHints: [],
                acceptedRelays: [],
            }),
        ]);
        clipboardMock.tryCopyToClipboard.mockResolvedValue(false);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByText('投稿本文')).toBeTruthy();
        });

        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('menuitem', { name: 'neventをコピー' }));

        await waitFor(() => {
            expect(screen.queryByRole('menuitem', { name: 'neventをコピー' })).toBeNull();
        });

        await fireEvent.click(actionTrigger);
        expect(await screen.findByRole('menuitem', { name: 'コピーに失敗しました' })).toBeTruthy();
    });
});
