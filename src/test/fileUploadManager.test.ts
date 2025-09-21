import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    FileUploadManager,
    MimeTypeSupport,
    ImageCompressionService,
    NostrAuthService
} from '../lib/fileUploadManager';
import type {
    FileUploadDependencies,
    CompressionService,
    AuthService,
    MimeTypeSupportInterface,
    SharedImageData
} from '../lib/types';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

// appStore.svelte.tsのモック
vi.mock("../stores/appStore.svelte.ts", () => ({
    showImageSizeInfo: vi.fn()
}));

// その他の依存関係をモック
vi.mock("../lib/keyManager", () => ({
    keyManager: {
        getFromStore: vi.fn(() => null),
        loadFromStorage: vi.fn(() => null)
    }
}));

vi.mock("../lib/utils/appUtils", () => ({
    createFileSizeInfo: vi.fn((original, compressed, wasCompressed, originalName, compressedName, wasSkipped) => ({
        originalSize: original,
        compressedSize: compressed,
        wasCompressed,
        compressionRatio: Math.round((1 - compressed / original) * 100),
        sizeReduction: `${Math.ceil(original / 1024)}KB → ${Math.ceil(compressed / 1024)}KB`,
        originalFilename: originalName,
        compressedFilename: compressedName,
        wasSkipped
    })),
    generateSizeDisplayInfo: vi.fn(() => null),
    calculateSHA256Hex: vi.fn(async () => "mockhash"),
    getImageDimensions: vi.fn(async () => ({ width: 100, height: 200 })),
    renameByMimeType: vi.fn((name, type) => name)
}));

vi.mock("../lib/debug", () => ({
    debugLogUploadResponse: vi.fn(),
    showCompressedImagePreview: vi.fn()
}));

vi.mock("../lib/tags/imetaTag", () => ({
    generateBlurhashForFile: vi.fn(async () => "blurhash123"),
    createPlaceholderUrl: vi.fn(async () => "placeholder-url")
}));

vi.mock("browser-image-compression", () => ({
    default: vi.fn(async (file) => file)
}));

vi.mock("nostr-tools/nip98", () => ({
    getToken: vi.fn(async () => "Bearer mock-token")
}));

vi.mock("@rx-nostr/crypto", () => ({
    seckeySigner: vi.fn(() => ({
        signEvent: vi.fn(async (event) => ({ ...event, sig: "mock-signature" }))
    }))
}));

// --- モッククラス定義 ---
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

class MockCrypto implements SubtleCrypto {
    async digest(algorithm: string, data: BufferSource): Promise<ArrayBuffer> {
        // モック実装：固定のハッシュ値を返す
        const hash = new Uint8Array(32);
        hash.fill(0x12); // 固定値で埋める
        return hash.buffer;
    }

    // 他のメソッドは未実装（テストで使用しない）
    decrypt = vi.fn();
    deriveBits = vi.fn();
    deriveKey = vi.fn();
    encrypt = vi.fn();
    exportKey = vi.fn();
    generateKey = vi.fn();
    importKey = vi.fn();
    sign = vi.fn();
    unwrapKey = vi.fn();
    verify = vi.fn();
    wrapKey = vi.fn();
}

class MockDocument {
    createElement(tagName: string): any {
        if (tagName === 'canvas') {
            return {
                width: 0,
                height: 0,
                getContext: (contextType: string) => {
                    if (contextType === '2d') {
                        return {
                            fillStyle: '',
                            fillRect: vi.fn(),
                        };
                    }
                    return null;
                },
                toDataURL: (type?: string, quality?: number) => {
                    if (type === 'image/webp') {
                        // WebP品質テストのために異なる長さを返す
                        return quality && quality < 0.5
                            ? 'data:image/webp;base64,shortdata'
                            : 'data:image/webp;base64,longerdata';
                    }
                    return `data:${type || 'image/png'};base64,mockdata`;
                }
            };
        }
        return {};
    }
}

