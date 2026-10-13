import {
    canonicalizeNip96UploadUrl,
    validateNip96DiscoveryUrl,
} from "./nip96UrlPolicy";
import { throwIfUploadAborted } from "./uploadOperation";
import { mediaRecord, mediaJson, mediaHttpError } from "./mediaManagementUtils";

export async function fetchNip96DiscoveryConfig(params: {
    trustedUploadUrl: ReturnType<typeof canonicalizeNip96UploadUrl>;
    fetch: typeof fetch;
    signal?: AbortSignal;
}): Promise<{ config: Record<string, unknown>; status: number; apiUrl: string }> {
    const visited = new Set<string>();
    let server = params.trustedUploadUrl;
    for (let depth = 0; depth <= 3; depth += 1) {
        throwIfUploadAborted(params.signal);
        const configUrl = new URL("/.well-known/nostr/nip96.json", server.url).toString();
        if (visited.has(configUrl)) throw new Error("NIP-96 discovery delegation loop detected");
        visited.add(configUrl);
        const response = await params.fetch(configUrl, {
            method: "GET", credentials: "omit", referrerPolicy: "no-referrer",
            redirect: "error", signal: params.signal,
        });
        throwIfUploadAborted(params.signal);
        if (!response.ok) throw mediaHttpError(response, false);
        const config = await mediaJson(response);
        throwIfUploadAborted(params.signal);
        if (!mediaRecord(config)) throw new Error("Invalid NIP-96 config response");
        const delegated = typeof config.delegated_to_url === "string" ? config.delegated_to_url.trim() : "";
        if (delegated) {
            if (depth === 3) throw new Error("NIP-96 discovery delegation limit exceeded");
            server = validateNip96DiscoveryUrl({ rawUrl: delegated, trustedUploadUrl: params.trustedUploadUrl });
            continue;
        }
        if (typeof config.api_url !== "string" || !config.api_url.trim()) throw new Error("NIP-96 config is missing api_url");
        const apiUrl = validateNip96DiscoveryUrl({ rawUrl: config.api_url, trustedUploadUrl: params.trustedUploadUrl }).url;
        return { config, status: response.status, apiUrl };
    }
    throw new Error("Invalid NIP-96 discovery response");
}
