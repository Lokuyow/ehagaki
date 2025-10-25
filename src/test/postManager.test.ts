import { vi } from 'vitest';
// 仮想モジュールのモック（Vite環境で必須） ※必ずimportより前に記述
vi.mock("virtual:pwa-register/svelte", () => {
    return {
        __esModule: true,
        useRegisterSW: () => ({
            needRefresh: false,
            updateServiceWorker: vi.fn(),
            offlineReady: false
        })
    };
});

// 追加: appStore.svelte.tsの完全モック
vi.mock("../stores/appStore.svelte.ts", () => {
    return {
        __esModule: true,
        authState: {
            value: {
                isAuthenticated: true,
                type: "nsec",
                pubkey: "testpubkey123"
            }
        }
    };
});

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import {
    PostManager,
    PostValidator,
    PostEventBuilder,
    PostEventSender
} from '../lib/postManager';
import type {
    PostManagerDeps,
    AuthState,
    HashtagStore,
    KeyManagerInterface
} from '../lib/types';
import { updateHashtagData } from '../lib/tags/hashtagManager';
import { hashtagDataStore } from '../stores/tagsStore.svelte';
import type { RxNostr } from 'rx-nostr';

// RxNostrのモック
const createMockRxNostr = (): RxNostr => ({
    send: vi.fn(),
    use: vi.fn(),
    setDefaultRelays: vi.fn(),
    // 他の必要なメソッドをモック
} as any);

// モッククラス定義
class MockKeyManager implements KeyManagerInterface {
    constructor(
        private storedKey: string | null = null,
        private storageKey: string | null = null,
        private windowNostrAvailable = false
    ) { }

    getFromStore(): string | null {
        return this.storedKey;
    }

    loadFromStorage(): string | null {
        return this.storageKey;
    }

    isWindowNostrAvailable(): boolean {
        return this.windowNostrAvailable;
    }
}

// モックObservable作成ヘルパー
function createMockObservable(nextData?: any, shouldError = false, delay = 0) {
    return {
        subscribe: (observer: any) => {
            const subscription = { unsubscribe: vi.fn() };

            if (shouldError) {
                // setTimeoutの代わりにPromise.resolve().thenを使用
                Promise.resolve().then(() => {
                    observer.error(new Error('Network error'));
                });
            } else if (nextData) {
                // setTimeoutの代わりにPromise.resolve().thenを使用
                Promise.resolve().then(() => {
                    observer.next(nextData);
                    observer.complete?.();
                });
            } else {
                // 何もしない（タイムアウトテスト用）
            }

            return subscription;
        }
    };
}

class MockClassList {
    private classes = new Set<string>();

    add(...tokens: string[]) {
        tokens.forEach((token) => this.classes.add(token));
    }

    remove(...tokens: string[]) {
        tokens.forEach((token) => this.classes.delete(token));
    }

    contains(token: string): boolean {
        return this.classes.has(token);
    }
}

class MockParagraph {
    classList = new MockClassList();
    private attributes = new Map<string, string>();

    setAttribute(name: string, value: string) {
        this.attributes.set(name, value);
    }

    getAttribute(name: string) {
        return this.attributes.get(name) ?? null;
    }
}

class MockEditorDom {
    classList = new MockClassList();
    paragraphs: MockParagraph[];
    private placeholder: string | null;

    constructor({ paragraphCount = 2, placeholder = 'テキストを入力してください' }: { paragraphCount?: number; placeholder?: string | null } = {}) {
        this.paragraphs = Array.from({ length: paragraphCount }, () => new MockParagraph());
        this.placeholder = placeholder;
    }

    getAttribute(name: string) {
        if (name === 'data-placeholder') {
            return this.placeholder;
        }
        return null;
    }

    setAttribute(name: string, value: string) {
        if (name === 'data-placeholder') {
            this.placeholder = value;
        }
    }

    querySelectorAll(selector: string) {
        if (selector === 'p') {
            return this.paragraphs;
        }
        return [];
    }
}

function createMockEditor(options?: { paragraphCount?: number; placeholder?: string | null }) {
    const dom = new MockEditorDom(options);
    const run = vi.fn();
    const clearContent = vi.fn().mockReturnValue({ run });
    const chain = vi.fn().mockReturnValue({ clearContent });
    const editor = {
        chain,
        view: {
            dom,
        },
    } as any;

    return { editor, dom, run, clearContent, chain };
}

