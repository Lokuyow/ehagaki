import { describe, expect, it, vi } from "vitest";
import { mockAuthStoreModule } from "../mocks/storeModules";
import { createDeferred } from "../deferredTestUtils";
import { uploadFileForHost } from "../../lib/upload/headlessUpload";
import { EHagakiComposerElement } from "../../web-component/fullElement";
import type { UploadDestination } from "../../lib/types";

const destinationResolverMock = vi.hoisted(() => vi.fn());
const authTokenMock = vi.hoisted(() => ({ getToken: vi.fn() }));
const signatureValidationMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/upload/resolveCurrentUploadDestination", () => ({
    resolveCurrentUploadDestination: destinationResolverMock,
}));
vi.mock("../../lib/nip46Service", () => ({ nip46Service: { getSignerForSession: vi.fn() } }));
vi.mock("../../lib/parentClientAuthService", () => ({ parentClientAuthService: { getSigner: vi.fn() } }));
vi.mock("nostr-tools/nip98", () => ({ getToken: authTokenMock.getToken }));
vi.mock("../../lib/signedEventResultValidator", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../../lib/signedEventResultValidator")>();
    return {
        ...actual,
        validateSignedEventResult: (...args: Parameters<typeof actual.validateSignedEventResult>) => {
            signatureValidationMock(...args);
            return actual.validateSignedEventResult(...args);
        },
    };
});

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

const nip96Destination: UploadDestination = {
    id: "nip96-abort-test",
    pubkeyHex: null,
    name: "NIP-96 test",
    protocol: "nip96",
    serverUrl: "https://upload.example.com/api/upload",
    isDefault: true,
    enabled: true,
    createdAt: 1,
    updatedAt: 1,
    capabilities: {
        maxUploadSize: null,
        supportedMimeTypes: ["image/png"],
        supportsDelete: false,
        supportsList: false,
        supportsMirror: false,
        supportsMediaOptimization: false,
        authRequired: true,
        source: "test",
    },
    auth: { type: "nip98" },
    schemaVersion: 1,
};

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

    it("settles the public upload on abort while NIP-07 is pending and ignores its late result", async () => {
        const previousAuthState = mockAuthStoreModule.authState.value;
        const nostrWindow = window as any;
        const previousNostr = nostrWindow.nostr;
        const fetchSpy = vi.spyOn(window, "fetch");
        fetchSpy.mockClear();
        destinationResolverMock.mockReset().mockResolvedValue(nip96Destination);

        const signerStarted = createDeferred<void>();
        const signerResult = createDeferred<any>();
        let signerSettled = false;
        let tokenGenerated = false;
        const delayedSignerResult = signerResult.promise.then((value) => {
            signerSettled = true;
            return value;
        });
        const signEvent = vi.fn(() => {
            signerStarted.resolve();
            return delayedSignerResult;
        });
        authTokenMock.getToken.mockReset().mockImplementation(async (...args: any[]) => {
            await args[2]({
                kind: 27235,
                created_at: 1,
                tags: [],
                content: "",
            });
            tokenGenerated = true;
            return "Nostr test-token";
        });
        signatureValidationMock.mockClear();
        nostrWindow.nostr = { signEvent };
        mockAuthStoreModule.authState.value = {
            ...previousAuthState,
            isAuthenticated: true,
            type: "nip07",
            pubkey: "testpubkey123",
        };

        let operationSignal: AbortSignal | undefined;
        TestFullUploadElement.app = {
            uploadFileForHost: (file, options) => {
                operationSignal = options.signal;
                return uploadFileForHost(file, options.signal);
            },
        };
        const controller = new AbortController();
        const element = createElement();
        const upload = element.uploadFile(
            new File([new Uint8Array([1, 2, 3])], "avatar.png", { type: "image/png" }),
            { signal: controller.signal },
        );

        try {
            await signerStarted.promise;
            expect(signerSettled).toBe(false);
            expect(fetchSpy).not.toHaveBeenCalled();
            const removeListenerSpy = vi.spyOn(operationSignal!, "removeEventListener");

            controller.abort();
            await expect(upload).rejects.toMatchObject({ name: "AbortError" });
            expect(removeListenerSpy).toHaveBeenCalledWith("abort", expect.any(Function));
            expect(fetchSpy).not.toHaveBeenCalled();
            expect(tokenGenerated).toBe(false);
            expect(signatureValidationMock).not.toHaveBeenCalled();
            expect(signerSettled).toBe(false);

            signerResult.resolve({ id: "late-signature", sig: "late-signature" });
            await signerResult.promise;
            await Promise.resolve();
            await Promise.resolve();

            expect(fetchSpy).not.toHaveBeenCalled();
            expect(tokenGenerated).toBe(false);
            expect(signatureValidationMock).not.toHaveBeenCalled();
            expect(signerSettled).toBe(true);
            expect(mockAuthStoreModule.authState.value.type).toBe("nip07");
        } finally {
            controller.abort();
            fetchSpy.mockRestore();
            authTokenMock.getToken.mockReset();
            signatureValidationMock.mockClear();
            mockAuthStoreModule.authState.value = previousAuthState;
            if (previousNostr === undefined) delete nostrWindow.nostr;
            else nostrWindow.nostr = previousNostr;
        }
    });
});
