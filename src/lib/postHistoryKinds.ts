/** Authored timeline kinds; reply/reaction kinds deliberately remain separate. */
export const POST_HISTORY_AUTHORED_KINDS = [1, 6, 42, 1111] as const;
export const POST_HISTORY_AUTHORED_KINDS_KEY = POST_HISTORY_AUTHORED_KINDS.join(",");
export const POST_HISTORY_LEGACY_KINDS_KEY = "1,42,1111";
export function isPostHistoryAuthoredKind(kind: number): boolean {
    return (POST_HISTORY_AUTHORED_KINDS as readonly number[]).includes(kind);
}
