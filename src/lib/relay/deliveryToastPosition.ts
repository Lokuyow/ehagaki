import type { AppRuntimeEnvironment } from "../appRuntimeEnvironment";

export interface DeliveryToastPlacement { target: HTMLElement; style: string }

/** Keep the portal inside the active modal's focus/outside-interaction boundary. */
export function positionDeliveryToasts(element: HTMLElement, runtime: AppRuntimeEnvironment,
    place: (placement: DeliveryToastPlacement) => void): () => void {
    const win = runtime.window;
    const root = runtime.domRoot;
    if (!win || !root) return () => {};
    let frame = 0;
    let disposed = false;
    let observed: Element[] = [];
    const observer = new ResizeObserver(() => schedule());
    const update = () => {
        frame = 0;
        if (disposed) return;
        const dialogs = [...root.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"]')]
            .filter(node => node.getBoundingClientRect().width && node.getBoundingClientRect().height)
            .sort((a, b) => (Number(win.getComputedStyle(a).zIndex) || 0) - (Number(win.getComputedStyle(b).zIndex) || 0));
        const dialog = dialogs.at(-1);
        const target = dialog ?? runtime.overlayTarget;
        const absolute = !!dialog || runtime.layoutMode === "container";
        const viewport = win.visualViewport;
        const visible = { left: viewport?.offsetLeft ?? 0, top: viewport?.offsetTop ?? 0,
            right: (viewport?.offsetLeft ?? 0) + (viewport?.width ?? win.innerWidth),
            bottom: (viewport?.offsetTop ?? 0) + (viewport?.height ?? win.innerHeight) };
        const bounds = (dialog ?? (absolute ? runtime.layoutTarget : null))?.getBoundingClientRect() ?? visible;
        const left = Math.max(bounds.left, visible.left) + 12;
        const right = Math.min(bounds.right, visible.right) - 12;
        const top = Math.max(bounds.top, visible.top) + 12;
        let bottom = Math.min(bounds.bottom, visible.bottom) - 12;
        const footers = [...(dialog ?? root).querySelectorAll<HTMLElement>(dialog ? ".dialog-footer,.footer-button-bar,.confirm-dialog-buttons" : ".footer-bar,.footer-button-bar")];
        for (const footer of footers) {
            const rect = footer.getBoundingClientRect();
            if (rect.height && rect.top > top && rect.top < bottom) bottom = rect.top - 12;
        }
        // Portal placement can change the containing block. Measure again after it moves.
        const parent = absolute ? element.offsetParent as HTMLElement | null : null;
        const parentRect = parent?.getBoundingClientRect();
        const scaleX = parentRect && parent?.offsetWidth ? parentRect.width / parent.offsetWidth : 1;
        const scaleY = parentRect && parent?.offsetHeight ? parentRect.height / parent.offsetHeight : 1;
        const width = Math.max(0, Math.min(element.children.length * 32 + Math.max(0, element.children.length - 1) * 8, (right - left) / scaleX));
        const height = Math.max(0, Math.min(144, (bottom - top) / scaleY));
        const x = right - width * scaleX;
        const y = Math.max(top, bottom - height * scaleY);
        const localX = absolute && parentRect ? (x - parentRect.left) / scaleX + parent!.scrollLeft - parent!.clientLeft : x;
        const localY = absolute && parentRect ? (y - parentRect.top) / scaleY + parent!.scrollTop - parent!.clientTop : y;
        place({ target, style: `position:${absolute ? "absolute" : "fixed"};left:${localX}px;top:${localY}px;width:${width}px;height:${height}px;` });
        const next = [runtime.layoutTarget, element, ...(dialog ? [dialog] : []), ...footers];
        if (next.length !== observed.length || next.some((node, index) => node !== observed[index])) {
            observer.disconnect();
            next.forEach(node => observer.observe(node));
            observed = next;
        }
    };
    const schedule = () => { if (!frame && !disposed) frame = win.requestAnimationFrame(update); };
    const mutation = new MutationObserver(schedule);
    mutation.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state", "aria-hidden"] });
    win.addEventListener("resize", schedule);
    win.addEventListener("scroll", schedule, true);
    win.visualViewport?.addEventListener("resize", schedule);
    win.visualViewport?.addEventListener("scroll", schedule);
    schedule();
    return () => {
        disposed = true; win.cancelAnimationFrame(frame); observer.disconnect(); mutation.disconnect();
        win.removeEventListener("resize", schedule); win.removeEventListener("scroll", schedule, true);
        win.visualViewport?.removeEventListener("resize", schedule); win.visualViewport?.removeEventListener("scroll", schedule);
    };
}
