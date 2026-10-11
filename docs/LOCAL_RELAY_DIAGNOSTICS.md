# Temporary Citrine direct-write diagnostic build

Branch: `debug/citrine-direct-write-trace`. Base: `aff49e244200805963c59c79c6658603e9eff308` (PR #315).
This branch observes the existing behavior. It intentionally retains the known pre-external-success local save trigger.

Open the diagnostic branch's Vercel Preview with `?localRelayDebug=1` (or append `&localRelayDebug=1` to an existing query).
It also works under the normal `/ehagaki/` base path. Only the standalone runtime enables it; iframe and Web Component runtimes ignore the flag.
Settings → Local relay → **Local relay diagnostics** contains **Clear** and **Copy diagnostics**.
Records exist in memory only and disappear on reload. Opening or closing Settings does not clear them.
Up to 30 operations and 512 stage records per operation are retained; a terminal record survives stage truncation.

## Android test A: direct post

1. Start Citrine with Aggregator OFF. Open the diagnostic Preview in Android Chrome. Keep the existing local-network permission enabled.
2. Sign in with the intended secret-key account, select working external relays, and set `ws://127.0.0.1:4869/` as the local relay URL.
3. In Settings, press **Clear**, then close Settings. Leave Post History closed.
4. Send one recognizable normal post and confirm external publication succeeds.
5. Open Settings and inspect `post-direct`. If it is still `observing`, allow the original six-second local deadline to finish before switching apps.
6. Copy the diagnostics or take a screenshot, then check Citrine's normal event/Logs UI. UTC timestamps and 12-character event ID prefixes help correlate the two.

## Android test B: archive

If A did not save the event, press **Clear**, close Settings, open Post History once, and let external refresh fetch the event.
Close Post History, open Settings, and inspect `history-archive`. Copy/screenshot this separately and check Citrine.
If no operation appears, the corresponding caller was not reached; the diagnostic code does not initiate history work or force archive adoption.

## Interpreting the trace

Each operation has a source, monotonically increasing operation ID, UTC start time, and elapsed milliseconds per stage.
Sources are `post-direct`, `sensitive-direct`, `repost-direct`, `deletion-direct`, and `history-archive`.

- Caller/service: `hook-invoked`, `service-entered`, `session-check`, `batch-entered`, `batch-check`.
- Selection/microtask: `candidate-accepted` / `candidate-filtered`, `batch-microtask`, `microtask-check`, `attestation-recheck`, `transport-call`.
- Transport: `transport-entered`, `relay-target`, `client-creation-started`, `client-created`, `websocket-state`, `websocket-error`, `event-send-attempt`, `event-submitted-rx-nostr`, `event-socket-send-boundary`, `relay-response`, `transport-disposed`.
- Archive: `archive-entered`, `archive-scope`, `archive-filtered`, `db-verification-passed`, `archive-adopted`, `archive-candidates`, then the same batch/transport stages.
- Terminal: `accepted`, `rejected`, `timeout`, `aborted`, `exception`, `skipped-session`, `skipped-inactive`, or `filtered`.

`session-check` distinguishes missing configuration, non-standalone runtime, owner mismatch, aborted session and inactive App scope.
Batch checks show the original service/caller guard results. If short-circuiting prevents a callback from being evaluated, that result is omitted rather than evaluating it for diagnostics.
Candidate filtering distinguishes unsupported kinds, invalid attestation and in-flight duplicates. Archive checks also report non-adoption and revision changes.
Session abort reasons include account transition, URL/runtime/identity change, effect cleanup, reconfigure and explicit service cancel; unknown external AbortSignals are `abort-unknown`.

`event-submitted-rx-nostr` means the event was passed to rx-nostr. Its outgoing observable emits **immediately before** native `WebSocket.send()`;
`event-socket-send-boundary` records that boundary, not guaranteed delivery. `OK true` / terminal `accepted` proves the relay acknowledged the event.
A WebSocket error may be followed by the existing deadline/timeout; diagnostics do not terminate or retry the operation earlier.
`AUTH` / auth-required `CLOSED` follows the existing local abort behavior. `OK false` is `rejected` with a known NIP-20 reason prefix when present.
Relay notice tails and arbitrary notices are redacted, so neither a relay echo nor an exception message can leak body text or credentials.

## Observation boundaries

No private keys, nsec, event body/content, full signature, full tags, AUTH challenge/payload, full pubkey, or full event ID is recorded.
URL output contains only scheme/host/port; credentials, path and query are excluded. Errors contain an allowlisted type only, never their message or stack.
The recorder retains only allowlisted primitive fields. Recording does not update Svelte state, schedule tasks, write to console/storage or perform network I/O.
The mounted diagnostic panel polls memory every 250ms; this polling never delays or gates publishing, persistence or local transport.

Timeouts, retry policy, clients/sockets, signer/event validation, session guards, abort behavior, NIP-65 routing, external delivery success,
local URL semantics, imported ranges and IndexedDB schema retain their existing semantics. There is no queue, resend, retry or rebroadcast.
Instrumentation still has a small timing cost; a successful diagnostic run alone does not prove the uninstrumented race has disappeared.

## Automated verification

```sh
npm run test -- src/test/unit/localRelayLive.integration.test.ts src/test/unit/localRelayPublish.test.ts src/test/unit/localRelaySettings.test.ts
npm run check
npm test
npm run build
npx playwright test --config=playwright.local-relay.config.ts --reporter=dot
```

Diagnostic integration coverage includes the real secret-key signer, hook, service, rx-nostr/socket, terminal results, short-circuit callback counts and redaction.
The HTTPS Chromium fixture uses controlled relays and no user data; diagnostic E2E uses secret-key authentication and checks accepted/timeout without opening history, plus separate archive correlation.
No USB debugging, adb, Chrome DevTools or logcat is needed for the Android tests above.
