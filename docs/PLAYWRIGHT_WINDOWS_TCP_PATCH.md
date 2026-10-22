# Windows Chromium loopback TCP patch

The ordinary Playwright config uses four workers on every platform. On Windows,
Chromium's `TcpPortRandomizationWin` feature can cause rapid loopback connections
to fail with `ERR_NO_BUFFER_SPACE` / Winsock 10055. This was reproduced locally
with Chromium 147 and Windows 11 Build 26300 using synthetic HTTP resources.

The upstream reports describe the same connection failure:

- [Chromium issue 572515601](https://issuetracker.google.com/issues/572515601)
- [Playwright issue 43545](https://github.com/microsoft/playwright/issues/43545)

`patches/playwright-core+1.59.1.patch` adds this feature to Playwright's existing
disabled-feature list only on Windows. It preserves the other launch switches,
browser projects, worker count, assertions, retries, and timeouts. Application
and OS network settings are unaffected. The existing `npm ci` postinstall
applies the versioned patch through `patch-package --error-on-fail`.

`src/test/unit/playwrightChromiumPatch.test.ts` checks the installed artifact for
both Windows and Linux and fails when the patch is missing. When upgrading
Playwright, review the upstream issue status and this patch against the new
Chromium build. Remove the workaround once upstream handles this failure or
disables the feature, and verify repeated loopback loads and the four-worker
E2E suite before removing the installed-switch guard.
