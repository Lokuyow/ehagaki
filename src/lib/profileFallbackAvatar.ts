import { nip19 } from "nostr-tools";
import { getAppStorage } from "./appStorage";

export const PROFILE_FALLBACK_AVATAR_CACHE_KEY = "profile-fallback-avatars-v1";
export const PROFILE_FALLBACK_AVATAR_CACHE_LIMIT = 256;

export interface ProfileAvatarIdentity {
    pubkeyHex?: string;
    displayName?: string;
    name?: string;
}

export interface ProfileFallbackAvatar {
    initial: string;
    background: string;
    foreground: "#000000" | "#ffffff";
    dataUrl: string;
}

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const escapeXml = (value: string): string => Array.from(value, char => {
    const point = char.codePointAt(0)!;
    return (point >= 0xd800 && point <= 0xdfff) || point < 0x20 || point >= 0xfffe && point <= 0xffff
        ? "\ufffd" : char;
}).join("").replace(/[<>&"']/g, char =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);

export function resolveProfileAvatarAppearance(identity: ProfileAvatarIdentity) {
    const pubkey = identity.pubkeyHex?.trim().toLowerCase() ?? "";
    const validPubkey = /^[0-9a-f]{64}$/.test(pubkey);
    const name = identity.displayName?.trim() || identity.name?.trim() || "";
    const initial = segmenter.segment(name)[Symbol.iterator]().next().value?.segment
        || (validPubkey ? nip19.npubEncode(pubkey).slice(5, 6) : "");
    if (!initial) return null;
    const background = validPubkey ? `#${pubkey.slice(0, 6)}` : "#808080";
    const channels = [1, 3, 5].map(offset => {
        const channel = parseInt(background.slice(offset, offset + 2), 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    const foreground = (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05)
        ? "#000000" as const : "#ffffff" as const;
    return { pubkey: validPubkey ? pubkey : "", initial, background, foreground };
}

function generateDataUrl(appearance: NonNullable<ReturnType<typeof resolveProfileAvatarAppearance>>): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${appearance.background}"/><text x="32" y="32" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="36" font-weight="600" fill="${appearance.foreground}">${escapeXml(appearance.initial)}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Each runtime's Storage facade owns its cache, including embedded namespaces. */
export function createProfileFallbackAvatarCache(storage?: Pick<Storage, "getItem" | "setItem">) {
    const entries = new Map<string, ProfileFallbackAvatar>();
    try {
        const saved: unknown = JSON.parse(storage?.getItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY) ?? "null");
        if (Array.isArray(saved)) {
            for (const entry of saved.slice(-PROFILE_FALLBACK_AVATAR_CACHE_LIMIT)) {
                if (!Array.isArray(entry) || typeof entry[0] !== "string") continue;
                const avatar = entry[1] as ProfileFallbackAvatar | undefined;
                if (!avatar || typeof avatar.initial !== "string" || !avatar.initial
                    || !/^#[0-9a-f]{6}$/.test(avatar.background)
                    || !["#000000", "#ffffff"].includes(avatar.foreground)
                    || typeof avatar.dataUrl !== "string" || avatar.dataUrl.length > 16384) continue;
                const pubkey = entry[0].split(":")[1];
                const appearance = resolveProfileAvatarAppearance({ pubkeyHex: pubkey, name: avatar.initial });
                // Only accept our canonical SVG; corrupted/stale cached colors or markup are regenerated.
                if (appearance && entry[0] === `v1:${appearance.pubkey}:${appearance.initial}`
                    && avatar.background === appearance.background && avatar.foreground === appearance.foreground
                    && avatar.dataUrl === generateDataUrl(appearance)) entries.set(entry[0], avatar);
            }
        }
    } catch { /* A cache must never prevent avatar rendering. */ }

    return {
        get(identity: ProfileAvatarIdentity): ProfileFallbackAvatar | null {
            const appearance = resolveProfileAvatarAppearance(identity);
            if (!appearance) return null;
            const key = `v1:${appearance.pubkey}:${appearance.initial}`;
            const existing = entries.get(key);
            if (existing) {
                entries.delete(key);
                entries.set(key, existing);
                return existing;
            }
            const { initial, background, foreground } = appearance;
            const avatar = { initial, background, foreground, dataUrl: generateDataUrl(appearance) };
            entries.set(key, avatar);
            if (entries.size > PROFILE_FALLBACK_AVATAR_CACHE_LIMIT) entries.delete(entries.keys().next().value!);
            try { storage?.setItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY, JSON.stringify([...entries])); }
            catch { /* Memory reuse remains available when persistence is denied/full. */ }
            return avatar;
        },
    };
}

const runtimeCaches = new WeakMap<Storage, ReturnType<typeof createProfileFallbackAvatarCache>>();
const memoryOnlyCache = createProfileFallbackAvatarCache();
export function getProfileFallbackAvatar(identity: ProfileAvatarIdentity): ProfileFallbackAvatar | null {
    let storage: Storage;
    try { storage = getAppStorage(); } catch { return memoryOnlyCache.get(identity); }
    let cache = runtimeCaches.get(storage);
    if (!cache) {
        cache = createProfileFallbackAvatarCache(storage);
        runtimeCaches.set(storage, cache);
    }
    return cache.get(identity);
}
