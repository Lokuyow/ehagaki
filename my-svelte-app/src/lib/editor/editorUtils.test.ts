import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as editorUtils from '../utils/editorUtils';

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

    describe('ドラッグプレビュー計算', () => {
        describe('calculatePreviewDimensions', () => {
            it('should calculate preview dimensions', () => {
                const rect = new DOMRect(0, 0, 200, 150);
                const result = editorUtils.calculatePreviewDimensions(rect, 140);

                expect(result.width).toBe(140);
                expect(result.height).toBe(105); // 150/200 * 140 = 105
            });

            it('should handle zero width', () => {
                const rect = new DOMRect(0, 0, 0, 150);
                const result = editorUtils.calculatePreviewDimensions(rect, 140);

                expect(result.width).toBe(140);
                expect(result.height).toBe(140);
            });
        });

        describe('applyPreviewStyles', () => {
            it('should apply preview styles', () => {
                const element = document.createElement('div');
                const dimensions = { width: 100, height: 80 };
                const position = { x: 50, y: 40 };

                editorUtils.applyPreviewStyles(element, dimensions, position);

                expect(element.style.width).toBe('100px');
                expect(element.style.height).toBe('80px');
                expect(element.style.left).toBe('0px'); // 50 - 100/2
                expect(element.style.top).toBe('0px'); // 40 - 80/2
            });
        });
    });

    describe('DOM操作', () => {
        beforeEach(() => {
            // DOM のセットアップ
            document.body.innerHTML = '';
        });

        describe('clearAllDropZoneHighlights', () => {
            it('should clear all drop zone highlights', () => {
                const zone1 = document.createElement('div');
                zone1.className = 'drop-zone-indicator drop-zone-hover';
                const zone2 = document.createElement('div');
                zone2.className = 'drop-zone-indicator drop-zone-hover';
                document.body.appendChild(zone1);
                document.body.appendChild(zone2);

                editorUtils.clearAllDropZoneHighlights();

                expect(zone1.classList.contains('drop-zone-hover')).toBe(false);
                expect(zone2.classList.contains('drop-zone-hover')).toBe(false);
            });
        });

        describe('highlightDropZone', () => {
            it('should highlight drop zone', () => {
                const zone = document.createElement('div');
                zone.className = 'drop-zone-indicator';

                editorUtils.highlightDropZone(zone);
                expect(zone.classList.contains('drop-zone-hover')).toBe(true);
            });

            it('should handle null zone', () => {
                expect(() => editorUtils.highlightDropZone(null)).not.toThrow();
            });
        });

        describe('checkMoveThreshold', () => {
            it('should check move threshold', () => {
                expect(editorUtils.checkMoveThreshold(10, 10, 0, 0, 5)).toBe(true);
                expect(editorUtils.checkMoveThreshold(3, 3, 0, 0, 5)).toBe(false);
            });
        });
    });

    describe('イベント処理', () => {
        let customEventSpy: any;

        beforeEach(() => {
            customEventSpy = vi.spyOn(window, 'dispatchEvent');
        });

        afterEach(() => {
            customEventSpy.mockRestore();
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

        describe('requestNodeSelection', () => {
            it('should dispatch node selection event', () => {
                const getPos = vi.fn().mockReturnValue(5);
                editorUtils.requestNodeSelection(getPos);

                expect(customEventSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'select-image-node',
                        detail: { pos: 5 }
                    })
                );
            });
        });

        describe('dispatchDragEvent', () => {
            it('should dispatch drag events', () => {
                const getPos = vi.fn().mockReturnValue(10);
                editorUtils.dispatchDragEvent('start', {}, getPos);

                expect(customEventSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'touch-image-drag-start'
                    })
                );
            });
        });
    });

    describe('画像インタラクション', () => {
        describe('shouldPreventInteraction', () => {
            it('should prevent interaction when dragging', () => {
                expect(editorUtils.shouldPreventInteraction(true, false, false, false)).toBe(true);
            });

            it('should prevent interaction when placeholder', () => {
                expect(editorUtils.shouldPreventInteraction(false, true, false, false)).toBe(true);
            });

            it('should prevent interaction when just selected and not touch', () => {
                expect(editorUtils.shouldPreventInteraction(false, false, true, false)).toBe(true);
            });

            it('should allow interaction when just selected and touch', () => {
                expect(editorUtils.shouldPreventInteraction(false, false, true, true)).toBe(false);
            });

            it('should allow normal interaction', () => {
                expect(editorUtils.shouldPreventInteraction(false, false, false, false)).toBe(false);
            });
        });
    });

    describe('Blurhash描画', () => {
        describe('validateBlurhashParams', () => {
            it('should validate blurhash parameters', () => {
                const canvas = document.createElement('canvas');
                const dimensions = { displayWidth: 100, displayHeight: 80 };

                expect(editorUtils.validateBlurhashParams('validhash', canvas, dimensions)).toBe(true);
                expect(editorUtils.validateBlurhashParams('', canvas, dimensions)).toBe(false);
                expect(editorUtils.validateBlurhashParams('validhash', null as any, dimensions)).toBe(false);
                expect(editorUtils.validateBlurhashParams('validhash', canvas, { displayWidth: 0, displayHeight: 80 })).toBe(false);
            });
        });

        describe('setupCanvas', () => {
            it('should setup canvas dimensions', () => {
                const canvas = document.createElement('canvas');
                const dimensions = { displayWidth: 200, displayHeight: 150 };

                editorUtils.setupCanvas(canvas, dimensions);

                expect(canvas.width).toBe(200);
                expect(canvas.height).toBe(150);
            });
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
                        // Simulate paragraph node
                        callback({
                            type: { name: 'paragraph' },
                            textContent: 'Hello world'
                        });

                        // Simulate image node
                        callback({
                            type: { name: 'image' },
                            attrs: { src: 'https://example.com/image.jpg' }
                        });
                    })
                };

                const result = editorUtils.extractFragmentsFromDoc(mockDoc);
                expect(result).toEqual(['Hello world', 'https://example.com/image.jpg']);
            });
        });

        describe('getDocumentFromEditor', () => {
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
