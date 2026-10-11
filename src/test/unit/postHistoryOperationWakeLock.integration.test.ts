import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RxNostr } from "rx-nostr";
import PostHistoryImportDialog from "../../components/PostHistoryImportDialog.svelte";
import type { PostHistoryFullScanResult, PostHistoryFullScanScope, PostHistoryFullScanTask } from "../../lib/postHistoryRelayFullScanService";
import type { PostHistoryJsonlImportResult, PostHistoryJsonlImportInput } from "../../lib/postHistoryJsonlImportService";
import type { usePostHistoryRelayFullScan } from "../../lib/hooks/usePostHistoryRelayFullScan.svelte";
import FullScanHarness from "./fixtures/PostHistoryFullScanWakeLockHarness.svelte";
import { deferred, installScreenWakeLockMock, TestWakeLockSentinel } from "../mocks/screenWakeLock";

const { startScan, importFile } = vi.hoisted(() => ({
    startScan: vi.fn<() => PostHistoryFullScanTask>(),
    importFile: vi.fn<(input: PostHistoryJsonlImportInput) => Promise<PostHistoryJsonlImportResult>>(),
}));
vi.mock("../../lib/postHistoryRelayFullScanService", async (importOriginal) => ({
    ...await importOriginal<typeof import("../../lib/postHistoryRelayFullScanService")>(),
    postHistoryRelayFullScanService: { start: startScan },
}));
vi.mock("../../lib/postHistoryJsonlImportService", () => ({ postHistoryJsonlImportService: { importFile } }));
vi.mock("svelte-i18n", () => ({ _: readable((key: string) => key) }));

const owner = "a".repeat(64);
function scanResult(status: PostHistoryFullScanResult["status"] = "completed"): PostHistoryFullScanResult {
    return { status, ownerPubkeyHex: owner, localRevision: 0, upperBound: 100, phase: "fetching",
        elapsedMs: 0, receivedCount: 0, insertedCount: 0, updatedCount: 0, finishedRelayCount: 0,
        targetRelayCount: 0, relays: [] };
}
function importResult(status: PostHistoryJsonlImportResult["status"] = "completed"): PostHistoryJsonlImportResult {
    return { status, nonEmptyLineCount: 1, invalidJsonCount: 0, invalidStructureCount: 0,
        invalidIdOrSignatureCount: 0, fileDuplicateCount: 0, otherAccountCount: 0, unsupportedKindCount: 0,
        uniquePostEventCount: 1, insertedPostCount: 1, updatedPostCount: 0, unchangedPostCount: 0,
        failedPostEventCount: 0, uniqueDeletionEventCount: 0, validDeletionETagCount: 0,
        insertedDeletionRequestCount: 0, updatedDeletionRequestCount: 0, unchangedDeletionRequestCount: 0,
        unsupportedDeletionEventCount: 0, failedDeletionEventCount: 0, appliedDeletionPostCount: 0,
        uniquePayloadEventCount: 0, savedPayloadCandidateCount: 0, failedPayloadEventCount: 0 };
}

