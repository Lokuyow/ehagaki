import { Extension } from '@tiptap/core';

// Host-owned Composer has no app-owned Reaction session or delivery responsibility.
export const ReactionInput = Extension.create({ name: 'reactionInput' });
export const reactionComposerState = { value: null };
export function clearReactionTarget(): void {}
export function isReactionComposing(): boolean { return false; }
export function inspectReactionDocument() { return { value: null, count: 0, forbidden: 0 }; }
