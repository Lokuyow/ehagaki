import { RelayConfigUtils } from "../relayConfigUtils";
import { mergePostHistoryCoverageRanges, type PostHistoryRelayCoverage } from "../postHistoryRelayCoverage";
import { ehagakiDb, type EHagakiDB } from "./ehagakiDb";
import { advancePostHistoryLocalRevision, getPostHistoryLocalRevision, isPostHistoryLocalWriteCurrent, PostHistoryLocalWriteStaleError, type PostHistoryLocalWriteScope } from "./postHistoryLocalWriteScope";

export const POST_HISTORY_RELAY_COVERAGE_PREFIX = "postHistoryRelayCoverage:";

export interface PostHistoryRelayFetchCoverage {
    schemaVersion: 1;
    ownerPubkeyHex: string;
    kindsKey: string;
    relays: PostHistoryRelayCoverage[];
}

export interface PostHistoryCoverageWrite extends PostHistoryLocalWriteScope {
    kindsKey: string;
    relays: PostHistoryRelayCoverage[];
}

export class DexiePostHistoryRelayCoverageRepository {
    constructor(private db: EHagakiDB = ehagakiDb, private now = Date.now) {}

    async get(ownerPubkeyHex: string, kindsKey: string): Promise<PostHistoryRelayFetchCoverage> {
        const value = (await this.db.postHistoryExternalCoverage.get(coverageId(ownerPubkeyHex, kindsKey)))?.value;
        const record = value as Partial<PostHistoryRelayFetchCoverage> | undefined;
        const relays = record?.schemaVersion === 1 && record.ownerPubkeyHex === ownerPubkeyHex
            && record.kindsKey === kindsKey && Array.isArray(record.relays) ? record.relays : [];
        return { schemaVersion: 1, ownerPubkeyHex, kindsKey, relays: relays.flatMap((relay) => {
            const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls([relay?.relayUrl])[0];
            return relayUrl && Array.isArray(relay.ranges)
                ? [{ relayUrl, ranges: mergePostHistoryCoverageRanges(relay.ranges) }] : [];
        }) };
    }

    async getLocalRevision(ownerPubkeyHex: string): Promise<number> {
        return getPostHistoryLocalRevision(this.db, ownerPubkeyHex);
    }

    async isCurrent(write: PostHistoryCoverageWrite): Promise<boolean> {
        return isPostHistoryLocalWriteCurrent(this.db, write);
    }

    /** Caller owns the transaction that also saves the corresponding events. */
    async record(write: PostHistoryCoverageWrite): Promise<void> {
        if (!await this.isCurrent(write)) throw new PostHistoryCoverageStaleError();
        const current = await this.get(write.ownerPubkeyHex, write.kindsKey);
        const grouped = new Map<string, PostHistoryRelayCoverage["ranges"]>();
        for (const relay of [...current.relays, ...write.relays]) {
            const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls([relay.relayUrl])[0];
            if (relayUrl) grouped.set(relayUrl, [...(grouped.get(relayUrl) ?? []), ...relay.ranges]);
        }
        const next: PostHistoryRelayFetchCoverage = { ...current, relays: [...grouped]
            .map(([relayUrl, ranges]) => ({ relayUrl, ranges: mergePostHistoryCoverageRanges(ranges) }))
            .sort((a, b) => a.relayUrl.localeCompare(b.relayUrl)) };
        if (!write.isActive()) throw new PostHistoryCoverageStaleError();
        if (JSON.stringify(current) !== JSON.stringify(next)) await this.db.postHistoryExternalCoverage.put({
            id: coverageId(write.ownerPubkeyHex, write.kindsKey),
            ownerPubkeyHex: write.ownerPubkeyHex,
            value: next,
            updatedAt: this.now(),
        });
    }

    /** Also runs for an empty history. The revision prevents a pre-delete fetch from repopulating it. */
    async clearForPubkey(ownerPubkeyHex: string): Promise<void> {
        await this.db.postHistoryExternalCoverage.where("ownerPubkeyHex").equals(ownerPubkeyHex).delete();
        await this.db.postHistoryCitrineRanges.where("ownerPubkeyHex").equals(ownerPubkeyHex).delete();
        await this.db.postHistoryLocalBrowsingRanges.where("ownerPubkeyHex").equals(ownerPubkeyHex).delete();
        await this.db.postHistoryLocalResumeCursor.where("ownerPubkeyHex").equals(ownerPubkeyHex).delete();
        await this.db.postHistoryJumpAnchors.delete(ownerPubkeyHex);
        await advancePostHistoryLocalRevision(this.db, ownerPubkeyHex, this.now());
    }
}

function coverageId(ownerPubkeyHex: string, kindsKey: string): string {
    return `${POST_HISTORY_RELAY_COVERAGE_PREFIX}${ownerPubkeyHex}:${kindsKey}`;
}

export class PostHistoryCoverageStaleError extends PostHistoryLocalWriteStaleError {}

export const postHistoryRelayCoverageRepository = new DexiePostHistoryRelayCoverageRepository();
