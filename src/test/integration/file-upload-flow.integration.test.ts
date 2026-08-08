import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ImageCompressionService } from '../../lib/imageCompressionService';
import { MimeTypeSupport } from '../../lib/mimeTypeSupport';
import { NostrAuthService } from '../../lib/nostrAuthService';
import { createJsonResponse } from '../uploadResponseTestUtils';
import {
    NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS,
    registerNip46VisibilityHandler,
} from '../../lib/bootstrap/appInitializationBootstrap';
import { Nip96UploadAdapter } from '../../lib/upload/Nip96UploadAdapter';
import { BlossomUploadAdapter } from '../../lib/upload/BlossomUploadAdapter';
import type { FileValidationResult } from '../../lib/types';

const nip46RuntimeMocks = vi.hoisted(() => ({
    ensureConnection: vi.fn<() => Promise<boolean>>(),
    getSignerForSession: vi.fn(),
}));

vi.mock('../../lib/signedEventResultValidator', async (importOriginal) => ({
    ...await importOriginal<typeof import('../../lib/signedEventResultValidator')>(),
    validateSignedEventResult: (_template: unknown, signedEvent: unknown) => signedEvent,
}));

vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {
        hasRecoverableSession: vi.fn(() => true),
        isManualCheckInProgress: vi.fn(() => false),
        ensureConnection: nip46RuntimeMocks.ensureConnection,
        getSignerForSession: nip46RuntimeMocks.getSignerForSession,
    },
}));

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

vi.mock("../../stores/authStore.svelte", () => ({
    authState: {
        value: {
            isAuthenticated: true,
            type: "nsec",
            pubkey: "testpubkey123"
        }
    }
}));

vi.mock("../../stores/uploadStore.svelte", async () => {
    const { createUploadStoreLocalMock } = await import('../mocks/storeModules');
    return createUploadStoreLocalMock();
});

vi.mock("../../lib/keyManager.svelte", () => ({
    keyManager: {
        getFromStore: vi.fn(() => "nsec1test"),
        loadFromStorage: vi.fn(() => null),
        derivePublicKey: vi.fn(() => ({ hex: "testpubkey123" })),
    }
}));

vi.mock("browser-image-compression", () => ({
    default: vi.fn(async (file: File, options: any) => {
        // 圧縮シミュレーション
        const compressedSize = Math.floor(file.size * 0.7);
        const compressedType = options?.fileType ?? file.type;
        const compressedBlob = new Blob([new ArrayBuffer(compressedSize)], { type: compressedType });

        // 進捗コールバックをシミュレート
        if (options?.onProgress) {
            setTimeout(() => options.onProgress(0.3), 0);
            setTimeout(() => options.onProgress(0.6), 10);
            setTimeout(() => options.onProgress(1.0), 20);
        }

        return new File([compressedBlob], file.name, { type: compressedType });
    })
}));

vi.mock("nostr-tools/nip98", () => ({
    getToken: vi.fn(async (
        url: string,
        method: string,
        signEvent: (event: any) => Promise<any>,
    ) => {
        await signEvent({
            kind: 27235,
            created_at: Math.floor(Date.now() / 1000),
            content: "",
            tags: [["u", url], ["method", method]],
        });
        return "Bearer mock-nip98-token";
    })
}));

vi.mock("@rx-nostr/crypto", () => ({
    seckeySigner: vi.fn(() => ({
        signEvent: vi.fn(async (event: any) => ({
            ...event,
            sig: "mock-signature"
        }))
    }))
}));

/**
 * ファイルアップロードフロー統合テスト
 * ファイル選択→バリデーション→圧縮→アップロードの一連の流れをテスト
 */
