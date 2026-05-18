import type { PostHistoryReplyEventRecord } from "./storage/ehagakiDb";
import {
    postHistoryReplyEventsRepository,
    type PostHistoryReplyEventsRepository,
} from "./storage/postHistoryReplyEventsRepository";

export interface PostHistoryReplyEventsAdapter {
    getDirectReplyRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]>;
}

export class RepositoryPostHistoryReplyEventsAdapter implements PostHistoryReplyEventsAdapter {
    constructor(
        private repository: Pick<PostHistoryReplyEventsRepository, "getDirectReplies"> =
            postHistoryReplyEventsRepository,
    ) {}

    async getDirectReplyRecords(parentEventId: string): Promise<PostHistoryReplyEventRecord[]> {
        return this.repository.getDirectReplies(parentEventId);
    }
}

export const postHistoryReplyEventsAdapter =
    new RepositoryPostHistoryReplyEventsAdapter();
