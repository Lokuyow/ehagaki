import type { EHagakiDB, MetaRecord } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";
import {
    POST_HISTORY_REACTION_LIFECYCLE_KIND,
    type PostHistoryReactionLifecycleSource,
    type PostHistoryReactionLifecycleStateRecord,
    type PostHistoryReactionLifecycleStateStatus,
} from "../postHistoryReactionLifecycleTypes";

const POST_HISTORY_REACTION_DELETION_STATE_KEY_PREFIX =
    "postHistoryReactionDeletionState:";

export const POST_HISTORY_REACTION_DELETION_STATE_SCHEMA_VERSION = 1;

type PostHistoryReactionLifecycleStateValue = Omit<
    PostHistoryReactionLifecycleStateRecord,
    "updatedAt"
>;

export interface SavePostHistoryReactionLifecycleStateInput {
    requestKey: string;
    parentEventId: string;
    reactionEventId: string;
    reactionAuthorPubkey?: string;
    source?: PostHistoryReactionLifecycleSource;
    status?: PostHistoryReactionLifecycleStateStatus;
    attemptCount?: number;
}

export interface PostHistoryReactionDeletionStateRepository {
    getMany(requestKeys: string[]): Promise<PostHistoryReactionLifecycleStateRecord[]>;
    getForParentEventIds(parentEventIds: string[]): Promise<PostHistoryReactionLifecycleStateRecord[]>;
    deleteMany(requestKeys: string[]): Promise<void>;
    saveMany(
        inputs: SavePostHistoryReactionLifecycleStateInput[],
    ): Promise<PostHistoryReactionLifecycleStateRecord[]>;
}

function buildStateMetaKey(requestKey: string): string {
    return `${POST_HISTORY_REACTION_DELETION_STATE_KEY_PREFIX}${requestKey}`;
}

function buildParentPrefix(parentEventId: string): string {
    return `${POST_HISTORY_REACTION_DELETION_STATE_KEY_PREFIX}${parentEventId}:`;
}

function isReactionLifecycleSource(
    source: unknown,
): source is PostHistoryReactionLifecycleSource {
    return source === "dialog-inbound-save"
        || source === "dialog-inbound-sync"
        || source === "inbound-realtime"
        || source === "listing-current-view"
        || source === "listing-older-reveal";
}

function isReactionLifecycleStatus(
    status: unknown,
): status is PostHistoryReactionLifecycleStateStatus {
    return status === "pending"
        || status === "processing"
        || status === "success"
        || status === "failed";
}

function isValidStateValue(value: unknown): value is PostHistoryReactionLifecycleStateValue {
    if (!value || typeof value !== "object") {
        return false;
    }

    const state = value as Partial<PostHistoryReactionLifecycleStateValue>;
    return typeof state.requestKey === "string"
        && typeof state.parentEventId === "string"
        && typeof state.reactionEventId === "string"
        && typeof state.reactionAuthorPubkey === "string"
        && state.kind === POST_HISTORY_REACTION_LIFECYCLE_KIND
        && isReactionLifecycleSource(state.source)
        && isReactionLifecycleStatus(state.status)
        && typeof state.attemptCount === "number"
        && typeof state.schemaVersion === "number";
}

function buildDefaultStateValue(
    input: Pick<
        SavePostHistoryReactionLifecycleStateInput,
        "requestKey" | "parentEventId" | "reactionEventId"
    >,
): PostHistoryReactionLifecycleStateValue {
    return {
        requestKey: input.requestKey,
        parentEventId: input.parentEventId,
        reactionEventId: input.reactionEventId,
        reactionAuthorPubkey: "",
        kind: POST_HISTORY_REACTION_LIFECYCLE_KIND,
        source: "listing-current-view",
        status: "pending",
        attemptCount: 0,
        schemaVersion: POST_HISTORY_REACTION_DELETION_STATE_SCHEMA_VERSION,
    };
}

function toStateRecord(record: MetaRecord | null | undefined): PostHistoryReactionLifecycleStateRecord | null {
    if (!record || !isValidStateValue(record.value)) {
        return null;
    }

    return {
        ...record.value,
        updatedAt: record.updatedAt,
    };
}

