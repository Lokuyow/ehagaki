import { describe, expect, it } from "vitest";
import { nip19 } from "nostr-tools";
import {
    buildExternalNostrClientUrl,
    buildHashtagExternalClientUrl,
    buildProfileExternalClientUrl,
    getExternalNostrClientDisplayName,
    normalizeExternalNostrClientUrlTemplate,
    EXTERNAL_NOSTR_CLIENT_PRESET_TEMPLATES,
    type ExternalNostrClientPreference,
} from "../../lib/postHistoryExternalClient";

const nevent = "nevent1example";

describe("post history external client URL", () => {
    it.each([
        ["nostter", "https://nostter.app/nevent1example"],
        ["jumble", "https://jumble.social/nevent1example"],
        ["primal", "https://primal.net/e/nevent1example"],
        ["njump", "https://njump.me/nevent1example"],
        ["lumilumi", "https://lumilumi.app/nevent1example"],
    ] as const)("%sのプリセットURLを生成する", (client, expected) => {
        const preference: ExternalNostrClientPreference = {
            client,
            customUrlTemplate: "",
        };

        expect(buildExternalNostrClientUrl(preference, nevent)).toBe(expected);
        expect(EXTERNAL_NOSTR_CLIENT_PRESET_TEMPLATES[client]).toContain(
            "{nevent}",
        );
    });

    it("カスタムテンプレートの前後空白を除去してneventを置換する", () => {
        expect(
            buildExternalNostrClientUrl(
                {
                    client: "custom",
                    customUrlTemplate: " https://example.com/note/{nevent} ",
                },
                nevent,
            ),
        ).toBe("https://example.com/note/nevent1example");
        expect(
            getExternalNostrClientDisplayName({
                client: "custom",
                customUrlTemplate: "https://example.com/note/{nevent}",
            }),
        ).toBe("example.com");
    });

    it.each([
        "",
        "http://example.com/{nevent}",
        "javascript:alert(1)/{nevent}",
        "https://example.com/{nevent}/{nevent}",
        "https://example.com/note",
        "https://",
    ])("無効なカスタムテンプレート(%s)を拒否する", (template) => {
        expect(normalizeExternalNostrClientUrlTemplate(template)).toBeNull();
        expect(
            buildExternalNostrClientUrl(
                { client: "custom", customUrlTemplate: template },
                nevent,
            ),
        ).toBeNull();
    });

    it("neventが空ならURLを生成しない", () => {
        expect(
            buildExternalNostrClientUrl(
                { client: "nostter", customUrlTemplate: "" },
                "",
            ),
        ).toBeNull();
    });
});

describe("profile external client URL", () => {
    const profile = { pubkey: "ab".repeat(32), relayHints: ["wss://relay.example/"] };
    const npub = nip19.npubEncode(profile.pubkey);
    const nprofile = nip19.nprofileEncode({ pubkey: profile.pubkey, relays: profile.relayHints });

    it.each([
        ["nostter", `https://nostter.app/${nprofile}`],
        ["jumble", `https://jumble.social/users/${nprofile}`],
        ["primal", `https://primal.net/p/${npub}`],
        ["njump", `https://njump.me/${nprofile}`],
        ["lumilumi", `https://lumilumi.app/${npub}`],
    ] as const)("opens %s's profile route", (client, expected) => {
        expect(buildProfileExternalClientUrl(profile, { client, customUrlTemplate: "" })).toBe(expected);
    });

    it("uses the configured HTTPS template and falls back to njump when it is invalid", () => {
        expect(buildProfileExternalClientUrl(profile, {
            client: "custom", customUrlTemplate: "https://viewer.example/{nevent}",
        })).toBe(`https://viewer.example/${nprofile}`);
        expect(buildProfileExternalClientUrl(profile, {
            client: "custom", customUrlTemplate: "http://viewer.example/{nevent}",
        })).toBe(`https://njump.me/${nprofile}`);
    });
});

describe("hashtag external client URL", () => {
    it.each([
        ["nostter", "https://nostter.app/search?q=%23Nostr%E3%81%AF"],
        ["jumble", "https://jumble.social/notes?t=nostr%E3%81%AF"],
        ["lumilumi", "https://lumilumi.app/search?q=t%3ANostr%E3%81%AF%20kind%3A1"],
        ["primal", "https://primal.net/search/%23Nostr%E3%81%AF"],
    ] as const)("opens %s's hashtag route", (client, expected) => {
        expect(buildHashtagExternalClientUrl("Nostrは", { client, customUrlTemplate: "" })).toBe(expected);
    });

    it("returns null for clients without a hashtag route", () => {
        expect(buildHashtagExternalClientUrl("nostr", { client: "njump", customUrlTemplate: "" })).toBeNull();
        expect(buildHashtagExternalClientUrl("nostr", {
            client: "custom", customUrlTemplate: "https://viewer.example/{nevent}",
        })).toBeNull();
    });
});
