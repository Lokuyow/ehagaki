# JSONL import measurement

Run `node scripts/benchmarkPostHistoryJsonlImport.mjs` from the repository root.
It generates 10,000 signed kind 1 events once in the ignored
`node_modules/.cache/jsonl-benchmark-fixture.json` (no secret key is saved), then
uses that same fixture for a warm-up and five recorded runs. Keep the fixture for
before/after comparisons. Each CLI run has a fresh browser page/context,
disposable database and production verification pool (four Workers by default).
Generation, module loading, page setup and database cleanup are outside the
measured import wall time. Repository time includes database
waits and overlaps Worker processing; do not add it to wall time.

The default browser is headless Playwright Chromium, 1280×720, using Vite dev
modules at `/ehagaki/`. Output includes the browser version, import counters,
wall/repository time, longest heartbeat/frame gap, and Chromium long tasks.
`postHistoryGetCalls` counts direct table `.get()` calls, excluding bulk reads;
ordinary posts should require none for Sensitive Structure reconciliation.
`candidateAuthorScanCalls` counts executions of
`postHistory.where("pubkeyHex").equals(...).toArray()`, the author-history scan
used by candidate reconciliation during import. The instrumentation is local to
the disposable benchmark DB. Files with no Sensitive payload records should
report zero even when they contain many ordinary kind 5 deletion targets. A
present payload can still trigger this scan to find and verify its Structure.
Close competing workloads and keep the browser in the foreground for meaningful
comparisons. These measurements are not production-bundle or real-device results.

Use `--workers 1`, `--workers 2`, or `--workers 4` to record a specific pool size,
or `--compare-workers` for one warm-up and five recorded runs for each size using
the shared fixture. This is benchmark configuration only; the product UI always
uses four Workers. The pool shares the existing queue limit of 32 and batch size
of 500. Worker count comparisons are records, not a default-selection gate.

To measure an existing local JSONL with installed Windows Chrome:

```powershell
node scripts/benchmarkPostHistoryJsonlImport.mjs --jsonl '<absolute JSONL path>' --channel chrome --workers 4
```

This mode infers the primary account by authored-post count before timing,
selects the local file in the browser, and prints only counts and timings.
It expects a valid fixture with distinct post IDs and successful saves. Use the
manual page below to select a different account or other input characteristics.
The file is never copied into the repository or uploaded to the measurement
server. Use the same browser channel for comparisons; the default bundled
Chromium and installed Chrome can have different versions and performance.

For manual measurement on the same computer:

```powershell
node scripts/benchmarkPostHistoryJsonlImport.mjs --serve
```

For another device on your local network:

```powershell
node scripts/benchmarkPostHistoryJsonlImport.mjs --serve --host 0.0.0.0
```

Open `http://<computer LAN IP>:51561/ehagaki/jsonl-benchmark.html` on the device.
Select the JSONL and enter its account's 64-character public key (never nsec).
Select 1, 2, or 4 Workers (initially 4) on this benchmark page.
File contents stay on that device and are never uploaded to the measurement
server. Each click imports into a new isolated database, reports only timings and
counts, then deletes that database. Record one warm-up and five further runs using
the same file, public key, browser version, device and foreground-tab conditions.
Existing account history is not used. Stop the server with Ctrl+C when finished.
Use `--port <unused port>` if necessary. Long-task data is null on engines that
do not support that PerformanceObserver entry type.

The page measures the import service. Use the application's import dialog to
check its ETA and cancellation behavior separately. No benchmark fields or
messages are added to the production Worker protocol.
