import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'postHistory.title': '投稿履歴',
        'postHistory.description': 'eHagakiで投稿に成功した履歴です。',
        'postHistory.empty': '投稿履歴はまだありません',
        'postHistory.copyNevent': 'neventをコピー',
        'postHistory.copied': 'コピーしました',
        'postHistory.copyFailed': 'コピーに失敗しました',
        'postHistory.eventId': 'event id',
        'postHistory.postedAt': '投稿日時',
        'postHistory.media': 'メディア',
        'postHistory.deleted': '削除済み',
        'global.close': '閉じる',
    };

    return translations[key] || key;
});

const repositoryMock = vi.hoisted(() => ({
    getAll: vi.fn(),
}));

const clipboardMock = vi.hoisted(() => ({
    tryCopyToClipboard: vi.fn(),
}));

const nostrUtilsMock = vi.hoisted(() => ({
    toNevent: vi.fn(() => 'nevent1mock'),
}));

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

vi.mock('../../lib/hooks/useDialogHistory.svelte', () => ({
    useDialogHistory: vi.fn(),
}));

vi.mock('../../lib/storage/postHistoryRepository', () => ({
    postHistoryRepository: repositoryMock,
}));

vi.mock('../../lib/utils/clipboardUtils', () => clipboardMock);

vi.mock('../../lib/utils/nostrUtils', async () => {
    const actual = await vi.importActual<typeof import('../../lib/utils/nostrUtils')>('../../lib/utils/nostrUtils');
    return {
        ...actual,
        toNevent: nostrUtilsMock.toNevent,
    };
});

import PostHistoryDialog from '../../components/PostHistoryDialog.svelte';

describe('PostHistoryDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        repositoryMock.getAll.mockResolvedValue([]);
        clipboardMock.tryCopyToClipboard.mockResolvedValue(true);
        nostrUtilsMock.toNevent.mockReturnValue('nevent1mock');
    });

    it('空の投稿履歴を表示する', async () => {
        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(repositoryMock.getAll).toHaveBeenCalledWith({ pubkeyHex: 'a'.repeat(64) });
            expect(screen.getByText('投稿履歴はまだありません')).toBeTruthy();
        });
    });

    it('投稿履歴一覧を表示し、neventコピー成功を表示する', async () => {
        repositoryMock.getAll.mockResolvedValue([
            {
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
                schemaVersion: 1,
            },
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByText(/投稿本文 https:\/\/example.com\/image.jpg/)).toBeTruthy();
            expect(screen.getByText(/event id:/)).toBeTruthy();
            expect(screen.getByText('メディア: image 1')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'neventをコピー' }));

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
        expect(screen.getByText('コピーしました')).toBeTruthy();
    });

    it('neventコピー失敗を表示する', async () => {
        repositoryMock.getAll.mockResolvedValue([
            {
                id: 'event-1',
                eventId: 'b'.repeat(64),
                pubkeyHex: 'a'.repeat(64),
                kind: 1,
                content: '投稿本文',
                tags: [],
                createdAt: 1_700_000_000,
                postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
                relayHints: [],
                acceptedRelays: [],
                media: [],
                rawEvent: {},
                updatedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
                schemaVersion: 1,
            },
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

        await fireEvent.click(screen.getByRole('button', { name: 'neventをコピー' }));

        expect(screen.getByText('コピーに失敗しました')).toBeTruthy();
    });
});
