import type { UploadDestination } from "../types";
import { canonicalizeNip96UploadUrl } from "./nip96UrlPolicy";
import { findUploadDestinationPresetIdentity } from "./uploadDestinationPresets";

/** Relay input must never grant a private endpoint the privileges of a local setting. */
export function normalizeNip96ServerUrl(value: string): string {
    const url = canonicalizeNip96UploadUrl(value);
    if (url.protocol !== "https:" || url.networkScope !== "public") {
        throw new Error("invalid_server_url");
    }
    const parsed = new URL(url.url);
    if (parsed.pathname !== "/" || parsed.search || parsed.hash) throw new Error("invalid_server_url");
    return url.origin;
}

export function getNip96DiscoveryServer(destination: UploadDestination): string {
    const server = destination.nip96ServerUrl
        ?? findUploadDestinationPresetIdentity(destination)?.nip96ServerUrl
        ?? destination.serverUrl;
    return destination.nip96UrlMode === "discovery" ? normalizeNip96ServerUrl(server) : server;
}
