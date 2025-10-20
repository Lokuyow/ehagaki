import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteVideoNode from '../../components/SvelteVideoNode.svelte';
import { generateSimpleUUID } from '../utils/appUtils';

export const Video = Node.create({
    name: 'video',

    group: 'block',

    draggable: false,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            id: {
                default: () => generateSimpleUUID(),
            },
            isPlaceholder: {
                default: false,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'video[src]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(HTMLAttributes, { controls: true })];
    },

    addNodeView() {
        return SvelteNodeViewRenderer(SvelteVideoNode);
    },
});
