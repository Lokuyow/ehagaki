import type { PostHistoryRecord } from "./storage/ehagakiDb";
import { buildPostHistoryNevent } from "./postHistoryNevent";

export const EXTERNAL_NOSTR_CLIENTS = [
    "nostter",
    "jumble",
    "primal",
    "njump",
    "lumilumi",
    "custom",
] as const;

export type ExternalNostrClient = (typeof EXTERNAL_NOSTR_CLIENTS)[number];

export interface ExternalNostrClientPreference {
    client: ExternalNostrClient;
    customUrlTemplate: string;
}

export const EXTERNAL_NOSTR_CLIENT_PRESET_TEMPLATES: Record<
    Exclude<ExternalNostrClient, "custom">,
    string
> = {
    nostter: "https://nostter.app/{nevent}",
    jumble: "https://jumble.social/{nevent}",
    primal: "https://primal.net/e/{nevent}",
    njump: "https://njump.me/{nevent}",
    lumilumi: "https://lumilumi.app/{nevent}",
};

const EXTERNAL_NOSTR_CLIENT_LABELS: Record<ExternalNostrClient, string> = {
    nostter: "Nostter",
    jumble: "Jumble",
    primal: "Primal",
    njump: "njump",
    lumilumi: "Lumilumi",
    custom: "",
};

export function isExternalNostrClient(
    value: string | null | undefined,
): value is ExternalNostrClient {
    return typeof value === "string" && EXTERNAL_NOSTR_CLIENTS.includes(
        value as ExternalNostrClient,
    );
}

export function normalizeExternalNostrClient(
    value: string | null | undefined,
): ExternalNostrClient | null {
    return isExternalNostrClient(value) ? value : null;
}

export function normalizeExternalNostrClientUrlTemplate(
    value: string | null | undefined,
): string | null {
    const normalized = value?.trim() ?? "";
    if (!normalized || normalized.split("{nevent}").length !== 2) {
        return null;
    }

    try {
        const url = new URL(normalized);
        return url.protocol === "https:" && url.hostname
            ? normalized
            : null;
    } catch {
        return null;
    }
}

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
