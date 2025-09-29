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

    it('calculateViewportInfo returns correct offsets', () => {
        div.getBoundingClientRect = vi.fn(() => ({
            left: 10, top: 20, width: 200, height: 100, right: 210, bottom: 120
        })) as any;
        const result = calculateViewportInfo(div, 60, 70);
        expect(result.centerX).toBe(100);
        expect(result.centerY).toBe(50);
        expect(result.offsetX).toBe(60 - 10 - 100);
        expect(result.offsetY).toBe(70 - 20 - 50);
    });

    it('calculateDragDelta returns correct delta', () => {
        expect(calculateDragDelta({ x: 10, y: 20 }, { x: 5, y: 15 })).toEqual({ x: 5, y: 5 });
    });

    it('calculateZoomFromEvent returns correct zoom params', () => {
        div.getBoundingClientRect = vi.fn(() => ({
            left: 10, top: 20, width: 200, height: 100
        })) as any;
        const event = { clientX: 60, clientY: 70 } as MouseEvent;
        const result = calculateZoomFromEvent(event, div, 2);
        expect(result.scale).toBe(2);
        expect(result.offsetX).toBe(60 - 10 - 100);
        expect(result.offsetY).toBe(70 - 20 - 50);
    });

    it('setImageContainerStyle sets style properties', () => {
        setImageContainerStyle({ scale: 2, translate: { x: 10, y: 20 }, useTransition: true }, div);
        expect(div.style.transform).toContain('scale(2)');
        expect(div.style.transition).toContain('transform');
    });

    it('setImageContainerTransformDirect sets style properties', () => {
        setImageContainerTransformDirect(2, 10, 20, div);
        expect(div.style.transform).toContain('scale(2)');
        expect(div.style.transition).toBe('none');
    });

    it('setImageCursorByScale sets cursor style', () => {
        setImageCursorByScale(1, div);
        expect(div.style.cursor).toBe('default');
        setImageCursorByScale(2, div);
        expect(div.style.cursor).toBe('grab');
    });

    it('setOverlayCursorByScale sets cursor style', () => {
        div.className = 'fullscreen-overlay';
        setOverlayCursorByScale(1, div);
        expect(div.style.cursor).toBe('default');
        setOverlayCursorByScale(2, div);
        expect(div.style.cursor).toBe('grab');
    });

    it('setBodyUserSelect sets body style', () => {
        setBodyUserSelect(false);
        expect(document.body.style.userSelect).toBe('none');
        setBodyUserSelect(true);
        expect(document.body.style.userSelect).toBe('');
    });

    it('clearTapTimer clears timeout', () => {
        const id = window.setTimeout(() => { }, 1000);
        clearTapTimer(id);
        // No error means pass
    });

    it('handleTap detects double tap', () => {
        let called = false;
        const cb = () => { called = true; };
        const now = Date.now();
        const result = handleTap(now - 100, { x: 10, y: 10 }, 1, 12, 12, true, cb);
        expect(result.isDoubleTap).toBe(true);
        expect(called).toBe(true);
    });

    it('handlePointerStart returns correct dragState', () => {
        const cb = vi.fn();
        const result = handlePointerStart(2, { x: 0, y: 0 }, {}, 0, null, null, 10, 10, false, cb);
        expect(result.newDragState.start).toEqual({ x: 10, y: 10 });
    });

    it('handlePointerMove triggers drag', () => {
        const onStartDrag = vi.fn();
        const onUpdateDrag = vi.fn();
        const dragState = { start: { x: 0, y: 0 }, isDragging: false };
        const result = handlePointerMove(dragState, 100, 100, true, 10, 2, onStartDrag, onUpdateDrag);
        expect(result.touchMoved).toBe(true);
    });

    it('handlePointerEnd calls onStopDrag', () => {
        const cb = vi.fn();
        handlePointerEnd({}, false, Date.now(), false, cb);
        expect(cb).toHaveBeenCalled();
    });
});
