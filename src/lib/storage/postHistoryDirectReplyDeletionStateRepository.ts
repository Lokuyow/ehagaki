import type { EHagakiDB, MetaRecord } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";
import {
    POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
    type PostHistoryDirectReplyLifecycleKind,
    type PostHistoryDirectReplyLifecycleSource,
    type PostHistoryDirectReplyLifecycleStateRecord,
    type PostHistoryDirectReplyLifecycleStateStatus,
} from "../postHistoryDirectReplyLifecycleTypes";

const POST_HISTORY_DIRECT_REPLY_DELETION_STATE_KEY_PREFIX =
    "postHistoryDirectReplyDeletionState:";

export const POST_HISTORY_DIRECT_REPLY_DELETION_STATE_SCHEMA_VERSION = 1;

type PostHistoryDirectReplyLifecycleStateValue = Omit<
    PostHistoryDirectReplyLifecycleStateRecord,
    "updatedAt"
>;

export interface SavePostHistoryDirectReplyLifecycleStateInput {
    requestKey: string;
    parentEventId: string;
    replyEventId: string;
    replyAuthorPubkey?: string;
    source?: PostHistoryDirectReplyLifecycleSource;
    status?: PostHistoryDirectReplyLifecycleStateStatus;
    attemptCount?: number;
    kind?: PostHistoryDirectReplyLifecycleKind;
}

export interface PostHistoryDirectReplyDeletionStateRepository {
    getMany(requestKeys: string[]): Promise<PostHistoryDirectReplyLifecycleStateRecord[]>;
    getForParentEventIds(parentEventIds: string[]): Promise<PostHistoryDirectReplyLifecycleStateRecord[]>;
    deleteMany(requestKeys: string[]): Promise<void>;
    saveMany(
        inputs: SavePostHistoryDirectReplyLifecycleStateInput[],
    ): Promise<PostHistoryDirectReplyLifecycleStateRecord[]>;
}

function buildStateMetaKey(requestKey: string): string {
    return `${POST_HISTORY_DIRECT_REPLY_DELETION_STATE_KEY_PREFIX}${requestKey}`;
}

function buildParentPrefix(parentEventId: string): string {
    return `${POST_HISTORY_DIRECT_REPLY_DELETION_STATE_KEY_PREFIX}${parentEventId}:`;
}

function isDirectReplyLifecycleSource(
    source: unknown,
): source is PostHistoryDirectReplyLifecycleSource {
    return source === "dialog-inbound-save"
        || source === "dialog-inbound-sync"
        || source === "inbound-realtime"
        || source === "listing-current-view"
        || source === "listing-older-reveal";
}

function isDirectReplyLifecycleStatus(
    status: unknown,
): status is PostHistoryDirectReplyLifecycleStateStatus {
    return status === "pending"
        || status === "processing"
        || status === "success"
        || status === "failed";
}

function isValidStateValue(value: unknown): value is PostHistoryDirectReplyLifecycleStateValue {
    if (!value || typeof value !== "object") {
        return false;
    }

    const state = value as Partial<PostHistoryDirectReplyLifecycleStateValue>;
    return typeof state.requestKey === "string"
        && typeof state.parentEventId === "string"
        && typeof state.replyEventId === "string"
        && typeof state.replyAuthorPubkey === "string"
        && (state.kind === 1 || state.kind === 42)
        && isDirectReplyLifecycleSource(state.source)
        && isDirectReplyLifecycleStatus(state.status)
        && typeof state.attemptCount === "number"
        && typeof state.schemaVersion === "number";
}

function buildDefaultStateValue(
    input: Pick<
        SavePostHistoryDirectReplyLifecycleStateInput,
        "requestKey" | "parentEventId" | "replyEventId" | "kind"
    >,
): PostHistoryDirectReplyLifecycleStateValue {
    return {
        requestKey: input.requestKey,
        parentEventId: input.parentEventId,
        replyEventId: input.replyEventId,
        replyAuthorPubkey: "",
        kind: input.kind ?? POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
        source: "listing-current-view",
        status: "pending",
        attemptCount: 0,
        schemaVersion: POST_HISTORY_DIRECT_REPLY_DELETION_STATE_SCHEMA_VERSION,
    };
}

function toStateRecord(record: MetaRecord | null | undefined): PostHistoryDirectReplyLifecycleStateRecord | null {
    if (!record || !isValidStateValue(record.value)) {
        return null;
    }

    return {
        ...record.value,
        updatedAt: record.updatedAt,
    };
}

