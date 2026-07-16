import { parsePostHistoryThreadReferences } from "./postHistoryNip10Utils";
import {
    parsePostHistoryQuoteReferences,
    type PostHistoryQuoteReference,
} from "./postHistoryQuoteUtils";
import type { RelatedTargetDescriptor } from "./postHistoryRelatedTargetResolver.svelte";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { PostHistoryThreadGraphNode } from "./postHistoryThreadGraphUtils";

const POST_HISTORY_RELATED_TARGET_DISCOVERY_RELAY_LIMIT = 8;

export interface PostHistoryQuoteTargetContext {
    eventId: string;
    sourceEventId: string;
    authorHint: string | null;
    relayHints: string[];
}

export interface PostHistoryQuoteTargetIndex {
    byPostId: Record<string, PostHistoryQuoteReference[]>;
    contextsByEventId: Record<string, PostHistoryQuoteTargetContext>;
}

export interface PostHistoryReplyParentTargetContext {
    sourceEventId: string;
    targetEventId: string;
    authorHint: string | null;
    relayHints: string[];
}

export const EMPTY_POST_HISTORY_QUOTE_TARGET_INDEX: PostHistoryQuoteTargetIndex = {
    byPostId: {},
    contextsByEventId: {},
};

function sanitizeRelayHints(relayHints: string[]): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relayHints, {
        limit: POST_HISTORY_RELATED_TARGET_DISCOVERY_RELAY_LIMIT,
    });
}

function toDescriptor(input: {
    sourceEventId: string;
    targetEventId: string;
    relationKind: string;
    relayHints: string[];
    authorHint: string | null;
    scopeKey: string;
}): RelatedTargetDescriptor {
    return {
        sourceEventId: input.sourceEventId,
        targetEventId: input.targetEventId,
        relationKind: input.relationKind,
        relayHints: sanitizeRelayHints(input.relayHints),
        authorHint: input.authorHint,
        scopeKey: input.scopeKey,
    };
}

export const postHistoryQuoteTargetDiscoveryAdapter = {
    buildIndex(posts: PostHistoryRecord[]): PostHistoryQuoteTargetIndex {
        const byPostId: Record<string, PostHistoryQuoteReference[]> = {};
        const contextsByEventId: Record<string, PostHistoryQuoteTargetContext> = {};

        for (const post of posts) {
            const references = parsePostHistoryQuoteReferences(post);
            if (references.length === 0) {
                continue;
            }

            byPostId[post.eventId] = references;
            for (const reference of references) {
                const existing = contextsByEventId[reference.eventId];
                contextsByEventId[reference.eventId] = {
                    eventId: reference.eventId,
                    sourceEventId: existing?.sourceEventId ?? post.eventId,
                    authorHint: existing?.authorHint ?? reference.authorHint,
                    relayHints: sanitizeRelayHints([
                        ...(existing?.relayHints ?? []),
                        ...(reference.relayHint ? [reference.relayHint] : []),
                        ...post.relayHints,
                        ...post.acceptedRelays,
                        ...(post.fetchedRelays ?? []),
                    ]),
                };
            }
        }

        return {
            byPostId,
            contextsByEventId,
        };
    },

    toDescriptor(
        context: PostHistoryQuoteTargetContext,
        scopeKey: string,
    ): RelatedTargetDescriptor {
        return toDescriptor({
            sourceEventId: context.sourceEventId,
            targetEventId: context.eventId,
            relationKind: "quote",
            relayHints: context.relayHints,
            authorHint: context.authorHint,
            scopeKey,
        });
    },
};

export const postHistoryReplyParentTargetDiscoveryAdapter = {
    getRelayHints(post: PostHistoryRecord, node: PostHistoryThreadGraphNode): string[] {
        const references = parsePostHistoryThreadReferences(node.event);
        return sanitizeRelayHints([
            ...(references.replyRelayHint ? [references.replyRelayHint] : []),
            ...(references.rootRelayHint ? [references.rootRelayHint] : []),
            ...node.relayUrls,
            ...references.relayHints,
            ...post.relayHints,
            ...post.acceptedRelays,
            ...(post.fetchedRelays ?? []),
        ]);
    },

    getAuthorHint(node: PostHistoryThreadGraphNode): string | null {
        const references = parsePostHistoryThreadReferences(node.event);
        if (!references.parentId) {
            return null;
        }

        if (references.parentId === references.replyId) {
            return references.replyAuthorHint;
        }

        if (references.parentId === references.rootId) {
            return references.rootAuthorHint;
        }

        return references.replyAuthorHint ?? references.rootAuthorHint;
    },

    buildContext(
        post: PostHistoryRecord,
        nodeEventId: string,
        node: PostHistoryThreadGraphNode,
    ): PostHistoryReplyParentTargetContext | null {
        if (!node.parentEventId) {
            return null;
        }

        return {
            sourceEventId: nodeEventId,
            targetEventId: node.parentEventId,
            authorHint: this.getAuthorHint(node),
            relayHints: this.getRelayHints(post, node),
        };
    },

    toDescriptor(
        context: PostHistoryReplyParentTargetContext,
        scopeKey: string,
    ): RelatedTargetDescriptor {
        return toDescriptor({
            sourceEventId: context.sourceEventId,
            targetEventId: context.targetEventId,
            relationKind: "reply-parent",
            relayHints: context.relayHints,
            authorHint: context.authorHint,
            scopeKey,
        });
    },
};
