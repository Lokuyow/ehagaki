import { render, screen } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { describe, expect, it, vi } from "vitest";

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => key),
}));

import PostHistoryRelatedEventCard from "../../components/PostHistoryRelatedEventCard.svelte";
import type { NostrEvent, ProfileData } from "../../lib/types";

const pubkey = "a".repeat(64);

function createEvent(content = "reply"): NostrEvent {
    return {
        id: "1".repeat(64),
        pubkey,
        kind: 1,
        content,
        tags: [],
        created_at: 100,
        sig: "2".repeat(128),
    };
}

describe("PostHistoryRelatedEventCard", () => {
    it("renders the npub fallback when profile is null", () => {
        render(PostHistoryRelatedEventCard, {
            event: createEvent(),
            profile: null,
        });

        expect(screen.getByText(/^npub1/)).toBeTruthy();
    });

    it("reacts to profile prop updates", async () => {
        const initialProfile: ProfileData = {
            name: "Initial name",
            displayName: "",
            picture: "https://example.com/initial.png",
            npub: "npub1initial",
            nprofile: "nprofile1initial",
        };
        const { rerender } = render(PostHistoryRelatedEventCard, {
            event: createEvent(),
            profile: initialProfile,
        });

        expect(screen.getByText("Initial name")).toBeTruthy();
        expect(screen.getByAltText("Initial name").getAttribute("src")).toBe(
            "https://example.com/initial.png",
        );

        await rerender({
            event: createEvent(),
            profile: {
                ...initialProfile,
                displayName: "Updated display name",
                picture: "https://example.com/updated.png",
            },
        });

        expect(screen.getByText("Updated display name")).toBeTruthy();
        expect(
            screen.getByAltText("Updated display name").getAttribute("src"),
        ).toBe("https://example.com/updated.png");
    });

    it("preserves link segments instead of flattening related event content", () => {
        render(PostHistoryRelatedEventCard, {
            event: createEvent(
                "reply https://example.com/path?q=1#part）。",
            ),
            profile: null,
        });

        const link = screen.getByRole("link", {
            name: "https://example.com/path?q=1#part",
        });
        expect(link.getAttribute("href")).toBe(
            "https://example.com/path?q=1#part",
        );
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
        expect(
            document.querySelector(".post-history-related-content")
                ?.textContent,
        ).toBe("reply https://example.com/path?q=1#part）。");
    });

    it("keeps media URLs out of related-card text while rendering other links", () => {
        render(PostHistoryRelatedEventCard, {
            event: createEvent(
                "https://example.com/page https://example.com/image.jpg",
            ),
            profile: null,
            media: [{
                url: "https://example.com/image.jpg",
                mimeType: "image/jpeg",
            }],
        });

        expect(screen.getByRole("link", {
            name: "https://example.com/page",
        })).toBeTruthy();
        expect(
            document.querySelector(".post-history-related-content")
                ?.textContent,
        ).toBe("https://example.com/page ");
        expect(
            screen.queryByRole("link", {
                name: "https://example.com/image.jpg",
            }),
        ).toBeNull();
    });
});
