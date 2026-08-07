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

    it('[channel-cache-hit] channelMetadata cache 済みなら service を呼ばず channel 名を表示する', async () => {
        channelMetadataRepositoryMock.get.mockResolvedValue(
            {
                channelEventId: 'channel-id',
                name: 'cached-general',
                about: null,
                picture: null,
                relays: ['wss://channel-write.example.com/'],
                relayHints: ['wss://channel.example.com/'],
                creatorPubkey: 'c'.repeat(64),
                createEventCreatedAt: 100,
                metadataEventId: 'm'.repeat(64),
                metadataCreatedAt: 200,
                fetchedAt: 1000,
            },
        );
        channelMetadataRepositoryMock.shouldRefresh.mockReturnValue(false);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'channel-post',
                kind: 42,
                content: 'channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(channelMetadataRepositoryMock.get).toHaveBeenCalledWith('channel-id');
            expect(channelContextServiceMock.resolveChannelMetadataWithInternalHints).not.toHaveBeenCalled();
            expect(screen.getByText('cached-general')).toBeTruthy();
        });

        const channelRow = screen.getByText('cached-general').closest('.post-history-channel-row');
        expect(channelRow?.parentElement?.classList.contains('post-preview-header')).toBe(true);
    });

    it('[channel-fetch-dedupe] 未取得 channel だけ service で解決して保存し、同じ channelEventId の fetch を重複させない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'channel-post-1',
                kind: 42,
                content: 'first channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
            createRecord({
                eventId: 'channel-post-2',
                kind: 42,
                content: 'second channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(channelContextServiceMock.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1);
            expect(channelMetadataRepositoryMock.upsertResolvedChannel).toHaveBeenCalledTimes(1);
            expect(screen.getAllByText('general').length).toBeGreaterThan(0);
        });
    });

    it('[channel-fetch-failure] channel metadata 取得失敗時は失敗を記録して unknown を表示する', async () => {
        channelContextServiceMock.resolveChannelMetadataWithInternalHints.mockRejectedValueOnce(new Error('fetch failed'));
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'channel-post',
                kind: 42,
                content: 'channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(channelMetadataRepositoryMock.markFetchFailed).toHaveBeenCalledWith('channel-id');
            expect(screen.getByText('不明')).toBeTruthy();
        });
    });


});
