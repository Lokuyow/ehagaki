import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/svelte";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../i18n";
import { locale, waitLocale } from "svelte-i18n";
import type { NostrEvent } from "../../lib/types";
import PostHistoryRawJsonDialog from "../../components/PostHistoryRawJsonDialog.svelte";

function createSensitivePair(): { structure: NostrEvent; payload: NostrEvent } {
    const secretKey = generateSecretKey();
    const payload = finalizeEvent({
        kind: 36,
        content: "verified payload body",
        created_at: 100,
        tags: [["k", "1"]],
    }, secretKey) as NostrEvent;
    const structure = finalizeEvent({
        kind: 1,
        content: "",
        created_at: 100,
        tags: [["content-warning", "Sensitive"], ["c", payload.id]],
    }, secretKey) as NostrEvent;
    return { structure, payload };
}

describe("PostHistoryRawJsonDialog", () => {
    beforeEach(async () => {
        locale.set("ja");
        await waitLocale("ja");
    });

    afterEach(() => cleanup());

    it("keeps ordinary events as a single raw JSON view", async () => {
        const event = finalizeEvent({
            kind: 1,
            content: "ordinary post",
            created_at: 100,
            tags: [],
        }, generateSecretKey()) as NostrEvent;

        render(PostHistoryRawJsonDialog, {
            props: { open: true, rawEvent: event, loadPayloadEvent: vi.fn() },
        });

        const dialog = await screen.findByRole("dialog", { name: "イベントJSON" });
        expect(within(dialog).queryByRole("tab")).toBeNull();
        expect(within(dialog).getByText(/"content": "ordinary post"/)).toBeTruthy();
    });

    it("starts on Structure and shows only the paired payload after selecting its tab", async () => {
        const { structure, payload } = createSensitivePair();
        const loadPayloadEvent = vi.fn(async () => payload);

        render(PostHistoryRawJsonDialog, {
            props: { open: true, rawEvent: structure, loadPayloadEvent },
        });

        const dialog = await screen.findByRole("dialog", { name: "イベントJSON" });
        const tabs = within(dialog).getAllByRole("tab");
        expect(tabs.map((tab) => tab.textContent)).toEqual(["Structure", "Payload"]);
        expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
        expect(tabs[1]?.getAttribute("aria-selected")).toBe("false");

        const structurePanel = within(dialog).getByRole("tabpanel", { name: "Structure" });
        expect(structurePanel.textContent).toContain(`"id": "${structure.id}"`);
        expect(structurePanel.textContent).toContain('"kind": 1');
        expect(loadPayloadEvent).not.toHaveBeenCalled();

        await fireEvent.click(tabs[1]!);
        const payloadPanel = within(dialog).getByRole("tabpanel", { name: "Payload" });
        await waitFor(() => expect(payloadPanel.textContent).toContain(`"id": "${payload.id}"`));
        expect(payloadPanel.textContent).toContain('"kind": 36');
        expect(payloadPanel.textContent).toContain('"content": "verified payload body"');
        expect(loadPayloadEvent).toHaveBeenCalledWith(structure, expect.any(AbortSignal));
        expect(within(dialog).getAllByRole("tab")).toHaveLength(2);
        expect(within(dialog).getAllByRole("button").map((button) => button.getAttribute("aria-label")))
            .toEqual(["閉じる"]);
        expect(within(dialog).queryByRole("alert")).toBeNull();
    });

    it("leaves the Payload view empty when the verified reader cannot resolve a pair", async () => {
        const { structure } = createSensitivePair();
        const loadPayloadEvent = vi.fn(async () => null);

        render(PostHistoryRawJsonDialog, {
            props: { open: true, rawEvent: structure, loadPayloadEvent },
        });

        const dialog = await screen.findByRole("dialog", { name: "イベントJSON" });
        await fireEvent.click(within(dialog).getByRole("tab", { name: "Payload" }));
        await waitFor(() => expect(within(dialog).getByRole("tabpanel", { name: "Payload" }).textContent).toBe(""));
        expect(within(dialog).queryByRole("alert")).toBeNull();
        expect(within(dialog).queryByRole("button", { name: /再取得|retry/i })).toBeNull();
    });

    it("clears a displayed payload when the existing cache observer reports deletion", async () => {
        const { structure, payload } = createSensitivePair();
        let onChange: ((status: "available" | "missing" | "invalid" | "deleted") => void) | undefined;
        const stop = vi.fn();

        render(PostHistoryRawJsonDialog, {
            props: {
                open: true,
                rawEvent: structure,
                loadPayloadEvent: vi.fn(async () => payload),
                observePayloadStatus: vi.fn((_structure, callback) => {
                    onChange = callback;
                    return stop;
                }),
            },
        });

        const dialog = await screen.findByRole("dialog", { name: "イベントJSON" });
        await fireEvent.click(within(dialog).getByRole("tab", { name: "Payload" }));
        const payloadPanel = within(dialog).getByRole("tabpanel", { name: "Payload" });
        await waitFor(() => expect(payloadPanel.textContent).toContain(payload.id));

        onChange?.("deleted");
        await waitFor(() => expect(payloadPanel.textContent).toBe(""));
        await fireEvent.click(within(dialog).getByRole("button", { name: "閉じる" }));
        await waitFor(() => expect(stop).toHaveBeenCalledOnce());
    });
});
