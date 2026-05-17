export type PendingPostHistoryLatestRequest = {
    pubkeyHex: string;
    eventId: string;
    requestedAt: number;
};

const pendingLatestRequestByPubkey = new Map<
    string,
    PendingPostHistoryLatestRequest
>();

function normalizePubkeyHex(pubkeyHex: string | null | undefined): string | null {
    if (typeof pubkeyHex !== "string") {
        return null;
    }

    const normalized = pubkeyHex.trim();
    return normalized.length > 0 ? normalized : null;
}

export function markPostHistoryShouldReturnToLatestAfterLocalPost(input: {
    pubkeyHex: string | null | undefined;
    eventId: string | null | undefined;
    requestedAt?: number;
}): void {
    const pubkeyHex = normalizePubkeyHex(input.pubkeyHex);
    if (!pubkeyHex || !input.eventId) {
        return;
    }

    pendingLatestRequestByPubkey.set(pubkeyHex, {
        pubkeyHex,
        eventId: input.eventId,
        requestedAt: input.requestedAt ?? Date.now(),
    });
}

export function consumePostHistoryShouldReturnToLatestAfterLocalPost(
    pubkeyHex: string | null | undefined,
): PendingPostHistoryLatestRequest | null {
    const normalizedPubkeyHex = normalizePubkeyHex(pubkeyHex);
    if (!normalizedPubkeyHex) {
        return null;
    }

    const pendingRequest =
        pendingLatestRequestByPubkey.get(normalizedPubkeyHex) ?? null;
    pendingLatestRequestByPubkey.delete(normalizedPubkeyHex);
    return pendingRequest;
}

export function clearPostHistoryShouldReturnToLatestAfterLocalPost(
    pubkeyHex?: string | null,
): void {
    if (pubkeyHex === undefined) {
        pendingLatestRequestByPubkey.clear();
        return;
    }

    const normalizedPubkeyHex = normalizePubkeyHex(pubkeyHex);
    if (!normalizedPubkeyHex) {
        return;
    }

    pendingLatestRequestByPubkey.delete(normalizedPubkeyHex);
}
