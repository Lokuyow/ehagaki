export interface TestFileOptions {
    name?: string;
    type?: string;
    size?: number;
    content?: string | Blob | ArrayBuffer | ArrayBufferView;
    lastModified?: number;
}

export function createTestFile({
    name = "test.png",
    type = "image/png",
    size,
    content,
    lastModified = 0,
}: TestFileOptions = {}): File {
    if (content === undefined && size !== undefined) {
        if (size > 10 * 1024 * 1024) {
            const buffer = new ArrayBuffer(Math.min(size, 1024));
            return new File([buffer], name, { type, lastModified });
        }

        const bytes = new Uint8Array(Math.min(size, 1024));
        for (let index = 0; index < bytes.length; index += 1) {
            bytes[index] = index % 256;
        }
        return new File([bytes], name, { type, lastModified });
    }

    if (content === undefined) {
        content = "content";
    }

    return new File([content], name, { type, lastModified });
}