describe('PostValidator', () => {
    describe('validatePost', () => {
        it('有効な投稿を受け入れる', () => {
            const result = PostValidator.validatePost('Valid content', true, true);
            expect(result.valid).toBe(true);
        });

        it('空のコンテンツを拒否する', () => {
            const result = PostValidator.validatePost('', true, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('empty_content');
        });

        it('空白のみのコンテンツを拒否する', () => {
            const result = PostValidator.validatePost('   ', true, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('empty_content');
        });

        it('認証されていない場合を拒否する', () => {
            const result = PostValidator.validatePost('Valid content', false, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('login_required');
        });

        it('RxNostrが利用できない場合を拒否する', () => {
            const result = PostValidator.validatePost('Valid content', true, false);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('nostr_not_ready');
        });
    });
});

describe('PostManager editor state helpers', () => {
    let mockDeps: PostManagerDeps;

    beforeEach(() => {
        mockDeps = {
            extractContentWithImagesFn: vi.fn(),
            extractImageBlurhashMapFn: vi.fn(),
            resetEditorStateFn: vi.fn(),
            resetPostStatusFn: vi.fn(),
            console: {
                log: vi.fn(),
                error: vi.fn(),
            } as any,
        };
    });

    it('clearContentAfterSuccess clears editor without resetting post status', () => {
        const manager = new PostManager(undefined, mockDeps);
        const { editor, dom, run } = createMockEditor({ placeholder: 'Initial placeholder' });

        manager.clearContentAfterSuccess(editor);

        expect(run).toHaveBeenCalled();
        expect(dom.classList.contains('is-editor-empty')).toBe(true);
        expect(dom.paragraphs[0].classList.contains('is-editor-empty')).toBe(true);
        expect(dom.paragraphs[1].classList.contains('is-editor-empty')).toBe(false);
        expect(dom.paragraphs[0].getAttribute('data-placeholder')).toBe('Initial placeholder');
        expect(mockDeps.resetEditorStateFn).not.toHaveBeenCalled();
        expect(mockDeps.resetPostStatusFn).not.toHaveBeenCalled();
    });

    it('resetPostContent clears editor and resets state', () => {
        const manager = new PostManager(undefined, mockDeps);
        const { editor, dom, run } = createMockEditor({ placeholder: 'Initial placeholder' });

        manager.resetPostContent(editor);

        expect(run).toHaveBeenCalled();
        expect(dom.classList.contains('is-editor-empty')).toBe(true);
        expect(dom.paragraphs[0].classList.contains('is-editor-empty')).toBe(true);
        expect(dom.paragraphs[1].classList.contains('is-editor-empty')).toBe(false);
        expect(dom.paragraphs[0].getAttribute('data-placeholder')).toBe('Initial placeholder');
        expect(mockDeps.resetEditorStateFn).toHaveBeenCalledTimes(1);
        expect(mockDeps.resetPostStatusFn).toHaveBeenCalledTimes(1);
    });

    it('clearContentAfterSuccess assigns fallback placeholder when undefined', () => {
        const manager = new PostManager(undefined, mockDeps);
        const { editor, dom } = createMockEditor({ placeholder: null });

        manager.clearContentAfterSuccess(editor);

        expect(dom.paragraphs[0].getAttribute('data-placeholder')).toBe('テキストを入力してください');
    });
});

describe('PostEventBuilder', () => {
    describe('buildEvent', () => {
        it('基本的なイベントを構築する', async () => {
            const content = 'Test post';
            const hashtags = ['test', 'example'];
            const tags: string[][] = [];

            const event = await PostEventBuilder.buildEvent(content, hashtags, tags);

            expect(event.kind).toBe(1);
            expect(event.content).toBe(content);
            expect(event.tags).toEqual([['t', 'test'], ['t', 'example']]);
            expect(event.created_at).toBeTypeOf('number');
            expect(event.pubkey).toBeUndefined();
        });

        it('既存のtagsがある場合はそれを使用する', async () => {
            const content = 'Test post';
            const hashtags = ['test'];
            const existingTags: string[][] = [['t', 'existing'], ['t', 'tags']];

            const event = await PostEventBuilder.buildEvent(content, hashtags, existingTags);

            expect(event.tags).toEqual([['t', 'existing'], ['t', 'tags']]);
        });

        it('pubkeyが指定された場合は設定する', async () => {
            const content = 'Test post';
            const hashtags: string[] = [];
            const tags: string[][] = [];
            const pubkey = 'testpubkey123';

            const event = await PostEventBuilder.buildEvent(content, hashtags, tags, pubkey);

            expect(event.pubkey).toBe(pubkey);
        });

        it('クライアントタグを追加する', async () => {
            const content = 'Test post';
            const hashtags: string[] = [];
            const tags: string[][] = [];
            const getClientTagFn = vi.fn().mockReturnValue(['client', 'test-client']);

            const event = await PostEventBuilder.buildEvent(
                content, hashtags, tags, undefined, undefined, undefined, getClientTagFn
            );

            expect(getClientTagFn).toHaveBeenCalled();
            expect(event.tags).toContainEqual(['client', 'test-client']);
        });

        it('画像imetaタグを追加する', async () => {
            const content = 'Test post with image';
            const hashtags: string[] = [];
            const tags: string[][] = [];
            const imageImetaMap = {
                'https://example.com/image.jpg': {
                    m: 'image/jpeg',
                    blurhash: 'testblurhash'
                }
            };
            const createImetaTagFn = vi.fn().mockResolvedValue(['imeta', 'url https://example.com/image.jpg', 'm image/jpeg']);

            const event = await PostEventBuilder.buildEvent(
                content, hashtags, tags, undefined, imageImetaMap, createImetaTagFn
            );

            expect(createImetaTagFn).toHaveBeenCalledWith({
                url: 'https://example.com/image.jpg',
                m: 'image/jpeg',
                blurhash: 'testblurhash'
            });
            expect(event.tags).toContainEqual(['imeta', 'url https://example.com/image.jpg', 'm image/jpeg']);
        });
    });
});

describe('PostEventSender', () => {
    let mockRxNostr: RxNostr;
    let mockConsole: Console;
    let sender: PostEventSender;
    let mockSubscription: any;

    beforeEach(() => {
        mockSubscription = {
            unsubscribe: vi.fn()
        };

        mockRxNostr = {
            send: vi.fn()
        } as any;

        mockConsole = {
            log: vi.fn(),
            error: vi.fn()
        } as any;

        sender = new PostEventSender(mockRxNostr, mockConsole);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('成功した送信を処理する', async () => {
        const event = { kind: 1, content: 'test' };

        // 成功レスポンスのモック
        const mockObservable = {
            subscribe: vi.fn((observer) => {
                // 即座にnextを呼び出す
                process.nextTick(() => {
                    observer.next({
                        from: 'relay1',
                        ok: true,
                        done: true,
                        eventId: 'test-event-id',
                        type: 'ok',
                        message: ''
                    });
                });
                return { unsubscribe: vi.fn() };
            })
        };

        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        const result = await sender.sendEvent(event);

        expect(result.success).toBe(true);
        expect(mockRxNostr.send).toHaveBeenCalledWith(event, undefined);
    });

    it('署名者付きでイベントを送信する', async () => {
        const event = { kind: 1, content: 'test' };
        const signer = { sign: vi.fn() };

        // 成功レスポンスのモック
        const mockObservable = {
            subscribe: vi.fn((observer) => {
                process.nextTick(() => {
                    observer.next({
                        from: 'relay1',
                        ok: true,
                        done: true,
                        eventId: 'test-event-id',
                        type: 'ok',
                        message: ''
                    });
                });
                return { unsubscribe: vi.fn() };
            })
        };

        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        await sender.sendEvent(event, signer);

        expect(mockRxNostr.send).toHaveBeenCalledWith(event, { signer });
    });

    it('エラーを適切に処理する', async () => {
        const event = { kind: 1, content: 'test' };

        // エラーレスポンスのモック
        const mockObservable = {
            subscribe: vi.fn((observer) => {
                process.nextTick(() => {
                    observer.error(new Error('Network error'));
                });
                return { unsubscribe: vi.fn() };
            })
        };

        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        const result = await sender.sendEvent(event);

        expect(result.success).toBe(false);
        expect(result.error).toBe('post_error');
        expect(mockConsole.error).toHaveBeenCalledWith('送信エラー:', expect.any(Error));
    });

    it('タイムアウトを適切に処理する', async () => {
        const event = { kind: 1, content: 'test' };

        // 何も発火しないObservableをモック（タイムアウトシナリオ）
        const mockObservable = {
            subscribe: vi.fn().mockReturnValue(mockSubscription)
        };
        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        // タイマーを高速化してテスト
        vi.useFakeTimers();

        const resultPromise = sender.sendEvent(event);

        // 3秒経過させる
        vi.advanceTimersByTime(10000);

        const result = await resultPromise;

        expect(result.success).toBe(false);
        expect(result.error).toBe('post_error');

        vi.useRealTimers();
    });
});

describe('PostManager統合テスト', () => {
    let manager: PostManager;
    let mockRxNostr: RxNostr;
    let mockDeps: PostManagerDeps;
    let mockAuthState: AuthState;
    let mockHashtagStore: HashtagStore;
    let mockKeyManager: MockKeyManager;

    beforeEach(() => {
        mockRxNostr = createMockRxNostr();

        mockAuthState = {
            isAuthenticated: true,
            type: 'nsec',
            pubkey: 'testpubkey123',
            npub: '',
            nprofile: '',
            isValid: true,
            isInitialized: true
        };

        mockHashtagStore = {
            hashtags: ['test', 'example'],
            tags: []
        };

        mockKeyManager = new MockKeyManager('test-secret-key', 'test-storage-key', false);

        mockDeps = {
            authStateStore: { value: mockAuthState },
            hashtagStore: mockHashtagStore,
            keyManager: mockKeyManager,
            console: {
                log: vi.fn(),
                error: vi.fn()
            } as any,
            createImetaTagFn: vi.fn().mockResolvedValue(['imeta', 'test']),
            getClientTagFn: vi.fn().mockReturnValue(['client', 'test-client']),
            seckeySignerFn: vi.fn().mockImplementation((key: string) => ({
                sign: vi.fn().mockImplementation(async (event: any) => ({ ...event, sig: "mock-signature" }))
            }))
        };

        manager = new PostManager(mockRxNostr, mockDeps);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('秘密鍵認証で投稿を送信する', async () => {
        // 成功レスポンスのモック
        const mockObservable = {
            subscribe: vi.fn((observer) => {
                process.nextTick(() => {
                    observer.next({
                        from: 'relay1',
                        ok: true,
                        done: true,
                        eventId: 'test-event-id',
                        type: 'ok',
                        message: ''
                    });
                });
                return { unsubscribe: vi.fn() };
            })
        };

        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        const result = await manager.submitPost('Test post content');

        expect(result.success).toBe(true);
        expect(mockRxNostr.send).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: 1,
                content: 'Test post content',
                tags: expect.arrayContaining([
                    ['t', 'test'],
                    ['t', 'example'],
                    ['client', 'test-client']
                ])
            }),
            expect.objectContaining({
                signer: expect.any(Object)
            })
        );
    });

    it('nostr-login認証で投稿を送信する', async () => {
        // nostr-login認証に設定
        mockAuthState.type = 'nostr-login';
        mockKeyManager = new MockKeyManager(null, null, true);

        const mockWindow = {
            nostr: {
                signEvent: vi.fn().mockResolvedValue({
                    kind: 1,
                    content: 'Test post content',
                    pubkey: 'testpubkey123',
                    sig: 'mock-signature'
                })
            }
        };

        mockDeps.keyManager = mockKeyManager;
        mockDeps.window = mockWindow;

        manager = new PostManager(mockRxNostr, mockDeps);

        // 成功レスポンスのモック
        const mockObservable = {
            subscribe: vi.fn((observer) => {
                process.nextTick(() => {
                    observer.next({
                        from: 'relay1',
                        ok: true,
                        done: true,
                        eventId: 'test-event-id',
                        type: 'ok',
                        message: ''
                    });
                });
                return { unsubscribe: vi.fn() };
            })
        };

        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        const result = await manager.submitPost('Test post content');

        expect(result.success).toBe(true);
        expect(mockWindow.nostr.signEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: 1,
                content: 'Test post content',
                pubkey: 'testpubkey123'
            })
        );
        expect(mockRxNostr.send).toHaveBeenCalledWith(
            expect.objectContaining({
                sig: 'mock-signature'
            }),
            undefined
        );
    });

    it('nostr-loginでハッシュタグストアのProxyをstructuredClone可能な配列にする', async () => {
        hashtagDataStore.content = '';
        hashtagDataStore.hashtags = [];
        hashtagDataStore.tags = [];
        updateHashtagData('Post with #SnapshotTag');

        const nostrAuthState: AuthState = {
            ...mockAuthState,
            type: 'nostr-login'
        };

        const signEvent = vi.fn().mockImplementation(async (event: any) => {
            const cloneFn = globalThis.structuredClone ?? ((value: any) => JSON.parse(JSON.stringify(value)));
            const cloned = cloneFn(event);
            return { ...cloned, sig: 'mock-signature' };
        });

        const nostrDeps: PostManagerDeps = {
            authStateStore: { value: nostrAuthState },
            keyManager: new MockKeyManager(null, null, true),
            console: {
                log: vi.fn(),
                error: vi.fn(),
                warn: vi.fn()
            } as any,
            window: {
                nostr: {
                    signEvent
                }
            } as any,
            getClientTagFn: () => ['client', 'snapshot-tester']
        };

        const managerWithSnapshot = new PostManager(mockRxNostr, nostrDeps);

        const mockObservable = {
            subscribe: vi.fn((observer: any) => {
                process.nextTick(() => {
                    observer.next({
                        from: 'relay1',
                        ok: true,
                        done: true,
                        eventId: 'test-event-id',
                        type: 'ok',
                        message: ''
                    });
                });
                return { unsubscribe: vi.fn() };
            })
        };

        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        const result = await managerWithSnapshot.submitPost('Post with #SnapshotTag');

        expect(result.success).toBe(true);
        expect(signEvent).toHaveBeenCalledTimes(1);

        const eventArg = signEvent.mock.calls[0][0];
        const tTagFromEvent = (eventArg.tags as string[][]).find((tag) => tag[0] === 't');
        const tTagFromStore = hashtagDataStore.tags.find((tag) => tag[0] === 't');

        if (!tTagFromEvent || !tTagFromStore) {
            throw new Error('hashtags not found');
        }

        expect(tTagFromEvent).toEqual(['t', 'snapshottag']);
        expect(tTagFromStore).toEqual(['t', 'snapshottag']);
        expect(tTagFromEvent).not.toBe(tTagFromStore);

        hashtagDataStore.content = '';
        hashtagDataStore.hashtags = [];
        hashtagDataStore.tags = [];
    });

    it('画像付き投稿を処理する', async () => {
        const imageImetaMap = {
            'https://example.com/image.jpg': {
                m: 'image/jpeg',
                blurhash: 'testblurhash'
            }
        };

        // 成功レスポンスのモック
        const mockObservable = {
            subscribe: vi.fn((observer) => {
                process.nextTick(() => {
                    observer.next({
                        from: 'relay1',
                        ok: true,
                        done: true,
                        eventId: 'test-event-id',
                        type: 'ok',
                        message: ''
                    });
                });
                return { unsubscribe: vi.fn() };
            })
        };

        vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

        const result = await manager.submitPost('Post with image', imageImetaMap);

        expect(result.success).toBe(true);
        expect(mockDeps.createImetaTagFn).toHaveBeenCalledWith({
            url: 'https://example.com/image.jpg',
            m: 'image/jpeg',
            blurhash: 'testblurhash'
        });
    });

    it('認証エラーを処理する', async () => {
        mockAuthState.isAuthenticated = false;

        const result = await manager.submitPost('Test content');

        expect(result.success).toBe(false);
        expect(result.error).toBe('login_required');
    });

    it('空のコンテンツエラーを処理する', async () => {
        const result = await manager.submitPost('');

        expect(result.success).toBe(false);
        expect(result.error).toBe('empty_content');
    });

    it('キーが見つからないエラーを処理する', async () => {
        mockKeyManager = new MockKeyManager(null, null, false);
        mockDeps.keyManager = mockKeyManager;
        manager = new PostManager(mockRxNostr, mockDeps);

        const result = await manager.submitPost('Test content');

        expect(result.success).toBe(false);
        expect(result.error).toBe('key_not_found');
    });

    it('内部コンポーネントへのアクセスが可能', () => {
        expect(manager.getEventSender()).toBeInstanceOf(PostEventSender);
    });

    describe('iframe postMessage統合', () => {
        it('投稿成功時にnotifyPostSuccessが呼ばれる', async () => {
            const mockIframeService = {
                notifyPostSuccess: vi.fn().mockReturnValue(true),
                notifyPostError: vi.fn().mockReturnValue(true)
            };

            mockDeps.iframeMessageService = mockIframeService;
            manager = new PostManager(mockRxNostr, mockDeps);

            // 成功レスポンスのモック
            const mockObservable = {
                subscribe: vi.fn((observer) => {
                    process.nextTick(() => {
                        observer.next({
                            from: 'relay1',
                            ok: true,
                            done: true,
                            eventId: 'test-event-id',
                            type: 'ok',
                            message: ''
                        });
                    });
                    return { unsubscribe: vi.fn() };
                })
            };

            vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

            const result = await manager.submitPost('Test post content');

            expect(result.success).toBe(true);
            expect(mockIframeService.notifyPostSuccess).toHaveBeenCalledTimes(1);
            expect(mockIframeService.notifyPostError).not.toHaveBeenCalled();
        });

        it('投稿失敗時にnotifyPostErrorが呼ばれる', async () => {
            const mockIframeService = {
                notifyPostSuccess: vi.fn().mockReturnValue(true),
                notifyPostError: vi.fn().mockReturnValue(true)
            };

            mockDeps.iframeMessageService = mockIframeService;
            manager = new PostManager(mockRxNostr, mockDeps);

            // エラーレスポンスのモック
            const mockObservable = {
                subscribe: vi.fn((observer) => {
                    process.nextTick(() => {
                        observer.error(new Error('Network error'));
                    });
                    return { unsubscribe: vi.fn() };
                })
            };

            vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

            const result = await manager.submitPost('Test post content');

            expect(result.success).toBe(false);
            expect(mockIframeService.notifyPostError).toHaveBeenCalledWith('post_error');
            expect(mockIframeService.notifyPostSuccess).not.toHaveBeenCalled();
        });

        it('バリデーションエラー時にnotifyPostErrorが呼ばれる', async () => {
            const mockIframeService = {
                notifyPostSuccess: vi.fn().mockReturnValue(true),
                notifyPostError: vi.fn().mockReturnValue(true)
            };

            mockDeps.iframeMessageService = mockIframeService;
            manager = new PostManager(mockRxNostr, mockDeps);

            const result = await manager.submitPost('');

            expect(result.success).toBe(false);
            expect(result.error).toBe('empty_content');
            expect(mockIframeService.notifyPostError).toHaveBeenCalledWith('empty_content');
            expect(mockIframeService.notifyPostSuccess).not.toHaveBeenCalled();
        });

        it('認証エラー時にnotifyPostErrorが呼ばれる', async () => {
            const mockIframeService = {
                notifyPostSuccess: vi.fn().mockReturnValue(true),
                notifyPostError: vi.fn().mockReturnValue(true)
            };

            mockAuthState.isAuthenticated = false;
            mockDeps.iframeMessageService = mockIframeService;
            manager = new PostManager(mockRxNostr, mockDeps);

            const result = await manager.submitPost('Test content');

            expect(result.success).toBe(false);
            expect(result.error).toBe('login_required');
            expect(mockIframeService.notifyPostError).toHaveBeenCalledWith('login_required');
            expect(mockIframeService.notifyPostSuccess).not.toHaveBeenCalled();
        });

        it('nostr-login認証の投稿成功時にnotifyPostSuccessが呼ばれる', async () => {
            const mockIframeService = {
                notifyPostSuccess: vi.fn().mockReturnValue(true),
                notifyPostError: vi.fn().mockReturnValue(true)
            };

            // nostr-login認証に設定
            mockAuthState.type = 'nostr-login';
            mockKeyManager = new MockKeyManager(null, null, true);

            const mockWindow = {
                nostr: {
                    signEvent: vi.fn().mockResolvedValue({
                        kind: 1,
                        content: 'Test post content',
                        pubkey: 'testpubkey123',
                        sig: 'mock-signature'
                    })
                }
            };

            mockDeps.keyManager = mockKeyManager;
            mockDeps.window = mockWindow;
            mockDeps.iframeMessageService = mockIframeService;

            manager = new PostManager(mockRxNostr, mockDeps);

            // 成功レスポンスのモック
            const mockObservable = {
                subscribe: vi.fn((observer) => {
                    process.nextTick(() => {
                        observer.next({
                            from: 'relay1',
                            ok: true,
                            done: true,
                            eventId: 'test-event-id',
                            type: 'ok',
                            message: ''
                        });
                    });
                    return { unsubscribe: vi.fn() };
                })
            };

            vi.mocked(mockRxNostr.send).mockReturnValue(mockObservable as any);

            const result = await manager.submitPost('Test post content');

            expect(result.success).toBe(true);
            expect(mockIframeService.notifyPostSuccess).toHaveBeenCalledTimes(1);
            expect(mockIframeService.notifyPostError).not.toHaveBeenCalled();
        });
    });
});

// テスト環境フラグをセット
let originalVitestEnv: any;
beforeAll(() => {
    originalVitestEnv = process.env.VITEST;
    process.env.VITEST = "true";
});
afterAll(() => {
    process.env.VITEST = originalVitestEnv;
});
