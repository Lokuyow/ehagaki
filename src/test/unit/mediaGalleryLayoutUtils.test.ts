import { describe, expect, it } from "vitest";

import {
    DEFAULT_MEDIA_GALLERY_LAYOUT,
    MIN_EDITOR_HEIGHT_WHEN_KEYBOARD_OPEN,
    resolveMediaGalleryLayout,
} from "../../lib/mediaGalleryLayoutUtils";

describe("mediaGalleryLayoutUtils", () => {
    describe("resolveMediaGalleryLayout", () => {
        it("キーボードが閉じている時は通常サイズを返す", () => {
            expect(
                resolveMediaGalleryLayout({
                    keyboardOpen: false,
                    containerHeight: 120,
                }),
            ).toEqual(DEFAULT_MEDIA_GALLERY_LAYOUT);
        });

        it("キーボード表示中で高さ不明の時はコンパクト基準サイズを返す", () => {
            expect(
                resolveMediaGalleryLayout({
                    keyboardOpen: true,
                    containerHeight: null,
                }),
            ).toEqual({
                height: 96,
                minWidth: 72,
                maxWidth: 120,
                actionButtonSize: 40,
                copyButtonTop: 50,
            });
        });

        it("キーボード表示中はエディター用の最低高を残してギャラリーを縮める", () => {
            const layout = resolveMediaGalleryLayout({
                keyboardOpen: true,
                containerHeight: 130,
            });

            expect(layout).toEqual({
                height: 58,
                minWidth: 48,
                maxWidth: 73,
                actionButtonSize: 32,
                copyButtonTop: 20,
            });
            expect(layout.height).toBe(
                130 - MIN_EDITOR_HEIGHT_WHEN_KEYBOARD_OPEN,
            );
        });

        it("極端に狭い時もギャラリー最小高を維持する", () => {
            expect(
                resolveMediaGalleryLayout({
                    keyboardOpen: true,
                    containerHeight: 100,
                }),
            ).toEqual({
                height: 48,
                minWidth: 48,
                maxWidth: 60,
                actionButtonSize: 32,
                copyButtonTop: 10,
            });
        });
    });
});