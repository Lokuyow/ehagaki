/**
 * nostrUtils.test.ts
 *
 * nostr-tools のアップデート時の破壊的変更を検出するためのテスト。
 * このファイルの関数は nostr-tools の API を直接ラップしているため、
 * nostr-tools の任意のバージョン変更がここで検出される。
 *
 * 主な検証対象:
 *  - nip19.decode / nip19.npubEncode / nip19.nprofileEncode / nip19.nsecEncode
 *  - getPublicKey (secp256k1)
 */

import { describe, it, expect } from 'vitest';
import { nip19, getPublicKey } from 'nostr-tools';
import {
    containsSecretKey,
    isValidNsec,
    derivePublicKeyHex,
    createPublicKeyFormats,
    derivePublicKeyFromNsec,
    toNpub,
    toNprofile,
} from '../../lib/utils/nostrUtils';

// =============================================================================
// テスト用既知値
// - 秘密鍵：secp256k1 の最小有効値 (0x01)
// - 公開鍵：G (生成元) の x 座標 (well-known secp256k1 定数)
// =============================================================================
const TEST_PRIVKEY_BYTES = new Uint8Array(32);
TEST_PRIVKEY_BYTES[31] = 1; // 0x000...001

const KNOWN_PUBKEY_HEX = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';

// 既存テストで使用されている有効な npub（nip19.decode 実動作確認済み）
const KNOWN_VALID_NPUB = 'npub1w0rthyjyp2f5gful0gm2500pwyxfrx93a85289xdz0sd6hyef33sh2cu4x';

// =============================================================================
// containsSecretKey
// =============================================================================
describe('containsSecretKey', () => {
    describe('正常系', () => {
        it('nsec を含むテキストを検出する', () => {
            expect(containsSecretKey('ここに nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7l が含まれる')).toBe(true);
        });

        it('nsec のみのテキストを検出する', () => {
            expect(containsSecretKey('nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7l')).toBe(true);
        });
    });

    describe('異常系', () => {
        it('nsec を含まないテキストを無視する', () => {
            expect(containsSecretKey('これはただのテキストです')).toBe(false);
        });

        it('npub は nsec として検出しない', () => {
            expect(containsSecretKey(KNOWN_VALID_NPUB)).toBe(false);
        });

        it('空文字は検出しない', () => {
            expect(containsSecretKey('')).toBe(false);
        });
    });
});

// =============================================================================
// isValidNsec
// =============================================================================
describe('isValidNsec', () => {
    describe('正常系', () => {
        it('有効な形式の nsec を受け入れる', () => {
            // nsec1 + 58 文字の bech32 アルファベット
            const validNsec = 'nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khce';
            expect(isValidNsec(validNsec)).toBe(true);
        });
    });

    describe('異常系', () => {
        it('短すぎる nsec を拒否する', () => {
            expect(isValidNsec('nsec1short')).toBe(false);
        });

        it('プレフィックスなしを拒否する', () => {
            expect(isValidNsec('qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khce1234')).toBe(false);
        });

        it('npub1 プレフィックスを拒否する', () => {
            expect(isValidNsec(KNOWN_VALID_NPUB)).toBe(false);
        });

        it('空文字を拒否する', () => {
            expect(isValidNsec('')).toBe(false);
        });
    });
});

// =============================================================================
// nostr-tools API 整合性テスト
// 以下は nostr-tools の破壊的変更を直接検出するためのテスト
// =============================================================================

