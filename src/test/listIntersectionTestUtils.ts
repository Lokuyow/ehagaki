import { vi } from "vitest";

/** Keep the callbacks so tests can deliver entries that were queued before disconnect. */
export function stubListIntersections() {
    const entries = new Map<Element, () => void>();
    vi.stubGlobal("IntersectionObserver", class {
        constructor(private readonly callback: IntersectionObserverCallback) {}
        observe(target: Element) {
            entries.set(target, () => this.callback(
                [{ target, isIntersecting: true } as IntersectionObserverEntry],
                this as unknown as IntersectionObserver,
            ));
        }
        unobserve() {}
        disconnect() {}
    });
    return (target: Element) => {
        const deliver = entries.get(target);
        if (!deliver) throw new Error("The list sentinel is not being observed");
        deliver();
    };
}
