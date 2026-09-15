import { afterEach, describe, expect, it } from 'vitest';
import {
    editorState,
    resetEditorState,
    updateEditorContent,
} from '../../stores/editorStore.svelte';

describe('editor store live eligibility ownership', () => {
    afterEach(() => resetEditorState());

    it('does not let the debounced content projection overwrite canonical canPost', () => {
        editorState.canPost = true;
        updateEditorContent('', false);
        expect(editorState.content).toBe('');
        expect(editorState.canPost).toBe(true);
    });
});
