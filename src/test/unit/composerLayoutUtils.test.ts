import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    measureElementOuterHeight,
    resolveComposerAvailableHeight,
    resolveComposerSiblingHeight,
    resolvePostEditorTargetHeight,
} from '../../lib/utils/composerLayoutUtils';

afterEach(() => {
    vi.restoreAllMocks();
});

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

function mockComputedStyles(styles: Map<Element, Partial<CSSStyleDeclaration>>) {
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
        const style = styles.get(element as Element);

        return {
            marginTop: '0px',
            marginBottom: '0px',
            rowGap: '0px',
            gap: '0px',
            ...style,
        } as CSSStyleDeclaration;
    });
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

    it('composer sibling height は post block 以外と gap を合計する', () => {
        const container = document.createElement('div');
        const reply = document.createElement('div');
        const post = document.createElement('div');
        const quote = document.createElement('div');
        container.append(reply, post, quote);

        reply.getBoundingClientRect = vi.fn(() => ({ height: 60 })) as any;
        post.getBoundingClientRect = vi.fn(() => ({ height: 200 })) as any;
        quote.getBoundingClientRect = vi.fn(() => ({ height: 44 })) as any;

        mockComputedStyles(
            new Map([
                [container, { rowGap: '4px', gap: '4px' }],
                [reply, { marginTop: '4px', marginBottom: '4px' }],
                [quote, { marginTop: '2px', marginBottom: '2px' }],
            ]),
        );

        expect(resolveComposerSiblingHeight(container, post)).toBe(124);
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