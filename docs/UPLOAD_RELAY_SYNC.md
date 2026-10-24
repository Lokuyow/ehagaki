---
title: Upload destination relay synchronization
description: Manual Blossom and NIP-96 server-list synchronization and compatibility verification.
---

# Upload destination relay synchronization

The upload settings retain two actions: **Fetch from relays** and **Publish to relays**.
Each action processes Blossom ([BUD-03](https://github.com/hzrd149/blossom/blob/master/buds/03.md), kind 10063)
and [NIP-96](https://github.com/nostr-protocol/nips/blob/master/96.md) File Server Preferences (kind 10096).
Custom HTTP destinations are excluded. Synchronization is manual and account-scoped.

Publishing preserves enabled destination order within each protocol and signs the two events separately.
A protocol with no enabled servers is skipped. If any enabled NIP-96 destination cannot be mapped to a
verified discovery server and API, the entire kind 10096 publication fails; a shortened list is never sent.
The other protocol still runs. The result identifies success, failure, or skip separately; a mixed result is
reported as partial success.

Fetching stages the two results and applies successful lists in one database transaction. A missing,
empty, failed, or unresolved list leaves that protocol's settings intact. Matching disabled destinations
stay disabled; new destinations are enabled. A surviving enabled default is retained. Otherwise the
existing repository policy selects an enabled destination or creates its usual account-scoped fallback.
Custom HTTP settings and the relative order of unaffected destinations are preserved.

## NIP-96 URLs and cancellation

The shared server URL identifies `/.well-known/nostr/nip96.json`; its `api_url` identifies the HTTP API.
Legacy direct API destinations remain direct. Newly imported destinations use discovery before upload,
and connection tests and media management use the same discovery-server identity.
The optional `nip96ServerUrl` and `nip96UrlMode` metadata are backward compatible with existing records
and iframe snapshots; the database/schema version and Host-owned Lite API do not change.

During relay synchronization, the entire NIP-96 discovery phase has a **10-second deadline**, including
all servers, delegation, and response bodies. Relay queries separately allow up to 10 seconds for NIP-11
and connection preparation, followed by a 4-second response budget once REQ has been sent to every target
read relay. The operation snapshots those read targets; unrelated requests and repeated sends cannot
extend its timers. Preparation and response timeouts still fail without applying their collected candidates.
Discovery timeout aborts that protocol's outstanding requests, preserves any Blossom success, and releases
the operation state. Account changes cancel pending work; delayed results cannot update another session.
Local configuration edits cancel pending fetch application. No automatic retries or synchronization are added.

Remote server identities require public HTTPS origins without credentials. Discovery preserves the existing
redirect, delegation, and cross-origin URL restrictions. [NIP-98](https://github.com/nostr-protocol/nips/blob/master/98.md)
signatures continue to cover the actual HTTP request URL and method.

## Browser CORS verification — 2026-10-24

These are **real-server browser fetches**, separate from the deterministic mock-relay/discovery/upload tests.
Playwright's installed Chromium, Firefox, and WebKit engines ran native cross-origin fetches with
`credentials: "omit"`, `referrerPolicy: "no-referrer"`, and `redirect: "error"`.
No response interception, proxy, `no-cors`, TLS bypass, or disabled browser security was used.

Each entry below returned HTTP 200 with a readable CORS JSON response, and its `api_url` matched the
existing preset API after URL canonicalization, from all three tested origins:

- Development: `http://127.0.0.1:5187`.
- Production application: `https://lokuyow.github.io`.
- Representative independent host: `http://127.0.0.1:53829` (native fetch on a host page).

| Discovery server | API returned | Chromium | Firefox | WebKit |
| --- | --- | --- | --- | --- |
| `https://share.yabu.me` | `https://yabu.me/api/v2/media` | Pass | Pass | Pass |
| `https://nostrcheck.me` | `https://cdn.nostrcheck.me` | Pass | Pass | Pass |
| `https://nostr.build` | `https://nostr.build/api/v2/nip96/upload` | Pass | Pass | Pass |
| `https://nostpic.com` | `https://nostpic.com/api/v2/media` | Pass | Pass | Pass |
| `https://files.sovbit.host` | `https://files.sovbit.host/upload` | Pass | Pass | Pass |

The initial Chromium development-origin batch returned fetch `TypeError` for all five servers. A targeted
follow-up from the same origin passed all five, with no failed network requests. The cause of the initial
batch was not established. The matrix reflects the successful follow-up, not an assumption about the failure.
Checks completed around 22:02–22:06 JST; public server behavior can change later.

Mock browser tests separately exercise both buttons, both signed event kinds, imported URLs, partial
publication, unchanged Custom HTTP settings, and Japanese/English results in document, iframe, and Shadow
DOM settings surfaces. These mocks do not establish real-server CORS or real-server upload availability.
The imported NIP-96 destination is also selected as the default and used for a browser multipart upload;
the mock API verifies the NIP-98 signature, exact API URL, and POST method. Built Full Web Component
controls are separately checked at host widths of 320px and 360px in all three browser engines.

Physical Android/iOS devices, arbitrary third-party host origins, real remote signers, and authenticated
upload/list/delete against public servers are not verified by the CORS matrix. Their protocol behavior is
covered with local mocks and regression tests; public-server write operations are not needed for this change.
