import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    RelayManager,
    RelayStorage,
    RelayNetworkFetcher,
    RelayConfigParser
} from '../../lib/relayManager';
import type { RelayConfig, RelayManagerDeps } from '../../lib/types';
import type { RxNostr } from 'rx-nostr';
import { MockStorage, createMockRxNostr } from '../helpers';

describe('RelayConfigParser', () => {
    describe('parseKind10002Tags', () => {
        it('基本的なリレータグを正しくパースする', () => {
            const tags = [
                ['r', 'wss://relay1.example.com'],
                ['r', 'wss://relay2.example.com', 'read'],
                ['r', 'wss://relay3.example.com', 'write']
            ];

            const result = RelayConfigParser.parseKind10002Tags(tags);

            expect(result).toEqual({
                'wss://relay1.example.com': { read: true, write: true },
                'wss://relay2.example.com': { read: true, write: false },
                'wss://relay3.example.com': { read: false, write: true }
            });
        });

        it('複数の読み書き指定があるタグを処理する', () => {
            const tags = [
                ['r', 'wss://relay.example.com', 'read', 'write']
            ];

            const result = RelayConfigParser.parseKind10002Tags(tags);

            expect(result).toEqual({
                'wss://relay.example.com': { read: true, write: true }
            });
        });

        it('無効なタグを無視する', () => {
            const tags = [
                ['r'], // URLなし
                ['r', null], // null URL
                ['r', 123], // 数値URL
                ['r', 'wss://valid.example.com'],
                ['other', 'wss://ignored.example.com']
            ];

            const result = RelayConfigParser.parseKind10002Tags(tags);

            expect(result).toEqual({
                'wss://valid.example.com': { read: true, write: true }
            });
        });

        it('空の配列で空のオブジェクトを返す', () => {
            const result = RelayConfigParser.parseKind10002Tags([]);
            expect(result).toEqual({});
        });
    });

    describe('parseKind3Content', () => {
        it('有効なJSONをパースする', () => {
            const content = JSON.stringify({
                'wss://relay1.example.com': { read: true, write: true },
                'wss://relay2.example.com': { read: false, write: true }
            });

            const result = RelayConfigParser.parseKind3Content(content);

            expect(result).toEqual({
                'wss://relay1.example.com': { read: true, write: true },
                'wss://relay2.example.com': { read: false, write: true }
            });
        });

        it('配列の場合はnullを返す', () => {
            const content = JSON.stringify(['wss://relay.example.com']);
            const result = RelayConfigParser.parseKind3Content(content);
            expect(result).toBeNull();
        });

        it('無効なJSONでnullを返す', () => {
            const result = RelayConfigParser.parseKind3Content('invalid json');
            expect(result).toBeNull();
        });

        it('nullやundefinedでnullを返す', () => {
            expect(RelayConfigParser.parseKind3Content('null')).toBeNull();
            expect(RelayConfigParser.parseKind3Content('undefined')).toBeNull();
        });
    });

    describe('isValidRelayConfig', () => {
        it('有効な文字列配列を受け入れる', () => {
            const config = ['wss://relay1.example.com', 'wss://relay2.example.com'];
            expect(RelayConfigParser.isValidRelayConfig(config)).toBe(true);
        });

        it('有効なオブジェクト形式を受け入れる', () => {
            const config = {
                'wss://relay1.example.com': { read: true, write: true },
                'wss://relay2.example.com': { read: false, write: true }
            };
            expect(RelayConfigParser.isValidRelayConfig(config)).toBe(true);
        });

        it('無効なオブジェクトを拒否する', () => {
            const config = {
                'wss://relay.example.com': { invalid: true }
            };
            expect(RelayConfigParser.isValidRelayConfig(config)).toBe(false);
        });

        it('nullやundefinedを拒否する', () => {
            expect(RelayConfigParser.isValidRelayConfig(null)).toBe(false);
            expect(RelayConfigParser.isValidRelayConfig(undefined)).toBe(false);
        });

        it('文字列以外を含む配列を拒否する', () => {
            const config = ['wss://valid.example.com', 123, null];
            expect(RelayConfigParser.isValidRelayConfig(config)).toBe(false);
        });
    });
});

