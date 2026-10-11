import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { PUBKEY_HEX, cleanupPostHistoryDialogHarness, createDeferred,
    createRecord, createRelayFetchResult, relayFetchServiceMock, repositoryMock,
    resetPostHistoryDialogHarness, seedPostHistoryCoverage, completedRelayCoverage } from "./postHistoryDialogTestHarness";
import { postHistoryLocalRelayService, type LocalRelayHistoryReadResult } from "../../lib/postHistoryLocalRelayService";
import { settingsStore } from "../../stores/settingsStore.svelte";
import ListingHarness from "../fixtures/PostHistoryLocalRelayListingHarness.svelte";

const base = 1_700_000_000;
const corpus = Array.from({ length: 360 }, (_, i) => createRecord({ eventId: `live-${i}`,
    content: `live row ${i}`, createdAt: base - i, postedAt: (base - i) * 1000 }));
let saved: typeof corpus;
let read: MockInstance<typeof postHistoryLocalRelayService.read>;
const props = { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: {} as any };
const localOlderRequests = () => read.mock.calls.filter(([input]) => input.reason === "older-backfill");
const olderButton = () => screen.findByRole("button", { name: "リレーから続きを取得" });
async function reveal(end: number) {
    await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
    if (screen.queryByText(`live row ${end}`)) return;
    await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
    await screen.findByText(`live row ${end}`);
}
async function fetchOlder() {
    const button = await olderButton();
    await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
    await fireEvent.click(button);
}
function page(input: Parameters<typeof postHistoryLocalRelayService.read>[0]): LocalRelayHistoryReadResult {
    const events = corpus.filter(row => (input.until === undefined || row.createdAt <= input.until))
        .slice(0, input.limit);
    const inserted = events.filter(row => !saved.some(old => old.eventId === row.eventId));
    saved = [...saved, ...inserted].sort((a, b) => b.createdAt - a.createdAt);
    const oldest = events.at(-1)?.createdAt ?? null;
    const hasMore = events.length === input.limit;
    return { ownerPubkeyHex: PUBKEY_HEX, sessionGeneration: postHistoryLocalRelayService.getSessionGeneration(),
        localRevision: 0, changed: inserted.length > 0, eventIds: events.map(row => row.eventId),
        nextUntil: oldest, hasMore, browsingRanges: oldest === null ? [] : [{ since: oldest + Number(hasMore), until: input.until ?? base + 100 }] };
}
beforeEach(() => {
    resetPostHistoryDialogHarness({ coverageMode: "none" }); saved = [];
    settingsStore.setLocalRelayUrl("ws://127.0.0.1:4869/");
    postHistoryLocalRelayService.configureSession({ ownerPubkeyHex: PUBKEY_HEX,
        url: settingsStore.localRelayUrl, isActive: () => true });
    read = vi.spyOn(postHistoryLocalRelayService, "read").mockImplementation(input => ({ cancel: vi.fn(), promise: Promise.resolve(page(input)) }));
    const visible = (floor: number | null) => saved.filter(row => floor === null || row.createdAt >= floor);
    repositoryMock.getLatestVisibleChunk.mockImplementation(async ({ visibleUntil, limit }) => visible(visibleUntil).slice(0, limit));
    repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ visibleUntil, cursor, limit }) => visible(visibleUntil).filter(row => row.createdAt < cursor.createdAt).slice(0, limit));
    repositoryMock.getNewerVisibleChunk.mockImplementation(async ({ visibleUntil, cursor, limit }) => visible(visibleUntil).filter(row => row.createdAt > cursor.createdAt).slice(-limit));
    repositoryMock.countForPubkey.mockImplementation(async () => saved.length);
    repositoryMock.countVisibleForPubkey.mockImplementation(async (_owner, floor) => visible(floor).length);
    repositoryMock.getByEventId.mockImplementation(async id => saved.find(row => row.eventId === id) ?? null);
    repositoryMock.hasPostsBeforeCreatedAt.mockImplementation(async (_owner, floor) => saved.some(row => row.createdAt < floor));
    relayFetchServiceMock.fetchLatest.mockReturnValue({ cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({ status: "failed" })) });
    vi.spyOn(Date, "now").mockReturnValue((base + 100) * 1000);
});
afterEach(() => { cleanupPostHistoryDialogHarness(); postHistoryLocalRelayService.cancelSession(); settingsStore.setLocalRelayUrl(""); vi.restoreAllMocks(); });

