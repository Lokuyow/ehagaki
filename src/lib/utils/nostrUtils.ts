import { getPublicKey, nip19 } from "nostr-tools";
import type { PublicKeyData } from "../types";
import { NSEC_PATTERN, NSEC_FULL_PATTERN } from "../constants";

// =============================================================================
// Nostr Key Utilities (Pure Functions)
// =============================================================================

/**
 * 秘密鍵(nsec)が含まれているかチェック
 */
export function containsSecretKey(text: string): boolean {
    return NSEC_PATTERN.test(text);
}

/**
 * nsec形式の秘密鍵が有効かチェック
 */
export function isValidNsec(key: string): boolean {
    return NSEC_FULL_PATTERN.test(key);
}

/**
 * nsecから公開鍵のhex形式を導出
 */
export function derivePublicKeyHex(nsecData: Uint8Array): string {
    return getPublicKey(nsecData);
}

/**
 * 公開鍵のhex形式からnpubとnprofileを生成
 */
export function createPublicKeyFormats(hex: string): { npub: string; nprofile: string } {
    return {
        npub: nip19.npubEncode(hex),
        nprofile: nip19.nprofileEncode({ pubkey: hex, relays: [] })
    };
}

/**
 * nsec形式の秘密鍵から公開鍵情報を導出する
 */
export function derivePublicKeyFromNsec(nsec: string): PublicKeyData {
    try {
        const { type, data } = nip19.decode(nsec);
        if (type !== "nsec") {
            console.warn("無効なnsec形式です");
            return { hex: "", npub: "", nprofile: "" };
        }

        const hex = derivePublicKeyHex(data as Uint8Array);
        const { npub, nprofile } = createPublicKeyFormats(hex);

        return { hex, npub, nprofile };
    } catch (e) {
        // エラー時は静かに空データを返す（テスト時のエラーログ抑制）
        return { hex: "", npub: "", nprofile: "" };
    }
}

/**
 * 公開鍵hexからnpub文字列を生成
 */
export function toNpub(pubkeyHex: string): string {
    try {
        return nip19.npubEncode(pubkeyHex);
    } catch {
        return `npub1${pubkeyHex.slice(0, 10)}...`;
    }
}

function appendUniqueRelays(target: string[], source: string[], limit: number): void {
    for (const relay of source) {
        if (!relay || target.includes(relay)) continue;
        target.push(relay);
        if (target.length >= limit) return;
    }
}

export function selectRelayHints(
    relayGroups: string[][],
    limit: number = 3,
): string[] {
    const relays: string[] = [];
    for (const group of relayGroups) {
        appendUniqueRelays(relays, group, limit);
        if (relays.length >= limit) break;
    }
    return relays;
}

/**
 * 公開鍵hexとリレーリストからnprofile文字列を生成
 * @param pubkeyHex 公開鍵のhex形式
 * @param profileRelays kind:0を受信したリレーのリスト
 * @param writeRelays 書き込み先リレーのリスト
 * @returns nprofile文字列
 */
export function toNprofile(
    pubkeyHex: string,
    profileRelays: string[] = [],
    writeRelays: string[] = []
): string {
    try {
        // kind:0を受信したリレー1つ + writeリレー上から2つ = 最大3つ
        const relays = selectRelayHints([
            profileRelays.slice(0, 1),
            writeRelays,
        ], 3);

        return nip19.nprofileEncode({
            pubkey: pubkeyHex,
            relays
        });
    } catch {
        return "";
    }
}

export function toNevent(params: {
    eventId: string;
    authorPubkey: string;
    kind: number;
    acceptedRelays?: string[];
    relayHints?: string[];
    writeRelays?: string[];
}): string {
    try {
        const relays = selectRelayHints([
            params.acceptedRelays ?? [],
            params.relayHints ?? [],
            params.writeRelays ?? [],
        ], 3);

        return nip19.neventEncode({
            id: params.eventId,
            author: params.authorPubkey,
            kind: params.kind,
            relays,
        });
    } catch {
        return "";
    }
}
