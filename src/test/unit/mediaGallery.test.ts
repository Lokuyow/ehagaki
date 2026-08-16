import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, cleanup, render } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { tick } from "svelte";
import type { MediaGalleryItem } from "../../lib/types";
import MediaGallery from "../../components/MediaGallery.svelte";
import {
    editorState,
    resetPostStatus,
    updatePostStatus,
} from "../../stores/editorStore.svelte";
import { mediaGalleryStore } from "../../stores/mediaGalleryStore.svelte";

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        "mediaGallery.aria_label": "メディアギャラリー",
        "imageContextMenu.delete": "削除",
        "imageContextMenu.copyUrl": "URLをコピー",
        "imageContextMenu.copySuccess": "コピーしました",
    };

    return translations[key] || key;
});

vi.mock("svelte-i18n", () => ({
    _: readable(mockTranslate),
}));

function createItem(id: string): MediaGalleryItem {
    return {
        id,
        type: "image",
        src: `https://example.com/${id}.png`,
        isPlaceholder: false,
        alt: id,
    };
}

function createDragEvent(type: string, clientX = 10): DragEvent {
    const event = new Event(type, {
        bubbles: true,
        cancelable: true,
    }) as DragEvent;
    Object.defineProperty(event, "clientX", { value: clientX });
    Object.defineProperty(event, "dataTransfer", {
        value: {
            effectAllowed: "none",
            setData: vi.fn(),
            setDragImage: vi.fn(),
        },
    });
    return event;
}

function createTouchEvent(type: string, clientX = 10): TouchEvent {
    const event = new Event(type, {
        bubbles: true,
        cancelable: true,
    }) as TouchEvent;
    Object.defineProperty(event, "touches", {
        value:
            type === "touchend"
                ? []
                : [{ clientX, clientY: 10 }],
    });
    return event;
}

describe("MediaGallery sending state", () => {
    beforeEach(() => {
        mediaGalleryStore.clearAll();
        resetPostStatus();
        mediaGalleryStore.addItem(createItem("image-1"));
        mediaGalleryStore.addItem(createItem("image-2"));
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
        mediaGalleryStore.clearAll();
        resetPostStatus();
    });

    it("blocks deletion and PC reorder while sending, then restores both operations", async () => {
        const { container } = render(MediaGallery);
        const gallery = container.querySelector<HTMLElement>(".media-gallery")!;
        const firstItem = gallery.querySelector<HTMLElement>(".gallery-item")!;
        const secondItem = gallery.querySelectorAll<HTMLElement>(".gallery-item")[1];

        // A drag that started before sending must not be committed after sending starts.
        firstItem.dispatchEvent(createDragEvent("dragstart"));
        updatePostStatus({ ...editorState.postStatus, sending: true });
        await tick();

        expect(gallery.classList.contains("sending")).toBe(true);
        expect(
            (gallery.querySelector(".media-delete-btn") as HTMLButtonElement)
                .disabled,
        ).toBe(true);

        const blockedStart = createDragEvent("dragstart");
        expect(firstItem.dispatchEvent(blockedStart)).toBe(false);

        secondItem.dispatchEvent(createDragEvent("dragover"));
        gallery.dispatchEvent(createDragEvent("drop"));
        await tick();
        expect(mediaGalleryStore.items.map((item) => item.id)).toEqual([
            "image-1",
            "image-2",
        ]);

        await fireEvent.click(gallery.querySelector(".media-delete-btn")!);
        expect(mediaGalleryStore.items.map((item) => item.id)).toEqual([
            "image-1",
            "image-2",
        ]);

        updatePostStatus({ ...editorState.postStatus, sending: false });
        await tick();

        expect(gallery.classList.contains("sending")).toBe(false);
        expect(
            (gallery.querySelector(".media-delete-btn") as HTMLButtonElement)
                .disabled,
        ).toBe(false);

        const refreshedItems = gallery.querySelectorAll<HTMLElement>(".gallery-item");
        refreshedItems[0].dispatchEvent(createDragEvent("dragstart"));
        refreshedItems[1].dispatchEvent(createDragEvent("dragover"));
        gallery.dispatchEvent(createDragEvent("drop"));
        await tick();

        expect(mediaGalleryStore.items.map((item) => item.id)).toEqual([
            "image-2",
            "image-1",
        ]);

        await fireEvent.click(gallery.querySelector(".media-delete-btn")!);
        expect(mediaGalleryStore.items.map((item) => item.id)).toEqual([
            "image-1",
        ]);
    });

    it("does not commit a touch reorder while sending and restores it afterward", async () => {
        vi.useFakeTimers();
        const { container } = render(MediaGallery);
        const gallery = container.querySelector<HTMLElement>(".media-gallery")!;
        const firstItem = gallery.querySelector<HTMLElement>(".gallery-item")!;
        const secondWrapper = gallery.querySelectorAll<HTMLElement>(
            ".gallery-item-wrapper",
        )[1];
        const originalElementFromPoint = document.elementFromPoint;
        Object.defineProperty(document, "elementFromPoint", {
            configurable: true,
            value: vi.fn(() => secondWrapper),
        });

        try {
            firstItem.dispatchEvent(createTouchEvent("touchstart"));
            vi.advanceTimersByTime(400);

            document.dispatchEvent(createTouchEvent("touchmove"));
            updatePostStatus({ ...editorState.postStatus, sending: true });
            await tick();
            document.dispatchEvent(createTouchEvent("touchend"));
            await tick();

            expect(mediaGalleryStore.items.map((item) => item.id)).toEqual([
                "image-1",
                "image-2",
            ]);

            updatePostStatus({ ...editorState.postStatus, sending: false });
            await tick();

            firstItem.dispatchEvent(createTouchEvent("touchstart"));
            vi.advanceTimersByTime(400);
            document.dispatchEvent(createTouchEvent("touchmove"));
            document.dispatchEvent(createTouchEvent("touchend"));
            await tick();

            expect(mediaGalleryStore.items.map((item) => item.id)).toEqual([
                "image-2",
                "image-1",
            ]);
        } finally {
            Object.defineProperty(document, "elementFromPoint", {
                configurable: true,
                value: originalElementFromPoint,
            });
        }
    });
});
