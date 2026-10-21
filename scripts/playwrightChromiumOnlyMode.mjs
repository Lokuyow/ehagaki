/** @returns {boolean} */
export function isChromiumOnlyPlaywrightRun() {
    if (process.env.EHAGAKI_E2E_ALL_BROWSERS === "1") {
        return false;
    }

    return process.env.EHAGAKI_E2E_AGENT === "1" || process.env.CI === "true";
}

/** @param {readonly string[]} browsers @returns {string[]} */
export function resolvePlaywrightBrowserNames(browsers) {
    return isChromiumOnlyPlaywrightRun() ? ["chromium"] : [...browsers];
}
