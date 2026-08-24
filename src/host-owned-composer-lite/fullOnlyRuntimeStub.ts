/**
 * These names satisfy the shared Composer source's full-only branch while the
 * Lite build replaces its imports at resolution time. The branch is compiled
 * out by __EHAGAKI_COMPOSER_LITE__; none of these values is callable in Lite.
 */
export class PostManager {
    constructor() {
        throw new Error("PostManager is unavailable in Host-owned Composer Lite.");
    }
}

export const nip46Service = {
    getSignerForSession: () => undefined,
};

export const parentClientAuthService = {
    getSigner: () => undefined,
};

export const postHistoryRepository = {};

export class ReplyQuoteService {
    constructor() {
        throw new Error("Relay-backed reply hydration is unavailable in Host-owned Composer Lite.");
    }
}

export function savePostedEventWithMediaCacheLink(): never {
    throw new Error("Post history is unavailable in Host-owned Composer Lite.");
}
