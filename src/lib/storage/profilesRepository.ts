import { STORAGE_KEYS } from "../constants";
import {
    compareProfileEventIdentity,
    isValidProfileEventIdentity,
    type ProfileEventIdentity,
} from "../profileEventComparison";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { ProfileData } from "../types";
import { areStringArraysEqual } from "../utils/arrayEqualityUtils";
import { ehagakiDb, type EHagakiDB, type ProfileRecord } from "./ehagakiDb";
import { getAppStorage } from "../appStorage";
import { legacyProfileImportId } from "./legacyImportMarkers";

const PROFILE_SCHEMA_VERSION = 2;

export interface ProfileEventCandidate {
    pubkeyHex: string;
    profile: ProfileData;
    sourceEventId: string;
    updatedAtFromEvent: number;
    observedRelays: string[];
    fetchedAt: number;
}

export type ProfileUpsertDecision =
    | "inserted"
    | "replaced"
    | "kept-existing"
    | "merged-same-event"
    | "rejected-older"
    | "rejected-tie-break"
    | "rejected-invalid";

export interface ProfileUpsertResult {
    decision: ProfileUpsertDecision;
    acceptedRecord: ProfileRecord | null;
    acceptedProfile: ProfileData | null;
    currentEventConfirmed: boolean;
}

export interface ProfilesRepository {
    get(pubkeyHex: string): Promise<ProfileData | null>;
    getRecord(pubkeyHex: string): Promise<ProfileRecord | null>;
    bulkGetRecords(pubkeys: string[]): Promise<Array<ProfileRecord | null>>;
    put(pubkeyHex: string, profile: ProfileData): Promise<void>;
    upsertCandidate(
        pubkeyHex: string,
        candidate: ProfileEventCandidate,
    ): Promise<ProfileUpsertResult>;
    delete(pubkeyHex: string): Promise<void>;
}

