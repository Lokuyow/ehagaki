import type {
    FileUploadResponse,
    UploadAdapterUploadParams,
    UploadConnectionTestResult,
    UploadDestination,
    UploadProtocolAdapter,
} from "../types";

export class CustomHttpUploadAdapter implements UploadProtocolAdapter {
    readonly protocol = "custom-http" as const;

    async upload(params: UploadAdapterUploadParams): Promise<FileUploadResponse> {
        const formData = new FormData();
        formData.append("file", params.file);

        const response = await params.fetch(params.destination.resolvedUploadUrl || params.destination.serverUrl, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            return {
                success: false,
                error: `Custom HTTP upload failed: ${response.status}`,
            };
        }

        const data = await response.json().catch(() => null);
        const url = typeof data?.url === "string" ? data.url : "";
        return url
            ? { success: true, url }
            : { success: false, error: "Could not extract URL from custom HTTP response" };
    }

    async testConnection(params: {
        destination: UploadDestination;
        fetch: typeof fetch;
    }): Promise<UploadConnectionTestResult> {
        const response = await params.fetch(params.destination.serverUrl, { method: "HEAD" });
        return {
            success: response.ok,
            status: response.status,
            message: response.ok ? undefined : `Custom HTTP connection test failed: ${response.status}`,
            capabilities: {
                ...params.destination.capabilities,
                lastCheckedAt: Date.now(),
                source: "test",
            },
        };
    }
}
