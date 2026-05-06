import { UPLOAD_POLLING_CONFIG } from "../constants";
import type {
    FileUploadResponse,
    UploadAdapterUploadParams,
    UploadConnectionTestResult,
    UploadDestination,
    UploadDestinationCapabilities,
    UploadProtocolAdapter,
} from "../types";

function getNip96UploadUrl(destination: UploadDestination): string {
    return destination.resolvedUploadUrl || destination.serverUrl;
}

function parseNip94Tags(data: any): Record<string, string> {
    const parsedNip94: Record<string, string> = {};
    if (!Array.isArray(data?.nip94_event?.tags)) return parsedNip94;

    for (const tag of data.nip94_event.tags) {
        if (!Array.isArray(tag) || tag.length < 2) continue;
        const key = String(tag[0]);
        const value = tag.slice(1).join(" ");
        if (!(key in parsedNip94)) parsedNip94[key] = value;
    }

    return parsedNip94;
}

async function pollUploadStatus(params: {
    processingUrl: string;
    authHeader: string;
    fetch: typeof fetch;
    maxWaitTime?: number;
}): Promise<any> {
    const startTime = Date.now();
    const maxWaitTime = params.maxWaitTime ?? UPLOAD_POLLING_CONFIG.MAX_WAIT_TIME;

    while (true) {
        if (Date.now() - startTime > maxWaitTime) {
            throw new Error(UPLOAD_POLLING_CONFIG.TIMEOUT_MESSAGE);
        }

        const response = await params.fetch(params.processingUrl, {
            method: "GET",
            headers: { Authorization: params.authHeader },
        });
        if (!response.ok) {
            throw new Error(`Unexpected status code ${response.status} while polling processing_url`);
        }

        const processingStatus = await response.json().catch(() => null);
        if (response.status === 201 && processingStatus) return processingStatus;
        if (processingStatus?.status === "processing") {
            await new Promise((resolve) => setTimeout(resolve, UPLOAD_POLLING_CONFIG.RETRY_INTERVAL));
            continue;
        }
        if (processingStatus?.status === "success") return processingStatus;
        if (processingStatus?.status === "error") {
            throw new Error(processingStatus?.message || "File processing failed");
        }
        if (response.status === 200) return processingStatus;

        throw new Error("Unexpected processing status");
    }
}

function buildNip96FormData(
    file: File,
    metadata?: Record<string, string | number | undefined>,
): FormData {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata?.caption) formData.append("caption", String(metadata.caption));
    if (metadata?.expiration !== undefined) formData.append("expiration", String(metadata.expiration));
    formData.append("size", String(file.size));
    if (metadata?.alt) formData.append("alt", String(metadata.alt));
    if (metadata?.media_type) formData.append("media_type", String(metadata.media_type));
    formData.append("content_type", metadata?.content_type ? String(metadata.content_type) : file.type || "");
    formData.append("no_transform", metadata?.no_transform ? String(metadata.no_transform) : "true");
    return formData;
}

function parseNip96Capabilities(config: any, now: number): UploadDestinationCapabilities {
    const maxUploadSize =
        Number(config?.plans?.free?.max_byte_size)
        || Number(config?.api?.max_byte_size)
        || null;
    const supportedMimeTypes = Array.isArray(config?.content_types)
        ? config.content_types.filter((item: unknown): item is string => typeof item === "string")
        : [];

    return {
        maxUploadSize,
        supportedMimeTypes,
        supportsDelete: false,
        supportsList: false,
        supportsMirror: false,
        supportsMediaOptimization: false,
        authRequired: config?.is_nip98_required !== false,
        lastCheckedAt: now,
        source: "protocol-discovery",
        raw: config,
    };
}

export class Nip96UploadAdapter implements UploadProtocolAdapter {
    readonly protocol = "nip96" as const;

    async upload(params: UploadAdapterUploadParams): Promise<FileUploadResponse> {
        const finalUrl = getNip96UploadUrl(params.destination);
        const authHeader = await params.authService.buildAuthHeader(finalUrl, "POST");
        const response = await params.fetch(finalUrl, {
            method: "POST",
            headers: { Authorization: authHeader },
            body: buildNip96FormData(params.file, params.metadata),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            return {
                success: false,
                error: `Upload failed: ${response.status} ${response.statusText} - ${errorText}`,
            };
        }

        let data: any;
        try {
            data = await response.json();
        } catch (error) {
            if (params.devMode) console.error("[dev] JSON parse error:", error);
            return { success: false, error: "Could not parse upload response" };
        }

        if ((response.status === 200 || response.status === 202) && data.processing_url) {
            try {
                const processingAuthToken = await params.authService.buildAuthHeader(data.processing_url, "GET");
                data = await pollUploadStatus({
                    processingUrl: data.processing_url,
                    authHeader: processingAuthToken,
                    fetch: params.fetch,
                });
            } catch (error) {
                return { success: false, error: error instanceof Error ? error.message : String(error) };
            }
        }

        const parsedNip94 = parseNip94Tags(data);
        if (data.status === "success" && Array.isArray(data.nip94_event?.tags)) {
            const urlTag = data.nip94_event.tags.find((tag: string[]) => tag[0] === "url");
            if (urlTag?.[1]) return { success: true, url: urlTag[1], nip94: parsedNip94 };
        }

        return {
            success: false,
            error: data.message || "Could not extract URL from response",
            nip94: Object.keys(parsedNip94).length ? parsedNip94 : undefined,
        };
    }

    async testConnection(params: {
        destination: UploadDestination;
        fetch: typeof fetch;
    }): Promise<UploadConnectionTestResult> {
        const baseUrl = params.destination.serverUrl.replace(/\/api\/.*$/, "");
        const configUrl = new URL("/.well-known/nostr/nip96.json", baseUrl).toString();
        const response = await params.fetch(configUrl, { method: "GET" });
        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                message: `NIP-96 config request failed: ${response.status}`,
            };
        }

        const config = await response.json();
        return {
            success: true,
            status: response.status,
            capabilities: parseNip96Capabilities(config, Date.now()),
        };
    }
}
