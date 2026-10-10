import { render, screen, waitFor } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import FloatingMessage from "../../components/FloatingMessage.svelte";

describe("FloatingMessage", () => {
    it("uses notification semantics instead of modal semantics", () => {
        render(FloatingMessage, {
            props: {
                show: true,
                x: 10,
                y: 20,
            },
        });

        const message = screen.getByRole("status");

        expect(message.getAttribute("aria-live")).toBe("polite");
        expect(message.getAttribute("aria-atomic")).toBe("true");
        expect(message.getAttribute("role")).not.toBe("dialog");
        expect(message.hasAttribute("aria-modal")).toBe(false);
        expect(message.hasAttribute("tabindex")).toBe(false);
        expect(message.querySelector(".info-icon")).toBeTruthy();
    });

    it("can hide the default info icon when the message content supplies its own loader", () => {
        render(FloatingMessage, {
            props: {
                show: true,
                showInfoIcon: false,
            },
        });

        const message = screen.getByRole("status");

        expect(message.querySelector(".info-icon")).toBeNull();
    });

    it("does not render when hidden", () => {
        render(FloatingMessage, {
            props: {
                show: false,
                x: 10,
                y: 20,
            },
        });

        expect(screen.queryByRole("status")).toBeNull();
    });

    it("supports a top-right toast variant without pointer positioning", () => {
        render(FloatingMessage, {
            props: {
                show: true,
                variant: "top-right",
            },
        });

        const message = screen.getByRole("status");

        expect(message.classList.contains("top-right")).toBe(true);
        expect(message.getAttribute("style") ?? "").not.toContain("left:");
    });

    it("positions an anchored toast below with the requested right inset", async () => {
        const anchor = document.createElement("div");
        document.body.append(anchor);
        anchor.getBoundingClientRect = () =>
            ({
                left: 20,
                right: 420,
                top: 10,
                bottom: 68,
                width: 400,
                height: 58,
                x: 20,
                y: 10,
                toJSON: () => ({}),
            }) as DOMRect;

        render(FloatingMessage, {
            props: {
                show: true,
                variant: "anchor-bottom-right",
                anchor,
                anchorRightOffset: 24,
            },
        });

        let anchoredMessage: HTMLElement | null = null;
        await waitFor(() => {
            anchoredMessage = document.body.querySelector<HTMLElement>(
                ".floating-message.anchor-bottom-right",
            );
            expect(anchoredMessage).toBeTruthy();
        });
        const message = anchoredMessage!;
        message.getBoundingClientRect = () =>
            ({
                left: 0,
                right: 120,
                top: 0,
                bottom: 44,
                width: 120,
                height: 44,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }) as DOMRect;
        window.dispatchEvent(new Event("resize"));
        await waitFor(() => {
            expect(message.style.visibility).toBe("visible");
            expect(message.style.left).toBe("276px");
            expect(message.style.top).toBe("76px");
            expect(message.getAttribute("role")).toBe("status");
            expect(message.getAttribute("aria-live")).toBe("polite");
        });
        anchor.remove();
    });
});
