import { render, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fullscreenMock = vi.hoisted(() => {
    let resolveDataSource: ((value: unknown[]) => void) | undefined;
    const dataSourcePromise = new Promise<unknown[]>((resolve) => {
        resolveDataSource = resolve;
    });

    class MockPhotoSwipe {
        static instances: MockPhotoSwipe[] = [];
        currIndex: number;
        private handlers = new Map<string, Array<(...args: any[]) => void>>();

        constructor(public options: Record<string, any>) {
            this.currIndex = options.index ?? 0;
            MockPhotoSwipe.instances.push(this);
        }

        on(eventName: string, handler: (...args: any[]) => void) {
            const handlers = this.handlers.get(eventName) ?? [];
            handlers.push(handler);
            this.handlers.set(eventName, handlers);
        }

        init() {}
        close() {}
        destroy() {}
        goTo(index: number) {
            this.currIndex = index;
        }
    }

    return {
        MockPhotoSwipe,
        dataSourcePromise,
        resolveDataSource: () => resolveDataSource?.([]),
    };
});

vi.mock("photoswipe", () => ({
    default: fullscreenMock.MockPhotoSwipe,
}));

vi.mock("../../lib/utils/fullscreenViewerUtils", () => ({
    buildFullscreenViewerDataSource: vi.fn(() => fullscreenMock.dataSourcePromise),
    createFullscreenVideoSlideElement: vi.fn(() => document.createElement("div")),
    pauseFullscreenVideoContent: vi.fn(),
}));

import ImageFullscreen from "../../components/ImageFullscreen.svelte";

describe("ImageFullscreen", () => {
    const originalState = { page: "origin" };

    beforeEach(() => {
        history.replaceState(originalState, "", "/origin");
        fullscreenMock.MockPhotoSwipe.instances.length = 0;
    });

    afterEach(() => {
        history.replaceState(originalState, "", "/origin");
    });

    it("PhotoSwipe生成前の外部closeでも履歴とclose処理を完了する", async () => {
        const onClose = vi.fn();
        const view = render(ImageFullscreen, {
            show: true,
            mediaList: [
                {
                    id: "image-1",
                    src: "https://example.com/image.jpg",
                    alt: "image",
                    type: "image",
                },
            ],
            currentIndex: 0,
            onClose,
        });

        await waitFor(() => {
            expect(history.state).toMatchObject({ imageFullscreen: true });
        });

        await view.rerender({ show: false });

        await waitFor(() => {
            expect(onClose).toHaveBeenCalledOnce();
            expect(history.state).toEqual(originalState);
        });

        fullscreenMock.resolveDataSource();
        await Promise.resolve();
        await Promise.resolve();

        expect(fullscreenMock.MockPhotoSwipe.instances).toHaveLength(0);
        view.unmount();
    });
});
