import { describe, expect, it, vi } from 'vitest';

import {
    measureElementOuterHeight,
    resolveComposerAvailableHeight,
    resolveComposerSiblingHeight,
    resolvePostEditorTargetHeight,
} from '../../lib/utils/composerLayoutUtils';

function defineOuterBox(
    element: HTMLElement,
    { height, marginTop, marginBottom }: { height: number; marginTop: number; marginBottom: number },
) {
    element.getBoundingClientRect = vi.fn(() => ({
        height,
        width: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
    })) as any;
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
    } as CSSStyleDeclaration);
}

describe('composerLayoutUtils', () => {
    it('outer height に margin を含める', () => {
        const element = document.createElement('div');
        defineOuterBox(element, {
            height: 120,
            marginTop: 8,
            marginBottom: 12,
        });

        expect(measureElementOuterHeight(element)).toBe(140);
    });

    it('composer sibling height は post block 以外を合計する', () => {
        const container = document.createElement('div');
        const reply = document.createElement('div');
        const post = document.createElement('div');
        const quote = document.createElement('div');
        container.append(reply, post, quote);

        reply.getBoundingClientRect = vi.fn(() => ({ height: 60 })) as any;
        post.getBoundingClientRect = vi.fn(() => ({ height: 200 })) as any;
        quote.getBoundingClientRect = vi.fn(() => ({ height: 44 })) as any;

        const styleSpy = vi.spyOn(window, 'getComputedStyle');
        styleSpy
            .mockReturnValueOnce({ marginTop: '4px', marginBottom: '4px' } as CSSStyleDeclaration)
            .mockReturnValueOnce({ marginTop: '2px', marginBottom: '2px' } as CSSStyleDeclaration);

        expect(resolveComposerSiblingHeight(container, post)).toBe(116);
    });

    it('composer available height は minimum を下回らない', () => {
        expect(
            resolveComposerAvailableHeight({
                composerViewportHeight: 500,
                siblingHeight: 120,
                minHeight: 152,
            }),
        ).toBe(380);

        expect(
            resolveComposerAvailableHeight({
                composerViewportHeight: 120,
                siblingHeight: 80,
                minHeight: 152,
            }),
        ).toBe(152);
    });

    it('post editor target height は non-editor height を引いた残りを使う', () => {
        expect(
            resolvePostEditorTargetHeight({
                availableComposerHeight: 420,
                nonEditorHeight: 180,
                minHeight: 152,
            }),
        ).toBe(240);

        expect(
            resolvePostEditorTargetHeight({
                availableComposerHeight: 200,
                nonEditorHeight: 120,
                minHeight: 152,
            }),
        ).toBe(152);
    });
});