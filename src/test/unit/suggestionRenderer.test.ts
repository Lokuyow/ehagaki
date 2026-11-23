import { flushSync } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import HashtagSuggestionList from "../../components/HashtagSuggestionList.svelte";
import { createSuggestionRenderer } from "../../lib/editor/suggestionRenderer.svelte";

function enter(): KeyboardEvent {
    return new KeyboardEvent("keydown", { key: "Enter" });
}

function renderedLabels(): string[] {
    return Array.from(document.querySelectorAll(".hashtag-label"))
        .map((element) => element.textContent ?? "");
}

describe("createSuggestionRenderer", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", class {
            observe() {}
            unobserve() {}
            disconnect() {}
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        document.body.replaceChildren();
    });

    it("候補の更新では一覧を作り直さず、最新の候補と確定先を使う", () => {
        const renderer = createSuggestionRenderer<string>({
            component: HashtagSuggestionList,
        })();
        const firstCommand = vi.fn();
        const secondCommand = vi.fn();

        renderer.onStart({ items: ["alpha", "alpine"], command: firstCommand });
        flushSync();
        const root = document.querySelector(".suggestion-command");
        const alphaRow = document.querySelector(".hashtag-suggestion-item");
        expect(root).not.toBeNull();
        expect(renderedLabels()).toEqual(["alpha", "alpine"]);

        renderer.onUpdate({ items: ["alpha"], command: secondCommand });
        flushSync();
        expect(document.querySelector(".suggestion-command")).toBe(root);
        expect(document.querySelector(".hashtag-suggestion-item")).toBe(alphaRow);
        expect(renderedLabels()).toEqual(["alpha"]);

        expect(renderer.onKeyDown({ event: enter() })).toBe(true);
        expect(firstCommand).not.toHaveBeenCalled();
        expect(secondCommand).toHaveBeenCalledWith("alpha");

        renderer.onExit();
    });

    it("候補が空になっても再表示でき、終了時に DOM を取り除く", () => {
        const renderer = createSuggestionRenderer<string>({
            component: HashtagSuggestionList,
            className: "test-suggestion-popover",
        })();
        const command = vi.fn();

        renderer.onStart({ items: ["alpha", "beta"], command });
        flushSync();
        renderer.onKeyDown({ event: new KeyboardEvent("keydown", { key: "ArrowDown" }) });
        flushSync();

        renderer.onUpdate({ items: [], command });
        flushSync();
        expect(document.querySelector(".suggestion-command")).toBeNull();
        expect(renderer.onKeyDown({ event: enter() })).toBe(false);

        renderer.onUpdate({ items: ["gamma", "delta"], command });
        flushSync();
        expect(renderedLabels()).toEqual(["gamma", "delta"]);
        // Each query starts from the first candidate again.
        expect(renderer.onKeyDown({ event: enter() })).toBe(true);
        expect(command).toHaveBeenLastCalledWith("gamma");

        renderer.onExit();
        expect(document.querySelector(".test-suggestion-popover")).toBeNull();
        expect(document.querySelector(".suggestion-command")).toBeNull();
    });
});
