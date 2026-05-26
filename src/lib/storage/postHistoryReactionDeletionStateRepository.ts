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
    source: PostHistoryReactionLifecycleSource;
    status: PostHistoryReactionLifecycleStateStatus;
}

export interface PostHistoryReactionDeletionStateRepository {
    getMany(requestKeys: string[]): Promise<PostHistoryReactionLifecycleStateRecord[]>;
    getForParentEventIds(parentEventIds: string[]): Promise<PostHistoryReactionLifecycleStateRecord[]>;
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
        && state.kind === POST_HISTORY_REACTION_LIFECYCLE_KIND
        && isReactionLifecycleSource(state.source)
        && isReactionLifecycleStatus(state.status)
        && typeof state.schemaVersion === "number";
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
        await this.db.transaction("rw", this.db.meta, async () => {
            await this.db.meta.bulkPut(uniqueInputs.map((input) => ({
                key: buildStateMetaKey(input.requestKey),
                value: {
                    requestKey: input.requestKey,
                    parentEventId: input.parentEventId,
                    reactionEventId: input.reactionEventId,
                    kind: POST_HISTORY_REACTION_LIFECYCLE_KIND,
                    source: input.source,
                    status: input.status,
                    schemaVersion: POST_HISTORY_REACTION_DELETION_STATE_SCHEMA_VERSION,
                } satisfies PostHistoryReactionLifecycleStateValue,
                updatedAt,
            })));
        });

        return uniqueInputs.map((input) => ({
            requestKey: input.requestKey,
            parentEventId: input.parentEventId,
            reactionEventId: input.reactionEventId,
            kind: POST_HISTORY_REACTION_LIFECYCLE_KIND,
            source: input.source,
            status: input.status,
            updatedAt,
            schemaVersion: POST_HISTORY_REACTION_DELETION_STATE_SCHEMA_VERSION,
        }));
    }
}

export const postHistoryReactionDeletionStateRepository =
    new DexiePostHistoryReactionDeletionStateRepository();