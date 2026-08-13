import type { PostHistoryRecord } from "./storage/ehagakiDb";
import { toNevent } from "./utils/nostrUtils";

export function buildPostHistoryNevent(
    post: PostHistoryRecord,
    writeRelays: string[] = [],
): string {
    return toNevent({
        eventId: post.eventId,
        authorPubkey: post.pubkeyHex,
        kind: post.kind,
        acceptedRelays: post.acceptedRelays,
        relayHints: post.relayHints,
        writeRelays,
    });
}
