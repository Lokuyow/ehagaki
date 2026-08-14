import { describe, expect, it } from "vitest";
import {
    createLanSampleUrls,
    getLanIPv4Addresses,
    resolveWebComponentDevHosts,
} from "../../../scripts/webComponentDevServerConfig.mjs";

describe("Web Component dev server host configuration", () => {
    it("keeps both servers on loopback in normal mode", () => {
        expect(resolveWebComponentDevHosts(false)).toEqual({
            appHost: "127.0.0.1",
            webComponentHost: "127.0.0.1",
        });
    });

    it("publishes only the app server in LAN mode", () => {
        expect(resolveWebComponentDevHosts(true)).toEqual({
            appHost: "0.0.0.0",
            webComponentHost: "127.0.0.1",
        });
    });

    it("returns unique non-internal IPv4 candidates and sample URLs", () => {
        expect(getLanIPv4Addresses({
            WiFi: [
                { address: "192.168.1.20", netmask: "", family: "IPv4", mac: "", internal: false, cidr: "" },
                { address: "192.168.1.20", netmask: "", family: "IPv4", mac: "", internal: false, cidr: "" },
            ],
            Loopback: [
                { address: "127.0.0.1", netmask: "", family: "IPv4", mac: "", internal: true, cidr: "" },
            ],
        })).toEqual(["192.168.1.20"]);
        expect(createLanSampleUrls(5173, ["192.168.1.20"])).toEqual([
            "http://192.168.1.20:5173/ehagaki/web-component-parent-client-example.html",
        ]);
    });
});
