import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

import PostHistoryRelatedEventCard from "../../components/PostHistoryRelatedEventCard.svelte";
import type { NostrEvent, ProfileData } from "../../lib/types";

const pubkey = "a".repeat(64);

function createEvent(): NostrEvent {
    return {
        id: "1".repeat(64),
        pubkey,
        kind: 1,
        content: "reply",
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
});
