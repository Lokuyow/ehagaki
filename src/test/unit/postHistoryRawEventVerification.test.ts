import "fake-indexeddb/auto";
import Dexie from "dexie";
import { verifier } from "@rx-nostr/crypto";
import {
    createRxBackwardReq,
    createRxForwardReq,
    createRxNostr,
} from "rx-nostr";
import { finalizeEvent, generateSecretKey, verifyEvent } from "nostr-tools";
import { afterEach, describe, expect, it } from "vitest";
import {
    attestFullyVerifiedPostHistoryRawEvent,
    createPostHistoryRelayEventSource,
    isCurrentPostHistoryRawEventAttestation,
} from "../../lib/postHistoryRawEventVerification";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import type { NostrEvent } from "../../lib/types";

const testDbNames = new Set<string>();

class MockWebSocket {
    static instances: MockWebSocket[] = [];

    readyState = 0;
    sent: string[] = [];
    private readonly listeners = new Map<string, Set<(event?: any) => void>>();

    constructor(readonly url: string) {
        MockWebSocket.instances.push(this);
        queueMicrotask(() => {
            this.readyState = 1;
            this.dispatch("open");
        });
    }

    addEventListener(type: string, callback: (event?: any) => void): void {
        const callbacks = this.listeners.get(type) ?? new Set();
        callbacks.add(callback);
        this.listeners.set(type, callbacks);
    }

    removeEventListener(type: string, callback: (event?: any) => void): void {
        this.listeners.get(type)?.delete(callback);
    }

    send(data: string): void {
        this.sent.push(data);
    }

    close(): void {
        this.readyState = 3;
        this.dispatch("close", { type: "close", code: 1000, reason: "" });
    }

    receive(message: unknown[]): void {
        this.dispatch("message", { type: "message", data: JSON.stringify(message) });
    }

    private dispatch(type: string, event?: any): void {
        for (const callback of this.listeners.get(type) ?? []) {
            callback(event);
        }
    }
}

function createEvent(): NostrEvent {
    const event = finalizeEvent({
        kind: 1,
        content: "verified event",
        tags: [],
        created_at: 1_700_000_000,
    }, generateSecretKey());
    return event as NostrEvent;
}

