import { getDefaultEndpoint, uploadEndpoints } from "../constants";
import type { UploadDestination, UploadDestinationCapabilities, UploadPresetId, UploadProtocol } from "../types";

export const UPLOAD_DESTINATION_SCHEMA_VERSION = 1;
export const UPLOAD_DESTINATION_GLOBAL_SCOPE = "__ehagaki_global__";

export const DEFAULT_UPLOAD_CAPABILITIES: UploadDestinationCapabilities = {
    maxUploadSize: null,
    supportedMimeTypes: [],
    supportsDelete: false,
    supportsList: false,
    supportsMirror: false,
    supportsMediaOptimization: false,
    authRequired: true,
    source: "preset",
};

export interface UploadDestinationPreset {
    id: UploadPresetId;
    name: string;
    protocol: UploadProtocol;
    serverUrl: string;
    resolvedUploadUrl?: string;
    nip96ServerUrl?: string;
    capabilities: UploadDestinationCapabilities;
}

const FILES_SOVBIT_PRESET: UploadDestinationPreset = {
    id: "files-sovbit-host",
    name: "files.sovbit.host",
    protocol: "blossom",
    serverUrl: "https://files.sovbit.host",
    capabilities: {
        ...DEFAULT_UPLOAD_CAPABILITIES,
        supportedMimeTypes: ["image/*", "video/*"],
    },
};

export function isFilesSovbitUploadEndpoint(value: string): boolean {
    try {
        const url = new URL(value).toString().replace(/\/$/, "");
        return [FILES_SOVBIT_PRESET.serverUrl, `${FILES_SOVBIT_PRESET.serverUrl}/upload`,
            `${FILES_SOVBIT_PRESET.serverUrl}/api/v2/media`].includes(url);
    } catch {
        return false;
    }
}

export function normalizeLegacySovbitDestination(destination: UploadDestination): UploadDestination {
    if (destination.protocol !== "nip96" || !isFilesSovbitUploadEndpoint(destination.serverUrl)
        || (destination.resolvedUploadUrl && !isFilesSovbitUploadEndpoint(destination.resolvedUploadUrl))
        || (destination.nip96ServerUrl && !isFilesSovbitUploadEndpoint(destination.nip96ServerUrl))) {
        return destination;
    }
    const { resolvedUploadUrl: _uploadUrl, nip96ServerUrl: _serverUrl, nip96UrlMode: _mode, ...rest } = destination;
    return {
        ...rest,
        name: FILES_SOVBIT_PRESET.name,
        protocol: "blossom",
        serverUrl: FILES_SOVBIT_PRESET.serverUrl,
        presetId: FILES_SOVBIT_PRESET.id,
        capabilities: { ...FILES_SOVBIT_PRESET.capabilities,
            supportedMimeTypes: [...FILES_SOVBIT_PRESET.capabilities.supportedMimeTypes] },
        auth: { type: "blossom-bud11" },
    };
}

const NIP96_PRESET_IDS: Record<string, UploadPresetId> = {
    "https://nostr.build/api/v2/nip96/upload": "nostr-build",
    "https://share.yabu.me/api/v2/media": "share-yabu-me",
    "https://nostpic.com/api/v2/media": "nostpic-com",
    "https://nostrcheck.me/api/v2/media": "nostrcheck-me",
};

const NIP96_DIRECT_UPLOAD_URLS: Record<string, string> = {
    "https://share.yabu.me/api/v2/media": "https://yabu.me/api/v2/media",
    "https://nostrcheck.me/api/v2/media": "https://cdn.nostrcheck.me/",
    "https://nostr.build/api/v2/nip96/upload": "https://nostr.build/api/v2/nip96/upload",
    "https://nostpic.com/api/v2/media": "https://nostpic.com/api/v2/media",
};

