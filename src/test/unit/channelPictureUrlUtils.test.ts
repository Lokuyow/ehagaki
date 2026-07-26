import { describe, expect, it } from "vitest";
import {
    buildChannelPictureProxyUrl,
    normalizeChannelPictureUrl,
} from "../../lib/channelPictureUrlUtils";
import { normalizeProfilePictureUrl } from "../../lib/profilePictureUrlUtils";

describe("channelPictureUrlUtils", () => {
    it("プロフィール画像と同じURL policyを薄いwrapperで利用する", () => {
        const raw = " https://images.example.com/channel.png?size=small#preview ";
        expect(normalizeChannelPictureUrl(raw)).toBe(
            normalizeProfilePictureUrl(raw),
        );
        expect(normalizeChannelPictureUrl(raw)).toBe(
            "https://images.example.com/channel.png?size=small",
        );
    });

    it.each([
        "Picture",
        "//images.example.com/channel.png",
        "https://user:pass@images.example.com/channel.png",
        "https://localhost/channel.png",
        "http://images.example.com/channel.png",
    ])("不正または許可外URLを拒否する: %s", (raw) => {
        expect(normalizeChannelPictureUrl(raw, {
            currentOrigin: "https://app.example.com",
        })).toBeNull();
    });

    it("local same-originのHTTPだけを開発用に許可する", () => {
        expect(normalizeChannelPictureUrl("http://localhost:5173/channel.png", {
            currentOrigin: "http://localhost:5173",
        })).toBe("http://localhost:5173/channel.png");
    });

    it("base path、event ID、正規化URLをproxy URLへ含める", () => {
        const result = buildChannelPictureProxyUrl({
            eventId: "a".repeat(64),
            pictureUrl: "https://images.example.com/channel.png?q=1#x",
            baseUrl: "/ehagaki/",
            currentOrigin: "https://app.example.com",
        });
        const proxy = new URL(result!);
        expect(proxy.pathname).toBe("/ehagaki/__ehagaki-image/channel");
        expect(proxy.searchParams.get("eventId")).toBe("a".repeat(64));
        expect(proxy.searchParams.get("url")).toBe(
            "https://images.example.com/channel.png?q=1",
        );
    });
});
