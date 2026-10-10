import {
    channelMetadataRepository,
    type ChannelMetadataCache,
    type ChannelMetadataRepository,
} from "./storage/channelMetadataRepository";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
    type PostHistoryTimelineCursor,
} from "./storage/postHistoryRepository";
import {
    getChannelMetadataSearchRevision,
    getPostHistorySearchRevision,
} from "./postHistoryLocalSearchRevision";
import { getSensitivePayloadReference, verifySensitivePayloadLink } from "./sensitiveContentPayload";
import { sensitivePayloadRepository, type SensitivePayloadRepository } from "./storage/sensitivePayloadRepository";
import { extractPostHistoryChannelReference, isPostHistoryRawEventConsistent } from "./postHistoryEventUtils";
import { getRepostReference, isRepostOuterKind, verifySupportedRepostTarget } from "./postRepostUtils";
import { extractPostHistoryMedia } from "./postHistoryMediaUtils";
import type { NostrEvent } from "./types";

export interface SearchLocalPostsOptions {
    pubkeyHex?: string | null;
    query: string;
    page: number;
    pageSize: number;
    /** First-page previews only; the returned Promise still supplies the final count. */
    onProgress?: (progress: SearchLocalPostsProgress) => void | Promise<void>;
}

export interface SearchLocalPostsProgress {
    phase: "partial" | "reset";
    items: PostHistoryRecord[];
}

export interface SearchLocalPostsResult {
    items: PostHistoryRecord[];
    total: number;
    hasNext: boolean;
}

type SearchRevisionSnapshot = {
    postHistory: number;
    channelMetadata: number;
};

type ResolvedSearchCacheEntry = {
    pubkeyHex: string;
    normalizedQueryKey: string;
    revision: SearchRevisionSnapshot;
    filteredPosts: PostHistoryRecord[];
};

type InFlightSearchEntry = {
    identity: symbol;
    runtimeCacheToken: number;
    pubkeyHex: string;
    normalizedQueryKey: string;
    revision: SearchRevisionSnapshot;
    promise: Promise<PostHistoryRecord[]>;
    filteredPosts: PostHistoryRecord[];
    listeners: Set<SearchProgressListener>;
};

type SearchProgressListener = {
    pageSize: number;
    publishedCount: number;
    onProgress: NonNullable<SearchLocalPostsOptions["onProgress"]>;
};

const SEARCH_SCAN_CHUNK_SIZE = 2_000;

function normalizePageNumber(page: number): number {
    return Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
}

function normalizePageSize(pageSize: number): number {
    return Number.isFinite(pageSize) ? Math.max(1, Math.trunc(pageSize)) : 50;
}

function normalizeQueryTokens(query: string): string[] {
    return query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
}

function getNormalizedQueryKey(queryTokens: string[]): string {
    return queryTokens.join(" ");
}

function getRevisionSnapshot(pubkeyHex: string): SearchRevisionSnapshot {
    return {
        postHistory: getPostHistorySearchRevision(pubkeyHex),
        channelMetadata: getChannelMetadataSearchRevision(),
    };
}

function areRevisionSnapshotsEqual(
    left: SearchRevisionSnapshot,
    right: SearchRevisionSnapshot,
): boolean {
    return left.postHistory === right.postHistory
        && left.channelMetadata === right.channelMetadata;
}

function getSearchTarget(post: PostHistoryRecord) {
    const reference = isRepostOuterKind(post.kind) && getRepostReference(post);
    return reference && post.repostTarget ? verifySupportedRepostTarget(post.repostTarget.rawEvent, reference)?.event : null;
}

function getSearchChannelId(post: PostHistoryRecord, target: NostrEvent | null | undefined) {
    if (!isRepostOuterKind(post.kind)) return post.channelEventId;
    return target ? extractPostHistoryChannelReference(target).channelEventId : undefined;
}

