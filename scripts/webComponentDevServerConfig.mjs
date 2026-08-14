import { networkInterfaces } from "node:os";

export const LOCALHOST = "127.0.0.1";
export const LAN_HOST = "0.0.0.0";

/** @param {boolean} lanMode */
export function resolveWebComponentDevHosts(lanMode) {
    return {
        appHost: lanMode ? LAN_HOST : LOCALHOST,
        webComponentHost: LOCALHOST,
    };
}

/** @param {NodeJS.Dict<import("node:os").NetworkInterfaceInfo[] | undefined>} [interfaces] */
export function getLanIPv4Addresses(interfaces = networkInterfaces()) {
    return [...new Set(Object.values(interfaces).flatMap((entries) =>
        (entries ?? [])
            .filter((entry) => !entry.internal && (entry.family === "IPv4" || String(entry.family) === "4"))
            .map((entry) => entry.address),
    ))];
}

/** @param {number} appPort @param {string[]} addresses */
export function createLanSampleUrls(appPort, addresses) {
    return addresses.map((address) =>
        `http://${address}:${appPort}/ehagaki/web-component-parent-client-example.html`,
    );
}
