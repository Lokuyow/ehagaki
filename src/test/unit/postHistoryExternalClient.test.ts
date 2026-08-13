import { describe, expect, it } from "vitest";
import {
    buildExternalNostrClientUrl,
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
