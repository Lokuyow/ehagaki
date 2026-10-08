import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { PUBKEY_HEX, PostHistoryDialog, cleanupPostHistoryDialogHarness, completedRelayCoverage,
    createRecord, createRelayFetchResult, relayFetchServiceMock, repositoryMock, resetPostHistoryDialogHarness,
    seedPostHistoryCoverage, visibleRangeRepositoryMock, authoredSyncStateRepositoryMock } from "./postHistoryDialogTestHarness";

const base = 1_700_000_000;
const records = Array.from({ length: 161 }, (_, i) => createRecord({
    eventId: i.toString(16).padStart(64, "0"), content: `coverage row ${i}`, createdAt: base - i, postedAt: (base - i) * 1000,
}));
const gap = records.slice(60, 80);

function setupSavedAreas() {
    let saved = [...records.slice(0, 60), ...records.slice(80), createRecord({ eventId: "far", content: "next saved area", createdAt: base - 100_000, postedAt: (base - 100_000) * 1000 })];
    const visible = (floor?: number | null) => saved.filter((post) => floor == null || post.createdAt >= floor);
    repositoryMock.getLatestVisibleChunk.mockImplementation(async ({ visibleUntil, limit }) => visible(visibleUntil).slice(0, limit));
    repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ visibleUntil, cursor, limit }) =>
        visible(visibleUntil).filter((post) => post.createdAt < cursor.createdAt).slice(0, limit));
    repositoryMock.countForPubkey.mockImplementation(async () => saved.length);
    repositoryMock.countVisibleForPubkey.mockImplementation(async (_owner, floor) => visible(floor).length);
    repositoryMock.hasPostsBeforeCreatedAt.mockImplementation(async (_owner, floor) => saved.some((post) => post.createdAt < floor));
    repositoryMock.upsertFetchedEvents.mockImplementation(async ({ events }) => {
        const fresh = gap.filter((record) => events.some((item: any) => item.event.id === record.eventId));
        saved = [...saved, ...fresh].sort((a, b) => b.createdAt - a.createdAt);
        return { insertedCount: fresh.length, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 };
    });
    relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(
        input.reason === "older-backfill" ? createRelayFetchResult({
            events: gap.map((record) => ({ event: { id: record.eventId, pubkey: PUBKEY_HEX, kind: 1,
                content: record.content, tags: [], created_at: record.createdAt, sig: "c".repeat(128) }, relayUrls: [] })),
            relayFetchCoverage: completedRelayCoverage(input.since, input.until),
        }) : createRelayFetchResult(),
    ) }));
    return saved;
}

describe("post history relay coverage continuity", () => {
    beforeEach(() => { resetPostHistoryDialogHarness({ coverageMode: "none" }); setupSavedAreas(); });
    afterEach(cleanupPostHistoryDialogHarness);

    it("bridges the gap once, reads the older saved range locally, and stops only at the next uncovered interval", async () => {
        seedPostHistoryCoverage(base - 59, base);
        seedPostHistoryCoverage(base - 160, base - 80);
        const runtime = {} as any;
        const view = render(PostHistoryDialog, { props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: runtime } });
        await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
        await waitFor(() => expect(screen.getByText("coverage row 59")).toBeTruthy());
        const fetch = await screen.findByRole("button", { name: "リレーから続きを取得" });
        await waitFor(() => expect((fetch as HTMLButtonElement).disabled).toBe(false));
        await fireEvent.click(fetch);
        await waitFor(() => expect(screen.getByText("coverage row 109")).toBeTruthy());
        expect(screen.queryByRole("button", { name: "リレーから続きを取得" })).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "さらに古い投稿を表示" }));
        await waitFor(() => expect(screen.getByText("coverage row 149")).toBeTruthy());
        expect(screen.queryByRole("button", { name: "リレーから続きを取得" })).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "さらに古い投稿を表示" }));
        await waitFor(() => expect(screen.getByText("coverage row 160")).toBeTruthy());
        expect(screen.getByRole("button", { name: "リレーから続きを取得" })).toBeTruthy();
        expect(relayFetchServiceMock.fetchLatest.mock.calls.filter(([, input]) => input.reason === "older-backfill")).toHaveLength(1);
        expect(screen.queryByText("next saved area")).toBeNull();
        view.unmount();
    });

    it("checks newly available persisted coverage before fetching and consumes the saved page without another query", async () => {
        seedPostHistoryCoverage(base - 59, base);
        seedPostHistoryCoverage(base - 160, base - 80);
        const view = render(PostHistoryDialog, { props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: {} as any } });
        await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
        const fetch = await screen.findByRole("button", { name: "リレーから続きを取得" });
        await waitFor(() => expect((fetch as HTMLButtonElement).disabled).toBe(false));
        seedPostHistoryCoverage(base - 80, base - 59);
        await fireEvent.click(fetch);
        await waitFor(() => expect(screen.getByText("coverage row 129")).toBeTruthy());
        expect(relayFetchServiceMock.fetchLatest.mock.calls.filter(([, input]) => input.reason === "older-backfill")).toHaveLength(0);
        view.unmount();
    });

    it("reevaluates changed relay configuration while retaining the current rows", async () => {
        seedPostHistoryCoverage(base - 160, base);
        const props = { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: {} as any };
        const view = render(PostHistoryDialog, { props });
        await screen.findByRole("button", { name: "さらに古い投稿を表示" });
        await view.rerender({ ...props, relayConfig: { "wss://new.example.com/": { read: true, write: true } } });
        await waitFor(() => expect(screen.getByRole("button", { name: "リレーから続きを取得" })).toBeTruthy());
        expect(screen.queryByRole("button", { name: "さらに古い投稿を表示" })).toBeNull();
        expect(screen.getByText("coverage row 49")).toBeTruthy();
        expect(screen.queryByText("coverage row 50")).toBeNull();
        view.unmount();
    });

    it("does not infer continuation from legacy display metadata or a completed scheduler watermark", async () => {
        visibleRangeRepositoryMock.get.mockResolvedValue({ pubkeyHex: PUBKEY_HEX, kindsKey: "1,42,1111", visibleUntil: 0 });
        // This scenario intentionally has no relay records even though both old states claim a wide range.
        const { relayCoverageRepositoryMock } = await import("./postHistoryDialogTestHarness");
        relayCoverageRepositoryMock.get.mockResolvedValue({ schemaVersion: 1, ownerPubkeyHex: PUBKEY_HEX, kindsKey: "1,42,1111", relays: [] });
        authoredSyncStateRepositoryMock.get.mockResolvedValue({ completedThroughTimestamp: 0, pendingCatchup: null });
        const view = render(PostHistoryDialog, { props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: {} as any } });
        await screen.findByText("coverage row 49");
        await waitFor(() => expect(screen.getByRole("button", { name: "リレーから続きを取得" })).toBeTruthy());
        expect(screen.queryByRole("button", { name: "さらに古い投稿を表示" })).toBeNull();
        expect(screen.queryByText("coverage row 50")).toBeNull();
        view.unmount();
    });
});