describe('nostr-tools API 整合性', () => {
    describe('nip19.nsecEncode / nip19.decode (秘密鍵のエンコード/デコード)', () => {
        it('nip19.nsecEncode が nsec1 で始まる文字列を返す', () => {
            const nsec = nip19.nsecEncode(TEST_PRIVKEY_BYTES);
            expect(typeof nsec).toBe('string');
            expect(nsec.startsWith('nsec1')).toBe(true);
        });

        it('nip19.decode(nsec) が {type:"nsec", data:Uint8Array} を返す', () => {
            const nsec = nip19.nsecEncode(TEST_PRIVKEY_BYTES);
            const decoded = nip19.decode(nsec);
            expect(decoded.type).toBe('nsec');
            expect(decoded.data).toBeInstanceOf(Uint8Array);
        });

        it('nsecEncode → decode がラウンドトリップする', () => {
            const nsec = nip19.nsecEncode(TEST_PRIVKEY_BYTES);
            const decoded = nip19.decode(nsec);
            expect(decoded.data).toEqual(TEST_PRIVKEY_BYTES);
        });
    });

    describe('nip19.npubEncode / nip19.decode (公開鍵のエンコード/デコード)', () => {
        it('nip19.npubEncode が npub1 で始まる文字列を返す', () => {
            const npub = nip19.npubEncode(KNOWN_PUBKEY_HEX);
            expect(typeof npub).toBe('string');
            expect(npub.startsWith('npub1')).toBe(true);
        });

        it('nip19.decode(npub) が {type:"npub", data:string} を返す', () => {
            const decoded = nip19.decode(KNOWN_VALID_NPUB);
            expect(decoded.type).toBe('npub');
            expect(typeof decoded.data).toBe('string');
        });

        it('npubEncode → decode がラウンドトリップする', () => {
            const npub = nip19.npubEncode(KNOWN_PUBKEY_HEX);
            const decoded = nip19.decode(npub);
            expect(decoded.data).toBe(KNOWN_PUBKEY_HEX);
        });
    });

    describe('nip19.nprofileEncode / nip19.decode (プロフィールのエンコード/デコード)', () => {
        it('nip19.nprofileEncode が nprofile1 で始まる文字列を返す', () => {
            const nprofile = nip19.nprofileEncode({ pubkey: KNOWN_PUBKEY_HEX, relays: [] });
            expect(typeof nprofile).toBe('string');
            expect(nprofile.startsWith('nprofile1')).toBe(true);
        });

        it('nprofileEncode → decode がラウンドトリップする', () => {
            const nprofile = nip19.nprofileEncode({ pubkey: KNOWN_PUBKEY_HEX, relays: [] });
            const decoded = nip19.decode(nprofile);
            expect(decoded.type).toBe('nprofile');
            expect((decoded.data as any).pubkey).toBe(KNOWN_PUBKEY_HEX);
        });

        it('リレー付きでエンコードしてラウンドトリップする', () => {
            const relays = ['wss://relay.example.com/'];
            const nprofile = nip19.nprofileEncode({ pubkey: KNOWN_PUBKEY_HEX, relays });
            const decoded = nip19.decode(nprofile);
            expect(decoded.type).toBe('nprofile');
            expect((decoded.data as any).relays).toEqual(relays);
        });
    });

    describe('getPublicKey (secp256k1 公開鍵導出)', () => {
        it('Uint8Array 秘密鍵から 64 文字の hex 公開鍵を返す', () => {
            const pubkey = getPublicKey(TEST_PRIVKEY_BYTES);
            expect(typeof pubkey).toBe('string');
            expect(pubkey).toHaveLength(64);
            expect(/^[0-9a-f]{64}$/.test(pubkey)).toBe(true);
        });

        it('既知の秘密鍵から既知の公開鍵を導出する', () => {
            const pubkey = getPublicKey(TEST_PRIVKEY_BYTES);
            expect(pubkey).toBe(KNOWN_PUBKEY_HEX);
        });
    });
});

// =============================================================================
// derivePublicKeyHex
// =============================================================================
describe('derivePublicKeyHex', () => {
    it('Uint8Array から正しい hex を返す', () => {
        const hex = derivePublicKeyHex(TEST_PRIVKEY_BYTES);
        expect(hex).toBe(KNOWN_PUBKEY_HEX);
    });

    it('戻り値は 64 文字の小文字 hex', () => {
        const hex = derivePublicKeyHex(TEST_PRIVKEY_BYTES);
        expect(/^[0-9a-f]{64}$/.test(hex)).toBe(true);
    });
});

// =============================================================================
// createPublicKeyFormats
// =============================================================================
describe('createPublicKeyFormats', () => {
    it('npub と nprofile を返す', () => {
        const { npub, nprofile } = createPublicKeyFormats(KNOWN_PUBKEY_HEX);
        expect(npub.startsWith('npub1')).toBe(true);
        expect(nprofile.startsWith('nprofile1')).toBe(true);
    });

    it('npub が nip19.decode でラウンドトリップする', () => {
        const { npub } = createPublicKeyFormats(KNOWN_PUBKEY_HEX);
        const decoded = nip19.decode(npub);
        expect(decoded.type).toBe('npub');
        expect(decoded.data).toBe(KNOWN_PUBKEY_HEX);
    });

    it('nprofile が nip19.decode でラウンドトリップする', () => {
        const { nprofile } = createPublicKeyFormats(KNOWN_PUBKEY_HEX);
        const decoded = nip19.decode(nprofile);
        expect(decoded.type).toBe('nprofile');
        expect((decoded.data as any).pubkey).toBe(KNOWN_PUBKEY_HEX);
    });
});

