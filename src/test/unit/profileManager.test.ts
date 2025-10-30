import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    ProfileManager,
    ProfileStorage,
    ProfileNetworkFetcher,
    ProfileDataFactory,
    ProfileUrlUtils
} from '../../lib/profileManager';
import type { ProfileManagerDeps } from '../../lib/types';

// RxNostrのモック
const createMockRxNostr = () => ({
    use: vi.fn().mockReturnValue({
        subscribe: vi.fn()
    })
});

// StorageのモックImplementation
class MockStorage implements Storage {
    private store: Record<string, string> = {};

    get length() { return Object.keys(this.store).length; }

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    clear(): void {
        this.store = {};
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);
        return keys[index] || null;
    }
}

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
            expect(ProfileUrlUtils.addCacheBuster(invalidUrl)).toBe(invalidUrl);
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

        const result = factory.createProfileData(content, pubkeyHex);

        expect(result.name).toBe('Test User');
        expect(result.picture).toBe('https://example.com/pic.jpg?profile=true');
        expect(result.npub).toMatch(/npub1/); // toNpubの結果を想定
    });

    it('空のcontentでデフォルトプロフィールを作成する', () => {
        const result = factory.createProfileData({}, 'pubkey123');

        expect(result.name).toBe('');
        expect(result.picture).toBe('');
        expect(result.npub).toBeTruthy();
    });

    it('forceRemoteがtrueの場合、キャッシュバスターを追加する', () => {
        const content = { picture: 'https://example.com/pic.jpg' };

        const result = factory.createProfileData(content, 'pubkey123', true);

        expect(result.picture).toMatch(/https:\/\/example\.com\/pic\.jpg\?cb=\d+&profile=true/);
    });
});

describe('ProfileStorage', () => {
    let storage: ProfileStorage;
    let mockLocalStorage: MockStorage;
    let mockConsole: Console;
    let factory: ProfileDataFactory;

    beforeEach(() => {
        mockLocalStorage = new MockStorage();
        mockConsole = {
            log: vi.fn(),
            error: vi.fn()
        } as any;
        factory = new ProfileDataFactory();
        storage = new ProfileStorage(mockLocalStorage, mockConsole, factory);
    });

    it('プロフィールを保存する', () => {
        const profile = { name: 'Test', picture: '', npub: 'npub123' };

        storage.save('pubkey123', profile);

        expect(mockLocalStorage.getItem('nostr-profile-pubkey123')).toBeTruthy();
        expect(mockConsole.log).toHaveBeenCalled();
    });

    it('プロフィールを取得する', () => {
        const profile = { name: 'Test', picture: 'https://example.com/pic.jpg' };
        mockLocalStorage.setItem('nostr-profile-pubkey123', JSON.stringify(profile));

        const result = storage.get('pubkey123');

        expect(result).toBeTruthy();
        expect(result?.name).toBe('Test');
        expect(result?.picture).toBe('https://example.com/pic.jpg?profile=true');
    });

    it('存在しないプロフィールに対してnullを返す', () => {
        const result = storage.get('nonexistent');
        expect(result).toBeNull();
    });

    it('プロフィールをクリアする', () => {
        mockLocalStorage.setItem('nostr-profile-pubkey123', 'data');

        storage.clear('pubkey123');

        expect(mockLocalStorage.getItem('nostr-profile-pubkey123')).toBeNull();
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
                    }
                });
                // observer.completeが存在する場合のみ呼び出し
                if (typeof observer.complete === 'function') {
                    observer.complete();
                }
            });
            return mockSubscription;
        });

        const result = await fetcher.fetchFromNetwork('testpubkey');

        expect(result).toBeTruthy();
        expect(result?.name).toBe('Network User');
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('タイムアウト時にデフォルトプロフィールを返す', async () => {
        // setTimeoutをすぐに実行してタイムアウトをシミュレート
        mockSetTimeout = vi.fn((fn: () => void) => {
            // すぐにタイムアウトコールバックを実行
            queueMicrotask(fn);
            return 'timeout-id';
        });

        fetcher = new ProfileNetworkFetcher(
            mockRxNostr,
            factory,
            mockSetTimeout,
            mockClearTimeout,
            mockConsole
        );

        // subscribeが何も返さないようにモック
        mockRxNostr.use().subscribe.mockReturnValue(mockSubscription);

        const result = await fetcher.fetchFromNetwork('testpubkey', { timeoutMs: 1 });

        expect(result).toBeTruthy();
        expect(result?.name).toBe(''); // デフォルトプロフィール
        expect(mockClearTimeout).toHaveBeenCalledWith('timeout-id');
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

        // setTimeout/clearTimeoutのモック - タイムアウトを即座に実行
        mockSetTimeout = vi.fn((fn: () => void) => {
            queueMicrotask(fn);
            return 'timeout-id';
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

        // RxNostrのsubscribeもモック
        mockRxNostr.use.mockReturnValue({
            subscribe: vi.fn().mockImplementation((observer: any) => {
                // 何もイベントを発行せず、タイムアウト待ちにする
                return mockSubscription;
            })
        });

        const result = await manager.fetchProfileData('testpubkey', { forceRemote: true });

        // ネットワークリクエストが発生することを確認
        expect(mockRxNostr.use).toHaveBeenCalled();
        expect(result).toBeTruthy();
        expect(result?.name).toBe(''); // デフォルトプロフィール
        expect(mockClearTimeout).toHaveBeenCalledWith('timeout-id');
    });

    it('内部コンポーネントへのアクセスが可能', () => {
        expect(manager.getStorage()).toBeInstanceOf(ProfileStorage);
        expect(manager.getNetworkFetcher()).toBeInstanceOf(ProfileNetworkFetcher);
        expect(manager.getProfileDataFactory()).toBeInstanceOf(ProfileDataFactory);
    });
});
