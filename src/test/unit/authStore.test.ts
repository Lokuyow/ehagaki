import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.unmock('../../stores/authStore.svelte');

// authStore.svelte.ts はストアモジュールなので、テストごとに状態をリセットするため
// vi.mock ではなく直接インポートする（setup.ts の $state モックが適用される）
import {
    authState,
    updateAuthState,
    clearAuthState,
    setNsecAuth,
    setNip07Auth,
    setNip46Auth,
    setAuthInitialized,
    secretKeyStore,
    accountListStore,
    accountProfileCacheStore,
} from '../../stores/authStore.svelte';

describe('authStore', () => {
    beforeEach(() => {
        clearAuthState(false);
        vi.restoreAllMocks();
    });

    describe('updateAuthState', () => {
        it('部分更新で既存状態とマージされる', () => {
            updateAuthState({ type: 'nsec', pubkey: 'abc', isValid: true });
            updateAuthState({ npub: 'npub1test' });

            expect(authState.value.type).toBe('nsec');
            expect(authState.value.pubkey).toBe('abc');
            expect(authState.value.npub).toBe('npub1test');
        });

        it('isAuthenticatedがtype !== "none" && isValidで自動計算される', () => {
            updateAuthState({ type: 'nsec', isValid: true });
            expect(authState.value.isAuthenticated).toBe(true);

            updateAuthState({ type: 'none' });
            expect(authState.value.isAuthenticated).toBe(false);

            updateAuthState({ type: 'nip07', isValid: false });
            expect(authState.value.isAuthenticated).toBe(false);

            updateAuthState({ type: 'nip07', isValid: true });
            expect(authState.value.isAuthenticated).toBe(true);
        });

        it('isExtensionLoginがtype === "nip07"時にtrue設定される', () => {
            updateAuthState({ type: 'nip07', isValid: true });
            expect(authState.value.isExtensionLogin).toBe(true);

            updateAuthState({ type: 'nsec' });
            expect(authState.value.isExtensionLogin).toBe(false);

            updateAuthState({ type: 'nip46' });
            expect(authState.value.isExtensionLogin).toBe(false);
        });
    });

    describe('clearAuthState', () => {
        it('preserveInitialized=true で isInitialized 保持', () => {
            updateAuthState({ type: 'nsec', isValid: true, isInitialized: true });
            clearAuthState(true);

            expect(authState.value.type).toBe('none');
            expect(authState.value.isAuthenticated).toBe(false);
            expect(authState.value.isInitialized).toBe(true);
        });

        it('preserveInitialized=false で完全リセット', () => {
            updateAuthState({ type: 'nsec', isValid: true, isInitialized: true });
            clearAuthState(false);

            expect(authState.value.type).toBe('none');
            expect(authState.value.isAuthenticated).toBe(false);
            expect(authState.value.isInitialized).toBe(false);
        });

        it('デフォルトでpreserveInitialized=true', () => {
            updateAuthState({ isInitialized: true });
            clearAuthState();

            expect(authState.value.isInitialized).toBe(true);
        });
    });

    describe('setNsecAuth', () => {
        it('正常値でtype="nsec"として状態更新', () => {
            setNsecAuth('pubkey1', 'npub1test', 'nprofile1test');

            expect(authState.value.type).toBe('nsec');
            expect(authState.value.pubkey).toBe('pubkey1');
            expect(authState.value.npub).toBe('npub1test');
            expect(authState.value.nprofile).toBe('nprofile1test');
            expect(authState.value.isValid).toBe(true);
            expect(authState.value.isAuthenticated).toBe(true);
        });

        it('無効値（空文字）でconsole.warnし状態は変わらない', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            setNsecAuth('', 'npub1test', 'nprofile1test');

            expect(warnSpy).toHaveBeenCalledWith('setNsecAuth: All parameters are required');
            expect(authState.value.type).toBe('none');
        });
    });

    describe('setNip07Auth', () => {
        it('正常値でtype="nip07"として状態更新', () => {
            setNip07Auth('pubkey1', 'npub1test', 'nprofile1test');

            expect(authState.value.type).toBe('nip07');
            expect(authState.value.isExtensionLogin).toBe(true);
            expect(authState.value.isAuthenticated).toBe(true);
        });

        it('無効値でconsole.warnし状態は変わらない', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            setNip07Auth('pubkey1', '', 'nprofile1test');

            expect(warnSpy).toHaveBeenCalledWith('setNip07Auth: All parameters are required');
            expect(authState.value.type).toBe('none');
        });
    });

    describe('setNip46Auth', () => {
        it('正常値でtype="nip46"として状態更新', () => {
            setNip46Auth('pubkey1', 'npub1test', 'nprofile1test');

            expect(authState.value.type).toBe('nip46');
            expect(authState.value.isAuthenticated).toBe(true);
            expect(authState.value.isExtensionLogin).toBe(false);
        });

        it('無効値でconsole.warnし状態は変わらない', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            setNip46Auth('pubkey1', 'npub1test', '');

            expect(warnSpy).toHaveBeenCalledWith('setNip46Auth: All parameters are required');
            expect(authState.value.type).toBe('none');
        });
    });

    describe('setAuthInitialized', () => {
        it('isInitialized=true設定', () => {
            expect(authState.value.isInitialized).toBe(false);
            setAuthInitialized();
            expect(authState.value.isInitialized).toBe(true);
        });
    });

    describe('secretKeyStore', () => {
        it('getter/setter動作', () => {
            expect(secretKeyStore.value).toBeNull();
            secretKeyStore.set('nsec1test');
            expect(secretKeyStore.value).toBe('nsec1test');
            secretKeyStore.set(null);
            expect(secretKeyStore.value).toBeNull();
        });
    });

    describe('accountListStore', () => {
        it('getter/setter動作', () => {
            expect(accountListStore.value).toEqual([]);
            const accounts = [{ pubkeyHex: 'abc', type: 'nsec' as const, addedAt: 1000 }];
            accountListStore.set(accounts);
            expect(accountListStore.value).toEqual(accounts);
        });
    });

    describe('accountProfileCacheStore', () => {
        it('getter/setter動作', () => {
            expect(accountProfileCacheStore.value.size).toBe(0);
            const cache = new Map([['abc', { name: 'Test', displayName: '', picture: 'https://example.com/pic.jpg' }]]);
            accountProfileCacheStore.set(cache);
            expect(accountProfileCacheStore.value.get('abc')?.name).toBe('Test');
        });

        it('setProfileで新Map生成', () => {
            const originalMap = accountProfileCacheStore.value;
            accountProfileCacheStore.setProfile('key1', { name: 'User1', displayName: '', picture: 'pic1' });

            expect(accountProfileCacheStore.value.get('key1')?.name).toBe('User1');
            // 新しいMapインスタンスが生成される（イミュータブル更新）
            expect(accountProfileCacheStore.value).not.toBe(originalMap);
        });
    });
});
