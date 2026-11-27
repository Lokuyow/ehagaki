import { afterEach, describe, expect, it } from "vitest";
import { EHagakiHostOwnedLiteComposerElement } from "../../web-component/hostOwnedLiteElement";

class TestHostOwnedLiteElement extends EHagakiHostOwnedLiteComposerElement {}

if (!customElements.get("ehagaki-test-host-owned-lite")) {
    customElements.define("ehagaki-test-host-owned-lite", TestHostOwnedLiteElement);
}

function createElement(): TestHostOwnedLiteElement {
    return document.createElement("ehagaki-test-host-owned-lite") as TestHostOwnedLiteElement;
}

function nextMacrotask(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

afterEach(() => {
    document.body.replaceChildren();
});

describe("Host-owned Lite element public API", () => {
    it("does not leave an unhandled ready rejection when the host never calls whenReady()", async () => {
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        try {
            const element = createElement();
            // Connecting without configureHostOwned() fails initialization.
            document.body.append(element);
            await nextMacrotask();
            await nextMacrotask();

            expect(unhandled).toEqual([]);
            await expect(element.whenReady()).rejects.toMatchObject({ name: "initialization_failed" });
        } finally {
            process.off("unhandledRejection", onUnhandled);
        }
    });

    it("returns a rejected promise instead of throwing for an invalid custom emoji catalog", async () => {
        const element = createElement();
        element.configureHostOwned({ submit: async () => undefined });

        let result: Promise<void> | undefined;
        expect(() => {
            result = element.setCustomEmojis([{ shortcode: "", url: "not a url" }] as never);
        }).not.toThrow();
        await expect(result).rejects.toBeInstanceOf(TypeError);
    });
});
