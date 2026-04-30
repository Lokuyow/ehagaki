import { STORAGE_KEYS } from "../constants";
import type { ProfileData } from "../types";
import { ehagakiDb, type EHagakiDB, type ProfileRecord } from "./ehagakiDb";

const PROFILE_SCHEMA_VERSION = 1;

export interface ProfilesRepository {
    get(pubkeyHex: string): Promise<ProfileData | null>;
    put(pubkeyHex: string, profile: ProfileData): Promise<void>;
    delete(pubkeyHex: string): Promise<void>;
}

function toProfile(record: ProfileRecord): ProfileData {
    return {
        name: record.name,
        displayName: record.displayName,
        picture: record.pictureUrl,
        npub: record.npub,
        nprofile: record.nprofile,
        profileRelays: record.profileRelays?.length ? record.profileRelays : undefined,
        fetchedAt: record.fetchedAt,
        updatedAtFromEvent: record.updatedAtFromEvent,
    };
}

function toRecord(pubkeyHex: string, profile: ProfileData, now: () => number): ProfileRecord {
    const updatedAt = now();

    return {
        pubkeyHex,
        name: profile.name || "",
        displayName: profile.displayName || "",
        pictureUrl: profile.picture || "",
        npub: profile.npub || "",
        nprofile: profile.nprofile || "",
        profileRelays: profile.profileRelays?.length ? profile.profileRelays : undefined,
        fetchedAt: profile.fetchedAt || updatedAt,
        updatedAtFromEvent: profile.updatedAtFromEvent,
        updatedAt,
        schemaVersion: PROFILE_SCHEMA_VERSION,
    };
}

function readLegacyProfile(
    pubkeyHex: string,
    storage: Pick<Storage, "getItem">,
): ProfileData | null {
    const profileString = storage.getItem(STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex);
    if (!profileString) return null;

    try {
        const parsed = JSON.parse(profileString);
        if (!parsed || typeof parsed !== "object") return null;

        return {
            name: typeof parsed.name === "string" ? parsed.name : "",
            displayName: typeof parsed.displayName === "string" ? parsed.displayName : "",
            picture: typeof parsed.picture === "string" ? parsed.picture : "",
            npub: typeof parsed.npub === "string" ? parsed.npub : "",
            nprofile: typeof parsed.nprofile === "string" ? parsed.nprofile : "",
            profileRelays: Array.isArray(parsed.profileRelays)
                ? parsed.profileRelays.filter((relay: unknown): relay is string => typeof relay === "string")
                : undefined,
            fetchedAt: typeof parsed.fetchedAt === "number" ? parsed.fetchedAt : undefined,
            updatedAtFromEvent: typeof parsed.updatedAtFromEvent === "number"
                ? parsed.updatedAtFromEvent
                : undefined,
        };
    } catch {
        return null;
    }
}

export class DexieProfilesRepository implements ProfilesRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private getStorage: () => Pick<Storage, "getItem" | "removeItem"> = () => localStorage,
    ) { }

    async get(pubkeyHex: string): Promise<ProfileData | null> {
        if (!pubkeyHex) return null;

        try {
            const record = await this.db.profiles.get(pubkeyHex);
            if (record) return toProfile(record);
        } catch {
            return readLegacyProfile(pubkeyHex, this.getStorage());
        }

        const legacyProfile = readLegacyProfile(pubkeyHex, this.getStorage());
        if (!legacyProfile) return null;

        try {
            await this.put(pubkeyHex, legacyProfile);
        } catch {
            // Legacy data remains available as a compatibility fallback.
        }

        return legacyProfile;
    }

    async put(pubkeyHex: string, profile: ProfileData): Promise<void> {
        if (!pubkeyHex) return;
        await this.db.profiles.put(toRecord(pubkeyHex, profile, this.now));
    }

    async delete(pubkeyHex: string): Promise<void> {
        if (!pubkeyHex) return;
        await this.db.profiles.delete(pubkeyHex);
        try {
            this.getStorage().removeItem(STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex);
        } catch {
            // IndexedDB deletion already succeeded.
        }
    }
}

export const profilesRepository = new DexieProfilesRepository();
