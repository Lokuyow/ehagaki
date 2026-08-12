import { BlossomClient, type BlobDescriptor } from "nostr-tools/nipb7";
import { calculateSHA256Hex } from "../utils/fileUtils";
import { waitForUploadedMediaAvailability } from "./uploadedMediaAvailability";
import { canonicalizeBlossomAuthorizationHeader } from "./blossomAuthorization";
import {
    blossomDescriptorToNip94,
    validateBlossomDescriptor,
    type VerifiedBlossomDescriptor,
} from "./blossomDescriptor";
import {
    prepareSignedEventTemplate,
    validateSignedEventResult,
} from "../signedEventResultValidator";
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

const BLOSSOM_MIME_PROBE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
];

function toUploadResponse(descriptor: VerifiedBlossomDescriptor): FileUploadResponse {
    return {
        success: true,
        url: descriptor.url,
        nip94: blossomDescriptorToNip94(descriptor),
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

export function createBlossomClient(
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
            if (!auth) throw new Error("Blossom authorization failed");
            headers.Authorization = canonicalizeBlossomAuthorizationHeader(auth);
        }

        const response = await fetchImpl(`${baseUrl}${url}`, {
            method,
            headers,
            body,
            ...(method.toUpperCase() === "PUT"
                ? {
                    redirect: "error" as const,
                    credentials: "omit" as const,
                    referrerPolicy: "no-referrer" as const,
                }
                : {}),
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

function isUploadRequirementAccepted(status: number): boolean {
    return status >= 200 && status < 300;
}

type BlossomConnectionTestAuthorization = {
    authorization: string;
    assertSession: () => void;
};

async function probeBlossomUploadRequirement(params: {
    destination: UploadDestination;
    fetch: typeof fetch;
    sha256: string;
    contentType: string;
    contentLength: number;
    authorizationContext?: BlossomConnectionTestAuthorization;
}): Promise<Response | null> {
    const headers: Record<string, string> = {
        "X-SHA-256": params.sha256,
        "X-Content-Type": params.contentType,
        "X-Content-Length": String(params.contentLength),
    };

    const authorization = params.authorizationContext?.authorization;
    if (authorization) headers.Authorization = authorization;

    params.authorizationContext?.assertSession();
    try {
        return await params.fetch(getUploadUrl(params.destination), {
            method: "HEAD",
            headers,
        });
    } catch {
        return null;
    }
}

async function probeSupportedMimeTypes(params: {
    destination: UploadDestination;
    fetch: typeof fetch;
    sha256: string;
    contentLength: number;
    authorizationContext?: BlossomConnectionTestAuthorization;
}): Promise<string[]> {
    const supportedMimeTypes: string[] = [];

    for (const contentType of BLOSSOM_MIME_PROBE_TYPES) {
        const response = await probeBlossomUploadRequirement({
            ...params,
            contentType,
        });

        if (!response) break;
        if (isUploadRequirementAccepted(response.status)) {
            supportedMimeTypes.push(contentType);
        }
    }

    return supportedMimeTypes;
}

function buildBlossomCapabilities(
    response: Response,
    destination: UploadDestination,
    inferredCapabilities?: Partial<Pick<UploadDestinationCapabilities, "maxUploadSize" | "supportedMimeTypes">>,
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
        : inferredCapabilities?.supportedMimeTypes?.length
            ? inferredCapabilities.supportedMimeTypes
            : destination.capabilities.supportedMimeTypes;

    return {
        ...destination.capabilities,
        maxUploadSize: inferredCapabilities?.maxUploadSize ?? maxUploadSize,
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

        let verifiedDescriptor: VerifiedBlossomDescriptor;
        try {
            const expectedPubkey = await signer.getPublicKey();
            const validatedSigner = {
                getPublicKey: async () => {
                    const pubkey = await signer.getPublicKey();
                    if (pubkey !== expectedPubkey) {
                        throw new Error("Authentication required");
                    }
                    return pubkey;
                },
                signEvent: async (template: any) => {
                    const prepared = prepareSignedEventTemplate(template);
                    return validateSignedEventResult(
                        prepared.expectedTemplate,
                        await signer.signEvent(prepared.signerTemplate),
                        expectedPubkey,
                    ) as any;
                },
            };
            const client = createBlossomClient(
                params.destination,
                validatedSigner,
                params.fetch,
            );
            const uploadBody = normalizeUploadBlob(params.file);
            const expectedSha256 = await calculateSHA256Hex(uploadBody);
            const expectedSize = uploadBody.size;
            const descriptor = await client.uploadBlob(
                uploadBody,
                params.file.type,
            );

            verifiedDescriptor = validateBlossomDescriptor({
                descriptor: descriptor as BlobDescriptor,
                expectedSha256,
                expectedSize,
                trustedServerUrl: params.destination.serverUrl,
            });
        } catch (error) {
            return {
                success: false,
                error: parseBlossomUploadError(error),
            };
        }

        const uploadResult = toUploadResponse(verifiedDescriptor);

        try {
            await waitForUploadedMediaAvailability({
                url: verifiedDescriptor.url,
                mimeType: verifiedDescriptor.type,
                fetch: params.fetch,
            });
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                nip94: uploadResult.nip94,
            };
        }

        return uploadResult;
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
        const createAuthorizationContext = params.authService
            ?.createBlossomConnectionTestAuthorization;
        if (
            params.authService?.buildBlossomAuthorizationHeader
            && !createAuthorizationContext
        ) {
            throw new Error("Authentication required");
        }
        const authorizationContext = await params.authService
            ?.createBlossomConnectionTestAuthorization?.({
                serverUrl: normalizeBlossomServerUrl(params.destination),
                method: "upload",
                sha256,
                contentType: sampleFile.type || "image/png",
                contentLength: sampleFile.size,
            });
        const response = await probeBlossomUploadRequirement({
            destination: params.destination,
            fetch: params.fetch,
            sha256,
            contentType: sampleFile.type || "image/png",
            contentLength: sampleFile.size,
            authorizationContext,
        });

        if (!response) {
            return {
                success: false,
                message: "Blossom connection test failed",
                capabilities: buildBlossomCapabilities(new Response(null, { status: 599 }), params.destination),
            };
        }

        const canInferCapabilities = isUploadRequirementAccepted(response.status);
        const inferredCapabilities = canInferCapabilities
            ? {
                supportedMimeTypes: await probeSupportedMimeTypes({
                    destination: params.destination,
                    fetch: params.fetch,
                    sha256,
                    contentLength: sampleFile.size,
                    authorizationContext,
                }),
            }
            : undefined;

        if (response.ok || response.status === 401 || response.status === 403) {
            return {
                success: response.ok,
                status: response.status,
                message: response.ok ? undefined : "Authentication is required or was rejected",
                capabilities: buildBlossomCapabilities(response, params.destination, inferredCapabilities),
            };
        }

        return {
            success: false,
            status: response.status,
            message: response.headers.get("X-Reason") ?? `Blossom connection test failed: ${response.status}`,
            capabilities: buildBlossomCapabilities(response, params.destination, inferredCapabilities),
        };
    }
}
