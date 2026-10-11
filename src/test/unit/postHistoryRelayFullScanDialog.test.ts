import { fireEvent, render, screen, within } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { describe, expect, it, vi } from "vitest";
import PostHistoryRelayFullScanDialog from "../../components/PostHistoryRelayFullScanDialog.svelte";
import type { PostHistoryFullScanResult, PostHistoryFullScanRelayProgress } from "../../lib/postHistoryRelayFullScanService";
vi.mock("svelte-i18n", () => ({ _: readable((key: string) => key) }));

function result(status: PostHistoryFullScanResult["status"]): PostHistoryFullScanResult {
    return { status, ownerPubkeyHex: "a".repeat(64), localRevision: 0, upperBound: 100, phase: "fetching", elapsedMs: 2000,
        receivedCount: 9, insertedCount: 3, updatedCount: 2, finishedRelayCount: 2, targetRelayCount: 2,
        relays: [{ relayUrl: "wss://a.example/", status: "completed", phase: "fetching", receivedCount: 7, requestCount: 1, issueCounts: {}, rangeSamples: [] },
            { relayUrl: "wss://b.example/", status: status === "completed" ? "completed" : "partial", phase: "fetching", receivedCount: 2, requestCount: 1,
                issueCounts: status === "partial" ? { timeout: 1 } : {}, rangeSamples: [] }] };
}
describe("full relay scan dialog", () => {
    const relayStates: { expected: string; expectedIssue?: string; expectedInfo?: boolean; relay: Partial<PostHistoryFullScanRelayProgress> }[] = [
        { expected: "pending", relay: { status: "running", phase: "pending", receivedCount: 0 } },
        { expected: "fetching", relay: { status: "running", receivedCount: 12 } },
        { expected: "auth", relay: { status: "running", phase: "auth", receivedCount: 4 } },
        { expected: "completed", relay: { status: "completed", receivedCount: 8 } },
        { expected: "empty", relay: { status: "completed", receivedCount: 0 } },
        { expected: "timeout", relay: { status: "partial", receivedCount: 0, issueCounts: { timeout: 1 } } },
        { expected: "timeout", relay: { status: "partial", issueCounts: { "auth-timeout": 1 } } },
        { expected: "error", relay: { status: "partial", receivedCount: 0, issueCounts: { error: 2 } } },
        { expected: "completed", expectedInfo: true, relay: { status: "completed", receivedCount: 0, issueCounts: { ambiguous: 1 } } },
        { expected: "partial", relay: { status: "partial", issueCounts: { ambiguous: 1, timeout: 1 } } },
        { expected: "partial", relay: { status: "partial", issueCounts: { timeout: 1, error: 1 } } },
        { expected: "partial", expectedIssue: "auth-rejected", relay: { status: "partial", receivedCount: 0, issueCounts: { "auth-rejected": 1 } } },
        { expected: "partial", expectedIssue: "auth-unresolved", relay: { status: "partial", issueCounts: { "auth-unresolved": 1 } } },
        { expected: "partial", expectedIssue: "safety-limit", relay: { status: "partial", issueCounts: { "safety-limit": 1 } } },
        { expected: "partial", expectedIssue: "storage", relay: { status: "partial", issueCounts: { storage: 1 } } },
        { expected: "cancelled", relay: { status: "cancelled", receivedCount: 5 } },
    ];
    it.each(relayStates)("shows relay $expected with its raw count, including zero-count failures", async ({ expected, expectedIssue, expectedInfo, relay }) => {
        const summary = result("partial");
        summary.relays = [{ ...summary.relays[0], relayUrl: "wss://long-relay.example:8443/history", ...relay }];
        const running = summary.relays[0].status === "running";
        render(PostHistoryRelayFullScanDialog, { open: true, running, canStart: true, elapsedMs: 2000,
            progress: running ? summary : null, result: running ? null : summary, onOpenChange: vi.fn(), onStart: vi.fn(), onCancel: vi.fn() });
        const row = (await screen.findByRole("table")).querySelector(".scan-relay-row")!;
        expect(row.querySelector(".scan-relay-host")?.textContent).toBe("long-relay.example:8443");
        expect(row.querySelector(".scan-relay-host")?.getAttribute("title")).toBe(summary.relays[0].relayUrl);
        expect(row.querySelector(".scan-relay-state-line > span")?.textContent).toBe(`postHistory.fullScanRelayStatus.${expected}`);
        if (expectedIssue) expect(row.querySelector(".scan-relay-reason")?.textContent).toBe(`postHistory.fullScanIssue.${expectedIssue}`);
        else expect(row.querySelector(".scan-relay-reason")).toBeNull();
        expect(row.querySelector('button[aria-label="postHistory.fullScanAmbiguityInfo.label"]') !== null).toBe(expectedInfo ?? false);
        expect(row.querySelector(".scan-relay-count")?.textContent).toBe(String(summary.relays[0].receivedCount));
        expect(row.textContent).not.toMatch(/unique/i);
    });
    it("shows ambiguous-only as completed, hides its issue from normal results, and opens its explanation", async () => {
        const summary = result("completed");
        summary.relays[1] = { ...summary.relays[1], receivedCount: 0, issueCounts: { ambiguous: 3 } };
        render(PostHistoryRelayFullScanDialog, { open: true, running: false, canStart: true, elapsedMs: 2000,
            progress: null, result: summary, onOpenChange: vi.fn(), onStart: vi.fn(), onCancel: vi.fn() });
        const dialog = await screen.findByRole("dialog");
        const row = dialog.querySelectorAll(".scan-relay-row")[1] as HTMLElement;
        expect(row.querySelector(".scan-relay-state > .scan-relay-state-line > span")?.textContent).toBe("postHistory.fullScanRelayStatus.completed");
        expect(row.querySelector(".scan-relay-reason")).toBeNull();
        expect(dialog.textContent).not.toContain("postHistory.fullScanIssue.ambiguous");
        const totals = dialog.querySelectorAll(".scan-results section")[1].querySelectorAll("dl div");
        expect(totals[2].textContent).toContain("postHistory.fullScanCompletedRelays");
        expect(totals[2].querySelector("dd")?.textContent).toBe("2");
        expect(totals[3].textContent).toContain("postHistory.fullScanIncompleteRelays");
        expect(totals[3].querySelector("dd")?.textContent).toBe("0");
        const trigger = within(row).getByRole("button", { name: "postHistory.fullScanAmbiguityInfo.label" });
        await fireEvent.click(trigger);
        for (const key of ["title", "bodyCompletion", "bodyEose", "bodyStatus"]) {
            expect(await screen.findByText(`postHistory.fullScanAmbiguityInfo.${key}`)).toBeTruthy();
        }
    });
    it("keeps every queued target visible through concurrent updates and the final result", async () => {
        const summary = result("completed");
        const pending = { ...summary, relays: summary.relays.map((relay) => ({ ...relay, status: "running" as const, phase: "pending" as const, receivedCount: 0 })) };
        const view = render(PostHistoryRelayFullScanDialog, { open: true, running: true, canStart: true, elapsedMs: 0,
            progress: pending, result: null, onOpenChange: vi.fn(), onStart: vi.fn(), onCancel: vi.fn() });
        const table = await screen.findByRole("table");
        expect(table.querySelectorAll(".scan-relay-row")).toHaveLength(2);
        expect(table.textContent?.match(/postHistory.fullScanRelayStatus.pending/g)).toHaveLength(2);
        await view.rerender({ progress: { ...summary, relays: [
            { ...summary.relays[0], status: "running", phase: "fetching" },
            { ...summary.relays[1], status: "running", phase: "auth" },
        ] } });
        const rows = table.querySelectorAll(".scan-relay-row");
        expect(rows[0].textContent).toContain("postHistory.fullScanRelayStatus.fetching");
        expect(rows[1].textContent).toContain("postHistory.fullScanRelayStatus.auth");
        await view.rerender({ running: false, result: summary });
        expect(rows[0].querySelector(".scan-relay-count")?.textContent).toBe("7");
        expect(rows[1].querySelector(".scan-relay-count")?.textContent).toBe("2");
        expect(table.textContent?.match(/postHistory.fullScanRelayStatus.completed/g)).toHaveLength(2);
    });
    it.each(["completed", "partial", "failed", "cancelled", "stale-cancelled"] as const)("shows the actual %s result and no fabricated percentage or ETA", async (status) => {
        render(PostHistoryRelayFullScanDialog, { open: true, running: false, canStart: true, elapsedMs: 2000,
            progress: null, result: result(status), onOpenChange: vi.fn(), onStart: vi.fn(), onCancel: vi.fn() });
        const dialog = await screen.findByRole("dialog");
        expect(within(dialog).getByRole("status").textContent).toContain(`postHistory.fullScanStatus.${status}`);
        expect(dialog.textContent).toContain("2 / 2"); expect(dialog.textContent).toContain("0:02");
        expect(within(dialog).queryByRole("progressbar")).toBeNull();
        expect(dialog.textContent).not.toMatch(/%|RemainingTime|ETA/);
        if (status === "partial") expect(dialog.textContent).toContain("postHistory.fullScanIssue.timeout");
        expect(within(dialog).queryByRole("button", { name: "postHistory.fullScanStart" })).toBeNull();
    });
    it("exposes start, disables duplicate start and lets users cancel or close", async () => {
        const start = vi.fn(); const cancel = vi.fn(); const close = vi.fn();
        const view = render(PostHistoryRelayFullScanDialog, { open: true, running: false, canStart: true, elapsedMs: 0,
            progress: null, result: null, onOpenChange: close, onStart: start, onCancel: cancel });
        await fireEvent.click(await screen.findByRole("button", { name: "postHistory.fullScanStart" }));
        expect(start).toHaveBeenCalledOnce();
        await view.rerender({ running: true, progress: { ...result("completed"), phase: "auth" } });
        expect(screen.queryByRole("button", { name: "postHistory.fullScanStart" })).toBeNull();
        expect(screen.getByRole("status").textContent).toContain("postHistory.fullScanPhase.auth");
        await fireEvent.click(screen.getByRole("button", { name: "postHistory.fullScanCancel" })); expect(cancel).toHaveBeenCalledOnce();
        await fireEvent.click(screen.getByRole("button", { name: "global.close" })); expect(close).toHaveBeenCalledWith(false);
    });
});
