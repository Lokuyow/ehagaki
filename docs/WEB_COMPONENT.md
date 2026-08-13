# eHagaki Composer Web Component

`npm run build:web-component` produces `dist-web-component/ehagaki-composer.js`.
It is an ES module distribution and is deliberately separate from the PWA
build: it does not contain a manifest, share target, eHagaki Service Worker
registration, or the iframe bridge.

```html
<script type="module" src="https://cdn.example/ehagaki-composer.js"></script>
<ehagaki-composer
  asset-base="https://cdn.example/"
  style="--ehagaki-background: #f4f4f4; --ehagaki-font-family: system-ui"
></ehagaki-composer>
<script type="module">
  const composer = document.querySelector('ehagaki-composer');
  await composer.whenReady();
  await composer.setSettings({ locale: 'ja', themeMode: 'light' });
  await composer.setContext({ content: 'Hello from the host.' });
</script>
```

Only one connected `ehagaki-composer` is supported in a document. A second
element remains inert, emits `ehagaki-initialization-error` with
`multiple_instances_unsupported`, and rejects `whenReady()`. Disconnecting the
first element releases that slot. Disconnecting does not delete persisted data.

## API and events

- `whenReady(): Promise<void>` resolves after the component mounts.
- `setContext(context)` uses the same reply, quote, channel, and content
  validation/apply logic as iframe `composer.setContext`.
- `setSettings(settings)` applies supported settings and resolves with the
  applied keys.
- `assetBase` property / `asset-base` attribute selects the component-delivery
  base for chunks, workers, WASM, and FFmpeg assets. Set it before connection.

All events bubble and are composed: `ehagaki-ready` (detail
`{ apiVersion: 1 }`), `ehagaki-post-success`, `ehagaki-post-error`,
`ehagaki-composer-context-updated`, and `ehagaki-initialization-error`.
Error details use a safe code/message only; they do not contain secret keys,
authentication payloads, or raw errors.

The public CSS custom properties are `--ehagaki-background`,
`--ehagaki-text`, `--ehagaki-border`, `--ehagaki-link`,
`--ehagaki-input-background`, `--ehagaki-footer-background`,
`--ehagaki-dialog-background`, and `--ehagaki-font-family`. The component
also exposes `shell`, `header`, `composer`, `footer`, and `overlay-root` parts.

## Storage, origin, and trust boundary

The component runs in the host Window realm and stores directly in the host
origin, but every eHagaki localStorage key is confined to
`ehagaki.web-component.v1:`. This includes account, nsec, NIP-46, relay,
settings, and legacy-cleanup paths; raw host keys are not read, overwritten, or
removed. This first release has no migration. Data previously delegated through
the iframe parent-storage protocol is not automatically moved when switching to
the Web Component.

IndexedDB remains the app-specific `eHagakiDB` at the host origin. There is no
schema or database-name migration. The host is trusted to execute the component
and can inspect same-origin storage; the namespace is collision protection, not
a secret boundary.

## Service Workers, relays, FFmpeg, and CSP

The component neither registers nor messages an eHagaki Service Worker. A host
Service Worker may observe ordinary HTTP fetches, images, and uploads, but its
`fetch` event does not demonstrate interception of Nostr WebSocket relay
traffic. The component shares the host Window realm, and the current
`initializeNostrSession()` path creates rx-nostr without a `websocketCtor`;
rx-nostr therefore uses `globalThis.WebSocket` when it opens a relay. A host
wrapper installed before this module is imported is the applicable boundary.
This release does not claim a browser-level relay-interceptor guarantee: the
normal app relay path requires an authenticated session and no deterministic,
credential-free local-relay route was found in the existing application. No
special relay-interceptor API is provided, and Issue #89's relay-interceptor
proof remains incomplete.

Serve the module, chunks, workers, FFmpeg files, and WASM with CORS headers
that permit the embedding origin, or set `asset-base` to an accessible delivery
base. In a cross-origin embedding, FFmpeg fetches its bundled class-worker
module from `asset-base`, creates a host-origin Blob URL for that worker, then
loads `ffmpeg-core.js` and `ffmpeg-core.wasm` from `asset-base`. Permit both
the delivery origin and `blob:` in `worker-src`; do not rely on a host Service
Worker to proxy this path. Same-origin PWA delivery continues to use the emitted
worker asset directly. Test iOS Safari with the actual delivery origin: mobile
emulation does not prove its worker or CORS behavior.

The component uses an open ShadowRoot. Dialogs, popovers, tooltips, suggestions,
and PhotoSwipe are targeted at its overlay root, while browser-history and URL/
share-target input handling are disabled.
