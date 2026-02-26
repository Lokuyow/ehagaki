import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    calculateImageDisplaySize,
    parseDimString,
    getPlaceholderDefaultSize,
    checkMoveThreshold,
    shouldPreventInteraction,
} from '../../lib/utils/editorImageUtils';
import {
    hasImageInDoc,
    hasVideoInDoc,
    hasMediaInDoc
} from '../../lib/editor/editorDomActions.svelte';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

/**
 * エディター・メディア統合テスト
 * 画像・動画の処理、サイズ計算、blurhash、メディア検出などの統合フロー
 */
describe('エディター・メディア統合テスト', () => {
    describe('画像サイズ計算統合', () => {
        it('元画像→表示サイズ計算→アスペクト比保持のフローが動作すること', () => {
            // 1. 元画像サイズを取得
            const originalWidth = 1920;
            const originalHeight = 1080;

            // 2. 表示サイズを計算（アスペクト比を維持）
            const result = calculateImageDisplaySize(originalWidth, originalHeight);

            // 3. エディター制約内に収まっている
            expect(result.displayWidth).toBeLessThanOrEqual(780);
            expect(result.displayHeight).toBeLessThanOrEqual(240);

            // 4. アスペクト比が保持されている
            const originalRatio = originalWidth / originalHeight;
            const displayRatio = result.displayWidth / result.displayHeight;
            expect(Math.abs(originalRatio - displayRatio)).toBeLessThan(0.01);
        });

        it('小さい画像はそのままのサイズで表示されること', () => {
            const width = 400;
            const height = 200;

            const result = calculateImageDisplaySize(width, height);

            // 制約内なので元サイズと同じ
            expect(result.width).toBe(width);
            expect(result.height).toBe(height);
            expect(result.displayWidth).toBe(width);
            expect(result.displayHeight).toBe(height);
        });

        it('幅が制約を超える場合の完全なフローが動作すること', () => {
            // 幅が非常に広い画像（パノラマなど）
            const originalWidth = 3000;
            const originalHeight = 500;

            const result = calculateImageDisplaySize(originalWidth, originalHeight);

            // 幅が制約の780pxに収まる
            expect(result.displayWidth).toBe(780);
            // 高さもアスペクト比を保って調整される
            expect(result.displayHeight).toBe(Math.round(780 / (originalWidth / originalHeight)));
        });

        it('高さが制約を超える場合の完全なフローが動作すること', () => {
            // 縦長の画像
            const originalWidth = 500;
            const originalHeight = 1000;

            const result = calculateImageDisplaySize(originalWidth, originalHeight);

            // 高さが制約の240pxに収まる
            expect(result.displayHeight).toBe(240);
            // 幅もアスペクト比を保って調整される
            expect(result.displayWidth).toBe(Math.round(240 * (originalWidth / originalHeight)));
        });
    });

    describe('dim文字列パース統合', () => {
        it('dim文字列→パース→サイズ計算のフローが動作すること', () => {
            // 1. 画像のdim文字列を取得（imeタグから）
            const dimString = '1920x1080';

            // 2. dim文字列をパース
            const parsed = parseDimString(dimString);
            expect(parsed).not.toBeNull();
            expect(parsed!.width).toBe(1920);
            expect(parsed!.height).toBe(1080);

            // 3. パースしたサイズで表示サイズを計算
            const displaySize = calculateImageDisplaySize(parsed!.width, parsed!.height);
            expect(displaySize.displayWidth).toBeLessThanOrEqual(780);
            expect(displaySize.displayHeight).toBeLessThanOrEqual(240);
        });

        it('無効なdim文字列は安全に処理されること', () => {
            const invalidDims = ['invalid', '123', 'x1080', '1920x', '', undefined];

            for (const dim of invalidDims) {
                const parsed = parseDimString(dim);
                expect(parsed).toBeNull();
            }
        });

        it('様々なサイズのdim文字列が正しくパースされること', () => {
            const testCases = [
                { dim: '640x480', width: 640, height: 480 },
                { dim: '1920x1080', width: 1920, height: 1080 },
                { dim: '3840x2160', width: 3840, height: 2160 },
                { dim: '100x100', width: 100, height: 100 }
            ];

            for (const testCase of testCases) {
                const parsed = parseDimString(testCase.dim);
                expect(parsed).toEqual({ width: testCase.width, height: testCase.height });
            }
        });
    });

    describe('プレースホルダー処理統合', () => {
        it('プレースホルダー生成→サイズ取得→表示のフローが動作すること', () => {
            // 1. プレースホルダーのデフォルトサイズを取得
            const placeholderSize = getPlaceholderDefaultSize();

            expect(placeholderSize).toEqual({
                width: 200,
                height: 150,
                displayWidth: 200,
                displayHeight: 150
            });

            // 2. プレースホルダーサイズは制約内に収まる
            expect(placeholderSize.displayWidth).toBeLessThanOrEqual(780);
            expect(placeholderSize.displayHeight).toBeLessThanOrEqual(240);
        });

        it('プレースホルダー→実画像へのサイズ更新フローが動作すること', () => {
            // 1. 最初はプレースホルダー
            const placeholderSize = getPlaceholderDefaultSize();
            expect(placeholderSize.width).toBe(200);

            // 2. 実際の画像サイズを取得
            const actualDim = parseDimString('1920x1080');
            expect(actualDim).not.toBeNull();

            // 3. 実画像のサイズを計算
            const actualSize = calculateImageDisplaySize(actualDim!.width, actualDim!.height);

            // 4. サイズが更新された（プレースホルダーとは異なる）
            expect(actualSize.width).not.toBe(placeholderSize.width);
            expect(actualSize.height).not.toBe(placeholderSize.height);
        });
    });

    describe('ドラッグ操作統合', () => {
        it('ドラッグ開始→移動距離チェック→ドラッグ確定のフローが動作すること', () => {
            // 1. ドラッグ開始位置
            const startX = 100;
            const startY = 100;

            // 2. わずかな移動（閾値未満）
            const smallMoveX = 105;
            const smallMoveY = 103;
            const isSmallMove = checkMoveThreshold(smallMoveX, smallMoveY, startX, startY, 10);
            expect(isSmallMove).toBe(false); // ドラッグとみなさない

            // 3. 大きな移動（閾値以上）
            const largeMoveX = 120;
            const largeMoveY = 120;
            const isLargeMove = checkMoveThreshold(largeMoveX, largeMoveY, startX, startY, 10);
            expect(isLargeMove).toBe(true); // ドラッグ開始
        });

        it('様々な閾値でのドラッグ判定が正しく動作すること', () => {
            const startX = 0;
            const startY = 0;

            // 閾値10pxの場合
            expect(checkMoveThreshold(9, 0, startX, startY, 10)).toBe(false);
            expect(checkMoveThreshold(10, 0, startX, startY, 10)).toBe(false);
            expect(checkMoveThreshold(11, 0, startX, startY, 10)).toBe(true);

            // 閾値20pxの場合
            expect(checkMoveThreshold(19, 0, startX, startY, 20)).toBe(false);
            expect(checkMoveThreshold(21, 0, startX, startY, 20)).toBe(true);
        });
    });

    describe('インタラクション防止統合', () => {
        it('ドラッグ中はクリックやフォーカスが防止されること', () => {
            // ドラッグ中
            const isDragging = true;
            const result = shouldPreventInteraction(isDragging, false, false, false);
            expect(result).toBe(true);
        });

        it('プレースホルダー画像はインタラクションが防止されること', () => {
            // プレースホルダー状態
            const isPlaceholder = true;
            const result = shouldPreventInteraction(false, isPlaceholder, false, false);
            expect(result).toBe(true);
        });

        it('画像選択直後（非タッチ）はインタラクションが防止されること', () => {
            // 選択直後かつ非タッチデバイス
            const justSelected = true;
            const isTouch = false;
            const result = shouldPreventInteraction(false, false, justSelected, isTouch);
            expect(result).toBe(true);
        });

        it('タッチデバイスでは選択直後でもインタラクション可能なこと', () => {
            // 選択直後だがタッチデバイス
            const justSelected = true;
            const isTouch = true;
            const result = shouldPreventInteraction(false, false, justSelected, isTouch);
            expect(result).toBe(false);
        });

        it('通常状態ではインタラクション可能なこと', () => {
            const result = shouldPreventInteraction(false, false, false, false);
            expect(result).toBe(false);
        });

        it('複数の状態が同時に発生した場合の優先順位が正しいこと', () => {
            // ドラッグ中かつプレースホルダー
            expect(shouldPreventInteraction(true, true, false, false)).toBe(true);

            // ドラッグ中かつ選択直後
            expect(shouldPreventInteraction(true, false, true, false)).toBe(true);

            // プレースホルダーかつ選択直後
            expect(shouldPreventInteraction(false, true, true, false)).toBe(true);
        });
    });

    describe('メディア検出統合', () => {
        it('null/undefinedのドキュメントは安全に処理されること', () => {
            expect(hasImageInDoc(null)).toBe(false);
            expect(hasImageInDoc(undefined)).toBe(false);
            expect(hasVideoInDoc(null)).toBe(false);
            expect(hasVideoInDoc(undefined)).toBe(false);
            expect(hasMediaInDoc(null)).toBe(false);
            expect(hasMediaInDoc(undefined)).toBe(false);
        });
    });

    describe('複合メディア処理統合', () => {
        it('複数画像のサイズ計算が個別に正しく動作すること', () => {
            const images = [
                { dim: '1920x1080' },
                { dim: '640x480' },
                { dim: '3840x2160' }
            ];

            const sizes = images.map(img => {
                const parsed = parseDimString(img.dim);
                return calculateImageDisplaySize(parsed!.width, parsed!.height);
            });

            // すべての画像が制約内に収まる
            sizes.forEach(size => {
                expect(size.displayWidth).toBeLessThanOrEqual(780);
                expect(size.displayHeight).toBeLessThanOrEqual(240);
            });

            // それぞれ異なるサイズになる
            expect(sizes[0].displayWidth).not.toBe(sizes[1].displayWidth);
            expect(sizes[1].displayWidth).not.toBe(sizes[2].displayWidth);
        });

        it('Twitter画像のペースト→サイズ計算→表示のフローが動作すること', () => {
            // Twitterの一般的な画像サイズ
            const twitterImageDim = '1200x675';

            const parsed = parseDimString(twitterImageDim);
            expect(parsed).not.toBeNull();

            const displaySize = calculateImageDisplaySize(parsed!.width, parsed!.height);

            // エディター制約内に収まる
            expect(displaySize.displayWidth).toBeLessThanOrEqual(780);
            expect(displaySize.displayHeight).toBeLessThanOrEqual(240);

            // アスペクト比16:9を維持
            const ratio = displaySize.displayWidth / displaySize.displayHeight;
            expect(Math.abs(ratio - (16 / 9))).toBeLessThan(0.1);
        });

        it('Instagram画像のペースト→サイズ計算→表示のフローが動作すること', () => {
            // Instagramの正方形画像
            const instagramImageDim = '1080x1080';

            const parsed = parseDimString(instagramImageDim);
            const displaySize = calculateImageDisplaySize(parsed!.width, parsed!.height);

            // 正方形が維持される
            expect(displaySize.displayWidth).toBe(displaySize.displayHeight);
            expect(displaySize.displayWidth).toBeLessThanOrEqual(780);
        });

        it('スクリーンショットのペースト→検出→表示のフローが動作すること', () => {
            // 4K解像度のスクリーンショット
            const screenshotDim = '3840x2160';

            const parsed = parseDimString(screenshotDim);
            const displaySize = calculateImageDisplaySize(parsed!.width, parsed!.height);

            // 大きく縮小されるが、アスペクト比は維持
            expect(displaySize.displayWidth).toBeLessThanOrEqual(780);
            expect(displaySize.displayHeight).toBeLessThanOrEqual(240);

            const originalRatio = 3840 / 2160;
            const displayRatio = displaySize.displayWidth / displaySize.displayHeight;
            expect(Math.abs(originalRatio - displayRatio)).toBeLessThan(0.01);
        });
    });
});
