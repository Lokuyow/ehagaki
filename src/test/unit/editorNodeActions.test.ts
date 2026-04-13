import { describe, it, expect, vi } from 'vitest';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { Transaction } from '@tiptap/pm/state';
import {
    calculateDragPositions,
    createMoveTransaction,
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
});