function buildSearchText(
    post: PostHistoryRecord,
    channelMetadata: ChannelMetadataCache | null,
    sensitiveBody = "",
    target: NostrEvent | null | undefined = null,
): string {
    return [
        isRepostOuterKind(post.kind) ? "" : post.content,
        ...(target ? [target.content, target.id, target.pubkey, target.tags.flat().join(" "),
            ...extractPostHistoryMedia(target).flatMap((media) => [media.url, media.alt ?? ""])] : []),
        sensitiveBody,
        post.eventId,
        String(post.kind),
        post.tags.flat().join(" "),
        ...post.media.flatMap((media) => [media.url, media.alt ?? ""]),
        getSearchChannelId(post, target) ?? "",
        post.relayHints.join(" "),
        post.acceptedRelays.join(" "),
        post.fetchedRelays?.join(" ") ?? "",
        channelMetadata?.name ?? "",
        channelMetadata?.about ?? "",
    ]
        .join("\n")
        .toLowerCase();
}

function extractChannelEventIds(posts: PostHistoryRecord[], targets: Map<string, NostrEvent | null | undefined>): string[] {
    return Array.from(
        new Set(
            posts
                .map((post) => getSearchChannelId(post, targets.get(post.eventId)))
                .filter(
                    (channelEventId): channelEventId is string =>
                        typeof channelEventId === "string" &&
                        channelEventId.length > 0,
                ),
        ),
    );
}

export class PostHistoryLocalSearchService {
    private resolvedCacheEntry: ResolvedSearchCacheEntry | null = null;
    private inFlightEntry: InFlightSearchEntry | null = null;
    private runtimeCacheToken = 0;

    constructor(
        private postHistoryRepositoryImpl: Pick<PostHistoryRepository, "getSearchScanChunk"> =
            postHistoryRepository,
        private channelMetadataRepositoryImpl: Pick<
            ChannelMetadataRepository,
            "getMany"
        > = channelMetadataRepository,
        private sensitivePayloadRepositoryImpl: Pick<SensitivePayloadRepository, "getByIds"> =
            sensitivePayloadRepository,
    ) { }

    clearCache(): void {
        this.resolvedCacheEntry = null;
        this.inFlightEntry = null;
        this.runtimeCacheToken += 1;
    }

    private isResolvedCacheEntryCurrent(
        entry: ResolvedSearchCacheEntry,
        pubkeyHex: string,
        normalizedQueryKey: string,
        revision: SearchRevisionSnapshot,
    ): boolean {
        return entry.pubkeyHex === pubkeyHex
            && entry.normalizedQueryKey === normalizedQueryKey
            && areRevisionSnapshotsEqual(entry.revision, revision);
    }

    private assertBuildActive(entry: InFlightSearchEntry): void {
        if (this.inFlightEntry !== entry || this.runtimeCacheToken !== entry.runtimeCacheToken) {
            throw new DOMException("Post history search was superseded", "AbortError");
        }
    }

    private async notifyListener(
        entry: InFlightSearchEntry,
        listener: SearchProgressListener,
        phase: SearchLocalPostsProgress["phase"] = "partial",
    ): Promise<void> {
        this.assertBuildActive(entry);
        const count = Math.min(listener.pageSize, entry.filteredPosts.length);
        if (phase === "partial" && count <= listener.publishedCount) return;
        listener.publishedCount = count;
        await listener.onProgress({ phase, items: entry.filteredPosts.slice(0, count) });
    }

