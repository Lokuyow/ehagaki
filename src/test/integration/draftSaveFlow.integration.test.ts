import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MAX_DRAFTS } from "../../lib/constants";
import { createDraftComposerController } from "../../lib/draftComposerController";
import {
    loadDrafts,
    saveDraft,
    saveDraftWithReplaceOldest,
} from "../../lib/draftManager";
import { ehagakiDb } from "../../lib/storage/ehagakiDb";
import { draftsRepository } from "../../lib/storage/draftsRepository";
import { MockStorage } from "../helpers";

function createController(htmlContent: string, pubkeyHex = "pubkey-a") {
    return createDraftComposerController({
        getEditorHtml: () => htmlContent,
        getGalleryItems: () => [],
        getChannelContextState: () => null,
        getReplyQuoteState: () => ({ reply: null, quotes: [] }),
        getPubkeyHex: () => pubkeyHex,
        saveDraft,
        saveDraftWithReplaceOldest,
        openDraftLimitConfirm: vi.fn(),
        closeDraftLimitConfirm: vi.fn(),
        logger: { error: vi.fn() },
        isGalleryMode: () => false,
        document,
        clearGallery: vi.fn(),
        addGalleryItem: vi.fn(),
        loadDraftContent: vi.fn(),
        appendMediaToEditor: vi.fn(),
        generateMediaItemId: () => "media-id",
        restoreChannelContext: vi.fn(),
        clearChannelContext: vi.fn(),
        restoreReplyQuote: vi.fn(),
        clearReplyQuote: vi.fn(),
    });
}

describe("draft save flow integration", () => {
    beforeEach(async () => {
        Object.defineProperty(globalThis, "localStorage", {
            value: new MockStorage(),
            writable: true,
        });
        await ehagakiDb.open();
        await ehagakiDb.transaction(
            "rw",
            ehagakiDb.drafts,
            ehagakiDb.meta,
            async () => {
                await ehagakiDb.drafts.clear();
                await ehagakiDb.meta.clear();
            },
        );
        draftsRepository.resetBackendSelectionForTesting();
    });

    afterEach(async () => {
        await ehagakiDb.transaction(
            "rw",
            ehagakiDb.drafts,
            ehagakiDb.meta,
            async () => {
                await ehagakiDb.drafts.clear();
                await ehagakiDb.meta.clear();
            },
        );
    });

    it("通常保存完了を通知し、その通知から最新一覧を読み込める", async () => {
        const controller = createController("<p>Normal save</p>");
        let resolveCompletion: (() => void) | undefined;
        const completion = new Promise<void>((resolve) => {
            resolveCompletion = resolve;
        });
        const loadedLists: string[][] = [];
        controller.subscribeToDraftSaveCompleted((event) => {
            void loadDrafts({ pubkeyHex: event.pubkeyHex }).then((drafts) => {
                loadedLists.push(drafts.map((draft) => draft.preview));
                resolveCompletion?.();
            });
        });

        await expect(controller.saveDraftFromComposer()).resolves.toEqual({
            status: "saved",
        });
        await completion;

        expect(loadedLists).toEqual([["Normal save"]]);
    });

    it("フォールバック通常保存も完了通知後の一覧から必ず取得できる", async () => {
        vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
            new Error("put failed"),
        );
        const controller = createController("<p>Fallback save</p>");
        const completionLists: string[][] = [];
        let resolveCompletion: (() => void) | undefined;
        const completion = new Promise<void>((resolve) => {
            resolveCompletion = resolve;
        });
        controller.subscribeToDraftSaveCompleted((event) => {
            void loadDrafts({ pubkeyHex: event.pubkeyHex }).then((drafts) => {
                completionLists.push(drafts.map((draft) => draft.preview));
                resolveCompletion?.();
            });
        });

        await expect(controller.saveDraftFromComposer()).resolves.toEqual({
            status: "saved",
        });
        await completion;

        expect(completionLists).toEqual([["Fallback save"]]);
    });

    it("フォールバック置換でも確認中は通知せず、成功後に同じ通知から最新一覧を読み込める", async () => {
        for (let index = 0; index < MAX_DRAFTS; index += 1) {
            await saveDraft(
                `<p>Existing ${index}</p>`,
                undefined,
                undefined,
                undefined,
                { pubkeyHex: "pubkey-a" },
            );
        }
        const before = await loadDrafts({ pubkeyHex: "pubkey-a" });
        const oldestId = before[before.length - 1].id;
        const controller = createController("<p>Replacement</p>");
        const completionEvents: string[] = [];
        let resolveCompletion: (() => void) | undefined;
        const completion = new Promise<void>((resolve) => {
            resolveCompletion = resolve;
        });
        let loadedAfterCompletion = await loadDrafts({
            pubkeyHex: "pubkey-a",
        });
        controller.subscribeToDraftSaveCompleted((event) => {
            completionEvents.push(event.draftId);
            void loadDrafts({ pubkeyHex: event.pubkeyHex }).then((drafts) => {
                loadedAfterCompletion = drafts;
                resolveCompletion?.();
            });
        });

        await expect(controller.saveDraftFromComposer()).resolves.toEqual({
            status: "confirmation-required",
        });
        expect(completionEvents).toEqual([]);

        vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
            new Error("put failed"),
        );
        await expect(controller.confirmPendingDraftSave()).resolves.toEqual({
            status: "saved",
        });
        await completion;

        expect(completionEvents).toHaveLength(1);
        expect(loadedAfterCompletion).toHaveLength(MAX_DRAFTS);
        expect(loadedAfterCompletion[0].preview).toBe("Replacement");
        expect(
            loadedAfterCompletion.some((draft) => draft.id === oldestId),
        ).toBe(false);
    });
});
