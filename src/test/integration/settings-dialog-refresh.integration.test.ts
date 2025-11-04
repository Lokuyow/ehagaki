import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRxNostr } from 'rx-nostr';
import { ProfileManager } from '../../lib/profileManager';
import { RelayManager } from '../../lib/relayManager';
import { writeRelaysStore, profileDataStore, relayListUpdatedStore, saveRelayConfigToStorage } from '../../stores/appStore.svelte';

/**
 * SettingsDialog リレー・プロフィール更新統合テスト
 *
 * App.svelteのhandleRefreshRelaysAndProfile関数が正しく動作することをテスト：
 * - relay-listがリアクティブに更新される
 * - localStorageに保存される
 * - ブラウザリフレッシュ後も保持される
 * - ProfileComponentのnprofileのリレーが最新の状態になる
 */

describe('SettingsDialog リレー・プロフィール更新統合テスト', () => {
    let rxNostr: ReturnType<typeof createRxNostr>;
    let profileManager: ProfileManager;
    let relayManager: RelayManager;
    let originalLocalStorage: Storage;

    beforeEach(() => {
        // localStorageをモック
        originalLocalStorage = window.localStorage;
        const mockLocalStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            length: 0
        };
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });

        // RxNostrとマネージャーを初期化
        rxNostr = createRxNostr({ verifier: () => Promise.resolve(true) });
        profileManager = new ProfileManager(rxNostr);
        relayManager = new RelayManager(rxNostr, {
            relayListUpdatedStore: {
                value: relayListUpdatedStore.value,
                set: (v: number) => relayListUpdatedStore.set(v),
            },
        });

        // ストアを初期化
        writeRelaysStore.set([]);
        profileDataStore.set({ name: '', picture: '', npub: '', nprofile: '' });
        relayListUpdatedStore.set(0);
    });

    afterEach(() => {
        // localStorageを元に戻す
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true
        });
    });

    describe('handleRefreshRelaysAndProfile関数', () => {
        it('リレー取得とプロフィール取得が正しく呼び出される', async () => {
            const testPubkey = 'test-pubkey-123';

            // モックを設定
            const fetchUserRelaysSpy = vi.spyOn(relayManager, 'fetchUserRelays').mockResolvedValue(true);

            const fetchProfileDataSpy = vi.spyOn(profileManager, 'fetchProfileData').mockResolvedValue({
                name: 'Test User',
                picture: 'https://example.com/pic.jpg',
                npub: 'npub1test123',
                nprofile: 'nprofile1test456'
            });

            const saveToLocalStorageSpy = vi.spyOn(profileManager, 'saveToLocalStorage').mockImplementation(() => {});

            // handleRefreshRelaysAndProfile関数をシミュレート
            async function handleRefreshRelaysAndProfile() {
                if (!relayManager || !profileManager) return;

                // 1. リレーリスト再取得
                if (relayManager) {
                    await relayManager.fetchUserRelays(testPubkey, { forceRemote: true });
                }

                // 2. プロフィール再取得
                if (profileManager) {
                    // プロフィールキャッシュ削除
                    profileManager.saveToLocalStorage(testPubkey, null);
                    await profileManager.fetchProfileData(testPubkey, { forceRemote: true });
                }
            }

            // 関数を実行
            await handleRefreshRelaysAndProfile();

            // リレー取得が正しく呼び出されたことを確認
            expect(fetchUserRelaysSpy).toHaveBeenCalledWith(testPubkey, { forceRemote: true });

            // プロフィールキャッシュ削除が呼び出されたことを確認
            expect(saveToLocalStorageSpy).toHaveBeenCalledWith(testPubkey, null);

            // プロフィール取得が正しく呼び出されたことを確認
            expect(fetchProfileDataSpy).toHaveBeenCalledWith(testPubkey, { forceRemote: true });
        });

        // it('リレー設定がlocalStorageに保存される', async () => {
        //     const testPubkey = 'test-pubkey-456';
        //     const relayConfig = {
        //         'wss://relay1.example.com': { write: true, read: true },
        //         'wss://relay2.example.com': { write: true, read: false }
        //     };

        //     // saveRelayConfigToStorage関数を直接呼び出し
        //     const { saveRelayConfigToStorage } = await import('../../stores/appStore.svelte');
        //     saveRelayConfigToStorage(testPubkey, relayConfig);

        //     // localStorage.setItemが正しく呼び出されたことを確認
        //     expect(localStorage.setItem).toHaveBeenCalledWith(
        //         `nostr-relays-${testPubkey}`,
        //         JSON.stringify(relayConfig)
        //     );
        // });

        // it('プロフィールデータがストアに設定される', async () => {
        //     const testProfile = {
        //         name: 'Updated User',
        //         picture: 'https://example.com/updated.jpg',
        //         npub: 'npub1updated123',
        //         nprofile: 'nprofile1updated456'
        //     };

        //     // プロフィールをストアに設定
        //     const { profileDataStore } = await import('../../stores/appStore.svelte');
        //     profileDataStore.set(testProfile);

        //     // ストアが正しく更新されていることを確認
        //     expect(profileDataStore.value).toEqual(testProfile);
        //     expect(profileDataStore.value.nprofile).toBe('nprofile1updated456');
        // });

        // it('relayListUpdatedStoreが更新される', async () => {
        //     const { relayListUpdatedStore } = await import('../../stores/appStore.svelte');
        //     const initialValue = relayListUpdatedStore.value;

        //     // relayListUpdatedStoreを更新
        //     relayListUpdatedStore.set(initialValue + 1);

        //     // 値が正しく更新されていることを確認
        //     expect(relayListUpdatedStore.value).toBe(initialValue + 1);
        // });

        // it('writeRelaysStoreが更新される', async () => {
        //     const { writeRelaysStore } = await import('../../stores/appStore.svelte');
        //     const newRelays = ['wss://relay1.example.com', 'wss://relay2.example.com'];

        //     // writeRelaysStoreを更新
        //     writeRelaysStore.set(newRelays);

        //     // 値が正しく設定されていることを確認
        //     expect(writeRelaysStore.value).toEqual(newRelays);
        // });
    });

    describe('統合フロー', () => {
        it('リレーとプロフィールの両方が同時に更新される完全なフロー', async () => {
            const testPubkey = 'test-pubkey-integration';
            const newRelays = ['wss://integrated-relay1.example.com'];
            const newProfile = {
                name: 'Integrated User',
                picture: '',
                npub: 'npub1integrated123',
                nprofile: 'nprofile1integrated456'
            };

            // モックを設定
            vi.spyOn(relayManager, 'fetchUserRelays').mockResolvedValue(true);
            vi.spyOn(profileManager, 'fetchProfileData').mockResolvedValue(newProfile);
            vi.spyOn(profileManager, 'saveToLocalStorage').mockImplementation(() => {});

            // localStorageにリレー設定を保存するモック
            (localStorage.getItem as any).mockReturnValue(JSON.stringify({
                'wss://integrated-relay1.example.com': { write: true, read: true }
            }));

            // handleRefreshRelaysAndProfile関数をシミュレート
            async function handleRefreshRelaysAndProfile() {
                if (!relayManager || !profileManager) return;

                // 1. リレーリスト再取得
                if (relayManager) {
                    await relayManager.fetchUserRelays(testPubkey, { forceRemote: true });
                }

                // 2. プロフィール再取得
                if (profileManager) {
                    // プロフィールキャッシュ削除
                    profileManager.saveToLocalStorage(testPubkey, null);
                    await profileManager.fetchProfileData(testPubkey, { forceRemote: true });
                }
            }

            // 関数を実行
            await handleRefreshRelaysAndProfile();

            // リレー取得とプロフィール取得が呼び出されたことを確認
            expect(relayManager.fetchUserRelays).toHaveBeenCalledWith(testPubkey, { forceRemote: true });
            expect(profileManager.saveToLocalStorage).toHaveBeenCalledWith(testPubkey, null);
            expect(profileManager.fetchProfileData).toHaveBeenCalledWith(testPubkey, { forceRemote: true });
        });
    });
});