    private async filterBatch(
        entry: InFlightSearchEntry,
        posts: PostHistoryRecord[],
        queryTokens: string[],
        channelMetadataById: Map<string, ChannelMetadataCache | null>,
    ): Promise<PostHistoryRecord[]> {
        const targets = new Map(posts.map(post => [post.eventId, getSearchTarget(post)]));
        const structures = posts.flatMap((post) => {
            if (!isPostHistoryRawEventConsistent(post.rawEvent, post)) return [];
            const structure = isRepostOuterKind(post.kind)
                ? targets.get(post.eventId)
                : post.rawEvent as NostrEvent;
            if (!structure) return [];
            const reference = getSensitivePayloadReference(structure);
            return reference ? [{ structure, payloadId: reference.eventId, historyEventId: post.eventId }] : [];
        });
        const payloadRecords = structures.length > 0
            ? await this.sensitivePayloadRepositoryImpl.getByIds(
                structures.map(({ payloadId }) => payloadId),
            )
            : [];
        this.assertBuildActive(entry);
        const payloadById = new Map(payloadRecords.map((record) => [record.id, record]));
        const bodyByStructureId = new Map<string, string>();
        for (const { structure, payloadId, historyEventId } of structures) {
            const record = payloadById.get(payloadId);
            if (!record || record.deletedAt !== undefined) continue;
            const payload = record.rawEvent as NostrEvent;
            if (verifySensitivePayloadLink(structure, payload, payloadId)) {
                bodyByStructureId.set(historyEventId, payload.content);
            }
        }
        const channelEventIds = extractChannelEventIds(posts, targets)
            .filter((id) => !channelMetadataById.has(id));

        if (channelEventIds.length > 0) {
            const records = await this.channelMetadataRepositoryImpl.getMany(
                channelEventIds,
            );
            this.assertBuildActive(entry);
            channelEventIds.forEach((id) => channelMetadataById.set(id, null));
            records.forEach((record) => {
                channelMetadataById.set(record.channelEventId, record);
            });
        }

        return posts.filter((post) => {
            const target = targets.get(post.eventId);
            const channelId = getSearchChannelId(post, target);
            const searchText = buildSearchText(
                post,
                channelId
                    ? channelMetadataById.get(channelId) ?? null
                    : null,
                bodyByStructureId.get(post.eventId) ?? "",
                target,
            );

            return queryTokens.every((token) => searchText.includes(token));
        });
    }

    private async buildFilteredPosts(
        entry: InFlightSearchEntry,
        queryTokens: string[],
        retryOnRevisionChange: boolean,
    ): Promise<PostHistoryRecord[]> {
        const channelMetadataById = new Map<string, ChannelMetadataCache | null>();
        let cursor: PostHistoryTimelineCursor | undefined;

        while (true) {
            this.assertBuildActive(entry);
            const chunk = await this.postHistoryRepositoryImpl.getSearchScanChunk({
                pubkeyHex: entry.pubkeyHex,
                cursor,
                limit: SEARCH_SCAN_CHUNK_SIZE,
            });
            this.assertBuildActive(entry);
            const matches = await this.filterBatch(entry, chunk.items, queryTokens, channelMetadataById);
            const isStable = areRevisionSnapshotsEqual(entry.revision, getRevisionSnapshot(entry.pubkeyHex));
            if (!isStable && retryOnRevisionChange) break;

            entry.filteredPosts.push(...matches);
            if (isStable) {
                for (const listener of entry.listeners) {
                    await this.notifyListener(entry, listener);
                }
            }
            this.assertBuildActive(entry);
            if (!chunk.hasMore || !chunk.nextCursor) break;
            cursor = chunk.nextCursor;
        }

        return entry.filteredPosts;
    }

