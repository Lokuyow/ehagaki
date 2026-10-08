import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { PUBKEY_HEX, PostHistoryDialog, cleanupPostHistoryDialogHarness, completedRelayCoverage,
    createRecord, createRelayFetchResult, relayFetchServiceMock, repositoryMock, resetPostHistoryDialogHarness,
    seedPostHistoryCoverage } from "./postHistoryDialogTestHarness";
import { clearPersistedPostHistoryListingSnapshots } from "../../lib/hooks/usePostHistoryListing.svelte";
import { markPostHistoryShouldReturnToLatestAfterLocalPost } from "../../lib/postHistoryLatestRequest";

const base = 1_700_000_000;
const upper = base + 2000;
const old = Array.from({ length: 110 }, (_, i) => createRecord({ eventId: `old-${i}`,
    content: `saved row ${i}`, createdAt: base - i, postedAt: (base - i) * 1000 }));
const head = Array.from({ length: 60 }, (_, i) => createRecord({ eventId: `new-${i}`,
    content: `fresh row ${i}`, createdAt: base + 1000 - i, postedAt: (base + 1000 - i) * 1000 }));
const fetched = (posts: typeof old) => posts.map((post) => ({ event: {
    id: post.eventId, pubkey: PUBKEY_HEX, kind: 1, content: post.content,
    tags: [], created_at: post.createdAt, sig: "c".repeat(128),
}, relayUrls: [] }));

function savedHistory(newPosts = head) {
    let saved = [...old];
    const visible = (floor: number | null) => saved.filter((post) => floor === null || post.createdAt >= floor);
    repositoryMock.getLatestVisibleChunk.mockImplementation(async ({ visibleUntil, limit }) => visible(visibleUntil).slice(0, limit));
    repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ visibleUntil, cursor, limit }) =>
        visible(visibleUntil).filter((post) => post.createdAt < cursor.createdAt).slice(0, limit));
    repositoryMock.countForPubkey.mockImplementation(async () => saved.length);
    repositoryMock.countVisibleForPubkey.mockImplementation(async (_owner, floor) => visible(floor).length);
    repositoryMock.hasPostsBeforeCreatedAt.mockImplementation(async (_owner, floor) => saved.some((post) => post.createdAt < floor));
    repositoryMock.upsertFetchedEvents.mockImplementation(async ({ events }) => {
        const added = newPosts.filter((post) => events.some((item: any) => item.event.id === post.eventId)
            && !saved.some((existing) => existing.eventId === post.eventId));
        saved = [...saved, ...added].sort((a, b) => b.createdAt - a.createdAt);
        return { insertedCount: added.length, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 };
    });
    seedPostHistoryCoverage(base - 109, base);
    return { addLocal: () => { saved = [head[0], ...saved];
        markPostHistoryShouldReturnToLatestAfterLocalPost({ pubkeyHex: PUBKEY_HEX, eventId: head[0].eventId }); } };
}
const props = { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: {} as any };

