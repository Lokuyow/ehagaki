import { calculateSHA256Hex } from "../utils/fileUtils";
import type {
    FileUploadResponse,
    UploadAdapterUploadParams,
    UploadConnectionTestResult,
    UploadDestination,
    UploadDestinationCapabilities,
    UploadProtocolAdapter,
} from "../types";

function normalizeBlossomServerUrl(destination: UploadDestination): string {
    return destination.serverUrl.replace(/\/$/, "");
}

function getUploadUrl(destination: UploadDestination): string {
    return `${normalizeBlossomServerUrl(destination)}/upload`;
}

function descriptorToNip94(data: any, file: File, sha256: string): Record<string, string> {
    return {
        url: String(data?.url ?? ""),
        x: String(data?.sha256 ?? data?.x ?? sha256),
        size: String(data?.size ?? file.size),
        m: String(data?.type ?? data?.content_type ?? file.type ?? ""),
    };
}

function parseBlobDescriptor(data: any, file: File, sha256: string): FileUploadResponse {
    const url = typeof data?.url === "string" ? data.url : "";
    if (!url) {
        return {
            success: false,
            error: "Could not extract URL from Blossom response",
        };
    }

    return {
        success: true,
        url,
        nip94: descriptorToNip94(data, file, sha256),
    };
}

function buildBlossomCapabilities(
    response: Response,
    destination: UploadDestination,
): UploadDestinationCapabilities {
    const maxUploadSize = Number(response.headers.get("X-Max-Upload-Size"))
        || Number(response.headers.get("Max-Upload-Size"))
        || destination.capabilities.maxUploadSize
        || null;
    const mimeHeader =
        response.headers.get("X-Supported-Mime-Types")
        || response.headers.get("Accept");
    const supportedMimeTypes = mimeHeader
        ? mimeHeader.split(",").map((item) => item.trim()).filter(Boolean)
        : destination.capabilities.supportedMimeTypes;

    return {
        ...destination.capabilities,
        maxUploadSize,
        supportedMimeTypes,
        supportsDelete: true,
        supportsList: true,
        authRequired: true,
        lastCheckedAt: Date.now(),
        source: "test",
    };
}

export class BlossomUploadAdapter implements UploadProtocolAdapter {
    readonly protocol = "blossom" as const;

    async upload(params: UploadAdapterUploadParams): Promise<FileUploadResponse> {
        const uploadUrl = getUploadUrl(params.destination);
        const sha256 = await calculateSHA256Hex(params.file);
        const authorization = await params.authService.buildBlossomAuthorizationHeader?.({
            serverUrl: normalizeBlossomServerUrl(params.destination),
            method: "upload",
            sha256,
            contentType: params.file.type,
            contentLength: params.file.size,
        });

        if (!authorization) {
            return { success: false, error: "Blossom authorization is not available" };
        }

        const response = await params.fetch(uploadUrl, {
            method: "PUT",
            headers: {
                Authorization: authorization,
                "Content-Type": params.file.type || "application/octet-stream",
                "X-SHA-256": sha256,
            },
            body: params.file,
        });

        if (!response.ok) {
            const reason = response.headers.get("X-Reason")
                || await response.text().catch(() => "Unknown error");
            return {
                success: false,
                error: `Blossom upload failed: ${response.status} ${reason}`,
            };
        }

        const data = await response.json().catch(() => null);
        return parseBlobDescriptor(data, params.file, sha256);
    }

    async testConnection(params: {
        destination: UploadDestination;
        fetch: typeof fetch;
        authService?: UploadAdapterUploadParams["authService"];
        sampleFile?: File;
    }): Promise<UploadConnectionTestResult> {
        const sampleFile = params.sampleFile
            ?? new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "ehagaki-upload-test.png", {
                type: "image/png",
            });
        const sha256 = await calculateSHA256Hex(sampleFile);
        const headers: Record<string, string> = {
            "X-SHA-256": sha256,
            "X-Content-Type": sampleFile.type || "text/plain",
            "X-Content-Length": String(sampleFile.size),
        };

        const authorization = await params.authService?.buildBlossomAuthorizationHeader?.({
            serverUrl: normalizeBlossomServerUrl(params.destination),
            method: "upload",
            sha256,
            contentType: sampleFile.type,
            contentLength: sampleFile.size,
        });
        if (authorization) headers.Authorization = authorization;

        const response = await params.fetch(getUploadUrl(params.destination), {
            method: "HEAD",
            headers,
        });

        if (response.ok || response.status === 401 || response.status === 403) {
            return {
                success: response.ok,
                status: response.status,
                message: response.ok ? undefined : "Authentication is required or was rejected",
                capabilities: buildBlossomCapabilities(response, params.destination),
            };
        }

        return {
            success: false,
            status: response.status,
            message: response.headers.get("X-Reason") ?? `Blossom connection test failed: ${response.status}`,
            capabilities: buildBlossomCapabilities(response, params.destination),
        };
    }
}
