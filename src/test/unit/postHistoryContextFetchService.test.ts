import { afterEach, describe, expect, it, vi } from "vitest";

const rxReqMock = vi.hoisted(() => ({ emit: vi.fn(), over: vi.fn() }));

vi.mock("rx-nostr", () => ({
    createRxBackwardReq: vi.fn(() => rxReqMock),
}));
vi.mock("../../lib/postHistoryRawEventVerification", () => ({
    RAW_EVENT_VERIFICATION_RULE_VERSION: 1,
    attestFullyVerifiedPostHistoryRawEvent: (event: unknown) => ({ event, attestation: {} }),
    isCurrentPostHistoryRawEventAttestation: () => true,
    usePostHistoryRelayEvents: (rxNostr: { use: Function }, rxReq: unknown, options: unknown) =>
        rxNostr.use(rxReq, options),
}));

import { PostHistoryContextFetchService } from "../../lib/postHistoryContextFetchService";
import {
    activateHostRelayConfig,
    deactivateHostRelayConfig,
} from "../../lib/hostRelayRuntime";

afterEach(() => deactivateHostRelayConfig());

describe("PostHistoryContextFetchService", () => {
    it("merges all Host read defaults with only the limited contextual hint set", async () => {
        const hostConfig = Object.fromEntries(Array.from({ length: 9 }, (_, index) => [
            `wss://host-read-${index + 1}.example`,
            { read: true, write: false },
        ]));
        activateHostRelayConfig(hostConfig);
        const rxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: ({ complete }: { complete: () => void }) => {
                    complete();
                    return { unsubscribe: vi.fn() };
                },
            }),
        };
        const service = new PostHistoryContextFetchService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });

        await service.fetchEventById(rxNostr as any, {
            eventId: "a".repeat(64),
            relayConfig: hostConfig,
            relayHints: Array.from({ length: 10 }, (_, index) => `wss://hint-${index + 1}.example`),
        }).promise;

        expect(rxNostr.use).toHaveBeenCalledWith(rxReqMock, {
            on: {
                relays: [
                    ...Array.from({ length: 9 }, (_, index) => `wss://host-read-${index + 1}.example/`),
                    ...Array.from({ length: 8 }, (_, index) => `wss://hint-${index + 1}.example/`),
                ],
            },
        });
    });

    it("returns a related event from an existing hint while NIP-65 lookup is still pending", async () => {
        const eventId = "a".repeat(64);
        const author = "b".repeat(64);
        const targetEvent = {
            id: eventId,
            pubkey: author,
            kind: 1,
            created_at: 1,
            tags: [],
            content: "related event",
            sig: "c".repeat(128),
        };
        let finishLookup!: (relays: string[]) => void;
        const lookupAuthorWriteRelaysFn = vi.fn(() => new Promise<string[]>((resolve) => {
            finishLookup = resolve;
        }));
        const hintRelay = "wss://explicit-hint.example/";
        const rxNostr = {
            use: vi.fn((_request: unknown, options: any) => ({
                subscribe: (observer: any) => {
                    expect(options.on.relays).toContain(hintRelay);
                    observer.next({ event: targetEvent, from: hintRelay });
                    return { unsubscribe: vi.fn() };
                },
            })),
        };
        const service = new PostHistoryContextFetchService({
            lookupAuthorWriteRelaysFn,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });

        const task = service.fetchEventById(rxNostr as any, {
            eventId,
            authorHint: author,
            relayHints: [hintRelay],
        });
        await expect(task.promise).resolves.toMatchObject({
            event: targetEvent,
            relayUrl: hintRelay,
        });
        expect(rxNostr.use).toHaveBeenCalledOnce();
        finishLookup(["wss://author-write.example/"]);
        await Promise.resolve();
        expect(rxNostr.use).toHaveBeenCalledOnce();
    });

    it("does not let queued author lookups delay existing hint searches for multiple authors", async () => {
        const eventIds = Array.from({ length: 5 }, (_, index) => "e".repeat(63) + String(index + 1));
        const hintRelay = "wss://known-hint.example/";
        const lookups: Array<(relays: string[]) => void> = [];
        let searchIndex = 0;
        const rxNostr = {
            use: vi.fn((request: unknown, options: any) => ({
                subscribe: (observer: any) => {
                    expect(options.on.relays).toContain(hintRelay);
                    const queryIndex = searchIndex++;
                    observer.next({
                        event: {
                            id: eventIds[queryIndex],
                            pubkey: "f".repeat(64),
                            kind: 1,
                            created_at: 1,
                            tags: [],
                            content: "existing path",
                            sig: "0".repeat(128),
                        },
                        from: hintRelay,
                    });
                    return { unsubscribe: vi.fn() };
                },
            })),
        };
        const service = new PostHistoryContextFetchService({
            lookupAuthorWriteRelaysFn: vi.fn(() => new Promise<string[]>((resolve) => lookups.push(resolve))),
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });

        const tasks = eventIds.map((eventId, index) => service.fetchEventById(rxNostr as any, {
            eventId,
            authorHint: String(index).repeat(64),
            relayHints: [hintRelay],
        }));
        await expect(Promise.all(tasks.map((task) => task.promise))).resolves.toHaveLength(5);
        expect(rxNostr.use).toHaveBeenCalledTimes(5);
        expect(lookups).toHaveLength(5);
    });
});
