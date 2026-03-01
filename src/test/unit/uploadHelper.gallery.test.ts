/**
 * uploadHelper.gallery.test.ts
 *
 * ギャラリーモードにおけるアップロード中止動作のテスト。
 * 特に「アップロード完了後に中止フラグが立っている場合、
 * ギャラリーのプレースホルダーが削除されること」を検証する。
 *
 * Note: placeholderManager は全体モックのため、uploadHelper.test.ts とは
 * 別ファイルに分離している（vi.mock はファイル単位で適用されるため）。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------- placeholderManager を全体モック ----------
// vi.mockは巧き上げされるため、内部で使う変数はvi.hoistedで宣言する
const {
    mockInsertPlaceholdersIntoGallery,
    mockInsertPlaceholdersIntoEditor,
    mockGenerateBlurhashes,
    mockReplacePlaceholdersInGallery,
    mockRemoveAllGalleryPlaceholders,
} = vi.hoisted(() => ({
    mockInsertPlaceholdersIntoGallery: vi.fn(),
    mockInsertPlaceholdersIntoEditor: vi.fn(),
    mockGenerateBlurhashes: vi.fn(),
    mockReplacePlaceholdersInGallery: vi.fn(),
    mockRemoveAllGalleryPlaceholders: vi.fn(),
}));

vi.mock('../../lib/editor/placeholderManager', () => ({
    insertPlaceholdersIntoGallery: mockInsertPlaceholdersIntoGallery,
    insertPlaceholdersIntoEditor: mockInsertPlaceholdersIntoEditor,
    generateBlurhashes: mockGenerateBlurhashes,
    replacePlaceholdersInGallery: mockReplacePlaceholdersInGallery,
    replacePlaceholdersWithResults: vi.fn(async () => ({ failedResults: [], errorMessage: '' })),
    removeAllGalleryPlaceholders: mockRemoveAllGalleryPlaceholders,
}));

vi.mock('../../stores/tagsStore.svelte', () => ({
    imageSizeMapStore: { update: vi.fn() },
}));

vi.mock('../../lib/fileUploadManager', () => ({
    FileUploadManager: vi.fn(),
}));

vi.mock('../../lib/utils/editorUtils', () => ({
    removeAllPlaceholders: vi.fn(),
    findAndExecuteOnNode: vi.fn(),
    updateImageSizeMap: vi.fn(),
}));

vi.mock('../../lib/tags/imetaTag', () => ({
    extractImageBlurhashMap: vi.fn(() => ({})),
    getMimeTypeFromUrl: vi.fn(() => 'image/png'),
    calculateImageHash: vi.fn(async () => 'xhash'),
    createImetaTag: vi.fn(async () => ['imeta-tag']),
}));

vi.mock('svelte', () => ({ tick: vi.fn() }));

// ---------- 依存関係 ----------
import { uploadHelper } from '../../lib/uploadHelper';
import { uploadAbortFlagStore, mediaFreePlacementStore } from '../../stores/appStore.svelte';
import { removeAllPlaceholders } from '../../lib/utils/editorUtils';
import type {
    UploadHelperDependencies,
    FileUploadManagerInterface,
    FileUploadDependencies,
    AuthService,
    CompressionService,
    MimeTypeSupportInterface,
    PlaceholderEntry,
} from '../../lib/types';

// ---------- ヘルパー ----------

/** アップロード完了時に中止フラグを立てる FileUploadManager モックを含む依存関係を生成 */
function createDeps(
    onUpload: () => void = () => {}
): UploadHelperDependencies {
    const mockFUM: FileUploadManagerInterface = {
        validateImageFile: vi.fn(() => ({ isValid: true })),
        validateMediaFile: vi.fn(() => ({ isValid: true })),
        generateBlurhashForFile: vi.fn(async () => 'blurhash'),
        uploadFileWithCallbacks: vi.fn(async (file: File) => {
            onUpload();
            return {
                success: true,
                url: `https://mock.com/${file.name}`,
                sizeInfo: {
                    originalFilename: file.name,
                    originalSize: file.size,
                    compressedSize: file.size,
                    wasCompressed: false,
                    compressionRatio: 1,
                    sizeReduction: '0%',
                },
            };
        }),
        uploadMultipleFilesWithCallbacks: vi.fn(),
    };

    return {
        localStorage: {
            getItem: vi.fn(() => 'https://endpoint'),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            length: 0,
        } as Storage,
        crypto: {
            digest: vi.fn(async () => new Uint8Array([1, 2, 3]).buffer),
        } as unknown as SubtleCrypto,
        tick: vi.fn(),
        FileUploadManager: vi.fn(
            (
                _deps?: FileUploadDependencies,
                _auth?: AuthService,
                _compression?: CompressionService,
                _mime?: MimeTypeSupportInterface
            ) => mockFUM
        ) as unknown as new (
            deps?: FileUploadDependencies,
            auth?: AuthService,
            compression?: CompressionService,
            mime?: MimeTypeSupportInterface
        ) => FileUploadManagerInterface,
        getImageDimensions: vi.fn(async () => ({
            width: 100,
            height: 100,
            displayWidth: 100,
            displayHeight: 100,
        })),
        extractImageBlurhashMap: vi.fn(() => ({})),
        calculateImageHash: vi.fn(async () => 'xhash'),
        getMimeTypeFromUrl: vi.fn(() => 'image/png'),
        createImetaTag: vi.fn(async () => ['imeta-tag']),
        imageSizeMapStore: { update: vi.fn() },
    };
}

