import { normalizeLocalRelayUrl } from "../localRelayUrl";
import { mergePostHistoryCoverageRanges, type PostHistoryCoverageRange } from "../postHistoryRelayCoverage";
import { ehagakiDb, type EHagakiDB } from "./ehagakiDb";
import { assertPostHistoryLocalWriteCurrent, getPostHistoryLocalRevision, type PostHistoryLocalWriteScope } from "./postHistoryLocalWriteScope";

export const POST_HISTORY_LOCAL_BROWSING_RANGES_PREFIX = "postHistoryLocalBrowsingRanges:";

/** An inclusive resume hint only; never coverage, exhaustion or relay completeness evidence. */
export interface PostHistoryLocalResumeHint { nextUntil: number }

/** Completed local queries for DB browsing, separate from external coverage and backup restoration. */
export interface PostHistoryLocalBrowsingRanges {
    schemaVersion: 1;
    source: "local-relay";
    ownerPubkeyHex: string;
    kindsKey: string;
    localRelayUrl: string;
    localRevision: number;
    browsingRanges: PostHistoryCoverageRange[];
    resumeHint: PostHistoryLocalResumeHint | null;
}

export interface PostHistoryLocalBrowsingWrite extends PostHistoryLocalWriteScope {
    kindsKey: string;
    localRelayUrl: string;
    browsingRanges: PostHistoryCoverageRange[];
    resumeHint?: PostHistoryLocalResumeHint;
    initializeResumeHintOnly?: boolean;
}

export class DexiePostHistoryLocalBrowsingRangesRepository {
    constructor(private db: EHagakiDB = ehagakiDb, private now = Date.now) {}

    async get(ownerPubkeyHex: string, kindsKey: string, url: string): Promise<PostHistoryLocalBrowsingRanges> {
        const localRelayUrl = normalizeLocalRelayUrl(url) ?? "";
        const localRevision = await getPostHistoryLocalRevision(this.db, ownerPubkeyHex);
        const empty: PostHistoryLocalBrowsingRanges = { schemaVersion: 1, source: "local-relay", ownerPubkeyHex,
            kindsKey, localRelayUrl, localRevision, browsingRanges: [], resumeHint: null };
        if (!localRelayUrl) return empty;
        const value = (await this.db.meta.get(this.key(ownerPubkeyHex, kindsKey, localRelayUrl)))?.value;
        const record = value as Partial<PostHistoryLocalBrowsingRanges> | undefined;
        if (record?.schemaVersion !== 1 || record.source !== "local-relay" || record.ownerPubkeyHex !== ownerPubkeyHex
            || record.kindsKey !== kindsKey || record.localRelayUrl !== localRelayUrl || record.localRevision !== localRevision) return empty;
        const nextUntil = record.resumeHint?.nextUntil;
        return { ...empty, browsingRanges: mergePostHistoryCoverageRanges(Array.isArray(record.browsingRanges) ? record.browsingRanges : []),
            resumeHint: typeof nextUntil === "number" && Number.isSafeInteger(nextUntil) && nextUntil >= 0 ? { nextUntil } : null };
    }

    /** Caller owns the transaction also saving events. No persistent continuation stop state. */
    async record(write: PostHistoryLocalBrowsingWrite): Promise<void> {
        await assertPostHistoryLocalWriteCurrent(this.db, write);
        const localRelayUrl = normalizeLocalRelayUrl(write.localRelayUrl);
        if (!localRelayUrl) throw new Error("Invalid local browsing URL");
        const current = await this.get(write.ownerPubkeyHex, write.kindsKey, localRelayUrl);
        const candidate = write.resumeHint?.nextUntil;
        let resumeHint = current.resumeHint;
        if (typeof candidate === "number" && Number.isSafeInteger(candidate) && candidate >= 0
            && (!write.initializeResumeHintOnly || !resumeHint)) {
            resumeHint = { nextUntil: resumeHint ? Math.min(resumeHint.nextUntil, candidate) : candidate };
        }
        const next: PostHistoryLocalBrowsingRanges = { ...current,
            browsingRanges: mergePostHistoryCoverageRanges([...current.browsingRanges, ...write.browsingRanges]), resumeHint };
        if (JSON.stringify(next) !== JSON.stringify(current)) await this.db.meta.put({
            key: this.key(write.ownerPubkeyHex, write.kindsKey, localRelayUrl), value: next, updatedAt: this.now(),
        });
        await assertPostHistoryLocalWriteCurrent(this.db, write);
    }

    private key(owner: string, kinds: string, url: string): string {
        return `${POST_HISTORY_LOCAL_BROWSING_RANGES_PREFIX}${owner}:${kinds}:${encodeURIComponent(url)}`;
    }
}

export const postHistoryLocalBrowsingRangesRepository = new DexiePostHistoryLocalBrowsingRangesRepository();
