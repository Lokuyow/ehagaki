import { buildCustomEmojiTagMap, isCustomEmojiShortcodeText, normalizeEmojiShortcodeForLookup } from "./customEmoji";
import type { PostHistoryReactionRecordsAdapter } from "./postHistoryChildInteractionsAdapter";
import { postHistoryReactionRecordsAdapter } from "./postHistoryChildInteractionsAdapter";
import type { PostHistoryChildInteractionRecord } from "./storage/ehagakiDb";
import type { ProfileData } from "./types";
import { toNpub } from "./utils/nostrUtils";
import { shortenMiddle } from "./utils/textDisplayUtils";

export interface PostHistoryReactionActor {
    eventId: string;
    pubkey: string;
    profile: ProfileData | null;
    createdAt: number;
}

export interface PostHistoryReactionGroup {
    content: string;
    count: number;
    emojiUrl?: string;
    reactors: PostHistoryReactionActor[];
}

export interface PostHistoryReactionReadModel {
    totalCount: number;
    groups: PostHistoryReactionGroup[];
}

export type PostHistoryReactionProfileLookup =
    | Record<string, ProfileData | null | undefined>
    | Map<string, ProfileData | null | undefined>;

export const EMPTY_POST_HISTORY_REACTION_READ_MODEL: PostHistoryReactionReadModel = {
    totalCount: 0,
    groups: [],
};

const reactionGraphemeSegmenter = new Intl.Segmenter(undefined, {
    granularity: "grapheme",
});

function resolveReactionEmojiUrl(
    record: Pick<PostHistoryChildInteractionRecord, "content" | "tags">,
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

function resolveReactionDisplayContent(content: string): string {
    const normalized = content.trim();
    if (!normalized) {
        return "";
    }

    if (isCustomEmojiShortcodeText(normalized)) {
        return normalized;
    }

    const grapheme = reactionGraphemeSegmenter.segment(normalized)[Symbol.iterator]().next();
    if (grapheme.done) {
        return "";
    }

    return grapheme.value.segment;
}

function resolveProfileLookup(
    lookup: PostHistoryReactionProfileLookup | undefined,
    pubkey: string,
): ProfileData | null {
    if (!lookup) {
        return null;
    }

    return lookup instanceof Map
        ? lookup.get(pubkey) ?? null
        : lookup[pubkey] ?? null;
}

function formatReactionActorFallbackLabel(pubkey: string): string {
    try {
        return shortenMiddle(toNpub(pubkey), 9, 4);
    } catch {
        return pubkey.slice(0, 12);
    }
}

export function formatPostHistoryReactionActorLabel(
    actor: Pick<PostHistoryReactionActor, "pubkey" | "profile">,
): string {
    return actor.profile?.displayName?.trim()
        || actor.profile?.name?.trim()
        || formatReactionActorFallbackLabel(actor.pubkey);
}

export async function selectPostHistoryReactionRecords(
    parentEventId: string,
    adapter: Pick<PostHistoryReactionRecordsAdapter, "getReactionRecords"> = postHistoryReactionRecordsAdapter,
): Promise<PostHistoryChildInteractionRecord[]> {
    if (!parentEventId) {
        return [];
    }

    return adapter.getReactionRecords(parentEventId);
}

export function buildPostHistoryReactionReadModel(
    records: PostHistoryChildInteractionRecord[],
    profileLookup?: PostHistoryReactionProfileLookup,
): PostHistoryReactionReadModel {
    if (records.length === 0) {
        return EMPTY_POST_HISTORY_REACTION_READ_MODEL;
    }

    const groups: PostHistoryReactionGroup[] = [];
    const groupIndexByContent = new Map<string, number>();
    let totalCount = 0;

    for (const record of records) {
        if (record.kind !== 7) {
            continue;
        }

        totalCount += 1;
        const displayContent = resolveReactionDisplayContent(record.content);
        if (!displayContent) {
            continue;
        }

        const actor: PostHistoryReactionActor = {
            eventId: record.eventId,
            pubkey: record.authorPubkey,
            profile: resolveProfileLookup(profileLookup, record.authorPubkey),
            createdAt: record.createdAt,
        };
        const existingIndex = groupIndexByContent.get(displayContent);
        const emojiUrl = resolveReactionEmojiUrl(record);

        if (existingIndex === undefined) {
            groupIndexByContent.set(displayContent, groups.length);
            groups.push({
                content: displayContent,
                count: 1,
                ...(emojiUrl ? { emojiUrl } : {}),
                reactors: [actor],
            });
            continue;
        }

        const existingGroup = groups[existingIndex];
        const nextEmojiUrl = existingGroup.emojiUrl ?? emojiUrl;

        groups[existingIndex] = {
            ...existingGroup,
            count: existingGroup.count + 1,
            ...(nextEmojiUrl ? { emojiUrl: nextEmojiUrl } : {}),
            reactors: [...existingGroup.reactors, actor],
        };
    }

    if (totalCount === 0) {
        return EMPTY_POST_HISTORY_REACTION_READ_MODEL;
    }

    return {
        totalCount,
        groups,
    };
}