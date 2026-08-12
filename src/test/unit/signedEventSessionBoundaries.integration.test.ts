import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { authState } from "../../stores/authStore.svelte";
import { PostManager } from "../../lib/postManager";
import { PostDeletionService } from "../../lib/postDeletionService";
import { NostrAuthService, createNip42Authenticator } from "../../lib/nostrAuthService";
import { Nip96UploadAdapter } from "../../lib/upload/Nip96UploadAdapter";
import { BlossomUploadAdapter } from "../../lib/upload/BlossomUploadAdapter";
import { publishBud03ServerList } from "../../lib/upload/bud03ServerList";
import type { AuthState, UploadDestination } from "../../lib/types";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import { createDeferred } from "../deferredTestUtils";
import { createMockRxNostr, MockKeyManager } from "../helpers";

const secretKeyA = generateSecretKey();
const pubkeyA = getPublicKey(secretKeyA);
const pubkeyB = getPublicKey(generateSecretKey());
const originalNostr = (window as any).nostr;

function createAuthState(type: AuthState["type"] = "nip07"): AuthState {
    return {
        type,
        isAuthenticated: true,
        pubkey: pubkeyA,
        npub: "npub1test",
        nprofile: "nprofile1test",
        isValid: true,
        isInitialized: true,
        isExtensionLogin: type === "nip07",
    };
}

function switchAccount(store: { value: AuthState }): void {
    store.value = { ...store.value, pubkey: pubkeyB };
}

function logout(store: { value: AuthState }): void {
    store.value = {
        ...store.value,
        isAuthenticated: false,
        type: "none",
        pubkey: "",
    };
}

function createPostManager(authStateStore: { value: AuthState }, signEvent: (event: any) => Promise<any>, savePostHistoryFn = vi.fn()) {
    const manager = new PostManager(createMockRxNostr(), {
        authStateStore,
        hashtagStore: { hashtags: [], tags: [] },
        keyManager: new MockKeyManager(null, null, true),
        window: { nostr: { signEvent } },
        contentWarningStore: { value: false, reset: () => undefined },
        contentWarningReasonStore: { value: "", reset: () => undefined },
        replyQuoteState: { value: { reply: null, quotes: [] } } as never,
        settingsStore: { quoteNotificationEnabled: false },
        writeRelaysStore: { value: [] },
        savePostHistoryFn,
        iframeMessageService: {
            notifyPostSuccess: () => true,
            notifyPostError: () => true,
        },
    });
    const sendEvent = vi.spyOn(manager.getEventSender()!, "sendEvent");
    return { manager, sendEvent, savePostHistoryFn };
}

function createPostRecord(): PostHistoryRecord {
    return {
        id: "post-record",
        eventId: "e".repeat(64),
        pubkeyHex: pubkeyA,
        kind: 1,
        content: "post",
        tags: [],
        createdAt: 1,
        postedAt: 1,
        relayHints: [],
        acceptedRelays: [],
        fetchedRelays: [],
        media: [],
        rawEvent: {},
        updatedAt: 1,
        schemaVersion: 2,
    };
}

function createDeletionService(params: {
    authStateStore: { value: AuthState };
    signEvent: (event: any) => Promise<any>;
    sendEvent: (event: any, options?: any) => Promise<any>;
    saveLocalDeletion: (input: any) => Promise<void>;
}) {
    return new PostDeletionService({
        authStateStore: params.authStateStore,
        keyManager: new MockKeyManager("nsec1test"),
        seckeySignerFn: () => ({ signEvent: params.signEvent }),
        eventSenderFactory: () => ({ sendEvent: params.sendEvent }),
        postHistoryDeletionRequestsRepository: {
            saveLocalDeletion: params.saveLocalDeletion,
        },
        now: () => 5_000,
    });
}

