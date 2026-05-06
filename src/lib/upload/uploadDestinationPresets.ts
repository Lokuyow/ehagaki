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
    capabilities: UploadDestinationCapabilities;
}

const NIP96_PRESET_IDS: Record<string, UploadPresetId> = {
    "https://nostr.build/api/v2/nip96/upload": "nostr-build",
    "https://share.yabu.me/api/v2/media": "share-yabu-me",
    "https://nostpic.com/api/v2/media": "nostpic-com",
    "https://nostrcheck.me/api/v2/media": "nostrcheck-me",
    "https://files.sovbit.host/api/v2/media": "files-sovbit-host",
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
        resolvedUploadUrl: endpoint.url,
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
            supportedMimeTypes: ["image/*", "video/*"],
            source: "preset",
        },
    };
}

export function getPreferredDefaultUploadPresetIds(locale: string | null | undefined): UploadPresetId[] {
    return locale === "ja"
        ? ["share-yabu-me-blossom", "blossom-band"]
        : ["blossom-band", "share-yabu-me-blossom"];
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
    {
        id: "share-yabu-me-blossom",
        name: "share.yabu.me(blossom)",
        protocol: "blossom",
        serverUrl: "https://share.yabu.me/api/v2/media",
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
        },
    },
    createNip96Preset("https://share.yabu.me/api/v2/media"),
    {
        id: "cdn-nostrcheck-me",
        name: "nostrcheck.me(blossom)",
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
            supportsList: true,
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
    createNip96Preset("https://files.sovbit.host/api/v2/media"),
];

function createUploadDestinationId(): string {
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
    const normalizedEndpoint = normalizeServerUrl(endpoint);

    const resolvedUploadUrlMatch = UPLOAD_DESTINATION_PRESETS.find((preset) =>
        preset.resolvedUploadUrl
        && normalizeServerUrl(preset.resolvedUploadUrl) === normalizedEndpoint,
    );

    if (resolvedUploadUrlMatch) {
        return resolvedUploadUrlMatch;
    }

    return UPLOAD_DESTINATION_PRESETS.find((preset) =>
        normalizeServerUrl(preset.serverUrl) === normalizedEndpoint,
    ) ?? null;
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
        name: params.preset.name,
        protocol: params.preset.protocol,
        serverUrl,
        ...(params.preset.resolvedUploadUrl ? { resolvedUploadUrl: params.preset.resolvedUploadUrl } : {}),
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
        name: "Custom NIP-96",
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
