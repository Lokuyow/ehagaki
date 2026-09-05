import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { describe, expect, it } from "vitest";

import {
    selectPreloadedProfiles,
    selectVerifiedPreloadedEvents,
    validateEmbedComposerSetContextPayload,
} from "../../lib/embedComposerContextValidation";
import { createPlainNostrEventSnapshot } from "../../lib/postHistoryEventUtils";

function createSignedEvent(content = "hello") {
    return finalizeEvent(
        {
            kind: 1,
            content,
            tags: [],
            created_at: 1,
        },
        generateSecretKey(),
    );
}

function createReference(
    event: { id: string; pubkey: string },
    authorPubkey: string | null = event.pubkey,
    mode: "reply" | "quote" = "reply",
) {
    return {
        eventId: event.id,
        authorPubkey,
        mode,
    };
}

describe("selectVerifiedPreloadedEvents", () => {
    it("validates and returns a detached plain snapshot", () => {
        const event = createSignedEvent();
        const externalEvent = {
            ...event,
            extra: { shouldNotBeForwarded: true },
        } as typeof event & { extra: unknown };
        const metadataSymbol = Symbol("verifiedSymbol");
        Object.defineProperty(externalEvent, metadataSymbol, {
            value: true,
            enumerable: false,
        });

        const selected = selectVerifiedPreloadedEvents(
            { [event.id]: externalEvent },
            [createReference(event)],
        );

        expect(selected[event.id]).toEqual(createPlainNostrEventSnapshot(event));
        expect(selected[event.id]).not.toBe(externalEvent);
        expect(Object.keys(selected[event.id])).toEqual([
            "id",
            "pubkey",
            "created_at",
            "kind",
            "tags",
            "content",
            "sig",
        ]);
        expect(Object.getOwnPropertySymbols(selected[event.id])).toHaveLength(0);

        externalEvent.content = "changed after selection";
        expect(selected[event.id].content).toBe("hello");
    });

    it("does not trust a library verification cache on the external object", () => {
        const event = createSignedEvent();
        // Populate nostr-tools' verified marker, then invalidate only the
        // external object before the selector creates its plain snapshot.
        expect(() => selectVerifiedPreloadedEvents(
            { [event.id]: event },
            [createReference(event)],
        )).not.toThrow();
        event.sig = "0".repeat(128);

        expect(selectVerifiedPreloadedEvents(
            { [event.id]: event },
            [createReference(event)],
        )).toEqual({});
    });

    it("accepts one preload for reply and quote targets sharing an event ID when all author hints match", () => {
        const event = createSignedEvent();

        const selected = selectVerifiedPreloadedEvents(
            { [event.id]: event },
            [
                createReference(event, event.pubkey, "reply"),
                createReference(event, event.pubkey, "quote"),
            ],
        );

        expect(selected[event.id]).toEqual(createPlainNostrEventSnapshot(event));
    });

    it("rejects a preload when any target sharing its event ID has a mismatched author hint", () => {
        const event = createSignedEvent();

        const selected = selectVerifiedPreloadedEvents(
            { [event.id]: event },
            [
                createReference(event, event.pubkey, "reply"),
                createReference(event, "f".repeat(64), "quote"),
            ],
        );

        expect(selected).toEqual({});
    });

    it("allows a null author hint alongside a matching author hint for the same event ID", () => {
        const event = createSignedEvent();

        const selected = selectVerifiedPreloadedEvents(
            { [event.id]: event },
            [
                createReference(event, null, "reply"),
                createReference(event, event.pubkey, "quote"),
            ],
        );

        expect(selected[event.id]).toEqual(createPlainNostrEventSnapshot(event));
    });

    it.each([
        ["null container", null],
        ["invalid container", 123],
        ["array container", []],
        ["missing target key", {}],
    ])("treats %s as no preload", (_label, value) => {
        const event = createSignedEvent();
        expect(selectVerifiedPreloadedEvents(value, [createReference(event)])).toEqual({});
    });

    it("soft-fails an ID, hash, signature, or author mismatch without rejecting context", () => {
        const event = createSignedEvent();
        const invalidSignature = { ...event, sig: "0".repeat(128) };
        const wrongId = { ...event, id: "f".repeat(64) };

        expect(selectVerifiedPreloadedEvents({ [event.id]: wrongId }, [createReference(event)])).toEqual({});
        expect(selectVerifiedPreloadedEvents({ [event.id]: invalidSignature }, [createReference(event)])).toEqual({});
        expect(selectVerifiedPreloadedEvents({ wrong: event }, [createReference(event)])).toEqual({});
        expect(selectVerifiedPreloadedEvents(
            { [event.id]: event },
            [{ eventId: event.id, authorPubkey: "f".repeat(64) }],
        )).toEqual({});
    });

    it("does not reject the normal context when the preload container is malformed", () => {
        expect(() => validateEmbedComposerSetContextPayload({
            preloadedEvents: [],
        } as never)).not.toThrow();
    });
});

describe("selectPreloadedProfiles", () => {
    it("returns detached sanitized display hints without retaining host objects", () => {
        const pubkey = "a".repeat(64);
        const hostProfiles = {
            [pubkey]: { displayName: " Alice ", picture: "https://example.com/alice.png#ignored" },
        };

        const selected = selectPreloadedProfiles(hostProfiles);
        hostProfiles[pubkey].displayName = "Changed";

        expect(selected).toEqual({
            [pubkey]: { displayName: "Alice", picture: "https://example.com/alice.png" },
        });
        expect(selected[pubkey]).not.toBe(hostProfiles[pubkey]);
    });

    it("soft-fails malformed fields and unrelated pubkeys independently", () => {
        const valid = "b".repeat(64);
        expect(selectPreloadedProfiles({
            invalid: { displayName: "Ignored", picture: null },
            [valid]: { displayName: " Bob ", picture: "javascript:alert(1)" },
            ["c".repeat(64)]: { displayName: "   ", picture: null },
        })).toEqual({
            [valid]: { displayName: "Bob", picture: null },
        });
        expect(selectPreloadedProfiles([])).toEqual({});
    });
});
