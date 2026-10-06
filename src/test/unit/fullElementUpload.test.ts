import { describe, expect, it, vi } from "vitest";
import { EHagakiComposerElement } from "../../web-component/fullElement";

type TestUploadApp = {
    uploadFileForHost: (file: File, options: { signal: AbortSignal }) => Promise<{ url: string }>;
};

class TestFullUploadElement extends EHagakiComposerElement {
    static app: TestUploadApp;
    current = true;

    override connectedCallback(): void {}

    protected override loadApp(): Promise<{ default: any }> {
        return Promise.resolve({ default: class {} });
    }

    protected override requireCurrentReadyApp() {
        return { app: TestFullUploadElement.app as never, generation: 0 };
    }

    protected override isCurrentConnection(): boolean {
        return this.current;
    }

    protected override onDisconnected(): void {
        this.current = false;
        super.onDisconnected();
    }
}

if (!customElements.get("ehagaki-test-full-upload")) {
    customElements.define("ehagaki-test-full-upload", TestFullUploadElement);
}

function createElement(): TestFullUploadElement {
    return document.createElement("ehagaki-test-full-upload") as TestFullUploadElement;
}

describe("Full Web Component uploadFile lifecycle", () => {
    it("rejects a second headless upload while the first operation is active", async () => {
        let resolveUpload!: (value: { url: string }) => void;
        const uploadFileForHost = vi.fn(() => new Promise<{ url: string }>((resolve) => {
            resolveUpload = resolve;
        }));
        TestFullUploadElement.app = { uploadFileForHost };
        const element = createElement();

        const first = element.uploadFile(new File(["one"], "one.png", { type: "image/png" }));
        await expect(element.uploadFile(new File(["two"], "two.png", { type: "image/png" })))
            .rejects.toMatchObject({ name: "upload_in_progress" });
        expect(uploadFileForHost).toHaveBeenCalledOnce();
        resolveUpload({ url: "https://cdn.example.com/one.png" });
        await expect(first).resolves.toEqual({ url: "https://cdn.example.com/one.png" });
    });

    it("cancels an active operation on disconnect and rejects with the lifecycle error", async () => {
        let receivedSignal: AbortSignal | undefined;
        const uploadFileForHost = vi.fn((_file: File, options: { signal: AbortSignal }) => {
            receivedSignal = options.signal;
            return new Promise<{ url: string }>((_resolve, reject) => {
                options.signal.addEventListener("abort", () => {
                    const error = new Error("aborted");
                    error.name = "AbortError";
                    reject(error);
                }, { once: true });
            });
        });
        TestFullUploadElement.app = { uploadFileForHost };
        const element = createElement();
        const ready = element.whenReady().catch(() => undefined);
        document.body.append(element);
        const upload = element.uploadFile(new File(["one"], "one.png", { type: "image/png" }));
        element.remove();

        await expect(upload).rejects.toMatchObject({ name: "disconnected" });
        await ready;
        expect(receivedSignal?.aborted).toBe(true);
    });
});
