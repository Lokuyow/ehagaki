import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../i18n";
import { locale, waitLocale } from "svelte-i18n";
import PostContentPreview from "../../components/PostContentPreview.svelte";
import PostContentPreviewGatedSlotHarness from "./fixtures/PostContentPreviewGatedSlotHarness.svelte";
import { buildPostContentRenderModel, type SensitiveBodyLoader, type SensitiveBodyCacheStatus } from "../../lib/postContentPreview";
import { createDeferred } from "../deferredTestUtils";

describe("PostContentPreview Content Warning", () => {
    beforeEach(async () => {
        locale.set("ja");
        await waitLocale("ja");
    });

    afterEach(() => cleanup());

    it("renders the after-content slot only after the parent warning is revealed", async () => {
        const view = render(PostContentPreviewGatedSlotHarness);

        expect(view.queryByTestId("quoted-card")).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));
        expect(view.getByTestId("quoted-card")).toBeTruthy();
    });

    it.each(["account", "runtime"])("cancels obsolete same-ID loaders when %s changes", async (changedScope) => {
        const pending = createDeferred<string | null>();
        let signal: AbortSignal | undefined;
        const first: SensitiveBodyLoader = vi.fn((input) => { signal = input; return pending.promise; });
        const runtime = {};
        first.scope = { runtime, ownerPubkey: "first" };
        const second: SensitiveBodyLoader = vi.fn(async () => "current body");
        second.scope = {
            runtime: changedScope === "runtime" ? {} : runtime,
            ownerPubkey: changedScope === "account" ? "second" : "first",
        };
        const model = buildPostContentRenderModel({ sourceContent: "", tags: [["content-warning"]] });
        const view = render(PostContentPreview, { model, contentWarningEventId: "same-id", loadSensitiveBody: first });
        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));
        await view.rerender({ model, contentWarningEventId: "same-id", loadSensitiveBody: second });
        expect(signal?.aborted).toBe(true);
        pending.resolve("obsolete body");
        await tick();
        expect(screen.queryByText("obsolete body")).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));
        expect(screen.getByText("current body")).toBeTruthy();
        view.unmount();
    });

    it("aborts a pending reveal and releases cache observation when unmounted", async () => {
        const pending = createDeferred<string | null>();
        let signal: AbortSignal | undefined;
        const unsubscribe = vi.fn();
        const loader: SensitiveBodyLoader = vi.fn((input) => { signal = input; return pending.promise; });
        loader.observe = () => unsubscribe;
        const model = buildPostContentRenderModel({ sourceContent: "", tags: [["content-warning"]] });
        const view = render(PostContentPreview, { model, contentWarningEventId: "unmounted", loadSensitiveBody: loader });
        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));
        view.unmount();
        expect(signal?.aborted).toBe(true);
        expect(unsubscribe).toHaveBeenCalledOnce();
        pending.resolve("obsolete body");
        await tick();
        expect(screen.queryByText("obsolete body")).toBeNull();
    });

    it("observes deletion/import changes and hides a revealed payload without remounting", async () => {
        let changed: ((status: SensitiveBodyCacheStatus) => void) | undefined;
        const unsubscribe = vi.fn();
        const loader: SensitiveBodyLoader = vi.fn(async () => "cached body");
        loader.observe = (callback) => { changed = callback; return unsubscribe; };
        const model = buildPostContentRenderModel({ sourceContent: "", tags: [["content-warning"]] });
        const view = render(PostContentPreview, { model, contentWarningEventId: "same-id", loadSensitiveBody: loader });
        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));
        expect(screen.getByText("cached body")).toBeTruthy();
        changed?.("deleted");
        await tick();
        expect(screen.queryByText("cached body")).toBeNull();
        expect(screen.getByRole("button", { name: "再試行" })).toBeTruthy();
        view.unmount();
        expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it("loads custom emoji from the revealed payload model, not the empty Structure", async () => {
        const emoji = createDeferred<{ ready: boolean; aspectRatio: number }>();
        const loader: SensitiveBodyLoader = vi.fn(async () => "reward :party:");
        loader.loadEmoji = vi.fn(() => emoji.promise);
        const model = buildPostContentRenderModel({ sourceContent: "", tags: [["content-warning"], ["emoji", "party", "https://example.com/party.webp"]] });
        const view = render(PostContentPreview, { model, contentWarningEventId: "emoji-id", loadSensitiveBody: loader });
        expect(loader.loadEmoji).not.toHaveBeenCalled();
        expect(view.container.querySelector("img")).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));
        expect(loader.loadEmoji).toHaveBeenCalledWith("https://example.com/party.webp");
        emoji.resolve({ ready: true, aspectRatio: 1 });
        await tick();
        await tick();
        expect(view.container.querySelector('img[src="https://example.com/party.webp"]')).toBeTruthy();
    });

    it("hides body and media until revealed, then resets when the preview event changes", async () => {
        const firstModel = buildPostContentRenderModel({
            sourceContent: "",
            tags: [[
                "content-warning",
                "Spoiler reason",
                "protected first body https://example.com/first.jpg",
            ]],
        });
        const secondModel = buildPostContentRenderModel({
            sourceContent: "",
            tags: [["content-warning", "Second reason", "protected second body"]],
        });
        const view = render(PostContentPreview, {
            props: {
                model: firstModel,
                contentWarningEventId: "event-1",
            },
        });

        expect(screen.getByText("Spoiler reason")).toBeTruthy();
        expect(screen.queryByText(/protected first body/)).toBeNull();
        expect(view.container.querySelector(".post-preview-media")).toBeNull();

        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));
        expect(screen.getByText(/protected first body/)).toBeTruthy();
        expect(view.container.querySelector(".post-preview-media")).toBeTruthy();

        await view.rerender({
            model: secondModel,
            contentWarningEventId: "event-2",
        });
        await tick();

        expect(screen.getByText("Second reason")).toBeTruthy();
        expect(screen.queryByText("protected second body")).toBeNull();
        expect(screen.getByRole("button", { name: "本文を表示" })).toBeTruthy();
    });

    it("renders fail-closed CW body as literal text only after explicit reveal", async () => {
        const literalBody = "<script>window.pwned = true</script> <b>エ゛ッ</b>";
        const model = buildPostContentRenderModel({
            sourceContent: "",
            tags: [["content-warning", "実験", literalBody]],
        });
        const view = render(PostContentPreview, {
            props: { model, contentWarningEventId: "literal-cw-event" },
        });

        expect(screen.queryByText(literalBody)).toBeNull();
        expect(view.container.querySelector("script, b")).toBeNull();

        await fireEvent.click(screen.getByRole("button", { name: "本文を表示" }));

        expect(screen.getByText(literalBody)).toBeTruthy();
        expect(view.container.querySelector("script, b")).toBeNull();
        expect((window as Window & { pwned?: boolean }).pwned).toBeUndefined();
    });
});
