import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    ProfileManager,
    ProfileStorage,
    ProfileNetworkFetcher,
    ProfileDataFactory,
    ProfileUrlUtils
} from '../../lib/profileManager';
import {
    getProfilePictureCacheKeyUrl,
    normalizeProfilePictureUrl,
} from '../../lib/profilePictureUrlUtils';
import { EHagakiDB } from '../../lib/storage/ehagakiDb';
import { DexieProfilesRepository } from '../../lib/storage/profilesRepository';
import type { ProfileManagerDeps } from '../../lib/types';
import { MockStorage, createMockRxNostr } from '../helpers';

describe('ProfileUrlUtils', () => {
    describe('addCacheBuster', () => {
        it('有効なURLにキャッシュバスターを追加する', () => {
            const url = 'https://example.com/image.jpg';
            const result = ProfileUrlUtils.addCacheBuster(url);
            expect(result).toMatch(/https:\/\/example\.com\/image\.jpg\?cb=\d+/);
        });

        it('空文字列をそのまま返す', () => {
            expect(ProfileUrlUtils.addCacheBuster('')).toBe('');
        });

        it('無効なURLをそのまま返す', () => {
            const invalidUrl = 'invalid-url';
            expect(ProfileUrlUtils.addCacheBuster(invalidUrl)).toBe('');
        });
    });

    describe('addProfileMarker', () => {
        it('プロフィールマーカーを追加する', () => {
            const url = 'https://example.com/image.jpg';
            const result = ProfileUrlUtils.addProfileMarker(url);
            expect(result).toBe('https://example.com/image.jpg?profile=true');
        });

        it('forceRemoteがtrueでonlineの場合、キャッシュバスターを更新する', () => {
            const url = 'https://example.com/image.jpg?cb=123';
            const result = ProfileUrlUtils.addProfileMarker(url, true, true);
            expect(result).toMatch(/https:\/\/example\.com\/image\.jpg\?cb=\d+&profile=true/);
        });

        it('forceRemoteがfalseの場合、キャッシュバスターを削除する', () => {
            const url = 'https://example.com/image.jpg?cb=123&other=param';
            const result = ProfileUrlUtils.addProfileMarker(url, false, true);
            expect(result).toBe('https://example.com/image.jpg?other=param&profile=true');
        });
    });

    describe('ensureProfileMarker', () => {
        it('profileパラメータがないURLにprofile=trueを追加する', () => {
            const url = 'https://example.com/image.jpg?cb=123&other=param';
            const result = ProfileUrlUtils.ensureProfileMarker(url);
            expect(result).toBe('https://example.com/image.jpg?cb=123&other=param&profile=true');
        });

        it('既にprofileパラメータがあるURLは変更しない', () => {
            const url = 'https://example.com/image.jpg?cb=123&profile=true';
            const result = ProfileUrlUtils.ensureProfileMarker(url);
            expect(result).toBe(url);
        });

        it('private IP の URL を拒否する', () => {
            const url = 'https://127.0.0.1/image.jpg?profile=true';
            const result = ProfileUrlUtils.ensureProfileMarker(url);
            expect(result).toBe('');
        });
    });

    describe('normalizeProfilePictureUrl', () => {
        it('fragment を落として https の public URL を正規化する', () => {
            const result = normalizeProfilePictureUrl('https://example.com/avatar.png#profile');
            expect(result).toBe('https://example.com/avatar.png');
        });

        it('credential 付き URL を拒否する', () => {
            const result = normalizeProfilePictureUrl('https://user:pass@example.com/avatar.png');
            expect(result).toBeNull();
        });

        it('same-origin localhost の http URL は例外許可する', () => {
            const result = normalizeProfilePictureUrl('http://localhost:4173/avatar.png', {
                currentOrigin: 'http://localhost:4173'
            });
            expect(result).toBe('http://localhost:4173/avatar.png');
        });
    });

    describe('getProfilePictureCacheKeyUrl', () => {
        it('query と fragment を除いた cache key を返す', () => {
            const result = getProfilePictureCacheKeyUrl('https://example.com/avatar.png?profile=true&cb=123#frag');
            expect(result).toBe('https://example.com/avatar.png');
        });
    });
});

