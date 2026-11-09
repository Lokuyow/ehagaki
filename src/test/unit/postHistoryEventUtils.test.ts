import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { describe, expect, it } from "vitest";
import {
    createTransientPostHistoryRecord,
    isPostHistoryRawEventConsistent,
} from "../../lib/postHistoryEventUtils";

const event = finalizeEvent({
    kind: 1,
    content: "hello",
    tags: [["t", "nostr"]],
    created_at: 1_700_000_000,
}, generateSecretKey());

describe("createTransientPostHistoryRecord", () => {
    it("keeps createdAt in seconds so the raw event stays consistent", () => {
        const record = createTransientPostHistoryRecord(event, [], 123);

        expect(record.createdAt).toBe(1_700_000_000);
        expect(record.postedAt).toBe(1_700_000_000_000);
        expect(record.updatedAt).toBe(123);
        expect(isPostHistoryRawEventConsistent(record.rawEvent, record)).toBe(true);
    });

    it("copies relay URLs and tags instead of sharing them", () => {
        const relayUrls = ["wss://relay.example"];
        const record = createTransientPostHistoryRecord(event, relayUrls);

        expect(record.relayHints).toEqual(relayUrls);
        expect(record.acceptedRelays).toEqual(relayUrls);
        expect(record.fetchedRelays).toEqual(relayUrls);
        expect(record.relayHints).not.toBe(relayUrls);
        expect(record.tags).toEqual(event.tags);
        expect(record.tags[0]).not.toBe(event.tags[0]);
    });

    it("defaults to no relay hints", () => {
        const record = createTransientPostHistoryRecord(event);

        expect(record.relayHints).toEqual([]);
        expect(record.acceptedRelays).toEqual([]);
        expect(record.fetchedRelays).toEqual([]);
    });
});