describe("post-history UI operation wake lock lifetime", () => {
    let mock: ReturnType<typeof installScreenWakeLockMock>;
    let lock: TestWakeLockSentinel;
    beforeEach(() => {
        startScan.mockReset(); importFile.mockReset();
        mock = installScreenWakeLockMock(); lock = new TestWakeLockSentinel();
        mock.request.mockResolvedValue(lock);
        vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    });
    afterEach(() => { cleanup(); mock.restore(); vi.restoreAllMocks(); });

    function renderScan() {
        const pending = deferred<PostHistoryFullScanResult>();
        const cancel = vi.fn<(stale?: boolean) => void>(); startScan.mockReturnValue({ promise: pending.promise, cancel });
        const scope: PostHistoryFullScanScope = { ownerPubkeyHex: owner, rxNostr: {} as RxNostr, relayConfig: null };
        let scan!: ReturnType<typeof usePostHistoryRelayFullScan>;
        const onSettled = vi.fn(async () => undefined);
        const view = render(FullScanHarness, { show: true, scope, onSettled, onReady: value => { scan = value; } });
        return { view, pending, cancel, scope, scan, onSettled };
    }
    function renderImport() {
        const pending = deferred<PostHistoryJsonlImportResult>(); importFile.mockReturnValue(pending.promise);
        const onImported = vi.fn();
        const view = render(PostHistoryImportDialog, { open: true, ownerPubkeyHex: owner,
            getCurrentPubkeyHex: () => owner, onImported });
        return { view, pending, onImported };
    }
    async function chooseImportFile() {
        await fireEvent.change(screen.getByLabelText("postHistory.importChooseFile", { selector: "input" }),
            { target: { files: [new File(["{}"], "history.jsonl")] } });
        await waitFor(() => expect(importFile).toHaveBeenCalledOnce());
    }

    it.each(["completed", "partial", "failed", "cancelled", "stale-cancelled"] as const)(
        "full scan acquires on start and releases on %s", async (status) => {
            const { scan, pending } = renderScan(); scan.setOpen(true);
            expect(mock.request).not.toHaveBeenCalled();
            const done = scan.start();
            expect(startScan).toHaveBeenCalledOnce(); expect(mock.request).toHaveBeenCalledExactlyOnceWith("screen");
            await Promise.resolve(); expect(lock.release).not.toHaveBeenCalled();
            pending.resolve(scanResult(status)); await done;
            expect(lock.release).toHaveBeenCalledOnce(); expect(scan.state.result?.status).toBe(status);
        });

    it.each(["cancel", "cancel-button", "dialog-close", "parent-close", "owner-change", "runtime-change", "relay-change", "destroy"])(
        "full scan releases immediately on %s without waiting for task settlement", async (reason) => {
            const { scan, pending, cancel, scope, view, onSettled } = renderScan();
            scan.setOpen(true); const done = scan.start(); await Promise.resolve();
            if (reason === "cancel") scan.cancel();
            else if (reason === "cancel-button") await fireEvent.click(await screen.findByRole("button", { name: "postHistory.fullScanCancel" }));
            else if (reason === "dialog-close") await fireEvent.click(await screen.findByRole("button", { name: "global.close" }));
            else if (reason === "parent-close") await view.rerender({ show: false });
            else if (reason === "owner-change") await view.rerender({ scope: { ...scope, ownerPubkeyHex: "b".repeat(64) } });
            else if (reason === "runtime-change") await view.rerender({ scope: { ...scope, rxNostr: {} as RxNostr } });
            else if (reason === "relay-change") await view.rerender({ scope: { ...scope, relayConfig: { "wss://changed.example": { read: true, write: true } } } });
            else view.unmount();
            await waitFor(() => expect(lock.release).toHaveBeenCalledOnce());
            expect(cancel).toHaveBeenCalled();
            expect(cancel.mock.calls[0][0]).toBe(["owner-change", "runtime-change", "relay-change"].includes(reason) ? true : undefined);
            pending.resolve(scanResult("stale-cancelled")); await done;
            expect(lock.release).toHaveBeenCalledOnce(); expect(onSettled).not.toHaveBeenCalled();
        });

    it("full scan releases even if starting the service throws", async () => {
        const { scan } = renderScan(); startScan.mockImplementation(() => { throw new Error("start failed"); });
        await expect(scan.start()).rejects.toThrow("start failed");
        await waitFor(() => expect(lock.release).toHaveBeenCalledOnce());
    });

    it.each(["completed", "partial", "failed", "cancelled", "account-changed"] as const)(
        "JSONL import acquires only when a file starts importing and releases on %s", async (status) => {
            const { pending, onImported } = renderImport();
            await fireEvent.click(screen.getByRole("button", { name: "postHistory.importChooseFile" }));
            await fireEvent.change(screen.getByLabelText("postHistory.importChooseFile", { selector: "input" }), { target: { files: [] } });
            expect(mock.request).not.toHaveBeenCalled(); expect(importFile).not.toHaveBeenCalled();
            await chooseImportFile();
            expect(mock.request).toHaveBeenCalledExactlyOnceWith("screen"); expect(lock.release).not.toHaveBeenCalled();
            const result = importResult(status); pending.resolve(result);
            await waitFor(() => expect(lock.release).toHaveBeenCalledOnce());
            expect(onImported).toHaveBeenCalledWith(result);
        });

    it.each(["dialog-close", "external-close", "owner-change", "destroy"])(
        "JSONL import releases immediately on %s and ignores late completion", async (reason) => {
            const { view, pending, onImported } = renderImport(); await chooseImportFile();
            const signal = importFile.mock.calls[0][0].signal!;
            if (reason === "dialog-close") await fireEvent.click(screen.getByRole("button", { name: "global.close" }));
            else if (reason === "external-close") await view.rerender({ open: false });
            else if (reason === "owner-change") await view.rerender({ ownerPubkeyHex: "b".repeat(64), getCurrentPubkeyHex: () => "b".repeat(64) });
            else view.unmount();
            await waitFor(() => expect(lock.release).toHaveBeenCalledOnce()); expect(signal.aborted).toBe(true);
            pending.resolve(importResult()); await Promise.resolve(); await Promise.resolve();
            expect(onImported).not.toHaveBeenCalled(); expect(mock.request).toHaveBeenCalledOnce();
        });

    it.each(["unsupported", "rejected"])("wake lock %s leaves the JSONL import result unchanged", async (failure) => {
        if (failure === "unsupported") mock.set(undefined);
        else mock.request.mockRejectedValue(new Error("wake lock denied"));
        const { pending, onImported } = renderImport(); await chooseImportFile();
        const result = importResult(); pending.resolve(result);
        await waitFor(() => expect(onImported).toHaveBeenCalledExactlyOnceWith(result));
        expect(screen.getByText("postHistory.importComplete")).toBeTruthy();
        expect(screen.queryByText("postHistory.importFailed")).toBeNull();
    });

    it("wake lock rejection leaves the full scan result unchanged", async () => {
        mock.request.mockRejectedValue(new Error("wake lock denied"));
        const { scan, pending, onSettled } = renderScan(); const done = scan.start();
        const result = scanResult(); pending.resolve(result); await done;
        expect(onSettled).toHaveBeenCalledExactlyOnceWith(result); expect(scan.state.result).toEqual(result);
    });

    it.each(["scan", "import"])("keeps the shared lock when %s ends before the other operation", async (first) => {
        const { scan, pending: scanPending } = renderScan(); const done = scan.start();
        const { pending: importPending } = renderImport(); await chooseImportFile();
        expect(mock.request).toHaveBeenCalledOnce();
        if (first === "scan") { scanPending.resolve(scanResult()); await done; }
        else { importPending.resolve(importResult()); await waitFor(() => expect(screen.getByText("postHistory.importComplete")).toBeTruthy()); }
        expect(lock.release).not.toHaveBeenCalled();
        if (first === "scan") importPending.resolve(importResult());
        else { scanPending.resolve(scanResult()); await done; }
        await waitFor(() => expect(lock.release).toHaveBeenCalledOnce());
    });

    it.each(["scan", "import"])("discards a pending wake lock returned after %s owner destruction", async (operation) => {
        const pendingLock = deferred<WakeLockSentinel>(); mock.request.mockReturnValue(pendingLock.promise);
        if (operation === "scan") {
            const { scan, view, pending } = renderScan(); const done = scan.start(); view.unmount();
            pending.resolve(scanResult()); await done;
        } else {
            const { view, pending } = renderImport(); await chooseImportFile(); view.unmount(); pending.resolve(importResult());
        }
        pendingLock.resolve(lock);
        await waitFor(() => expect(lock.release).toHaveBeenCalledOnce());
        document.dispatchEvent(new Event("visibilitychange")); expect(mock.request).toHaveBeenCalledOnce();
    });

    it("late import finalization cannot end a new import's lease", async () => {
        const { view, pending: first } = renderImport(); await chooseImportFile();
        await view.rerender({ open: false }); await view.rerender({ open: true });
        const second = deferred<PostHistoryJsonlImportResult>(); importFile.mockReturnValue(second.promise);
        const secondLock = new TestWakeLockSentinel(); mock.request.mockResolvedValue(secondLock);
        await fireEvent.change(screen.getByLabelText("postHistory.importChooseFile", { selector: "input" }),
            { target: { files: [new File(["{}"], "second.jsonl")] } });
        first.resolve(importResult()); await Promise.resolve(); await Promise.resolve();
        expect(secondLock.release).not.toHaveBeenCalled();
        second.resolve(importResult()); await waitFor(() => expect(secondLock.release).toHaveBeenCalledOnce());
    });
});
