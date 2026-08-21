import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { describe, expect, it } from "vitest";

import {
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

function createReference(event: { id: string; pubkey: string }) {
    return {
        eventId: event.id,
        authorPubkey: event.pubkey,
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