function dedupeStateRecords(
    records: PostHistoryReactionLifecycleStateRecord[],
): PostHistoryReactionLifecycleStateRecord[] {
    const recordsByRequestKey = new Map<string, PostHistoryReactionLifecycleStateRecord>();
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

export class DexiePostHistoryReactionDeletionStateRepository
implements PostHistoryReactionDeletionStateRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) {}

    async getMany(requestKeys: string[]): Promise<PostHistoryReactionLifecycleStateRecord[]> {
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
                .filter((record): record is PostHistoryReactionLifecycleStateRecord => !!record),
        );
    }

    async getForParentEventIds(parentEventIds: string[]): Promise<PostHistoryReactionLifecycleStateRecord[]> {
        const uniqueParentEventIds = Array.from(new Set(parentEventIds.filter((eventId) => !!eventId)));
        if (uniqueParentEventIds.length === 0) {
            return [];
        }

        const allRecords: PostHistoryReactionLifecycleStateRecord[] = [];
        for (const parentEventId of uniqueParentEventIds) {
            const records = await this.db.meta
                .where("key")
                .startsWith(buildParentPrefix(parentEventId))
                .toArray();
            allRecords.push(
                ...records
                    .map((record) => toStateRecord(record))
                    .filter((record): record is PostHistoryReactionLifecycleStateRecord => !!record),
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
        inputs: SavePostHistoryReactionLifecycleStateInput[],
    ): Promise<PostHistoryReactionLifecycleStateRecord[]> {
        const uniqueInputs = Array.from(new Map(
            inputs
                .filter((input) => input.requestKey && input.parentEventId && input.reactionEventId)
                .map((input) => [input.requestKey, input]),
        ).values());
        if (uniqueInputs.length === 0) {
            return [];
        }

        const updatedAt = this.now();
        const existingRecords = await this.db.meta.bulkGet(
            uniqueInputs.map((input) => buildStateMetaKey(input.requestKey)),
        );
        const existingStateByRequestKey = new Map<string, PostHistoryReactionLifecycleStateRecord>();
        existingRecords.forEach((record) => {
            const stateRecord = toStateRecord(record);
            if (stateRecord) {
                existingStateByRequestKey.set(stateRecord.requestKey, stateRecord);
            }
        });

        const nextRecords = uniqueInputs.map((input) => {
            const existingState = existingStateByRequestKey.get(input.requestKey);
            const nextValue: PostHistoryReactionLifecycleStateValue = {
                ...(existingState
                    ? {
                        requestKey: existingState.requestKey,
                        parentEventId: existingState.parentEventId,
                        reactionEventId: existingState.reactionEventId,
                        reactionAuthorPubkey: existingState.reactionAuthorPubkey,
                        kind: existingState.kind,
                        source: existingState.source,
                        status: existingState.status,
                        attemptCount: existingState.attemptCount,
                        schemaVersion: existingState.schemaVersion,
                    }
                    : buildDefaultStateValue(input)),
                requestKey: input.requestKey,
                parentEventId: input.parentEventId,
                reactionEventId: input.reactionEventId,
                ...(input.reactionAuthorPubkey !== undefined
                    ? { reactionAuthorPubkey: input.reactionAuthorPubkey }
                    : {}),
                ...(input.source !== undefined ? { source: input.source } : {}),
                ...(input.status !== undefined ? { status: input.status } : {}),
                ...(input.attemptCount !== undefined
                    ? { attemptCount: input.attemptCount }
                    : {}),
                schemaVersion: POST_HISTORY_REACTION_DELETION_STATE_SCHEMA_VERSION,
            };

            return {
                key: buildStateMetaKey(input.requestKey),
                value: nextValue,
                updatedAt,
            } satisfies MetaRecord;
        });

        await this.db.transaction("rw", this.db.meta, async () => {
            await this.db.meta.bulkPut(nextRecords);
        });

        return nextRecords.map((record) => ({
            ...(record.value as PostHistoryReactionLifecycleStateValue),
            updatedAt,
        }));
    }
}

export const postHistoryReactionDeletionStateRepository =
    new DexiePostHistoryReactionDeletionStateRepository();