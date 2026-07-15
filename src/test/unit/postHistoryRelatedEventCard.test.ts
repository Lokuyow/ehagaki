import { render, screen, waitFor } from "@testing-library/svelte";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.unmock("../../stores/authStore.svelte");
vi.unmock("../../stores/profileStore.svelte");

import PostHistoryRelatedEventCard from "../../components/PostHistoryRelatedEventCard.svelte";
import type { NostrEvent } from "../../lib/types";
import { clearAuthState, setNsecAuth } from "../../stores/authStore.svelte";
import {
    profileDataStore,
    profileLoadedStore,
} from "../../stores/profileStore.svelte";

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
    afterEach(() => {
        clearAuthState(false);
        profileDataStore.set({
            name: "",
            displayName: "",
            picture: "",
            npub: "",
            nprofile: "",
        });
        profileLoadedStore.set(false);
    });

    it("reflects the loaded login profile when a related event is authored by the current account", async () => {
        setNsecAuth(pubkey, "npub1current", "nprofile1current");
        profileLoadedStore.set(false);
        render(PostHistoryRelatedEventCard, {
            event: createEvent(),
            profile: null,
        });

        expect(screen.getByText(/^npub1/)).toBeTruthy();

        profileDataStore.set({
            name: "Current profile",
            displayName: "Current display name",
            picture: "https://example.com/current.png",
            npub: "npub1current",
            nprofile: "nprofile1current",
        });
        profileLoadedStore.set(true);

        await waitFor(() => {
            expect(screen.getByText("Current display name")).toBeTruthy();
            expect(
                screen.getByAltText("Current display name").getAttribute("src"),
            ).toBe("https://example.com/current.png");
        });
    });
});
