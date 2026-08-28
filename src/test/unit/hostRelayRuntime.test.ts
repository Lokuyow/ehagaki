import { afterEach, describe, expect, it } from "vitest";
import {
    activateHostRelayConfig,
    deactivateHostRelayConfig,
    getHostReadRelayDefaults,
    mergeHostReadDefaultsWithHints,
} from "../../lib/hostRelayRuntime";

afterEach(() => deactivateHostRelayConfig());

describe("Host Relay runtime defaults", () => {
    it("keeps every Host read default while applying the existing limit only to hints", () => {
        const hostReadRelays = Array.from({ length: 10 }, (_, index) =>
            `wss://host-${index + 1}.example`,
        );
        activateHostRelayConfig(Object.fromEntries(hostReadRelays.map((url) => [url, {
            read: true,
            write: false,
        }])));

        expect(getHostReadRelayDefaults()).toEqual(hostReadRelays.map((url) => `${url}/`));
        expect(mergeHostReadDefaultsWithHints([
            "wss://hint-1.example",
            "wss://hint-2.example",
            "wss://hint-3.example",
            "wss://hint-4.example",
            "wss://hint-5.example",
        ], 3)).toEqual([
            ...hostReadRelays.map((url) => `${url}/`),
            "wss://hint-1.example/",
            "wss://hint-2.example/",
            "wss://hint-3.example/",
        ]);
    });
});
