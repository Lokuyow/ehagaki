import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { PUBKEY_HEX, cleanupPostHistoryDialogHarness, createDeferred,
    createRecord, createRelayFetchResult, relayFetchServiceMock, repositoryMock,
    resetPostHistoryDialogHarness, seedPostHistoryCoverage, completedRelayCoverage } from "./postHistoryDialogTestHarness";
import { postHistoryLocalRelayService, type LocalRelayHistoryReadResult } from "../../lib/postHistoryLocalRelayService";
import { settingsStore } from "../../stores/settingsStore.svelte";
import ListingHarness from "../fixtures/PostHistoryLocalRelayListingHarness.svelte";
import { mergePostHistoryCoverageRanges } from "../../lib/postHistoryRelayCoverage";
import type { PostHistoryLocalBrowsingRanges } from "../../lib/storage/postHistoryLocalBrowsingRangesRepository";

const durable = vi.hoisted(() => ({ get: vi.fn(), record: null as PostHistoryLocalBrowsingRanges | null }));
vi.mock("../../lib/storage/postHistoryLocalBrowsingRangesRepository", async () => ({
    ...await vi.importActual("../../lib/storage/postHistoryLocalBrowsingRangesRepository"),
    postHistoryLocalBrowsingRangesRepository: { get: durable.get },
}));

const base = 1_700_000_000;
const corpus = Array.from({ length: 360 }, (_, i) => createRecord({ eventId: `live-${i}`,
    content: `live row ${i}`, createdAt: base - i, postedAt: (base - i) * 1000 }));
let saved: typeof corpus;
let available: typeof corpus;
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
    const events = available.filter(row => (input.until === undefined || row.createdAt <= input.until))
        .slice(0, input.limit);
    const inserted = events.filter(row => !saved.some(old => old.eventId === row.eventId));
    saved = [...saved, ...inserted].sort((a, b) => b.createdAt - a.createdAt);
    const oldest = events.at(-1)?.createdAt ?? null;
    const hasMore = events.length === input.limit;
    return { ownerPubkeyHex: PUBKEY_HEX, sessionGeneration: postHistoryLocalRelayService.getSessionGeneration(),
        localRevision: 0, changed: inserted.length > 0, eventIds: events.map(row => row.eventId),
        nextUntil: oldest, hasMore, browsingRanges: oldest === null ? [] : [{ since: oldest + Number(hasMore), until: input.until ?? base + 100 }] };
}
function commitPage(input: Parameters<typeof postHistoryLocalRelayService.read>[0], result = page(input)) {
    const previous = durable.record;
    const nextUntil = result.nextUntil ?? previous?.resumeHint?.nextUntil ?? input.until;
    durable.record = { schemaVersion: 1, source: "local-relay", ownerPubkeyHex: PUBKEY_HEX,
        kindsKey: "1,6,16,42,1111", localRelayUrl: settingsStore.localRelayUrl!, localRevision: 0,
        browsingRanges: mergePostHistoryCoverageRanges([...(previous?.browsingRanges ?? []), ...result.browsingRanges]),
        resumeHint: nextUntil === undefined ? null : { nextUntil: Math.min(previous?.resumeHint?.nextUntil ?? nextUntil, nextUntil) } };
    return result;
}
beforeEach(() => {
    resetPostHistoryDialogHarness({ coverageMode: "none" }); saved = []; available = corpus;
    durable.record = null;
    durable.get.mockImplementation(async (owner, kinds, url) => durable.record ?? ({
        schemaVersion: 1, source: "local-relay", ownerPubkeyHex: owner, kindsKey: kinds, localRelayUrl: url,
        localRevision: 0, browsingRanges: [], resumeHint: null,
    }));
    settingsStore.setLocalRelayUrl("ws://127.0.0.1:4869/");
    postHistoryLocalRelayService.configureSession({ ownerPubkeyHex: PUBKEY_HEX,
        url: settingsStore.localRelayUrl, isActive: () => true });
    read = vi.spyOn(postHistoryLocalRelayService, "read").mockImplementation(input => ({ cancel: vi.fn(), promise: Promise.resolve(commitPage(input)) }));
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
    it("retains committed evidence when an older same-scope snapshot arrives during reveal", async () => {
        const view = render(ListingHarness, { props });
        await screen.findByText("live row 49");
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        const committed = durable.record!;
        // A liveQuery callback can finish its revision check after the page's
        // commit. Its earlier snapshot is valid for this URL/revision, but may
        // not retract positive browsing evidence already adopted by the listing.
        durable.get.mockResolvedValueOnce({ ...committed, browsingRanges: [], resumeHint: null });
        await reveal(99);
        expect(durable.record!.browsingRanges).toEqual(committed.browsingRanges);
        expect(localOlderRequests()).toHaveLength(0);
        view.unmount();
    });

    it("restores positive browsing evidence and rechecks a previously drained continuation after reopen", async () => {
        available = corpus.slice(0, 60);
        const view = render(ListingHarness, { props });
        await screen.findByText("live row 49"); await reveal(59);
        await fetchOlder(); expect(localOlderRequests()).toHaveLength(0);
        const ranges = durable.record!.browsingRanges;
        view.unmount(); available = corpus.slice(0, 85);
        const reopened = render(ListingHarness, { props });
        await screen.findByText("live row 49");
        await waitFor(() => expect(read.mock.calls.some(([input]) => input.reason === "dialog-open-refresh")).toBe(true));
        await reveal(59); await fetchOlder(); await screen.findByText("live row 60");
        await reveal(84);
        expect(localOlderRequests()).toHaveLength(1);
        expect(localOlderRequests()[0][0].until).toBe(base - 59);
        expect(durable.record!.browsingRanges[0].until).toBe(ranges[0].until);
        expect(durable.record!.browsingRanges[0].since).toBe(base - 84);
        reopened.unmount();
    });

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
        read.mockImplementation(input => ({ cancel: vi.fn(), promise: Promise.resolve(commitPage(input, { ...page(input),
            nextUntil: base - 149 + offset, hasMore: true, browsingRanges: [] })) }));
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

    it("restores committed evidence and the resume hint after same-owner session recreation", async () => {
        const view = render(ListingHarness, { props });
        await screen.findByText("live row 49"); await reveal(99);
        postHistoryLocalRelayService.configureSession({ ownerPubkeyHex: PUBKEY_HEX, url: settingsStore.localRelayUrl, isActive: () => true });
        await reveal(148);
        await fetchOlder();
        await waitFor(() => expect(localOlderRequests()).toHaveLength(1));
        expect(localOlderRequests()[0][0].until).toBe(base - 149);
        await screen.findByText("live row 149");
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
        pending.resolve(commitPage(read.mock.calls[0][0]));
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
