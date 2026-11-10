import { isLowerHex64 } from "./utils/nostrHexUtils";

export interface ProfileEventIdentity {
    sourceEventId: string;
    updatedAtFromEvent: number;
}

export type ProfileEventComparison =
    | "same-event"
    | "candidate-newer"
    | "candidate-older"
    | "candidate-wins-tie-break"
    | "candidate-loses-tie-break";

export function isValidProfileEventIdentity(
    identity: ProfileEventIdentity,
): boolean {
    return isLowerHex64(identity.sourceEventId)
        && Number.isSafeInteger(identity.updatedAtFromEvent)
        && identity.updatedAtFromEvent >= 0;
}

export function compareProfileEventIdentity(
    existing: ProfileEventIdentity,
    candidate: ProfileEventIdentity,
): ProfileEventComparison {
    if (candidate.sourceEventId === existing.sourceEventId) {
        return "same-event";
    }

    if (candidate.updatedAtFromEvent > existing.updatedAtFromEvent) {
        return "candidate-newer";
    }

    if (candidate.updatedAtFromEvent < existing.updatedAtFromEvent) {
        return "candidate-older";
    }

    return candidate.sourceEventId < existing.sourceEventId
        ? "candidate-wins-tie-break"
        : "candidate-loses-tie-break";
}
