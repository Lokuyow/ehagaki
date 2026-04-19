import { describe, expect, it } from 'vitest';

import {
    canScrollElementVerticallyWithWheel,
    consumeMediaGalleryWheelScroll,
    resolveMediaGalleryWheelDelta,
} from '../../lib/utils/mediaGalleryWheelUtils';

function createGalleryElement(params: {
    scrollLeft: number;
    scrollWidth: number;
    clientWidth: number;
}) {
    return {
        scrollLeft: params.scrollLeft,
        scrollWidth: params.scrollWidth,
        clientWidth: params.clientWidth,
    } as Pick<HTMLElement, 'scrollLeft' | 'scrollWidth' | 'clientWidth'>;
}

function createVerticalScrollElement(params: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}) {
    return {
        scrollTop: params.scrollTop,
        scrollHeight: params.scrollHeight,
        clientHeight: params.clientHeight,
    } as Pick<HTMLElement, 'scrollTop' | 'scrollHeight' | 'clientHeight'>;
}

describe('mediaGalleryWheelUtils', () => {
    it('deltaX が優勢なときは水平入力を優先する', () => {
        expect(
            resolveMediaGalleryWheelDelta({
                deltaX: 64,
                deltaY: 18,
            }),
        ).toBe(64);
    });

    it('composer scroll region がスクロール可能な間はギャラリーがホイールを消費しない', () => {
        const gallery = createGalleryElement({
            scrollLeft: 48,
            scrollWidth: 720,
            clientWidth: 240,
        });
        const composerScrollRegion = createVerticalScrollElement({
            scrollTop: 120,
            scrollHeight: 1200,
            clientHeight: 400,
        });

        const consumed = consumeMediaGalleryWheelScroll(
            gallery,
            { deltaX: 0, deltaY: 96 },
            composerScrollRegion,
        );

        expect(consumed).toBe(false);
        expect(gallery.scrollLeft).toBe(48);
    });

    it('composer scroll region が下端なら縦ホイールを横スクロールへ変換する', () => {
        const gallery = createGalleryElement({
            scrollLeft: 24,
            scrollWidth: 720,
            clientWidth: 240,
        });
        const composerScrollRegion = createVerticalScrollElement({
            scrollTop: 800,
            scrollHeight: 1200,
            clientHeight: 400,
        });

        const consumed = consumeMediaGalleryWheelScroll(
            gallery,
            { deltaX: 0, deltaY: 96 },
            composerScrollRegion,
        );

        expect(consumed).toBe(true);
        expect(gallery.scrollLeft).toBe(120);
    });

    it('横オーバーフローがなければホイールを消費しない', () => {
        const gallery = createGalleryElement({
            scrollLeft: 0,
            scrollWidth: 240,
            clientWidth: 240,
        });

        const consumed = consumeMediaGalleryWheelScroll(gallery, {
            deltaX: 0,
            deltaY: 96,
        });

        expect(consumed).toBe(false);
        expect(gallery.scrollLeft).toBe(0);
    });

    it('wheel の deltaY は下方向スクロール判定に合わせて解釈する', () => {
        expect(
            canScrollElementVerticallyWithWheel(
                createVerticalScrollElement({
                    scrollTop: 120,
                    scrollHeight: 1200,
                    clientHeight: 400,
                }),
                60,
            ),
        ).toBe(true);

        expect(
            canScrollElementVerticallyWithWheel(
                createVerticalScrollElement({
                    scrollTop: 800,
                    scrollHeight: 1200,
                    clientHeight: 400,
                }),
                60,
            ),
        ).toBe(false);
    });
});