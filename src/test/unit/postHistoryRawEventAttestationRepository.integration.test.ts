import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";

const verifyEventMock = vi.hoisted(() => vi.fn());

vi.mock("nostr-tools", async (importOriginal) => {
    const actual = await importOriginal<typeof import("nostr-tools")>();
    verifyEventMock.mockImplementation(actual.verifyEvent);
    return {
        ...actual,
        verifyEvent: verifyEventMock,
    };
});

import { finalizeEvent, generateSecretKey } from "nostr-tools";
import {
    attestFullyVerifiedPostHistoryRawEvent,
} from "../../lib/postHistoryRawEventVerification";
import { PostHistoryJsonlImportService } from "../../lib/postHistoryJsonlImportService";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import type { NostrEvent } from "../../lib/types";

const databaseNames = new Set<string>();

function createEvent(): NostrEvent {
    return finalizeEvent({
        kind: 1,
        content: "attested post",
        tags: [],
        created_at: 1_700_000_000,
    }, generateSecretKey()) as NostrEvent;
}

function createFile(content: string): Pick<File, "stream" | "size"> {
    const bytes = new TextEncoder().encode(content);
    return {
        size: bytes.byteLength,
        stream: () => new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(bytes);
                controller.close();
            },
        }),
    } as Pick<File, "stream" | "size">;
}

afterEach(async () => {
    verifyEventMock.mockClear();
    for (const name of databaseNames) {
        await Dexie.delete(name);
    }
    databaseNames.clear();
});

describe("post-history attestation repository boundary", () => {
    it("reuses a full attestation without a second Schnorr verification and keeps fallback cryptographic", async () => {
        const databaseName = `${EHAGAKI_DB_NAME}-attestation-${Date.now()}`;
        databaseNames.add(databaseName);
        const db = new EHagakiDB(databaseName);
        const repository = new DexiePostHistoryRepository(db);
        const attested = attestFullyVerifiedPostHistoryRawEvent(createEvent());
        expect(attested).not.toBeNull();
        verifyEventMock.mockClear();

        await repository.putPostedEvent({
            event: attested!.event,
            attestation: attested!.attestation,
        });
        expect(verifyEventMock).not.toHaveBeenCalled();

        const fallbackEvent = createEvent();
        await repository.putPostedEvent({ event: fallbackEvent });
        expect(verifyEventMock).toHaveBeenCalledTimes(1);
        await expect(db.postHistory.count()).resolves.toBe(2);
        db.close();
    });

    it("reuses the import attestation at repository persistence without a second Schnorr verification", async () => {
        const databaseName = `${EHAGAKI_DB_NAME}-import-attestation-${Date.now()}`;
        databaseNames.add(databaseName);
        const db = new EHagakiDB(databaseName);
        const repository = new DexiePostHistoryRepository(db);
        const event = createEvent();
        const importService = new PostHistoryJsonlImportService({
            postHistoryRepository: repository,
            deletionRequestsRepository: {
                upsertImportedDeletionEvents: async () => ({
                    insertedCount: 0,
                    updatedCount: 0,
                    unchangedCount: 0,
                    ignoredCount: 0,
                    appliedDeletionCount: 0,
                }),
            },
        });
        verifyEventMock.mockClear();

        const result = await importService.importFile({
            file: createFile(`${JSON.stringify(event)}\n`),
            ownerPubkeyHex: event.pubkey,
            getCurrentPubkeyHex: () => event.pubkey,
        });

        expect(result.status).toBe("completed");
        expect(result.insertedPostCount).toBe(1);
        expect(verifyEventMock).toHaveBeenCalledTimes(1);
        await expect(db.postHistory.count()).resolves.toBe(1);
        db.close();
    });
});