function createNip96Destination(): UploadDestination {
    return {
        id: "nip96",
        pubkeyHex: pubkeyA,
        name: "NIP-96",
        protocol: "nip96",
        serverUrl: "https://upload.example/api",
        resolvedUploadUrl: "https://upload.example/api",
        isDefault: true,
        enabled: true,
        createdAt: 1,
        updatedAt: 1,
        capabilities: {
            maxUploadSize: null,
            supportedMimeTypes: [],
            supportsDelete: false,
            supportsList: false,
            supportsMirror: false,
            supportsMediaOptimization: false,
            authRequired: true,
            source: "preset",
        },
        auth: { type: "nip98" },
        schemaVersion: 1,
    };
}

function createBlossomDestination(): UploadDestination {
    return {
        ...createNip96Destination(),
        id: "blossom",
        name: "Blossom",
        protocol: "blossom",
        serverUrl: "https://blossom.example",
        resolvedUploadUrl: undefined,
        auth: { type: "blossom-bud11" },
    };
}

function installDeferredNip07Signer() {
    const deferred = createDeferred<any>();
    let requestedTemplate: any;
    const signEvent = vi.fn((template: any) => {
        requestedTemplate = template;
        return deferred.promise;
    });
    (window as any).nostr = {
        getPublicKey: vi.fn(async () => pubkeyA),
        signEvent,
    };
    return {
        deferred,
        signEvent,
        resolveValid: () => deferred.resolve(finalizeEvent(requestedTemplate, secretKeyA)),
    };
}

function createBlossomProbeFile(): File {
    const file = new File(["data"], "test.png", { type: "image/png" });
    Object.defineProperty(file, "arrayBuffer", {
        value: async () => new TextEncoder().encode("data").buffer,
    });
    return file;
}

afterEach(() => {
    (window as any).nostr = originalNostr;
    (authState as any).value = {
        isAuthenticated: true,
        type: "nsec",
        pubkey: "testpubkey123",
    };
    vi.restoreAllMocks();
});

