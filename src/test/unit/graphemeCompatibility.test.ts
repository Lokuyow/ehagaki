import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pubkeyHex = "abcdef" + "0".repeat(58);
const characters = ["A", "あ", "👩🏽‍💻", "👨‍👩‍👧‍👦", "e\u0301", "🇯🇵", "1️⃣", "각"];

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe.each(["native", "unavailable"] as const)("Intl.Segmenter: %s", support => {
    beforeEach(() => {
        if (support === "unavailable") {
            vi.stubGlobal("Intl", new Proxy(Intl, {
                get(target, property) {
                    return property === "Segmenter" ? undefined : Reflect.get(target, property);
                },
            }));
        }
    });

    it("imports the avatar module and preserves full initials and cached SVGs", async () => {
        const { createProfileFallbackAvatarCache } = await import("../../lib/profileFallbackAvatar");
        const saved = new Map<string, string>();
        const storage = {
            getItem: (key: string) => saved.get(key) ?? null,
            setItem: (key: string, value: string) => { saved.set(key, value); },
        };
        const cache = createProfileFallbackAvatarCache(storage);
        for (const character of characters) {
            const identity = { pubkeyHex, name: `${character} Test` };
            const avatar = cache.get(identity)!;
            expect(avatar.initial).toBe(character);
            expect(cache.get(identity)).toBe(avatar);
            expect(createProfileFallbackAvatarCache(storage).get(identity)).toEqual(avatar);
        }
        expect(cache.get({ pubkeyHex })?.initial).toMatch(/^[a-z0-9]$/);
        expect(cache.get({})).toBeNull();
        if (support === "unavailable") expect(Intl.Segmenter).toBeUndefined();
    });

    it("imports reaction consumers and keeps single-grapheme validation and history display", async () => {
        const { normalizeReactionValue } = await import("../../lib/reactionValue");
        const { resolvePostHistoryReactionDisplayContent } = await import("../../lib/postHistoryDialogPresentation");
        const { buildPostHistoryReactionReadModel } = await import("../../lib/postHistoryReactionReadModel");
        for (const character of characters) {
            expect(normalizeReactionValue({ type: "text", text: character })).toEqual({ content: character });
            expect(() => normalizeReactionValue({ type: "text", text: `${character}A` })).toThrow("invalid_reaction_value");
            expect(resolvePostHistoryReactionDisplayContent(`${character}A`)).toBe(character);
            const readModel = buildPostHistoryReactionReadModel([{
                id: "reaction", eventId: "reaction", parentEventId: "parent", authorPubkey: pubkeyHex,
                kind: 7, content: `${character}A`, tags: [], createdAt: 1, relayUrls: [],
                discoveredAs: ["reaction"], rawEvent: null, fetchedAt: 1, updatedAt: 1, schemaVersion: 1,
            }]);
            expect(readModel.groups[0].content).toBe(character);
        }
    });
});
