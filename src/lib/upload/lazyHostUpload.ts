import type { EHagakiUploadResult } from "../../web-component/types";

type HeadlessUploadModule = Pick<typeof import("./headlessUpload"), "uploadFileForHost">;

export interface LazyHostUploadOptions {
    /** True while the Composer is uploading or posting. */
    isEditorBusy(): boolean;
    importHeadlessUpload?: () => Promise<HeadlessUploadModule>;
}

function assertEditorIdle(isEditorBusy: () => boolean): void {
    if (!isEditorBusy()) return;
    const error = new Error("An editor upload or post operation is already in progress.");
    error.name = "upload_in_progress";
    throw error;
}

/**
 * Host upload entry for the full App. Compression, blurhash, and upload
 * transport load on the first call. The Composer may start an upload or post
 * while that import is pending, so exclusivity is checked again afterwards.
 */
export function createLazyHostUpload(options: LazyHostUploadOptions) {
    const importHeadlessUpload = options.importHeadlessUpload
        ?? (() => import("./headlessUpload"));
    return async (file: File, signal: AbortSignal): Promise<EHagakiUploadResult> => {
        assertEditorIdle(options.isEditorBusy);
        const { uploadFileForHost } = await importHeadlessUpload();
        assertEditorIdle(options.isEditorBusy);
        return await uploadFileForHost(file, signal);
    };
}
