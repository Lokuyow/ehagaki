import { nip19 } from "nostr-tools";
import { RelayConfigUtils } from "./relayConfigUtils";
import { scanHttpUrlCandidates } from "./utils/httpUrlCandidates";
import { isLowerHex64 } from "./utils/nostrHexUtils";
import { formatShortNpub } from "./utils/nostrUtils";
import { segmentGraphemes } from "./utils/graphemeUtils";
import type { ProfileData } from "./types";

export interface ProfileMention {
    pubkey: string;
    relayHints: string[];
}

export interface ProfileMentionCandidate extends ProfileMention {
    label: string;
}

export interface ProfileMentionSource {
    readProfile(pubkey: string): ProfileData | null | undefined;
    getInlineLoader(): (mention: ProfileMention, signal: AbortSignal) => Promise<ProfileData | null>;
}

export const PROFILE_MENTION_NODE = "profileMention";
export const PROFILE_MENTION_ATTRIBUTE = "data-nostr-mention";
export const PROFILE_POINTER_MAX_LENGTH = 5_000;

export function parseProfilePointer(value: string): ProfileMention | null {
    if (!/^(?:npub|nprofile)1/i.test(value) || value.length > PROFILE_POINTER_MAX_LENGTH) {
        return null;
    }
    try {
        const decoded = nip19.decode(value);
        if (decoded.type === "npub" && isLowerHex64(decoded.data)) {
            return { pubkey: decoded.data, relayHints: [] };
        }
        if (decoded.type === "nprofile" && isLowerHex64(decoded.data.pubkey)) {
            return {
                pubkey: decoded.data.pubkey,
                relayHints: sanitizeProfileRelayHints(decoded.data.relays),
            };
        }
    } catch {
        // Unrecognized or malformed Bech32 input stays plain text.
    }
    return null;
}

function sanitizeProfileRelayHints(hints: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(hints, {
        limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT,
    }).filter(hint => /^[\x21-\x7e]{1,255}$/.test(hint));
}

export function encodeProfilePointer({ pubkey, relayHints }: ProfileMention): string {
    const relays = sanitizeProfileRelayHints(relayHints);
    return relays.length ? nip19.nprofileEncode({ pubkey, relays }) : nip19.npubEncode(pubkey);
}

export function profileMentionUri(mention: ProfileMention): string {
    return `nostr:${encodeProfilePointer(mention)}`;
}

export function parseProfileMentionUri(value: unknown): ProfileMention | null {
    return typeof value === "string" && /^nostr:/i.test(value)
        ? parseProfilePointer(value.slice("nostr:".length))
        : null;
}

export function serializeProfileMentionText(
    uri: unknown,
    preceding: string,
    following: string,
): string {
    const pointer = parseProfileMentionUri(uri);
    if (!pointer) return "";
    const before = /\S$/.test(preceding) ? " " : "";
    const after = /^[a-z0-9_]/i.test(following) ? " " : "";
    return `${before}${profileMentionUri(pointer)}${after}`;
}

export function scanProfileMentions(content: string) {
    const mentions: Array<ProfileMention & { start: number; end: number }> = [];
    if (!/nostr:(?:npub|nprofile)1/i.test(content)) return mentions;

    const urls = scanHttpUrlCandidates(content).filter(url => url.isValidHttpUrl);
    let urlIndex = 0;
    for (const match of content.matchAll(/nostr:(?:npub|nprofile)1[a-z0-9]+/gi)) {
        const start = match.index;
        const end = start + match[0].length;
        if (start > 0 && /[a-z0-9_]/i.test(content[start - 1]!)) continue;
        if (end < content.length && content[end] === "_") continue;
        while (urls[urlIndex] && urls[urlIndex]!.end <= start) urlIndex++;
        if (urls[urlIndex] && urls[urlIndex]!.start <= start) continue;
        const pointer = parseProfileMentionUri(match[0]);
        if (pointer) mentions.push({ ...pointer, start, end });
    }
    return mentions;
}

export function eventMentionsProfile(event: { content: string; tags: string[][] }, pubkey: string): boolean {
    const warning = event.tags.find(tag => tag[0] === "content-warning");
    const body = warning?.[2] ?? event.content;
    return scanProfileMentions(body).some(mention => mention.pubkey === pubkey);
}

export function profileMentionLabel(
    pubkey: string,
    profile?: { displayName: string; name: string } | null,
    petname?: string,
): string {
    return profile?.displayName?.trim() || profile?.name?.trim() || petname?.trim() || formatShortNpub(pubkey);
}

export function shortenProfileMentionLabel(value: string): string {
    const name = value.trim().replace(/\s+/g, " ");
    const maxGraphemes = 24;
    const maxCodeUnits = 128;
    let label = "";
    let count = 0;
    // Include one extra code unit to distinguish a complete final grapheme from a clipped one.
    for (const { segment } of segmentGraphemes(name.slice(0, maxCodeUnits + 1))) {
        if (count === maxGraphemes || label.length + segment.length > maxCodeUnits) return `${label}…`;
        label += segment;
        count++;
    }
    return label;
}

export function readProfileNip05(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const claim = value.trim();
    return claim.length <= 320 && /^[a-z0-9._-]+@[^\s@]+$/i.test(claim) ? claim : null;
}
