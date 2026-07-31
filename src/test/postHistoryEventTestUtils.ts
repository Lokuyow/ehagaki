import type { NostrEvent } from "../lib/types";

export function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "1".repeat(64),
        pubkey: "a".repeat(64),
        created_at: 100,
        kind: 1,
        tags: [],
        content: "",
        sig: "b".repeat(128),
        ...overrides,
    };
}