describe('RelayStorage', () => {
    let storage: RelayStorage;
    let mockLocalStorage: MockStorage;
    let mockConsole: Console;
    let mockRelayListUpdatedStore: RelayManagerDeps['relayListUpdatedStore'];

    beforeEach(() => {
        mockLocalStorage = new MockStorage();
        mockConsole = {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn()
        } as any;
        mockRelayListUpdatedStore = {
            value: 0,
            set: vi.fn()
        };
        storage = new RelayStorage(mockLocalStorage, mockConsole, mockRelayListUpdatedStore);
    });

    describe('save', () => {
        it('有効なリレー設定を保存する', () => {
            const config: RelayConfig = ['wss://relay1.example.com', 'wss://relay2.example.com'];

            storage.save('pubkey123', config);

            expect(mockLocalStorage.getItem('nostr-relays-pubkey123')).toBeTruthy();
            expect(mockConsole.log).toHaveBeenCalledWith(
                'リレーリストをローカルストレージに保存:',
                'pubkey123'
            );
            expect(mockRelayListUpdatedStore?.set).toHaveBeenCalledWith(1);
        });

        it('nullを渡すとデータを削除する', () => {
            mockLocalStorage.setItem('nostr-relays-pubkey123', 'existing-data');

            storage.save('pubkey123', null);

            expect(mockLocalStorage.getItem('nostr-relays-pubkey123')).toBeNull();
            // 文字列結合形式に修正
            expect(mockConsole.log).toHaveBeenCalledWith(
                'リレーリストを削除: pubkey123'
            );
        });

        it('無効なリレー設定はスキップする', () => {
            const invalidConfig = { invalid: 'config' } as any;

            storage.save('pubkey123', invalidConfig);

            expect(mockLocalStorage.getItem('nostr-relays-pubkey123')).toBeNull();
            expect(mockConsole.warn).toHaveBeenCalledWith(
                '無効なリレー設定のため保存をスキップ:',
                invalidConfig
            );
        });
    });

    describe('get', () => {
        it('有効なリレー設定を取得する', () => {
            const config: RelayConfig = ['wss://relay1.example.com'];
            mockLocalStorage.setItem('nostr-relays-pubkey123', JSON.stringify(config));

            const result = storage.get('pubkey123');

            expect(result).toEqual(config);
        });

        it('存在しないキーに対してnullを返す', () => {
            const result = storage.get('nonexistent');
            expect(result).toBeNull();
        });

        it('無効なJSONに対してnullを返しエラーをログ出力する', () => {
            mockLocalStorage.setItem('nostr-relays-pubkey123', 'invalid json');

            const result = storage.get('pubkey123');

            expect(result).toBeNull();
            expect(mockConsole.error).toHaveBeenCalledWith(
                'リレーリストの取得に失敗:',
                expect.any(Error)
            );
        });

        it('無効な設定形式に対してnullを返す', () => {
            const invalidConfig = { invalid: 'format' };
            mockLocalStorage.setItem('nostr-relays-pubkey123', JSON.stringify(invalidConfig));

            const result = storage.get('pubkey123');

            expect(result).toBeNull();
        });
    });

    describe('clear', () => {
        it('指定されたpubkeyのデータをクリアする', () => {
            mockLocalStorage.setItem('nostr-relays-pubkey123', 'data');

            storage.clear('pubkey123');

            expect(mockLocalStorage.getItem('nostr-relays-pubkey123')).toBeNull();
        });
    });
});

