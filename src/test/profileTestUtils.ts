import type { ProfileData } from "../lib/types";

export function createProfileData(overrides: Partial<ProfileData> = {}): ProfileData {
    return {
        name: "name",
        displayName: "displayName",
        picture: "https://example.com/profile.png",
        npub: "npub1profile",
        nprofile: "nprofile1profile",
        ...overrides,
    };
}
