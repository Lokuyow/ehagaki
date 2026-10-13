import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { EHAGAKI_DB_NATIVE_VERSION } from "../../lib/storage/ehagakiDbConstants";
import { installAppOriginEhagakiDatabaseGate } from "../../lib/storage/ehagakiDbPageGate";
import { resetEhagakiDbOpenGateForTests } from "../../lib/storage/ehagakiDbOpenGate";
import { LEGACY_DRAFTS_IMPORT_ID } from "../../lib/storage/legacyImportMarkers";

const names = new Set<string>();

afterEach(async () => {
    resetEhagakiDbOpenGateForTests();
    document.getElementById("ehagaki-db-gate-notice")?.remove();
    for (const name of names) await Dexie.delete(name);
    names.clear();
});

function databaseName(): string {
    const name = `ehagaki-gate-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    names.add(name);
    return name;
}

function host(serviceWorker?: {
    controller: { postMessage: (message: unknown) => void } | null;
    addEventListener: (type: string, listener: EventListener) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
    getRegistration: () => Promise<unknown>;
}): Window {
    return {
        navigator: serviceWorker ? { serviceWorker } : {},
        document,
        localStorage,
        indexedDB,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
    } as unknown as Window;
}

async function seedVersion160(name: string): Promise<void> {
    const db = new Dexie(name);
    db.version(16).stores({
        meta: "key, updatedAt",
        drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
        postHistory: "id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt]",
        sensitivePayloads: "id, pubkeyHex, structureKind, createdAt, updatedAt, deletedAt",
        postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
        postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
    });
    await db.open();
    await db.table("meta").put({ key: LEGACY_DRAFTS_IMPORT_ID, value: true, updatedAt: 4 });
    await db.table("postHistory").put({
        id: "event-v16",
        eventId: "event-v16",
        pubkeyHex: "owner",
        createdAt: 10,
        postedAt: 10,
        updatedAt: 1,
    });
    await db.table("sensitivePayloads").put({
        id: "payload-v16",
        pubkeyHex: "owner",
        updatedAt: 1,
    });
    await db.table("postHistoryChildInteractions").put({
        id: "child-v16",
        eventId: "child-v16",
        updatedAt: 1,
    });
    await db.table("drafts").put({ id: "draft", scopeKey: "owner", updatedAt: 1 });
    await db.table("postHistoryDeletionRequests").put({
        id: "delete",
        targetEventId: "event-v16",
    });
    db.close();
}

async function readVersion(name: string): Promise<number> {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(name);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    const version = db.version;
    db.close();
    return version;
}

describe("eHagaki database open gate", () => {
    it("runs the shared migration in dev even when the Service Worker API exists", async () => {
        const name = databaseName();
        await seedVersion160(name);
        installAppOriginEhagakiDatabaseGate(host({
            controller: null,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            getRegistration: () => Promise.resolve(undefined),
        }), {
            databaseName: name,
            indexedDb: indexedDB,
            controllerWaitMs: 60_000,
            serviceWorkerUpgrade: false,
        });
        const db = new EHagakiDB(name);
        await db.open();
        expect(db.backendDB().version).toBe(EHAGAKI_DB_NATIVE_VERSION);
        await expect(db.postHistory.count()).resolves.toBe(0);
        await expect(db.drafts.get("draft")).resolves.toMatchObject({ id: "draft" });
        db.close();
    });
    it("runs the shared migration without a Service Worker before Dexie opens", async () => {
        const name = databaseName();
        await seedVersion160(name);
        installAppOriginEhagakiDatabaseGate(host(), {
            databaseName: name,
            indexedDb: indexedDB,
            controllerWaitMs: 20,
        });
        const db = new EHagakiDB(name);
        await db.open();
        expect(db.backendDB().version).toBe(EHAGAKI_DB_NATIVE_VERSION);
        await expect(db.postHistory.count()).resolves.toBe(0);
        await expect(db.sensitivePayloads.count()).resolves.toBe(0);
        await expect(db.postHistoryChildInteractions.count()).resolves.toBe(0);
        await expect(db.drafts.get("draft")).resolves.toMatchObject({ id: "draft" });
        await expect(db.postHistoryDeletionRequests.get("delete")).resolves.toMatchObject({
            targetEventId: "event-v16",
        });
        await expect(db.legacyImportState.get(LEGACY_DRAFTS_IMPORT_ID)).resolves.toMatchObject({ done: true });
        expect(db.backendDB().objectStoreNames.contains("meta")).toBe(false);
        db.close();
    });

    it("does not open Dexie when registration fails and the controller is missing", async () => {
        const name = databaseName();
        await seedVersion160(name);
        installAppOriginEhagakiDatabaseGate(host({
            controller: null,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            getRegistration: () => Promise.reject(new Error("registration failed")),
        }), {
            databaseName: name,
            indexedDb: indexedDB,
            controllerWaitMs: 20,
        });
        let opened = false;
        const opening = new EHagakiDB(name).open().then(() => {
            opened = true;
        });
        await new Promise((resolve) => setTimeout(resolve, 40));
        expect(opened).toBe(false);
        expect(document.querySelector("[data-ehagaki-db-gate='retry']")).toBeTruthy();
        expect(await readVersion(name)).toBe(160);
        document.querySelector<HTMLButtonElement>("#ehagaki-db-gate-notice button")?.click();
        await opening;
        expect(opened).toBe(true);
        expect(await readVersion(name)).toBe(EHAGAKI_DB_NATIVE_VERSION);
        const db = new EHagakiDB(name);
        await expect(db.postHistory.count()).resolves.toBe(0);
        await expect(db.drafts.get("draft")).resolves.toMatchObject({ id: "draft" });
        db.close();
    });

    it("keeps the v160 database while an upgrade is blocked, then finishes after the connection closes", async () => {
        const name = databaseName();
        await seedVersion160(name);
        const blocker = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, 160);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        blocker.onversionchange = () => undefined;
        installAppOriginEhagakiDatabaseGate(host(), {
            databaseName: name,
            indexedDb: indexedDB,
            controllerWaitMs: 20,
        });
        let opened = false;
        const opening = new EHagakiDB(name).open().then(() => {
            opened = true;
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(opened).toBe(false);
        expect(blocker.version).toBe(160);
        expect(document.querySelector("[data-ehagaki-db-gate='blocked']")).toBeTruthy();
        const post = await new Promise((resolve, reject) => {
            const request = blocker.transaction("postHistory").objectStore("postHistory").get("event-v16");
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        expect(post).toMatchObject({ eventId: "event-v16" });
        blocker.close();
        await opening;
        expect(opened).toBe(true);
        const db = new EHagakiDB(name);
        await db.open();
        expect(db.backendDB().version).toBe(EHAGAKI_DB_NATIVE_VERSION);
        await expect(db.postHistory.count()).resolves.toBe(0);
        await expect(db.drafts.get("draft")).resolves.toMatchObject({ id: "draft" });
        db.close();
    });

    it("does not delete the database or open Dexie after VersionError", async () => {
        const name = databaseName();
        const newer = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, 180);
            request.onupgradeneeded = () => {
                request.result.createObjectStore("drafts", { keyPath: "id" });
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        newer.close();
        installAppOriginEhagakiDatabaseGate(host(), {
            databaseName: name,
            indexedDb: indexedDB,
            controllerWaitMs: 20,
        });
        let opened = false;
        void new EHagakiDB(name).open().then(() => {
            opened = true;
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(opened).toBe(false);
        expect(document.querySelector("[data-ehagaki-db-gate='versionError']")).toBeTruthy();
        expect(document.querySelector("#ehagaki-db-gate-notice button")).toBeNull();
        expect(await readVersion(name)).toBe(180);
    });

    it("shows a retry notice and does not open Dexie when page migration fails", async () => {
        const name = databaseName();
        await seedVersion160(name);
        const failingIndexedDb = {
            open: () => {
                const request = {
                    error: new DOMException("upgrade failed", "UnknownError"),
                    result: null,
                    transaction: null,
                    onupgradeneeded: null as ((event: IDBVersionChangeEvent) => void) | null,
                    onblocked: null as (() => void) | null,
                    onerror: null as (() => void) | null,
                    onsuccess: null as (() => void) | null,
                };
                queueMicrotask(() => request.onerror?.());
                return request;
            },
        } as unknown as IDBFactory;
        installAppOriginEhagakiDatabaseGate(host(), {
            databaseName: name,
            indexedDb: failingIndexedDb,
            controllerWaitMs: 20,
        });
        let opened = false;
        void new EHagakiDB(name).open().then(() => {
            opened = true;
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(opened).toBe(false);
        expect(document.querySelector("[data-ehagaki-db-gate='retry']")).toBeTruthy();
        expect(await readVersion(name)).toBe(160);
        document.querySelector<HTMLButtonElement>("#ehagaki-db-gate-notice button")?.click();
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(opened).toBe(false);
        expect(await readVersion(name)).toBe(160);
    });
});