// ---------- テスト ----------

describe('uploadHelper - ギャラリーモードの中止動作', () => {
    // uploadAbortFlagStore.value を動的に制御するための変数
    let abortFlagValue = false;

    const mockPlaceholderMap: PlaceholderEntry[] = [
        {
            placeholderId: 'ph-1',
            file: new File(['content'], 'test.png', { type: 'image/png' }),
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        abortFlagValue = false;

        // ギャラリーモード（mediaFreePlacementStore.value = false）に設定
        (mediaFreePlacementStore as any).value = false;

        // uploadAbortFlagStore.value を動的ゲッターで上書き
        Object.defineProperty(uploadAbortFlagStore, 'value', {
            get: () => abortFlagValue,
            configurable: true,
        });
        (uploadAbortFlagStore as any).reset = vi.fn(() => {
            abortFlagValue = false;
        });

        // placeholderManager モックの初期設定
        mockInsertPlaceholdersIntoGallery.mockReturnValue(mockPlaceholderMap);
        mockInsertPlaceholdersIntoEditor.mockReturnValue([]);
        mockGenerateBlurhashes.mockResolvedValue(undefined);
        mockReplacePlaceholdersInGallery.mockResolvedValue({ failedResults: [], errorMessage: '' });
    });

    afterEach(() => {
        // エディタモードに戻す
        (mediaFreePlacementStore as any).value = true;
        // value を false に戻す
        Object.defineProperty(uploadAbortFlagStore, 'value', {
            value: false,
            writable: true,
            configurable: true,
        });
    });

    describe('アップロード完了後に中止フラグが立っている場合', () => {
        it('ギャラリーモードでは removeAllGalleryPlaceholders が呼ばれる', async () => {
            const file = new File(['content'], 'test.png', { type: 'image/png' });
            // アップロード完了と同時に中止フラグを立てる
            const deps = createDeps(() => {
                abortFlagValue = true;
            });

            await uploadHelper({
                files: [file],
                currentEditor: null,
                showUploadError: vi.fn(),
                updateUploadState: vi.fn(),
                devMode: false,
                dependencies: deps,
            });

            expect(mockRemoveAllGalleryPlaceholders).toHaveBeenCalledOnce();
            expect(mockRemoveAllGalleryPlaceholders).toHaveBeenCalledWith(
                mockPlaceholderMap,
                deps.imageSizeMapStore
            );
        });

        it('ギャラリーモードでは removeAllPlaceholders（エディタ用）は呼ばれない', async () => {
            const file = new File(['content'], 'test.png', { type: 'image/png' });
            const deps = createDeps(() => {
                abortFlagValue = true;
            });

            await uploadHelper({
                files: [file],
                currentEditor: null,
                showUploadError: vi.fn(),
                updateUploadState: vi.fn(),
                devMode: false,
                dependencies: deps,
            });

            expect(removeAllPlaceholders).not.toHaveBeenCalled();
        });

        it('戻り値の results が null で placeholderMap が空になる', async () => {
            const file = new File(['content'], 'test.png', { type: 'image/png' });
            const deps = createDeps(() => {
                abortFlagValue = true;
            });

            const result = await uploadHelper({
                files: [file],
                currentEditor: null,
                showUploadError: vi.fn(),
                updateUploadState: vi.fn(),
                devMode: false,
                dependencies: deps,
            });

            expect(result.results).toBeNull();
            expect(result.placeholderMap).toHaveLength(0);
            expect(result.errorMessage).toBe('Upload aborted by user');
        });
    });

    describe('中止フラグが最初から立っていない（正常系）', () => {
        it('正常完了時は removeAllGalleryPlaceholders が呼ばれない', async () => {
            const file = new File(['content'], 'test.png', { type: 'image/png' });
            // abortFlagValue = false のまま（中止しない）
            const deps = createDeps();

            await uploadHelper({
                files: [file],
                currentEditor: null,
                showUploadError: vi.fn(),
                updateUploadState: vi.fn(),
                devMode: false,
                dependencies: deps,
            });

            expect(mockRemoveAllGalleryPlaceholders).not.toHaveBeenCalled();
        });
    });
});