function dedupeStateRecords(
    records: PostHistoryDirectReplyLifecycleStateRecord[],
): PostHistoryDirectReplyLifecycleStateRecord[] {
    const recordsByRequestKey = new Map<string, PostHistoryDirectReplyLifecycleStateRecord>();
    for (const record of records) {
        const existing = recordsByRequestKey.get(record.requestKey);
        if (!existing || existing.updatedAt < record.updatedAt) {
            recordsByRequestKey.set(record.requestKey, record);
        }
    }

    return Array.from(recordsByRequestKey.values()).sort((left, right) => {
        if (left.updatedAt !== right.updatedAt) {
            return left.updatedAt - right.updatedAt;
        }

        return left.requestKey.localeCompare(right.requestKey);
    });
}

export class DexiePostHistoryDirectReplyDeletionStateRepository
implements PostHistoryDirectReplyDeletionStateRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) {}

    async getMany(requestKeys: string[]): Promise<PostHistoryDirectReplyLifecycleStateRecord[]> {
        const uniqueRequestKeys = Array.from(new Set(requestKeys.filter((requestKey) => !!requestKey)));
        if (uniqueRequestKeys.length === 0) {
            return [];
        }

        const records = await this.db.meta.bulkGet(
            uniqueRequestKeys.map((requestKey) => buildStateMetaKey(requestKey)),
        );

        return dedupeStateRecords(
            records
                .map((record) => toStateRecord(record))
                .filter((record): record is PostHistoryDirectReplyLifecycleStateRecord => !!record),
        );
    }

    async getForParentEventIds(parentEventIds: string[]): Promise<PostHistoryDirectReplyLifecycleStateRecord[]> {
        const uniqueParentEventIds = Array.from(new Set(parentEventIds.filter((eventId) => !!eventId)));
        if (uniqueParentEventIds.length === 0) {
            return [];
        }

        const allRecords: PostHistoryDirectReplyLifecycleStateRecord[] = [];
        for (const parentEventId of uniqueParentEventIds) {
            const records = await this.db.meta
                .where("key")
                .startsWith(buildParentPrefix(parentEventId))
                .toArray();
            allRecords.push(
                ...records
                    .map((record) => toStateRecord(record))
                    .filter((record): record is PostHistoryDirectReplyLifecycleStateRecord => !!record),
            );
        }

        return dedupeStateRecords(allRecords);
    }

    async deleteMany(requestKeys: string[]): Promise<void> {
        const uniqueRequestKeys = Array.from(new Set(requestKeys.filter((requestKey) => !!requestKey)));
        if (uniqueRequestKeys.length === 0) {
            return;
        }

        await this.db.meta.bulkDelete(
            uniqueRequestKeys.map((requestKey) => buildStateMetaKey(requestKey)),
        );
    }

    async saveMany(
        inputs: SavePostHistoryDirectReplyLifecycleStateInput[],
    ): Promise<PostHistoryDirectReplyLifecycleStateRecord[]> {
        const uniqueInputs = Array.from(new Map(
            inputs
                .filter((input) => input.requestKey && input.parentEventId && input.replyEventId)
                .map((input) => [input.requestKey, input]),
        ).values());
        if (uniqueInputs.length === 0) {
            return [];
        }

        const existingRecords = await this.getMany(uniqueInputs.map((input) => input.requestKey));
        const existingByRequestKey = new Map(
            existingRecords.map((record) => [record.requestKey, record]),
        );

        const now = this.now();
        const savedValues: PostHistoryDirectReplyLifecycleStateValue[] = uniqueInputs.map((input) => {
            const existing = existingByRequestKey.get(input.requestKey);
            const base = existing ?? buildDefaultStateValue(input);
            return {
                ...base,
                ...(input.replyAuthorPubkey !== undefined ? { replyAuthorPubkey: input.replyAuthorPubkey } : {}),
                ...(input.source !== undefined ? { source: input.source } : {}),
                ...(input.status !== undefined ? { status: input.status } : {}),
                ...(input.attemptCount !== undefined ? { attemptCount: input.attemptCount } : {}),
                ...(input.kind !== undefined ? { kind: input.kind } : {}),
                schemaVersion: POST_HISTORY_DIRECT_REPLY_DELETION_STATE_SCHEMA_VERSION,
            };
        });

        await this.db.meta.bulkPut(
            savedValues.map((value) => ({
                key: buildStateMetaKey(value.requestKey),
                value,
                updatedAt: now,
            })),
        );

        return dedupeStateRecords(
            savedValues.map((value) => ({
                ...value,
                updatedAt: now,
            })),
        );
    }
}

export const postHistoryDirectReplyDeletionStateRepository =
    new DexiePostHistoryDirectReplyDeletionStateRepository();
