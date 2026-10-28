import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PostResult } from "../../lib/types";
vi.mock("../../lib/storage/ehagakiDb", async importOriginal => {
    const original = await importOriginal<typeof import("../../lib/storage/ehagakiDb")>();
    return { ...original, ehagakiDb: new original.EHagakiDB("relay-delivery-receipt-test") };
});
import { ehagakiDb } from "../../lib/storage/ehagakiDb";
import { followPostHistoryDelivery } from "../../lib/storage/postHistoryDeliveryReceipt";

const id = "a".repeat(64), owner = "b".repeat(64);
beforeEach(async () => {
    await ehagakiDb.open();
    await ehagakiDb.postHistory.put({ id, eventId: id, pubkeyHex: owner, acceptedRelays: ["wss://first.example/"] } as never);
});
afterEach(async () => { await ehagakiDb.delete(); });

describe("late delivery receipts", () => {
    function pending() {
        let resolve!: (result: PostResult) => void;
        const deliverySettled = new Promise<PostResult>(done => { resolve = done; });
        return { resolve, save: followPostHistoryDelivery(id, owner, { success: true, deliverySettled }, 0) };
    }
    it("merges confirmed ACKs into an existing row without duplicates", async () => {
        const h = pending();
        h.resolve({ success: true, acceptedRelays: ["wss://first.example/", "wss://later.example/"] });
        await h.save;
        expect((await ehagakiDb.postHistory.get(id))!.acceptedRelays).toEqual(["wss://first.example/", "wss://later.example/"]);
    });
    it("does not recreate a row removed while delivery was pending", async () => {
        const h = pending();
        await ehagakiDb.postHistory.delete(id);
        h.resolve({ success: true, acceptedRelays: ["wss://later.example/"] });
        await h.save;
        expect(await ehagakiDb.postHistory.get(id)).toBeUndefined();
    });
    it("rejects receipts from a stale local-write generation", async () => {
        const h = pending();
        await ehagakiDb.postHistoryWriteGeneration.put({ id: owner, value: 1, updatedAt: 100 });
        h.resolve({ success: true, acceptedRelays: ["wss://later.example/"] });
        await h.save;
        expect((await ehagakiDb.postHistory.get(id))!.acceptedRelays).toEqual(["wss://first.example/"]);
    });
});
