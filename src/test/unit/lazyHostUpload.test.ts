import { describe, expect, it, vi } from "vitest";
import { createDeferred } from "../deferredTestUtils";
import { createLazyHostUpload } from "../../lib/upload/lazyHostUpload";

const file = new File(["x"], "a.png", { type: "image/png" });
const result = { url: "https://media.example/a.png" } as Awaited<ReturnType<ReturnType<typeof createLazyHostUpload>>>;

describe("createLazyHostUpload", () => {
    it("rejects before importing the upload module while the editor is busy", async () => {
        const importHeadlessUpload = vi.fn();
        const upload = createLazyHostUpload({ isEditorBusy: () => true, importHeadlessUpload });
        await expect(upload(file, new AbortController().signal)).rejects.toMatchObject({ name: "upload_in_progress" });
        expect(importHeadlessUpload).not.toHaveBeenCalled();
    });

    it("rejects when an editor upload starts while the upload module is loading", async () => {
        let busy = false;
        const uploadFileForHost = vi.fn(async () => result);
        const moduleLoad = createDeferred<{ uploadFileForHost: typeof uploadFileForHost }>();
        const upload = createLazyHostUpload({ isEditorBusy: () => busy, importHeadlessUpload: () => moduleLoad.promise });

        const pending = upload(file, new AbortController().signal);
        busy = true;
        moduleLoad.resolve({ uploadFileForHost });

        await expect(pending).rejects.toMatchObject({ name: "upload_in_progress" });
        expect(uploadFileForHost).not.toHaveBeenCalled();
    });

    it("uploads through the loaded module while the editor stays idle", async () => {
        const uploadFileForHost = vi.fn(async () => result);
        const upload = createLazyHostUpload({
            isEditorBusy: () => false,
            importHeadlessUpload: async () => ({ uploadFileForHost }),
        });
        const signal = new AbortController().signal;
        await expect(upload(file, signal)).resolves.toBe(result);
        expect(uploadFileForHost).toHaveBeenCalledWith(file, signal);
    });
});
