import { describe, expect, it, vi, beforeEach } from "vitest";
import type { UploadHelperDependencies, FileUploadManagerInterface } from "../../lib/types";
import { createTestFile } from "../fileTestUtils";

const uploadHelperMock = vi.hoisted(() => vi.fn(async () => ({
    placeholderMap: [],
    results: null,
    imageOxMap: {},
    imageXMap: {},
    failedResults: [],
    errorMessage: "",
})));
const fileUploadManagerMock: any = vi.hoisted(() => vi.fn(function () {
    return {
        validateImageFile: vi.fn(),
        validateMediaFile: vi.fn(),
        generateBlurhashForFile: vi.fn(),
        uploadFileWithCallbacks: vi.fn(),
        uploadMultipleFilesWithCallbacks: vi.fn(),
    };
}));
const imageCompressionServiceMock: any = vi.hoisted(() => vi.fn());
const videoCompressionServiceMock: any = vi.hoisted(() => vi.fn());

vi.mock("../../lib/uploadHelper", () => ({
    uploadHelper: uploadHelperMock,
    showUploadErrorMessage: vi.fn(),
}));
vi.mock("../../lib/fileUploadManager", () => ({ FileUploadManager: fileUploadManagerMock }));
vi.mock("../../lib/imageCompressionService", () => ({ ImageCompressionService: imageCompressionServiceMock }));
vi.mock("../../lib/videoCompression/videoCompressionService", () => ({ VideoCompressionService: videoCompressionServiceMock }));
vi.mock("../../lib/mimeTypeSupport", () => ({ MimeTypeSupport: vi.fn() }));
vi.mock("../../lib/nostrAuthService", () => ({ NostrAuthService: vi.fn() }));
vi.mock("../../stores/uploadStore.svelte", () => ({
    setImageCompressionService: vi.fn(),
    setVideoCompressionService: vi.fn(),
}));

import { performFileUpload } from "../../lib/normalUploadHelper";
import { isDefaultUploadAborted } from "../../lib/uploadAbortUtils";

function createDependencies(overrides: Partial<UploadHelperDependencies> = {}): UploadHelperDependencies {
    return {
        localStorage: window.localStorage,
        crypto: window.crypto.subtle,
        tick: vi.fn(async () => undefined),
        FileUploadManager: fileUploadManagerMock as unknown as UploadHelperDependencies["FileUploadManager"],
        getImageDimensions: vi.fn(async () => null),
        extractImageBlurhashMap: vi.fn(() => ({})),
        calculateImageHash: vi.fn(async () => null),
        getMimeTypeFromUrl: vi.fn(() => "image/png"),
        createImetaTag: vi.fn(async () => []),
        imageSizeMapStore: { update: vi.fn() },
        ...overrides,
    };
}

describe("normal upload abort composition", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fileUploadManagerMock.mockImplementation(function () {
            return {
                validateImageFile: vi.fn(),
                validateMediaFile: vi.fn(),
                generateBlurhashForFile: vi.fn(),
                uploadFileWithCallbacks: vi.fn(),
                uploadMultipleFilesWithCallbacks: vi.fn(),
            } as FileUploadManagerInterface;
        });
    });

    const baseParams = () => ({
        files: [createTestFile({ name: "normal.png", type: "image/png", content: "content" })],
        currentEditor: null,
        updateUploadState: vi.fn(),
        setUploadErrorMessage: vi.fn(),
        imageOxMap: {},
        imageXMap: {},
        getUploadFailedText: (key: string) => key,
        devMode: false,
    });

    it("default normal uploader passes the global abort checker to compression and manager", async () => {
        await performFileUpload(baseParams());

        const managerDeps = fileUploadManagerMock.mock.calls.at(-1)?.[0];
        expect(managerDeps?.isUploadAborted).toBe(isDefaultUploadAborted);
        expect(imageCompressionServiceMock.mock.calls.at(-1)?.[2]).toBe(isDefaultUploadAborted);
        expect(videoCompressionServiceMock.mock.calls.at(-1)?.[1]).toBe(isDefaultUploadAborted);
    });

    it("preserves an explicitly injected abort checker", async () => {
        const explicitChecker = vi.fn(() => false);

        await performFileUpload({
            ...baseParams(),
            dependencies: createDependencies({ isUploadAborted: explicitChecker }),
        });

        const managerDeps = fileUploadManagerMock.mock.calls.at(-1)?.[0];
        expect(managerDeps?.isUploadAborted).toBe(explicitChecker);
        expect(imageCompressionServiceMock.mock.calls.at(-1)?.[2]).toBe(explicitChecker);
        expect(videoCompressionServiceMock.mock.calls.at(-1)?.[1]).toBe(explicitChecker);
    });
});
