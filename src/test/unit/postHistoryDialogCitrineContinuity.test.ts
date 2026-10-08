import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/svelte";
import { PUBKEY_HEX, PostHistoryDialog, cleanupPostHistoryDialogHarness, completedRelayCoverage,
    createRecord, createRelayFetchResult, relayFetchServiceMock, repositoryMock, resetPostHistoryDialogHarness,
    seedPostHistoryCoverage, seedPostHistoryRestoredRange, clickMenuAction, createDeferred,
    postHistoryJsonlImportServiceMock } from "./postHistoryDialogTestHarness";

const base = 1_700_000_000;
const records = Array.from({ length: 160 }, (_, i) => createRecord({ eventId: `restored-${i}`, content: `restored row ${i}`, createdAt: base - i, postedAt: (base - i) * 1000 }));
const farOlder = createRecord({ eventId: "far-older", content: "far older saved post", createdAt: base - 500 });
function setupSavedHistory() {
    const visible = (floor: number | null) => [...records, farOlder].filter((post) => floor === null || post.createdAt >= floor);
    repositoryMock.getLatestVisibleChunk.mockImplementation(async ({ visibleUntil, limit }) => visible(visibleUntil).slice(0, limit));
    repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ visibleUntil, cursor, limit }) => visible(visibleUntil).filter((post) => post.createdAt < cursor.createdAt).slice(0, limit));
    repositoryMock.countForPubkey.mockResolvedValue(161);
    repositoryMock.countVisibleForPubkey.mockImplementation(async (_owner, floor) => visible(floor).length);
    repositoryMock.hasPostsBeforeCreatedAt.mockImplementation(async (_owner, floor) => [...records, farOlder].some((post) => post.createdAt < floor));
    relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({
        relayFetchCoverage: input.since === undefined ? [] : completedRelayCoverage(input.since, input.until),
    })) }));
}
const props = { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: {} as any };
const olderRequests = () => relayFetchServiceMock.fetchLatest.mock.calls.filter(([, input]) => input.reason === "older-backfill");

