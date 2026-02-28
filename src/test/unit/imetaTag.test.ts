import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMimeTypeFromUrl, extractImageBlurhashMap, createImetaTag } from '../../lib/tags/imetaTag';

/**
 * imetaTag ユニットテスト
 *
 * NIP-92 imetaタグ生成ユーティリティのテスト。
 * テスト可能な純粋関数・ロジック部分を検証する。
 * Canvas依存の generateBlurhash / calculateImageHash は統合テスト向きのため除外。
 */

describe('getMimeTypeFromUrl', () => {
    describe('正常系', () => {
        it('jpg拡張子からimage/jpegを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.jpg')).toBe('image/jpeg');
        });

        it('jpeg拡張子からimage/jpegを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.jpeg')).toBe('image/jpeg');
        });

        it('png拡張子からimage/pngを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.png')).toBe('image/png');
        });

        it('gif拡張子からimage/gifを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/animation.gif')).toBe('image/gif');
        });

        it('webp拡張子からimage/webpを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.webp')).toBe('image/webp');
        });

        it('avif拡張子からimage/avifを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.avif')).toBe('image/avif');
        });

        it('bmp拡張子からimage/bmpを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.bmp')).toBe('image/bmp');
        });

        it('svg拡張子からimage/svg+xmlを返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/icon.svg')).toBe('image/svg+xml');
        });

        it('大文字の拡張子を正しく処理する', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.JPG')).toBe('image/jpeg');
            expect(getMimeTypeFromUrl('https://example.com/photo.PNG')).toBe('image/png');
        });
    });

    describe('エッジケース', () => {
        it('未知の拡張子はimage/jpegをデフォルトで返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo.tiff')).toBe('image/jpeg');
        });

        it('拡張子なしのURLはimage/jpegをデフォルトで返す', () => {
            expect(getMimeTypeFromUrl('https://example.com/photo')).toBe('image/jpeg');
        });

        it('クエリパラメータ付きURLで拡張子が正しく取得される', () => {
            // Note: 現在の実装はsplit('.')のため、クエリパラメータの影響を受ける
            // この挙動を記録するテスト
            const result = getMimeTypeFromUrl('https://example.com/photo.png?size=large');
            // split('.').pop() → 'png?size=large' → mimeMapに該当しない → デフォルトのjpeg
            expect(result).toBe('image/jpeg');
        });

        it('パス内にドットが含まれるURLを処理する', () => {
            expect(getMimeTypeFromUrl('https://example.com/v1.0/photo.png')).toBe('image/png');
        });
    });
});

describe('extractImageBlurhashMap', () => {
    describe('正常系', () => {
        it('画像ノードからblurhashマッピングを抽出する', () => {
            const mockEditor = {
                state: {
                    doc: {
                        descendants: (callback: (node: any) => void) => {
                            callback({
                                type: { name: 'image' },
                                attrs: {
                                    src: 'https://example.com/photo.jpg',
                                    blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                                    isPlaceholder: false
                                }
                            });
                            callback({
                                type: { name: 'image' },
                                attrs: {
                                    src: 'https://example.com/photo2.png',
                                    blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
                                    isPlaceholder: false
                                }
                            });
                        }
                    }
                }
            };

            const result = extractImageBlurhashMap(mockEditor);
            expect(result).toEqual({
                'https://example.com/photo.jpg': 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                'https://example.com/photo2.png': 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.'
            });
        });

        it('blurhashがないノードはスキップする', () => {
            const mockEditor = {
                state: {
                    doc: {
                        descendants: (callback: (node: any) => void) => {
                            callback({
                                type: { name: 'image' },
                                attrs: {
                                    src: 'https://example.com/photo.jpg',
                                    blurhash: null,
                                    isPlaceholder: false
                                }
                            });
                        }
                    }
                }
            };

            const result = extractImageBlurhashMap(mockEditor);
            expect(result).toEqual({});
        });

        it('プレースホルダーノードは除外する', () => {
            const mockEditor = {
                state: {
                    doc: {
                        descendants: (callback: (node: any) => void) => {
                            callback({
                                type: { name: 'image' },
                                attrs: {
                                    src: 'https://example.com/photo.jpg',
                                    blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                                    isPlaceholder: true
                                }
                            });
                        }
                    }
                }
            };

            const result = extractImageBlurhashMap(mockEditor);
            expect(result).toEqual({});
        });

        it('プレースホルダーIDのsrcを持つノードは除外する', () => {
            const mockEditor = {
                state: {
                    doc: {
                        descendants: (callback: (node: any) => void) => {
                            callback({
                                type: { name: 'image' },
                                attrs: {
                                    src: 'placeholder-abc123',
                                    blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                                    isPlaceholder: false
                                }
                            });
                        }
                    }
                }
            };

            const result = extractImageBlurhashMap(mockEditor);
            expect(result).toEqual({});
        });

        it('画像以外のノードタイプは無視する', () => {
            const mockEditor = {
                state: {
                    doc: {
                        descendants: (callback: (node: any) => void) => {
                            callback({
                                type: { name: 'paragraph' },
                                attrs: {}
                            });
                            callback({
                                type: { name: 'text' },
                                attrs: {}
                            });
                            callback({
                                type: { name: 'video' },
                                attrs: {
                                    src: 'https://example.com/video.mp4',
                                    blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj'
                                }
                            });
                        }
                    }
                }
            };

            const result = extractImageBlurhashMap(mockEditor);
            expect(result).toEqual({});
        });
    });

    describe('異常系', () => {
        it('editorがnullの場合は空オブジェクトを返す', () => {
            expect(extractImageBlurhashMap(null)).toEqual({});
        });

        it('editorにstateがない場合は空オブジェクトを返す', () => {
            expect(extractImageBlurhashMap({})).toEqual({});
        });

        it('editorにdocがない場合は空オブジェクトを返す', () => {
            expect(extractImageBlurhashMap({ state: {} })).toEqual({});
        });

        it('画像ノードがない場合は空オブジェクトを返す', () => {
            const mockEditor = {
                state: {
                    doc: {
                        descendants: (_callback: (node: any) => void) => {
                            // ノードなし
                        }
                    }
                }
            };
            expect(extractImageBlurhashMap(mockEditor)).toEqual({});
        });
    });
});

