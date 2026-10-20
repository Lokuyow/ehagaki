import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME } from "../../lib/storage/ehagakiDbConstants";
import {
    EHAGAKI_DB_UPGRADE_COMPLETE,
    createEhagakiDbUpgradeController,
} from "../../lib/storage/ehagakiDbUpgradeController";

afterEach(async () => {
    await Dexie.delete(EHAGAKI_DB_NAME);
});

async function openNative(version: number): Promise<void> {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(EHAGAKI_DB_NAME, version);
        request.onupgradeneeded = () => {
            request.result.createObjectStore("drafts", { keyPath: "id" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    db.close();
}

describe("eHagaki database upgrade controller", () => {
    it("does not report completion when the database is newer than this build", async () => {
        await openNative(180);
        const messages: string[] = [];
        const controller = createEhagakiDbUpgradeController({
            indexedDb: indexedDB,
            clients: {
                matchAll: async () => [{
                    id: "client",
                    postMessage: (message: unknown) => {
                        const type = (message as { type?: string }).type;
                        if (type) messages.push(type);
                    },
                }],
            },
        });
        await expect(controller.requestUpgrade()).resolves.toBe(false);
        expect(messages).not.toContain(EHAGAKI_DB_UPGRADE_COMPLETE);
        expect(await readVersion()).toBe(180);
    });

    it("reports completion for a Dexie patch inside the current version slot", async () => {
        await openNative(171);
        const messages: string[] = [];
        const controller = createEhagakiDbUpgradeController({
            indexedDb: indexedDB,
            clients: {
                matchAll: async () => [{
                    id: "client",
                    postMessage: (message: unknown) => {
                        const type = (message as { type?: string }).type;
                        if (type) messages.push(type);
                    },
                }],
            },
        });
        await expect(controller.requestUpgrade()).resolves.toBe(true);
        expect(messages).toContain(EHAGAKI_DB_UPGRADE_COMPLETE);
        expect(await readVersion()).toBe(171);
    });
});

function readVersion(): Promise<number> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(EHAGAKI_DB_NAME);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const version = request.result.version;
            request.result.close();
            resolve(version);
        };
    });
}
