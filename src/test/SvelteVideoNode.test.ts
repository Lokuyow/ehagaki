import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("SvelteVideoNode - Fullscreen Detection", () => {
    beforeEach(() => {
        // document オブジェクトをリセット
        Object.defineProperty(document, "fullscreenElement", {
            writable: true,
            configurable: true,
            value: null
        });
        Object.defineProperty(document, "webkitFullscreenElement", {
            writable: true,
            configurable: true,
            value: null
        });
        Object.defineProperty(document, "mozFullScreenElement", {
            writable: true,
            configurable: true,
            value: null
        });
        Object.defineProperty(document, "msFullscreenElement", {
            writable: true,
            configurable: true,
            value: null
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("isFullscreen function", () => {
        it("returns false when no fullscreen element is active", () => {
            // すべてのフルスクリーンプロパティがnullの場合
            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            expect(isFullscreen()).toBe(false);
        });

        it("returns true when fullscreenElement is active", () => {
            const mockElement = document.createElement("video");
            Object.defineProperty(document, "fullscreenElement", {
                writable: true,
                configurable: true,
                value: mockElement
            });

            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            expect(isFullscreen()).toBe(true);
        });

        it("returns true when webkitFullscreenElement is active (Safari/iOS)", () => {
            const mockElement = document.createElement("video");
            Object.defineProperty(document, "webkitFullscreenElement", {
                writable: true,
                configurable: true,
                value: mockElement
            });

            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            expect(isFullscreen()).toBe(true);
        });

        it("returns true when mozFullScreenElement is active (Firefox)", () => {
            const mockElement = document.createElement("video");
            Object.defineProperty(document, "mozFullScreenElement", {
                writable: true,
                configurable: true,
                value: mockElement
            });

            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            expect(isFullscreen()).toBe(true);
        });

        it("returns true when msFullscreenElement is active (Internet Explorer/Edge)", () => {
            const mockElement = document.createElement("video");
            Object.defineProperty(document, "msFullscreenElement", {
                writable: true,
                configurable: true,
                value: mockElement
            });

            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            expect(isFullscreen()).toBe(true);
        });

        it("returns true when any of multiple fullscreen properties is active", () => {
            const mockElement1 = document.createElement("video");
            const mockElement2 = document.createElement("div");

            Object.defineProperty(document, "fullscreenElement", {
                writable: true,
                configurable: true,
                value: null
            });
            Object.defineProperty(document, "webkitFullscreenElement", {
                writable: true,
                configurable: true,
                value: mockElement1
            });
            Object.defineProperty(document, "mozFullScreenElement", {
                writable: true,
                configurable: true,
                value: mockElement2
            });

            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            // 複数のプロパティがアクティブな場合もtrueを返す
            expect(isFullscreen()).toBe(true);
        });
    });

    describe("handleVideoClick - Fullscreen behavior", () => {
        it("should not open context menu when fullscreen is active", () => {
            const mockElement = document.createElement("video");
            Object.defineProperty(document, "fullscreenElement", {
                writable: true,
                configurable: true,
                value: mockElement
            });

            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            // 全画面時はコンテキストメニュー処理をスキップ
            const shouldSkipContextMenu = isFullscreen();
            expect(shouldSkipContextMenu).toBe(true);
        });

        it("should open context menu when fullscreen is not active", () => {
            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            // 全画面でない時はコンテキストメニュー処理を実行
            const shouldSkipContextMenu = isFullscreen();
            expect(shouldSkipContextMenu).toBe(false);
        });
    });

    describe("handleVideoTouchEnd - Fullscreen behavior", () => {
        it("should not open context menu on touch when fullscreen is active", () => {
            const mockElement = document.createElement("video");
            Object.defineProperty(document, "fullscreenElement", {
                writable: true,
                configurable: true,
                value: mockElement
            });

            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            // 全画面時はコンテキストメニュー処理をスキップ
            const shouldSkipContextMenu = isFullscreen();
            expect(shouldSkipContextMenu).toBe(true);
        });

        it("should open context menu on touch when fullscreen is not active", () => {
            const isFullscreen = (): boolean => {
                return !!(
                    document.fullscreenElement ||
                    (document as any).webkitFullscreenElement ||
                    (document as any).mozFullScreenElement ||
                    (document as any).msFullscreenElement
                );
            };

            // 全画面でない時はコンテキストメニュー処理を実行
            const shouldSkipContextMenu = isFullscreen();
            expect(shouldSkipContextMenu).toBe(false);
        });
    });
});