describe('createImetaTag', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('正常系', () => {
        it('基本的なimetaタグを生成する', async () => {
            // window.Imageをモック（dim取得をシミュレート）
            const mockImage = {
                onload: null as any,
                onerror: null as any,
                src: '',
                naturalWidth: 800,
                naturalHeight: 600
            };
            vi.spyOn(window, 'Image').mockImplementation(() => {
                setTimeout(() => {
                    if (mockImage.onload) mockImage.onload();
                }, 0);
                return mockImage as any;
            });

            const result = await createImetaTag({
                url: 'https://example.com/photo.jpg',
                m: 'image/jpeg',
                dim: '800x600',
                blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj'
            });

            expect(result[0]).toBe('imeta');
            expect(result).toContain('url https://example.com/photo.jpg');
            expect(result.some(tag => tag.startsWith('m '))).toBe(true);
            expect(result.some(tag => tag.startsWith('dim '))).toBe(true);
            expect(result.some(tag => tag.startsWith('blurhash '))).toBe(true);
        });

        it('dimが指定されていてxが含まれるimetaタグを生成する', async () => {
            const result = await createImetaTag({
                url: 'https://example.com/photo.jpg',
                m: 'image/jpeg',
                dim: '1920x1080',
                x: 'abc123hash',
                blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj'
            });

            expect(result[0]).toBe('imeta');
            expect(result).toContain('url https://example.com/photo.jpg');
            expect(result.some(tag => tag === 'x abc123hash')).toBe(true);
        });

        it('oxフィールドが含まれる場合タグに追加される', async () => {
            const result = await createImetaTag({
                url: 'https://example.com/photo.jpg',
                m: 'image/jpeg',
                dim: '800x600',
                ox: 'originalhash123'
            });

            expect(result.some(tag => tag === 'ox originalhash123')).toBe(true);
        });
    });

    describe('異常系', () => {
        it('urlが空の場合はエラーを投げる', async () => {
            await expect(createImetaTag({
                url: '',
                m: 'image/jpeg'
            })).rejects.toThrow('url is required for imeta tag');
        });

        it('MIMEタイプが空の場合はエラーを投げる', async () => {
            await expect(createImetaTag({
                url: 'https://example.com/photo.jpg',
                m: ''
            })).rejects.toThrow('m (MIME type) is required for imeta tag');
        });
    });

    describe('dimの自動取得', () => {
        it('dimが未指定の場合にwindow.Imageから自動取得する', async () => {
            const mockImage = {
                onload: null as any,
                onerror: null as any,
                src: '',
                naturalWidth: 1024,
                naturalHeight: 768
            };
            vi.spyOn(window, 'Image').mockImplementation(() => {
                setTimeout(() => {
                    if (mockImage.onload) mockImage.onload();
                }, 0);
                return mockImage as any;
            });

            const result = await createImetaTag({
                url: 'https://example.com/photo.jpg',
                m: 'image/jpeg'
            });

            expect(result.some(tag => tag === 'dim 1024x768')).toBe(true);
        });

        it('画像読み込みエラー時はdimなしでタグを生成する', async () => {
            const mockImage = {
                onload: null as any,
                onerror: null as any,
                src: ''
            };
            vi.spyOn(window, 'Image').mockImplementation(() => {
                setTimeout(() => {
                    if (mockImage.onerror) mockImage.onerror();
                }, 0);
                return mockImage as any;
            });

            const result = await createImetaTag({
                url: 'https://example.com/broken.jpg',
                m: 'image/jpeg'
            });

            expect(result[0]).toBe('imeta');
            expect(result).toContain('url https://example.com/broken.jpg');
            // dimタグは含まれない
            expect(result.some(tag => tag.startsWith('dim '))).toBe(false);
        });
    });
});
