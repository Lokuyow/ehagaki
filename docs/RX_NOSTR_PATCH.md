# rx-nostr v3 publish ACK isolation

eHagaki pins `rx-nostr` to **3.7.8** and applies `patches/rx-nostr+3.7.8.patch`
using `patch-package@8.0.1` (devDependency). [Upstream #204](https://github.com/penpenpng/rx-nostr/issues/204)
allows concurrent sends of the same signed event to consume each other's relay OKs.
Filtering only in the caller cannot repair `all-ok` completion and `confirmOK()` teardown.

The patch restricts each send's shared OK stream to matching event ID **and** the
resolved target connections' URLs. It changes only source, ESM, CJS and UMD
publish predicates; 3.7.7's default-relay fix and 3.7.8's replaceable-event comparison
remain upstream code. AUTH/retransmission and teardown are unchanged. v4 migration
is outside this change.

`npm ci` / `npm install` run `patch-package --error-on-fail` and the verifier.
`npm run verify:rx-nostr-patch` checks manifest/lock/installed version, one locked
installation, exports/artifact resolution, versioned patch presence and LF-normalized
SHA-256 of all four patched artifacts. Main Vite, Web Component Vite and Vitest
also run this guard, so an install with scripts disabled fails before compilation
or prebundle reuse. Normal builds require devDependencies.

Vite's existing lockfile, patches-directory and config cache invalidation remains
in use; no `optimizeDeps.exclude` workaround is needed.

Before updating rx-nostr, inspect the new package's real source and exports,
run focused tests/type checks unpatched, and reproduce #204 with
`src/test/unit/rxNostrSendIsolation.test.ts`. Recreate/review the minimal versioned
patch and all artifact hashes together. Never refresh hashes merely to bypass a
failed verifier. Remove this patch only after the direct regression and NIP-65
E2E pass without it. CI tests clean install and actual ESM/CJS/UMD send on Windows
and Ubuntu using Node 22, consistent with the repository's existing CI.
