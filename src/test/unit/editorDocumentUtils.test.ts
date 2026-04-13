import { describe, it, expect, vi } from 'vitest';
import type { Editor as TipTapEditor } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import {
    calculateInsertPositions,
    createEditorAdapter,
    createImageNodeData,
    createParagraphNodeData,
    extractFragmentsFromDoc,
    getDocumentFromEditor,
    isDocumentEmpty,
    isParagraphWithOnlyImageUrl,
    parseTextToNodes,
} from '../../lib/utils/editorDocumentUtils';

vi.mock('../../constants', () => ({
    ALLOWED_PROTOCOLS: ['http:', 'https:'],
    ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    ALLOWED_VIDEO_EXTENSIONS: ['.mp4', '.webm', '.mov'],
}));

describe('editorDocumentUtils', () => {
    describe('ドキュメント状態判定', () => {
        it('should detect empty documents', () => {
            const emptyDoc = {
                childCount: 1,
                firstChild: {
                    type: { name: 'paragraph' },
                    content: { size: 0 },
                },
            };
            expect(isDocumentEmpty(emptyDoc as unknown as PMNode)).toBe(true);

            const nonEmptyDoc = {
                childCount: 1,
                firstChild: {
                    type: { name: 'paragraph' },
                    content: { size: 5 },
                },
            };
            expect(isDocumentEmpty(nonEmptyDoc as unknown as PMNode)).toBe(false);
        });

        it('should detect paragraph with only image URL', () => {
            const node = {
                type: { name: 'paragraph' },
                content: { size: 19 },
                textContent: 'https://example.com',
            };
            expect(isParagraphWithOnlyImageUrl(node as unknown as PMNode, 19)).toBe(true);
        });
    });

    describe('ノード作成', () => {
        it('should create image node data', () => {
            const result = createImageNodeData('https://example.com/image.jpg', 'Test');
            expect(result).toEqual({
                type: 'image',
                attrs: { src: 'https://example.com/image.jpg', alt: 'Test' },
            });
        });

        it('should return null for invalid URLs', () => {
            expect(createImageNodeData('invalid-url')).toBe(null);
        });

        it('should create paragraph node data', () => {
            expect(createParagraphNodeData('Hello world')).toEqual({
                type: 'paragraph',
                content: [{ type: 'text', text: 'Hello world' }],
            });

            expect(createParagraphNodeData('')).toEqual({
                type: 'paragraph',
                content: [],
            });
        });

        it('should parse text to nodes', () => {
            const text = 'Hello\nhttps://example.com/image.jpg\nWorld';
            const result = parseTextToNodes(text);

            expect(result).toHaveLength(3);
            expect(result[0].type).toBe('paragraph');
            expect(result[1].type).toBe('image');
            expect(result[2].type).toBe('paragraph');
        });
    });

    describe('エディター操作', () => {
        it('should create editor adapter', () => {
            const mockDispatch = vi.fn();
            const mockEditor = {
                view: {
                    state: 'test-state',
                    dispatch: mockDispatch,
                },
                chain: vi.fn().mockReturnValue({ focus: vi.fn() }),
            };

            const adapter = createEditorAdapter(mockEditor as unknown as TipTapEditor);

            expect(adapter.getState()).toBe('test-state');
            expect(typeof adapter.dispatch).toBe('function');
            expect(adapter.chain()).toBe(mockEditor.chain());
        });

        it('should calculate insert positions', () => {
            const nodes = [
                { nodeSize: 3 },
                { nodeSize: 5 },
                { nodeSize: 2 },
            ];

            const result = calculateInsertPositions(nodes as unknown as PMNode[], 10);

            expect(result).toEqual([
                { node: nodes[0], position: 10 },
                { node: nodes[1], position: 13 },
                { node: nodes[2], position: 18 },
            ]);
        });
    });

    describe('コンテンツ抽出', () => {
        it('should extract fragments from document', () => {
            const mockDoc = {
                descendants: vi.fn((callback) => {
                    [
                        {
                            type: { name: 'paragraph' },
                            textContent: 'Hello world',
                        },
                        {
                            type: { name: 'image' },
                            attrs: { src: 'https://example.com/image.jpg' },
                        },
                    ].forEach(node => callback(node));
                }),
            };

            const result = extractFragmentsFromDoc(mockDoc as unknown as PMNode);
            expect(result).toEqual(['Hello world', 'https://example.com/image.jpg']);
        });

        it('should extract video fragments from document', () => {
            const mockDoc = {
                descendants: vi.fn((callback) => {
                    [
                        {
                            type: { name: 'paragraph' },
                            textContent: 'Video content',
                        },
                        {
                            type: { name: 'video' },
                            attrs: { src: 'https://example.com/video.mp4' },
                        },
                    ].forEach(node => callback(node));
                }),
            };

            const result = extractFragmentsFromDoc(mockDoc as unknown as PMNode);
            expect(result).toEqual(['Video content', 'https://example.com/video.mp4']);
        });

        it('should extract both image and video fragments', () => {
            const mockDoc = {
                descendants: vi.fn((callback) => {
                    [
                        {
                            type: { name: 'image' },
                            attrs: { src: 'https://example.com/image.jpg' },
                        },
                        {
                            type: { name: 'video' },
                            attrs: { src: 'https://example.com/video.mp4' },
                        },
                    ].forEach(node => callback(node));
                }),
            };

            const result = extractFragmentsFromDoc(mockDoc as unknown as PMNode);
            expect(result).toEqual(['https://example.com/image.jpg', 'https://example.com/video.mp4']);
        });

        it('should get document from editor', () => {
            const mockDoc = { type: 'doc' };
            const mockEditor = {
                state: { doc: mockDoc },
            };

            const result = getDocumentFromEditor(mockEditor as unknown as TipTapEditor);
            expect(result).toBe(mockDoc);
        });

        it('should handle function editor', () => {
            const mockDoc = { type: 'doc' };
            const mockEditor = () => ({ state: { doc: mockDoc } });

            const result = getDocumentFromEditor(mockEditor as unknown as TipTapEditor);
            expect(result).toBe(null);
        });

        it('should return null for invalid editor', () => {
            expect(getDocumentFromEditor(null)).toBe(null);
            expect(getDocumentFromEditor({} as unknown as TipTapEditor)).toBe(null);
        });
    });
});