export interface TestFileOptions {
    name?: string;
    type?: string;
    content?: string | Blob | ArrayBuffer | ArrayBufferView;
    lastModified?: number;
}

export function createTestFile({
    name = "test.png",
    type = "image/png",
    content,
    lastModified,
}: TestFileOptions = {}): File {
    const fileOptions: FilePropertyBag = { type };

    if (lastModified !== undefined) {
        fileOptions.lastModified = lastModified;
    }

    return new File([content ?? "content"], name, fileOptions);
}
