import { describe, it, expect, vi } from 'vitest';
import { Schema, type Node as PMNode } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';
import type { Transaction } from '@tiptap/pm/state';
import {
    calculateDragPositions,
    createMoveTransaction,
    getCustomEmojiDropPositions,
    moveCustomEmojiNode,
} from '../../lib/utils/editorNodeActions';

describe('editorNodeActions', () => {
    describe('calculateDragPositions', () => {
        it('should calculate drag positions correctly', () => {
            const result1 = calculateDragPositions(5, 2);
            expect(result1).toEqual({
                insertPos: 4,
                deleteStart: 2,
                deleteEnd: 3,
            });

            const result2 = calculateDragPositions(2, 5);
            expect(result2).toEqual({
                insertPos: 2,
                deleteStart: 6,
                deleteEnd: 7,
            });

            expect(calculateDragPositions(5, 5)).toBe(null);
        });
    });

    describe('createMoveTransaction', () => {
        it('should create move transaction', () => {
            const mockTransaction = {
                insert: vi.fn().mockReturnThis(),
                delete: vi.fn().mockReturnThis(),
            };
            const mockNode = {};
            const positions = {
                insertPos: 2,
                deleteStart: 5,
                deleteEnd: 6,
            };

            const result = createMoveTransaction(
                mockTransaction as unknown as Transaction,
                mockNode as unknown as PMNode,
                positions,
            );

            expect(result).toBe(mockTransaction);
            expect(mockTransaction.insert).toHaveBeenCalledWith(2, mockNode);
            expect(mockTransaction.delete).toHaveBeenCalledWith(5, 6);
        });
    });

    describe('custom emoji drag positions', () => {
        const schema = new Schema({
            nodes: {
                doc: { content: 'block+' },
                paragraph: {
                    content: 'inline*',
                    group: 'block',
                    toDOM: () => ['p', 0],
                    parseDOM: [{ tag: 'p' }],
                },
                text: { group: 'inline' },
                customEmoji: {
                    group: 'inline',
                    inline: true,
                    atom: true,
                    attrs: {
                        shortcode: { default: '' },
                        src: { default: '' },
                        setAddress: { default: null },
                    },
                    toDOM: (node) => ['img', node.attrs],
                    parseDOM: [{ tag: 'img[data-custom-emoji]' }],
                },
            },
        });

        function emoji(shortcode: string) {
            return schema.nodes.customEmoji.create({
                shortcode,
                src: `https://example.com/${shortcode}.png`,
            });
        }

        it('limits custom emoji drop positions to paragraph edges and emoji boundaries', () => {
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    schema.text('a'),
                    emoji('blobcat'),
                    schema.text('b'),
                ]),
            ]);

            expect(getCustomEmojiDropPositions(doc)).toEqual([1, 2, 3, 4]);
            expect(getCustomEmojiDropPositions(doc, 2)).toEqual([1, 4]);
        });

        it('moves custom emoji nodes while preserving attrs', () => {
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(null, [
                    emoji('first'),
                    emoji('second'),
                ]),
            ]);
            const state = EditorState.create({ schema, doc });
            const dispatch = vi.fn();
            const view = { state, dispatch } as any;

            const result = moveCustomEmojiNode(
                view,
                {
                    pos: 1,
                    attrs: {
                        shortcode: 'first',
                        src: 'https://example.com/first.png',
                    },
                },
                3,
            );

            expect(result).toBe(true);
            expect(dispatch).toHaveBeenCalledOnce();
            const nextDoc = dispatch.mock.calls[0][0].doc;
            const paragraph = nextDoc.child(0);
            expect(paragraph.child(0).attrs.shortcode).toBe('second');
            expect(paragraph.child(1).attrs.shortcode).toBe('first');
            expect(paragraph.child(1).attrs.src).toBe('https://example.com/first.png');
        });
    });
});
