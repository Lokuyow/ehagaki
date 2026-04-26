import {
    Extension,
    findChildren,
    splitExtensions,
    type Extensions,
} from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { Transaction } from '@tiptap/pm/state';

export type UniqueIDGenerationContext = {
    node: ProseMirrorNode;
    pos: number;
};

export interface UniqueIDOptions {
    attributeName: string;
    types: string[] | 'all';
    generateID: (ctx: UniqueIDGenerationContext) => string;
    filterTransaction: ((transaction: Transaction) => boolean) | null;
    updateDocument: boolean;
}

function generateRandomID(): string {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    if (globalThis.crypto?.getRandomValues) {
        const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));
        return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
    }

    return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function resolveTypes(types: UniqueIDOptions['types'], extensions: Extensions): string[] {
    if (types !== 'all') {
        return types;
    }

    const { nodeExtensions } = splitExtensions(extensions);
    return nodeExtensions
        .map((extension) => extension.name)
        .filter((type) => type !== 'doc' && type !== 'text');
}

function needsID(value: unknown): boolean {
    return value === null || value === undefined || value === '';
}

export const UniqueID = Extension.create<UniqueIDOptions>({
    name: 'uniqueID',
    priority: 10000,

    addOptions() {
        return {
            attributeName: 'id',
            types: [],
            generateID: () => generateRandomID(),
            filterTransaction: null,
            updateDocument: true,
        };
    },

    addGlobalAttributes() {
        const types = resolveTypes(this.options.types, this.extensions);

        return [
            {
                types,
                attributes: {
                    [this.options.attributeName]: {
                        default: null,
                        parseHTML: (element: HTMLElement) => element.getAttribute(`data-${this.options.attributeName}`),
                        renderHTML: (attributes: Record<string, unknown>) => {
                            const value = attributes[this.options.attributeName];
                            return needsID(value)
                                ? {}
                                : { [`data-${this.options.attributeName}`]: value };
                        },
                    },
                },
            },
        ];
    },

    onCreate() {
        if (!this.options.updateDocument) {
            return;
        }

        const { state, view } = this.editor;
        const types = resolveTypes(this.options.types, this.editor.extensionManager.extensions);
        const { attributeName, generateID } = this.options;
        const seen = new Set<unknown>();
        const tr = state.tr;

        findChildren(state.doc, (node) => types.includes(node.type.name)).forEach(({ node, pos }) => {
            const currentID = node.attrs[attributeName];

            if (needsID(currentID) || seen.has(currentID)) {
                const nextID = generateID({ node, pos });
                tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    [attributeName]: nextID,
                });
                seen.add(nextID);
                return;
            }

            seen.add(currentID);
        });

        if (!tr.steps.length) {
            return;
        }

        tr.setMeta('addToHistory', false);
        view.dispatch(tr);
    },

    addProseMirrorPlugins() {
        if (!this.options.updateDocument) {
            return [];
        }

        const types = resolveTypes(this.options.types, this.editor.extensionManager.extensions);

        return [
            new Plugin({
                key: new PluginKey('uniqueID'),
                appendTransaction: (transactions, oldState, newState) => {
                    const hasDocChanges = transactions.some((transaction) => transaction.docChanged);
                    const isOwnTransaction = transactions.some((transaction) => transaction.getMeta('__uniqueIDTransaction'));
                    const isFiltered = this.options.filterTransaction
                        ? transactions.some((transaction) => !this.options.filterTransaction?.(transaction))
                        : false;

                    if (!hasDocChanges || isOwnTransaction || isFiltered || oldState.doc.eq(newState.doc)) {
                        return;
                    }

                    const { attributeName, generateID } = this.options;
                    const seen = new Set<unknown>();
                    const tr = newState.tr;

                    findChildren(newState.doc, (node) => types.includes(node.type.name)).forEach(({ node, pos }) => {
                        const currentID = tr.doc.nodeAt(pos)?.attrs[attributeName];

                        if (needsID(currentID) || seen.has(currentID)) {
                            const nextID = generateID({ node, pos });
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                [attributeName]: nextID,
                            });
                            seen.add(nextID);
                            return;
                        }

                        seen.add(currentID);
                    });

                    if (!tr.steps.length) {
                        return;
                    }

                    tr.setStoredMarks(newState.tr.storedMarks);
                    tr.setMeta('__uniqueIDTransaction', true);
                    tr.setMeta('addToHistory', false);
                    return tr;
                },
            }),
        ];
    },
});

export default UniqueID;
