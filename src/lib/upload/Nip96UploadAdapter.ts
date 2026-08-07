import { UPLOAD_POLLING_CONFIG } from "../constants";
import {
    UploadedMediaAvailabilityError,
    waitForUploadedMediaAvailability,
} from "./uploadedMediaAvailability";
import {
    Nip96UrlPolicyError,
    canonicalizeNip96UploadUrl,
    validateNip96DiscoveryUrl,
    validateNip96MediaUrl,
    validateNip96ProcessingUrl,
} from "./nip96UrlPolicy";
import type {
    FileUploadResponse,
    UploadAdapterUploadParams,
    UploadConnectionTestResult,
    UploadDestination,
    UploadDestinationCapabilities,
    UploadProtocolAdapter,
} from "../types";

function toNip96UploadError(
    error: unknown,
    context: "destination" | "processing" | "media",
): Pick<FileUploadResponse, "error" | "errorCode"> {
    if (error instanceof Nip96UrlPolicyError) {
        const errorCode = context === "destination"
            ? "nip96InvalidDestinationUrl"
            : context === "processing"
                ? "nip96InvalidProcessingUrl"
                : error.code === "insecure-media-url"
                    ? "nip96InsecureMediaUrl"
                    : "nip96InvalidMediaUrl";
        return { error: error.message, errorCode };
    }

    if (error instanceof UploadedMediaAvailabilityError) {
        return {
            error: error.message,
            errorCode: error.reason === "inconclusive"
                ? "nip96MediaAvailabilityUnverified"
                : "nip96MediaAvailabilityTimeout",
        };
    }

    return { error: error instanceof Error ? error.message : String(error) };
}

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
    authHeader?: string;
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
            ...(params.authHeader ? { headers: { Authorization: params.authHeader } } : {}),
            credentials: "omit",
            referrerPolicy: "no-referrer",
            redirect: "error",
        });
        if (response.status === 404) {
            await new Promise((resolve) => setTimeout(resolve, UPLOAD_POLLING_CONFIG.RETRY_INTERVAL));
            continue;
        }
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
        authRequired: config?.plans?.free?.is_nip98_required !== false,
        lastCheckedAt: now,
        source: "protocol-discovery",
        raw: config,
    };
}

export class Nip96UploadAdapter implements UploadProtocolAdapter {
    readonly protocol = "nip96" as const;

    async upload(params: UploadAdapterUploadParams): Promise<FileUploadResponse> {
        let uploadUrl;
        try {
            uploadUrl = canonicalizeNip96UploadUrl(getNip96UploadUrl(params.destination));
        } catch (error) {
            return {
                success: false,
                ...toNip96UploadError(error, "destination"),
            };
        }

        const finalUrl = uploadUrl.url;
        const authHeader = await params.authService.buildAuthHeader(finalUrl, "POST");
        let response: Response;
        try {
            response = await params.fetch(finalUrl, {
                method: "POST",
                headers: { Authorization: authHeader },
                body: buildNip96FormData(params.file, params.metadata),
                redirect: "error",
            });
        } catch {
            return {
                success: false,
                errorCode: "nip96UploadRequestBlocked",
                error: "The upload request could not be completed safely",
            };
        }

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
                const processingUrl = validateNip96ProcessingUrl({
                    rawUrl: data.processing_url,
                    trustedUploadUrl: uploadUrl,
                });
                const processingAuthToken = processingUrl.sameOrigin
                    ? await params.authService.buildAuthHeader(processingUrl.url, "GET")
                    : undefined;
                data = await pollUploadStatus({
                    processingUrl: processingUrl.url,
                    authHeader: processingAuthToken,
                    fetch: params.fetch,
                });
            } catch (error) {
                return { success: false, ...toNip96UploadError(error, "processing") };
            }
        }

        const parsedNip94 = parseNip94Tags(data);
        if (data.status === "success" && Array.isArray(data.nip94_event?.tags)) {
            const urlTag = data.nip94_event.tags.find((tag: string[]) => tag[0] === "url");
            if (urlTag?.[1]) {
                try {
                    const mediaUrl = validateNip96MediaUrl({
                        rawUrl: urlTag[1],
                        trustedUploadUrl: uploadUrl,
                    });
                    parsedNip94.url = mediaUrl.url;
                    await waitForUploadedMediaAvailability({
                        url: mediaUrl.url,
                        mimeType: params.file.type,
                        fetch: params.fetch,
                    });
                } catch (error) {
                    return {
                        success: false,
                        ...toNip96UploadError(error, "media"),
                        nip94: Object.keys(parsedNip94).length ? parsedNip94 : undefined,
                    };
                }

                return { success: true, url: parsedNip94.url, nip94: parsedNip94 };
            }
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
        try {
            const uploadUrl = canonicalizeNip96UploadUrl(params.destination.serverUrl);
            const { config, status } = await fetchNip96DiscoveryConfig({
                trustedUploadUrl: uploadUrl,
                fetch: params.fetch,
            });
            return {
                success: true,
                status,
                capabilities: parseNip96Capabilities(config, Date.now()),
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : String(error),
            };
        }
    }
}

async function fetchNip96DiscoveryConfig(params: {
    trustedUploadUrl: ReturnType<typeof canonicalizeNip96UploadUrl>;
    fetch: typeof fetch;
}): Promise<{ config: any; status: number }> {
    const visitedConfigUrls = new Set<string>();
    let discoveryServerUrl = params.trustedUploadUrl;

    for (let depth = 0; depth <= 3; depth += 1) {
        const configUrl = new URL("/.well-known/nostr/nip96.json", discoveryServerUrl.url).toString();
        if (visitedConfigUrls.has(configUrl)) {
            throw new Error("NIP-96 discovery delegation loop detected");
        }
        visitedConfigUrls.add(configUrl);

        const response = await params.fetch(configUrl, {
            method: "GET",
            credentials: "omit",
            referrerPolicy: "no-referrer",
            redirect: "error",
        });
        if (!response.ok) {
            throw new Error(`NIP-96 config request failed: ${response.status}`);
        }

        let config: any;
        try {
            config = await response.json();
        } catch {
            throw new Error("Could not parse NIP-96 config response");
        }

        if (!config || typeof config !== "object") {
            throw new Error("Invalid NIP-96 config response");
        }

        const delegatedToUrl = typeof config.delegated_to_url === "string"
            ? config.delegated_to_url.trim()
            : "";
        if (delegatedToUrl) {
            if (depth === 3) {
                throw new Error("NIP-96 discovery delegation limit exceeded");
            }
            discoveryServerUrl = validateNip96DiscoveryUrl({
                rawUrl: delegatedToUrl,
                trustedUploadUrl: params.trustedUploadUrl,
            });
            continue;
        }

        if (typeof config.api_url !== "string" || !config.api_url.trim()) {
            throw new Error("NIP-96 config is missing api_url");
        }
        validateNip96DiscoveryUrl({
            rawUrl: config.api_url,
            trustedUploadUrl: params.trustedUploadUrl,
        });
        return { config, status: response.status };
    }

    throw new Nip96UrlPolicyError("invalid-processing-url", "Invalid NIP-96 discovery response");
}