// --- MockResponse クラスの実装 ---
class MockResponse {
    public readonly body: ReadableStream<Uint8Array> | null = null;
    public readonly bodyUsed: boolean = false;
    public readonly headers: Headers = new Headers();
    public readonly redirected: boolean = false;
    public readonly statusText: string = 'OK';
    public readonly type: ResponseType = 'basic';
    public readonly url: string = '';

    constructor(
        public readonly ok: boolean,
        public readonly status: number,
        private jsonData: any
    ) { }

    async arrayBuffer(): Promise<ArrayBuffer> {
        return new ArrayBuffer(0);
    }

    async blob(): Promise<Blob> {
        return new Blob();
    }

    async formData(): Promise<FormData> {
        return new FormData();
    }

    async json(): Promise<any> {
        return this.jsonData;
    }

    async text(): Promise<string> {
        return JSON.stringify(this.jsonData);
    }

    async bytes(): Promise<Uint8Array> {
        // Return an empty Uint8Array for mock
        return new Uint8Array(0);
    }

    clone(): MockResponse {
        return new MockResponse(this.ok, this.status, this.jsonData);
    }
}

// --- テストヘルパー関数 ---
function createMockFile(name: string, type: string, size: number): File {
    // メモリ効率の改善：大きなファイルに対しては空のArrayBufferを使用
    if (size > 10 * 1024 * 1024) { // 10MB以上の場合
        const buffer = new ArrayBuffer(Math.min(size, 1024)); // 最大1KBまでに制限
        return new File([buffer], name, { type });
    }

    const content = new Array(Math.min(size, 1024)).fill(0).map((_, i) => i % 256);
    const blob = new Blob([new Uint8Array(content)], { type });
    return new File([blob], name, { type });
}

function createMockResponse(ok: boolean, status: number, jsonData: any): Response {
    return new MockResponse(ok, status, jsonData) as Response;
}

function createMockDependencies(): FileUploadDependencies {
    return {
        localStorage: new MockStorage(),
        fetch: vi.fn(),
        crypto: new MockCrypto(),
        document: new MockDocument() as any,
        window: {
            location: { search: '' }
        } as any,
        navigator: {
            serviceWorker: {
                controller: null
            }
        } as any
    };
}

// --- MimeTypeSupport テスト ---
describe('MimeTypeSupport', () => {
    let mimeSupport: MimeTypeSupport;
    let mockDocument: MockDocument;

    beforeEach(() => {
        mockDocument = new MockDocument();
        mimeSupport = new MimeTypeSupport(mockDocument as any);
    });

    it('WebP品質サポートを正しく検出する', async () => {
        const result = await mimeSupport.canEncodeWebpWithQuality();
        expect(result).toBe(true);
    });

    it('MIMEタイプのサポートを正しく検出する', () => {
        expect(mimeSupport.canEncodeMimeType('image/webp')).toBe(true);
        expect(mimeSupport.canEncodeMimeType('image/jpeg')).toBe(true);
        expect(mimeSupport.canEncodeMimeType('')).toBe(false);
    });

    it('documentが未定義の場合はfalseを返す', () => {
        const mimeSupport2 = new MimeTypeSupport(undefined);
        expect(mimeSupport2.canEncodeMimeType('image/jpeg')).toBe(false);
    });
});

// --- ImageCompressionService テスト ---
describe('ImageCompressionService', () => {
    let compressionService: ImageCompressionService;
    let mockMimeSupport: MimeTypeSupportInterface;
    let mockStorage: MockStorage;

    beforeEach(() => {
        mockStorage = new MockStorage();
        mockMimeSupport = {
            canEncodeWebpWithQuality: vi.fn().mockResolvedValue(true),
            canEncodeMimeType: vi.fn().mockReturnValue(true)
        };
        compressionService = new ImageCompressionService(mockMimeSupport, mockStorage);
    });

    it('画像以外のファイルは圧縮しない', async () => {
        const file = createMockFile('test.txt', 'text/plain', 1000);
        const result = await compressionService.compress(file);
        expect(result.wasCompressed).toBe(false);
        expect(result.file).toBe(file);
    });

    it('小さな画像ファイルはスキップする', async () => {
        const file = createMockFile('small.jpg', 'image/jpeg', 10000); // 10KB
        const result = await compressionService.compress(file);
        expect(result.wasSkipped).toBe(true);
        expect(result.wasCompressed).toBe(false);
    });

    it('圧縮設定を正しく取得する', () => {
        // 通常設定の場合は圧縮設定があることを確認
        mockStorage.setItem('imageCompressionLevel', 'medium');
        expect(compressionService.hasCompressionSettings()).toBe(true);

        // 'skip'設定の場合は圧縮設定がないことを確認
        mockStorage.setItem('imageCompressionLevel', 'skip');
        expect(compressionService.hasCompressionSettings()).toBe(false);
    });
});

