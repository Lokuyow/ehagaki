import { RelayConfigUtils } from "../relayConfigUtils";
import { mergePostHistoryCoverageRanges, type PostHistoryRelayCoverage } from "../postHistoryRelayCoverage";
import { ehagakiDb, type EHagakiDB } from "./ehagakiDb";

export const POST_HISTORY_RELAY_COVERAGE_PREFIX = "postHistoryRelayCoverage:";
const LOCAL_REVISION_PREFIX = "postHistoryLocalRevision:";

export interface PostHistoryRelayFetchCoverage {
    schemaVersion: 1;
    ownerPubkeyHex: string;
    kindsKey: string;
    relays: PostHistoryRelayCoverage[];
}

export interface PostHistoryCoverageWrite {
    ownerPubkeyHex: string;
    kindsKey: string;
    relays: PostHistoryRelayCoverage[];
    expectedRevision: number;
    isActive: () => boolean;
}

export class DexiePostHistoryRelayCoverageRepository {
    constructor(private db: EHagakiDB = ehagakiDb, private now = Date.now) {}

    async get(ownerPubkeyHex: string, kindsKey: string): Promise<PostHistoryRelayFetchCoverage> {
        const value = (await this.db.meta.get(`${POST_HISTORY_RELAY_COVERAGE_PREFIX}${ownerPubkeyHex}:${kindsKey}`))?.value;
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
        const value = (await this.db.meta.get(`${LOCAL_REVISION_PREFIX}${ownerPubkeyHex}`))?.value;
        return typeof value === "number" && Number.isSafeInteger(value) ? value : 0;
    }

    async isCurrent(write: PostHistoryCoverageWrite): Promise<boolean> {
        return write.isActive() && await this.getLocalRevision(write.ownerPubkeyHex) === write.expectedRevision
            && write.isActive();
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
        if (JSON.stringify(current) !== JSON.stringify(next)) await this.db.meta.put({
            key: `${POST_HISTORY_RELAY_COVERAGE_PREFIX}${write.ownerPubkeyHex}:${write.kindsKey}`,
            value: next, updatedAt: this.now(),
        });
    }

    /** Also runs for an empty history. The revision prevents a pre-delete fetch from repopulating it. */
    async clearForPubkey(ownerPubkeyHex: string): Promise<void> {
        const prefixes = [POST_HISTORY_RELAY_COVERAGE_PREFIX, "postHistoryVisibleRange:", "postHistoryJumpCacheAnchors:"]
            .map((prefix) => `${prefix}${ownerPubkeyHex}`);
        const keys = await this.db.meta.filter(({ key }) => prefixes.some((prefix) =>
            key === prefix || key.startsWith(`${prefix}:`),
        )).primaryKeys();
        const revision = await this.getLocalRevision(ownerPubkeyHex);
        await this.db.meta.bulkDelete(keys);
        await this.db.meta.put({ key: `${LOCAL_REVISION_PREFIX}${ownerPubkeyHex}`, value: revision + 1, updatedAt: this.now() });
    }
}

export class PostHistoryCoverageStaleError extends Error {
    constructor() { super("Post history fetch is no longer active"); }
}

export const postHistoryRelayCoverageRepository = new DexiePostHistoryRelayCoverageRepository();
