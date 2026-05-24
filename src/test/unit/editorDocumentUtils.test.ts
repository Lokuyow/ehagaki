import { describe, it, expect, vi } from 'vitest';
import type { Editor as TipTapEditor } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import {
    extractFragmentsFromDoc,
    extractPostContentFromDoc,
    getDocumentFromEditor,
    isDocumentEmpty,
    isParagraphWithOnlyImageUrl,
} from '../../lib/utils/editorDocumentUtils';

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

        it('should serialize custom emoji aliases and dedupe emoji tags by identity', () => {
            const textNode = { isText: true, text: 'Hello ', type: { name: 'text' } };
            const firstEmoji = {
                isText: false,
                type: { name: 'customEmoji' },
                attrs: {
                    identityKey: 'blobcat|a',
                    shortcode: 'blobcat',
                    src: 'https://example.com/blobcat.webp',
                    setAddress: '30030:pubkey:set',
                },
                textContent: '',
            };
            const duplicateEmoji = {
                ...firstEmoji,
                attrs: {
                    identityKey: 'blobcat|b',
                    shortcode: 'blobcat',
                    src: 'https://example.com/other.webp',
                },
            };
            const exactDuplicateEmoji = {
                ...firstEmoji,
                attrs: {
                    identityKey: 'blobcat|a',
                    shortcode: 'blobcat',
                    src: 'https://example.com/blobcat.webp',
                    setAddress: '30030:pubkey:set',
                },
            };
            const paragraph = {
                type: { name: 'paragraph' },
                forEach: (callback: (node: any) => void) => {
                    [textNode, firstEmoji, duplicateEmoji, exactDuplicateEmoji].forEach(callback);
                },
            };
            const doc = {
                forEach: (callback: (node: any) => void) => {
                    callback(paragraph);
                },
            };

            const result = extractPostContentFromDoc(doc as unknown as PMNode);

            expect(result.content).toBe('Hello :blobcat::blobcat_2::blobcat:');
            expect(result.emojiTags).toEqual([
                ['emoji', 'blobcat', 'https://example.com/blobcat.webp', '30030:pubkey:set'],
                ['emoji', 'blobcat_2', 'https://example.com/other.webp'],
            ]);
        });

        it('should skip aliases that collide with existing numbered custom emoji shortcodes', () => {
            const firstNe = {
                isText: false,
                type: { name: 'customEmoji' },
                attrs: {
                    identityKey: 'ne|a',
                    shortcode: 'ne',
                    src: 'https://example.com/ne-a.webp',
                },
                textContent: '',
            };
            const secondNe = {
                isText: false,
                type: { name: 'customEmoji' },
                attrs: {
                    identityKey: 'ne|b',
                    shortcode: 'ne',
                    src: 'https://example.com/ne-b.webp',
                },
                textContent: '',
            };
            const existingNumberedNe = {
                isText: false,
                type: { name: 'customEmoji' },
                attrs: {
                    identityKey: 'ne_2|c',
                    shortcode: 'ne_2',
                    src: 'https://example.com/ne-2.webp',
                },
                textContent: '',
            };
            const paragraph = {
                type: { name: 'paragraph' },
                forEach: (callback: (node: any) => void) => {
                    [firstNe, secondNe, existingNumberedNe].forEach(callback);
                },
            };
            const doc = {
                forEach: (callback: (node: any) => void) => callback(paragraph),
            };

            const result = extractPostContentFromDoc(doc as unknown as PMNode);

            expect(result.content).toBe(':ne::ne_3::ne_2:');
            expect(result.emojiTags).toEqual([
                ['emoji', 'ne', 'https://example.com/ne-a.webp'],
                ['emoji', 'ne_3', 'https://example.com/ne-b.webp'],
                ['emoji', 'ne_2', 'https://example.com/ne-2.webp'],
            ]);
        });

        it('should reserve shortcode-like text before assigning duplicate emoji aliases', () => {
            const textNode = {
                isText: true,
                text: 'これは :ne_2: という文字列です ',
                type: { name: 'text' },
            };
            const firstNe = {
                isText: false,
                type: { name: 'customEmoji' },
                attrs: {
                    identityKey: 'ne|a',
                    shortcode: 'ne',
                    src: 'https://example.com/ne-a.webp',
                },
                textContent: '',
            };
            const secondNe = {
                isText: false,
                type: { name: 'customEmoji' },
                attrs: {
                    identityKey: 'ne|b',
                    shortcode: 'ne',
                    src: 'https://example.com/ne-b.webp',
                },
                textContent: '',
            };
            const paragraph = {
                type: { name: 'paragraph' },
                forEach: (callback: (node: any) => void) => {
                    [textNode, firstNe, secondNe].forEach(callback);
                },
            };
            const doc = {
                forEach: (callback: (node: any) => void) => callback(paragraph),
            };

            const result = extractPostContentFromDoc(doc as unknown as PMNode);

            expect(result.content).toBe('これは :ne_2: という文字列です :ne::ne_3:');
            expect(result.emojiTags).toEqual([
                ['emoji', 'ne', 'https://example.com/ne-a.webp'],
                ['emoji', 'ne_3', 'https://example.com/ne-b.webp'],
            ]);
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
