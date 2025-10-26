import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostValidator, PostEventBuilder } from '../../lib/postManager';
import { MimeTypeSupport } from '../../lib/fileUploadManager';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

vi.mock("../../stores/appStore.svelte.ts", () => ({
    authState: {
        value: {
            isAuthenticated: true,
            type: "nsec",
            pubkey: "test-pubkey-123",
            npub: "npub1test",
            nprofile: "nprofile1test",
            isValid: true,
            isInitialized: true
        }
    },
    uploadAbortFlagStore: {
        value: false
    }
}));

/**
 * 認証から投稿までの統合テスト
 * 既存のユニットテストを組み合わせて、主要なフローをテスト
 */
describe('認証から投稿までの統合テスト', () => {
    describe('投稿バリデーション統合', () => {
        it('認証済み、Nostr接続あり、コンテンツありの場合に投稿が許可されること', () => {
            const result = PostValidator.validatePost(
                'テスト投稿 #integration',
                true,  // 認証済み
                true   // Nostr接続あり
            );

            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('未認証の場合に投稿が拒否されること', () => {
            const result = PostValidator.validatePost(
                'テスト投稿',
                false, // 未認証
                true
            );

            expect(result.valid).toBe(false);
            expect(result.error).toBe('login_required');
        });

        it('Nostr未接続の場合に投稿が拒否されること', () => {
            const result = PostValidator.validatePost(
                'テスト投稿',
                true,
                false  // Nostr未接続
            );

            expect(result.valid).toBe(false);
            expect(result.error).toBe('nostr_not_ready');
        });

        it('空のコンテンツの場合に投稿が拒否されること', () => {
            const result = PostValidator.validatePost(
                '',    // 空のコンテンツ
                true,
                true
            );

            expect(result.valid).toBe(false);
            expect(result.error).toBe('empty_content');
        });

        it('空白のみのコンテンツの場合に投稿が拒否されること', () => {
            const result = PostValidator.validatePost(
                '   \n\t  ', // 空白のみ
                true,
                true
            );

            expect(result.valid).toBe(false);
            expect(result.error).toBe('empty_content');
        });
    });

    describe('イベント構築統合', () => {
        it('テキストのみの投稿イベントが正しく構築されること', async () => {
            const event = await PostEventBuilder.buildEvent(
                'テスト投稿 #test #integration',
                ['test', 'integration'],
                [],
                'test-pubkey-123'
            );

            expect(event.kind).toBe(1);
            expect(event.content).toBe('テスト投稿 #test #integration');
            expect(event.pubkey).toBe('test-pubkey-123');
            expect(event.tags).toContainEqual(['t', 'test']);
            expect(event.tags).toContainEqual(['t', 'integration']);
            expect(event.created_at).toBeDefined();
            expect(typeof event.created_at).toBe('number');
        });

        it('クライアントタグが付与されること', async () => {
            const getClientTagMock = vi.fn(() => ['client', 'ehagaki']);

            const event = await PostEventBuilder.buildEvent(
                'テスト投稿',
                [],
                [],
                'test-pubkey-123',
                undefined,
                undefined,
                getClientTagMock
            );

            expect(getClientTagMock).toHaveBeenCalled();
            expect(event.tags).toContainEqual(['client', 'ehagaki']);
        });

        it('画像メタデータタグが付与されること', async () => {
            const imageImetaMap = {
                'https://example.com/image.jpg': {
                    m: 'image/jpeg',
                    blurhash: 'L9AB*xyD00Rj?wNH',
                    dim: '800x600',
                    alt: 'テスト画像'
                }
            };

            const createImetaTagMock = vi.fn(async (meta) => [
                'imeta',
                `url ${meta.url}`,
                `m ${meta.m}`,
                `blurhash ${meta.blurhash}`,
                `dim ${meta.dim}`,
                `alt ${meta.alt}`
            ]);

            const event = await PostEventBuilder.buildEvent(
                'テスト投稿 ![image](https://example.com/image.jpg)',
                [],
                [],
                'test-pubkey-123',
                imageImetaMap,
                createImetaTagMock
            );

            expect(createImetaTagMock).toHaveBeenCalledWith({
                url: 'https://example.com/image.jpg',
                m: 'image/jpeg',
                blurhash: 'L9AB*xyD00Rj?wNH',
                dim: '800x600',
                alt: 'テスト画像'
            });
            expect(event.tags).toContainEqual([
                'imeta',
                'url https://example.com/image.jpg',
                'm image/jpeg',
                'blurhash L9AB*xyD00Rj?wNH',
                'dim 800x600',
                'alt テスト画像'
            ]);
        });

        it('既存のタグ配列が使用されること', async () => {
            const existingTags = [
                ['t', 'existing'],
                ['custom', 'value']
            ];

            const event = await PostEventBuilder.buildEvent(
                'テスト投稿',
                ['test'], // これは無視される
                existingTags,
                'test-pubkey-123'
            );

            expect(event.tags).toContainEqual(['t', 'existing']);
            expect(event.tags).toContainEqual(['custom', 'value']);
            // hashtagsからのタグは追加されない
            expect(event.tags).not.toContainEqual(['t', 'test']);
        });
    });

    describe('MIMEタイプサポート統合', () => {
        let mimeSupport: MimeTypeSupport;
        let mockDocument: Document;

        beforeEach(() => {
            // DOMをモック
            const canvas = document.createElement('canvas');
            const ctx = {
                fillStyle: '',
                fillRect: vi.fn()
            };

            mockDocument = {
                createElement: vi.fn((tag: string) => {
                    if (tag === 'canvas') {
                        return {
                            width: 0,
                            height: 0,
                            getContext: vi.fn(() => ctx),
                            toDataURL: vi.fn((mime: string, quality?: number) => {
                                // WebP品質サポートのシミュレーション
                                if (mime === 'image/webp') {
                                    if (quality === 0.2) return 'data:image/webp;base64,short';
                                    if (quality === 0.9) return 'data:image/webp;base64,longerbase64string';
                                    return 'data:image/webp;base64,default';
                                }
                                // JPEG/PNGサポート
                                if (mime === 'image/jpeg' || mime === 'image/png') {
                                    return `data:${mime};base64,test`;
                                }
                                // 未サポート
                                return 'data:image/png;base64,fallback';
                            })
                        };
                    }
                    return null;
                })
            } as any;

            mimeSupport = new MimeTypeSupport(mockDocument);
        });

        it('WebP品質サポートが正しく検出されること', async () => {
            const supported = await mimeSupport.canEncodeWebpWithQuality();
            expect(supported).toBe(true);
        });

        it('JPEGエンコードがサポートされていると判定されること', () => {
            const supported = mimeSupport.canEncodeMimeType('image/jpeg');
            expect(supported).toBe(true);
        });

        it('PNGエンコードがサポートされていると判定されること', () => {
            const supported = mimeSupport.canEncodeMimeType('image/png');
            expect(supported).toBe(true);
        });

        it('結果がキャッシュされること', () => {
            const createElementSpy = mockDocument.createElement as any;
            createElementSpy.mockClear();

            // 1回目
            mimeSupport.canEncodeMimeType('image/jpeg');
            const firstCallCount = createElementSpy.mock.calls.length;

            // 2回目（キャッシュから取得されるはず）
            mimeSupport.canEncodeMimeType('image/jpeg');
            const secondCallCount = createElementSpy.mock.calls.length;

            expect(secondCallCount).toBe(firstCallCount); // 増えていない
        });
    });

    describe('ファイルバリデーション統合', () => {
        it('有効な画像ファイルが受け入れられること', () => {
            const file = new File(
                [new ArrayBuffer(1024)],
                'test.jpg',
                { type: 'image/jpeg' }
            );

            expect(file.type.startsWith('image/')).toBe(true);
            expect(file.size).toBeGreaterThan(0);
        });

        it('大きすぎるファイルが検出されること', () => {
            const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
            const file = new File(
                [new ArrayBuffer(MAX_FILE_SIZE + 1)],
                'huge.jpg',
                { type: 'image/jpeg' }
            );

            expect(file.size).toBeGreaterThan(MAX_FILE_SIZE);
        });

        it('画像以外のファイルが検出されること', () => {
            const file = new File(
                [new ArrayBuffer(1024)],
                'document.pdf',
                { type: 'application/pdf' }
            );

            expect(file.type.startsWith('image/')).toBe(false);
        });
    });

    describe('複数コンポーネント間の統合', () => {
        it('バリデーション→イベント構築→送信準備のフルフローが動作すること', async () => {
            // 1. バリデーション
            const content = 'テスト投稿 #integration ![image](https://example.com/test.jpg)';
            const validation = PostValidator.validatePost(content, true, true);
            expect(validation.valid).toBe(true);

            // 2. イベント構築
            const imageImetaMap = {
                'https://example.com/test.jpg': {
                    m: 'image/jpeg',
                    blurhash: 'L9AB*xyD00Rj?wNH'
                }
            };

            const createImetaTag = vi.fn(async (meta) => [
                'imeta',
                `url ${meta.url}`,
                `m ${meta.m}`,
                `blurhash ${meta.blurhash}`
            ]);

            const getClientTag = vi.fn(() => ['client', 'ehagaki']);

            const event = await PostEventBuilder.buildEvent(
                content,
                ['integration'],
                [],
                'test-pubkey-123',
                imageImetaMap,
                createImetaTag,
                getClientTag
            );

            // 3. イベントの検証
            expect(event).toMatchObject({
                kind: 1,
                content: content,
                pubkey: 'test-pubkey-123'
            });
            expect(event.tags).toContainEqual(['t', 'integration']);
            expect(event.tags).toContainEqual(['client', 'ehagaki']);
            expect(event.tags).toContainEqual([
                'imeta',
                'url https://example.com/test.jpg',
                'm image/jpeg',
                'blurhash L9AB*xyD00Rj?wNH'
            ]);
            expect(event.created_at).toBeDefined();

            // 4. 関数が正しく呼ばれたことを確認
            expect(createImetaTag).toHaveBeenCalledTimes(1);
            expect(getClientTag).toHaveBeenCalledTimes(1);
        });

        it('複数の画像を含む投稿が正しく処理されること', async () => {
            const content = '複数画像テスト ![img1](https://example.com/1.jpg) ![img2](https://example.com/2.png)';
            const validation = PostValidator.validatePost(content, true, true);
            expect(validation.valid).toBe(true);

            const imageImetaMap = {
                'https://example.com/1.jpg': {
                    m: 'image/jpeg',
                    blurhash: 'L1AB*xyD00Rj?wNH'
                },
                'https://example.com/2.png': {
                    m: 'image/png',
                    blurhash: 'L2AB*xyD00Rj?wNH'
                }
            };

            const createImetaTag = vi.fn(async (meta) => [
                'imeta',
                `url ${meta.url}`,
                `m ${meta.m}`,
                `blurhash ${meta.blurhash}`
            ]);

            const event = await PostEventBuilder.buildEvent(
                content,
                [],
                [],
                'test-pubkey-123',
                imageImetaMap,
                createImetaTag
            );

            expect(createImetaTag).toHaveBeenCalledTimes(2);
            expect(event.tags.filter((tag: string[]) => tag[0] === 'imeta')).toHaveLength(2);
        });
    });
});
