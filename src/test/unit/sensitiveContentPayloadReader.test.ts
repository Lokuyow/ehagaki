import { beforeEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import type { NostrEvent } from "../../lib/types";
import { createDeferred } from "../deferredTestUtils";

const mocks = vi.hoisted(() => ({
    getByIds: vi.fn(),
    putCandidate: vi.fn(),
    fetchEventById: vi.fn(),
}));

vi.mock("../../lib/storage/sensitivePayloadRepository", () => ({
    sensitivePayloadRepository: {
        getByIds: mocks.getByIds,
        putCandidate: mocks.putCandidate,
    },
}));

vi.mock("../../lib/postHistoryContextFetchService", () => ({
    postHistoryContextFetchService: { fetchEventById: mocks.fetchEventById },
}));

import {
    createSensitivePayloadBodyLoader,
    loadSensitivePayloadContent,
} from "../../lib/sensitiveContentPayloadReader";

function createPair(secretKey: Uint8Array) {
    const payload = finalizeEvent({
        kind: 36,
        content: "protected body",
        created_at: 100,
        tags: [["k", "1"]],
    }, secretKey) as NostrEvent;
    const structure = finalizeEvent({
        kind: 1,
        content: "",
        created_at: 100,
        tags: [["content-warning", "reason"], ["c", payload.id, "wss://hint.example.com/"]],
    }, secretKey) as NostrEvent;
    return { payload, structure };
}

describe("sensitiveContentPayloadReader", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("does not fetch or reveal a tombstoned payload even if the Relay still has it", async () => {
        const { payload, structure } = createPair(generateSecretKey());
        mocks.getByIds.mockResolvedValue([{ id: payload.id, rawEvent: payload, deletedAt: 123 }]);
        await expect(loadSensitivePayloadContent({ structure, rxNostr: {} as never })).resolves.toBeNull();
        expect(mocks.fetchEventById).not.toHaveBeenCalled();
    });

    it("rechecks deletion after an in-flight fetch and cache reconciliation", async () => {
        const { payload, structure } = createPair(generateSecretKey());
        const fetched = createDeferred<{ event: NostrEvent; relayUrl: string }>();
        mocks.getByIds.mockResolvedValueOnce([]).mockResolvedValue([{ id: payload.id, rawEvent: payload, deletedAt: 123 }]);
        mocks.fetchEventById.mockReturnValue({ promise: fetched.promise, cancel: vi.fn() });
        const pending = loadSensitivePayloadContent({ structure, rxNostr: {} as never });
        await vi.waitFor(() => expect(mocks.fetchEventById).toHaveBeenCalledOnce());
        fetched.resolve({ event: payload, relayUrl: "wss://source.example.com/" });
        await expect(pending).resolves.toBeNull();
    });

    it("cancels the scoped transport and ignores a result delivered after cancellation", async () => {
        const { payload, structure } = createPair(generateSecretKey());
        const fetched = createDeferred<{ event: NostrEvent; relayUrl: string }>();
        mocks.getByIds.mockResolvedValue([]);
        const cancel = vi.fn();
        mocks.fetchEventById.mockReturnValue({ promise: fetched.promise, cancel });
        const controller = new AbortController();
        const pending = loadSensitivePayloadContent({ structure, rxNostr: {} as never, signal: controller.signal });
        await vi.waitFor(() => expect(mocks.fetchEventById).toHaveBeenCalledOnce());
        controller.abort();
        fetched.resolve({ event: payload, relayUrl: "wss://source.example.com/" });
        await expect(pending).resolves.toBeNull();
        expect(cancel).toHaveBeenCalledOnce();
        expect(mocks.putCandidate).not.toHaveBeenCalled();
    });

    it("does not read cache or fetch until the preview invokes the explicit reveal loader", async () => {
        const secretKey = generateSecretKey();
        const { payload, structure } = createPair(secretKey);
        mocks.getByIds.mockResolvedValue([{
            id: payload.id,
            pubkeyHex: payload.pubkey,
            structureKind: 1,
            rawEvent: payload,
            acceptedRelays: [],
            fetchedRelays: [],
            relayHints: [],
            createdAt: 100,
            updatedAt: 100,
            schemaVersion: 1,
        }]);
        const load = createSensitivePayloadBodyLoader({
            structure,
            rxNostr: {} as never,
        });

        expect(mocks.getByIds).not.toHaveBeenCalled();
        expect(mocks.fetchEventById).not.toHaveBeenCalled();
        await expect(load?.()).resolves.toBe("protected body");
        expect(mocks.getByIds).toHaveBeenCalledWith([payload.id]);
        expect(mocks.fetchEventById).not.toHaveBeenCalled();
    });

    it("rejects invalid cached and fetched pairs instead of revealing candidate text", async () => {
        const secretKey = generateSecretKey();
        const { structure } = createPair(secretKey);
        const wrongK = finalizeEvent({
            kind: 36,
            content: "must not appear",
            created_at: 100,
            tags: [["k", "42"]],
        }, secretKey) as NostrEvent;
        const wrongStructure = finalizeEvent({
            kind: 1,
            content: "",
            created_at: 100,
            tags: [["content-warning", "reason"], ["c", wrongK.id, "wss://hint.example.com/"]],
        }, secretKey) as NostrEvent;
        mocks.getByIds.mockResolvedValue([{
            id: wrongK.id,
            pubkeyHex: wrongK.pubkey,
            structureKind: 1,
            rawEvent: wrongK,
            acceptedRelays: [],
            fetchedRelays: [],
            relayHints: [],
            createdAt: 100,
            updatedAt: 100,
            schemaVersion: 1,
        }]);
        mocks.fetchEventById.mockReturnValue({
            promise: Promise.resolve({ event: wrongK, relayUrl: "wss://source.example.com/" }),
            cancel: vi.fn(),
        });

        await expect(loadSensitivePayloadContent({
            structure: wrongStructure,
            rxNostr: {} as never,
        })).resolves.toBeNull();
        expect(mocks.fetchEventById).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
            eventId: wrongK.id,
            relayHints: ["wss://hint.example.com/"],
        }));
        expect(mocks.putCandidate).not.toHaveBeenCalled();
    });
});
