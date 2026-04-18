interface ResolveComposerAvailableHeightParams {
    composerViewportHeight: number;
    siblingHeight: number;
    minHeight: number;
}

interface ResolvePostEditorTargetHeightParams {
    availableComposerHeight: number;
    nonEditorHeight: number;
    minHeight: number;
}

export function measureElementOuterHeight(element: Element | null): number {
    if (!(element instanceof HTMLElement) || typeof window === "undefined") {
        return 0;
    }

    const rectHeight = element.getBoundingClientRect().height;
    const computedStyle = window.getComputedStyle(element);
    const marginTop = Number.parseFloat(computedStyle.marginTop) || 0;
    const marginBottom = Number.parseFloat(computedStyle.marginBottom) || 0;

    return rectHeight + marginTop + marginBottom;
}

export function resolveComposerSiblingHeight(
    container: HTMLElement,
    excludedElement: Element | null,
): number {
    return Array.from(container.children).reduce(
        (totalHeight, child) =>
            child === excludedElement
                ? totalHeight
                : totalHeight + measureElementOuterHeight(child),
        0,
    );
}

export function resolveComposerAvailableHeight(
    params: ResolveComposerAvailableHeightParams,
): number {
    const remainingHeight = Math.max(
        0,
        params.composerViewportHeight - params.siblingHeight,
    );

    return Math.max(params.minHeight, Math.floor(remainingHeight));
}

export function resolvePostEditorTargetHeight(
    params: ResolvePostEditorTargetHeightParams,
): number {
    const remainingHeight = Math.max(
        0,
        params.availableComposerHeight - params.nonEditorHeight,
    );

    return Math.max(params.minHeight, Math.floor(remainingHeight));
}