describe('ProfileDataFactory', () => {
    let factory: ProfileDataFactory;

    beforeEach(() => {
        factory = new ProfileDataFactory({
            navigator: { onLine: true } as Navigator
        });
    });

    it('基本的なプロフィールデータを作成する', () => {
        const content = { name: 'Test User', picture: 'https://example.com/pic.jpg' };
        const pubkeyHex = '1234567890abcdef';
        const profileRelays = ['wss://relay1.example.com'];
        const writeRelays = ['wss://relay2.example.com', 'wss://relay3.example.com'];

        const result = factory.createProfileData(content, pubkeyHex, { profileRelays, writeRelays });

        expect(result.name).toBe('Test User');
        expect(result.picture).toBe('https://example.com/pic.jpg?profile=true');
        expect(result.npub).toMatch(/npub1/); // toNpubの結果を想定
        expect(result.profileRelays).toEqual(profileRelays);
    });

    it('空のcontentでデフォルトプロフィールを作成する', () => {
        const result = factory.createProfileData({}, 'pubkey123');

        expect(result.name).toBe('');
        expect(result.picture).toBe('');
        expect(result.npub).toBeTruthy();
        expect(result.profileRelays).toBeUndefined();
    });

    it('forceRemoteがtrueの場合、キャッシュバスターを追加する', () => {
        const content = { picture: 'https://example.com/pic.jpg' };

        const result = factory.createProfileData(content, 'pubkey123', { forceRemote: true });

        expect(result.picture).toMatch(/https:\/\/example\.com\/pic\.jpg\?cb=\d+&profile=true/);
    });

    it('ポリシー外の画像URLは保存しない', () => {
        const content = { picture: 'http://example.com/pic.jpg' };

        const result = factory.createProfileData(content, 'pubkey123');

        expect(result.picture).toBe('');
    });
});

describe('ProfileStorage', () => {
    let storage: ProfileStorage;
    let mockLocalStorage: MockStorage;
    let mockConsole: Console;
    let factory: ProfileDataFactory;
    let repository: DexieProfilesRepository;

    beforeEach(() => {
        mockLocalStorage = new MockStorage();
        mockConsole = {
            log: vi.fn(),
            error: vi.fn()
        } as any;
        factory = new ProfileDataFactory();
        repository = new DexieProfilesRepository(
            new EHagakiDB(`ProfileStorage-test-${Date.now()}-${Math.random()}`),
            () => 1234,
            () => mockLocalStorage,
        );
        storage = new ProfileStorage(mockConsole, factory, repository);
    });

    it('プロフィールを保存する', async () => {
        const profile = { name: 'Test', displayName: '', picture: '', npub: 'npub123', nprofile: '' };

        await storage.save('pubkey123', profile);

        await expect(storage.get('pubkey123')).resolves.toEqual(expect.objectContaining({
            name: 'Test',
            displayName: '',
            picture: '',
        }));
        expect(mockConsole.log).toHaveBeenCalled();
    });

    it('保存前にポリシー外の画像URLを除去する', async () => {
        const profile = {
            name: 'Test',
            displayName: '',
            picture: 'https://127.0.0.1/pic.jpg?profile=true',
            npub: 'npub123',
            nprofile: ''
        };

        await storage.save('pubkey123', profile);

        await expect(storage.get('pubkey123')).resolves.toEqual(expect.objectContaining({ picture: '' }));
    });

    it('プロフィールを取得する', async () => {
        const profile = { name: 'Test', picture: 'https://example.com/pic.jpg' };
        mockLocalStorage.setItem('nostr-profile-pubkey123', JSON.stringify(profile));

        const result = await storage.get('pubkey123');

        expect(result).toBeTruthy();
        expect(result?.name).toBe('Test');
        expect(result?.picture).toBe('https://example.com/pic.jpg?profile=true');
    });

    it('新形式の保存データでもprofileマーカーを補完する', async () => {
        const profile = {
            name: 'Stored User',
            picture: 'https://example.com/pic.jpg?cb=123',
            npub: 'npub123',
            nprofile: 'nprofile123'
        };
        mockLocalStorage.setItem('nostr-profile-pubkey123', JSON.stringify(profile));

        const result = await storage.get('pubkey123');

        expect(result?.picture).toBe('https://example.com/pic.jpg?cb=123&profile=true');
    });

    it('新形式でもポリシー外 URL を復元しない', async () => {
        const profile = {
            name: 'Stored User',
            picture: 'https://192.168.0.10/pic.jpg?profile=true',
            npub: 'npub123',
            nprofile: 'nprofile123'
        };
        mockLocalStorage.setItem('nostr-profile-pubkey123', JSON.stringify(profile));

        const result = await storage.get('pubkey123');

        expect(result?.picture).toBe('');
    });

    it('存在しないプロフィールに対してnullを返す', async () => {
        const result = await storage.get('nonexistent');
        expect(result).toBeNull();
    });

    it('プロフィールをクリアする', async () => {
        await storage.save('pubkey123', { name: 'Test', displayName: '', picture: '', npub: 'npub123', nprofile: '' });

        await storage.clear('pubkey123');

        await expect(storage.get('pubkey123')).resolves.toBeNull();
    });
});

