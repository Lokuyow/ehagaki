import { render, screen } from "@testing-library/svelte";
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
});
