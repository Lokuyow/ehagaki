import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { uploadHelper, processFilesForUpload, insertPlaceholdersIntoEditor, prepareMetadataList } from "../lib/uploadHelper";
import type {
    UploadHelperDependencies,
    FileUploadManagerInterface,
    FileValidationResult,
    FileUploadDependencies,
    AuthService,
    CompressionService,
    MimeTypeSupportInterface
} from "../lib/types";
import { NodeSelection } from "prosemirror-state";

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

// appStoreのモック（PWA関連の依存関係を含む）
vi.mock("../stores/appStore.svelte.ts", () => ({
    // 必要な状態やストアのモック
}));

// imageSizeMapStoreをモック - パスを修正
vi.mock("../stores/tagsStore.svelte", () => ({
    imageSizeMapStore: {
        update: vi.fn()
    }
}));

// その他の依存関係をモック
vi.mock("../lib/fileUploadManager", () => ({
    FileUploadManager: vi.fn().mockImplementation(() => ({
        validateImageFile: vi.fn(),
        generateBlurhashForFile: vi.fn(),
        uploadFileWithCallbacks: vi.fn(),
        uploadMultipleFilesWithCallbacks: vi.fn()
    }))
}));

vi.mock("../lib/utils/appUtils", () => ({
    getImageDimensions: vi.fn(),
    calculateSHA256Hex: vi.fn(),
    renameByMimeType: vi.fn(),
    generateSimpleUUID: vi.fn(() => "mock-uuid-123")
}));

vi.mock("../lib/tags/imetaTag", () => ({
    extractImageBlurhashMap: vi.fn(),
    getMimeTypeFromUrl: vi.fn(),
    calculateImageHash: vi.fn(),
    createImetaTag: vi.fn(async () => ["imeta-tag"])
}));

vi.mock("svelte", () => ({
    tick: vi.fn()
}));

// モックの依存関係を作成
const createMockDependencies = (): UploadHelperDependencies => {
    const mockFileUploadManager: FileUploadManagerInterface = {
        validateImageFile: vi.fn((file: File): FileValidationResult => {
            return file.type.startsWith('image/')
                ? { isValid: true }
                : { isValid: false, errorMessage: "only_images_allowed" };
        }),
        generateBlurhashForFile: vi.fn(async () => "blurhash123"),
        uploadFileWithCallbacks: vi.fn(async (file: File) => ({
            success: true,
            url: `https://mock.com/${file.name}`,
            sizeInfo: { originalFilename: file.name, originalSize: file.size, compressedSize: file.size, wasCompressed: false, compressionRatio: 1, sizeReduction: "0%" }
        })),
        uploadMultipleFilesWithCallbacks: vi.fn(async (files: File[]) =>
            files.map((file, index) => ({
                success: true,
                url: `https://mock.com/image${index}.png`,
                sizeInfo: { originalFilename: file.name, originalSize: file.size, compressedSize: file.size, wasCompressed: false, compressionRatio: 1, sizeReduction: "0%" }
            }))
        )
    };

    return {
        localStorage: {
            getItem: vi.fn(() => "https://endpoint"),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            length: 0
        } as Storage,
        crypto: {
            digest: vi.fn(async () => new Uint8Array([1, 2, 3]).buffer)
        } as unknown as SubtleCrypto,
        tick: vi.fn(async () => { }),
        FileUploadManager: vi.fn((
            deps?: FileUploadDependencies,
            auth?: AuthService,
            compression?: CompressionService,
            mime?: MimeTypeSupportInterface
        ) => {
            // 依存関係注入パターンに対応
            return mockFileUploadManager;
        }) as new (
            deps?: FileUploadDependencies,
            auth?: AuthService,
            compression?: CompressionService,
            mime?: MimeTypeSupportInterface
        ) => FileUploadManagerInterface,
        getImageDimensions: vi.fn(async () => ({ width: 100, height: 200, displayWidth: 100, displayHeight: 200 })),
        extractImageBlurhashMap: vi.fn(() => ({})),
        calculateImageHash: vi.fn(async () => "xhash"),
        getMimeTypeFromUrl: vi.fn(() => "image/png"),
        createImetaTag: vi.fn(async () => ["imeta-tag"]),
        imageSizeMapStore: {
            update: vi.fn()
        }
    };
};