describe("signed-event contract at post-history boundaries", () => {
    it("rejects a validly signed but changed normal post", async () => {
        const authStateStore = { value: createAuthState() };
        const signEvent = vi.fn(async (template) => finalizeEvent({
            ...template,
            content: "changed by signer",
        }, secretKeyA));
        const { manager, sendEvent, savePostHistoryFn } = createPostManager(authStateStore, signEvent);

        await expect(manager.submitPost("requested content")).resolves.toMatchObject({
            success: false,
            error: "post_error",
        });
        expect(sendEvent).not.toHaveBeenCalled();
        expect(savePostHistoryFn).not.toHaveBeenCalled();
    });

    it("rejects a normal post when the signer mutates its template in place", async () => {
        const authStateStore = { value: createAuthState() };
        const signEvent = vi.fn(async (template: any) => {
            template.content = "changed in place by signer";
            template.tags.push(["t", "changed"]);
            return finalizeEvent(template, secretKeyA);
        });
        const { manager, sendEvent, savePostHistoryFn } = createPostManager(authStateStore, signEvent);

        await expect(manager.submitPost("requested content")).resolves.toMatchObject({
            success: false,
            error: "post_error",
        });
        expect(sendEvent).not.toHaveBeenCalled();
        expect(savePostHistoryFn).not.toHaveBeenCalled();
    });

    it("rejects a NIP-07 result signed by a different pubkey", async () => {
        const authStateStore = { value: createAuthState() };
        const otherSecretKey = generateSecretKey();
        const { manager, sendEvent } = createPostManager(
            authStateStore,
            async (template) => finalizeEvent(template, otherSecretKey),
        );

        await expect(manager.submitPost("wrong pubkey")).resolves.toMatchObject({ success: false });
        expect(sendEvent).not.toHaveBeenCalled();
    });

    it("does not publish a correct account A post after switching to B during signing", async () => {
        const authStateStore = { value: createAuthState() };
        const deferred = createDeferred<any>();
        let requestedTemplate: any;
        const { manager, sendEvent, savePostHistoryFn } = createPostManager(
            authStateStore,
            async (template) => {
                requestedTemplate = template;
                return deferred.promise;
            },
        );

        const resultPromise = manager.submitPost("account A post");
        await vi.waitFor(() => expect(requestedTemplate).toBeDefined());
        switchAccount(authStateStore);
        deferred.resolve(finalizeEvent(requestedTemplate, secretKeyA));

        await expect(resultPromise).resolves.toMatchObject({ success: false });
        expect(sendEvent).not.toHaveBeenCalled();
        expect(savePostHistoryFn).not.toHaveBeenCalled();
    });

    it("records a successful A post when the session changes while publish is pending", async () => {
        const authStateStore = { value: createAuthState() };
        const publishDeferred = createDeferred<any>();
        const savePostHistoryFn = vi.fn().mockResolvedValue(undefined);
        const { manager, sendEvent } = createPostManager(
            authStateStore,
            async (template) => finalizeEvent(template, secretKeyA),
            savePostHistoryFn,
        );
        sendEvent.mockReturnValue(publishDeferred.promise);

        const resultPromise = manager.submitPost("published A post");
        await vi.waitFor(() => expect(sendEvent).toHaveBeenCalledOnce());
        switchAccount(authStateStore);
        publishDeferred.resolve({ success: true, eventId: sendEvent.mock.calls[0][0].id });

        await expect(resultPromise).resolves.toMatchObject({ success: true });
        expect(savePostHistoryFn).toHaveBeenCalledWith(expect.objectContaining({
            event: expect.objectContaining({ pubkey: pubkeyA, content: "published A post" }),
        }));
    });

    it("rejects a validly signed but changed deletion request", async () => {
        const authStateStore = { value: createAuthState("nsec") };
        const sendEvent = vi.fn();
        const saveLocalDeletion = vi.fn();
        const service = createDeletionService({
            authStateStore,
            signEvent: async (template) => finalizeEvent({ ...template, content: "changed" }, secretKeyA),
            sendEvent,
            saveLocalDeletion,
        });

        await expect(service.requestDeletion({ post: createPostRecord(), rxNostr: {} as never }))
            .resolves.toEqual({ success: false, error: "post_error" });
        expect(sendEvent).not.toHaveBeenCalled();
        expect(saveLocalDeletion).not.toHaveBeenCalled();
    });

    it("rejects a deletion request when the signer mutates a nested tag in place", async () => {
        const authStateStore = { value: createAuthState("nsec") };
        const sendEvent = vi.fn();
        const saveLocalDeletion = vi.fn();
        const service = createDeletionService({
            authStateStore,
            signEvent: async (template: any) => {
                template.tags[0][1] = "f".repeat(64);
                return finalizeEvent(template, secretKeyA);
            },
            sendEvent,
            saveLocalDeletion,
        });

        await expect(service.requestDeletion({ post: createPostRecord(), rxNostr: {} as never }))
            .resolves.toEqual({ success: false, error: "post_error" });
        expect(sendEvent).not.toHaveBeenCalled();
        expect(saveLocalDeletion).not.toHaveBeenCalled();
    });

    it("does not publish a correct deletion after logout during signing", async () => {
        const authStateStore = { value: createAuthState("nsec") };
        const deferred = createDeferred<any>();
        let requestedTemplate: any;
        const sendEvent = vi.fn();
        const saveLocalDeletion = vi.fn();
        const service = createDeletionService({
            authStateStore,
            signEvent: async (template) => {
                requestedTemplate = template;
                return deferred.promise;
            },
            sendEvent,
            saveLocalDeletion,
        });

        const resultPromise = service.requestDeletion({ post: createPostRecord(), rxNostr: {} as never });
        await vi.waitFor(() => expect(requestedTemplate).toBeDefined());
        logout(authStateStore);
        deferred.resolve(finalizeEvent(requestedTemplate, secretKeyA));

        await expect(resultPromise).resolves.toEqual({ success: false, error: "post_error" });
        expect(sendEvent).not.toHaveBeenCalled();
        expect(saveLocalDeletion).not.toHaveBeenCalled();
    });

    it("records a successful A deletion when the session changes while publish is pending", async () => {
        const authStateStore = { value: createAuthState("nsec") };
        const publishDeferred = createDeferred<any>();
        const sendEvent = vi.fn().mockReturnValue(publishDeferred.promise);
        const saveLocalDeletion = vi.fn().mockResolvedValue(undefined);
        const service = createDeletionService({
            authStateStore,
            signEvent: async (template) => finalizeEvent(template, secretKeyA),
            sendEvent,
            saveLocalDeletion,
        });

        const resultPromise = service.requestDeletion({ post: createPostRecord(), rxNostr: {} as never });
        await vi.waitFor(() => expect(sendEvent).toHaveBeenCalledOnce());
        switchAccount(authStateStore);
        publishDeferred.resolve({ success: true, eventId: sendEvent.mock.calls[0][0].id });

        await expect(resultPromise).resolves.toMatchObject({ success: true });
        expect(saveLocalDeletion).toHaveBeenCalledWith(expect.objectContaining({
            deletionEvent: expect.objectContaining({ pubkey: pubkeyA, kind: 5 }),
        }));
    });
});

