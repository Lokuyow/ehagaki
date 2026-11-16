import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    createDeferred,
    createRecord,
    repositoryMock,
    resetPostHistoryDialogHarness,
} from './postHistoryDialogTestHarness';

const OWNER = 'a'.repeat(64);
const PARENT_AUTHOR = 'd'.repeat(64);

function createReplyWithParent(index: number) {
    const postId = String(index).repeat(64);
    const parentId = String(index + 5).repeat(64);
    const createdAt = 1_700_000_000 - index * 10;
    const parentContent = `返信先の投稿${index}`;
    const parentRecord = createRecord({
        eventId: parentId,
        pubkeyHex: PARENT_AUTHOR,
        content: parentContent,
        media: [],
        createdAt: createdAt - 5,
        rawEvent: {
            id: parentId,
            pubkey: PARENT_AUTHOR,
            kind: 1,
            content: parentContent,
            tags: [],
            created_at: createdAt - 5,
            sig: 'e'.repeat(128),
        },
    });
    const tags = [['e', parentId, 'wss://reply.example.com/', 'reply']];
    const post = createRecord({
        eventId: postId,
        content: `自分の返信${index}`,
        media: [],
        tags,
        createdAt,
        postedAt: createdAt * 1000,
        rawEvent: {
            id: postId,
            pubkey: OWNER,
            kind: 1,
            content: `自分の返信${index}`,
            tags,
            created_at: createdAt,
            sig: 'c'.repeat(128),
        },
    });
    return { post, parentId, parentRecord, parentContent };
}

describe('PostHistoryDialog: 返信先の同時読み込み', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness({ listingMode: 'page-adapter' });
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('返信先の読み込み中に別の投稿の返信先を開いても、先の返信先を表示する', async () => {
        const first = createReplyWithParent(1);
        const second = createReplyWithParent(2);
        const firstParent = createDeferred<typeof first.parentRecord | null>();

        repositoryMock.getPage.mockResolvedValue([first.post, second.post]);
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) => {
            if (eventId === first.parentId) return firstParent.promise;
            return eventId === second.parentId ? second.parentRecord : null;
        });

        render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: OWNER },
        });

        await waitFor(() => {
            expect(screen.getAllByRole('button', { name: '返信先を見る' })).toHaveLength(2);
        });
        const [firstToggle, secondToggle] = screen.getAllByRole('button', { name: '返信先を見る' });

        await fireEvent.click(firstToggle);
        await waitFor(() => {
            expect(repositoryMock.getByEventId).toHaveBeenCalledWith(first.parentId);
        });
        await fireEvent.click(secondToggle);
        await waitFor(() => {
            expect(screen.getByText(second.parentContent)).toBeTruthy();
        });

        firstParent.resolve(first.parentRecord);

        await waitFor(() => {
            expect(screen.getByText(first.parentContent)).toBeTruthy();
        });
        expect(screen.getByText(second.parentContent)).toBeTruthy();
        for (const toggle of screen.getAllByRole('button', { name: '返信先を隠す' })) {
            expect((toggle as HTMLButtonElement).disabled).toBe(false);
        }
    });
});
