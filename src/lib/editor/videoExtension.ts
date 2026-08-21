import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteVideoNode from '../../components/SvelteVideoNode.svelte';

export const Video = Node.create({
    name: 'video',

    group: 'block',

    draggable: false,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            isPlaceholder: {
                default: false,
            },
            alt: {
                default: null,
            },
            blurhash: {
                default: null,
            },
            dim: {
                default: null,
            },
            size: {
                default: null,
            },
            uploadProtocol: {
                default: null,
            },
            m: {
                default: null,
            },
            ox: {
                default: null,
            },
            x: {
                default: null,
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
