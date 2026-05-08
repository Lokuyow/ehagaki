import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent } from "./types";

export interface PostHistoryChannelReference {
    channelEventId?: string;
    channelRelayHints?: string[];
}

function cloneTags(tags: string[][]): string[][] {
    return tags.map((tag) => [...tag]);
}

function isSameTagList(left: unknown, right: string[][]): boolean {
    if (!Array.isArray(left) || left.length !== right.length) {
        return false;
    }

    return left.every((tag, tagIndex) => {
        if (!Array.isArray(tag) || tag.length !== right[tagIndex].length) {
            return false;
        }

        return tag.every((value, valueIndex) => value === right[tagIndex][valueIndex]);
    });
}

export function cloneNostrEvent(event: NostrEvent): NostrEvent {
    return {
        ...event,
        tags: cloneTags(event.tags),
    };
}

export function isSameSignedNostrEvent(rawEvent: unknown, event: NostrEvent): boolean {
    if (!rawEvent || typeof rawEvent !== "object") {
        return false;
    }

    const candidate = rawEvent as Partial<NostrEvent>;
    return candidate.id === event.id
        && candidate.pubkey === event.pubkey
        && candidate.kind === event.kind
        && candidate.content === event.content
        && candidate.created_at === event.created_at
        && candidate.sig === event.sig
        && isSameTagList(candidate.tags, event.tags);
}

export function extractPostHistoryChannelReference(
    event: Pick<NostrEvent, "kind" | "tags">,
): PostHistoryChannelReference {
    if (event.kind !== 42) {
        return {};
    }

    const eTags = event.tags.filter((tag) =>
        Array.isArray(tag)
        && tag[0] === "e"
        && typeof tag[1] === "string"
        && tag[1].trim().length > 0,
    );
    const rootTag = eTags.find((tag) => tag[3] === "root") ?? eTags[0];

    if (!rootTag) {
        return {};
    }

    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
        typeof rootTag[2] === "string" ? [rootTag[2]] : [],
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
    );

    return {
        channelEventId: rootTag[1],
        ...(relayHints.length > 0 ? { channelRelayHints: relayHints } : {}),
    };
}