export function profileRecordToProfileData(record: ProfileRecord): ProfileData {
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

function normalizeProfileRelays(...relayLists: Array<string[] | undefined>): string[] | undefined {
    const normalized = RelayConfigUtils.sanitizeExternalRelayUrls(relayLists.flatMap((relays) => relays ?? []));
    return normalized.length > 0 ? normalized : undefined;
}

function hasValidEventIdentity(record: ProfileRecord): record is ProfileRecord & ProfileEventIdentity {
    return record.sourceEventId !== undefined
        && record.updatedAtFromEvent !== undefined
        && isValidProfileEventIdentity({
            sourceEventId: record.sourceEventId,
            updatedAtFromEvent: record.updatedAtFromEvent,
        });
}

function isValidCandidate(pubkeyHex: string, candidate: ProfileEventCandidate): boolean {
    return pubkeyHex.length > 0
        && candidate.pubkeyHex === pubkeyHex
        && isValidProfileEventIdentity(candidate)
        && Number.isFinite(candidate.fetchedAt)
        && candidate.fetchedAt >= 0;
}

function toCandidateRecord(
    pubkeyHex: string,
    candidate: ProfileEventCandidate,
    updatedAt: number,
): ProfileRecord {
    const profileRelays = normalizeProfileRelays(
        candidate.profile.profileRelays,
        candidate.observedRelays,
    );

    return {
        pubkeyHex,
        name: candidate.profile.name || "",
        displayName: candidate.profile.displayName || "",
        pictureUrl: candidate.profile.picture || "",
        npub: candidate.profile.npub || "",
        nprofile: candidate.profile.nprofile || "",
        profileRelays,
        fetchedAt: candidate.fetchedAt,
        updatedAtFromEvent: candidate.updatedAtFromEvent,
        sourceEventId: candidate.sourceEventId,
        updatedAt,
        schemaVersion: PROFILE_SCHEMA_VERSION,
    };
}

function toUpsertResult(
    decision: ProfileUpsertDecision,
    acceptedRecord: ProfileRecord | null,
): ProfileUpsertResult {
    return {
        decision,
        acceptedRecord,
        acceptedProfile: acceptedRecord ? profileRecordToProfileData(acceptedRecord) : null,
        currentEventConfirmed: decision === "inserted"
            || decision === "replaced"
            || decision === "kept-existing"
            || decision === "merged-same-event",
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
        private getStorage: () => Pick<Storage, "getItem" | "removeItem"> = () => getAppStorage(),
    ) { }

    async get(pubkeyHex: string): Promise<ProfileData | null> {
        if (!pubkeyHex) return null;
        const markerId = legacyProfileImportId(pubkeyHex);

        try {
            const record = await this.db.profiles.get(pubkeyHex);
            if (record) {
                await this.markLegacyProfileImported(markerId);
                return profileRecordToProfileData(record);
            }
        } catch {
            return readLegacyProfile(pubkeyHex, this.getStorage());
        }

        if ((await this.db.legacyImportState.get(markerId))?.done === true) return null;
        const storage = this.getStorage();
        const raw = storage.getItem(STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex);
        if (raw === null) {
            await this.markLegacyProfileImported(markerId);
            return null;
        }
        const legacyProfile = readLegacyProfile(pubkeyHex, storage);
        if (!legacyProfile) return null;

        try {
            await this.db.transaction("rw", this.db.profiles, this.db.legacyImportState, async () => {
                if ((await this.db.legacyImportState.get(markerId))?.done === true) return;
                if (!await this.db.profiles.get(pubkeyHex)) {
                    await this.db.profiles.put(toRecord(pubkeyHex, legacyProfile, this.now));
                }
                await this.db.legacyImportState.put({ id: markerId, done: true, updatedAt: this.now() });
            });
            try { storage.removeItem(STORAGE_KEYS.NOSTR_PROFILE + pubkeyHex); } catch { /* keep the source until a later success */ }
        } catch {
            return legacyProfile;
        }

        return legacyProfile;
    }

    private async markLegacyProfileImported(markerId: string): Promise<void> {
        if ((await this.db.legacyImportState.get(markerId))?.done === true) return;
        await this.db.legacyImportState.put({ id: markerId, done: true, updatedAt: this.now() });
    }

    async getRecord(pubkeyHex: string): Promise<ProfileRecord | null> {
        return (await this.db.profiles.get(pubkeyHex)) ?? null;
    }

    async bulkGetRecords(pubkeys: string[]): Promise<Array<ProfileRecord | null>> {
        if (pubkeys.length === 0) {
            return [];
        }
        const records = await this.db.profiles.bulkGet(pubkeys);
        return records.map((record) => record ?? null);
    }

    async put(pubkeyHex: string, profile: ProfileData): Promise<void> {
        if (!pubkeyHex) return;
        await this.db.profiles.put(toRecord(pubkeyHex, profile, this.now));
    }

    async upsertCandidate(
        pubkeyHex: string,
        candidate: ProfileEventCandidate,
    ): Promise<ProfileUpsertResult> {
        return this.db.transaction("rw", this.db.profiles, async () => {
            const existing = (await this.db.profiles.get(pubkeyHex)) ?? null;

            if (!isValidCandidate(pubkeyHex, candidate)) {
                return toUpsertResult("rejected-invalid", existing);
            }

            if (!existing || !hasValidEventIdentity(existing)) {
                const record = toCandidateRecord(pubkeyHex, candidate, this.now());
                await this.db.profiles.put(record);
                return toUpsertResult(existing ? "replaced" : "inserted", record);
            }

            const comparison = compareProfileEventIdentity(existing, candidate);

            if (comparison === "candidate-older") {
                return toUpsertResult("rejected-older", existing);
            }

            if (comparison === "candidate-loses-tie-break") {
                return toUpsertResult("rejected-tie-break", existing);
            }

            if (comparison === "candidate-newer" || comparison === "candidate-wins-tie-break") {
                const record = toCandidateRecord(pubkeyHex, candidate, this.now());
                await this.db.profiles.put(record);
                return toUpsertResult("replaced", record);
            }

            const profileRelays = normalizeProfileRelays(
                existing.profileRelays,
                candidate.profile.profileRelays,
                candidate.observedRelays,
            );
            const fetchedAt = Math.max(existing.fetchedAt, candidate.fetchedAt);
            const changed = fetchedAt !== existing.fetchedAt
                || !areStringArraysEqual(existing.profileRelays, profileRelays);

            if (!changed) {
                return toUpsertResult("kept-existing", existing);
            }

            const mergedRecord: ProfileRecord = {
                ...existing,
                profileRelays,
                fetchedAt,
                updatedAt: this.now(),
                schemaVersion: PROFILE_SCHEMA_VERSION,
            };
            await this.db.profiles.put(mergedRecord);
            return toUpsertResult("merged-same-event", mergedRecord);
        });
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
