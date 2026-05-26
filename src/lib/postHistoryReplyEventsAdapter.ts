import type { PostHistoryReplyEventRecord } from "./storage/ehagakiDb";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryReplyEventsRepository";

export interface PostHistoryReactionRecordsAdapter {
    getReactionRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]>;
}

export interface PostHistoryDirectReplyRecordsAdapter {
    getDirectReplyRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]>;
}

export interface PostHistoryReplyEventsAdapter {
    getRelatedEventRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]>;
    getDirectReplyRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]>;
}

export class RepositoryPostHistoryReactionRecordsAdapter implements PostHistoryReactionRecordsAdapter {
    constructor(
        private repository: Pick<PostHistoryChildInteractionsRepository, "getChildInteractions"> =
            postHistoryChildInteractionsRepository,
    ) {}

    async getReactionRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]> {
        return (await this.repository.getChildInteractions(parentEventId))
            .filter((record) => record.kind === 7);
    }
}

export class RepositoryPostHistoryDirectReplyRecordsAdapter implements PostHistoryDirectReplyRecordsAdapter {
    constructor(
        private repository: Pick<PostHistoryChildInteractionsRepository, "getDirectReplyInteractions"> =
            postHistoryChildInteractionsRepository,
    ) {}

    async getDirectReplyRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]> {
        return this.repository.getDirectReplyInteractions(parentEventId);
    }
}

export class RepositoryPostHistoryReplyEventsAdapter implements PostHistoryReplyEventsAdapter {
    constructor(
        private repository: Pick<
            PostHistoryChildInteractionsRepository,
            "getChildInteractions" | "getDirectReplyInteractions"
        > = postHistoryChildInteractionsRepository,
    ) {}

    async getRelatedEventRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]> {
        return this.repository.getChildInteractions(parentEventId);
    }

    async getDirectReplyRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]> {
        return this.repository.getDirectReplyInteractions(parentEventId);
    }
}

export const postHistoryReactionRecordsAdapter =
    new RepositoryPostHistoryReactionRecordsAdapter();

export const postHistoryDirectReplyRecordsAdapter =
    new RepositoryPostHistoryDirectReplyRecordsAdapter();

export const postHistoryReplyEventsAdapter =
    new RepositoryPostHistoryReplyEventsAdapter();
