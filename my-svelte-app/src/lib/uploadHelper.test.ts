import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ここを修正
vi.mock("./tags/tags.svelte", () => {
    return {
        imageSizeMapStore: {
            update: vi.fn(),
        },
    };
});

import { uploadHelper } from "./uploadHelper";
import { FileUploadManager } from "./fileUploadManager";
import * as imeta from "./tags/imetaTag";

vi.mock("./fileUploadManager", () => {
    return {
        FileUploadManager: {
            validateImageFile: vi.fn(),
            generateBlurhashForFile: vi.fn(),
            uploadFileWithCallbacks: vi.fn(),
            uploadMultipleFilesWithCallbacks: vi.fn(),
        },
        // ここを追加
        getImageDimensions: vi.fn(async () => ({ width: 100, height: 200 })),
    };
});

vi.mock("./imeta", () => {
    return {
        extractImageBlurhashMap: vi.fn(async () => ({})),
        getMimeTypeFromUrl: vi.fn(() => "image/png"),
        calculateImageHash: vi.fn(async () => "xhash"),
        createImetaTag: vi.fn(async () => "<imeta/>"),
    };
});

vi.mock("svelte", () => {
    return {
        tick: vi.fn(async () => { }),
    };
});


describe("uploadHelper", () => {
    let placeholderIds: string[];
    let viewDispatch: ReturnType<typeof vi.fn>;
    let currentEditor: any;

    beforeEach(() => {
        vi.resetAllMocks();
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

        // defaults for imeta.calculateImageHash
        vi.spyOn(imeta, "calculateImageHash").mockImplementation(async () => "xhash");
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("uploads a single valid file, replaces placeholder and records ox/x hashes", async () => {
        const fakeFile = {
            name: "file.png",
            arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
        } as any;

        (FileUploadManager.validateImageFile as any).mockReturnValue({ isValid: true });
        (FileUploadManager.generateBlurhashForFile as any).mockResolvedValue("blurhash1");
        (FileUploadManager.uploadFileWithCallbacks as any).mockResolvedValue({
            success: true,
            url: "https://img/test.png",
            sizeInfo: { originalFilename: "file.png" },
        });

        const showUploadError = vi.fn();
        const updateUploadState = vi.fn();
        const fileInput: any = { value: "something" };

        const res = await uploadHelper({
            files: [fakeFile] as any,
            currentEditor,
            fileInput,
            uploadCallbacks: {},
            showUploadError,
            updateUploadState,
            devMode: true,
        });

        expect(showUploadError).not.toHaveBeenCalled();
        expect(updateUploadState).toHaveBeenCalled();
        expect(res.results).toHaveLength(1);
        expect(res.results?.[0].url).toBe("https://img/test.png");
        // ox from bytes [1,2,3] -> "010203"
        expect(res.imageOxMap["https://img/test.png"]).toBe("010203");
        // calculateImageHash mocked to "xhash"
        expect(res.imageXMap["https://img/test.png"]).toBe("xhash");
        // check that editor dispatch was called with replacement (attrs.src = uploaded url)
        expect(viewDispatch).toHaveBeenCalled();
        const dispatchedSetNodeMarkup = viewDispatch.mock.calls.find(
            (c: any[]) => c[0] && c[0].type === "setNodeMarkup" && c[0].attrs?.src === "https://img/test.png",
        );
        expect(dispatchedSetNodeMarkup).toBeTruthy();
        // blurhash update should also have been dispatched
        const blurhashDispatch = viewDispatch.mock.calls.find(
            (c: any[]) => c[0] && c[0].type === "setNodeMarkup" && c[0].attrs?.blurhash === "blurhash1",
        );
        expect(blurhashDispatch).toBeTruthy();
        // file input cleared
        expect(fileInput.value).toBe("");
    });

    it("handles multiple uploads with one failure: returns failedResults and deletes placeholder", async () => {
        const fileA = { name: "a.png", arrayBuffer: async () => new Uint8Array([1]).buffer } as any;
        const fileB = { name: "b.png", arrayBuffer: async () => new Uint8Array([2]).buffer } as any;

        (FileUploadManager.validateImageFile as any).mockReturnValue({ isValid: true });
        (FileUploadManager.generateBlurhashForFile as any).mockResolvedValue(undefined);
        (FileUploadManager.uploadMultipleFilesWithCallbacks as any).mockResolvedValue([
            { success: true, url: "https://img/1.png", sizeInfo: { originalFilename: "a.png" } },
            { success: false, error: "boom" },
        ]);

        const showUploadError = vi.fn();
        const updateUploadState = vi.fn();

        const res = await uploadHelper({
            files: [fileA, fileB] as any,
            currentEditor,
            fileInput: undefined,
            uploadCallbacks: {},
            showUploadError,
            updateUploadState,
            devMode: false,
        });

        expect(res.results).toHaveLength(2);
        expect(res.failedResults).toHaveLength(1);
        expect(res.errorMessage).toBe("boom");
        // there should be a delete dispatch for the failed placeholder
        const deleteDispatch = viewDispatch.mock.calls.find((c: any[]) => c[0] && c[0].type === "delete");
        expect(deleteDispatch).toBeTruthy();
    });

    it("reports validation error and does not create placeholders for invalid files", async () => {
        const invalidFile = { name: "bad.png", arrayBuffer: async () => new Uint8Array([9]).buffer } as any;

        (FileUploadManager.validateImageFile as any).mockReturnValue({ isValid: false, errorMessage: "invalid" });
        const showUploadError = vi.fn();
        const updateUploadState = vi.fn();

        const res = await uploadHelper({
            files: [invalidFile] as any,
            currentEditor,
            fileInput: undefined,
            uploadCallbacks: {},
            showUploadError,
            updateUploadState,
            devMode: false,
        });

        // validation error should be reported
        expect(showUploadError).toHaveBeenCalledWith("invalid");
        // no placeholders created
        expect(res.placeholderMap).toHaveLength(0);
    });
});