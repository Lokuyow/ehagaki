import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    postDeletionServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
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

describe('PostHistoryDialog', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness({ listingMode: 'page-adapter' });
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('[delete-service-success] 削除確認後に service を呼び、削除状態表示へ切り替える', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'delete-target', content: '削除対象本文', media: [] }),
        ]);
        postDeletionServiceMock.requestDeletion.mockResolvedValue({
            success: true,
            eventId: 'delete-event-id',
            deletionEventId: 'delete-event-id',
            deletedAt: 4567,
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await screen.findByText('削除対象本文');
        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('menuitem', { name: '削除' }));
        await fireEvent.click(await screen.findByRole('button', { name: '送信' }));

        await waitFor(() => {
            expect(postDeletionServiceMock.requestDeletion).toHaveBeenCalledWith({
                post: expect.objectContaining({ eventId: 'delete-target' }),
                rxNostr: {},
            });
            expect(screen.getAllByText('削除リクエスト済み')).toHaveLength(1);
        });
    });

    it('[delete-service-failure] 削除送信失敗時に deleteFailed を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'delete-target', content: '削除対象本文', media: [] }),
        ]);
        postDeletionServiceMock.requestDeletion.mockResolvedValue({
            success: false,
            error: 'post_error',
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await screen.findByText('削除対象本文');
        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('menuitem', { name: '削除' }));
        await fireEvent.click(await screen.findByRole('button', { name: '送信' }));

        await waitFor(() => {
            expect(screen.getAllByText('削除リクエストの送信に失敗しました')).toHaveLength(1);
        });
    });

});