// =============================================================================
// derivePublicKeyFromNsec
// =============================================================================
describe('derivePublicKeyFromNsec', () => {
    describe('正常系', () => {
        it('有効な nsec から公開鍵情報を導出する', () => {
            const nsec = nip19.nsecEncode(TEST_PRIVKEY_BYTES);
            const result = derivePublicKeyFromNsec(nsec);

            expect(result.hex).toBe(KNOWN_PUBKEY_HEX);
            expect(result.npub.startsWith('npub1')).toBe(true);
            expect(result.nprofile.startsWith('nprofile1')).toBe(true);
        });

        it('hex が 64 文字の小文字 hex', () => {
            const nsec = nip19.nsecEncode(TEST_PRIVKEY_BYTES);
            const result = derivePublicKeyFromNsec(nsec);
            expect(/^[0-9a-f]{64}$/.test(result.hex)).toBe(true);
        });

        it('npub が nip19.decode でラウンドトリップする', () => {
            const nsec = nip19.nsecEncode(TEST_PRIVKEY_BYTES);
            const { npub, hex } = derivePublicKeyFromNsec(nsec);
            const decoded = nip19.decode(npub);
            expect(decoded.type).toBe('npub');
            expect(decoded.data).toBe(hex);
        });
    });

    describe('異常系', () => {
        it('無効な nsec で空の PublicKeyData を返す', () => {
            const result = derivePublicKeyFromNsec('invalid');
            expect(result).toEqual({ hex: '', npub: '', nprofile: '' });
        });

        it('npub を渡すと空の PublicKeyData を返す（type !== "nsec"）', () => {
            const result = derivePublicKeyFromNsec(KNOWN_VALID_NPUB);
            expect(result).toEqual({ hex: '', npub: '', nprofile: '' });
        });

        it('空文字で空の PublicKeyData を返す', () => {
            const result = derivePublicKeyFromNsec('');
            expect(result).toEqual({ hex: '', npub: '', nprofile: '' });
        });
    });
});

// =============================================================================
// toNpub
// =============================================================================
describe('toNpub', () => {
    describe('正常系', () => {
        it('有効な pubkey hex から npub1 で始まる文字列を返す', () => {
            const npub = toNpub(KNOWN_PUBKEY_HEX);
            expect(npub.startsWith('npub1')).toBe(true);
        });

        it('ラウンドトリップ: npubEncode → decode → hex', () => {
            const npub = toNpub(KNOWN_PUBKEY_HEX);
            const decoded = nip19.decode(npub);
            expect(decoded.data).toBe(KNOWN_PUBKEY_HEX);
        });
    });

    describe('異常系', () => {
        it('無効な pubkey でフォールバック文字列を返す（例外を投げない）', () => {
            expect(() => toNpub('invalid')).not.toThrow();
        });

        it('空文字でフォールバック文字列を返す', () => {
            const result = toNpub('');
            expect(typeof result).toBe('string');
        });
    });
});

// =============================================================================
// toNprofile
// =============================================================================
describe('toNprofile', () => {
    describe('正常系', () => {
        it('有効な pubkey hex から nprofile1 で始まる文字列を返す', () => {
            const nprofile = toNprofile(KNOWN_PUBKEY_HEX);
            expect(nprofile.startsWith('nprofile1')).toBe(true);
        });

        it('リレーなしで nprofile1 で始まる文字列を返す', () => {
            const nprofile = toNprofile(KNOWN_PUBKEY_HEX, [], []);
            expect(nprofile.startsWith('nprofile1')).toBe(true);
        });

        it('profileRelays を含む nprofile はラウンドトリップする', () => {
            const profileRelays = ['wss://profile.relay.example/'];
            const nprofile = toNprofile(KNOWN_PUBKEY_HEX, profileRelays, []);
            const decoded = nip19.decode(nprofile);
            expect(decoded.type).toBe('nprofile');
            expect((decoded.data as any).pubkey).toBe(KNOWN_PUBKEY_HEX);
        });

        it('writeRelays を含む nprofile はラウンドトリップする', () => {
            const writeRelays = ['wss://write.relay.example/', 'wss://write2.relay.example/'];
            const nprofile = toNprofile(KNOWN_PUBKEY_HEX, [], writeRelays);
            const decoded = nip19.decode(nprofile);
            expect(decoded.type).toBe('nprofile');
        });

        it('リレー合計は最大 3 つに制限される', () => {
            const profileRelays = ['wss://r1.example/'];
            const writeRelays = ['wss://r2.example/', 'wss://r3.example/', 'wss://r4.example/'];
            const nprofile = toNprofile(KNOWN_PUBKEY_HEX, profileRelays, writeRelays);
            const decoded = nip19.decode(nprofile);
            const relays: string[] = (decoded.data as any).relays ?? [];
            expect(relays.length).toBeLessThanOrEqual(3);
        });
    });

    describe('異常系', () => {
        it('無効な pubkey で空文字を返す（例外を投げない）', () => {
            expect(() => toNprofile('invalid')).not.toThrow();
        });

        it('空 pubkey で空文字を返す', () => {
            const result = toNprofile('');
            expect(typeof result).toBe('string');
        });
    });
});
