import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type {
    ChannelContextQueryTarget,
    NostrEvent,
    ReplyQuoteQueryTarget,
} from "./types";
import {
    extractPostHistoryChannelReference,
    isPostHistoryRawEventConsistent,
} from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT,
    CHANNEL_TEMPORARY_READ_RELAY_LIMIT,
} from "./channelContextConstants";

export function buildPostHistoryReplySeedEvents(
    post: PostHistoryRecord,
): Record<string, NostrEvent> | undefined {
    if (!isPostHistoryRawEventConsistent(post.rawEvent, post)) {
        return undefined;
    }

    return {
        [post.eventId]: post.rawEvent,
    };
}

export function buildPostHistoryReferenceTarget(
    post: PostHistoryRecord,
): ReplyQuoteQueryTarget {
    return {
        eventId: post.eventId,
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
            [...post.relayHints, ...post.acceptedRelays],
            { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
        ),
        authorPubkey: post.pubkeyHex,
    };
}

export function buildPostHistoryReplyChannelContextQuery(
    post: PostHistoryRecord,
): ChannelContextQueryTarget | null {
    if (post.kind !== 42) {
        return null;
    }

    const derivedReference = isPostHistoryRawEventConsistent(post.rawEvent, post)
        ? extractPostHistoryChannelReference(post.rawEvent)
        : extractPostHistoryChannelReference({ kind: post.kind, tags: post.tags });

    if (!derivedReference.channelEventId) {
        return null;
    }

    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
        [
            ...(derivedReference.channelRelayHints ?? []),
            ...(post.channelRelayHints ?? []),
            ...(post.fetchedRelays ?? []),
            ...post.relayHints,
            ...post.acceptedRelays,
        ],
        { limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT },
    );
    const channelRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
        post.acceptedRelays,
        { limit: CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT },
    );

    return {
        eventId: derivedReference.channelEventId,
        relayHints,
        ...(channelRelays.length > 0 ? { channelRelays } : {}),
    };
}