    private startFilteredPostsBuild(
        pubkeyHex: string,
        normalizedQueryKey: string,
        queryTokens: string[],
        revision: SearchRevisionSnapshot,
    ): InFlightSearchEntry {
        const identity = Symbol("post-history-local-search");
        const runtimeCacheToken = this.runtimeCacheToken;
        const entry: InFlightSearchEntry = {
            identity,
            runtimeCacheToken,
            pubkeyHex,
            normalizedQueryKey,
            revision,
            promise: Promise.resolve([] as PostHistoryRecord[]),
            filteredPosts: [],
            listeners: new Set(),
        };
        this.inFlightEntry = entry;

        entry.promise = (async () => {
            let attemptRevision = revision;

            for (let attempt = 0; attempt < 2; attempt += 1) {
                const filteredPosts = await this.buildFilteredPosts(entry, queryTokens, attempt === 0);
                this.assertBuildActive(entry);
                const completedRevision = getRevisionSnapshot(pubkeyHex);
                const isStable = areRevisionSnapshotsEqual(
                    attemptRevision,
                    completedRevision,
                );

                if (
                    isStable
                    && this.inFlightEntry?.identity === identity
                    && this.runtimeCacheToken === runtimeCacheToken
                ) {
                    this.resolvedCacheEntry = {
                        pubkeyHex,
                        normalizedQueryKey,
                        revision: attemptRevision,
                        filteredPosts,
                    };
                }

                if (isStable || attempt === 1) {
                    return filteredPosts;
                }

                attemptRevision = completedRevision;
                if (
                    this.inFlightEntry?.identity === identity
                    && this.runtimeCacheToken === runtimeCacheToken
                ) {
                    entry.revision = attemptRevision;
                }
                entry.filteredPosts = [];
                for (const listener of entry.listeners) {
                    await this.notifyListener(entry, listener, "reset");
                }
            }

            return [];
        })().finally(() => {
            if (this.inFlightEntry?.identity === identity) {
                this.inFlightEntry = null;
            }
        });
        this.inFlightEntry = entry;
        return entry;
    }

    async searchLocalPosts(
        options: SearchLocalPostsOptions,
    ): Promise<SearchLocalPostsResult> {
        const queryTokens = normalizeQueryTokens(options.query);
        if (!options.pubkeyHex || queryTokens.length === 0) {
            return {
                items: [],
                total: 0,
                hasNext: false,
            };
        }

        const page = normalizePageNumber(options.page);
        const pageSize = normalizePageSize(options.pageSize);
        const pubkeyHex = options.pubkeyHex;
        const normalizedQueryKey = getNormalizedQueryKey(queryTokens);
        const revision = getRevisionSnapshot(pubkeyHex);
        if (this.inFlightEntry && (
            this.inFlightEntry.pubkeyHex !== pubkeyHex
            || this.inFlightEntry.normalizedQueryKey !== normalizedQueryKey
            || !areRevisionSnapshotsEqual(this.inFlightEntry.revision, revision)
        )) {
            this.inFlightEntry = null;
        }
        const resolvedCacheEntry = this.resolvedCacheEntry;
        const filteredPosts = resolvedCacheEntry
            && this.isResolvedCacheEntryCurrent(
                resolvedCacheEntry,
                pubkeyHex,
                normalizedQueryKey,
                revision,
            )
            ? resolvedCacheEntry.filteredPosts
            : await (async () => {
                const inFlightEntry = this.inFlightEntry;
                const entry = inFlightEntry
                    && inFlightEntry.runtimeCacheToken === this.runtimeCacheToken
                    && inFlightEntry.pubkeyHex === pubkeyHex
                    && inFlightEntry.normalizedQueryKey === normalizedQueryKey
                    && areRevisionSnapshotsEqual(inFlightEntry.revision, revision)
                    ? inFlightEntry
                    : this.startFilteredPostsBuild(
                        pubkeyHex,
                        normalizedQueryKey,
                        queryTokens,
                        revision,
                    );
                const listener: SearchProgressListener | null = page === 1 && options.onProgress
                    ? { pageSize, publishedCount: 0, onProgress: options.onProgress }
                    : null;
                if (listener) entry.listeners.add(listener);
                try {
                    const [posts] = await Promise.all([
                        entry.promise,
                        listener ? this.notifyListener(entry, listener) : Promise.resolve(),
                    ]);
                    return posts;
                } finally {
                    if (listener) entry.listeners.delete(listener);
                }
            })();

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return {
            items: filteredPosts.slice(startIndex, endIndex),
            total: filteredPosts.length,
            hasNext: endIndex < filteredPosts.length,
        };
    }
}

export const postHistoryLocalSearchService =
    new PostHistoryLocalSearchService();