describe("uploadHelper", () => {
    let mockDependencies: UploadHelperDependencies;
    let currentEditor: any;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        // エディタモック - 必要なメソッドをすべて追加
        currentEditor = {
            chain: vi.fn(() => ({
                focus: vi.fn(() => ({
                    setImage: vi.fn(({ src }: { src: string }) => ({
                        run: vi.fn(() => true) // 成功を示すtrueを返す
                    })),
                    setTextSelection: vi.fn((_pos: number) => ({
                        insertContent: vi.fn((_content: string) => ({
                            setImage: vi.fn((_attrs: any) => ({
                                run: vi.fn(() => true)
                            }))
                        }))
                    }))
                }))
            })),
            state: {
                doc: {
                    descendants: vi.fn((_callback) => {
                        // descendants関数のモック実装
                        return;
                    }),
                    content: { size: 2 } // 初期サイズ
                },
                tr: {
                    setNodeMarkup: vi.fn().mockReturnThis(),
                    delete: vi.fn().mockReturnThis(),
                    insert: vi.fn().mockReturnThis(), // チェーンをサポートするために自分自身を返す
                    replaceWith: vi.fn().mockReturnThis()
                },
                selection: {
                    empty: true,
                    from: 1
                },
                schema: {
                    nodes: {
                        image: {
                            create: vi.fn((attrs) => ({ type: "image", attrs, nodeSize: 1 }))
                        }
                    }
                }
            },
            view: {
                dispatch: vi.fn()
            }
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("processFilesForUpload", () => {
        it("processes files and calculates ox and dimensions", async () => {
            const file = new File(["content"], "test.png", { type: "image/png" });
            const results = await processFilesForUpload([file], mockDependencies);

            expect(results).toHaveLength(1);
            expect(results[0]).toEqual({
                file,
                index: 0,
                ox: undefined,
                dimensions: { width: 100, height: 200, displayWidth: 100, displayHeight: 200 }
            });
        });
    });

    describe("insertPlaceholdersIntoEditor", () => {
        it("inserts placeholders for valid files", () => {
            const file = new File(["content"], "test.png", { type: "image/png" });
            const processingResults = [{
                file,
                index: 0,
                ox: "010203",
                dimensions: { width: 100, height: 200, displayWidth: 100, displayHeight: 200 }
            }];
            const showUploadError = vi.fn();

            const placeholderMap = insertPlaceholdersIntoEditor(
                [file],
                processingResults,
                currentEditor,
                showUploadError,
                mockDependencies,
                false
            );

            expect(placeholderMap).toHaveLength(1);
            expect(placeholderMap[0].file).toBe(file);
            expect(placeholderMap[0].ox).toBe("010203");
            expect(placeholderMap[0].dimensions).toEqual({ width: 100, height: 200, displayWidth: 100, displayHeight: 200 });
            expect(showUploadError).not.toHaveBeenCalled();

            // フォーカス関連のチェックを削除し、直接的なview.dispatchの呼び出しを確認
            expect(currentEditor.view.dispatch).toHaveBeenCalled();
        });

        it("shows error for invalid files", () => {
            const invalidFile = new File(["content"], "test.txt", { type: "text/plain" });
            const processingResults = [{ file: invalidFile, index: 0 }];
            const showUploadError = vi.fn();

            // 依存関係を直接作成してモック設定
            const customDependencies = {
                ...mockDependencies,
                FileUploadManager: vi.fn(() => ({
                    validateImageFile: vi.fn(() => ({
                        isValid: false,
                        errorMessage: "only_images_allowed"
                    })),
                    generateBlurhashForFile: vi.fn(async () => "blurhash123"),
                    uploadFileWithCallbacks: vi.fn(),
                    uploadMultipleFilesWithCallbacks: vi.fn()
                })) as new () => FileUploadManagerInterface
            };

            const placeholderMap = insertPlaceholdersIntoEditor(
                [invalidFile],
                processingResults,
                currentEditor,
                showUploadError,
                customDependencies,
                false
            );

            expect(placeholderMap).toHaveLength(0);
            expect(showUploadError).toHaveBeenCalledWith("only_images_allowed");
        });

        it("inserts after selected image node when image is selected", () => {
            const file1 = new File(["content1"], "test1.png", { type: "image/png" });
            const file2 = new File(["content2"], "test2.png", { type: "image/png" });
            const processingResults = [
                { file: file1, index: 0, ox: "hash1", dimensions: { width: 100, height: 200, displayWidth: 100, displayHeight: 200 } },
                { file: file2, index: 1, ox: "hash2", dimensions: { width: 150, height: 300, displayWidth: 150, displayHeight: 300 } }
            ];
            const showUploadError = vi.fn();

            // NodeSelectionで画像ノードが選択されている状態をモック
            const mockNodeSelection = {
                constructor: { name: 'NodeSelection' },
                node: { type: { name: 'image' }, attrs: { src: 'existing-image.png' } },
                to: 2, // 選択されたノードの直後の位置
                from: 1
            };

            const mockCurrentEditor: any = {
                state: {
                    doc: {
                        content: { size: 4 }, // 画像1つ分のサイズ
                        descendants: vi.fn((_callback) => {
                            return;
                        }),
                    },
                    tr: {
                        insert: vi.fn().mockReturnThis(), // チェーンをサポート
                        replaceWith: vi.fn().mockReturnThis()
                    },
                    selection: mockNodeSelection,
                    schema: {
                        nodes: {
                            image: {
                                create: vi.fn((attrs) => ({ type: "image", attrs, nodeSize: 1 }))
                            }
                        }
                    }
                },
                view: {
                    dispatch: vi.fn()
                }
            };

            // NodeSelectionのinstanceofをモック
            Object.setPrototypeOf(mockNodeSelection, NodeSelection.prototype);

            const placeholderMap = insertPlaceholdersIntoEditor(
                [file1, file2],
                processingResults,
                mockCurrentEditor,
                showUploadError,
                mockDependencies,
                true // devMode
            );

            expect(placeholderMap).toHaveLength(2);
            expect(showUploadError).not.toHaveBeenCalled();

            // 画像ノードが選択されている場合、選択ノードの直後に挿入される（上書きしない）
            expect(mockCurrentEditor.view.dispatch).toHaveBeenCalledTimes(1); // 1回のdispatch
            expect(mockCurrentEditor.state.tr.insert).toHaveBeenCalledTimes(2); // 2回のinsert

            // 1番目の画像は位置2（選択ノードの直後）に挿入
            expect(mockCurrentEditor.state.tr.insert).toHaveBeenNthCalledWith(1, 2, expect.any(Object));
            // 2番目の画像は位置3（1番目の画像の直後）に挿入
            expect(mockCurrentEditor.state.tr.insert).toHaveBeenNthCalledWith(2, 3, expect.any(Object));

            // replaceWith は呼ばれない（上書きしない）
            expect(mockCurrentEditor.state.tr.replaceWith).not.toHaveBeenCalled();
        });
    });

    describe("prepareMetadataList", () => {
        it("prepares metadata for files", () => {
            const fileContent = new Uint8Array(1024);
            const file = new File([fileContent], "test.png", { type: "image/png" });

            const metadata = prepareMetadataList([file]);

            expect(metadata).toHaveLength(1);
            expect(metadata[0]).toEqual({
                caption: "test.png",
                expiration: "",
                size: 1024,
                alt: "test.png",
                media_type: undefined,
                content_type: "image/png",
                no_transform: "true"
            });
        });
    });

    describe("uploadHelper integration", () => {
        it("uploads a single valid file successfully", async () => {
            const file = new File(["content"], "test.png", { type: "image/png" });
            const showUploadError = vi.fn();
            const updateUploadState = vi.fn();

            const result = await uploadHelper({
                files: [file],
                currentEditor,
                showUploadError,
                updateUploadState,
                devMode: false,
                dependencies: mockDependencies
            });

            expect(result.results).toHaveLength(1);
            expect(result.results![0].success).toBe(true);
            expect(result.results![0].url).toBe("https://mock.com/test.png");
            expect(result.errorMessage).toBe("");
            expect(updateUploadState).toHaveBeenCalledWith(true, "");
            expect(updateUploadState).toHaveBeenCalledWith(false);
        });

        it("handles validation errors", async () => {
            const invalidFile = new File(["content"], "test.txt", { type: "text/plain" });
            const showUploadError = vi.fn();
            const updateUploadState = vi.fn();

            // validateImageFileが無効ファイルを返すようにモック設定
            const mockFileUploadManager: FileUploadManagerInterface = {
                validateImageFile: vi.fn(() => ({
                    isValid: false,
                    errorMessage: "only_images_allowed"
                })),
                generateBlurhashForFile: vi.fn(async () => "blurhash123"),
                uploadFileWithCallbacks: vi.fn(),
                uploadMultipleFilesWithCallbacks: vi.fn()
            };

            const customDependencies = {
                ...mockDependencies,
                FileUploadManager: vi.fn(() => mockFileUploadManager) as new () => FileUploadManagerInterface
            };

            const result = await uploadHelper({
                files: [invalidFile],
                currentEditor,
                showUploadError,
                updateUploadState,
                devMode: false,
                dependencies: customDependencies
            });

            expect(showUploadError).toHaveBeenCalledWith("only_images_allowed");
            expect(result.placeholderMap).toHaveLength(0);
            // 無効なファイルの場合、アップロード処理自体が実行されない
            expect(updateUploadState).not.toHaveBeenCalled();
        });

        it("handles multiple files with mixed results", async () => {
            const validFile = new File(["content"], "valid.png", { type: "image/png" });
            const invalidFile = new File(["content"], "invalid.txt", { type: "text/plain" });
            const showUploadError = vi.fn();
            const updateUploadState = vi.fn();

            // カスタムFileUploadManagerでファイルごとに異なる結果を返す
            const mockFileUploadManager: FileUploadManagerInterface = {
                validateImageFile: vi.fn((file: File) => {
                    return file.type.startsWith('image/')
                        ? { isValid: true }
                        : { isValid: false, errorMessage: "only_images_allowed" };
                }),
                generateBlurhashForFile: vi.fn(async () => "blurhash123"),
                uploadFileWithCallbacks: vi.fn(async (file: File) => ({
                    success: true,
                    url: `https://mock.com/${file.name}`,
                    sizeInfo: { originalFilename: file.name, originalSize: file.size, compressedSize: file.size, wasCompressed: false, compressionRatio: 1, sizeReduction: "0%" }
                })),
                // 有効ファイルのみがアップロード対象になる
                uploadMultipleFilesWithCallbacks: vi.fn(async (files: File[]) =>
                    files.map((file) => ({
                        success: true,
                        url: `https://mock.com/${file.name}`,
                        sizeInfo: { originalFilename: file.name, originalSize: file.size, compressedSize: file.size, wasCompressed: false, compressionRatio: 1, sizeReduction: "0%" }
                    }))
                )
            };

            const customDependencies = {
                ...mockDependencies,
                FileUploadManager: vi.fn(() => mockFileUploadManager) as new () => FileUploadManagerInterface
            };

            const result = await uploadHelper({
                files: [validFile, invalidFile],
                currentEditor,
                showUploadError,
                updateUploadState,
                devMode: false,
                dependencies: customDependencies
            });

            // 無効ファイルに対してエラーが表示される
            expect(showUploadError).toHaveBeenCalledWith("only_images_allowed");

            // プレースホルダーマップは置換処理後にクリアされる
            expect(result.placeholderMap).toHaveLength(0);

            // アップロード処理は有効ファイルのみに対して実行される（1ファイル）
            expect(result.results).toHaveLength(1);
            expect(result.results![0].success).toBe(true);
            expect(result.results![0].url).toBe("https://mock.com/valid.png");

            // uploadMultipleFilesWithCallbacksは呼ばれず、uploadFileWithCallbacksが呼ばれる
            // 実際の呼び出し引数に合わせて期待値を修正
            expect(mockFileUploadManager.uploadFileWithCallbacks).toHaveBeenCalledWith(
                validFile,
                "https://endpoint", // localStorageから取得される実際の値
                undefined,
                false,
                {
                    caption: "valid.png",
                    expiration: "",
                    size: validFile.size, // 実際のファイルサイズ
                    alt: "valid.png",
                    media_type: undefined,
                    content_type: "image/png",
                    no_transform: "true"
                }
            );
            expect(mockFileUploadManager.uploadMultipleFilesWithCallbacks).not.toHaveBeenCalled();

            // エラーメッセージは空
            expect(result.errorMessage).toBe("");
        });

        // 複数有効ファイルのテストケースを修正
        it("handles multiple valid files successfully", async () => {
            const validFile1 = new File(["content1"], "valid1.png", { type: "image/png" });
            const validFile2 = new File(["content2"], "valid2.png", { type: "image/png" });
            const showUploadError = vi.fn();
            const updateUploadState = vi.fn();

            const mockFileUploadManager: FileUploadManagerInterface = {
                validateImageFile: vi.fn(() => ({ isValid: true })),
                generateBlurhashForFile: vi.fn(async () => "blurhash123"),
                uploadFileWithCallbacks: vi.fn(),
                uploadMultipleFilesWithCallbacks: vi.fn(async (files: File[]) =>
                    files.map((file) => ({
                        success: true,
                        url: `https://mock.com/${file.name}`,
                        sizeInfo: { originalFilename: file.name, originalSize: file.size, compressedSize: file.size, wasCompressed: false, compressionRatio: 1, sizeReduction: "0%" }
                    }))
                )
            };

            const customDependencies = {
                ...mockDependencies,
                FileUploadManager: vi.fn(() => mockFileUploadManager) as new () => FileUploadManagerInterface
            };

            const result = await uploadHelper({
                files: [validFile1, validFile2],
                currentEditor,
                showUploadError,
                updateUploadState,
                devMode: false,
                dependencies: customDependencies
            });

            // プレースホルダーマップは置換処理後にクリアされる
            expect(result.placeholderMap).toHaveLength(0);

            // 両方のファイルがアップロード成功
            expect(result.results).toHaveLength(2);
            expect(result.results![0]).toBeDefined();
            expect(result.results![0].success).toBe(true);
            expect(result.results![0].url).toBe("https://mock.com/valid1.png");
            expect(result.results![1]).toBeDefined();
            expect(result.results![1].success).toBe(true);
            expect(result.results![1].url).toBe("https://mock.com/valid2.png");

            // uploadMultipleFilesWithCallbacksが呼ばれる
            expect(mockFileUploadManager.uploadMultipleFilesWithCallbacks).toHaveBeenCalledWith(
                [validFile1, validFile2],
                "https://endpoint",
                undefined,
                [
                    {
                        caption: "valid1.png",
                        expiration: "",
                        size: validFile1.size,
                        alt: "valid1.png",
                        media_type: undefined,
                        content_type: "image/png",
                        no_transform: "true"
                    },
                    {
                        caption: "valid2.png",
                        expiration: "",
                        size: validFile2.size,
                        alt: "valid2.png",
                        media_type: undefined,
                        content_type: "image/png",
                        no_transform: "true"
                    }
                ]
            );
            expect(mockFileUploadManager.uploadFileWithCallbacks).not.toHaveBeenCalled();

            // エラーメッセージは空
            expect(result.errorMessage).toBe("");
        });

        // 実際の複数プレースホルダーテストを修正
        it("creates unique placeholder IDs for multiple files", () => {
            const file1 = new File(["content1"], "test1.png", { type: "image/png" });
            const file2 = new File(["content2"], "test2.png", { type: "image/png" });
            const processingResults = [
                { file: file1, index: 0, ox: "hash1", dimensions: { width: 100, height: 200, displayWidth: 100, displayHeight: 200 } },
                { file: file2, index: 1, ox: "hash2", dimensions: { width: 150, height: 300, displayWidth: 150, displayHeight: 300 } }
            ];
            const showUploadError = vi.fn();

            // エディタモックを動的に更新するように改善 - 必要なメソッドをすべて追加
            const mockCurrentEditor: any = {
                state: {
                    doc: {
                        content: { size: 2 }, // 空のparagraph
                        descendants: vi.fn((_callback) => {
                            // descendants関数のモック実装
                            return;
                        }),
                    },
                    tr: {
                        insert: vi.fn().mockReturnThis(), // チェーンをサポート
                        replaceWith: vi.fn().mockReturnThis()
                    },
                    selection: {
                        from: 1
                    },
                    schema: {
                        nodes: {
                            image: {
                                create: vi.fn((attrs) => ({ type: "image", attrs, nodeSize: 1 }))
                            }
                        }
                    }
                },
                view: {
                    dispatch: vi.fn()
                }
            };

            const placeholderMap = insertPlaceholdersIntoEditor(
                [file1, file2],
                processingResults,
                mockCurrentEditor,
                showUploadError,
                mockDependencies,
                true // devMode
            );

            expect(placeholderMap).toHaveLength(2);
            expect(placeholderMap[0].placeholderId).not.toBe(placeholderMap[1].placeholderId);
            expect(placeholderMap[0].file).toBe(file1);
            expect(placeholderMap[1].file).toBe(file2);
            expect(showUploadError).not.toHaveBeenCalled();

            // 修正: 実装の実際の動作に合わせた検証
            // - 両方のファイル: tr.insert を使用（isImageNodeSelected: false の場合）
            expect(mockCurrentEditor.view.dispatch).toHaveBeenCalledTimes(1); // 1回のdispatch
            expect(mockCurrentEditor.state.tr.replaceWith).toHaveBeenCalledTimes(0); // replaceWith は呼ばれない
            expect(mockCurrentEditor.state.tr.insert).toHaveBeenCalledTimes(2); // 両方のファイル用
            expect(mockCurrentEditor.state.schema.nodes.image.create).toHaveBeenCalledTimes(2); // 両方のファイル用
        });

        describe("insertPlaceholdersIntoEditor edge cases", () => {
            it("returns empty array if currentEditor is null", () => {
                const file = new File(["content"], "test.png", { type: "image/png" });
                const processingResults = [{
                    file,
                    index: 0,
                    ox: "010203",
                    dimensions: { width: 100, height: 200, displayWidth: 100, displayHeight: 200 }
                }];
                const showUploadError = vi.fn();

                const result = insertPlaceholdersIntoEditor(
                    [file],
                    processingResults,
                    null,
                    showUploadError,
                    mockDependencies,
                    false
                );
                expect(result).toEqual([]);
                expect(showUploadError).not.toHaveBeenCalled();
            });

            it("handles error thrown by image node creation", () => {
                const file = new File(["content"], "test.png", { type: "image/png" });
                const processingResults = [{
                    file,
                    index: 0,
                    ox: "010203",
                    dimensions: { width: 100, height: 200, displayWidth: 100, displayHeight: 200 }
                }];
                const showUploadError = vi.fn();

                // Mock image.create to throw
                const erroringEditor: any = {
                    state: {
                        doc: {
                            content: { size: 2 },
                            descendants: vi.fn(),
                        },
                        tr: {
                            insert: vi.fn().mockReturnThis(),
                            replaceWith: vi.fn().mockReturnThis()
                        },
                        selection: { from: 1 },
                        schema: {
                            nodes: {
                                image: {
                                    create: vi.fn(() => { throw new Error("fail create"); })
                                }
                            }
                        }
                    },
                    view: {
                        dispatch: vi.fn()
                    }
                };

                const result = insertPlaceholdersIntoEditor(
                    [file],
                    processingResults,
                    erroringEditor,
                    showUploadError,
                    mockDependencies,
                    true // devMode to trigger console.error
                );
                expect(result).toEqual([]);
                expect(showUploadError).toHaveBeenCalledWith("画像の挿入に失敗しました");
            });

            it("replaces empty paragraph with image if doc is only empty paragraph", () => {
                const file = new File(["content"], "test.png", { type: "image/png" });
                const processingResults = [{
                    file,
                    index: 0,
                    ox: "oxval",
                    dimensions: { width: 100, height: 200, displayWidth: 100, displayHeight: 200 }
                }];
                const showUploadError = vi.fn();

                const mockCurrentEditor: any = {
                    state: {
                        doc: {
                            childCount: 1,
                            firstChild: {
                                type: { name: "paragraph" },
                                content: { size: 0 }
                            },
                            content: { size: 2 },
                            descendants: vi.fn(),
                        },
                        tr: {
                            insert: vi.fn().mockReturnThis(),
                            replaceWith: vi.fn().mockReturnThis()
                        },
                        selection: { from: 1 },
                        schema: {
                            nodes: {
                                image: {
                                    create: vi.fn((attrs) => ({ type: "image", attrs, nodeSize: 1 }))
                                }
                            }
                        }
                    },
                    view: {
                        dispatch: vi.fn()
                    }
                };

                const result = insertPlaceholdersIntoEditor(
                    [file],
                    processingResults,
                    mockCurrentEditor,
                    showUploadError,
                    mockDependencies,
                    false
                );
                expect(result).toHaveLength(1);
                expect(mockCurrentEditor.state.tr.replaceWith).toHaveBeenCalledTimes(1);
                expect(mockCurrentEditor.state.tr.insert).not.toHaveBeenCalled();
                expect(mockCurrentEditor.view.dispatch).toHaveBeenCalledTimes(1);
            });

            it("updates imageSizeMapStore when dimensions are present", () => {
                const file = new File(["content"], "test.png", { type: "image/png" });
                const processingResults = [{
                    file,
                    index: 0,
                    ox: "oxval",
                    dimensions: { width: 123, height: 456, displayWidth: 123, displayHeight: 456 }
                }];
                const showUploadError = vi.fn();
                const imageSizeMapStoreUpdate = vi.fn();

                const customDependencies = {
                    ...mockDependencies,
                    imageSizeMapStore: {
                        update: imageSizeMapStoreUpdate
                    }
                };

                const result = insertPlaceholdersIntoEditor(
                    [file],
                    processingResults,
                    currentEditor,
                    showUploadError,
                    customDependencies,
                    false
                );
                expect(result).toHaveLength(1);
                expect(imageSizeMapStoreUpdate).toHaveBeenCalled();
            });

            it("does not update imageSizeMapStore if dimensions are missing", () => {
                const file = new File(["content"], "test.png", { type: "image/png" });
                const processingResults = [{
                    file,
                    index: 0,
                    ox: "oxval"
                    // no dimensions
                }];
                const showUploadError = vi.fn();
                const imageSizeMapStoreUpdate = vi.fn();

                const customDependencies = {
                    ...mockDependencies,
                    imageSizeMapStore: {
                        update: imageSizeMapStoreUpdate
                    }
                };

                const result = insertPlaceholdersIntoEditor(
                    [file],
                    processingResults,
                    currentEditor,
                    showUploadError,
                    customDependencies,
                    false
                );
                expect(result).toHaveLength(1);
                expect(imageSizeMapStoreUpdate).not.toHaveBeenCalled();
            });
        });
    });
});


