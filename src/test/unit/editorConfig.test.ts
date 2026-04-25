import { describe, expect, it, vi } from 'vitest';
import { updateEditorPlaceholder } from '../../lib/editor/editorConfig';

describe('updateEditorPlaceholder', () => {
    it('updates the dynamic placeholder state and rendered placeholder attributes', () => {
        const paragraph = document.createElement('p');
        paragraph.setAttribute('data-placeholder', 'old placeholder');

        const dom = document.createElement('div');
        dom.append(paragraph);

        const transaction = {
            setMeta: vi.fn().mockReturnThis(),
        };
        const placeholderExtension = {
            name: 'placeholder',
            options: {
                placeholder: () => 'old placeholder',
            },
        };
        const editor = {
            __placeholderState: {
                text: 'old placeholder',
            },
            extensionManager: {
                extensions: [placeholderExtension],
            },
            state: {
                tr: transaction,
            },
            view: {
                dom,
                dispatch: vi.fn(),
            },
        } as any;

        updateEditorPlaceholder(editor, 'new placeholder');

        expect(editor.__placeholderState.text).toBe('new placeholder');
        expect(placeholderExtension.options.placeholder()).toBe(
            'new placeholder',
        );
        expect(paragraph.getAttribute('data-placeholder')).toBe(
            'new placeholder',
        );
        expect(transaction.setMeta).toHaveBeenCalledWith(
            'addToHistory',
            false,
        );
        expect(editor.view.dispatch).toHaveBeenCalledWith(transaction);
    });

    it('does not dispatch when the placeholder text is already current', () => {
        const paragraph = document.createElement('p');
        paragraph.setAttribute('data-placeholder', 'same placeholder');

        const dom = document.createElement('div');
        dom.append(paragraph);

        const editor = {
            __placeholderState: {
                text: 'same placeholder',
            },
            extensionManager: {
                extensions: [
                    {
                        name: 'placeholder',
                        options: {
                            placeholder: () => 'same placeholder',
                        },
                    },
                ],
            },
            state: {
                tr: {
                    setMeta: vi.fn().mockReturnThis(),
                },
            },
            view: {
                dom,
                dispatch: vi.fn(),
            },
        } as any;

        updateEditorPlaceholder(editor, 'same placeholder');

        expect(editor.view.dispatch).not.toHaveBeenCalled();
    });
});
