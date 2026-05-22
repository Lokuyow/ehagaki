import { cleanup, render, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS,
} from "../../lib/postHistoryForegroundPeriodicSyncService";
import PostHistoryForegroundPeriodicSyncHarness from "./fixtures/PostHistoryForegroundPeriodicSyncHarness.svelte";

const OWNER_PUBKEY = "a".repeat(64);
const NEXT_OWNER_PUBKEY = "b".repeat(64);

const {
    sync,
    cancelOwnerTasks,
} = vi.hoisted(() => ({
    sync: vi.fn(() => ({
        promise: Promise.resolve({
            authored: { status: "completed" },
            inbound: { status: "completed" },
        }),
        cancel: vi.fn(),
    })),
    cancelOwnerTasks: vi.fn(),
}));

vi.mock("../../lib/postHistoryForegroundPeriodicSyncService", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../../lib/postHistoryForegroundPeriodicSyncService")>()),
    postHistoryForegroundPeriodicSyncService: { sync },
}));

vi.mock("../../lib/postHistoryLightweightSyncCoordinator", () => ({
    postHistoryLightweightSyncCoordinator: { cancelOwnerTasks },
}));

function createRxNostr() {
    return {
        use: vi.fn(),
    } as any;
}

function setVisibilityState(value: DocumentVisibilityState): void {
    Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value,
    });
    document.dispatchEvent(new Event("visibilitychange"));
}

function renderHarness(options: {
    pubkeyHex?: string;
    reconciliationPubkeyHex?: string;
    rxNostr?: any;
} = {}) {
    const rxNostr = options.rxNostr ?? createRxNostr();
    return render(PostHistoryForegroundPeriodicSyncHarness, {
        props: {
            isAuthenticated: true,
            pubkeyHex: options.pubkeyHex ?? OWNER_PUBKEY,
            reconciliationPubkeyHex: options.reconciliationPubkeyHex ?? options.pubkeyHex ?? OWNER_PUBKEY,
            rxNostr,
        },
    });
}

async function advanceToFirstTick(): Promise<void> {
    await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS);
    await waitFor(() => expect(sync).toHaveBeenCalledOnce());
}

describe("usePostHistoryForegroundPeriodicSync", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        sync.mockClear();
        cancelOwnerTasks.mockClear();
        setVisibilityState("visible");
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it("waits for the first 6 minute interval after a visible owner session starts", async () => {
        renderHarness();

        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS - 1);
        expect(sync).not.toHaveBeenCalled();

        await advanceToFirstTick();
    });

    it("clears the hidden session timer and creates a new timer on visible resume", async () => {
        renderHarness();

        setVisibilityState("hidden");
        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS);
        expect(sync).not.toHaveBeenCalled();

        setVisibilityState("visible");
        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS - 1);
        expect(sync).not.toHaveBeenCalled();

        await advanceToFirstTick();
    });

    it("does not fire the old timer after owner pubkey changes", async () => {
        const view = renderHarness();
        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS / 2);

        await view.rerender({
            isAuthenticated: true,
            pubkeyHex: NEXT_OWNER_PUBKEY,
            reconciliationPubkeyHex: NEXT_OWNER_PUBKEY,
            rxNostr: createRxNostr(),
        });
        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS / 2);
        expect(sync).not.toHaveBeenCalled();

        await advanceToFirstTick();
    });

    it("does not fire the old timer after rxNostr is replaced", async () => {
        const view = renderHarness();
        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS / 2);

        await view.rerender({
            isAuthenticated: true,
            pubkeyHex: OWNER_PUBKEY,
            reconciliationPubkeyHex: OWNER_PUBKEY,
            rxNostr: createRxNostr(),
        });
        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS / 2);
        expect(sync).not.toHaveBeenCalled();

        await advanceToFirstTick();
    });

    it("does not tick after the hook is destroyed", async () => {
        const view = renderHarness();
        view.unmount();

        await vi.advanceTimersByTimeAsync(POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS);

        expect(sync).not.toHaveBeenCalled();
    });
});