describe("Citrine browsing continuity", () => {
    beforeEach(() => { resetPostHistoryDialogHarness({ coverageMode: "none" }); setupSavedHistory(); vi.spyOn(Date, "now").mockReturnValue((base + 100) * 1000); });
    afterEach(() => { cleanupPostHistoryDialogHarness(); vi.restoreAllMocks(); });
    it("refreshes only the head, pages restored posts locally and stops before un-restored history", async () => {
        seedPostHistoryRestoredRange(base - 159, base);
        const view = render(PostHistoryDialog, { props });
        await screen.findByText("restored row 49");
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledOnce());
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledWith(props.rxNostr,
            expect.objectContaining({ reason: "dialog-open-refresh", since: base + 1, until: base + 100 }));
        for (const end of [99, 149, 159]) {
            await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
            await screen.findByText(`restored row ${end}`);
        }
        expect(olderRequests()).toHaveLength(0);
        expect(screen.getByRole("button", { name: "リレーから続きを取得" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "保存済みの古い投稿を表示" })).toBeTruthy();
        expect(screen.queryByText(farOlder.content)).toBeNull();
        view.unmount();
    });
    it("bounds a relay fetch to the genuine hole and then consumes the restored component", async () => {
        seedPostHistoryCoverage(base - 59, base);
        seedPostHistoryRestoredRange(base - 159, base - 80);
        const view = render(PostHistoryDialog, { props });
        await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
        const button = await screen.findByRole("button", { name: "リレーから続きを取得" });
        await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
        await fireEvent.click(button);
        await screen.findByText("restored row 109");
        expect(olderRequests()).toHaveLength(1);
        expect(olderRequests()[0][1]).toMatchObject({ since: base - 79, until: base - 60 });
        expect(screen.queryByRole("button", { name: "保存済みの古い投稿を表示" })).toBeNull();
        view.unmount();
    });
    it("retains restored continuity when the relay configuration changes", async () => {
        seedPostHistoryRestoredRange(base - 159, base);
        const view = render(PostHistoryDialog, { props });
        await screen.findByRole("button", { name: "さらに古い投稿を表示" });
        await view.rerender({ ...props, relayConfig: { "wss://different.example.test/": { read: true, write: true } } });
        await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
        await screen.findByText("restored row 99");
        expect(olderRequests()).toHaveLength(0);
        view.unmount();
    });
    it("does not infer restoration from arbitrary locally saved posts", async () => {
        const view = render(PostHistoryDialog, { props });
        await screen.findByText("restored row 49");
        await screen.findByRole("button", { name: "保存済みの古い投稿を表示" });
        expect(screen.queryByRole("button", { name: "さらに古い投稿を表示" })).toBeNull();
        view.unmount();
    });
    it("catches up a saturated head only as far as the backup's newest second", async () => {
        seedPostHistoryRestoredRange(base - 159, base);
        seedPostHistoryCoverage(base - 500, base - 500);
        const head = Array.from({ length: 60 }, (_, i) => createRecord({ eventId: `new-${i}`, content: `new row ${i}`, createdAt: base + 80 - i }));
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({ cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({
            events: (input.reason === "dialog-open-refresh" ? head.slice(0, 30) : head.slice(29)).map((post) => ({ event: { id: post.eventId, pubkey: PUBKEY_HEX, kind: 1, tags: [], sig: "c".repeat(128), content: post.content, created_at: post.createdAt }, relayUrls: [] })),
            relayFetchCoverage: completedRelayCoverage(input.reason === "dialog-open-refresh" ? head[29].createdAt + 1 : input.since, input.until),
        })) }));
        const view = render(PostHistoryDialog, { props });
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2));
        expect(relayFetchServiceMock.fetchLatest.mock.calls.map(([, input]) => [input.reason, input.since, input.until]))
            .toEqual([["dialog-open-refresh", base + 1, base + 100], ["dialog-open-catchup", base + 1, head[29].createdAt]]);
        view.unmount();
    });
    it("replans a detached entry head when import finishes after the previous catchup failed", async () => {
        seedPostHistoryCoverage(base - 500, base - 500);
        let refreshCount = 0;
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => {
            if (input.reason === "dialog-open-refresh") refreshCount += 1;
            const first = refreshCount === 1;
            return { cancel: vi.fn(), promise: Promise.resolve(createRelayFetchResult({
                status: input.reason === "dialog-open-catchup" ? "failed" : "success",
                relayFetchCoverage: first ? (input.reason === "dialog-open-refresh" ? completedRelayCoverage(base - 28, input.until) : [])
                    : completedRelayCoverage(input.since, input.until),
            })) };
        });
        const imported = await postHistoryJsonlImportServiceMock.importFile();
        postHistoryJsonlImportServiceMock.importFile.mockImplementation(async () => {
            seedPostHistoryRestoredRange(base - 159, base - 60);
            return { ...imported, localRevision: 0, restoredRangeChanged: true };
        });
        const view = render(PostHistoryDialog, { props });
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        await clickMenuAction("インポート");
        await fireEvent.change(screen.getByLabelText("JSONLファイルを選択", { selector: "input" }), { target: { files: [new File(["fixture"], "citrine-1700000000000.jsonl")] } });
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(3));
        expect(relayFetchServiceMock.fetchLatest.mock.calls[2][1]).toMatchObject({ reason: "dialog-open-refresh", since: base - 59 });
        view.unmount();
    });
    it("keeps the active head query when restoration is entirely older than its lower bound", async () => {
        seedPostHistoryCoverage(base - 59, base);
        const pending = createDeferred<ReturnType<typeof createRelayFetchResult>>();
        const cancel = vi.fn();
        relayFetchServiceMock.fetchLatest.mockReturnValue({ promise: pending.promise, cancel });
        const imported = await postHistoryJsonlImportServiceMock.importFile();
        postHistoryJsonlImportServiceMock.importFile.mockImplementation(async () => {
            seedPostHistoryRestoredRange(base - 159, base - 60);
            return { ...imported, insertedPostCount: 0, updatedPostCount: 0,
                appliedDeletionPostCount: 0, localRevision: 0, restoredRangeChanged: true };
        });
        const view = render(PostHistoryDialog, { props });
        await screen.findByText("restored row 49");
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledOnce());
        await clickMenuAction("インポート");
        await fireEvent.change(screen.getByLabelText("JSONLファイルを選択", { selector: "input" }), {
            target: { files: [new File(["fixture"], "citrine-1700000000000.jsonl")] },
        });
        await screen.findByText("postHistory.importComplete");
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledOnce();
        expect(cancel).not.toHaveBeenCalled();
        await fireEvent.click(within(screen.getByRole("dialog", { name: "投稿履歴をインポート" }))
            .getByRole("button", { name: "閉じる" }));
        await fireEvent.click(await screen.findByRole("button", { name: "さらに古い投稿を表示" }));
        await screen.findByText("restored row 99");
        pending.resolve(createRelayFetchResult({ relayFetchCoverage: completedRelayCoverage(base, base + 100) }));
        await waitFor(() => expect(screen.queryByText("リレーと同期中...")).toBeNull());
        expect(screen.getByText("restored row 99")).toBeTruthy();
        view.unmount();
    });
    it("does not apply a delayed delete to the newly selected account", async () => {
        const deletion = createDeferred<void>();
        repositoryMock.deleteLocalHistoryForPubkey.mockReturnValue(deletion.promise);
        const other = "b".repeat(64);
        const newPost = createRecord({ eventId: "other-account", pubkeyHex: other, content: "new account history", createdAt: base });
        const original = repositoryMock.getLatestVisibleChunk.getMockImplementation()!;
        repositoryMock.getLatestVisibleChunk.mockImplementation(async (input) => input.pubkeyHex === other ? [newPost] : original(input));
        const view = render(PostHistoryDialog, { props });
        await screen.findByText("restored row 49");
        await clickMenuAction("保存済み投稿履歴をクリア");
        await fireEvent.click(await screen.findByRole("button", { name: "クリアする" }));
        await waitFor(() => expect(repositoryMock.deleteLocalHistoryForPubkey).toHaveBeenCalledOnce());
        await view.rerender({ ...props, pubkeyHex: other });
        await screen.findByText(newPost.content);
        deletion.resolve();
        await waitFor(() => expect(screen.queryByText("保存済み投稿履歴をクリアしました")).toBeNull());
        expect(screen.getByText(newPost.content)).toBeTruthy();
        view.unmount();
    });
});
