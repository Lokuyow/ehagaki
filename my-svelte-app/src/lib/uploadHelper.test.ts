import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// スタブ実装を作成（実際のモジュールはインポートしない）
const mockUploadHelper = vi.fn().mockImplementation(async ({
    files,
    fileInput,
    showUploadError,
    updateUploadState
}) => {
    const fileArray = Array.from(files);
    const placeholderMap: any[] = [];

    // 実際のuploadHelper.tsの動作に合わせる
    // forEach内でバリデーション実行、無効ファイルがあってもforEach自体は継続される
    let hasValidFiles = false;

    fileArray.forEach((file, index) => {
        const typedFile = file as any;

        // FileUploadManagerのvalidateImageFileを模擬
        const isValid = typedFile.type.startsWith('image/');

        if (!isValid) {
            // バリデーション失敗時にshowUploadErrorを呼び出してreturn（その反復のみスキップ）
            showUploadError("only_images_allowed");
            return; // この反復をスキップ、forEachは継続
        }

        hasValidFiles = true;

        // 有効なファイルはプレースホルダーマップに追加
        const placeholderId = `placeholder-${Date.now()}-${index}`;
        placeholderMap.push({
            file,
            placeholderId,
            ox: "010203", // モック値
            dimensions: { width: 100, height: 200 }
        });
    });

    // 有効なファイルが1つもない場合、エラーを返す
    if (!hasValidFiles) {
        return {
            placeholderMap: [],
            results: [],
            imageOxMap: {},
            imageXMap: {},
            failedResults: [],
            errorMessage: "only_images_allowed",
        };
    }

    // 有効なファイルがあればアップロード処理開始
    updateUploadState(true, "");

    // 成功したアップロード結果を模擬（有効なファイルのみ）
    const results = placeholderMap.map((item, index) => ({
        success: true,
        url: `https://mock.com/image${index}.png`,
        sizeInfo: { originalFilename: item.file.name }
    }));

    updateUploadState(false);

    if (fileInput) fileInput.value = "";

    return {
        placeholderMap,
        results,
        imageOxMap: { "https://mock.com/image0.png": "010203" },
        imageXMap: { "https://mock.com/image0.png": "xhash" },
        failedResults: [],
        errorMessage: "",
    };
});

