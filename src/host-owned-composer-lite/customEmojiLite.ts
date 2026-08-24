export type CustomEmojiSourceType = "kind10030" | "kind30030";
export interface CustomEmojiItem {
    identityKey: string;
    shortcode: string;
    shortcodeLower: string;
    src: string;
    setAddress: string | null;
    sortIndex: number;
    sourceType: CustomEmojiSourceType;
    sourceAddress: string | null;
}

export const CUSTOM_EMOJI_SUGGESTION_LIMIT = 30;
export function normalizeEmojiShortcode(value: unknown): string { return String(value ?? "").replace(/^:+|:+$/g, "").trim(); }
export function normalizeEmojiShortcodeForLookup(value: unknown): string { return normalizeEmojiShortcode(value).toLowerCase(); }
export function createCustomEmojiIdentityKey(params: { shortcodeLower: string; src: string; setAddress?: string | null }): string {
    return [params.shortcodeLower, params.src, params.setAddress ?? ""].map(encodeURIComponent).join("|");
}
export function isValidCustomEmojiUrl(value: unknown): value is string {
    try { const url = new URL(String(value)); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}
export function createCustomEmojiItem(params: { shortcode: unknown; src: unknown; setAddress?: unknown; sortIndex: number; sourceType?: CustomEmojiSourceType; sourceAddress?: unknown }): CustomEmojiItem | null {
    const shortcode = normalizeEmojiShortcode(params.shortcode);
    const shortcodeLower = normalizeEmojiShortcodeForLookup(shortcode);
    if (!shortcode || !isValidCustomEmojiUrl(params.src)) return null;
    const setAddress = typeof params.setAddress === "string" && params.setAddress.trim() ? params.setAddress.trim() : null;
    return { identityKey: createCustomEmojiIdentityKey({ shortcodeLower, src: params.src, setAddress }), shortcode, shortcodeLower, src: params.src, setAddress, sortIndex: params.sortIndex, sourceType: params.sourceType ?? "kind10030", sourceAddress: typeof params.sourceAddress === "string" ? params.sourceAddress : null };
}
export function findCustomEmojiCandidatesByShortcode(items: CustomEmojiItem[], shortcode: unknown): CustomEmojiItem[] { const value = normalizeEmojiShortcodeForLookup(shortcode); return items.filter((item) => item.shortcodeLower === value); }
export function findCustomEmojiByShortcode(items: CustomEmojiItem[], shortcode: unknown): CustomEmojiItem | null { return findCustomEmojiCandidatesByShortcode(items, shortcode)[0] ?? null; }
export function findUniqueCustomEmojiByShortcode(items: CustomEmojiItem[], shortcode: unknown): CustomEmojiItem | null { const found = findCustomEmojiCandidatesByShortcode(items, shortcode); return found.length === 1 ? found[0] : null; }
export function getCustomEmojiSuggestionItems(items: CustomEmojiItem[], query: unknown, limit = CUSTOM_EMOJI_SUGGESTION_LIMIT): CustomEmojiItem[] { const value = normalizeEmojiShortcodeForLookup(query); return items.filter((item) => item.shortcodeLower.includes(value)).slice(0, limit); }
export function isCustomEmojiShortcodeText(value: unknown): boolean { return /^:[\p{L}\p{N}_+-]{1,64}:$/u.test(String(value).trim()); }
