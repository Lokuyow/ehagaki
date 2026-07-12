import { cleanup, render, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PostHistoryShortHiddenRealtimeRecoveryHarness from "./fixtures/PostHistoryShortHiddenRealtimeRecoveryHarness.svelte";
import PostHistoryVisibilityResumeSyncHarness from "./fixtures/PostHistoryVisibilityResumeSyncHarness.svelte";

const OWNER_PUBKEY = "a".repeat(64);

const syncAfterVisibilityResume = vi.hoisted(() => vi.fn(() => ({
    promise: Promise.resolve({
        authored: { status: "success" },
        inbound: { status: "success" },
        savedSelfPostEventIds: [],
    }),
    cancel: vi.fn(),
})));
const {
    subscribeAuthoredRealtime,
    subscribeInboundRealtime,
} = vi.hoisted(() => ({
    subscribeAuthoredRealtime: vi.fn(() => ({
        stop: vi.fn(),
    })),
    subscribeInboundRealtime: vi.fn(() => ({
        stop: vi.fn(),
    })),
}));

vi.mock("../../lib/postHistoryVisibilityResumeSyncService", () => ({
    postHistoryVisibilityResumeSyncService: { syncAfterVisibilityResume },
}));
vi.mock("../../lib/postHistoryAuthoredPostsRealtimeService", () => ({
    postHistoryAuthoredPostsRealtimeService: { subscribe: subscribeAuthoredRealtime },
}));
vi.mock("../../lib/postHistoryInboundInteractionsRealtimeService", () => ({
    postHistoryInboundInteractionsRealtimeService: { subscribe: subscribeInboundRealtime },
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

describe("usePostHistoryVisibilityResumeSync", () => {
    let nowMs = 0;

    beforeEach(() => {
        syncAfterVisibilityResume.mockClear();
        subscribeAuthoredRealtime.mockClear();
        subscribeInboundRealtime.mockClear();
        nowMs = 1_000_000;
        setVisibilityState("visible");
    });

    afterEach(() => {
        cleanup();
    });

    function renderHarness(onSavedSelfPosts = vi.fn()) {
        return {
            onSavedSelfPosts,
            ...render(PostHistoryVisibilityResumeSyncHarness, {
                props: {
                    isAuthenticated: true,
                    pubkeyHex: OWNER_PUBKEY,
                    reconciliationPubkeyHex: OWNER_PUBKEY,
                    rxNostr: createRxNostr(),
                    now: () => nowMs,
                    onSavedSelfPosts,
                },
            }),
        };
    }

    it("does not run resume sync after a 9 second hidden interval", async () => {
        const { onSavedSelfPosts } = renderHarness();

        setVisibilityState("hidden");
        nowMs += 9_000;
        setVisibilityState("visible");
        await Promise.resolve();

        expect(syncAfterVisibilityResume).not.toHaveBeenCalled();
        expect(onSavedSelfPosts).not.toHaveBeenCalled();
    });

    it("runs resume sync after a 10 second hidden interval", async () => {
        renderHarness();

        setVisibilityState("hidden");
        nowMs += 10_000;
        setVisibilityState("visible");

        await waitFor(() => expect(syncAfterVisibilityResume).toHaveBeenCalledOnce());
        expect(syncAfterVisibilityResume).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
            ownerPubkeyHex: OWNER_PUBKEY,
            hiddenAtSeconds: 1_000,
        }));
    });

    it("keeps realtime recovery for a reply and self post missed during a 9 second hidden gap", async () => {
        const rxNostr = createRxNostr();
        render(PostHistoryShortHiddenRealtimeRecoveryHarness, {
            props: {
                pubkeyHex: OWNER_PUBKEY,
                rxNostr,
                now: () => nowMs,
            },
        });

        await waitFor(() => {
            expect(subscribeAuthoredRealtime).toHaveBeenCalledOnce();
            expect(subscribeInboundRealtime).toHaveBeenCalledOnce();
        });

        setVisibilityState("hidden");
        // A self post and a reply may arrive while Forward subscriptions are stopped here.
        nowMs += 9_000;
        setVisibilityState("visible");

        await waitFor(() => {
            expect(subscribeAuthoredRealtime).toHaveBeenCalledTimes(2);
            expect(subscribeInboundRealtime).toHaveBeenCalledTimes(2);
        });
        expect(syncAfterVisibilityResume).not.toHaveBeenCalled();
    });
});