// --- NostrAuthService テスト ---
describe('NostrAuthService', () => {
    let authService: NostrAuthService;

    beforeEach(() => {
        authService = new NostrAuthService();
        // keyManagerのモック化
        vi.mock('./keyManager', () => ({
            keyManager: {
                getFromStore: vi.fn().mockReturnValue(null),
                loadFromStorage: vi.fn().mockReturnValue('mock-key')
            }
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('認証が必要な場合はエラーを投げる', async () => {
        // keyManagerが空の場合をモック
        const { keyManager } = await import('../lib/keyManager');
        vi.mocked(keyManager.getFromStore).mockReturnValue(null);
        vi.mocked(keyManager.loadFromStorage).mockReturnValue(null);

        // window.nostrも未定義
        Object.defineProperty(window, 'nostr', { value: undefined, writable: true });

        await expect(
            authService.buildAuthHeader('https://example.com', 'POST')
        ).rejects.toThrow('Authentication required');
    });
});

// --- FileUploadManager メインテスト ---
describe('FileUploadManager', () => {
    let uploadManager: FileUploadManager;
    let mockDependencies: FileUploadDependencies;
    let mockFetch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockFetch = vi.fn();
        mockDependencies.fetch = mockFetch;
        uploadManager = new FileUploadManager(mockDependencies);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('ファイルバリデーション', () => {
        it('有効な画像ファイルを受け入れる', () => {
            const file = createMockFile('test.jpg', 'image/jpeg', 1000000); // 1MB
            const result = uploadManager.validateImageFile(file);
            expect(result.isValid).toBe(true);
        });

        it('画像以外のファイルを拒否する', () => {
            const file = createMockFile('test.txt', 'text/plain', 1000);
            const result = uploadManager.validateImageFile(file);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('only_images_allowed');
        });

        it('大きすぎるファイルを拒否する', () => {
            // メモリを消費しない方法でファイルサイズをテスト
            const file = new File([], 'large.jpg', { type: 'image/jpeg' });

            // ファイルサイズを直接設定（テスト用のモック）
            Object.defineProperty(file, 'size', {
                value: 100 * 1024 * 1024, // 100MB
                writable: false
            });

            const result = uploadManager.validateImageFile(file);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('file_too_large');
        });
    });

    describe('ファイルアップロード', () => {
        it('成功時に正しいレスポンスを返す', async () => {
            const file = createMockFile('test.jpg', 'image/jpeg', 1000); // 1KB

            // 認証モック
            const mockAuthService: AuthService = {
                buildAuthHeader: vi.fn().mockResolvedValue('Bearer mock-token')
            };

            // 圧縮サービスモック
            const mockCompressionService = {
                compress: vi.fn().mockResolvedValue({
                    file,
                    wasCompressed: false,
                    wasSkipped: false
                }),
                hasCompressionSettings: vi.fn().mockReturnValue(true)
            } as CompressionService & { hasCompressionSettings: () => boolean };

            uploadManager = new FileUploadManager(
                mockDependencies,
                mockAuthService,
                mockCompressionService
            );

            // 成功レスポンスをモック
            mockFetch.mockResolvedValue(createMockResponse(true, 200, {
                status: 'success',
                nip94_event: {
                    tags: [['url', 'https://example.com/image.jpg']]
                }
            }));

            const result = await uploadManager.uploadFile(file);

            expect(result.success).toBe(true);
            expect(result.url).toBe('https://example.com/image.jpg');
            expect(mockAuthService.buildAuthHeader).toHaveBeenCalledWith(
                expect.any(String),
                'POST'
            );
        });

        it('ネットワークエラーを適切に処理する', async () => {
            const file = createMockFile('test.jpg', 'image/jpeg', 1000); // 1KB

            // 認証サービスをモックして認証エラーを回避
            const mockAuthService: AuthService = {
                buildAuthHeader: vi.fn().mockResolvedValue('Bearer mock-token')
            };

            // 圧縮サービスもモック
            const mockCompressionService = {
                compress: vi.fn().mockResolvedValue({
                    file,
                    wasCompressed: false,
                    wasSkipped: false
                }),
                hasCompressionSettings: vi.fn().mockReturnValue(true)
            } as CompressionService & { hasCompressionSettings: () => boolean };

            uploadManager = new FileUploadManager(
                mockDependencies,
                mockAuthService,
                mockCompressionService
            );

            mockFetch.mockRejectedValue(new Error('Network error'));

            const result = await uploadManager.uploadFile(file);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Network error');
        });

        it('処理URLによる非同期処理を正しく扱う', async () => {
            const file = createMockFile('test.jpg', 'image/jpeg', 1000); // 1KB

            const mockAuthService: AuthService = {
                buildAuthHeader: vi.fn().mockResolvedValue('Bearer mock-token')
            };

            uploadManager = new FileUploadManager(
                mockDependencies,
                mockAuthService
            );

            // 最初のレスポンス（処理URL返却）
            mockFetch.mockResolvedValueOnce(createMockResponse(true, 202, {
                processing_url: 'https://example.com/process/123'
            }));

            // 処理状況確認レスポンス（完了）
            mockFetch.mockResolvedValueOnce(createMockResponse(true, 201, {
                status: 'success',
                nip94_event: {
                    tags: [['url', 'https://example.com/final.jpg']]
                }
            }));

            const result = await uploadManager.uploadFile(file);

            expect(result.success).toBe(true);
            expect(result.url).toBe('https://example.com/final.jpg');
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });
    });

    describe('複数ファイルアップロード', () => {
        it('複数ファイルを並列アップロードする', async () => {
            const files = [
                createMockFile('test1.jpg', 'image/jpeg', 1000), // 1KB
                createMockFile('test2.jpg', 'image/jpeg', 1000)  // 1KB
            ];

            // 認証サービスをモックして認証エラーを回避
            const mockAuthService: AuthService = {
                buildAuthHeader: vi.fn().mockResolvedValue('Bearer mock-token')
            };

            // 圧縮サービスもモック
            const mockCompressionService = {
                compress: vi.fn().mockImplementation(async (file: File) => ({
                    file,
                    wasCompressed: false,
                    wasSkipped: false
                })),
                hasCompressionSettings: vi.fn().mockReturnValue(true)
            } as CompressionService & { hasCompressionSettings: () => boolean };

            uploadManager = new FileUploadManager(
                mockDependencies,
                mockAuthService,
                mockCompressionService
            );

            mockFetch.mockResolvedValue(createMockResponse(true, 200, {
                status: 'success',
                nip94_event: {
                    tags: [['url', 'https://example.com/uploaded.jpg']]
                }
            }));

            const progressCallback = vi.fn();
            const results = await uploadManager.uploadMultipleFiles(
                files,
                'https://api.example.com',
                progressCallback
            );

            expect(results).toHaveLength(2);
            expect(results.every(r => r.success)).toBe(true);
            expect(progressCallback).toHaveBeenCalledWith({
                completed: 2,
                failed: 0,
                total: 2,
                inProgress: false
            });
        });
    });

    describe('共有画像処理', () => {
        it('共有フラグを正しく検出する', () => {
            mockDependencies.window = {
                location: { search: '?shared=true' }
            } as any;

            uploadManager = new FileUploadManager(mockDependencies);

            expect(uploadManager.checkIfOpenedFromShare()).toBe(true);
        });

        it('Service Workerから共有画像を取得する', async () => {
            const mockController = {
                postMessage: vi.fn()
            };

            mockDependencies.navigator = {
                serviceWorker: {
                    controller: mockController
                }
            } as any;

            uploadManager = new FileUploadManager(mockDependencies);

            // MessageChannelのモック
            const mockMessageChannel = {
                port1: { onmessage: null as any },
                port2: {}
            };

            Object.defineProperty(window, 'MessageChannel', {
                value: vi.fn().mockImplementation(() => mockMessageChannel),
                writable: true
            });

            const getSharedPromise = uploadManager.getSharedImageFromServiceWorker();

            // 非同期でメッセージを送信
            setTimeout(() => {
                const mockSharedData: SharedImageData = {
                    image: createMockFile('shared.jpg', 'image/jpeg', 1000000),
                    metadata: { name: 'shared.jpg' }
                };

                if (mockMessageChannel.port1.onmessage) {
                    mockMessageChannel.port1.onmessage({
                        data: mockSharedData
                    } as any);
                }
            }, 10);

            const result = await getSharedPromise;

            expect(mockController.postMessage).toHaveBeenCalled();
            expect(result).toBeTruthy();
            expect(result?.image.name).toBe('shared.jpg');
        });

        it('Service Workerコントローラーがない場合はnullを返す', async () => {
            mockDependencies.navigator = {
                serviceWorker: { controller: null }
            } as any;

            uploadManager = new FileUploadManager(mockDependencies);

            const result = await uploadManager.getSharedImageFromServiceWorker();
            expect(result).toBeNull();
        });
    });

    describe('エラーハンドリング', () => {
        it('ファイルが選択されていない場合のエラー', async () => {
            const result = await uploadManager.uploadFile(null as any);
            expect(result.success).toBe(false);
            expect(result.error).toBe('No file selected');
        });

        it('JSONパースエラーを適切に処理する', async () => {
            const file = createMockFile('test.jpg', 'image/jpeg', 1000); // 1KB

            // 認証サービスをモックして認証エラーを回避
            const mockAuthService: AuthService = {
                buildAuthHeader: vi.fn().mockResolvedValue('Bearer mock-token')
            };

            uploadManager = new FileUploadManager(
                mockDependencies,
                mockAuthService
            );

            // jsonメソッドが例外を投げるモックレスポンス
            const mockResponse = createMockResponse(true, 200, null);
            mockResponse.json = vi.fn().mockRejectedValue(new Error('Invalid JSON'));
            mockFetch.mockResolvedValue(mockResponse);

            const result = await uploadManager.uploadFile(file);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Could not parse upload response');
        });
    });
});

// --- 統合テスト ---
describe('FileUploadManager 統合テスト', () => {
    it('実際のファイルアップロードフローを模擬する', async () => {
        const mockDependencies = createMockDependencies();
        const mockStorage = mockDependencies.localStorage as MockStorage;

        // 設定値をセット
        mockStorage.setItem('uploadEndpoint', 'https://upload.example.com');
        mockStorage.setItem('imageCompressionLevel', 'medium');

        // 認証サービスをモックして認証エラーを回避
        const mockAuthService: AuthService = {
            buildAuthHeader: vi.fn().mockResolvedValue('Bearer mock-token')
        };

        const uploadManager = new FileUploadManager(mockDependencies, mockAuthService);
        const file = createMockFile('integration-test.jpg', 'image/jpeg', 1000); // 1KB

        // 成功レスポンスをモック
        const mockFetch = vi.mocked(mockDependencies.fetch);
        mockFetch.mockResolvedValue(createMockResponse(true, 200, {
            status: 'success',
            nip94_event: {
                tags: [
                    ['url', 'https://cdn.example.com/uploaded.jpg'],
                    ['ox', '1234567890abcdef'],
                    ['blurhash', 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.']
                ]
            }
        }));

        const result = await uploadManager.uploadFile(file, '', false, {
            caption: 'Test image',
            alt: 'Integration test'
        });

        expect(result.success).toBe(true);
        expect(result.url).toBe('https://cdn.example.com/uploaded.jpg');
        expect(result.nip94).toEqual({
            url: 'https://cdn.example.com/uploaded.jpg',
            ox: '1234567890abcdef',
            blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.'
        });
    });
});
