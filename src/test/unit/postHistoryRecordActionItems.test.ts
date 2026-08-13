import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { readable } from "svelte/store";
import PostHistoryRecordActionItemsHarness from "./fixtures/PostHistoryRecordActionItemsHarness.svelte";

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => {
        const messages: Record<string, string> = {
            "postHistory.copyNevent": "neventをコピー",
            "postHistory.copyFailed": "コピーに失敗しました",
            "postHistory.openInExternalClient": "{client}で開く",
            "postHistory.openInExternalClientFallback": "外部クライアントで開く",
            "postHistory.rawJson": "イベントJSONを表示",
            "postHistory.broadcast": "ブロードキャスト",
            "postHistory.delete": "削除",
            "postHistory.deleteSending": "送信中",
        };
        return messages[key] ?? key;
    }),
    locale: readable("ja-JP"),
}));

function menuItemNames(): string[] {
    return screen
        .getAllByRole("menuitem", { hidden: true })
        .map((item) => item.textContent?.trim() ?? "");
}

describe("PostHistoryRecordActionItems", () => {
    it("standard order keeps a delete separator only when requested", () => {
        const { container } = render(PostHistoryRecordActionItemsHarness, {
            showDeleteSeparator: false,
        });

        expect(menuItemNames()).toEqual([
            "neventをコピー",
            "イベントJSONを表示",
            "ブロードキャスト",
            "削除",
        ]);
        expect(container.ownerDocument.querySelectorAll(".post-history-menu-separator")).toHaveLength(0);
    });

    it("keeps the thread-node raw JSON first order and delete separator", () => {
        const { container } = render(PostHistoryRecordActionItemsHarness, {
            order: "raw-json-first",
            showDeleteSeparator: true,
        });

        expect(menuItemNames()).toEqual([
            "イベントJSONを表示",
            "neventをコピー",
            "ブロードキャスト",
            "削除",
        ]);
        expect(container.ownerDocument.querySelectorAll(".post-history-menu-separator")).toHaveLength(1);
    });

    it("does not leave a separator when delete is hidden", () => {
        const { container } = render(PostHistoryRecordActionItemsHarness, {
            showDelete: false,
            showDeleteSeparator: true,
        });

        expect(menuItemNames()).toEqual([
            "neventをコピー",
            "イベントJSONを表示",
            "ブロードキャスト",
        ]);
        expect(container.ownerDocument.querySelectorAll(".post-history-menu-separator")).toHaveLength(0);
    });

    it("forwards action callbacks in the existing pointer and selection order", async () => {
        const onCopyPointerDown = vi.fn();
        const onCopyNevent = vi.fn();
        const onShowRawJson = vi.fn();
        const onBroadcastPointerDown = vi.fn();
        const onBroadcastPost = vi.fn();
        const onOpenDeleteConfirm = vi.fn();

        render(PostHistoryRecordActionItemsHarness, {
            onCopyPointerDown,
            onCopyNevent,
        });

        const copy = screen.getByRole("menuitem", { name: "neventをコピー" });
        await fireEvent.pointerDown(copy);
        await fireEvent.click(copy);

        expect(onCopyPointerDown).toHaveBeenCalledTimes(1);
        expect(onCopyNevent).toHaveBeenCalledTimes(1);

        cleanup();
        render(PostHistoryRecordActionItemsHarness, { onShowRawJson });
        await fireEvent.click(
            screen.getByRole("menuitem", { name: "イベントJSONを表示" }),
        );
        expect(onShowRawJson).toHaveBeenCalledTimes(1);

        cleanup();
        render(PostHistoryRecordActionItemsHarness, {
            onBroadcastPointerDown,
            onBroadcastPost,
        });
        const broadcast = screen.getByRole("menuitem", { name: "ブロードキャスト" });
        await fireEvent.pointerDown(broadcast);
        await fireEvent.click(broadcast);
        expect(onBroadcastPointerDown).toHaveBeenCalledTimes(1);
        expect(onBroadcastPost).toHaveBeenCalledTimes(1);

        cleanup();
        render(PostHistoryRecordActionItemsHarness, { onOpenDeleteConfirm });
        await fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));
        expect(onOpenDeleteConfirm).toHaveBeenCalledTimes(1);
    });

    it("keeps a sending broadcast item disabled", async () => {
        const onBroadcastPointerDown = vi.fn();
        const onBroadcastPost = vi.fn();

        render(PostHistoryRecordActionItemsHarness, {
            broadcastSending: true,
            onBroadcastPointerDown,
            onBroadcastPost,
        });

        const broadcast = screen.getByRole("menuitem", { name: "ブロードキャスト" });
        await fireEvent.pointerDown(broadcast);
        await fireEvent.click(broadcast);

        expect(broadcast.hasAttribute("data-disabled")).toBe(true);
        expect(onBroadcastPointerDown).toHaveBeenCalledTimes(1);
        expect(onBroadcastPost).not.toHaveBeenCalled();
    });

    it("shows and forwards the configured external client action", async () => {
        const onOpenExternalClient = vi.fn();

        render(PostHistoryRecordActionItemsHarness, {
            externalClientLabel: "nostterで開く",
            onOpenExternalClient,
        });

        const item = screen.getByRole("menuitem", { name: "nostterで開く" });
        expect(menuItemNames()).toEqual([
            "nostterで開く",
            "neventをコピー",
            "イベントJSONを表示",
            "ブロードキャスト",
            "削除",
        ]);
        expect(document.querySelectorAll(".post-history-menu-separator")).toHaveLength(2);
        await fireEvent.click(item);

        expect(onOpenExternalClient).toHaveBeenCalledTimes(1);
    });
});