function createNip96Preset(endpointUrl: string): UploadDestinationPreset {
    const endpoint = uploadEndpoints.find((candidate) => candidate.url === endpointUrl);

    if (!endpoint) {
        throw new Error(`Missing NIP-96 upload endpoint preset: ${endpointUrl}`);
    }

    return {
        id: NIP96_PRESET_IDS[endpoint.url] ?? "custom",
        name: endpoint.label,
        protocol: "nip96",
        serverUrl: endpoint.url,
        resolvedUploadUrl: NIP96_DIRECT_UPLOAD_URLS[endpoint.url] ?? endpoint.url,
        nip96ServerUrl: new URL(endpoint.url).origin,
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
            supportedMimeTypes: ["image/*", "video/*"],
            source: "preset",
        },
    };
}

function getUrlHost(url: string | null | undefined): string | null {
    if (!url) return null;

    try {
        return new URL(normalizeServerUrl(url)).host || null;
    } catch {
        return null;
    }
}

export function getUploadDestinationDisplayName(params: {
    serverUrl: string;
    resolvedUploadUrl?: string | null;
    fallbackName?: string | null;
    protocol?: UploadProtocol;
    presetId?: UploadPresetId | null;
}): string {
    const preset = findUploadDestinationPresetIdentity(params);
    if (preset) return preset.name;

    if (params.presetId && params.presetId !== "custom") {
        return getUrlHost(params.serverUrl)
            ?? params.fallbackName?.trim()
            ?? normalizeServerUrl(params.serverUrl)
            ?? "Custom NIP-96";
    }

    return getUrlHost(params.resolvedUploadUrl)
        ?? getUrlHost(params.serverUrl)
        ?? params.fallbackName?.trim()
        ?? normalizeServerUrl(params.serverUrl)
        ?? "Custom NIP-96";
}

export function getPreferredDefaultUploadPresetIds(locale: string | null | undefined): UploadPresetId[] {
    return locale === "ja"
        ? ["share-yabu-me", "blossom-band"]
        : ["blossom-band", "share-yabu-me"];
}

function getDefaultUploadDestinationPreset(locale: string | null | undefined): UploadDestinationPreset | null {
    for (const presetId of getPreferredDefaultUploadPresetIds(locale)) {
        const preset = UPLOAD_DESTINATION_PRESETS.find((candidate) => candidate.id === presetId);
        if (preset) {
            return preset;
        }
    }

    return UPLOAD_DESTINATION_PRESETS[0] ?? null;
}

export const UPLOAD_DESTINATION_PRESETS: UploadDestinationPreset[] = [
    createNip96Preset("https://share.yabu.me/api/v2/media"),
    {
        id: "cdn-nostrcheck-me",
        name: "cdn.nostrcheck.me",
        protocol: "blossom",
        serverUrl: "https://cdn.nostrcheck.me",
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
        },
    },
    createNip96Preset("https://nostrcheck.me/api/v2/media"),
    {
        id: "blossom-band",
        name: "blossom.band",
        protocol: "blossom",
        serverUrl: "https://blossom.band",
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
            supportsDelete: true,
            supportsList: false,
        },
    },
    {
        id: "nostr-download",
        name: "nostr.download",
        protocol: "blossom",
        serverUrl: "https://nostr.download",
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
        },
    },
    {
        id: "blossom-primal-net",
        name: "blossom.primal.net",
        protocol: "blossom",
        serverUrl: "https://blossom.primal.net",
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
        },
    },
    createNip96Preset("https://nostr.build/api/v2/nip96/upload"),
    createNip96Preset("https://nostpic.com/api/v2/media"),
    FILES_SOVBIT_PRESET,
];