describe('RelayNetworkFetcher', () => {
    let fetcher: RelayNetworkFetcher;
    let mockRxNostr: RxNostr;
    let mockConsole: Console;
    let mockSetTimeout: any;
    let mockClearTimeout: any;
    let mockSubscription: any;
    let subscribeFn: any;

    beforeEach(() => {
        mockSubscription = {
            unsubscribe: vi.fn()
        };

        subscribeFn = vi.fn();
        mockRxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: subscribeFn
            }),
            setDefaultRelays: vi.fn()
        } as any;

        mockConsole = {
            log: vi.fn(),
            error: vi.fn()
        } as any;

        mockSetTimeout = vi.fn();
        mockClearTimeout = vi.fn();

        fetcher = new RelayNetworkFetcher(
            mockRxNostr,
            mockConsole,
            mockSetTimeout,
            mockClearTimeout
        );
    });

    describe('fetchKind10002', () => {
        it('Kind 10002イベントを正常に処理する', async () => {
            const relayTags = [
                ['r', 'wss://relay1.example.com'],
                ['r', 'wss://relay2.example.com', 'write']
            ];

            subscribeFn.mockImplementation((observer: any) => {
                Promise.resolve().then(() => {
                    observer.next({
                        event: {
                            kind: 10002,
                            pubkey: 'testpubkey',
                            tags: relayTags
                        }
                    });
                });
                return mockSubscription;
            });

            const result = await fetcher.fetchKind10002('testpubkey', ['wss://bootstrap.example.com']);

            expect(result.success).toBe(true);
            expect(result.source).toBe('kind10002');
            expect(result.relayConfig).toEqual({
                'wss://relay1.example.com': { read: true, write: true },
                'wss://relay2.example.com': { read: false, write: true }
            });
            expect(mockSubscription.unsubscribe).toHaveBeenCalled();
        });

        it('タイムアウト時に適切に処理する', async () => {
            mockSetTimeout.mockImplementation((fn: () => void) => {
                queueMicrotask(fn);
                return 'timeout-id';
            });

            subscribeFn.mockImplementation((_observer: any) => mockSubscription);

            const result = await fetcher.fetchKind10002('testpubkey', ['wss://bootstrap.example.com'], 1);

            expect(result.success).toBe(false);
            expect(result.error).toBe('timeout');
            expect(mockClearTimeout).toHaveBeenCalledWith('timeout-id');
        });

        it('エラー発生時にfalseを返す', async () => {
            subscribeFn.mockImplementation((observer: any) => {
                Promise.resolve().then(() => {
                    observer.error(new Error('Network error'));
                });
                return mockSubscription;
            });

            const result = await fetcher.fetchKind10002('testpubkey', ['wss://bootstrap.example.com']);

            expect(result.success).toBe(false);
            expect(result.error).toBe('network_error');
            expect(mockConsole.error).toHaveBeenCalledWith(
                'Kind 10002取得エラー:',
                expect.any(Error)
            );
        });
    });

    describe('fetchKind3', () => {
        it('Kind 3イベントを正常に処理する', async () => {
            const relayConfig = {
                'wss://relay1.example.com': { read: true, write: true },
                'wss://relay2.example.com': { read: false, write: true }
            };

            subscribeFn.mockImplementation((observer: any) => {
                Promise.resolve().then(() => {
                    observer.next({
                        event: {
                            kind: 3,
                            pubkey: 'testpubkey',
                            content: JSON.stringify(relayConfig)
                        }
                    });
                });
                return mockSubscription;
            });

            const result = await fetcher.fetchKind3('testpubkey', ['wss://bootstrap.example.com']);

            expect(result.success).toBe(true);
            expect(result.source).toBe('kind3');
            expect(result.relayConfig).toEqual(relayConfig);
        });

        it('無効なJSONの場合は処理を続行する', async () => {
            subscribeFn.mockImplementation((observer: any) => {
                Promise.resolve().then(() => {
                    observer.next({
                        event: {
                            kind: 3,
                            pubkey: 'testpubkey',
                            content: 'invalid json'
                        }
                    });
                });
                return mockSubscription;
            });

            mockSetTimeout.mockImplementation((fn: () => void) => {
                queueMicrotask(fn);
                return 'timeout-id';
            });

            const result = await fetcher.fetchKind3('testpubkey', ['wss://bootstrap.example.com'], 1);

            expect(result.success).toBe(false);
            expect(result.error).toBe('timeout');
        });
    });
});

