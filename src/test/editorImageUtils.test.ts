import {
    calculateImageDisplaySize,
    parseDimString,
    getPlaceholderDefaultSize,
    checkMoveThreshold,
    shouldPreventInteraction,
    validateBlurhashParams,
    setupCanvas,
} from '../lib/utils/editorImageUtils';

describe('calculateImageDisplaySize', () => {
    it('制約内なら元サイズを返す', () => {
        const result = calculateImageDisplaySize(100, 100, 200, 200);
        expect(result).toEqual({
            width: 100,
            height: 100,
            displayWidth: 100,
            displayHeight: 100
        });
    });

    it('幅が制約を超える場合はmaxWidthに合わせる', () => {
        const result = calculateImageDisplaySize(1000, 100, 500, 500);
        expect(result.displayWidth).toBe(500);
        expect(result.displayHeight).toBe(Math.round(500 / 10));
    });

    it('高さが制約を超える場合はmaxHeightに合わせる', () => {
        const result = calculateImageDisplaySize(100, 1000, 500, 500);
        expect(result.displayHeight).toBe(500);
        expect(result.displayWidth).toBe(Math.round(500 * (100 / 1000)));
    });
});

describe('parseDimString', () => {
    it('正しいdim文字列をパースできる', () => {
        expect(parseDimString('1920x1080')).toEqual({ width: 1920, height: 1080 });
    });
    it('不正な文字列はnull', () => {
        expect(parseDimString('abc')).toBeNull();
        expect(parseDimString(undefined)).toBeNull();
    });
});

describe('getPlaceholderDefaultSize', () => {
    it('デフォルトサイズを返す', () => {
        expect(getPlaceholderDefaultSize()).toEqual({
            width: 200,
            height: 150,
            displayWidth: 200,
            displayHeight: 150
        });
    });
});

describe('checkMoveThreshold', () => {
    it('閾値未満ならfalse', () => {
        expect(checkMoveThreshold(10, 10, 0, 0, 20)).toBe(false);
    });
    it('閾値以上ならtrue', () => {
        expect(checkMoveThreshold(30, 0, 0, 0, 20)).toBe(true);
    });
});

describe('shouldPreventInteraction', () => {
    it('ドラッグ中はtrue', () => {
        expect(shouldPreventInteraction(true, false, false, false)).toBe(true);
    });
    it('プレースホルダーはtrue', () => {
        expect(shouldPreventInteraction(false, true, false, false)).toBe(true);
    });
    it('justSelectedかつ非タッチはtrue', () => {
        expect(shouldPreventInteraction(false, false, true, false)).toBe(true);
    });
    it('通常はfalse', () => {
        expect(shouldPreventInteraction(false, false, false, false)).toBe(false);
    });
});

describe('validateBlurhashParams', () => {
    it('blurhash, canvas, dimensionsが揃っていればtrue', () => {
        const canvas = document.createElement('canvas');
        expect(validateBlurhashParams('abc', canvas, { displayWidth: 10, displayHeight: 10 })).toBe(true);
    });
    it('blurhashが空ならfalse', () => {
        const canvas = document.createElement('canvas');
        expect(validateBlurhashParams('', canvas, { displayWidth: 10, displayHeight: 10 })).toBe(false);
    });
    it('canvasがnullならfalse', () => {
        expect(validateBlurhashParams('abc', null as any, { displayWidth: 10, displayHeight: 10 })).toBe(false);
    });
    it('dimensionsが0ならfalse', () => {
        const canvas = document.createElement('canvas');
        expect(validateBlurhashParams('abc', canvas, { displayWidth: 0, displayHeight: 0 })).toBe(false);
    });
});

describe('setupCanvas', () => {
    it('canvasのサイズをセットする', () => {
        const canvas = document.createElement('canvas');
        setupCanvas(canvas, { displayWidth: 123, displayHeight: 456 });
        expect(canvas.width).toBe(123);
        expect(canvas.height).toBe(456);
    });
});
