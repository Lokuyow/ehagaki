import type { Draft } from "./types";

export function compareDraftsByDisplayOrder(
    a: Pick<Draft, "timestamp" | "pinned">,
    b: Pick<Draft, "timestamp" | "pinned">,
): number {
    if (!!a.pinned !== !!b.pinned) {
        return a.pinned ? -1 : 1;
    }

    return b.timestamp - a.timestamp;
}
