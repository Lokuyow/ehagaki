import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import {
    PUBKEY_HEX, PostHistoryDialog, cleanupPostHistoryDialogHarness, createDeferred,
    createRecord, createRelayFetchResult, relayCoverageRepositoryMock, relayFetchServiceMock,
    repositoryMock, resetPostHistoryDialogHarness, seedPostHistoryCoverage,
} from "./postHistoryDialogTestHarness";
import { postHistoryLocalBrowsingRangesRepository } from "../../lib/storage/postHistoryLocalBrowsingRangesRepository";
import { settingsStore } from "../../stores/settingsStore.svelte";

const latest = createRecord({ eventId: "preparation-head", content: "current history", createdAt: 1_700_000_000 });

async function openDialog(savedBoundary = false) {
    repositoryMock.hasPostsBeforeCreatedAt.mockResolvedValue(savedBoundary);
    const props = { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX, rxNostr: {} as any };
    const view = render(PostHistoryDialog, { props });
    await waitFor(() => {
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledOnce();
        expect((screen.getByRole("button", { name: "リレーから続きを取得" }) as HTMLButtonElement).disabled).toBe(false);
    });
    const button = screen.getByRole("button", { name: "リレーから続きを取得" });
    return { view, props, button };
}

function olderRequests() {
    return relayFetchServiceMock.fetchLatest.mock.calls.filter(([, input]) => input.reason === "older-backfill");
}

