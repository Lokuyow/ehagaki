import type { EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

const POST_HISTORY_JUMP_CACHE_ANCHORS_KEY_PREFIX = "postHistoryJumpCacheAnchors:";

export const POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_MAX_COUNT = 200;
export const POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface PostHistoryJumpCacheAnchor {
    centerCreatedAt: number;
    radiusSec: number;
    fetchedAt: number;
}

export interface PostHistoryJumpCacheAnchorRepository {
    getForPubkey(
        pubkeyHex: string,
        options?: {
            ttlMs?: number;
            maxCount?: number;
        },
    ): Promise<PostHistoryJumpCacheAnchor[]>;
    addForPubkey(input: {
        pubkeyHex: string;
        centerCreatedAt: number;
        radiusSec: number;
        fetchedAt?: number;
        ttlMs?: number;
        maxCount?: number;
    }): Promise<PostHistoryJumpCacheAnchor[]>;
    hasNearbyAnchorForPubkey(input: {
        pubkeyHex: string;
        targetCreatedAt: number;
        ttlMs?: number;
        maxCount?: number;
    }): Promise<boolean>;
    reconcileWithFrontier(input: {
        pubkeyHex: string;
        frontierVisibleUntil: number;
        toleranceSec: number;
        ttlMs?: number;
        maxCount?: number;
    }): Promise<{
        nextVisibleUntil: number;
        removedCount: number;
        anchors: PostHistoryJumpCacheAnchor[];
    }>;
    clearForPubkey(pubkeyHex: string | null | undefined): Promise<void>;
}

type PostHistoryJumpCacheAnchorsValue = {
    pubkeyHex: string;
    anchors: PostHistoryJumpCacheAnchor[];
};

function buildJumpCacheAnchorsKey(pubkeyHex: string): string {
    return `${POST_HISTORY_JUMP_CACHE_ANCHORS_KEY_PREFIX}${pubkeyHex}`;
}

function isValidAnchor(value: unknown): value is PostHistoryJumpCacheAnchor {
    if (!value || typeof value !== "object") {
        return false;
    }

    const anchor = value as Partial<PostHistoryJumpCacheAnchor>;
    return Number.isFinite(anchor.centerCreatedAt)
        && Number.isFinite(anchor.radiusSec)
        && (anchor.radiusSec ?? 0) > 0
        && Number.isFinite(anchor.fetchedAt);
}

function isValidAnchorsValue(value: unknown): value is PostHistoryJumpCacheAnchorsValue {
    if (!value || typeof value !== "object") {
        return false;
    }

    const payload = value as Partial<PostHistoryJumpCacheAnchorsValue>;
    return typeof payload.pubkeyHex === "string"
        && Array.isArray(payload.anchors)
        && payload.anchors.every((anchor) => isValidAnchor(anchor));
}

function sanitizeAnchors(
    anchors: PostHistoryJumpCacheAnchor[],
    nowMs: number,
    ttlMs: number,
    maxCount: number,
): PostHistoryJumpCacheAnchor[] {
    const minFetchedAt = nowMs - Math.max(0, Math.trunc(ttlMs));

    return anchors
        .filter((anchor) =>
            Number.isFinite(anchor.centerCreatedAt)
            && Number.isFinite(anchor.radiusSec)
            && anchor.radiusSec > 0
            && Number.isFinite(anchor.fetchedAt)
            && anchor.fetchedAt >= minFetchedAt,
        )
        .sort((left, right) => right.fetchedAt - left.fetchedAt)
        .slice(0, Math.max(1, Math.trunc(maxCount)));
}

function resolveNearAnchorIndex(
    anchors: PostHistoryJumpCacheAnchor[],
    centerCreatedAt: number,
    radiusSec: number,
): number {
    return anchors.findIndex((anchor) =>
        Math.abs(anchor.centerCreatedAt - centerCreatedAt)
        <= Math.max(anchor.radiusSec, radiusSec),
    );
}

export class DexiePostHistoryJumpCacheAnchorRepository implements PostHistoryJumpCacheAnchorRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async getForPubkey(
        pubkeyHex: string,
        options: {
            ttlMs?: number;
            maxCount?: number;
        } = {},
    ): Promise<PostHistoryJumpCacheAnchor[]> {
        const ttlMs = options.ttlMs ?? POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_TTL_MS;
        const maxCount = options.maxCount ?? POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_MAX_COUNT;
        const record = await this.db.meta.get(buildJumpCacheAnchorsKey(pubkeyHex));
        if (!record || !isValidAnchorsValue(record.value)) {
            return [];
        }

        return sanitizeAnchors(record.value.anchors, this.now(), ttlMs, maxCount);
    }

    async addForPubkey(input: {
        pubkeyHex: string;
        centerCreatedAt: number;
        radiusSec: number;
        fetchedAt?: number;
        ttlMs?: number;
        maxCount?: number;
    }): Promise<PostHistoryJumpCacheAnchor[]> {
        const ttlMs = input.ttlMs ?? POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_TTL_MS;
        const maxCount = input.maxCount ?? POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_MAX_COUNT;
        const fetchedAt = Number.isFinite(input.fetchedAt)
            ? Math.trunc(input.fetchedAt ?? 0)
            : this.now();
        const centerCreatedAt = Number.isFinite(input.centerCreatedAt)
            ? Math.trunc(input.centerCreatedAt)
            : 0;
        const radiusSec = Number.isFinite(input.radiusSec)
            ? Math.max(1, Math.trunc(input.radiusSec ?? 1))
            : 1;

        const currentAnchors = await this.getForPubkey(input.pubkeyHex, {
            ttlMs,
            maxCount,
        });
        const nearAnchorIndex = resolveNearAnchorIndex(
            currentAnchors,
            centerCreatedAt,
            radiusSec,
        );
        const nextAnchors = [...currentAnchors];

        if (nearAnchorIndex >= 0) {
            const previous = nextAnchors[nearAnchorIndex] as PostHistoryJumpCacheAnchor;
            nextAnchors[nearAnchorIndex] = {
                centerCreatedAt,
                radiusSec: Math.max(previous.radiusSec, radiusSec),
                fetchedAt: Math.max(previous.fetchedAt, fetchedAt),
            };
        } else {
            nextAnchors.unshift({
                centerCreatedAt,
                radiusSec,
                fetchedAt,
            });
        }

        const sanitizedAnchors = sanitizeAnchors(
            nextAnchors,
            this.now(),
            ttlMs,
            maxCount,
        );
        await this.db.meta.put({
            key: buildJumpCacheAnchorsKey(input.pubkeyHex),
            value: {
                pubkeyHex: input.pubkeyHex,
                anchors: sanitizedAnchors,
            },
            updatedAt: this.now(),
        });

        return sanitizedAnchors;
    }

    async hasNearbyAnchorForPubkey(input: {
        pubkeyHex: string;
        targetCreatedAt: number;
        ttlMs?: number;
        maxCount?: number;
    }): Promise<boolean> {
        const targetCreatedAt = Number.isFinite(input.targetCreatedAt)
            ? Math.trunc(input.targetCreatedAt)
            : 0;
        const anchors = await this.getForPubkey(input.pubkeyHex, {
            ttlMs: input.ttlMs,
            maxCount: input.maxCount,
        });

        return anchors.some((anchor) =>
            Math.abs(targetCreatedAt - anchor.centerCreatedAt) <= anchor.radiusSec,
        );
    }

    async reconcileWithFrontier(input: {
        pubkeyHex: string;
        frontierVisibleUntil: number;
        toleranceSec: number;
        ttlMs?: number;
        maxCount?: number;
    }): Promise<{
        nextVisibleUntil: number;
        removedCount: number;
        anchors: PostHistoryJumpCacheAnchor[];
    }> {
        const frontierVisibleUntil = Number.isFinite(input.frontierVisibleUntil)
            ? Math.trunc(input.frontierVisibleUntil)
            : 0;
        const toleranceSec = Number.isFinite(input.toleranceSec)
            ? Math.max(0, Math.trunc(input.toleranceSec ?? 0))
            : 0;
        const ttlMs = input.ttlMs ?? POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_TTL_MS;
        const maxCount = input.maxCount ?? POST_HISTORY_JUMP_CACHE_ANCHORS_DEFAULT_MAX_COUNT;
        const anchors = await this.getForPubkey(input.pubkeyHex, {
            ttlMs,
            maxCount,
        });

        const connectedAnchors = anchors.filter((anchor) => {
            const anchorRangeEnd = anchor.centerCreatedAt + anchor.radiusSec;
            const gapSec = Math.max(0, frontierVisibleUntil - anchorRangeEnd);
            return gapSec <= toleranceSec;
        });
        const remainingAnchors = anchors.filter((anchor) => !connectedAnchors.includes(anchor));
        const nextVisibleUntil = connectedAnchors.length > 0
            ? Math.min(
                frontierVisibleUntil,
                ...connectedAnchors.map((anchor) => Math.max(0, anchor.centerCreatedAt - anchor.radiusSec)),
            )
            : frontierVisibleUntil;

        if (connectedAnchors.length > 0) {
            await this.db.meta.put({
                key: buildJumpCacheAnchorsKey(input.pubkeyHex),
                value: {
                    pubkeyHex: input.pubkeyHex,
                    anchors: remainingAnchors,
                },
                updatedAt: this.now(),
            });
        }

        return {
            nextVisibleUntil,
            removedCount: connectedAnchors.length,
            anchors: remainingAnchors,
        };
    }

    async clearForPubkey(pubkeyHex: string | null | undefined): Promise<void> {
        if (!pubkeyHex) {
            return;
        }

        await this.db.meta.delete(buildJumpCacheAnchorsKey(pubkeyHex));
    }
}

export const postHistoryJumpCacheAnchorRepository =
    new DexiePostHistoryJumpCacheAnchorRepository();
