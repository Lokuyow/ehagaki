import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { PostHistoryTimelineCursor } from "./storage/postHistoryRepository";

export function toTimelineCursor(
    post: PostHistoryRecord | null | undefined,
): PostHistoryTimelineCursor | null {
    if (!post) {
        return null;
    }

    return {
        eventId: post.eventId,
        postedAt: post.postedAt,
        createdAt: post.createdAt,
    };
}

export function sameTimelineCursor(
    left: PostHistoryTimelineCursor | null | undefined,
    right: PostHistoryTimelineCursor | null | undefined,
): boolean {
    return !!left && !!right
        && left.postedAt === right.postedAt
        && left.createdAt === right.createdAt
        && left.eventId === right.eventId;
}
