import { RelayConfigUtils } from "../relayConfigUtils";
import type { PostHistoryRecord, PostHistoryMediaRecord, EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

export const POST_HISTORY_SCHEMA_VERSION = 1;

type SignedNostrEvent = {
    id: string;
    pubkey: string;
    kind: number;
    content: string;
    tags: string[][];
    created_at: number;
    sig: string;
};

export type PostHistorySaveInput = {
    event: SignedNostrEvent;
    acceptedRelays?: string[];
    relayHints?: string[];
    postedAt?: number;
};

export type PostHistoryRepositoryOptions = {
    pubkeyHex?: string | null;
};

export interface PostHistoryRepository {
    getAll(options: PostHistoryRepositoryOptions): Promise<PostHistoryRecord[]>;
    putPostedEvent(input: PostHistorySaveInput): Promise<void>;
    markDeleted(eventId: string, deletionEventId: string, deletedAt?: number): Promise<void>;
}

function parseImetaTag(tag: string[]): PostHistoryMediaRecord | null {
    const fields = new Map<string, string>();

    for (const token of tag.slice(1)) {
        const separator = token.indexOf(" ");
        if (separator <= 0) continue;
        fields.set(token.slice(0, separator), token.slice(separator + 1));
    }

    const url = fields.get("url");
    if (!url) return null;

    const rawSize = fields.get("size");
    const size = rawSize ? Number(rawSize) : undefined;

    return {
        url,
        mimeType: fields.get("m") || undefined,
        alt: fields.get("alt") || undefined,
        blurhash: fields.get("blurhash") || undefined,
        dim: fields.get("dim") || undefined,
        size: Number.isFinite(size) && size! > 0 ? size : undefined,
        uploadProtocol: normalizeUploadProtocol(fields.get("uploadProtocol")),
    };
}

function normalizeUploadProtocol(value: string | undefined): PostHistoryMediaRecord["uploadProtocol"] {
    return value === "blossom" || value === "nip96" || value === "custom-http"
        ? value
        : undefined;
}

function inferMimeTypeFromUrl(url: string): string | undefined {
    const pathname = (() => {
        try {
            return new URL(url).pathname.toLowerCase();
        } catch {
            return url.toLowerCase();
        }
    })();

    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
    if (pathname.endsWith(".png")) return "image/png";
    if (pathname.endsWith(".webp")) return "image/webp";
    if (pathname.endsWith(".gif")) return "image/gif";
    if (pathname.endsWith(".mp4")) return "video/mp4";
    if (pathname.endsWith(".webm")) return "video/webm";
    if (pathname.endsWith(".mov")) return "video/quicktime";
    return undefined;
}

function extractContentMedia(content: string, existingUrls: Set<string>): PostHistoryMediaRecord[] {
    const matches = content.match(/https?:\/\/[^\s<>"']+/g) ?? [];
    return matches
        .map((url) => url.replace(/[),.。、]+$/u, ""))
        .filter((url) => {
            if (existingUrls.has(url)) return false;
            return /\.(jpe?g|png|webp|gif|mp4|webm|mov)(?:$|[?#])/i.test(url);
        })
        .map((url) => ({
            url,
            mimeType: inferMimeTypeFromUrl(url),
        }));
}

export function extractPostHistoryMedia(event: Pick<SignedNostrEvent, "content" | "tags">): PostHistoryMediaRecord[] {
    const media = event.tags
        .filter((tag) => tag[0] === "imeta")
        .map(parseImetaTag)
        .filter((item): item is PostHistoryMediaRecord => item !== null);
    const seenUrls = new Set(media.map((item) => item.url));
    media.push(...extractContentMedia(event.content, seenUrls));
    return media;
}

function toRecord(input: PostHistorySaveInput, now: () => number): PostHistoryRecord {
    const updatedAt = now();
    const event = input.event;
    const acceptedRelays = RelayConfigUtils.sanitizeExternalRelayUrls(input.acceptedRelays);
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(input.relayHints ?? []),
        ...acceptedRelays,
    ], { limit: 3 });

    return {
        id: event.id,
        eventId: event.id,
        pubkeyHex: event.pubkey,
        kind: event.kind,
        content: event.content,
        tags: event.tags.map((tag) => [...tag]),
        createdAt: event.created_at,
        postedAt: input.postedAt ?? updatedAt,
        relayHints,
        acceptedRelays,
        media: extractPostHistoryMedia(event),
        rawEvent: {
            ...event,
            tags: event.tags.map((tag) => [...tag]),
        },
        updatedAt,
        schemaVersion: POST_HISTORY_SCHEMA_VERSION,
    };
}

export class DexiePostHistoryRepository implements PostHistoryRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async getAll(options: PostHistoryRepositoryOptions): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const records = await this.db.postHistory
            .where("pubkeyHex")
            .equals(options.pubkeyHex)
            .toArray();

        return records.sort((a, b) => b.postedAt - a.postedAt);
    }

    async putPostedEvent(input: PostHistorySaveInput): Promise<void> {
        await this.db.postHistory.put(toRecord(input, this.now));
    }

    async markDeleted(eventId: string, deletionEventId: string, deletedAt: number = this.now()): Promise<void> {
        await this.db.postHistory.update(eventId, {
            deletedAt,
            deletionEventId,
            updatedAt: this.now(),
        });
    }
}

export const postHistoryRepository = new DexiePostHistoryRepository();