describe("open-time authored history connection", () => {
    beforeEach(() => { resetPostHistoryDialogHarness({ coverageMode: "none" });
        vi.spyOn(Date, "now").mockReturnValue(upper * 1000); });
    afterEach(() => { cleanupPostHistoryDialogHarness(); vi.restoreAllMocks(); });

    it("automatically connects a saturated head to saved history using only the uncovered interval", async () => {
        savedHistory();
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(
            input.reason === "dialog-open-refresh" ? createRelayFetchResult({ events: fetched(head.slice(0, 30)),
                relayFetchCoverage: completedRelayCoverage(head[29].createdAt + 1, input.until), hasMore: true,
                nextUntil: head[29].createdAt }) : createRelayFetchResult({ events: fetched(head.slice(29)),
                relayFetchCoverage: completedRelayCoverage(input.since, input.until) }),
        ) }));
        const view = render(PostHistoryDialog, { props });
        await screen.findByText("fresh row 49");
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(1, props.rxNostr,
            expect.objectContaining({ reason: "dialog-open-refresh", since: base, until: upper, limit: 30 }));
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(2, props.rxNostr,
            expect.objectContaining({ reason: "dialog-open-catchup", since: base, until: head[29].createdAt, limit: 150, timeoutMs: 6000 }));
        await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
        await screen.findByText("saved row 39");
        expect(screen.queryByRole("button", { name: "リレーから続きを取得" })).toBeNull();
        expect(screen.queryByRole("button", { name: "保存済みの古い投稿を表示" })).toBeNull();
        view.unmount();
    });

    it("continues across multiple full catchup pages with a fixed lower and upper bound", async () => {
        const many = Array.from({ length: 350 }, (_, i) => createRecord({ eventId: `many-${i}`,
            content: `many row ${i}`, createdAt: base + 1000 - i, postedAt: (base + 1000 - i) * 1000 }));
        savedHistory(many);
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => {
            const events = many.filter((post) => post.createdAt >= input.since && post.createdAt <= input.until).slice(0, input.limit);
            const saturated = events.length === input.limit;
            return { cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({ events: fetched(events),
                hasMore: saturated, nextUntil: events.at(-1)?.createdAt ?? null,
                relayFetchCoverage: completedRelayCoverage(saturated ? events.at(-1)!.createdAt + 1 : input.since, input.until),
            })) };
        });
        const view = render(PostHistoryDialog, { props });
        await screen.findByText("many row 49");
        expect(relayFetchServiceMock.fetchLatest.mock.calls.map(([, input]) => [input.since, input.until, input.limit]))
            .toEqual([[base, upper, 30], [base, base + 971, 150], [base, base + 822, 150], [base, base + 673, 150]]);
        view.unmount();
    });

    it.each([false, true])("records empty or already-known query results and refreshes after a local post inside TTL (known: %s)", async (known) => {
        const history = savedHistory();
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(
            createRelayFetchResult({ events: known ? fetched([old[0]]) : [],
                relayFetchCoverage: completedRelayCoverage(input.since, input.until) }),
        ) }));
        const initial = render(PostHistoryDialog, { props });
        await waitFor(() => expect(repositoryMock.upsertFetchedEvents).toHaveBeenCalledOnce());
        initial.unmount();
        // Browser reload drops the in-memory listing, while persisted coverage survives.
        clearPersistedPostHistoryListingSnapshots();
        const reloaded = render(PostHistoryDialog, { props });
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        reloaded.unmount();
        history.addLocal();
        const afterPost = render(PostHistoryDialog, { props });
        await screen.findByText("fresh row 0");
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(3));
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        await fireEvent.click(screen.getByRole("button", { name: "さらに古い投稿を表示" }));
        await screen.findByText("saved row 98");
        expect(screen.queryByRole("button", { name: "リレーから続きを取得" })).toBeNull();
        afterPost.unmount();
    });

    it.each(["same-second", "no-quorum"])("stops without skipping an unconfirmed boundary (%s)", async (failure) => {
        savedHistory();
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(
            createRelayFetchResult({ events: fetched(head), hasMore: true, nextUntil: head[0].createdAt,
                relayFetchCoverage: failure === "same-second" ? completedRelayCoverage(head[0].createdAt + 1, input.until) : [] }),
        ) }));
        const view = render(PostHistoryDialog, { props });
        await screen.findByText("fresh row 49");
        await screen.findByRole("button", { name: "リレーから続きを取得" });
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
        expect(relayFetchServiceMock.fetchLatest.mock.calls[1][1].until)
            .toBe(failure === "same-second" ? head[0].createdAt : upper);
        expect(screen.getByRole("button", { name: "保存済みの古い投稿を表示" })).toBeTruthy();
        view.unmount();
    });

    it("retries a detached head inside TTL and connects to the older saved component", async () => {
        savedHistory();
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({ cancel: vi.fn(), promise: Promise.resolve(
            createRelayFetchResult({ events: fetched(head), relayFetchCoverage: completedRelayCoverage(head[29].createdAt + 1, upper) }),
        ) }).mockReturnValueOnce({ cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({ relayFetchCoverage: [] })) });
        const first = render(PostHistoryDialog, { props });
        await screen.findByText("fresh row 49");
        await screen.findByRole("button", { name: "リレーから続きを取得" });
        first.unmount();
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(
            createRelayFetchResult({ relayFetchCoverage: completedRelayCoverage(input.since, input.until) }),
        ) }));
        const reopened = render(PostHistoryDialog, { props });
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(3));
        expect(relayFetchServiceMock.fetchLatest.mock.calls[2][1]).toMatchObject({ since: base, until: upper });
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        await fireEvent.click(screen.getByRole("button", { name: "さらに古い投稿を表示" }));
        await screen.findByText("saved row 39");
        expect(screen.queryByRole("button", { name: "リレーから続きを取得" })).toBeNull();
        reopened.unmount();
    });

    it.each(["close", "config", "account", "runtime"])("cancels catchup and discards late events after %s", async (operation) => {
        savedHistory();
        let release!: (value: ReturnType<typeof createRelayFetchResult>) => void;
        const cancel = vi.fn();
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({ cancel: vi.fn(), promise: Promise.resolve(
            createRelayFetchResult({ relayFetchCoverage: [] }),
        ) }).mockReturnValueOnce({ cancel, promise: new Promise((resolve) => { release = resolve; }) });
        const view = render(PostHistoryDialog, { props });
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2));
        expect(screen.queryByRole("button", { name: "保存済みの古い投稿を表示" })).toBeNull();
        if (operation === "close") view.unmount();
        else await view.rerender({ ...props,
            ...(operation === "config" ? { relayConfig: { "wss://other.example.com/": { read: true, write: true } } } : {}),
            ...(operation === "account" ? { pubkeyHex: "b".repeat(64) } : {}),
            ...(operation === "runtime" ? { rxNostr: {} as any } : {}),
        });
        release(createRelayFetchResult({ events: fetched(head), relayFetchCoverage: completedRelayCoverage(base, upper) }));
        await waitFor(() => expect(cancel).toHaveBeenCalledOnce());
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
        if (operation !== "close") view.unmount();
    });
});
