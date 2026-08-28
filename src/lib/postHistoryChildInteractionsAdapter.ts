import type { PostHistoryChildInteractionRecord } from "./storage/ehagakiDb";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";

export interface PostHistoryReactionRecordsAdapter {
    getReactionRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
    getReactionRecordsForParents?(
        parentEventIds: string[],
    ): Promise<PostHistoryChildInteractionRecord[]>;
}

export interface PostHistoryDirectReplyRecordsAdapter {
    getDirectReplyRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
    getDirectReplyRecordsForParents?(
        parentEventIds: string[],
    ): Promise<PostHistoryChildInteractionRecord[]>;
}

export interface PostHistoryChildInteractionsAdapter {
    getRelatedEventRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
    getDirectReplyRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
}

function sortRecordsForParent(
    records: PostHistoryChildInteractionRecord[],
): PostHistoryChildInteractionRecord[] {
    return records.sort((left, right) => {
        if (left.createdAt !== right.createdAt) {
            return left.createdAt - right.createdAt;
        }

        return left.eventId.localeCompare(right.eventId);
    });
}

function selectRecordsForParents(
    records: PostHistoryChildInteractionRecord[],
    parentEventIds: string[],
    matches: (record: PostHistoryChildInteractionRecord) => boolean,
): PostHistoryChildInteractionRecord[] {
    const uniqueParentEventIds = Array.from(
        new Set(parentEventIds.filter((eventId) => !!eventId)),
    );
    const recordsByParentEventId = new Map(
        uniqueParentEventIds.map((parentEventId) => [
            parentEventId,
            [] as PostHistoryChildInteractionRecord[],
        ]),
    );

    for (const record of records) {
        if (!matches(record)) {
            continue;
        }

        recordsByParentEventId.get(record.parentEventId)?.push(record);
    }

    return uniqueParentEventIds.flatMap((parentEventId) =>
        sortRecordsForParent(recordsByParentEventId.get(parentEventId) ?? []),
    );
}

export class RepositoryPostHistoryReactionRecordsAdapter implements PostHistoryReactionRecordsAdapter {
    constructor(
        private repository: Pick<
            PostHistoryChildInteractionsRepository,
            "getChildInteractions"
        > & Partial<Pick<
            PostHistoryChildInteractionsRepository,
            "getChildInteractionsForParents"
        >> = postHistoryChildInteractionsRepository,
    ) {}

    async getReactionRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return (await this.repository.getChildInteractions(parentEventId))
            .filter((record) => record.kind === 7);
    }

    async getReactionRecordsForParents(
        parentEventIds: string[],
    ): Promise<PostHistoryChildInteractionRecord[]> {
        const uniqueParentEventIds = Array.from(
            new Set(parentEventIds.filter((eventId) => !!eventId)),
        );
        const records = this.repository.getChildInteractionsForParents
            ? await this.repository.getChildInteractionsForParents(uniqueParentEventIds)
            : (await Promise.all(uniqueParentEventIds.map((parentEventId) =>
                this.getReactionRecords(parentEventId),
            ))).flat();

        return selectRecordsForParents(
            records,
            uniqueParentEventIds,
            (record) => record.kind === 7,
        );
    }
}

export class RepositoryPostHistoryDirectReplyRecordsAdapter implements PostHistoryDirectReplyRecordsAdapter {
    constructor(
        private repository: Pick<
            PostHistoryChildInteractionsRepository,
            "getDirectReplyInteractions"
        > & Partial<Pick<
            PostHistoryChildInteractionsRepository,
            "getChildInteractionsForParents"
        >> = postHistoryChildInteractionsRepository,
    ) {}

    async getDirectReplyRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return this.repository.getDirectReplyInteractions(parentEventId);
    }

    async getDirectReplyRecordsForParents(
        parentEventIds: string[],
    ): Promise<PostHistoryChildInteractionRecord[]> {
        const uniqueParentEventIds = Array.from(
            new Set(parentEventIds.filter((eventId) => !!eventId)),
        );
        const records = this.repository.getChildInteractionsForParents
            ? await this.repository.getChildInteractionsForParents(uniqueParentEventIds)
            : (await Promise.all(uniqueParentEventIds.map((parentEventId) =>
                this.getDirectReplyRecords(parentEventId),
            ))).flat();

        return selectRecordsForParents(
            records,
            uniqueParentEventIds,
            (record) => record.kind === 1 || record.kind === 42,
        );
    }
}

export class RepositoryPostHistoryChildInteractionsAdapter implements PostHistoryChildInteractionsAdapter {
    constructor(
        private repository: Pick<
            PostHistoryChildInteractionsRepository,
            "getChildInteractions" | "getDirectReplyInteractions"
        > = postHistoryChildInteractionsRepository,
    ) {}

    async getRelatedEventRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return this.repository.getChildInteractions(parentEventId);
    }

    async getDirectReplyRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return this.repository.getDirectReplyInteractions(parentEventId);
    }
}

export const postHistoryReactionRecordsAdapter =
    new RepositoryPostHistoryReactionRecordsAdapter();

export const postHistoryDirectReplyRecordsAdapter =
    new RepositoryPostHistoryDirectReplyRecordsAdapter();

export const postHistoryChildInteractionsAdapter =
    new RepositoryPostHistoryChildInteractionsAdapter();
