import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import * as editorUtils from '../lib/utils/editorUtils';

// モック設定
vi.mock('../constants', () => ({
    ALLOWED_PROTOCOLS: ['http:', 'https:'],
    ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
}));

describe('editorUtils', () => {
    describe('URL検証・正規化', () => {
        describe('normalizeUrl', () => {
            it('should trim and encode URL', () => {
                expect(editorUtils.normalizeUrl('  https://example.com  ')).toBe('https://example.com');
                expect(editorUtils.normalizeUrl('https://example.com/パス')).toBe('https://example.com/%E3%83%91%E3%82%B9');
            });
        });

        describe('isValidProtocol', () => {
            it('should validate allowed protocols', () => {
                expect(editorUtils.isValidProtocol('https:')).toBe(true);
                expect(editorUtils.isValidProtocol('http:')).toBe(true);
                expect(editorUtils.isValidProtocol('ftp:')).toBe(false);
                expect(editorUtils.isValidProtocol('javascript:')).toBe(false);
            });
        });

        describe('isValidImageExtension', () => {
            it('should validate image extensions', () => {
                expect(editorUtils.isValidImageExtension('/image.jpg')).toBe(true);
                expect(editorUtils.isValidImageExtension('/image.PNG')).toBe(true);
                expect(editorUtils.isValidImageExtension('/image.webp')).toBe(true);
                expect(editorUtils.isValidImageExtension('/document.pdf')).toBe(false);
            });
        });

        describe('validateAndNormalizeUrl', () => {
            it('should validate and normalize valid URLs', () => {
                expect(editorUtils.validateAndNormalizeUrl('https://example.com')).toBe('https://example.com/');
                expect(editorUtils.validateAndNormalizeUrl('http://example.com/path')).toBe('http://example.com/path');
            });

            it('should return null for invalid URLs', () => {
                expect(editorUtils.validateAndNormalizeUrl('ftp://example.com')).toBe(null);
                expect(editorUtils.validateAndNormalizeUrl('invalid-url')).toBe(null);
                expect(editorUtils.validateAndNormalizeUrl('')).toBe(null);
            });
        });

        describe('validateAndNormalizeImageUrl', () => {
            it('should validate image URLs', () => {
                expect(editorUtils.validateAndNormalizeImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
                expect(editorUtils.validateAndNormalizeImageUrl('https://example.com/image.PNG')).toBe('https://example.com/image.PNG');
            });

            it('should return null for non-image URLs', () => {
                expect(editorUtils.validateAndNormalizeImageUrl('https://example.com/document.pdf')).toBe(null);
                expect(editorUtils.validateAndNormalizeImageUrl('https://example.com')).toBe(null);
            });
        });
    });

    describe('文字列処理', () => {
        describe('isWordBoundary', () => {
            it('should detect word boundaries', () => {
                expect(editorUtils.isWordBoundary(' ')).toBe(true);
                expect(editorUtils.isWordBoundary('\n')).toBe(true);
                expect(editorUtils.isWordBoundary('\u3000')).toBe(true);
                expect(editorUtils.isWordBoundary(undefined)).toBe(true);
                expect(editorUtils.isWordBoundary('a')).toBe(false);
            });
        });

        describe('extractTrailingPunctuation', () => {
            it('should extract trailing punctuation', () => {
                expect(editorUtils.extractTrailingPunctuation('https://example.com...')).toEqual({
                    cleanUrl: 'https://example.com',
                    trailingChars: '...'
                });
                expect(editorUtils.extractTrailingPunctuation('https://example.com')).toEqual({
                    cleanUrl: 'https://example.com',
                    trailingChars: ''
                });
            });
        });

        describe('cleanUrlEnd', () => {
            it('should clean URL end and return length', () => {
                const result = editorUtils.cleanUrlEnd('https://example.com...');
                expect(result.cleanUrl).toBe('https://example.com');
                expect(result.actualLength).toBe('https://example.com'.length);
            });
        });
    });

    describe('ドキュメント状態判定', () => {
        describe('isDocumentEmpty', () => {
            it('should detect empty documents', () => {
                const emptyDoc = {
                    childCount: 1,
                    firstChild: {
                        type: { name: 'paragraph' },
                        content: { size: 0 }
                    }
                };
                expect(editorUtils.isDocumentEmpty(emptyDoc)).toBe(true);

                const nonEmptyDoc = {
                    childCount: 1,
                    firstChild: {
                        type: { name: 'paragraph' },
                        content: { size: 5 }
                    }
                };
                expect(editorUtils.isDocumentEmpty(nonEmptyDoc)).toBe(false);
            });
        });

        describe('isParagraphWithOnlyImageUrl', () => {
            it('should detect paragraph with only image URL', () => {
                const node = {
                    type: { name: 'paragraph' },
                    content: { size: 19 },
                    textContent: 'https://example.com'
                };
                expect(editorUtils.isParagraphWithOnlyImageUrl(node, 19)).toBe(true);
            });
        });
    });

    describe('ノード作成', () => {
        describe('createImageNodeData', () => {
            it('should create image node data', () => {
                const result = editorUtils.createImageNodeData('https://example.com/image.jpg', 'Test');
                expect(result).toEqual({
                    type: 'image',
                    attrs: { src: 'https://example.com/image.jpg', alt: 'Test' }
                });
            });

            it('should return null for invalid URLs', () => {
                expect(editorUtils.createImageNodeData('invalid-url')).toBe(null);
            });
        });

        describe('createParagraphNodeData', () => {
            it('should create paragraph node data', () => {
                expect(editorUtils.createParagraphNodeData('Hello world')).toEqual({
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Hello world' }]
                });

                expect(editorUtils.createParagraphNodeData('')).toEqual({
                    type: 'paragraph',
                    content: []
                });
            });
        });

        describe('parseTextToNodes', () => {
            it('should parse text to nodes', () => {
                const text = 'Hello\nhttps://example.com/image.jpg\nWorld';
                const result = editorUtils.parseTextToNodes(text);

                expect(result).toHaveLength(3);
                expect(result[0].type).toBe('paragraph');
                expect(result[1].type).toBe('image');
                expect(result[2].type).toBe('paragraph');
            });
        });
    });

    describe('ドラッグ＆ドロップ計算', () => {
        describe('calculateDragPositions', () => {
            it('should calculate drag positions correctly', () => {
                // Forward drag
                const result1 = editorUtils.calculateDragPositions(5, 2);
                expect(result1).toEqual({
                    insertPos: 4,
                    deleteStart: 2,
                    deleteEnd: 3
                });

                // Backward drag
                const result2 = editorUtils.calculateDragPositions(2, 5);
                expect(result2).toEqual({
                    insertPos: 2,
                    deleteStart: 6,
                    deleteEnd: 7
                });

                // Same position
                expect(editorUtils.calculateDragPositions(5, 5)).toBe(null);
            });
        });

        describe('createMoveTransaction', () => {
            it('should create move transaction', () => {
                const mockTransaction = {
                    insert: vi.fn().mockReturnThis(),
                    delete: vi.fn().mockReturnThis()
                };
                const mockNode = {};
                const positions = {
                    insertPos: 2,
                    deleteStart: 5,
                    deleteEnd: 6
                };

                const result = editorUtils.createMoveTransaction(mockTransaction, mockNode, positions);
                expect(mockTransaction.insert).toHaveBeenCalledWith(2, mockNode);
                expect(mockTransaction.delete).toHaveBeenCalledWith(5, 6);
            });
        });
    });

    describe('イベント処理', () => {
        let customEventSpy: MockInstance;

        beforeEach(() => {
            customEventSpy = vi.spyOn(window, 'dispatchEvent');
        });

        afterEach(() => {
            if (customEventSpy) {
                customEventSpy.mockRestore();
            }
        });

        describe('requestFullscreenImage', () => {
            it('should dispatch fullscreen event', () => {
                editorUtils.requestFullscreenImage('test.jpg', 'Test image');

                expect(customEventSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'image-fullscreen-request',
                        detail: { src: 'test.jpg', alt: 'Test image' }
                    })
                );
            });
        });

        describe('エディター操作', () => {
            describe('createEditorAdapter', () => {
                it('should create editor adapter', () => {
                    const mockDispatch = vi.fn();
                    const mockEditor = {
                        view: {
                            state: 'test-state',
                            dispatch: mockDispatch
                        },
                        chain: vi.fn().mockReturnValue({ focus: vi.fn() })
                    };

                    const adapter = editorUtils.createEditorAdapter(mockEditor);

                    expect(adapter.getState()).toBe('test-state');
                    expect(typeof adapter.dispatch).toBe('function');
                    expect(adapter.chain()).toBe(mockEditor.chain());
                });
            });

            describe('calculateInsertPositions', () => {
                it('should calculate insert positions', () => {
                    const nodes = [
                        { nodeSize: 3 },
                        { nodeSize: 5 },
                        { nodeSize: 2 }
                    ];

                    const result = editorUtils.calculateInsertPositions(nodes, 10);

                    expect(result).toEqual([
                        { node: nodes[0], position: 10 },
                        { node: nodes[1], position: 13 },
                        { node: nodes[2], position: 18 }
                    ]);
                });
            });
        });

        describe('コンテンツ抽出', () => {
        describe('extractFragmentsFromDoc', () => {
            it('should extract fragments from document', () => {
                const mockDoc = {
                    descendants: vi.fn((callback) => {
                        [
                            {
                                type: { name: 'paragraph' },
                                textContent: 'Hello world'
                            },
                            {
                                type: { name: 'image' },
                                attrs: { src: 'https://example.com/image.jpg' }
                            }
                        ].forEach(node => callback(node));
                    })
                };

                const result = editorUtils.extractFragmentsFromDoc(mockDoc);
                expect(result).toEqual(['Hello world', 'https://example.com/image.jpg']);
            });

            it('should extract video fragments from document', () => {
                const mockDoc = {
                    descendants: vi.fn((callback) => {
                        [
                            {
                                type: { name: 'paragraph' },
                                textContent: 'Video content'
                            },
                            {
                                type: { name: 'video' },
                                attrs: { src: 'https://example.com/video.mp4' }
                            }
                        ].forEach(node => callback(node));
                    })
                };

                const result = editorUtils.extractFragmentsFromDoc(mockDoc);
                expect(result).toEqual(['Video content', 'https://example.com/video.mp4']);
            });

            it('should extract both image and video fragments', () => {
                const mockDoc = {
                    descendants: vi.fn((callback) => {
                        [
                            {
                                type: { name: 'image' },
                                attrs: { src: 'https://example.com/image.jpg' }
                            },
                            {
                                type: { name: 'video' },
                                attrs: { src: 'https://example.com/video.mp4' }
                            }
                        ].forEach(node => callback(node));
                    })
                };

                const result = editorUtils.extractFragmentsFromDoc(mockDoc);
                expect(result).toEqual(['https://example.com/image.jpg', 'https://example.com/video.mp4']);
            });
        });            describe('getDocumentFromEditor', () => {
                it('should get document from editor', () => {
                    const mockDoc = { type: 'doc' };
                    const mockEditor = {
                        state: { doc: mockDoc }
                    };

                    const result = editorUtils.getDocumentFromEditor(mockEditor);
                    expect(result).toBe(mockDoc);
                });

                it('should handle function editor', () => {
                    const mockDoc = { type: 'doc' };
                    const mockEditor = () => ({ state: { doc: mockDoc } });

                    const result = editorUtils.getDocumentFromEditor(mockEditor);
                    expect(result).toBe(mockDoc);
                });

                it('should return null for invalid editor', () => {
                    expect(editorUtils.getDocumentFromEditor(null)).toBe(null);
                    expect(editorUtils.getDocumentFromEditor({})).toBe(null);
                });
            });
        });
    });
});