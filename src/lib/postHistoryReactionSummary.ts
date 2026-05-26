import type { PostHistoryReplyEventRecord } from "./storage/ehagakiDb";

export interface PostHistoryReactionAggregate {
    content: string;
    count: number;
}

export interface PostHistoryReactionSummary {
    totalCount: number;
    groups: PostHistoryReactionAggregate[];
}

export const EMPTY_POST_HISTORY_REACTION_SUMMARY: PostHistoryReactionSummary = {
    totalCount: 0,
    groups: [],
};

export function summarizePostHistoryReactionRecords(
    records: Array<Pick<PostHistoryReplyEventRecord, "kind" | "content">>,
): PostHistoryReactionSummary {
    if (records.length === 0) {
        return EMPTY_POST_HISTORY_REACTION_SUMMARY;
    }

    const groups: PostHistoryReactionAggregate[] = [];
    const groupIndexByContent = new Map<string, number>();
    let totalCount = 0;

    for (const record of records) {
        if (record.kind !== 7) {
            continue;
        }

        totalCount += 1;
        const existingIndex = groupIndexByContent.get(record.content);
        if (existingIndex === undefined) {
            groupIndexByContent.set(record.content, groups.length);
            groups.push({
                content: record.content,
                count: 1,
            });
            continue;
        }

        groups[existingIndex] = {
            ...groups[existingIndex],
            count: groups[existingIndex].count + 1,
        };
    }

    if (totalCount === 0) {
        return EMPTY_POST_HISTORY_REACTION_SUMMARY;
    }

    return {
        totalCount,
        groups,
    };
}