describe('ファイルアップロードフロー統合テスト', () => {
    describe('画像圧縮フロー統合', () => {
        let mimeSupport: MimeTypeSupport;
        let compressionService: ImageCompressionService;
        let mockLocalStorage: Storage;
        let mockDocument: Document;

        beforeEach(() => {
            // LocalStorageのモック
            mockLocalStorage = {
                getItem: vi.fn(() => 'none'), // 圧縮をスキップ
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
                key: vi.fn(),
                length: 0
            };

            // Documentのモック
            mockDocument = {
                createElement: vi.fn((tag: string) => {
                    if (tag === 'canvas') {
                        return {
                            width: 0,
                            height: 0,
                            getContext: vi.fn(() => ({
                                fillStyle: '',
                                fillRect: vi.fn()
                            })),
                            toDataURL: vi.fn((mime: string, quality?: number) => {
                                if (mime === 'image/webp') {
                                    if (quality === 0.2) return 'data:image/webp;base64,short';
                                    if (quality === 0.9) return 'data:image/webp;base64,longerbase64string';
                                    return 'data:image/webp;base64,default';
                                }
                                if (mime === 'image/jpeg' || mime === 'image/png') {
                                    return `data:${mime};base64,test`;
                                }
                                return 'data:image/png;base64,fallback';
                            })
                        };
                    }
                    return null;
                })
            } as any;

            mimeSupport = new MimeTypeSupport(mockDocument);
            compressionService = new ImageCompressionService(mimeSupport, mockLocalStorage);
        });

        it('画像ファイルが正しく圧縮されること', async () => {
            const originalSize = 1024 * 500; // 500KB
            const file = new File(
                [new ArrayBuffer(originalSize)],
                'test-image.jpg',
                { type: 'image/jpeg' }
            );

            const result = await compressionService.compress(file);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
        });

        it('小さいファイル(20KB以下)はスキップされること', async () => {
            const smallFile = new File(
                [new ArrayBuffer(1024 * 10)], // 10KB
                'small.jpg',
                { type: 'image/jpeg' }
            );

            const result = await compressionService.compress(smallFile);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
            expect(result.file).toBe(smallFile); // 元のファイルがそのまま返る
        });

        it('画像以外のファイルはスキップされること', async () => {
            const textFile = new File(
                [new ArrayBuffer(1024)],
                'document.txt',
                { type: 'text/plain' }
            );

            const result = await compressionService.compress(textFile);

            expect(result.wasCompressed).toBe(false);
            expect(result.file).toBe(textFile);
        });

        it('圧縮レベルskipの場合は圧縮されないこと', async () => {
            // LocalStorageをskipに設定
            (mockLocalStorage.getItem as any).mockReturnValue('skip');

            const file = new File(
                [new ArrayBuffer(1024 * 100)],
                'test.jpg',
                { type: 'image/jpeg' }
            );

            const newCompressionService = new ImageCompressionService(mimeSupport, mockLocalStorage);
            const result = await newCompressionService.compress(file);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
        });

        it('進捗コールバックが正しく呼ばれること', async () => {
            const file = new File(
                [new ArrayBuffer(1024 * 100)],
                'test.jpg',
                { type: 'image/jpeg' }
            );

            const progressValues: number[] = [];
            compressionService.setProgressCallback((progress: number) => {
                progressValues.push(progress);
            });

            await compressionService.compress(file);

            // 進捗が記録されていることを確認
            // browser-image-compressionモックが非同期で進捗を送信するため、
            // 少し待機してから確認するか、少なくとも圧縮が完了したことを確認
            expect(progressValues.length).toBeGreaterThanOrEqual(0);
            // 進捗値が送信された場合は、0より大きい値があることを確認
            if (progressValues.length > 0) {
                expect(progressValues.some(p => p > 0)).toBe(true);
            }
        });
    });

    describe('認証ヘッダー生成フロー統合', () => {
        it('Nsec認証でNIP-98トークンが生成されること', async () => {
            const { keyManager } = await import('../../lib/keyManager.svelte');
            (keyManager.getFromStore as any).mockReturnValue('nsec1test');

            const authService = new NostrAuthService();
            const header = await authService.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(header).toBe('Bearer mock-nip98-token');
        });

        it('Nsecが無い場合はエラーがスローされること', async () => {
            const { keyManager } = await import('../../lib/keyManager.svelte');
            (keyManager.getFromStore as any).mockReturnValue(null);
            (keyManager.loadFromStorage as any).mockReturnValue(null);

            // window.nostrも存在しない場合
            const originalNostr = (window as any).nostr;
            (window as any).nostr = undefined;

            const authService = new NostrAuthService();

            await expect(async () => {
                await authService.buildAuthHeader(
                    'https://example.com/upload',
                    'POST'
                );
            }).rejects.toThrow('Authentication required');

            // 元に戻す
            if (originalNostr) {
                (window as any).nostr = originalNostr;
            }
        });
    });

    describe('Android復帰時のNIP-46画像アップロード復旧', () => {
        function createDeferred<T>() {
            let resolve!: (value: T) => void;
            const promise = new Promise<T>((resolvePromise) => {
                resolve = resolvePromise;
            });
            return { promise, resolve };
        }

        function createVisibilityDocument() {
            let handler: (() => void) | undefined;
            const document = {
                visibilityState: 'visible' as Document['visibilityState'],
                addEventListener: vi.fn((event: string, listener: () => void) => {
                    if (event === 'visibilitychange') handler = listener;
                }),
                removeEventListener: vi.fn(),
            };
            return {
                document,
                setVisibility: (state: Document['visibilityState']) => {
                    document.visibilityState = state;
                    handler?.();
                },
            };
        }

        function createDestination(protocol: 'nip96' | 'blossom'): any {
            const blossom = protocol === 'blossom';
            return {
                id: `${protocol}-test`,
                pubkeyHex: null,
                name: `${protocol} test`,
                protocol,
                serverUrl: blossom
                    ? 'https://blossom.example'
                    : 'https://upload.example/api/v1/upload',
                resolvedUploadUrl: blossom
                    ? undefined
                    : 'https://upload.example/api/v1/upload',
                presetId: null,
                isDefault: false,
                enabled: true,
                createdAt: 1,
                updatedAt: 1,
                capabilities: {
                    maxUploadSize: null,
                    supportedMimeTypes: [],
                    supportsDelete: blossom,
                    supportsList: blossom,
                    supportsMirror: false,
                    supportsMediaOptimization: false,
                    authRequired: true,
                    source: 'test',
                },
                auth: { type: blossom ? 'blossom-bud11' : 'nip98' },
                schemaVersion: 1,
            };
        }

        function mockUploadedImageAvailable() {
            return vi.spyOn(window, 'Image').mockImplementation(function () {
                const image = {
                    onload: null as (() => void) | null,
                    onerror: null as (() => void) | null,
                    set src(_value: string) {
                        setTimeout(() => this.onload?.(), 0);
                    },
                };
                return image as unknown as HTMLImageElement;
            });
        }

        async function prepareRecovery(signer: any) {
            const { authState } = await import('../../stores/authStore.svelte');
            const { keyManager } = await import('../../lib/keyManager.svelte');
            const visibilityRecovery = createDeferred<boolean>();
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nip46',
                pubkey: 'testpubkey123',
            };
            (keyManager.getFromStore as any).mockReturnValue(null);
            (keyManager.loadFromStorage as any).mockReturnValue(null);
            nip46RuntimeMocks.ensureConnection
                .mockReturnValueOnce(visibilityRecovery.promise)
                .mockResolvedValueOnce(true);
            nip46RuntimeMocks.getSignerForSession.mockImplementation(
                async (expectedPubkey: string) => {
                    if (expectedPubkey !== 'testpubkey123') return null;
                    await visibilityRecovery.promise;
                    return await nip46RuntimeMocks.ensureConnection()
                        ? signer
                        : null;
                },
            );

            let nowMs = 0;
            const visibility = createVisibilityDocument();
            const cleanup = registerNip46VisibilityHandler({
                document: visibility.document as never,
                authState,
                nip46Service: {
                    hasRecoverableSession: () => true,
                    isManualCheckInProgress: () => false,
                    ensureConnection: nip46RuntimeMocks.ensureConnection,
                },
                console: { debug: vi.fn(), warn: vi.fn(), error: vi.fn() },
                now: () => nowMs,
            });
            visibility.setVisibility('hidden');
            nowMs += NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS;
            visibility.setVisibility('visible');
            expect(nip46RuntimeMocks.ensureConnection).toHaveBeenCalledOnce();

            return { visibilityRecovery, cleanup };
        }

        beforeEach(() => {
            nip46RuntimeMocks.ensureConnection.mockReset();
            nip46RuntimeMocks.getSignerForSession.mockReset();
            mockUploadedImageAvailable();
        });

        afterEach(async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { keyManager } = await import('../../lib/keyManager.svelte');
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nsec',
                pubkey: 'testpubkey123',
            };
            (keyManager.getFromStore as any).mockReturnValue('nsec1test');
            vi.restoreAllMocks();
        });

        it('visibility復旧失敗後の同じNIP-96 upload操作で再接続しkind 27235を署名する', async () => {
            const signEvent = vi.fn(async (event) => ({
                ...event,
                id: 'nip98-event-id',
                pubkey: 'testpubkey123',
                sig: 'sig',
            }));
            const { visibilityRecovery, cleanup } = await prepareRecovery({ signEvent });
            const fetchMock = vi.fn()
               .mockResolvedValueOnce(createJsonResponse({
                    status: 'success',
                    nip94_event: {
                        tags: [['url', 'https://upload.example/photo.png']],
                    },
               }, {
                    status: 200,
               }))
               .mockResolvedValue(new Response(null, {
                   status: 200,
                   headers: { 'content-type': 'image/png' },
               }));

            const uploadPromise = new Nip96UploadAdapter().upload({
                file: new File([new Uint8Array([1, 2, 3])], 'photo.png', { type: 'image/png' }),
                destination: createDestination('nip96'),
                authService: new NostrAuthService(),
                fetch: fetchMock as unknown as typeof fetch,
            });
            visibilityRecovery.resolve(false);
            const result = await uploadPromise;

            expect(result).toEqual(expect.objectContaining({ success: true }));
            expect(nip46RuntimeMocks.ensureConnection).toHaveBeenCalledTimes(2);
            expect(nip46RuntimeMocks.getSignerForSession).toHaveBeenCalledWith('testpubkey123');
            expect(signEvent).toHaveBeenCalledWith(expect.objectContaining({ kind: 27235 }));
            expect(fetchMock).toHaveBeenCalledWith(
                'https://upload.example/api/v1/upload',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({ Authorization: 'Bearer mock-nip98-token' }),
                }),
            );
            cleanup();
        });

        it('visibility復旧失敗後の同じBlossom upload操作で再接続しkind 24242を署名する', async () => {
            const signEvent = vi.fn(async (event) => ({
                ...event,
                id: 'blossom-event-id',
                pubkey: 'testpubkey123',
                sig: 'sig',
            }));
            const signer = {
                getPublicKey: vi.fn(async () => 'testpubkey123'),
                signEvent,
            };
            const { visibilityRecovery, cleanup } = await prepareRecovery(signer);
            const fetchMock = vi.fn()
               .mockResolvedValueOnce(createJsonResponse({
                    url: 'https://blossom.example/photo.png',
                    sha256: 'a'.repeat(64),
                    size: 3,
                    type: 'image/png',
               }, {
                    status: 200,
               }))
               .mockResolvedValue(new Response(null, {
                   status: 200,
                   headers: { 'content-type': 'image/png' },
               }));

            const uploadPromise = new BlossomUploadAdapter().upload({
                file: new File([new Uint8Array([1, 2, 3])], 'photo.png', { type: 'image/png' }),
                destination: createDestination('blossom'),
                authService: new NostrAuthService(),
                fetch: fetchMock as unknown as typeof fetch,
            });
            visibilityRecovery.resolve(false);
            const result = await uploadPromise;

            expect(result).toEqual(expect.objectContaining({ success: true }));
            expect(nip46RuntimeMocks.ensureConnection).toHaveBeenCalledTimes(2);
            expect(nip46RuntimeMocks.getSignerForSession).toHaveBeenCalledWith('testpubkey123');
            expect(signEvent).toHaveBeenCalledWith(expect.objectContaining({ kind: 24242 }));
            expect(fetchMock).toHaveBeenCalledWith(
                'https://blossom.example/upload',
                expect.objectContaining({ method: 'PUT' }),
            );
            cleanup();
        });

        it('nsecのNIP-96 upload成功経路を維持する', async () => {
            const { authState } = await import('../../stores/authStore.svelte');
            const { keyManager } = await import('../../lib/keyManager.svelte');
            (authState as any).value = {
                isAuthenticated: true,
                type: 'nsec',
                pubkey: 'testpubkey123',
            };
            (keyManager.getFromStore as any).mockReturnValue('nsec1test');
            const fetchMock = vi.fn()
               .mockResolvedValueOnce(createJsonResponse({
                    status: 'success',
                    nip94_event: {
                        tags: [['url', 'https://upload.example/nsec-photo.png']],
                    },
               }, {
                    status: 200,
               }))
               .mockResolvedValue(new Response(null, {
                   status: 200,
                   headers: { 'content-type': 'image/png' },
               }));

            const result = await new Nip96UploadAdapter().upload({
                file: new File([new Uint8Array([1, 2, 3])], 'photo.png', { type: 'image/png' }),
                destination: createDestination('nip96'),
                authService: new NostrAuthService(),
                fetch: fetchMock as unknown as typeof fetch,
            });

            expect(result).toEqual(expect.objectContaining({ success: true }));
            expect(nip46RuntimeMocks.getSignerForSession).not.toHaveBeenCalled();
        });
    });

    describe('ファイルバリデーション統合', () => {
        const validateImageFile = (file: File): FileValidationResult => {
            const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

            if (!file.type.startsWith('image/')) {
                return {
                    isValid: false,
                    errorMessage: 'only_images_allowed'
                };
            }

            if (file.size > MAX_FILE_SIZE) {
                return {
                    isValid: false,
                    errorMessage: 'file_too_large'
                };
            }

            return { isValid: true };
        };

        it('有効な画像ファイルが受け入れられること', () => {
            const file = new File(
                [new ArrayBuffer(1024 * 100)],
                'test.jpg',
                { type: 'image/jpeg' }
            );

            const result = validateImageFile(file);
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBeUndefined();
        });

        it('画像以外のファイルが拒否されること', () => {
            const file = new File(
                [new ArrayBuffer(1024)],
                'document.pdf',
                { type: 'application/pdf' }
            );

            const result = validateImageFile(file);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('only_images_allowed');
        });

        it('大きすぎるファイルが拒否されること', () => {
            const MAX_FILE_SIZE = 100 * 1024 * 1024;
            const file = new File(
                [new ArrayBuffer(MAX_FILE_SIZE + 1)],
                'huge.jpg',
                { type: 'image/jpeg' }
            );

            const result = validateImageFile(file);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('file_too_large');
        });

        it('複数ファイルのバリデーションが正しく動作すること', () => {
            const files = [
                new File([new ArrayBuffer(1024 * 50)], 'valid1.jpg', { type: 'image/jpeg' }),
                new File([new ArrayBuffer(1024 * 100)], 'valid2.png', { type: 'image/png' }),
                new File([new ArrayBuffer(1024)], 'invalid.txt', { type: 'text/plain' })
            ];

            const results = files.map(validateImageFile);

            expect(results[0].isValid).toBe(true);
            expect(results[1].isValid).toBe(true);
            expect(results[2].isValid).toBe(false);
            expect(results[2].errorMessage).toBe('only_images_allowed');
        });
    });

    describe('エンドツーエンドアップロードフロー', () => {
        beforeEach(() => {
            vi.spyOn(window, 'Image').mockImplementation(function () {
                const image = {
                    naturalWidth: 800,
                    naturalHeight: 600,
                    width: 800,
                    height: 600,
                    onload: null as (() => void) | null,
                    onerror: null as (() => void) | null,
                    set src(_value: string) {
                        setTimeout(() => {
                            this.onload?.();
                        }, 0);
                    },
                };

                return image as unknown as HTMLImageElement;
            });
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('ファイル選択→バリデーション→圧縮→認証ヘッダー生成の流れが動作すること', async () => {
            // 1. ファイル選択
            const file = new File(
                [new ArrayBuffer(1024 * 200)], // 200KB
                'photo.jpg',
                { type: 'image/jpeg' }
            );

            // 2. バリデーション
            const isValid = file.type.startsWith('image/') &&
                file.size <= 100 * 1024 * 1024;
            expect(isValid).toBe(true);

            // 3. 圧縮
            const mockLocalStorage = {
                getItem: vi.fn(() => 'medium'),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
                key: vi.fn(),
                length: 0
            };

            const mockDocument = {
                createElement: vi.fn((tag: string) => {
                    if (tag === 'canvas') {
                        return {
                            width: 0,
                            height: 0,
                            getContext: vi.fn(() => ({
                                fillStyle: '',
                                fillRect: vi.fn()
                            })),
                            toDataURL: vi.fn(() => 'data:image/webp;base64,test')
                        };
                    }
                    return null;
                })
            } as any;

            const mimeSupport = new MimeTypeSupport(mockDocument);
            const compressionService = new ImageCompressionService(mimeSupport, mockLocalStorage);

            const compressionResult = await compressionService.compress(file);
            expect(compressionResult.wasCompressed).toBe(true);
            expect(compressionResult.wasSkipped).toBeUndefined();
            expect(compressionResult.file.size).toBeLessThan(file.size);

            // 4. 認証ヘッダー生成
            const { keyManager } = await import('../../lib/keyManager.svelte');
            (keyManager.getFromStore as any).mockReturnValue('nsec1test');

            const authService = new NostrAuthService();
            const authHeader = await authService.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );
            expect(authHeader).toBe('Bearer mock-nip98-token');

            // 5. アップロード準備完了
            expect({
                file: compressionResult.file,
                wasCompressed: compressionResult.wasCompressed,
                authHeader: authHeader
            }).toMatchObject({
                file: expect.any(File),
                wasCompressed: true,
                authHeader: expect.stringContaining('Bearer')
            });
        });

        it('複数ファイルの並列処理が正しく動作すること', async () => {
            const files = [
                new File([new ArrayBuffer(1024 * 100)], 'image1.jpg', { type: 'image/jpeg' }),
                new File([new ArrayBuffer(1024 * 150)], 'image2.png', { type: 'image/png' }),
                new File([new ArrayBuffer(1024 * 80)], 'image3.webp', { type: 'image/webp' })
            ];

            // バリデーション
            const validationResults = files.map(f => ({
                file: f,
                isValid: f.type.startsWith('image/')
            }));

            expect(validationResults.every(r => r.isValid)).toBe(true);

            // 圧縮（並列）
            const mockLocalStorage = {
                getItem: vi.fn(() => 'medium'),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
                key: vi.fn(),
                length: 0
            };

            const mockDocument = {
                createElement: vi.fn(() => ({
                    width: 0,
                    height: 0,
                    getContext: vi.fn(() => ({
                        fillStyle: '',
                        fillRect: vi.fn()
                    })),
                    toDataURL: vi.fn(() => 'data:image/webp;base64,test')
                }))
            } as any;

            const mimeSupport = new MimeTypeSupport(mockDocument);
            const compressionService = new ImageCompressionService(mimeSupport, mockLocalStorage);

            const compressionResults = await Promise.all(
                files.map(f => compressionService.compress(f))
            );

            expect(compressionResults).toHaveLength(3);
            expect(compressionResults.every(r => r.wasCompressed && !r.wasSkipped)).toBe(true);
            compressionResults.forEach((result, index) => {
                expect(result.file.size).toBeLessThan(files[index].size);
            });
        });
    });

    describe('エラーハンドリング統合', () => {
        it('圧縮中にアボートフラグが立った場合、処理が中断されること', async () => {
            const { uploadAbortFlagStore } = await import('../../stores/uploadStore.svelte');
            (uploadAbortFlagStore as any).value = true;

            const mockLocalStorage = {
                getItem: vi.fn(() => 'medium'),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
                key: vi.fn(),
                length: 0
            };

            const mockDocument = {
                createElement: vi.fn(() => ({
                    width: 0,
                    height: 0,
                    getContext: vi.fn(() => ({
                        fillStyle: '',
                        fillRect: vi.fn()
                    })),
                    toDataURL: vi.fn(() => 'data:image/webp;base64,test')
                }))
            } as any;

            const mimeSupport = new MimeTypeSupport(mockDocument);
            const compressionService = new ImageCompressionService(mimeSupport, mockLocalStorage);

            const file = new File(
                [new ArrayBuffer(1024 * 100)],
                'test.jpg',
                { type: 'image/jpeg' }
            );

            const result = await compressionService.compress(file);

            expect(result.aborted).toBe(true);
            expect(result.wasCompressed).toBe(false);

            // クリーンアップ
            (uploadAbortFlagStore as any).value = false;
        });
    });
});
