import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';

const readerSpies = vi.hoisted(() => ({
    created: vi.fn(),
    observed: vi.fn(),
}));

vi.mock('../../lib/sensitiveContentPayloadReader', async (importOriginal) => {
    const original = await importOriginal<typeof import('../../lib/sensitiveContentPayloadReader')>();
    return {
        ...original,
        createSensitivePayloadBodyLoader: (
            params: Parameters<typeof original.createSensitivePayloadBodyLoader>[0],
        ) => {
            const loader = original.createSensitivePayloadBodyLoader(params);
            if (loader) {
                readerSpies.created(params.structure?.id);
                loader.observe = () => {
                    readerSpies.observed(params.structure?.id);
                    return () => {};
                };
            }
            return loader;
        },
    };
});

import {
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    createRecord,
    repositoryMock,
    resetPostHistoryDialogHarness,
} from './postHistoryDialogTestHarness';

const OWNER = 'a'.repeat(64);
const PARENT_AUTHOR = 'd'.repeat(64);
const POST_COUNT = 3;

function createReplyWithSensitiveParent(index: number) {
    const postId = String(index + 1).repeat(64);
    const parentId = String(index + 5).repeat(64);
    const createdAt = 1_700_000_000 - index * 10;
    const parentTags = [['content-warning', ''], ['c', 'f'.repeat(63) + index]];
    const parentRecord = createRecord({
        eventId: parentId,
        pubkeyHex: PARENT_AUTHOR,
        content: '',
        tags: parentTags,
        createdAt: createdAt - 5,
        rawEvent: {
            id: parentId,
            pubkey: PARENT_AUTHOR,
            kind: 1,
            content: '',
            tags: parentTags,
            created_at: createdAt - 5,
            sig: 'e'.repeat(128),
        },
    });
    const tags = [['e', parentId, 'wss://reply.example.com/', 'reply']];
    const post = createRecord({
        eventId: postId,
        content: `自分の返信${index}`,
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
    return { post, parentId, parentRecord };
}

async function showNextReplyTarget(expectedCardCount: number): Promise<void> {
    await fireEvent.click(screen.getAllByRole('button', { name: '返信先を見る' })[0]);
    await waitFor(() => {
        expect(document.querySelectorAll('.post-history-related-card')).toHaveLength(expectedCardCount);
    });
}

describe('PostHistoryDialog: センシティブ本文ローダーの使い回し', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness({ listingMode: 'page-adapter' });
        readerSpies.created.mockClear();
        readerSpies.observed.mockClear();
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('別の返信先を開いても、表示済みの返信先はローダーを作り直さず監視も張り直さない', async () => {
        const items = Array.from({ length: POST_COUNT }, (_, index) => createReplyWithSensitiveParent(index));
        const parentsById = new Map(items.map((item) => [item.parentId, item.parentRecord]));
        repositoryMock.getPage.mockResolvedValue(items.map((item) => item.post));
        repositoryMock.countForPubkey.mockResolvedValue(POST_COUNT);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            parentsById.get(eventId) ?? null,
        );

        render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: OWNER },
        });

        await waitFor(() => {
            expect(screen.getAllByRole('button', { name: '返信先を見る' })).toHaveLength(POST_COUNT);
        });
        await showNextReplyTarget(1);
        await showNextReplyTarget(2);
        readerSpies.created.mockClear();
        readerSpies.observed.mockClear();

        await showNextReplyTarget(3);

        const lastParentId = items[POST_COUNT - 1].parentId;
        expect(readerSpies.created.mock.calls).toEqual([[lastParentId]]);
        expect(readerSpies.observed.mock.calls).toEqual([[lastParentId]]);
    });
});
