import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PreloadedCustomEmojiImageResult } from "../../lib/customEmoji";
import type { usePostHistoryEmojiState } from "../../lib/hooks/usePostHistoryEmojiState.svelte";
import PostHistoryEmojiStateHarness from "../helpers/PostHistoryEmojiStateHarness.svelte";

const mocks = vi.hoisted(() => ({
    getMany: vi.fn(),
    touchMany: vi.fn(),
    upsert: vi.fn(),
    preload: vi.fn(),
}));

vi.mock("../../lib/storage/customEmojiImageMetaRepository", () => ({
    customEmojiImageMetaRepository: {
        getMany: mocks.getMany,
        touchMany: mocks.touchMany,
        upsert: mocks.upsert,
    },
}));

vi.mock(import("../../lib/customEmoji"), async (importOriginal) => ({
    ...(await importOriginal()),
    preloadCustomEmojiImageWithMeta: mocks.preload,
}));

type EmojiState = ReturnType<typeof usePostHistoryEmojiState>;

const URL_A = "https://example.com/a.png";
const URL_B = "https://example.com/b.png";

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((done) => {
        resolve = done;
    });
    return { promise, resolve };
}

async function settle(): Promise<void> {
    for (let i = 0; i < 5; i++) {
        await Promise.resolve();
        await tick();
    }
}

describe("usePostHistoryEmojiState", () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
        mocks.getMany.mockReset().mockResolvedValue({});
        mocks.touchMany.mockReset().mockResolvedValue(undefined);
        mocks.upsert.mockReset().mockResolvedValue(undefined);
        mocks.preload.mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    function runBatch(): void {
        vi.runOnlyPendingTimers();
    }

    it("同じ URL 集合の新しい配列では保存済みメタデータを読み直さない", async () => {
        mocks.preload.mockResolvedValue({ ready: true, width: 10, height: 20, aspectRatio: 0.5 });
        mocks.getMany.mockImplementation(async (urls: string[]) => Object.fromEntries(urls
            .filter((url) => url === URL_A)
            .map((url) => [url, { url, width: 10, height: 20, aspectRatio: 0.5 }])));
        let emojiState: EmojiState | undefined;
        const view = render(PostHistoryEmojiStateHarness, {
            props: { urls: [URL_A], onReady: (state: EmojiState) => { emojiState = state; } },
        });
        await settle();

        expect(mocks.getMany).toHaveBeenCalledTimes(1);
        expect(mocks.getMany).toHaveBeenLastCalledWith([URL_A]);
        expect(mocks.touchMany).toHaveBeenCalledTimes(1);
        expect(emojiState?.emojiImageMetaByUrl[URL_A]?.aspectRatio).toBe(0.5);

        await view.rerender({ urls: [URL_A] });
        await settle();
        expect(mocks.getMany).toHaveBeenCalledTimes(1);
        expect(mocks.touchMany).toHaveBeenCalledTimes(1);
        expect(mocks.preload).toHaveBeenCalledTimes(1);

        // Only the URL that was not requested yet is read.
        await view.rerender({ urls: [URL_A, URL_B] });
        await settle();
        expect(mocks.getMany).toHaveBeenCalledTimes(2);
        expect(mocks.getMany).toHaveBeenLastCalledWith([URL_B]);
    });

    it("読み込み完了をまとめて1回で反映する", async () => {
        const loadA = deferred<PreloadedCustomEmojiImageResult>();
        const loadB = deferred<PreloadedCustomEmojiImageResult>();
        mocks.preload.mockImplementation((url: string) => url === URL_A ? loadA.promise : loadB.promise);
        const onStateChanged = vi.fn();
        let emojiState: EmojiState | undefined;
        render(PostHistoryEmojiStateHarness, {
            props: {
                urls: [URL_A, URL_B],
                onStateChanged,
                onReady: (state: EmojiState) => { emojiState = state; },
            },
        });
        await settle();
        expect(emojiState?.emojiLoadStateByUrl).toEqual({ [URL_A]: "loading", [URL_B]: "loading" });
        const changesBeforeLoad = onStateChanged.mock.calls.length;

        loadA.resolve({ ready: true, width: 10, height: 10, aspectRatio: 1 });
        await settle();
        loadB.resolve({ ready: false });
        await settle();

        // Results wait for the batch task.
        expect(emojiState?.emojiLoadStateByUrl[URL_A]).toBe("loading");
        expect(vi.getTimerCount()).toBe(1);
        expect(mocks.upsert).toHaveBeenCalledTimes(1);

        runBatch();
        await settle();
        expect(emojiState?.emojiLoadStateByUrl).toEqual({ [URL_A]: "ready", [URL_B]: "failed" });
        expect(emojiState?.emojiImageMetaByUrl[URL_A]?.aspectRatio).toBe(1);
        expect(onStateChanged.mock.calls.length - changesBeforeLoad).toBe(1);
        expect(mocks.preload).toHaveBeenCalledTimes(2);
    });

    it("保留中の結果は表示終了で破棄する", async () => {
        const loadA = deferred<PreloadedCustomEmojiImageResult>();
        mocks.preload.mockReturnValue(loadA.promise);
        let emojiState: EmojiState | undefined;
        const view = render(PostHistoryEmojiStateHarness, {
            props: { urls: [URL_A], onReady: (state: EmojiState) => { emojiState = state; } },
        });
        await settle();

        loadA.resolve({ ready: true, width: 10, height: 10, aspectRatio: 1 });
        await settle();
        expect(vi.getTimerCount()).toBe(1);

        emojiState?.suspend();
        await view.rerender({ urls: [URL_A], show: false });
        expect(vi.getTimerCount()).toBe(0);
        runBatch();
        await settle();
        expect(emojiState?.emojiLoadStateByUrl[URL_A]).toBeUndefined();
        expect(emojiState?.emojiImageMetaByUrl[URL_A]).toBeUndefined();
    });
});
