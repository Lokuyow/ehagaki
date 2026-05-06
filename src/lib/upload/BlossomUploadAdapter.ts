import { BlossomClient, type BlobDescriptor } from "nostr-tools/nipb7";
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

function descriptorToNip94(data: any, file: File, sha256: string = ""): Record<string, string> {
    return {
        url: String(data?.url ?? ""),
        x: String(data?.sha256 ?? data?.x ?? sha256),
        size: String(data?.size ?? file.size),
        m: String(data?.type ?? data?.content_type ?? file.type ?? ""),
    };
}

function parseBlobDescriptor(data: BlobDescriptor | any, file: File, sha256?: string): FileUploadResponse {
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

function parseBlossomUploadError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    const match = message.match(/^upload returned an error \((\d+)\):\s*(.*)$/);
    if (match) {
        return `Blossom upload failed: ${match[1]} ${match[2]}`;
    }
    return message ? `Blossom upload failed: ${message}` : "Blossom upload failed";
}

function normalizeUploadBlob(file: File): File | Blob {
    if (typeof file.arrayBuffer === "function") {
        return file;
    }

    const blob = new Blob([file], {
        type: file.type || "application/octet-stream",
    }) as Blob & {
        arrayBuffer?: () => Promise<ArrayBuffer>;
    };

    if (typeof blob.arrayBuffer !== "function") {
        blob.arrayBuffer = async () => await new Response(blob).arrayBuffer();
    }

    return blob;
}

function createBlossomClient(
    destination: UploadDestination,
    signer: NonNullable<UploadAdapterUploadParams["authService"]["getBlossomSigner"]> extends () => Promise<infer T>
        ? T
        : never,
    fetchImpl: typeof fetch,
): BlossomClient {
    type BlossomClientHttpCall = {
        httpCall: (
            method: string,
            url: string,
            contentType?: string,
            addAuthorization?: () => Promise<string>,
            body?: File | Blob,
            result?: unknown,
        ) => Promise<unknown>;
    };

    const baseUrl = `${normalizeBlossomServerUrl(destination)}/`;
    const client = new BlossomClient(baseUrl, signer);

    (client as unknown as BlossomClientHttpCall).httpCall = async (
        method: string,
        url: string,
        contentType?: string,
        addAuthorization?: () => Promise<string>,
        body?: File | Blob,
        result?: unknown,
    ) => {
        const headers: Record<string, string> = {};
        if (contentType) {
            headers["Content-Type"] = contentType;
        }
        if (addAuthorization) {
            const auth = await addAuthorization();
            if (auth) {
                headers.Authorization = auth;
            }
        }

        const response = await fetchImpl(`${baseUrl}${url}`, {
            method,
            headers,
            body,
        });

        if (response.status >= 300) {
            const reason = response.headers.get("X-Reason") || response.statusText;
            throw new Error(`${url} returned an error (${response.status}): ${reason}`);
        }

        if (result !== null && response.headers.get("content-type")?.includes("application/json")) {
            return await response.json();
        }

        return response;
    };

    return client;
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
        const signer = await params.authService.getBlossomSigner?.();
        if (!signer) {
            return { success: false, error: "Blossom signer is not available" };
        }

        try {
            const client = createBlossomClient(
                params.destination,
                signer,
                params.fetch,
            );
            const descriptor = await client.uploadBlob(
                normalizeUploadBlob(params.file),
                params.file.type,
            );

            return parseBlobDescriptor(descriptor, params.file);
        } catch (error) {
            return {
                success: false,
                error: parseBlossomUploadError(error),
            };
        }
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