describe('ProfileNetworkFetcher', () => {
    let fetcher: ProfileNetworkFetcher;
    let mockRxNostr: any;
    let mockSubscription: any;
    let mockConsole: Console;
    let mockSetTimeout: any;
    let mockClearTimeout: any;
    let factory: ProfileDataFactory;

    beforeEach(() => {
        mockSubscription = {
            unsubscribe: vi.fn()
        };

        mockRxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn().mockReturnValue(mockSubscription)
            })
        };

        mockConsole = {
            log: vi.fn(),
            error: vi.fn()
        } as any;

        // setTimeout/clearTimeoutのモック - タイムアウトのシミュレート用
        mockSetTimeout = vi.fn((fn: () => void, delay: number) => {
            // デフォルトタイムアウト時は実行しない（タイムアウトのシミュレート）
            if (delay > 1) {
                // 長時間のタイムアウトの場合は実行しない
                return 'timeout-id';
            } else {
                // 短時間の場合は即座に実行
                fn();
                return 'timeout-id';
            }
        });
        mockClearTimeout = vi.fn();
        factory = new ProfileDataFactory();

        fetcher = new ProfileNetworkFetcher(
            mockRxNostr,
            factory,
            mockSetTimeout,
            mockClearTimeout,
            mockConsole
        );
    });

    it('プロフィールイベントを正常に処理する', async () => {
        const profileContent = { name: 'Network User', picture: 'https://example.com/net.jpg' };

        // subscribeの動作をモック - 正常にイベントを受信
        mockRxNostr.use().subscribe.mockImplementation((observer: any) => {
            // 非同期でイベントを発火
            Promise.resolve().then(() => {
                observer.next({
                    event: {
                        kind: 0,
                        pubkey: 'testpubkey',
                        content: JSON.stringify(profileContent)
                    },
                    from: 'wss://relay1.example.com' // rx-nostr v3: リレーURL
                });
                // observer.completeが存在する場合のみ呼び出し
                if (typeof observer.complete === 'function') {
                    observer.complete();
                }
            });
            return mockSubscription;
        });

        const writeRelays = ['wss://relay2.example.com', 'wss://relay3.example.com'];
        const result = await fetcher.fetchFromNetwork('testpubkey', { writeRelays });

        expect(result).toBeTruthy();
        expect(result?.name).toBe('Network User');
        expect(result?.profileRelays).toEqual(['wss://relay1.example.com/']);
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('タイムアウト時にデフォルトプロフィールを返す', async () => {
        // Backward Strategy: イベントなしでcompleteを呼ぶ
        mockRxNostr.use().subscribe.mockImplementation((observer: any) => {
            queueMicrotask(() => {
                observer.complete();
            });
            return mockSubscription;
        });

        fetcher = new ProfileNetworkFetcher(
            mockRxNostr,
            factory,
            mockSetTimeout,
            mockClearTimeout,
            mockConsole
        );

        const result = await fetcher.fetchFromNetwork('testpubkey', { timeoutMs: 1 });

        expect(result).toBeTruthy();
        expect(result?.name).toBe(''); // デフォルトプロフィール
    });

    it('エラー発生時にnullを返す', async () => {
        // subscribeでエラーを発生させる
        mockRxNostr.use().subscribe.mockImplementation((observer: any) => {
            Promise.resolve().then(() => {
                observer.error(new Error('Network error'));
            });
            return mockSubscription;
        });

        const result = await fetcher.fetchFromNetwork('testpubkey');

        // ProfileNetworkFetcherの実装を確認：エラー時はnullを返す
        expect(result).toBeNull();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
        expect(mockConsole.error).toHaveBeenCalledWith('プロフィール取得エラー:', expect.any(Error));
    });
});

