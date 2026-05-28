import type { PostHistoryChildInteractionRecord } from "./storage/ehagakiDb";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";

export interface PostHistoryReactionRecordsAdapter {
    getReactionRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
}

export interface PostHistoryDirectReplyRecordsAdapter {
    getDirectReplyRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
}

export interface PostHistoryChildInteractionsAdapter {
    getRelatedEventRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
    getDirectReplyRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
}

export class RepositoryPostHistoryReactionRecordsAdapter implements PostHistoryReactionRecordsAdapter {
    constructor(
        private repository: Pick<PostHistoryChildInteractionsRepository, "getChildInteractions"> =
            postHistoryChildInteractionsRepository,
    ) {}

    async getReactionRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return (await this.repository.getChildInteractions(parentEventId))
            .filter((record) => record.kind === 7);
    }
}

export class RepositoryPostHistoryDirectReplyRecordsAdapter implements PostHistoryDirectReplyRecordsAdapter {
    constructor(
        private repository: Pick<PostHistoryChildInteractionsRepository, "getDirectReplyInteractions"> =
            postHistoryChildInteractionsRepository,
    ) {}

    async getDirectReplyRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return this.repository.getDirectReplyInteractions(parentEventId);
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
