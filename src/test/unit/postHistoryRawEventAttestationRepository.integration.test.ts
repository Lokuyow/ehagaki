import { usePostHistoryJsonlVerificationWorkerMock } from "../mocks/postHistoryJsonlVerificationWorker";
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
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import { DexieSensitivePayloadRepository } from "../../lib/storage/sensitivePayloadRepository";
import { PostHistoryJsonlVerificationWorkerMock } from "../mocks/postHistoryJsonlVerificationWorker";
import { getPostHistoryLocalRevision } from "../../lib/storage/postHistoryLocalWriteScope";
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
    it("bulk upserts ordinary authored kinds without per-event Sensitive Structure reads", async () => {
        const name = `${EHAGAKI_DB_NAME}-ordinary-bulk-${crypto.randomUUID()}`;
        databaseNames.add(name);
        const db = new EHagakiDB(name);
        const repository = new DexiePostHistoryRepository(db);
        const key = generateSecretKey();
        const kinds = [1, 6, 16, 42, 1111];
        // Exercise every kind across two distinct bulk writes and a duplicate
        // replay. Large signing/IndexedDB workloads belong in performance tests.
        const batchSize = kinds.length * 2;
        const events = Array.from({ length: batchSize * 2 }, (_, index) => {
            const event = finalizeEvent({ kind: kinds[index % kinds.length]!,
                content: `ordinary-${index}`, tags: [], created_at: 1_700_000_000 + index }, key);
            return attestFullyVerifiedPostHistoryRawEvent(event)!;
        });
        const get = vi.spyOn(db.postHistory, "get");
        verifyEventMock.mockClear();
        for (let offset = 0; offset < events.length; offset += batchSize) {
            expect(await repository.upsertFetchedEvents({ events: events.slice(offset, offset + batchSize) }))
                .toMatchObject({ insertedCount: batchSize });
        }
        expect(await repository.upsertFetchedEvents({ events }))
            .toMatchObject({ insertedCount: 0, unchangedCount: events.length });
        expect(get.mock.calls.length).toBe(0);
        expect(verifyEventMock).not.toHaveBeenCalled();
        await expect(db.postHistory.count()).resolves.toBe(events.length);
        db.close();
    });
    it.each([5,36])("keeps kind %s fallback cryptographic for missing, forged and mutated proofs", async kind => {
        const key=generateSecretKey();
        const signed=finalizeEvent({kind,content:"fixture",tags:kind===5?[["e","0".repeat(64)]]:[["k","1"]],created_at:123},key);
        const attested=attestFullyVerifiedPostHistoryRawEvent(signed)!;
        for(const mode of ["missing","forged","mutated"] as const) {
            const name=`${EHAGAKI_DB_NAME}-fallback-${kind}-${mode}-${crypto.randomUUID()}`;
            databaseNames.add(name);const db=new EHagakiDB(name);
            const event={...attested.event,tags:attested.event.tags.map(t=>[...t]),...(mode==="mutated"?{sig:"0".repeat(128)}:{})};
            const token=mode==="missing"?undefined:mode==="forged"?{}:attested.attestation;
            verifyEventMock.mockClear();
            const countsAtWrite:number[]=[];
            db.postHistoryDeletionRequests.hook("creating",()=>{countsAtWrite.push(verifyEventMock.mock.calls.length);});
            db.sensitivePayloads.hook("creating",()=>{countsAtWrite.push(verifyEventMock.mock.calls.length);});
            if(kind===5) {
                const result=await new DexiePostHistoryDeletionRequestsRepository(db).upsertImportedDeletionEvents({ownerPubkeyHex:event.pubkey,deletionEvents:[{event,attestation:token}]});
                expect(result.insertedCount).toBe(mode==="mutated"?0:1);
            } else {
                const save=new DexieSensitivePayloadRepository(db).putCandidate({event,attestation:token});
                if(mode==="mutated")await expect(save).rejects.toThrow("invalid_sensitive_payload_candidate");else await save;
            }
            expect(verifyEventMock).toHaveBeenCalled();
            expect(countsAtWrite).toEqual(mode==="mutated"?[]:[1]);
            db.close();
        }
    });
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
        const key = generateSecretKey();
        const event = finalizeEvent({kind:1,content:"post",tags:[],created_at:123},key);
        const deletion = finalizeEvent({kind:5,content:"",tags:[["e",event.id]],created_at:124},key);
        const payload = finalizeEvent({kind:36,content:"payload",tags:[["k","1"]],created_at:125},key);
        // Incoming attestations are reused; ordinary deletion targets also
        // skip the persisted Sensitive payload reconciliation entirely.
        db.postHistoryDeletionRequests.hook("creating", () => {
            expect(verifyEventMock).not.toHaveBeenCalled();
        });
        const importService = new PostHistoryJsonlImportService({
            getLocalRevision: owner => getPostHistoryLocalRevision(db,owner),
            postHistoryRepository: repository,
            deletionRequestsRepository: new DexiePostHistoryDeletionRequestsRepository(db),
            sensitivePayloadRepository: new DexieSensitivePayloadRepository(db),
        });
        verifyEventMock.mockClear();

        const result = await importService.importFile({
            file: createFile([event,deletion,payload].map(e=>JSON.stringify(e)).join("\n")),
            ownerPubkeyHex: event.pubkey,
            getCurrentPubkeyHex: () => event.pubkey,
        });

        expect(result.status).toBe("completed");
        expect(result.insertedPostCount).toBe(1);
        expect(result.insertedDeletionRequestCount).toBe(1);
        expect(result.savedPayloadCandidateCount).toBe(1);
        expect(verifyEventMock).not.toHaveBeenCalled();
        expect(PostHistoryJsonlVerificationWorkerMock.instances.flatMap(worker => worker.requests)).toHaveLength(3);
        await expect(db.postHistory.count()).resolves.toBe(1);
        db.close();
    });
});

usePostHistoryJsonlVerificationWorkerMock();
