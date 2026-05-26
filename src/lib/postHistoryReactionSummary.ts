import {
    buildCustomEmojiTagMap,
    isCustomEmojiShortcodeText,
    normalizeEmojiShortcodeForLookup,
} from "./customEmoji";
import type { PostHistoryReplyEventRecord } from "./storage/ehagakiDb";

export interface PostHistoryReactionAggregate {
    content: string;
    count: number;
    emojiUrl?: string;
}

export interface PostHistoryReactionSummary {
    totalCount: number;
    groups: PostHistoryReactionAggregate[];
}

export const EMPTY_POST_HISTORY_REACTION_SUMMARY: PostHistoryReactionSummary = {
    totalCount: 0,
    groups: [],
};

type PostHistoryReactionRecordInput = Pick<
    PostHistoryReplyEventRecord,
    "kind" | "content"
> & Partial<Pick<PostHistoryReplyEventRecord, "tags">>;

function resolveReactionEmojiUrl(
    record: PostHistoryReactionRecordInput,
): string | undefined {
    if (!isCustomEmojiShortcodeText(record.content)) {
        return undefined;
    }

    const shortcodeLower = normalizeEmojiShortcodeForLookup(record.content);
    if (!shortcodeLower) {
        return undefined;
    }

    return buildCustomEmojiTagMap(record.tags ?? []).get(shortcodeLower)?.url;
}

export function summarizePostHistoryReactionRecords(
    records: PostHistoryReactionRecordInput[],
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
        const emojiUrl = resolveReactionEmojiUrl(record);
        const existingIndex = groupIndexByContent.get(record.content);
        if (existingIndex === undefined) {
            groupIndexByContent.set(record.content, groups.length);
            groups.push(
                emojiUrl
                    ? {
                        content: record.content,
                        count: 1,
                        emojiUrl,
                    }
                    : {
                        content: record.content,
                        count: 1,
                    },
            );
            continue;
        }

        const existingGroup = groups[existingIndex];
        const nextEmojiUrl = existingGroup.emojiUrl ?? emojiUrl;

        groups[existingIndex] = {
            ...existingGroup,
            count: existingGroup.count + 1,
            ...(nextEmojiUrl ? { emojiUrl: nextEmojiUrl } : {}),
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