import { describe, expect, it } from "vitest";
import {
    compareProfileEventIdentity,
    isValidProfileEventIdentity,
} from "../../lib/profileEventComparison";

const LOWER_EVENT_ID = "a".repeat(64);
const HIGHER_EVENT_ID = "b".repeat(64);

describe("profileEventComparison", () => {
    it("compares replaceable events by created_at first", () => {
        expect(compareProfileEventIdentity(
            { sourceEventId: LOWER_EVENT_ID, updatedAtFromEvent: 100 },
            { sourceEventId: HIGHER_EVENT_ID, updatedAtFromEvent: 101 },
        )).toBe("candidate-newer");

        expect(compareProfileEventIdentity(
            { sourceEventId: LOWER_EVENT_ID, updatedAtFromEvent: 100 },
            { sourceEventId: HIGHER_EVENT_ID, updatedAtFromEvent: 99 },
        )).toBe("candidate-older");
    });

    it("uses the lower event id as the NIP-01 tie-break winner", () => {
        expect(compareProfileEventIdentity(
            { sourceEventId: HIGHER_EVENT_ID, updatedAtFromEvent: 100 },
            { sourceEventId: LOWER_EVENT_ID, updatedAtFromEvent: 100 },
        )).toBe("candidate-wins-tie-break");

        expect(compareProfileEventIdentity(
            { sourceEventId: LOWER_EVENT_ID, updatedAtFromEvent: 100 },
            { sourceEventId: HIGHER_EVENT_ID, updatedAtFromEvent: 100 },
        )).toBe("candidate-loses-tie-break");
    });

    it("recognizes the same event id", () => {
        expect(compareProfileEventIdentity(
            { sourceEventId: LOWER_EVENT_ID, updatedAtFromEvent: 100 },
            { sourceEventId: LOWER_EVENT_ID, updatedAtFromEvent: 100 },
        )).toBe("same-event");
    });

    it("validates event ids and event timestamps", () => {
        expect(isValidProfileEventIdentity({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
        })).toBe(true);
        expect(isValidProfileEventIdentity({
            sourceEventId: "not-an-event-id",
            updatedAtFromEvent: 100,
        })).toBe(false);
        expect(isValidProfileEventIdentity({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: -1,
        })).toBe(false);
    });
});