describe('RelayManager統合テスト', () => {
    let manager: RelayManager;
    let mockRxNostr: RxNostr;
    let mockDeps: RelayManagerDeps;
    let mockStorage: MockStorage;
    let mockSetTimeout: any;
    let mockClearTimeout: any;
    let subscribeFn: any;

    beforeEach(() => {
        mockStorage = new MockStorage();
        subscribeFn = vi.fn();
        mockRxNostr = createMockRxNostr();
        mockRxNostr.use = vi.fn().mockReturnValue({
            subscribe: subscribeFn
        });

        mockSetTimeout = vi.fn((fn: () => void) => {
            setTimeout(fn, 0);
            return 'timeout-id';
        });
        mockClearTimeout = vi.fn();

        mockDeps = {
            localStorage: mockStorage,
            console: {
                log: vi.fn(),
                error: vi.fn(),
                warn: vi.fn()
            } as any,
            setTimeoutFn: mockSetTimeout,
            clearTimeoutFn: mockClearTimeout,
            relayListUpdatedStore: {
                value: 0,
                set: vi.fn()
            }
        };

        manager = new RelayManager(mockRxNostr, mockDeps);
    });

    describe('ローカルストレージ操作', () => {
        it('リレー設定を保存・取得する', () => {
            const config: RelayConfig = ['wss://relay1.example.com', 'wss://relay2.example.com'];

            manager.saveToLocalStorage('testpubkey', config);
            const result = manager.getFromLocalStorage('testpubkey');

            expect(result).toEqual(config);
        });

        it('存在しないキーに対してnullを返す', () => {
            const result = manager.getFromLocalStorage('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('Bootstrap relays設定', () => {
        it('Bootstrap relaysを正常に設定する', () => {
            manager.setBootstrapRelays();

            expect(mockRxNostr.use).toHaveBeenCalled();
            expect(mockDeps.console?.log).not.toHaveBeenCalledWith(
                expect.stringContaining('Bootstrap relays設定エラー')
            );
        });

        it('エラー時に適切にログ出力する', () => {
            (mockRxNostr.use as any) = vi.fn(() => { throw new Error('Bootstrap error'); });

            // errorはconsole.errorでなくグローバルconsole.errorに出力されるためspyを仕込む
            const globalConsoleError = vi.spyOn(global.console, 'error');

            manager.setBootstrapRelays();

            expect(globalConsoleError).toHaveBeenCalledWith(
                expect.stringContaining('Bootstrap relays設定エラー:'),
                expect.any(Error)
            );

            globalConsoleError.mockRestore();
        });
    });

    describe('ローカルストレージからのリレー使用', () => {
        it('保存されたリレーを使用してtrueを返す', () => {
            const config: RelayConfig = ['wss://relay1.example.com'];
            mockStorage.setItem('nostr-relays-testpubkey', JSON.stringify(config));

            const result = manager.useRelaysFromLocalStorageIfExists('testpubkey');

            expect(result).toBe(true);
            expect(mockRxNostr.setDefaultRelays).toHaveBeenCalledWith(config);
        });

        it('保存されたリレーがない場合はfalseを返す', () => {
            const result = manager.useRelaysFromLocalStorageIfExists('nonexistent');

            expect(result).toBe(false);
            expect(mockRxNostr.setDefaultRelays).not.toHaveBeenCalled();
        });

        it('リレー設定エラー時は破損データを削除してfalseを返す', () => {
            const config: RelayConfig = ['wss://relay1.example.com'];
            mockStorage.setItem('nostr-relays-testpubkey', JSON.stringify(config));

            (mockRxNostr.setDefaultRelays as any) = vi.fn(() => { throw new Error('Invalid relay config'); });

            // errorはconsole.errorでなくグローバルconsole.errorに出力されるためspyを仕込む
            const globalConsoleError = vi.spyOn(global.console, 'error');

            const result = manager.useRelaysFromLocalStorageIfExists('testpubkey');

            expect(result).toBe(false);
            expect(mockStorage.getItem('nostr-relays-testpubkey')).toBeNull(); // 破損データ削除
            expect(globalConsoleError).toHaveBeenCalledWith(
                expect.stringContaining('ローカルストレージのリレー設定エラー:'),
                expect.any(Error)
            );

            globalConsoleError.mockRestore();
        });
    });

    describe('ユーザーリレー取得', () => {
        it('ローカルストレージから復元する（forceRemote: false）', async () => {
            const config: RelayConfig = ['wss://cached-relay.example.com'];
            mockStorage.setItem('nostr-relays-testpubkey', JSON.stringify(config));

            const result = await manager.fetchUserRelays('testpubkey', { forceRemote: false });

            expect(result.success).toBe(true);
            expect(result.source).toBe('localStorage');
            expect(result.relayConfig).toEqual(config);
            expect(mockRxNostr.setDefaultRelays).toHaveBeenCalledWith(config);
        });

        it('forceRemoteでリモート取得を強制する', async () => {
            const config: RelayConfig = ['wss://cached-relay.example.com'];
            mockStorage.setItem('nostr-relays-testpubkey', JSON.stringify(config));

            // Kind 10002でのモック成功レスポンス
            const mockSubscription = { unsubscribe: vi.fn() };
            subscribeFn.mockImplementation((observer: any) => {
                Promise.resolve().then(() => {
                    observer.next({
                        event: {
                            kind: 10002,
                            pubkey: 'testpubkey',
                            tags: [['r', 'wss://remote-relay.example.com']]
                        }
                    });
                });
                return mockSubscription;
            });

            const result = await manager.fetchUserRelays('testpubkey', { forceRemote: true });

            expect(result.success).toBe(true);
            expect(result.source).toBe('kind10002');
            expect(result.relayConfig).toEqual({
                'wss://remote-relay.example.com': { read: true, write: true }
            });
            expect(mockRxNostr.use).toHaveBeenCalled(); // リモート取得が実行された
        });

        it('Kind 10002とKind 3の両方が失敗した場合フォールバックを使用', async () => {
            mockSetTimeout = vi.fn((fn: () => void) => {
                queueMicrotask(fn);
                return 'timeout-id';
            });

            subscribeFn.mockImplementation((_observer: any) => ({ unsubscribe: vi.fn() }));

            manager = new RelayManager(mockRxNostr, {
                ...mockDeps,
                setTimeoutFn: mockSetTimeout
            });

            // グローバルconsole.logをspyして検証
            const globalConsoleLog = vi.spyOn(global.console, 'log');

            const result = await manager.fetchUserRelays('testpubkey', { timeoutMs: 1 });

            expect(result.success).toBe(false); // 取得失敗
            expect(result.source).toBe('fallback');
            expect(result.relayConfig).toEqual([
                "wss://relay.nostr.band/",
                "wss://nos.lol/",
                "wss://relay.damus.io/",
                "wss://relay-jp.nostr.wirednet.jp/",
                "wss://yabu.me/",
                "wss://r.kojira.io/",
                "wss://nrelay-jp.c-stellar.net/",
            ]);
            // フォールバックリレーが設定されたことを確認
            expect(globalConsoleLog.mock.calls.some(
                (call) => call[0] && typeof call[0] === 'string' && call[0].includes('リモート取得失敗、フォールバックリレーを使用')
            )).toBe(true);

            globalConsoleLog.mockRestore();
        });
    });

    describe('内部コンポーネントへのアクセス', () => {
        it('内部コンポーネントを取得できる', () => {
            expect(manager.getStorage()).toBeInstanceOf(RelayStorage);
            expect(manager.getNetworkFetcher()).toBeInstanceOf(RelayNetworkFetcher);
        });
    });
});