describe("live local query continuity in the listing", () => {
    it("commits local older pages without waiting for a silent external peer and preserves the late peer's window", async () => {
        const pending = createDeferred<ReturnType<typeof createRelayFetchResult>>(); const cancel = vi.fn();
        relayFetchServiceMock.fetchLatest.mockReturnValue({ cancel, promise: pending.promise });
        const view = render(ListingHarness, { props });
        await screen.findByText("live row 49"); await reveal(99); await reveal(148);
        await fetchOlder(); await screen.findByText("live row 149");
        await reveal(199); await reveal(249); await reveal(297);
        await fetchOlder(); await screen.findByText("live row 298"); await reveal(348); await reveal(359);
        expect(localOlderRequests().map(([input]) => input.until)).toEqual([base - 149, base - 298]);
        expect(cancel).not.toHaveBeenCalled(); expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledOnce();
        pending.resolve(createRelayFetchResult({ relayFetchCoverage: completedRelayCoverage(base - 49, base + 100) }));
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        expect(screen.getByText("live row 359")).toBeTruthy();
        expect(view.container.querySelectorAll(".post-history-item").length).toBeLessThanOrEqual(150);
        await fetchOlder(); expect(localOlderRequests()).toHaveLength(2);
        view.unmount();
    });

    it.each([0, 1])("stops a saturated equal/newer cursor (%s) and retains the unresolved boundary", async (offset) => {
        const view = render(ListingHarness, { props });
        await screen.findByText("live row 49"); await reveal(99); await reveal(148);
        read.mockImplementation(input => ({ cancel: vi.fn(), promise: Promise.resolve({ ...page(input),
            nextUntil: base - 149 + offset, hasMore: true, browsingRanges: [] }) }));
        await fetchOlder();
        await waitFor(() => expect(localOlderRequests()).toHaveLength(1));
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        expect(screen.queryByText("live row 149")).toBeNull();
        for (let i = 0; i < 2; i++) {
            const button = await olderButton(); await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
            await fireEvent.click(button); await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        }
        expect(localOlderRequests()).toHaveLength(1);
        expect(relayFetchServiceMock.fetchLatest.mock.calls.filter(([, input]) => input.reason === "older-backfill").length).toBeGreaterThan(0);
        view.unmount();
    });

    it("invalidates local evidence and cursor on same-owner session recreation", async () => {
        const view = render(ListingHarness, { props });
        await screen.findByText("live row 49"); await reveal(99);
        postHistoryLocalRelayService.configureSession({ ownerPubkeyHex: PUBKEY_HEX, url: settingsStore.localRelayUrl, isActive: () => true });
        await waitFor(() => expect(screen.queryByRole("button", { name: "さらに古い投稿を表示" })).toBeNull());
        await fetchOlder();
        await waitFor(() => expect(localOlderRequests()).toHaveLength(1));
        expect(localOlderRequests()[0][0].until).toBeUndefined();
        await screen.findByText("live row 148");
        view.unmount();
    });

    it("external success remains usable when local read fails", async () => {
        saved = corpus.slice(0, 100); seedPostHistoryCoverage(base - 49, base + 100);
        read.mockReturnValue({ cancel: vi.fn(), promise: Promise.resolve(null) });
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({
            hasMore: true, nextUntil: base - 49,
            relayFetchCoverage: completedRelayCoverage(input.since ?? base - 99, input.until),
        })) }));
        const view = render(ListingHarness, { props }); await screen.findByText("live row 49");
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalled());
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        await fetchOlder(); await screen.findByText("live row 99");
        expect(screen.queryByText("リレーとの同期に失敗しました")).toBeNull(); view.unmount();
    });

    it("keeps a pending local peer when external alone can start another older operation", async () => {
        saved = corpus.slice(0, 150); seedPostHistoryCoverage(base - 49, base + 100);
        const pending = createDeferred<LocalRelayHistoryReadResult | null>(); const cancel = vi.fn();
        read.mockReturnValue({ cancel, promise: pending.promise });
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({
            hasMore: true, nextUntil: base - 149, relayFetchCoverage: completedRelayCoverage(input.since ?? base - 49, input.until),
        })) }));
        const view = render(ListingHarness, { props }); await screen.findByText("live row 49");
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledOnce());
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        await fetchOlder(); await screen.findByText("live row 99");
        expect(read).toHaveBeenCalledOnce(); expect(cancel).not.toHaveBeenCalled();
        pending.resolve(page(read.mock.calls[0][0]));
        await waitFor(() => expect(screen.queryByText("live row 99")).not.toBeNull());
        expect(read).toHaveBeenCalledOnce(); view.unmount();
    });

    it("never uses local ranges as external older bounds after the local window has advanced", async () => {
        const view = render(ListingHarness, { props }); await screen.findByText("live row 49");
        await reveal(99); await reveal(148); await fetchOlder(); await screen.findByText("live row 149");
        await reveal(199);
        const requests = relayFetchServiceMock.fetchLatest.mock.calls.filter(([, input]) => input.reason === "older-backfill");
        expect(requests[0][1].until).toBe(base - 49);
        const lastCount = requests.length;
        await reveal(249); await reveal(297);
        await fetchOlder();
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest.mock.calls.filter(([, input]) => input.reason === "older-backfill")).toHaveLength(lastCount + 1));
        expect(relayFetchServiceMock.fetchLatest.mock.calls.at(-1)![1].until).toBe(base - 49);
        view.unmount();
    });

});
