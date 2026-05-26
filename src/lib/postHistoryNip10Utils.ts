import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent } from "./types";

export interface PostHistoryThreadReferenceTag {
    eventId: string;
    relayHint: string | null;
    marker: string | null;
    authorHint: string | null;
}

export interface PostHistoryThreadReferences {
    rootId: string | null;
    replyId: string | null;
    parentId: string | null;
    rootRelayHint: string | null;
    replyRelayHint: string | null;
    rootAuthorHint: string | null;
    replyAuthorHint: string | null;
    mentionEventIds: string[];
    ignoredEventIds: string[];
    relayHints: string[];
    authorHints: string[];
    isLegacy: boolean;
}

const HEX_64_PATTERN = /^[0-9a-f]{64}$/i;

const EMPTY_REFERENCES: PostHistoryThreadReferences = {
    rootId: null,
    replyId: null,
    parentId: null,
    rootRelayHint: null,
    replyRelayHint: null,
    rootAuthorHint: null,
    replyAuthorHint: null,
    mentionEventIds: [],
    ignoredEventIds: [],
    relayHints: [],
    authorHints: [],
    isLegacy: false,
};

function isValidHexId(value: unknown): value is string {
    return typeof value === "string" && HEX_64_PATTERN.test(value);
}

function normalizeMarker(value: unknown): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim().toLowerCase();
    return trimmed.length > 0 ? trimmed : null;
}

function parseETag(tag: string[]): PostHistoryThreadReferenceTag | null {
    const eventId = tag[1];
    if (!isValidHexId(eventId)) {
        return null;
    }

    const relayHint = RelayConfigUtils.sanitizeExternalRelayUrls(
        typeof tag[2] === "string" && tag[2].length > 0 ? [tag[2]] : [],
        { limit: 1 },
    )[0] ?? null;
    const authorHint = isValidHexId(tag[4]) ? tag[4] : null;

    return {
        eventId,
        relayHint,
        marker: normalizeMarker(tag[3]),
        authorHint,
    };
}

function compactUnique(values: Array<string | null | undefined>): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of values) {
        if (!value || seen.has(value)) {
            continue;
        }

        seen.add(value);
        result.push(value);
    }

    return result;
}

function normalizeReactionTargetMarker(value: unknown): "reply" | "root" | "unknown" | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim().toLowerCase();
    if (trimmed.length === 0 || isValidHexId(trimmed)) {
        return null;
    }

    if (trimmed === "reply" || trimmed === "root") {
        return trimmed;
    }

    return "unknown";
}

export function resolveKind7ReactionTargetEventId(
    event: Pick<NostrEvent, "kind" | "tags"> | null | undefined,
): string | null {
    if (!event || event.kind !== 7) {
        return null;
    }

    const eTags = event.tags.filter(
        (tag): tag is string[] => Array.isArray(tag) && tag[0] === "e" && isValidHexId(tag[1]),
    );
    if (eTags.length === 0) {
        return null;
    }

    const replyTag = [...eTags]
        .reverse()
        .find((tag) => normalizeReactionTargetMarker(tag[3]) === "reply");
    if (replyTag) {
        return replyTag[1];
    }

    const legacyLikeTag = [...eTags]
        .reverse()
        .find((tag) => normalizeReactionTargetMarker(tag[3]) === null);
    if (legacyLikeTag) {
        return legacyLikeTag[1];
    }

    const rootTag = [...eTags]
        .reverse()
        .find((tag) => normalizeReactionTargetMarker(tag[3]) === "root");
    if (rootTag) {
        return rootTag[1];
    }

    return eTags[eTags.length - 1][1];
}

export function parseKind1ThreadReferences(
    event: Pick<NostrEvent, "kind" | "tags"> | null | undefined,
): PostHistoryThreadReferences {
    if (!event || event.kind !== 1) {
        return { ...EMPTY_REFERENCES };
    }

    const eTags = event.tags
        .filter((tag) => Array.isArray(tag) && tag[0] === "e")
        .map(parseETag)
        .filter((tag): tag is PostHistoryThreadReferenceTag => tag !== null);
    if (eTags.length === 0) {
        return { ...EMPTY_REFERENCES };
    }

    const rootTag = eTags.find((tag) => tag.marker === "root") ?? null;
    const replyTag = [...eTags].reverse().find((tag) => tag.marker === "reply") ?? null;
    const mentionTags = eTags.filter((tag) => tag.marker === "mention");
    const ignoredTags = eTags.filter((tag) =>
        tag.marker !== null &&
        tag.marker !== "root" &&
        tag.marker !== "reply" &&
        tag.marker !== "mention"
    );
    const markedParentTags = [rootTag, replyTag].filter(
        (tag): tag is PostHistoryThreadReferenceTag => tag !== null,
    );
    const relayHints = compactUnique(eTags.map((tag) => tag.relayHint));
    const authorHints = compactUnique(eTags.map((tag) => tag.authorHint));

    if (markedParentTags.length > 0) {
        return {
            rootId: rootTag?.eventId ?? null,
            replyId: replyTag?.eventId ?? null,
            parentId: replyTag?.eventId ?? rootTag?.eventId ?? null,
            rootRelayHint: rootTag?.relayHint ?? null,
            replyRelayHint: replyTag?.relayHint ?? null,
            rootAuthorHint: rootTag?.authorHint ?? null,
            replyAuthorHint: replyTag?.authorHint ?? null,
            mentionEventIds: compactUnique(mentionTags.map((tag) => tag.eventId)),
            ignoredEventIds: compactUnique(ignoredTags.map((tag) => tag.eventId)),
            relayHints,
            authorHints,
            isLegacy: false,
        };
    }

    const legacyTags = eTags.filter((tag) => tag.marker === null);
    if (legacyTags.length === 0) {
        return {
            ...EMPTY_REFERENCES,
            mentionEventIds: compactUnique(mentionTags.map((tag) => tag.eventId)),
            ignoredEventIds: compactUnique(ignoredTags.map((tag) => tag.eventId)),
            relayHints,
            authorHints,
        };
    }

    const firstTag = legacyTags[0];
    const lastTag = legacyTags[legacyTags.length - 1];

    return {
        rootId: firstTag.eventId,
        replyId: legacyTags.length > 1 ? lastTag.eventId : null,
        parentId: lastTag.eventId,
        rootRelayHint: firstTag.relayHint,
        replyRelayHint: legacyTags.length > 1 ? lastTag.relayHint : null,
        rootAuthorHint: firstTag.authorHint,
        replyAuthorHint: legacyTags.length > 1 ? lastTag.authorHint : null,
        mentionEventIds: compactUnique(mentionTags.map((tag) => tag.eventId)),
        ignoredEventIds: compactUnique(ignoredTags.map((tag) => tag.eventId)),
        relayHints,
        authorHints,
        isLegacy: true,
    };
}
