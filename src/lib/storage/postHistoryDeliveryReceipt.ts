import { ehagakiDb } from "./ehagakiDb";
import { getPostHistoryLocalRevision } from "./postHistoryLocalWriteScope";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { PostResult } from "../types";

/** Late ACKs only enrich an existing row in the captured local-write generation. */
export async function followPostHistoryDelivery(eventId: string, ownerPubkeyHex: string, result: PostResult, expectedRevision: number): Promise<void> {
    if (!result.deliverySettled) return;
    const final = await result.deliverySettled;
    if (!ehagakiDb.isOpen()) return;
    await ehagakiDb.transaction("rw", ehagakiDb.postHistory, ehagakiDb.postHistoryWriteGeneration, async () => {
        if (await getPostHistoryLocalRevision(ehagakiDb, ownerPubkeyHex) !== expectedRevision) return;
        const existing = await ehagakiDb.postHistory.get(eventId);
        if (!existing || existing.pubkeyHex !== ownerPubkeyHex || existing.deletedAt) return;
        await ehagakiDb.postHistory.update(eventId, {
            acceptedRelays: RelayConfigUtils.sanitizeExternalRelayUrls([...existing.acceptedRelays, ...(final.acceptedRelays ?? [])]),
        });
    });
}
