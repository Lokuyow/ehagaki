import { nip19 } from "nostr-tools";
import { RelayConfigUtils } from "./relayConfigUtils";

export const COMPOSER_TARGET_INPUT_MAX_LENGTH = 5_000;
export const COMPOSER_TARGET_CHANNEL_ABOUT_PREVIEW_LENGTH = 200;
// This is a collapsed-render performance budget, not a user-visible content limit.
export const COMPOSER_TARGET_COLLAPSED_CONTENT_RENDER_LIMIT = 2_000;

export interface ComposerTargetCollapsedContent {
    content: string;
    exceedsRenderLimit: boolean;
}

export interface ComposerTargetPointer {
    format: "note" | "nevent";
    eventId: string;
    relayHints: string[];
    authorHint: string | null;
    kindHint: number | null;
}

export type ComposerTargetParseResult =
    | { status: "empty" }
    | { status: "supported"; pointer: ComposerTargetPointer }
    | { status: "unsupported"; format: "npub" | "nprofile" | "naddr" }
    | { status: "secret-key" }
    | { status: "invalid"; reason: "too-long" | "invalid-format" };

export type ComposerTargetAction = "reply" | "quote" | "channel";

export function parseComposerTargetInput(rawInput: string): ComposerTargetParseResult {
    if (rawInput.length > COMPOSER_TARGET_INPUT_MAX_LENGTH) {
        return { status: "invalid", reason: "too-long" };
    }

    const trimmed = rawInput.trim();
    if (!trimmed) {
        return { status: "empty" };
    }

    const value = trimmed.startsWith("nostr:")
        ? trimmed.slice("nostr:".length)
        : trimmed;
    if (!value) {
        return { status: "invalid", reason: "invalid-format" };
    }

    try {
        const decoded = nip19.decode(value);
        if (decoded.type === "note") {
            return {
                status: "supported",
                pointer: {
                    format: "note",
                    eventId: decoded.data as string,
                    relayHints: [],
                    authorHint: null,
                    kindHint: null,
                },
            };
        }

        if (decoded.type === "nevent") {
            const pointer = decoded.data as nip19.EventPointer;
            return {
                status: "supported",
                pointer: {
                    format: "nevent",
                    eventId: pointer.id,
                    relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
                        pointer.relays,
                        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
                    ),
                    authorHint: pointer.author ?? null,
                    kindHint: typeof pointer.kind === "number"
                        ? pointer.kind
                        : null,
                },
            };
        }

        if (
            decoded.type === "npub"
            || decoded.type === "nprofile"
            || decoded.type === "naddr"
        ) {
            return { status: "unsupported", format: decoded.type };
        }

        if (decoded.type === "nsec") {
            return { status: "secret-key" };
        }

        return { status: "invalid", reason: "invalid-format" };
    } catch {
        return { status: "invalid", reason: "invalid-format" };
    }
}

export function getComposerTargetActions(
    kind: number,
    hasResolvedChannel: boolean,
): ComposerTargetAction[] {
    if (kind === 1) return ["reply", "quote"];
    if (kind === 40) return hasResolvedChannel ? ["channel"] : [];
    if (kind === 42) {
        return hasResolvedChannel ? ["reply", "quote"] : [];
    }
    return [];
}

export function truncateComposerTargetPreview(
    value: string,
    limit: number,
): string {
    const characters = Array.from(value);
    if (characters.length <= limit) return value;
    return `${characters.slice(0, limit).join("")}…`;
}

export function limitComposerTargetCollapsedContent(
    value: string,
    limit = COMPOSER_TARGET_COLLAPSED_CONTENT_RENDER_LIMIT,
): ComposerTargetCollapsedContent {
    if (value.length <= limit) {
        return {
            content: value,
            exceedsRenderLimit: false,
        };
    }

    let sliceEnd = limit;
    const lastCodeUnit = value.charCodeAt(sliceEnd - 1);
    if (lastCodeUnit >= 0xd800 && lastCodeUnit <= 0xdbff) {
        sliceEnd -= 1;
    }

    return {
        content: value.slice(0, sliceEnd),
        exceedsRenderLimit: true,
    };
}