export function createUploadDestinationId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `upload-destination-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getScopeKey(pubkeyHex: string | null | undefined): string {
    return pubkeyHex || UPLOAD_DESTINATION_GLOBAL_SCOPE;
}

export function normalizeServerUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return "";

    try {
        const parsed = new URL(trimmed);
        parsed.hash = "";
        return parsed.toString().replace(/\/$/, "");
    } catch {
        return trimmed;
    }
}

export function findUploadPresetByEndpoint(endpoint: string | null | undefined): UploadDestinationPreset | null {
    if (!endpoint) return null;
    if (isFilesSovbitUploadEndpoint(endpoint)) return FILES_SOVBIT_PRESET;
    const normalizedEndpoint = normalizeServerUrl(endpoint);

    const serverUrlMatch = UPLOAD_DESTINATION_PRESETS.find((preset) =>
        preset !== FILES_SOVBIT_PRESET && normalizeServerUrl(preset.serverUrl) === normalizedEndpoint,
    );
    if (serverUrlMatch) return serverUrlMatch;

    return UPLOAD_DESTINATION_PRESETS.find((preset) =>
        preset.resolvedUploadUrl
        && normalizeServerUrl(preset.resolvedUploadUrl) === normalizedEndpoint,
    ) ?? null;
}

export function findUploadDestinationPresetIdentity(params: {
    protocol?: UploadProtocol;
    presetId?: UploadPresetId | null;
    serverUrl: string;
}): UploadDestinationPreset | null {
    if (!params.presetId || params.presetId === "custom") return null;

    const preset = UPLOAD_DESTINATION_PRESETS.find((candidate) => candidate.id === params.presetId);
    if (!preset || preset.protocol !== params.protocol) return null;

    const normalizedServerUrl = normalizeServerUrl(params.serverUrl);
    const matchesPresetEndpoint = normalizeServerUrl(preset.serverUrl) === normalizedServerUrl
        || (preset.resolvedUploadUrl !== undefined
            && normalizeServerUrl(preset.resolvedUploadUrl) === normalizedServerUrl);

    return matchesPresetEndpoint
        ? preset
        : null;
}

export function createUploadDestinationFromPreset(params: {
    preset: UploadDestinationPreset;
    pubkeyHex?: string | null;
    isDefault?: boolean;
    now?: number;
}): UploadDestination {
    const timestamp = params.now ?? Date.now();
    const serverUrl = normalizeServerUrl(params.preset.serverUrl);

    return {
        id: createUploadDestinationId(),
        pubkeyHex: params.pubkeyHex ?? null,
        name: getUploadDestinationDisplayName({
            serverUrl,
            resolvedUploadUrl: params.preset.resolvedUploadUrl,
            fallbackName: params.preset.name,
            protocol: params.preset.protocol,
            presetId: params.preset.id,
        }),
        protocol: params.preset.protocol,
        serverUrl,
        ...(params.preset.resolvedUploadUrl ? { resolvedUploadUrl: params.preset.resolvedUploadUrl } : {}),
        ...(params.preset.nip96ServerUrl ? { nip96ServerUrl: params.preset.nip96ServerUrl, nip96UrlMode: "direct" as const } : {}),
        presetId: params.preset.id,
        isDefault: params.isDefault ?? false,
        enabled: true,
        createdAt: timestamp,
        updatedAt: timestamp,
        capabilities: { ...params.preset.capabilities },
        auth: {
            type: params.preset.protocol === "blossom" ? "blossom-bud11" : "nip98",
        },
        schemaVersion: UPLOAD_DESTINATION_SCHEMA_VERSION,
    };
}

export function createLegacyUploadDestination(params: {
    endpoint: string;
    locale?: string | null;
    pubkeyHex?: string | null;
    now?: number;
}): UploadDestination {
    const endpoint = params.endpoint.trim();
    const preset = endpoint
        ? findUploadPresetByEndpoint(endpoint)
        : getDefaultUploadDestinationPreset(params.locale);
    if (preset) {
        return createUploadDestinationFromPreset({
            preset,
            pubkeyHex: params.pubkeyHex,
            isDefault: true,
            now: params.now,
        });
    }

    const fallbackEndpoint = endpoint || getDefaultEndpoint(params.locale);
    const timestamp = params.now ?? Date.now();
    return {
        id: createUploadDestinationId(),
        pubkeyHex: params.pubkeyHex ?? null,
        name: getUploadDestinationDisplayName({
            serverUrl: fallbackEndpoint,
            fallbackName: "Custom NIP-96",
        }),
        protocol: "nip96",
        serverUrl: normalizeServerUrl(fallbackEndpoint),
        resolvedUploadUrl: fallbackEndpoint,
        presetId: "custom",
        isDefault: true,
        enabled: true,
        createdAt: timestamp,
        updatedAt: timestamp,
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
            supportedMimeTypes: ["image/*", "video/*"],
        },
        auth: { type: "nip98" },
        schemaVersion: UPLOAD_DESTINATION_SCHEMA_VERSION,
    };
}
