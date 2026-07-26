import { fireEvent, render } from "@testing-library/svelte";
import { afterEach, describe, expect, it } from "vitest";
import ChannelPicture from "../../components/ChannelPicture.svelte";

const pictureUrl = "https://images.example.com/channel.png?q=1";
const originalServiceWorker = navigator.serviceWorker;

function setServiceWorkerController(controller: object | null): void {
    Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        value: { controller },
    });
}

afterEach(() => {
    Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        value: originalServiceWorker,
    });
});

describe("ChannelPicture", () => {
    it("verified metadataかつmount時にSW controlledなら最初からproxyを使う", () => {
        setServiceWorkerController({});
        const { container } = render(ChannelPicture, {
            eventId: "a".repeat(64),
            pictureUrl,
            cacheEligible: true,
            alt: "General",
        });
        const image = container.querySelector("img")!;
        const source = new URL(image.src);
        expect(source.pathname).toContain("/__ehagaki-image/channel");
        expect(source.searchParams.get("url")).toBe(pictureUrl);
    });

    it("unverified overrideはSW controlledでも直接URLを使う", () => {
        setServiceWorkerController({});
        const { container } = render(ChannelPicture, {
            eventId: "a".repeat(64),
            pictureUrl,
            cacheEligible: false,
        });
        expect(container.querySelector("img")?.src).toBe(pictureUrl);
    });

    it("mount時にuncontrolledならcontrollerchange後も生存中は直接URLを維持する", () => {
        setServiceWorkerController(null);
        const { container } = render(ChannelPicture, {
            eventId: "a".repeat(64),
            pictureUrl,
            cacheEligible: true,
        });
        const image = container.querySelector("img")!;
        expect(image.src).toBe(pictureUrl);

        setServiceWorkerController({});
        navigator.serviceWorker.dispatchEvent?.(new Event("controllerchange"));
        expect(image.src).toBe(pictureUrl);
    });

    it("proxy失敗時は一度だけ元URLへfallbackする", async () => {
        setServiceWorkerController({});
        const { container } = render(ChannelPicture, {
            eventId: "a".repeat(64),
            pictureUrl,
            cacheEligible: true,
        });
        const image = container.querySelector("img")!;
        expect(image.src).not.toBe(pictureUrl);
        await fireEvent.error(image);
        expect(image.src).toBe(pictureUrl);
        await fireEvent.error(image);
        expect(image.src).toBe(pictureUrl);
    });

    it("不正URLではimgを描画しない", () => {
        setServiceWorkerController({});
        const { container } = render(ChannelPicture, {
            eventId: "a".repeat(64),
            pictureUrl: "javascript:alert(1)",
            cacheEligible: true,
        });
        expect(container.querySelector("img")).toBeNull();
    });
});