describe('ProfileManager統合テスト', () => {
    let manager: ProfileManager;
    let mockRxNostr: any;
    let mockDeps: ProfileManagerDeps;
    let mockStorage: MockStorage;
    let mockSetTimeout: any;
    let mockClearTimeout: any;

    beforeEach(() => {
        mockStorage = new MockStorage();
        mockRxNostr = createMockRxNostr();

        // setTimeout/clearTimeoutのモック
        mockSetTimeout = vi.fn((fn: () => void) => {
            // タイムアウトをシミュレート
            setTimeout(fn, 0);
            return 'timeout-id';
        });
        mockClearTimeout = vi.fn();

        mockDeps = {
            localStorage: mockStorage,
            navigator: { onLine: true } as Navigator,
            setTimeoutFn: mockSetTimeout,
            clearTimeoutFn: mockClearTimeout,
            console: {
                log: vi.fn(),
                error: vi.fn()
            } as any
        };

        manager = new ProfileManager(mockRxNostr, mockDeps);
    });

    it('キャッシュからプロフィールを取得する', async () => {
        const cachedProfile = { name: 'Cached User', picture: '', npub: 'npub123' };
        mockStorage.setItem('nostr-profile-testpubkey', JSON.stringify(cachedProfile));

        const result = await manager.fetchProfileData('testpubkey');

        expect(result).toBeTruthy();
        expect(result?.name).toBe('Cached User');
        // ネットワークリクエストは発生しない
        expect(mockRxNostr.use).not.toHaveBeenCalled();
    });

    it('forceRemoteでキャッシュを無視する', async () => {
        const cachedProfile = { name: 'Cached User', picture: '' };
        mockStorage.setItem('nostr-profile-testpubkey', JSON.stringify(cachedProfile));

        // mockSubscriptionを定義
        const mockSubscription = {
            unsubscribe: vi.fn()
        };

        // Backward Strategy: イベントなしでcompleteを呼ぶ
        mockRxNostr.use().subscribe.mockImplementation((observer: any) => {
            queueMicrotask(() => {
                observer.complete();
            });
            return mockSubscription;
        });

        mockDeps = {
            localStorage: mockStorage,
            navigator: { onLine: true } as Navigator,
            setTimeoutFn: mockSetTimeout,
            clearTimeoutFn: mockClearTimeout,
            console: {
                log: vi.fn(),
                error: vi.fn()
            } as any
        };

        manager = new ProfileManager(mockRxNostr, mockDeps);

        const result = await manager.fetchProfileData('testpubkey', { forceRemote: true });

        // ネットワークリクエストが発生することを確認
        expect(mockRxNostr.use).toHaveBeenCalled();
        expect(result).toBeTruthy();
        expect(result?.name).toBe(''); // デフォルトプロフィール
    });

    it('内部コンポーネントへのアクセスが可能', () => {
        expect(manager.getStorage()).toBeInstanceOf(ProfileStorage);
        expect(manager.getNetworkFetcher()).toBeInstanceOf(ProfileNetworkFetcher);
        expect(manager.getProfileDataFactory()).toBeInstanceOf(ProfileDataFactory);
    });
});
