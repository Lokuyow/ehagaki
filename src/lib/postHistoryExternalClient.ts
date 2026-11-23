import { nip19 } from "nostr-tools";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import { buildPostHistoryNevent } from "./postHistoryNevent";
import { encodeProfilePointer, type ProfileMention } from "./profileMention";
import {
    EXTERNAL_NOSTR_CLIENT_PRESET_TEMPLATES,
    normalizeExternalNostrClientUrlTemplate,
    type ExternalNostrClient,
    type ExternalNostrClientPreference,
} from "./externalNostrClientPreference";

export {
    EXTERNAL_NOSTR_CLIENTS,
    EXTERNAL_NOSTR_CLIENT_PRESET_TEMPLATES,
    isExternalNostrClient,
    normalizeExternalNostrClient,
    normalizeExternalNostrClientUrlTemplate,
    type ExternalNostrClient,
    type ExternalNostrClientPreference,
} from "./externalNostrClientPreference";

const EXTERNAL_NOSTR_CLIENT_LABELS: Record<ExternalNostrClient, string> = {
    nostter: "nostter",
    jumble: "Jumble",
    primal: "Primal",
    njump: "njump",
    lumilumi: "Lumilumi",
    custom: "",
};

export function resolveExternalNostrClientTemplate(
    preference: ExternalNostrClientPreference,
): string | null {
    if (preference.client === "custom") {
        return normalizeExternalNostrClientUrlTemplate(
            preference.customUrlTemplate,
        );
    }

    return EXTERNAL_NOSTR_CLIENT_PRESET_TEMPLATES[preference.client];
}

export function buildExternalNostrClientUrl(
    preference: ExternalNostrClientPreference,
    nevent: string,
): string | null {
    if (!nevent) {
        return null;
    }

    const template = resolveExternalNostrClientTemplate(preference);
    if (!template) {
        return null;
    }

    const url = template.replace("{nevent}", nevent);
    try {
        return new URL(url).protocol === "https:" ? url : null;
    } catch {
        return null;
    }
}

export function buildPostHistoryExternalClientUrl(
    post: PostHistoryRecord,
    preference: ExternalNostrClientPreference,
    writeRelays: string[] = [],
): string | null {
    return buildExternalNostrClientUrl(
        preference,
        buildPostHistoryNevent(post, writeRelays),
    );
}

export function buildProfileExternalClientUrl(
    profile: ProfileMention,
    preference: ExternalNostrClientPreference,
): string {
    if (preference.client === "primal") {
        return `https://primal.net/p/${nip19.npubEncode(profile.pubkey)}`;
    }

    const pointer = encodeProfilePointer(profile);
    if (preference.client === "jumble") {
        return `https://jumble.social/users/${pointer}`;
    }
    const identifier = preference.client === "lumilumi" ? nip19.npubEncode(profile.pubkey) : pointer;
    return buildExternalNostrClientUrl(preference, identifier) ?? `https://njump.me/${pointer}`;
}

export function buildHashtagExternalClientUrl(
    hashtag: string,
    preference: ExternalNostrClientPreference,
    kind?: number,
): string | null {
    if (!hashtag) {
        return null;
    }

    switch (preference.client) {
        case "nostter":
            return `https://nostter.app/search?q=${encodeURIComponent(`#${hashtag}`)}`;
        case "jumble":
            return `https://jumble.social/notes?t=${encodeURIComponent(hashtag.toLowerCase())}`;
        case "lumilumi":
            return `https://lumilumi.app/search?q=${encodeURIComponent(`t:${hashtag} kind:${kind || 1}`)}`;
        case "primal":
            return `https://primal.net/search/${encodeURIComponent(`#${hashtag}`)}`;
        default:
            // njump とカスタムテンプレートにはハッシュタグを開く URL がない
            return null;
    }
}

export function getExternalNostrClientDisplayName(
    preference: ExternalNostrClientPreference,
): string | null {
    if (preference.client !== "custom") {
        return EXTERNAL_NOSTR_CLIENT_LABELS[preference.client];
    }

    const template = resolveExternalNostrClientTemplate(preference);
    if (!template) {
        return null;
    }

    try {
        return new URL(template).hostname || null;
    } catch {
        return null;
    }
}
