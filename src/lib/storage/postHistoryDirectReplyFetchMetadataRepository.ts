import type { EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

const POST_HISTORY_DIRECT_REPLY_FETCH_METADATA_KEY_PREFIX =
    "postHistoryDirectReplyFetchMetadata:";

export const POST_HISTORY_DIRECT_REPLY_FETCH_METADATA_SCHEMA_VERSION = 1;

export type PostHistoryDirectReplyFetchCompleteness = "complete" | "partial";

export interface PostHistoryDirectReplyFetchMetadata {
    parentEventId: string;
    completeness: PostHistoryDirectReplyFetchCompleteness;
    fetchedAt: number;
    requestStartedAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export interface SavePostHistoryDirectReplyFetchMetadataInput {
    parentEventId: string;
    completeness: PostHistoryDirectReplyFetchCompleteness;
    fetchedAt: number;
    requestStartedAt: number;
}

export interface PostHistoryDirectReplyFetchMetadataRepository {
    get(parentEventId: string): Promise<PostHistoryDirectReplyFetchMetadata | null>;
    save(
        input: SavePostHistoryDirectReplyFetchMetadataInput,
    ): Promise<PostHistoryDirectReplyFetchMetadata | null>;
    clear(parentEventId: string): Promise<void>;
}

type PostHistoryDirectReplyFetchMetadataValue =
    Omit<PostHistoryDirectReplyFetchMetadata, "updatedAt">;

function buildMetadataKey(parentEventId: string): string {
    return POST_HISTORY_DIRECT_REPLY_FETCH_METADATA_KEY_PREFIX + parentEventId;
}

function isFiniteTimestamp(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

function isValidMetadataValue(
    value: unknown,
): value is PostHistoryDirectReplyFetchMetadataValue {
    if (!value || typeof value !== "object") {
        return false;
    }

    const metadata = value as Partial<PostHistoryDirectReplyFetchMetadataValue>;
    return typeof metadata.parentEventId === "string"
        && (
            metadata.completeness === "complete"
            || metadata.completeness === "partial"
        )
        && isFiniteTimestamp(metadata.fetchedAt)
        && isFiniteTimestamp(metadata.requestStartedAt)
        && metadata.schemaVersion
            === POST_HISTORY_DIRECT_REPLY_FETCH_METADATA_SCHEMA_VERSION;
}

function shouldKeepCurrentMetadata(
    current: PostHistoryDirectReplyFetchMetadata | null,
    input: SavePostHistoryDirectReplyFetchMetadataInput,
): boolean {
    if (!current) {
        return false;
    }
    if (current.requestStartedAt > input.requestStartedAt) {
        return true;
    }
    return current.requestStartedAt === input.requestStartedAt
        && current.completeness === "complete"
        && input.completeness === "partial";
}

export class DexiePostHistoryDirectReplyFetchMetadataRepository
implements PostHistoryDirectReplyFetchMetadataRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(parentEventId: string): Promise<PostHistoryDirectReplyFetchMetadata | null> {
        if (!parentEventId) {
            return null;
        }

        const record = await this.db.meta.get(buildMetadataKey(parentEventId));
        if (!record || !isValidMetadataValue(record.value)) {
            return null;
        }

        return {
            ...record.value,
            updatedAt: record.updatedAt,
        };
    }

    async save(
        input: SavePostHistoryDirectReplyFetchMetadataInput,
    ): Promise<PostHistoryDirectReplyFetchMetadata | null> {
        if (
            !input.parentEventId
            || !isFiniteTimestamp(input.fetchedAt)
            || !isFiniteTimestamp(input.requestStartedAt)
        ) {
            return null;
        }

        return this.db.transaction("rw", this.db.meta, async () => {
            const current = await this.get(input.parentEventId);
            if (shouldKeepCurrentMetadata(current, input)) {
                return current;
            }

            const updatedAt = this.now();
            const value: PostHistoryDirectReplyFetchMetadataValue = {
                parentEventId: input.parentEventId,
                completeness: input.completeness,
                fetchedAt: input.fetchedAt,
                requestStartedAt: input.requestStartedAt,
                schemaVersion:
                    POST_HISTORY_DIRECT_REPLY_FETCH_METADATA_SCHEMA_VERSION,
            };
            await this.db.meta.put({
                key: buildMetadataKey(input.parentEventId),
                value,
                updatedAt,
            });
            return {
                ...value,
                updatedAt,
            };
        });
    }

    async clear(parentEventId: string): Promise<void> {
        if (!parentEventId) {
            return;
        }
        await this.db.meta.delete(buildMetadataKey(parentEventId));
    }
}

export const postHistoryDirectReplyFetchMetadataRepository =
    new DexiePostHistoryDirectReplyFetchMetadataRepository();
