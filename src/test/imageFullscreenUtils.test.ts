import {
    calculateViewportInfo,
    calculateDragDelta,
    calculateZoomFromEvent,
    setImageContainerStyle,
    setImageContainerTransformDirect,
    setImageCursorByScale,
    setOverlayCursorByScale,
    setBodyUserSelect,
    clearTapTimer,
    handleTap,
    handlePointerStart,
    handlePointerMove,
    handlePointerEnd
} from '../lib/utils/imageFullscreenUtils';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('imageFullscreenUtils', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        div.className = 'image-container';
        div.style.width = '200px';
        div.style.height = '100px';
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('calculateViewportInfo が正しいオフセットを返す', () => {
        div.getBoundingClientRect = vi.fn(() => ({
            left: 10, top: 20, width: 200, height: 100, right: 210, bottom: 120
        })) as any;
        const result = calculateViewportInfo(div, 60, 70);
        expect(result.centerX).toBe(100);
        expect(result.centerY).toBe(50);
        expect(result.offsetX).toBe(60 - 10 - 100);
        expect(result.offsetY).toBe(70 - 20 - 50);
    });

    it('calculateDragDelta が正しいデルタを返す', () => {
        expect(calculateDragDelta({ x: 10, y: 20 }, { x: 5, y: 15 })).toEqual({ x: 5, y: 5 });
    });

    it('calculateZoomFromEvent が正しいズームパラメータを返す', () => {
        div.getBoundingClientRect = vi.fn(() => ({
            left: 10, top: 20, width: 200, height: 100
        })) as any;
        const event = { clientX: 60, clientY: 70 } as MouseEvent;
        const result = calculateZoomFromEvent(event, div, 2);
        expect(result.scale).toBe(2);
        expect(result.offsetX).toBe(60 - 10 - 100);
        expect(result.offsetY).toBe(70 - 20 - 50);
    });

    it('setImageContainerStyle がスタイルプロパティを設定する', () => {
        setImageContainerStyle({ scale: 2, translate: { x: 10, y: 20 }, useTransition: true }, div);
        expect(div.style.transform).toContain('scale(2)');
        expect(div.style.transition).toContain('transform');
    });

    it('setImageContainerTransformDirect がスタイルプロパティを設定する', () => {
        setImageContainerTransformDirect(2, 10, 20, div);
        expect(div.style.transform).toContain('scale(2)');
        expect(div.style.transition).toBe('none');
    });

    it('setImageCursorByScale がカーソルスタイルを設定する', () => {
        setImageCursorByScale(1, div);
        expect(div.style.cursor).toBe('default');
        setImageCursorByScale(2, div);
        expect(div.style.cursor).toBe('grab');
    });

    it('setOverlayCursorByScale がカーソルスタイルを設定する', () => {
        div.className = 'fullscreen-overlay';
        setOverlayCursorByScale(1, div);
        expect(div.style.cursor).toBe('default');
        setOverlayCursorByScale(2, div);
        expect(div.style.cursor).toBe('grab');
    });

    it('setBodyUserSelect がボディスタイルを設定する', () => {
        setBodyUserSelect(false);
        expect(document.body.style.userSelect).toBe('none');
        setBodyUserSelect(true);
        expect(document.body.style.userSelect).toBe('');
    });

    it('clearTapTimer がタイムアウトをクリアする', () => {
        const id = window.setTimeout(() => { }, 1000);
        clearTapTimer(id);
        // No error means pass
    });

    it('handleTap がダブルタップを検知する', () => {
        let called = false;
        const cb = () => { called = true; };
        const now = Date.now();
        const result = handleTap(now - 100, { x: 10, y: 10 }, 1, 12, 12, true, cb);
        expect(result.isDoubleTap).toBe(true);
        expect(called).toBe(true);
    });

    it('handlePointerStart が正しいドラッグ状態を返す', () => {
        const cb = vi.fn();
        const result = handlePointerStart(2, { x: 0, y: 0 }, {}, 0, null, null, 10, 10, false, cb);
        expect(result.newDragState.start).toEqual({ x: 10, y: 10 });
    });

    it('handlePointerMove がドラッグをトリガーする', () => {
        const onStartDrag = vi.fn();
        const onUpdateDrag = vi.fn();
        const dragState = { start: { x: 0, y: 0 }, isDragging: false };
        const result = handlePointerMove(dragState, 100, 100, true, 10, 2, onStartDrag, onUpdateDrag);
        expect(result.touchMoved).toBe(true);
    });

    it('handlePointerEnd が onStopDrag を呼び出す', () => {
        const cb = vi.fn();
        handlePointerEnd({}, false, Date.now(), false, cb);
        expect(cb).toHaveBeenCalled();
    });

    it('clamp が範囲内の値を返す', async () => {
        const { clamp } = await import('../lib/utils/imageFullscreenUtils');
        expect(clamp(5, 1, 10)).toBe(5);
        expect(clamp(-1, 0, 10)).toBe(0);
        expect(clamp(20, 0, 10)).toBe(10);
    });

    it('isNearScale がしきい値内であれば true を返す', async () => {
        const { isNearScale } = await import('../lib/utils/imageFullscreenUtils');
        expect(isNearScale(1.05, 1, 0.1)).toBe(true);
        expect(isNearScale(1.2, 1, 0.1)).toBe(false);
    });

    it('calculateDistance が正しい値を返す', async () => {
        const { calculateDistance } = await import('../lib/utils/imageFullscreenUtils');
        const t1 = { clientX: 0, clientY: 0 } as Touch;
        const t2 = { clientX: 3, clientY: 4 } as Touch;
        expect(calculateDistance(t1, t2)).toBe(5);
    });

    it('calculatePinchZoomParams が正しいパラメータを返す', async () => {
        const { calculatePinchZoomParams } = await import('../lib/utils/imageFullscreenUtils');
        div.getBoundingClientRect = vi.fn(() => ({
            left: 10, top: 20, width: 200, height: 100
        })) as any;
        const result = calculatePinchZoomParams(1, 2, 60, 70, div);
        expect(result.scale).toBe(2);
        expect(result.offsetX).toBe(60 - 10 - 100);
        expect(result.offsetY).toBe(70 - 20 - 50);
    });

    it('calculatePinchZoom が正しい計算を返す', async () => {
        const { calculatePinchZoom } = await import('../lib/utils/imageFullscreenUtils');
        div.getBoundingClientRect = vi.fn(() => ({
            left: 10, top: 20, width: 200, height: 100
        })) as any;
        const result = calculatePinchZoom(1, { x: 0, y: 0 }, 2, 60, 70, div);
        expect(result.newScale).toBe(2);
        expect(typeof result.newTranslate.x).toBe('number');
        expect(typeof result.newTranslate.y).toBe('number');
    });

    it('getMousePosition が正しい座標を返す', async () => {
        const { getMousePosition } = await import('../lib/utils/imageFullscreenUtils');
        const event = { clientX: 123, clientY: 456 } as MouseEvent;
        expect(getMousePosition(event)).toEqual({ x: 123, y: 456 });
    });

    it('calculateElementCenter が正しい中心を返す', async () => {
        const { calculateElementCenter } = await import('../lib/utils/imageFullscreenUtils');
        const rect = { width: 200, height: 100 } as DOMRect;
        expect(calculateElementCenter(rect)).toEqual({ x: 100, y: 50 });
    });
});
