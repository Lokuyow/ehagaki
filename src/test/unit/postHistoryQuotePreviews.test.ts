import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import type { RxNostr } from 'rx-nostr';
import QuotePreviewsHarness from './fixtures/QuotePreviewsHarness.svelte';
import { createPostHistoryRelatedTargetResolver } from '../../lib/postHistoryRelatedTargetResolver.svelte';
import { repostTargetToPost } from '../../lib/postRepostUtils';
import { createDeferred } from '../deferredTestUtils';
import type { NostrEvent } from '../../lib/types';

afterEach(cleanup);

function setup(holdFirst = false) {
    const target = finalizeEvent({ kind: 1, content: 'independent quote target', tags: [], created_at: 1 }, generateSecretKey());
    const wrongAuthor = getPublicKey(generateSecretKey());
    const posts = [wrongAuthor, target.pubkey].map((author, index) => repostTargetToPost(finalizeEvent({ kind: 1,
        content: `quote ${index}`, tags: [['q', target.id, '', author]], created_at: 3 - index }, generateSecretKey())));
    const deferred = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
    const cancel = vi.fn();
    const fetchEventById = vi.fn((_runtime: RxNostr, params: { authorHint?: string | null }) => ({ cancel,
        promise: holdFirst && params.authorHint === wrongAuthor ? deferred.promise
            : Promise.resolve({ event: params.authorHint === target.pubkey ? target : null, relayUrl: null }),
    }));
    const runtime = {} as RxNostr;
    const resolver = createPostHistoryRelatedTargetResolver({ getShow: () => true, getRxNostr: () => runtime,
        getRelayConfig: () => null, requireFullVerification: true,
        postHistoryRepositoryImpl: { getByEventId: async () => null }, contextFetchService: { fetchEventById },
        deletionRequestsRepositoryImpl: { getDeletedTargets: async () => new Map(), upsertValidDeletionRequests: vi.fn() },
        deletionFetchService: { fetchDeletionRequests: () => ({ promise: Promise.resolve({ status: 'success' as const,
            events: [], fetchedAt: 0, relayUrls: [] }), cancel: vi.fn() }) },
        profileSyncCoordinator: { ensureProfile: vi.fn(), subscribe: () => () => undefined, reset: vi.fn(), dispose: vi.fn() },
    });
    return { target, wrongAuthor, posts, deferred, cancel, fetchEventById, runtime, resolver };
}

it('tries the correct source author after the newer quote cannot locate the target', async () => {
    const fixture = setup();
    const { resolver, posts, runtime, target, wrongAuthor, fetchEventById } = fixture;
    const view = render(QuotePreviewsHarness, { resolver, posts, runtime });
    try {
        await vi.waitFor(() => expect(within(screen.getByTestId(posts[1].eventId)).getByText('resolved')).toBeTruthy());
        expect(within(screen.getByTestId(posts[0].eventId)).getByText('error')).toBeTruthy();
        expect(fetchEventById.mock.calls.map(([, params]) => params.authorHint)).toEqual([wrongAuthor, target.pubkey]);
        expect(resolver.getTargetSnapshot(target.id)).toMatchObject({ status: 'resolved', event: target });
    } finally { view.unmount(); resolver.reset(); }
});

it('stops alternate-author lookup after the quote scope closes', async () => {
    const fixture = setup(true);
    const { resolver, posts, runtime, deferred, cancel, fetchEventById } = fixture;
    const view = render(QuotePreviewsHarness, { resolver, posts, runtime });
    try {
        await vi.waitFor(() => expect(fetchEventById).toHaveBeenCalledOnce());
        await view.rerender({ show: false });
        await vi.waitFor(() => expect(cancel).toHaveBeenCalledOnce());
        deferred.resolve({ event: null, relayUrl: null });
        await tick();
        expect(fetchEventById).toHaveBeenCalledOnce();
    } finally { view.unmount(); resolver.reset(); }
});