describe("active session liveness at authorization and protocol boundaries", () => {
    it("rejects an external signer that mutates the session-bound template in place", async () => {
        (authState as any).value = createAuthState();
        (window as any).nostr = {
            getPublicKey: vi.fn(async () => pubkeyA),
            signEvent: vi.fn(async (template: any) => {
                template.content = "changed in place by signer";
                template.tags[0][1] = "changed";
                return finalizeEvent(template, secretKeyA);
            }),
        };
        const signer = await new NostrAuthService().getEventSigner(pubkeyA);
        const requestedTemplate = {
            kind: 27235,
            content: "requested",
            created_at: 1_700_000_000,
            tags: [["u", "https://upload.example/api"]],
        };

        await expect(signer.signEvent(requestedTemplate)).rejects.toThrow(
            "Invalid signed event result",
        );
        expect(requestedTemplate).toEqual({
            kind: 27235,
            content: "requested",
            created_at: 1_700_000_000,
            tags: [["u", "https://upload.example/api"]],
        });
    });

    it("does not start a NIP-98 HTTP request after switching accounts during signing", async () => {
        (authState as any).value = createAuthState();
        const signer = installDeferredNip07Signer();
        const fetchMock = vi.fn();
        const uploadPromise = new Nip96UploadAdapter().upload({
            file: new File(["data"], "test.png", { type: "image/png" }),
            destination: createNip96Destination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
        });

        await vi.waitFor(() => expect(signer.signEvent).toHaveBeenCalledOnce());
        (authState as any).value = { ...authState.value, pubkey: pubkeyB };
        signer.resolveValid();

        await expect(uploadPromise).rejects.toThrow("Authentication required");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("does not start a manual BUD-11 HEAD request after logout during signing", async () => {
        (authState as any).value = createAuthState();
        const signer = installDeferredNip07Signer();
        const fetchMock = vi.fn();
        const sampleFile = new File(["data"], "test.png", { type: "image/png" });
        Object.defineProperty(sampleFile, "arrayBuffer", {
            value: async () => new TextEncoder().encode("data").buffer,
        });
        const probePromise = new BlossomUploadAdapter().testConnection({
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
            sampleFile,
        });

        await vi.waitFor(() => expect(signer.signEvent).toHaveBeenCalledOnce());
        (authState as any).value = { ...authState.value, isAuthenticated: false, pubkey: null };
        signer.resolveValid();

        await expect(probePromise).rejects.toThrow("Authentication required");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("signs once and reuses the same BUD-11 Authorization across one connection test", async () => {
        (authState as any).value = createAuthState();
        const signEvent = vi.fn(async (template) => finalizeEvent(template, secretKeyA));
        (window as any).nostr = {
            getPublicKey: vi.fn(async () => pubkeyA),
            signEvent,
        };
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
            new Response(null, { status: 200 }));

        const result = await new BlossomUploadAdapter().testConnection({
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
            sampleFile: createBlossomProbeFile(),
        });

        expect(result.success).toBe(true);
        expect(signEvent).toHaveBeenCalledOnce();
        expect(signEvent).toHaveBeenCalledWith(expect.objectContaining({ kind: 24242 }));
        expect(fetchMock).toHaveBeenCalledTimes(12);
        const authorizations = fetchMock.mock.calls.map((call) =>
            ((call[1] as RequestInit).headers as Record<string, string>).Authorization);
        expect(new Set(authorizations).size).toBe(1);
        expect(authorizations[0]).toMatch(/^Nostr [A-Za-z0-9_-]+$/);
    });

    it("signs once per connection test when invocations are separate", async () => {
        (authState as any).value = createAuthState();
        const signEvent = vi.fn(async (template) => finalizeEvent(template, secretKeyA));
        (window as any).nostr = {
            getPublicKey: vi.fn(async () => pubkeyA),
            signEvent,
        };
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
        const adapter = new BlossomUploadAdapter();

        await adapter.testConnection({
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
            sampleFile: createBlossomProbeFile(),
        });
        await adapter.testConnection({
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
            sampleFile: createBlossomProbeFile(),
        });

        expect(signEvent).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenCalledTimes(24);
    });

    it("does not fall back to an anonymous HEAD when the external signer rejects", async () => {
        (authState as any).value = createAuthState();
        const signEvent = vi.fn(async () => {
            throw new Error("Signer rejected");
        });
        (window as any).nostr = {
            getPublicKey: vi.fn(async () => pubkeyA),
            signEvent,
        };
        const fetchMock = vi.fn();

        const probePromise = new BlossomUploadAdapter().testConnection({
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
            sampleFile: createBlossomProbeFile(),
        });

        await expect(probePromise).rejects.toThrow("Signer rejected");
        expect(signEvent).toHaveBeenCalledOnce();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it.each([
        {
            name: "account switch",
            changeSession: () => {
                (authState as any).value = { ...authState.value, pubkey: pubkeyB };
            },
        },
        {
            name: "logout",
            changeSession: () => {
                (authState as any).value = {
                    ...authState.value,
                    isAuthenticated: false,
                    type: "none",
                    pubkey: "",
                };
            },
        },
    ])("stops MIME probes after $name without re-signing or anonymous fallback", async ({ changeSession }) => {
        (authState as any).value = createAuthState();
        const signEvent = vi.fn(async (template) => finalizeEvent(template, secretKeyA));
        (window as any).nostr = {
            getPublicKey: vi.fn(async () => pubkeyA),
            signEvent,
        };
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => {
            changeSession();
            return new Response(null, { status: 200 });
        });

        const probePromise = new BlossomUploadAdapter().testConnection({
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
            sampleFile: createBlossomProbeFile(),
        });

        await expect(probePromise).rejects.toThrow("Authentication required");
        expect(signEvent).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledOnce();
        const headers = (fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Record<string, string>;
        expect(headers.Authorization).toMatch(/^Nostr /);
    });

    it("does not start the initial HEAD when the session changes after signing", async () => {
        (authState as any).value = createAuthState();
        const signEvent = vi.fn(async (template) => {
            const signedEvent = finalizeEvent(template, secretKeyA);
            (authState as any).value = { ...authState.value, pubkey: pubkeyB };
            return signedEvent;
        });
        (window as any).nostr = {
            getPublicKey: vi.fn(async () => pubkeyA),
            signEvent,
        };
        const fetchMock = vi.fn();

        const probePromise = new BlossomUploadAdapter().testConnection({
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
            sampleFile: createBlossomProbeFile(),
        });

        await expect(probePromise).rejects.toThrow("Authentication required");
        expect(signEvent).toHaveBeenCalledOnce();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("does not start a normal Blossom PUT after switching accounts during signing", async () => {
        (authState as any).value = createAuthState();
        const signer = installDeferredNip07Signer();
        const fetchMock = vi.fn();
        const uploadPromise = new BlossomUploadAdapter().upload({
            file: new File(["data"], "test.png", { type: "image/png" }),
            destination: createBlossomDestination(),
            authService: new NostrAuthService(),
            fetch: fetchMock as unknown as typeof fetch,
        });

        await vi.waitFor(() => expect(signer.signEvent).toHaveBeenCalledOnce());
        (authState as any).value = { ...authState.value, pubkey: pubkeyB };
        signer.resolveValid();

        await expect(uploadPromise).resolves.toMatchObject({ success: false });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("does not start a normal Blossom PUT for a validly signed changed authorization event", async () => {
        const fetchMock = vi.fn();
        const result = await new BlossomUploadAdapter().upload({
            file: new File(["data"], "test.png", { type: "image/png" }),
            destination: createBlossomDestination(),
            authService: {
                buildAuthHeader: vi.fn(),
                getBlossomSigner: async () => ({
                    getPublicKey: async () => pubkeyA,
                    signEvent: async (template) => finalizeEvent({
                        ...template,
                        content: "changed by signer",
                    }, secretKeyA),
                }),
            },
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toMatchObject({ success: false });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("does not start a normal Blossom PUT when the injected signer mutates its template in place", async () => {
        const fetchMock = vi.fn();
        const result = await new BlossomUploadAdapter().upload({
            file: new File(["data"], "test.png", { type: "image/png" }),
            destination: createBlossomDestination(),
            authService: {
                buildAuthHeader: vi.fn(),
                getBlossomSigner: async () => ({
                    getPublicKey: async () => pubkeyA,
                    signEvent: async (template: any) => {
                        template.content = "changed in place by signer";
                        return finalizeEvent(template, secretKeyA);
                    },
                }),
            },
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toMatchObject({ success: false });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("does not publish BUD-03 when the signer mutates its template in place", async () => {
        const send = vi.fn();

        await expect(publishBud03ServerList({
            rxNostr: { send } as never,
            signer: {
                getPublicKey: async () => pubkeyA,
                signEvent: async (template: any) => {
                    template.tags[0][1] = "https://changed.example";
                    return finalizeEvent(template, secretKeyA);
                },
            },
            servers: ["https://blossom.example"],
            expectedPubkey: pubkeyA,
            assertSession: () => undefined,
        })).rejects.toThrow("Invalid signed event result");
        expect(send).not.toHaveBeenCalled();
    });

    it("does not publish BUD-03 after logout during signing", async () => {
        const session = { value: createAuthState() };
        const deferred = createDeferred<any>();
        let requestedTemplate: any;
        const send = vi.fn();
        const publishPromise = publishBud03ServerList({
            rxNostr: { send } as never,
            signer: {
                getPublicKey: async () => pubkeyA,
                signEvent: async (template) => {
                    requestedTemplate = template;
                    return deferred.promise;
                },
            },
            servers: ["https://blossom.example"],
            expectedPubkey: pubkeyA,
            assertSession: () => {
                if (!session.value.isAuthenticated || session.value.pubkey !== pubkeyA) {
                    throw new Error("Authentication required");
                }
            },
        });

        await vi.waitFor(() => expect(requestedTemplate).toBeDefined());
        logout(session);
        deferred.resolve(finalizeEvent(requestedTemplate, secretKeyA));

        await expect(publishPromise).rejects.toThrow("Authentication required");
        expect(send).not.toHaveBeenCalled();
    });

    it("rejects a correct NIP-42 event when account A changes to B during extension signing", async () => {
        (authState as any).value = createAuthState();
        const signer = installDeferredNip07Signer();
        const relay = "wss://relay.example/";
        const authenticator = createNip42Authenticator(pubkeyA)(relay);
        const authPromise = authenticator.signer!.signEvent({
            kind: 22242,
            content: "",
            tags: [["relay", relay], ["challenge", "challenge"]],
        } as never);

        await vi.waitFor(() => expect(signer.signEvent).toHaveBeenCalledOnce());
        (authState as any).value = { ...authState.value, pubkey: pubkeyB };
        signer.resolveValid();

        await expect(authPromise).rejects.toThrow("Authentication required");
    });
});
