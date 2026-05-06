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
    "nostr.build": "nostr-build",
    "share.yabu.me": "share-yabu-me",
    "nostpic.com": "nostpic-com",
    "nostrcheck.me": "nostrcheck-me",
    "files.sovbit.host": "files-sovbit-host",
};

export const UPLOAD_DESTINATION_PRESETS: UploadDestinationPreset[] = [
    ...uploadEndpoints.map((endpoint) => ({
        id: NIP96_PRESET_IDS[endpoint.label] ?? "custom",
        name: endpoint.label,
        protocol: "nip96" as const,
        serverUrl: endpoint.url,
        resolvedUploadUrl: endpoint.url,
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
            supportedMimeTypes: ["image/*", "video/*"],
            source: "preset" as const,
        },
    })),
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
        id: "cdn-nostrcheck-me",
        name: "cdn.nostrcheck.me",
        protocol: "blossom",
        serverUrl: "https://cdn.nostrcheck.me",
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
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
    {
        id: "cdn-satellite-earth",
        name: "cdn.satellite.earth",
        protocol: "blossom",
        serverUrl: "https://cdn.satellite.earth",
        capabilities: {
            ...DEFAULT_UPLOAD_CAPABILITIES,
        },
    },
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
    return UPLOAD_DESTINATION_PRESETS.find((preset) =>
        preset.protocol === "nip96" && preset.resolvedUploadUrl === endpoint,
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
    const endpoint = params.endpoint || getDefaultEndpoint(params.locale);
    const preset = findUploadPresetByEndpoint(endpoint);
    if (preset) {
        return createUploadDestinationFromPreset({
            preset,
            pubkeyHex: params.pubkeyHex,
            isDefault: true,
            now: params.now,
        });
    }

    const timestamp = params.now ?? Date.now();
    return {
        id: createUploadDestinationId(),
        pubkeyHex: params.pubkeyHex ?? null,
        name: "Custom NIP-96",
        protocol: "nip96",
        serverUrl: normalizeServerUrl(endpoint),
        resolvedUploadUrl: endpoint,
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