describe("older relay fetch preparation", () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness({ coverageMode: "none" });
        seedPostHistoryCoverage(latest.createdAt);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        const fetch = createDeferred<ReturnType<typeof createRelayFetchResult>>();
        relayFetchServiceMock.fetchLatest.mockImplementation((_rx, input) => ({
            cancel: vi.fn(),
            promise: input.reason === "older-backfill" ? fetch.promise : Promise.resolve(createRelayFetchResult()),
        }));
    });
    afterEach(cleanupPostHistoryDialogHarness);

    it.each([false, true])("shows loading before the first coverage read completes (saved boundary: %s)", async (savedBoundary) => {
        const { view, button } = await openDialog(savedBoundary);
        const read = createDeferred<any>();
        relayCoverageRepositoryMock.get.mockReturnValueOnce(read.promise);
        await fireEvent.click(button);
        expect((screen.getByRole("button", { name: "リレーから取得中..." }) as HTMLButtonElement).disabled).toBe(true);
        expect(olderRequests()).toHaveLength(0);
        view.unmount();
        read.resolve({ schemaVersion: 1, ownerPubkeyHex: PUBKEY_HEX, kindsKey: "1,42,1111", relays: [] });
    });

    it("blocks repeated clicks while checking older posts and does not wait for newer availability", async () => {
        const { view, button } = await openDialog();
        const read = createDeferred<boolean>();
        repositoryMock.hasOlderVisiblePosts.mockReturnValueOnce(read.promise);
        repositoryMock.getNewerVisibleChunk.mockImplementation(() => new Promise(() => undefined));
        const newerReads = repositoryMock.getNewerVisibleChunk.mock.calls.length;
        await fireEvent.click(button);
        await waitFor(() => expect(repositoryMock.hasOlderVisiblePosts).toHaveBeenCalledOnce());
        await fireEvent.click(button);
        expect(repositoryMock.hasOlderVisiblePosts).toHaveBeenCalledOnce();
        expect(olderRequests()).toHaveLength(0);
        read.resolve(false);
        await waitFor(() => expect(olderRequests()).toHaveLength(1));
        expect(repositoryMock.getNewerVisibleChunk.mock.calls).toHaveLength(newerReads);
        view.unmount();
    });

    it("releases loading on a preparation failure and permits retry", async () => {
        const { view, button } = await openDialog();
        repositoryMock.hasOlderVisiblePosts.mockRejectedValueOnce(new Error("read_failed"));
        await fireEvent.click(button);
        await waitFor(() => expect((screen.getByRole("button", { name: "リレーから続きを取得" }) as HTMLButtonElement).disabled).toBe(false));
        expect(screen.getByText("リレーから取得できませんでした")).toBeTruthy();
        await fireEvent.click(screen.getByRole("button", { name: "リレーから続きを取得" }));
        await waitFor(() => expect(olderRequests()).toHaveLength(1));
        view.unmount();
    });

    it("uses newly covered local posts and releases loading without a relay request", async () => {
        const { view, button } = await openDialog();
        const older = createRecord({ eventId: "preparation-local", content: "saved older history", createdAt: latest.createdAt - 1 });
        seedPostHistoryCoverage(older.createdAt, latest.createdAt);
        repositoryMock.hasOlderVisiblePosts.mockResolvedValue(true);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ limit }) => limit === 50 ? [older] : []);
        await fireEvent.click(button);
        await screen.findByText(older.content);
        await waitFor(() => expect(screen.queryByRole("button", { name: "リレーから取得中..." })).toBeNull());
        expect(olderRequests()).toHaveLength(0);
        view.unmount();
    });

    it("rechecks a changed external floor while local browsing keeps the visible floor unchanged", async () => {
        const localFloor = latest.createdAt - 100;
        const url = "ws://127.0.0.1:4869/";
        settingsStore.setLocalRelayUrl(url);
        const localRead = vi.spyOn(postHistoryLocalBrowsingRangesRepository, "get").mockResolvedValue({
            schemaVersion: 1, source: "local-relay", ownerPubkeyHex: PUBKEY_HEX,
            kindsKey: "1,6,16,42,1111", localRelayUrl: url, localRevision: 0,
            browsingRanges: [{ since: localFloor, until: 2_000_000_000 }], resumeHint: null,
        });
        let view: Awaited<ReturnType<typeof openDialog>>["view"] | undefined;
        try {
            const opened = await openDialog(); view = opened.view;
            expect(repositoryMock.getLatestVisibleChunk.mock.calls.at(-1)?.[0].visibleUntil).toBe(localFloor);
            const older = createRecord({ eventId: "preparation-background", content: "newly covered saved history",
                createdAt: latest.createdAt - 1 });
            const heldRead = createDeferred<boolean>();
            repositoryMock.hasOlderVisiblePosts.mockReturnValueOnce(heldRead.promise)
                .mockImplementation(async ({ visibleUntil }) => visibleUntil === older.createdAt);
            repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ limit }) => limit === 50 ? [older] : []);
            await fireEvent.click(opened.button);
            await waitFor(() => expect(repositoryMock.hasOlderVisiblePosts).toHaveBeenCalledOnce());
            seedPostHistoryCoverage(older.createdAt, latest.createdAt);
            heldRead.resolve(false);
            await screen.findByText(older.content);
            expect(repositoryMock.hasOlderVisiblePosts.mock.calls.map(([query]) => query.visibleUntil))
                .toEqual([latest.createdAt, older.createdAt]);
            expect(repositoryMock.getOlderVisibleChunk.mock.calls.find(([query]) => query.limit === 50)?.[0].visibleUntil)
                .toBe(localFloor);
            expect(olderRequests()).toHaveLength(0);
        } finally {
            view?.unmount(); settingsStore.setLocalRelayUrl(""); localRead.mockRestore();
        }
    });

    it.each(["close", "account", "runtime", "relays"] as const)("does not launch an old request after %s changes during preparation", async (change) => {
        const { view, props, button } = await openDialog();
        const oldRead = createDeferred<boolean>();
        repositoryMock.hasOlderVisiblePosts.mockReturnValueOnce(oldRead.promise);
        await fireEvent.click(button);
        await waitFor(() => expect(repositoryMock.hasOlderVisiblePosts).toHaveBeenCalledOnce());
        const changedProps = change === "close" ? { ...props, show: false }
            : change === "account" ? { ...props, pubkeyHex: "d".repeat(64) }
            : change === "runtime" ? { ...props, rxNostr: {} as any }
            : { ...props, relayConfig: { "wss://changed.example.test/": { read: true, write: true } } };
        await view.rerender(changedProps);
        if (change === "close") await view.rerender(props);
        await waitFor(() => {
            if (change === "account") expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
            expect((screen.getByRole("button", { name: "リレーから続きを取得" }) as HTMLButtonElement).disabled).toBe(false);
        });
        await fireEvent.click(screen.getByRole("button", { name: "リレーから続きを取得" }));
        await waitFor(() => expect(olderRequests()).toHaveLength(1));
        oldRead.resolve(false);
        await waitFor(() => expect(repositoryMock.hasOlderVisiblePosts).toHaveBeenCalledTimes(2));
        expect(olderRequests()).toHaveLength(1);
        expect((screen.getByRole("button", { name: "リレーから取得中..." }) as HTMLButtonElement).disabled).toBe(true);
        view.unmount();
    });
});
