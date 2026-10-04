import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../i18n";
import { locale, waitLocale } from "svelte-i18n";
import PostContentPreview from "../../components/PostContentPreview.svelte";
import { buildPostContentRenderModel } from "../../lib/postContentPreview";

describe("PostContentPreview Content Warning", () => {
    beforeEach(async () => {
        locale.set("ja");
        await waitLocale("ja");
    });

    afterEach(() => cleanup());

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
});
