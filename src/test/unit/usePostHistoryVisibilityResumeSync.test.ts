import { cleanup, render, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

vi.mock("../../lib/postHistoryVisibilityResumeSyncService", () => ({
    postHistoryVisibilityResumeSyncService: { syncAfterVisibilityResume },
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

    it("does not run resume sync after a 29 second hidden interval", async () => {
        const { onSavedSelfPosts } = renderHarness();

        setVisibilityState("hidden");
        nowMs += 29_000;
        setVisibilityState("visible");
        await Promise.resolve();

        expect(syncAfterVisibilityResume).not.toHaveBeenCalled();
        expect(onSavedSelfPosts).not.toHaveBeenCalled();
    });

    it("runs resume sync after a 30 second hidden interval", async () => {
        renderHarness();

        setVisibilityState("hidden");
        nowMs += 30_000;
        setVisibilityState("visible");

        await waitFor(() => expect(syncAfterVisibilityResume).toHaveBeenCalledOnce());
        expect(syncAfterVisibilityResume).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
            ownerPubkeyHex: OWNER_PUBKEY,
            hiddenAtSeconds: 1_000,
        }));
    });
});
