import { afterEach, describe, expect, it, vi } from "vitest";
import { nip19 } from "nostr-tools";
import { configureAppStorage, createWebComponentStorage, resetAppStorage } from "../../lib/appStorage";
import { createProfileFallbackAvatarCache, getProfileFallbackAvatar, PROFILE_FALLBACK_AVATAR_CACHE_KEY, resolveProfileAvatarAppearance } from "../../lib/profileFallbackAvatar";

function storage() {
    const values = new Map<string, string>();
    return { get length() { return values.size; }, clear() { values.clear(); }, key(index: number) { return [...values.keys()][index] ?? null; }, removeItem(key: string) { values.delete(key); }, getItem: vi.fn((key: string) => values.get(key) ?? null), setItem: vi.fn((key: string, value: string) => { values.set(key, value); }) };
}
const pubkeyHex = 'abcdef'.repeat(10) + 'abcd';
afterEach(resetAppStorage);

describe('profile fallback avatars', () => {
    it.each([[' 山田 ', '山'], ['alice', 'a'], ['👩🏽‍💻 coder', '👩🏽‍💻'], ['e\u0301clair', 'e\u0301'], ['🇯🇵', '🇯🇵']])('preserves the first grapheme of %s', (displayName, expected) => {
        expect(resolveProfileAvatarAppearance({ pubkeyHex, displayName })?.initial).toBe(expected);
    });
    it('uses displayName, then name, then the actual npub payload', () => {
        expect(resolveProfileAvatarAppearance({ pubkeyHex, displayName: ' Display', name: 'Name' })?.initial).toBe('D');
        expect(resolveProfileAvatarAppearance({ pubkeyHex, displayName: ' ', name: ' Name' })?.initial).toBe('N');
        expect(resolveProfileAvatarAppearance({ pubkeyHex })?.initial).toBe(nip19.npubEncode(pubkeyHex).slice(5, 6));
        expect(resolveProfileAvatarAppearance({})).toBeNull();
        expect(resolveProfileAvatarAppearance({ name: 'A' })?.background).toBe('#808080');
    });
    it('normalizes public keys and keeps background stable across renames', () => {
        expect(resolveProfileAvatarAppearance({ pubkeyHex: pubkeyHex.toUpperCase(), name: 'A' })?.background).toBe('#abcdef');
        expect(resolveProfileAvatarAppearance({ pubkeyHex, name: 'B' })?.background).toBe('#abcdef');
    });
    it('maintains 4.5:1 contrast across light, dark and mixed backgrounds', () => {
        for (const rgb of [...Array.from({length: 256}, (_, n) => n * 65537), 0xff0000, 0x00ff00, 0x0000ff, 0xabcdef, 0x123456, 0x777700, 0x007777]) {
            const hex = rgb.toString(16).padStart(6, '0');
            const avatar = resolveProfileAvatarAppearance({ pubkeyHex: hex + '0'.repeat(58), name: 'A' })!;
            const channels = hex.match(/../g)!.map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
            const luminance = channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
            expect(avatar.foreground === '#000000' ? (luminance + .05) / .05 : 1.05 / (luminance + .05)).toBeGreaterThanOrEqual(4.5);
        }
    });
    it('escapes markup as SVG text', () => {
        const avatar = createProfileFallbackAvatarCache().get({ pubkeyHex, name: '<script>' })!;
        expect(decodeURIComponent(avatar.dataUrl)).toContain('&lt;</text>');
        expect(decodeURIComponent(avatar.dataUrl)).not.toContain('<script>');
    });
    it.each(['\ud800', '\udfff', '\u0000'])('keeps malformed profile text renderable: %j', name => {
        const avatar = createProfileFallbackAvatarCache().get({pubkeyHex, name});
        expect(decodeURIComponent(avatar!.dataUrl)).toContain('>�</text>');
    });
    it('reuses memory entries and restores persisted SVG after recreation', () => {
        const backing = storage();
        const cache = createProfileFallbackAvatarCache(backing);
        const avatar = cache.get({ pubkeyHex, name: 'Alice' });
        expect(cache.get({ pubkeyHex, name: 'Another' })).toBe(avatar);
        expect(backing.setItem).toHaveBeenCalledTimes(1);
        expect(createProfileFallbackAvatarCache(backing).get({ pubkeyHex, name: 'Alice' })).toEqual(avatar);
        expect(backing.setItem).toHaveBeenCalledTimes(1);
        expect(cache.get({ pubkeyHex, name: 'Bob' })?.dataUrl).not.toBe(avatar?.dataUrl);
    });
    it('evicts least recently used entries at 256', () => {
        const backing = storage();
        const cache = createProfileFallbackAvatarCache(backing);
        const identities = Array.from({length: 257}, (_, n) => ({ pubkeyHex: n.toString(16).padStart(64, '0'), name: 'A' }));
        for (const identity of identities.slice(0, 256)) cache.get(identity);
        cache.get(identities[0]);
        cache.get(identities[256]);
        const saved = JSON.parse(backing.getItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY)!);
        expect(saved).toHaveLength(256);
        expect(saved.some(([key]: [string]) => key.includes(identities[0].pubkeyHex))).toBe(true);
        expect(saved.some(([key]: [string]) => key.includes(identities[1].pubkeyHex))).toBe(false);
    });
    it('recovers from malformed or tampered persistence and unavailable storage', () => {
        const backing = storage();
        backing.setItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY, '{bad');
        const good = createProfileFallbackAvatarCache(backing).get({pubkeyHex, name: 'A'});
        const saved = JSON.parse(backing.getItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY)!);
        saved[0][1].dataUrl = 'data:image/svg+xml,broken';
        backing.setItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY, JSON.stringify(saved));
        expect(createProfileFallbackAvatarCache(backing).get({pubkeyHex, name: 'A'})).toEqual(good);
        const denied = createProfileFallbackAvatarCache({ getItem() { throw Error('denied'); }, setItem() { throw Error('full'); } });
        const avatar = denied.get({pubkeyHex});
        expect(denied.get({pubkeyHex})).toBe(avatar);
    });
    it('separates runtime storage facades and preserves host keys', () => {
        const host = storage();
        host.setItem("host-only", "keep");
        const component = createWebComponentStorage(host);
        configureAppStorage(host);
        const first = getProfileFallbackAvatar({pubkeyHex, name: 'A'});
        configureAppStorage(component);
        expect(getProfileFallbackAvatar({pubkeyHex, name: 'A'})).not.toBe(first);
        configureAppStorage(host);
        expect(getProfileFallbackAvatar({pubkeyHex, name: 'A'})).toBe(first);
        expect(host.getItem("host-only")).toBe("keep");
        expect(host.getItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY)).toBeTruthy();
        expect(component.getItem(PROFILE_FALLBACK_AVATAR_CACHE_KEY)).toBeTruthy();
    });
});