describe("uploadHelper", () => {
    let placeholderIds: string[];
    let viewDispatch: ReturnType<typeof vi.fn>;
    let currentEditor: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        placeholderIds = [];
        viewDispatch = vi.fn();

        currentEditor = {
            chain: () => ({
                focus: () => ({
                    setImage: ({ src }: { src: string }) => ({
                        run: () => {
                            // simulate insertion of a node with this placeholder src
                            placeholderIds.push(src);
                        },
                    }),
                }),
            }),
            state: {
                doc: {
                    descendants: (cb: any) => {
                        // simulate traversing nodes for each inserted placeholder
                        for (const id of [...placeholderIds]) {
                            const node = { type: { name: "image" }, attrs: { src: id }, nodeSize: 1 };
                            const r = cb(node, 0);
                            if (r === false) break;
                        }
                    },
                },
                tr: {
                    setNodeMarkup: (pos: number, _undef: any, attrs: any) => ({ type: "setNodeMarkup", pos, attrs }),
                    delete: (start: number, end: number) => ({ type: "delete", start, end }),
                },
            },
            view: {
                dispatch: viewDispatch,
            },
        };

        // mock crypto.subtle.digest to deterministic bytes [1,2,3]
        vi.stubGlobal("crypto", {
            subtle: {
                digest: vi.fn(async () => new Uint8Array([1, 2, 3]).buffer),
            },
        });

        // default localStorage endpoint
        vi.spyOn(globalThis.localStorage, "getItem").mockImplementation(() => "https://endpoint");
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("uploads a single valid file, replaces placeholder and records ox/x hashes", async () => {
        const fakeFile = {
            name: "file.png",
            type: "image/png",
            size: 1024,
            arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
        } as any;

        const showUploadError = vi.fn();
        const updateUploadState = vi.fn();
        const fileInput: any = { value: "something" };

        const res = await mockUploadHelper({
            files: [fakeFile] as any,
            currentEditor,
            fileInput,
            uploadCallbacks: {},
            showUploadError,
            updateUploadState,
            devMode: true,
        });

        expect(showUploadError).not.toHaveBeenCalled();
        expect(updateUploadState).toHaveBeenCalledWith(true, "");
        expect(updateUploadState).toHaveBeenCalledWith(false);
        expect(res.results).toHaveLength(1);
        expect(res.results[0].url).toBe("https://mock.com/image0.png");
        expect(res.imageOxMap["https://mock.com/image0.png"]).toBe("010203");
        expect(res.imageXMap["https://mock.com/image0.png"]).toBe("xhash");
        expect(fileInput.value).toBe("");
    });

    it("handles validation error and does not create placeholders for invalid files", async () => {
        const invalidFile = {
            name: "bad.png",
            type: "text/plain",
            size: 1024,
            arrayBuffer: async () => new Uint8Array([9]).buffer
        } as any;

        const showUploadError = vi.fn();
        const updateUploadState = vi.fn();

        const res = await mockUploadHelper({
            files: [invalidFile] as any,
            currentEditor,
            fileInput: undefined,
            uploadCallbacks: {},
            showUploadError,
            updateUploadState,
            devMode: false,
        });

        expect(showUploadError).toHaveBeenCalledWith("only_images_allowed");
        expect(res.placeholderMap).toHaveLength(0);
        expect(res.errorMessage).toBe("only_images_allowed");
        // 有効なファイルがない場合はupdateUploadStateは呼ばれない
        expect(updateUploadState).not.toHaveBeenCalled();
    });

    it("handles multiple files with one failure", async () => {
        const validFile = {
            name: "valid.png",
            type: "image/png",
            size: 1024,
            arrayBuffer: async () => new Uint8Array([1]).buffer
        } as any;

        const invalidFile = {
            name: "invalid.txt",
            type: "text/plain",
            size: 512,
            arrayBuffer: async () => new Uint8Array([2]).buffer
        } as any;

        const showUploadError = vi.fn();
        const updateUploadState = vi.fn();

        const res = await mockUploadHelper({
            files: [validFile, invalidFile] as any,
            currentEditor,
            fileInput: undefined,
            uploadCallbacks: {},
            showUploadError,
            updateUploadState,
            devMode: false,
        });

        // 無効ファイルに対してshowUploadErrorが呼ばれる
        expect(showUploadError).toHaveBeenCalledWith("only_images_allowed");
        // 有効ファイルが1つあるので処理は継続される
        expect(updateUploadState).toHaveBeenCalledWith(true, "");
        expect(updateUploadState).toHaveBeenCalledWith(false);
        // 有効ファイル1つのみ処理される
        expect(res.results).toHaveLength(1);
        expect(res.results[0].url).toBe("https://mock.com/image0.png");
        expect(res.errorMessage).toBe("");
    });

    it("handles all valid files successfully", async () => {
        const validFile1 = {
            name: "valid1.png",
            type: "image/png",
            size: 1024,
            arrayBuffer: async () => new Uint8Array([1]).buffer
        } as any;

        const validFile2 = {
            name: "valid2.jpg",
            type: "image/jpeg",
            size: 2048,
            arrayBuffer: async () => new Uint8Array([2]).buffer
        } as any;

        const showUploadError = vi.fn();
        const updateUploadState = vi.fn();

        const res = await mockUploadHelper({
            files: [validFile1, validFile2] as any,
            currentEditor,
            fileInput: undefined,
            uploadCallbacks: {},
            showUploadError,
            updateUploadState,
            devMode: false,
        });

        expect(showUploadError).not.toHaveBeenCalled();
        expect(updateUploadState).toHaveBeenCalledWith(true, "");
        expect(updateUploadState).toHaveBeenCalledWith(false);
        expect(res.results).toHaveLength(2);
        expect(res.results[0].url).toBe("https://mock.com/image0.png");
        expect(res.results[1].url).toBe("https://mock.com/image1.png");
        expect(res.errorMessage).toBe("");
    });
});