import { RelayConfigUtils } from "../relayConfigUtils";
import { attestFullyVerifiedPostHistoryRawEvent, type PostHistoryRawEventAttestation, RAW_EVENT_VERIFICATION_RULE_VERSION } from "../postHistoryRawEventVerification";
import { isFullyVerifiedEvent } from "../sensitiveEventUtils";
import { SENSITIVE_CONTENT_PAYLOAD_KIND, SENSITIVE_CONTENT_STRUCTURE_KINDS } from "../sensitiveContentPayload";
import type { NostrEvent } from "../types";
import { bumpPostHistorySearchRevision } from "../postHistoryLocalSearchRevision";
import { ehagakiDb, type EHagakiDB, type SensitivePayloadRecord } from "./ehagakiDb";
import { reconcileSensitivePayloadDeletionForCandidate } from "./sensitivePayloadDeletionReconciler";
import { assertPostHistoryLocalWriteCurrent, type PostHistoryLocalWriteScope } from "./postHistoryLocalWriteScope";

export const SENSITIVE_PAYLOAD_SCHEMA_VERSION = 1;

export interface SaveSensitivePayloadInput {
    event: NostrEvent;
    attestation?: PostHistoryRawEventAttestation;
    acceptedRelays?: string[];
    fetchedRelays?: string[];
    relayHints?: string[];
    localWriteScope?: PostHistoryLocalWriteScope;
}

export interface SensitivePayloadRepository {
    putCandidate(input: SaveSensitivePayloadInput): Promise<void>;
    getByIds(ids: string[]): Promise<SensitivePayloadRecord[]>;
    getAllForPubkey(pubkeyHex: string): Promise<SensitivePayloadRecord[]>;
    markDeleted(input: { id: string; pubkeyHex: string; deletionEventId: string; deletedAt: number }): Promise<void>;
    deleteCandidatesForPubkey(pubkeyHex: string): Promise<void>;
}

function isPayloadCandidate(event: NostrEvent): boolean {
    if (!isFullyVerifiedEvent(event) || event.kind !== SENSITIVE_CONTENT_PAYLOAD_KIND) {
        return false;
    }
    const kindTags = event.tags.filter((tag) => tag[0] === "k");
    return kindTags.length === 1
        && kindTags[0]!.length >= 2
        && SENSITIVE_CONTENT_STRUCTURE_KINDS.some(
            (kind) => kindTags[0]![1] === String(kind),
        );
}

export class DexieSensitivePayloadRepository implements SensitivePayloadRepository {
    constructor(private db: EHagakiDB = ehagakiDb, private now: () => number = Date.now) {}

    async putCandidate(input: SaveSensitivePayloadInput): Promise<void> {
        if (!isPayloadCandidate(input.event)) {
            throw new Error("invalid_sensitive_payload_candidate");
        }
        const attested = attestFullyVerifiedPostHistoryRawEvent(input.event);
        if (!attested) throw new Error("invalid_sensitive_payload_candidate");
        const event = attested.event;
        const saved = await this.db.transaction("rw", [this.db.sensitivePayloads,
            ...(input.localWriteScope ? [this.db.meta] : [])], async () => {
            await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
            const existing = await this.db.sensitivePayloads.get(event.id);
            if (existing?.deletedAt !== undefined) return false;
            const record: SensitivePayloadRecord = {
                id: event.id,
                pubkeyHex: event.pubkey,
                structureKind: Number(event.tags.find((tag) => tag[0] === "k")![1]),
                rawEvent: event,
                rawEventVerification: {
                    status: "valid",
                    ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
                },
                acceptedRelays: RelayConfigUtils.sanitizeExternalRelayUrls([
                    ...(existing?.acceptedRelays ?? []),
                    ...(input.acceptedRelays ?? []),
                ]),
                fetchedRelays: RelayConfigUtils.sanitizeExternalRelayUrls([
                    ...(existing?.fetchedRelays ?? []),
                    ...(input.fetchedRelays ?? []),
                ]),
                relayHints: RelayConfigUtils.sanitizeExternalRelayUrls([
                    ...(existing?.relayHints ?? []),
                    ...(input.relayHints ?? []),
                    ...(input.acceptedRelays ?? []),
                    ...(input.fetchedRelays ?? []),
                ]),
                createdAt: existing?.createdAt ?? this.now(),
                updatedAt: this.now(),
                schemaVersion: SENSITIVE_PAYLOAD_SCHEMA_VERSION,
            };
            await this.db.sensitivePayloads.put(record);
            await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
            return true;
        });
        if (!saved) return;
        bumpPostHistorySearchRevision(event.pubkey);
        await reconcileSensitivePayloadDeletionForCandidate(event.id, this.db, this.now);
    }

    async getByIds(ids: string[]): Promise<SensitivePayloadRecord[]> {
        const uniqueIds = [...new Set(ids.filter((id) => /^[0-9a-f]{64}$/.test(id)))];
        if (uniqueIds.length === 0) return [];
        return this.db.sensitivePayloads.where("id").anyOf(uniqueIds).toArray();
    }

    async getAllForPubkey(pubkeyHex: string): Promise<SensitivePayloadRecord[]> {
        return this.db.sensitivePayloads.where("pubkeyHex").equals(pubkeyHex).toArray();
    }

    async markDeleted(input: {
        id: string;
        pubkeyHex: string;
        deletionEventId: string;
        deletedAt: number;
    }): Promise<void> {
        const record = await this.db.sensitivePayloads.get(input.id);
        if (!record || record.pubkeyHex !== input.pubkeyHex) return;
        await this.db.sensitivePayloads.put({
            ...record,
            deletedAt: input.deletedAt,
            deletionEventId: input.deletionEventId,
            updatedAt: this.now(),
        });
        bumpPostHistorySearchRevision(record.pubkeyHex);
    }

    async deleteCandidatesForPubkey(pubkeyHex: string): Promise<void> {
        const count = await this.db.sensitivePayloads.where("pubkeyHex").equals(pubkeyHex).delete();
        if (count > 0) bumpPostHistorySearchRevision(pubkeyHex);
    }
}

export const sensitivePayloadRepository = new DexieSensitivePayloadRepository();
