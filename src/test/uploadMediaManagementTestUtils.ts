import type { UploadDestination, AuthService } from "../lib/types/upload";
import { DEFAULT_UPLOAD_CAPABILITIES } from "../lib/upload/uploadDestinationPresets";
import type { UploadedMediaItem, UploadMediaContext, UploadMediaPage } from "../lib/upload/mediaManagementTypes";
import { vi } from "vitest";

export const mediaPubkey = "a".repeat(64);
export const mediaHash = "b".repeat(64);
export function mediaDestination(protocol: UploadDestination["protocol"] = "blossom", id: string = protocol): UploadDestination {
    return { id, protocol, name: id, serverUrl: "https://media.example", presetId: "custom",
        pubkeyHex: mediaPubkey, enabled: false, isDefault: true, createdAt: 1, updatedAt: 1,
        capabilities: { ...DEFAULT_UPLOAD_CAPABILITIES }, auth: { type: protocol === "blossom" ? "blossom-bud11" : "nip98" }, schemaVersion: 1 };
}
export function mediaContext(destination = mediaDestination()): UploadMediaContext {
    return { destinationId: destination.id, protocol: destination.protocol as "blossom" | "nip96",
        serverUrl: destination.serverUrl, endpoint: destination.protocol === "blossom" ? destination.serverUrl + "/" : destination.serverUrl + "/api?existing=1" };
}
export function mediaItem(destination = mediaDestination(), kind: "image" | "video" = "image", hash = mediaHash): UploadedMediaItem {
    return { id: destination.id + ":" + hash, destinationId: destination.id,
        protocol: destination.protocol as "blossom" | "nip96", serverUrl: destination.serverUrl, kind,
        url: destination.serverUrl + "/" + hash + (kind === "image" ? ".png" : ".mp4"),
        deleteId: { protocol: destination.protocol as "blossom" | "nip96", sha256: hash } };
}
export function mediaPage(destination = mediaDestination(), items = [mediaItem(destination)]): UploadMediaPage {
    return { items, context: mediaContext(destination), rawCount: items.length, excludedCount: 0, invalidCount: 0,
        nextPage: destination.protocol === "blossom" ? { protocol: "blossom", cursor: mediaHash, limit: 24 } : null };
}
export function mediaAuth(): AuthService {
    return { buildAuthHeader: vi.fn(async () => "Nostr synthetic"),
        createBlossomManagementAuthorization: vi.fn(async () => ({ authorization: "Nostr synthetic", assertSession: vi.fn() })) };
}
export function jsonMedia(data: unknown, status = 200, headers = {}): Response {
    return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...headers } });
}
