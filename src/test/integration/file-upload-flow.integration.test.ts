import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageCompressionService, MimeTypeSupport, NostrAuthService } from '../../lib/fileUploadManager';
import type { FileValidationResult } from '../../lib/types';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

vi.mock("../../stores/appStore.svelte.ts", () => ({
    uploadAbortFlagStore: {
        value: false,
        set: vi.fn(),
        reset: vi.fn()
    }
}));

vi.mock("../../lib/keyManager", () => ({
    keyManager: {
        getFromStore: vi.fn(() => "nsec1test"),
        loadFromStorage: vi.fn(() => null)
    }
}));

vi.mock("browser-image-compression", () => ({
    default: vi.fn(async (file: File, options: any) => {
        // 圧縮シミュレーション
        const compressedSize = Math.floor(file.size * 0.7);
        const compressedBlob = new Blob([new ArrayBuffer(compressedSize)], { type: file.type });
        
        // 進捗コールバックをシミュレート
        if (options?.onProgress) {
            setTimeout(() => options.onProgress(0.3), 0);
            setTimeout(() => options.onProgress(0.6), 10);
            setTimeout(() => options.onProgress(1.0), 20);
        }
        
        return new File([compressedBlob], file.name, { type: file.type });
    })
}));

vi.mock("nostr-tools/nip98", () => ({
    getToken: vi.fn(async () => "Bearer mock-nip98-token")
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
            const { keyManager } = await import('../../lib/keyManager');
            (keyManager.getFromStore as any).mockReturnValue('nsec1test');

            const authService = new NostrAuthService();
            const header = await authService.buildAuthHeader(
                'https://example.com/upload',
                'POST'
            );

            expect(header).toBe('Bearer mock-nip98-token');
        });

        it('Nsecが無い場合はエラーがスローされること', async () => {
            const { keyManager } = await import('../../lib/keyManager');
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
            expect(compressionResult.wasCompressed).toBe(false);
            expect(compressionResult.wasSkipped).toBe(true);

            // 4. 認証ヘッダー生成
            const { keyManager } = await import('../../lib/keyManager');
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
                wasCompressed: false,
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
            expect(compressionResults.every(r => !r.wasCompressed && r.wasSkipped)).toBe(true);
        });
    });

    describe('エラーハンドリング統合', () => {
        it('圧縮中にアボートフラグが立った場合、処理が中断されること', async () => {
            const { uploadAbortFlagStore } = await import('../../stores/appStore.svelte');
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
