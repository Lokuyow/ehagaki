// Settings storage reads these preferences in the startup graph, so this
// module must stay free of nostr-tools and storage imports.
export const EXTERNAL_NOSTR_CLIENTS = [
    "nostter",
    "jumble",
    "lumilumi",
    "primal",
    "njump",
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