async function waitForSocketMessages(
    socket: MockWebSocket,
    minimumCount: number,
): Promise<unknown[][]> {
    for (let attempt = 0; attempt < 20; attempt += 1) {
        const messages = socket.sent
            .map((item) => JSON.parse(item) as unknown[])
            .filter((item) => item[0] === "REQ");
        if (messages.length >= minimumCount) {
            return messages;
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
    throw new Error("relay request was not sent");
}

async function waitForSocket(): Promise<MockWebSocket> {
    for (let attempt = 0; attempt < 20; attempt += 1) {
        const socket = MockWebSocket.instances[0];
        if (socket) {
            return socket;
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
    throw new Error("relay socket was not opened");
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
    MockWebSocket.instances = [];
});

describe("post-history raw event verification", () => {
    it.each([
        { strategy: "forward" as const, target: "default" as const },
        { strategy: "forward" as const, target: "temporary" as const },
        { strategy: "backward" as const, target: "default" as const },
        { strategy: "backward" as const, target: "temporary" as const },
    ])("uses the real RxNostr verifier before the relay source ($strategy/$target)", async ({ strategy, target }) => {
        const relayUrl = "wss://relay.example.com/";
        const rxNostr = createRxNostr({
            verifier,
            skipVerify: false,
            skipFetchNip11: true,
            retry: { strategy: "off" },
            websocketCtor: MockWebSocket as never,
        });
        if (target === "default") {
            rxNostr.setDefaultRelays([{ url: relayUrl, read: true, write: false }]);
        }

        const relaySource = createPostHistoryRelayEventSource(rxNostr);
        const rxReq = strategy === "forward" ? createRxForwardReq() : createRxBackwardReq();
        const plainRxReq = strategy === "forward" ? createRxForwardReq() : createRxBackwardReq();
        const received: NostrEvent[] = [];
        const plainReceived: NostrEvent[] = [];
        const useOptions = {
            on: target === "default"
                ? { defaultReadRelays: true }
                : { relays: [relayUrl] },
        };
        const subscription = relaySource.use(rxReq, {
            ...useOptions,
        }).subscribe((packet) => received.push(packet.event));
        const plainSubscription = rxNostr.use(plainRxReq, useOptions)
            .subscribe((packet) => plainReceived.push(packet.event as NostrEvent));
        const event = createEvent();
        const invalidSignature = { ...event, sig: "0".repeat(128) };
        const invalidId = { ...event, id: "0".repeat(64) };

        (rxReq as typeof rxReq & { emit: (filter: unknown) => void }).emit({ kinds: [1] });
        (plainRxReq as typeof plainRxReq & { emit: (filter: unknown) => void })
            .emit({ kinds: [1] });
        const socket = await waitForSocket();
        const requests = await waitForSocketMessages(socket, 2);
        for (const request of requests) {
            const subId = request[1] as string;
            socket.receive(["EVENT", subId, event]);
            socket.receive(["EVENT", subId, invalidSignature]);
            socket.receive(["EVENT", subId, invalidId]);
            if (strategy === "backward") {
                socket.receive(["EOSE", subId]);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(received).toHaveLength(1);
        expect(received[0]).toMatchObject({
            id: event.id,
            pubkey: event.pubkey,
            kind: event.kind,
            content: event.content,
            tags: event.tags,
            sig: event.sig,
        });
        expect(plainReceived.map((item) => item.id)).toEqual([event.id, invalidId.id]);
        subscription.unsubscribe();
        plainSubscription.unsubscribe();
        rxNostr.dispose();
    });

    it("requires a runtime attestation that matches the exact raw snapshot", () => {
        const event = createEvent();
        const attested = attestFullyVerifiedPostHistoryRawEvent(event);
        expect(attested).not.toBeNull();
        expect(isCurrentPostHistoryRawEventAttestation(
            attested!.event,
            attested!.attestation,
        )).toBe(true);
        expect(isCurrentPostHistoryRawEventAttestation(
            { ...attested!.event, content: "changed" },
            attested!.attestation,
        )).toBe(false);
        expect(isCurrentPostHistoryRawEventAttestation(
            createEvent(),
            attested!.attestation,
        )).toBe(false);
        expect(isCurrentPostHistoryRawEventAttestation(
            attested!.event,
            {} as never,
        )).toBe(false);
    });

    it("fully verifies a plain snapshot instead of trusting nostr-tools' verifiedSymbol cache", () => {
        const validEvent = createEvent();
        expect(attestFullyVerifiedPostHistoryRawEvent(validEvent)).not.toBeNull();

        const staleCachedEvent = createEvent();
        staleCachedEvent.sig = "0".repeat(128);
        // finalizeEvent marked the source object as verified before its sig
        // changed, so direct nostr-tools verification demonstrates the cache.
        expect(verifyEvent(staleCachedEvent as never)).toBe(true);
        expect(attestFullyVerifiedPostHistoryRawEvent(staleCachedEvent)).toBeNull();
    });

    it("keeps the repository direct-call fallback cryptographic", async () => {
        const databaseName = `${EHAGAKI_DB_NAME}-raw-verification-${Date.now()}`;
        testDbNames.add(databaseName);
        const db = new EHagakiDB(databaseName);
        const repository = new DexiePostHistoryRepository(db);
        const event = createEvent();
        await repository.putPostedEvent({ event });
        await expect(repository.putPostedEvent({
            event: { ...event, id: "f".repeat(64) },
        })).rejects.toThrow("invalid_post_history_raw_event");
        const staleCachedEvent = createEvent();
        staleCachedEvent.sig = "0".repeat(128);
        await expect(repository.putPostedEvent({
            event: staleCachedEvent,
        })).rejects.toThrow("invalid_post_history_raw_event");
        await expect(db.postHistory.count()).resolves.toBe(1);
        db.close();
    });
});
