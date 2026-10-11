import { fireEvent, render, screen, within } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { describe, expect, it, vi } from "vitest";
import PostHistoryRelayFullScanDialog from "../../components/PostHistoryRelayFullScanDialog.svelte";
import type { PostHistoryFullScanResult } from "../../lib/postHistoryRelayFullScanService";
vi.mock("svelte-i18n", () => ({ _: readable((key: string) => key) }));

function result(status: PostHistoryFullScanResult["status"]): PostHistoryFullScanResult {
    return { status, ownerPubkeyHex: "a".repeat(64), localRevision: 0, upperBound: 100, phase: "fetching", elapsedMs: 2000,
        receivedCount: 9, insertedCount: 3, updatedCount: 2, finishedRelayCount: 2, targetRelayCount: 2,
        relays: [{ relayUrl: "wss://a.example/", status: "completed", requestCount: 1, issueCounts: {}, rangeSamples: [] },
            { relayUrl: "wss://b.example/", status: status === "completed" ? "completed" : "partial", requestCount: 1,
                issueCounts: status === "partial" ? { ambiguous: 1 } : {}, rangeSamples: [] }] };
}
describe("full relay scan dialog", () => {
    it.each(["completed", "partial", "failed", "cancelled", "stale-cancelled"] as const)("shows the actual %s result and no fabricated percentage or ETA", async (status) => {
        render(PostHistoryRelayFullScanDialog, { open: true, running: false, canStart: true, elapsedMs: 2000,
            progress: null, result: result(status), onOpenChange: vi.fn(), onStart: vi.fn(), onCancel: vi.fn() });
        const dialog = await screen.findByRole("dialog");
        expect(within(dialog).getByRole("status").textContent).toContain(`postHistory.fullScanStatus.${status}`);
        expect(dialog.textContent).toContain("2 / 2"); expect(dialog.textContent).toContain("0:02");
        expect(within(dialog).queryByRole("progressbar")).toBeNull();
        expect(dialog.textContent).not.toMatch(/%|RemainingTime|ETA/);
        if (status === "partial") expect(dialog.textContent).toContain("postHistory.fullScanIssue.ambiguous");
    });
    it("exposes start, disables duplicate start and lets users cancel or close", async () => {
        const start = vi.fn(); const cancel = vi.fn(); const close = vi.fn();
        const view = render(PostHistoryRelayFullScanDialog, { open: true, running: false, canStart: true, elapsedMs: 0,
            progress: null, result: null, onOpenChange: close, onStart: start, onCancel: cancel });
        await fireEvent.click(await screen.findByRole("button", { name: "postHistory.fullScanStart" }));
        expect(start).toHaveBeenCalledOnce();
        await view.rerender({ running: true, progress: { ...result("completed"), phase: "auth" } });
        expect(screen.getByRole("button", { name: "postHistory.fullScanStart" }).hasAttribute("disabled")).toBe(true);
        expect(screen.getByRole("status").textContent).toContain("postHistory.fullScanPhase.auth");
        await fireEvent.click(screen.getByRole("button", { name: "postHistory.fullScanCancel" })); expect(cancel).toHaveBeenCalledOnce();
        await fireEvent.click(screen.getByRole("button", { name: "global.close" })); expect(close).toHaveBeenCalledWith(false);
    });
});
