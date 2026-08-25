import { createImetaTag } from "./tags/imetaTag";
import type {
    ChannelContextState,
    ReplyQuoteComposerState,
} from "./types";
import type {
    EHagakiComposerContextSnapshot,
    EHagakiComposerOutput,
} from "../web-component/types";

const HOST_OWNED_FORBIDDEN_TAGS = new Set(["e", "p", "q", "a", "k", "client"]);

function cloneTag(tag: readonly string[]): string[] {
    return tag.map((value) => String(value));
}

function snapshotReference(reference: {
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
}) {
    return {
        eventId: reference.eventId,
        relayHints: [...reference.relayHints],
        authorPubkey: reference.authorPubkey,
    };
}

function freezeReference(reference: EHagakiComposerContextSnapshot["reply"]) {
    if (!reference) return null;
    return Object.freeze({
        eventId: reference.eventId,
        relayHints: Object.freeze([...reference.relayHints]),
        authorPubkey: reference.authorPubkey,
    });
}

/**
 * Produces a deep-frozen value at the public handoff boundary. TypeScript's
 * `Readonly` is intentionally only an API convenience here; the runtime
 * freeze ensures an async host handler cannot observe later composer changes
 * or mutate the captured snapshot.
 */
export function freezeHostOwnedComposerOutput(
    output: EHagakiComposerOutput,
): EHagakiComposerOutput {
    const channel = output.context.channel
        ? Object.freeze({
            eventId: output.context.channel.eventId,
            relayHints: Object.freeze([...output.context.channel.relayHints]),
            ...(output.context.channel.channelRelays
                ? { channelRelays: Object.freeze([...output.context.channel.channelRelays]) }
                : {}),
        })
        : null;
    const context = Object.freeze({
        reply: freezeReference(output.context.reply),
        quotes: Object.freeze(output.context.quotes.map((quote) => freezeReference(quote)!)),
        channel,
    });

    return Object.freeze({
        content: output.content,
        tags: Object.freeze(output.tags.map((tag) => Object.freeze([...tag]))),
        context,
    });
}

export function createHostOwnedContextSnapshot(params: {
    replyQuote: ReplyQuoteComposerState;
    channel: ChannelContextState | null;
}): EHagakiComposerContextSnapshot {
    return {
        reply: params.replyQuote.reply
            ? snapshotReference(params.replyQuote.reply)
            : null,
        quotes: params.replyQuote.quotes.map(snapshotReference),
        channel: params.channel
            ? {
                eventId: params.channel.eventId,
                relayHints: [...params.channel.relayHints],
                ...(params.channel.channelRelays
                    ? { channelRelays: [...params.channel.channelRelays] }
                    : {}),
            }
            : null,
    };
}

/**
 * Creates only the composer-owned portion of a host submission. In
 * particular, this intentionally does not create a Nostr event or reference
 * tags; those require the host's final event policy.
 */
export async function buildHostOwnedComposerOutput(params: {
    content: string;
    hashtagTags: string[][];
    hashtags: string[];
    contentWarningEnabled: boolean;
    contentWarningReason: string;
    contentWarningAvailable?: boolean;
    emojiTags: string[][];
    mediaImetaMap: Record<string, {
        m: string;
        blurhash?: string;
        dim?: string;
        alt?: string;
        size?: number;
        ox?: string;
        x?: string;
    }>;
    replyQuote: ReplyQuoteComposerState;
    channel: ChannelContextState | null;
}): Promise<EHagakiComposerOutput> {
    const tags = (params.hashtagTags.length > 0
        ? params.hashtagTags
        : params.hashtags.map((hashtag) => ["t", hashtag.toLowerCase()]))
        .filter((tag) => !HOST_OWNED_FORBIDDEN_TAGS.has(tag[0]))
        .map(cloneTag);
    const hasNsfwTag = tags.some((tag) => tag[0] === "t" && tag[1] === "nsfw");

    if (params.contentWarningAvailable !== false && (params.contentWarningEnabled || hasNsfwTag)) {
        const reason = params.contentWarningReason.trim();
        tags.push(reason ? ["content-warning", reason] : ["content-warning"]);
        if (params.contentWarningEnabled && !hasNsfwTag) {
            tags.push(["t", "nsfw"]);
        }
    }

    for (const emojiTag of params.emojiTags) {
        if (!HOST_OWNED_FORBIDDEN_TAGS.has(emojiTag[0])) {
            tags.push(cloneTag(emojiTag));
        }
    }

    for (const [url, metadata] of Object.entries(params.mediaImetaMap)) {
        if (url && metadata?.m) {
            tags.push(await createImetaTag({ url, ...metadata }));
        }
    }

    return freezeHostOwnedComposerOutput({
        content: params.content,
        tags,
        context: createHostOwnedContextSnapshot({
            replyQuote: params.replyQuote,
            channel: params.channel,
        }),
    });
}

export function isHostSubmissionEventId(value: unknown): value is string {
    return typeof value === "string" && /^[0-9a-f]{64}$/i.test(value);
}

/** Accepts the documented void or `{ eventId }` success shape only. */
export function getHostSubmissionEventId(result: unknown): string | undefined {
    if (result === undefined) return undefined;
    if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw new TypeError("Host-owned submit must return void or an eventId object.");
    }
    const eventId = (result as { eventId?: unknown }).eventId;
    if (eventId === undefined) return undefined;
    if (!isHostSubmissionEventId(eventId)) {
        throw new TypeError("Host-owned submit returned an invalid eventId.");
    }
    return eventId;
}
