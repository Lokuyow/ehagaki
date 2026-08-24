# eHagaki embed runtime map

この map は調査時点の checkout を索引化したものです。実装、公開 sample、または test が変わった場合は現在の code を優先し、主要 contract が変わる変更ではこの map も更新します。

## Runtime environment と document entry

- **責務:** `src/main.ts` は document entry で `configureAppRuntimeEnvironment()` を行ってから `App.svelte` を dynamic import/mount する。`runtimeKind` は `window.top === window` なら `standalone`、それ以外は `iframe`。viewport layout、document/body targets、`import.meta.env.BASE_URL` からの `appHomeHref` / `assetBase`、service worker、external input、history、local nsec auth を有効にする。
- **flow:** `main.ts` → `applyEmbedSettingsBootstrap()` / `applyUploadDestinationBootstrap()` → `App.svelte` → `runAppInitializationBootstrap()`。iframe は別 entrypoint ではなく、この document entry と URL を使う。
- **ownership:** document と service worker は app-owned。iframe host は `parentOrigin` と Parent Client message の consumer であり、child document を直接操作する contract ではない。
- **注意点:** `AppRuntimeEnvironment` は process/module-level configuration。Web Component は `App.svelte` を import する前にこれを明示的に置き換えるため、entrypoint の import順が contract になる。
- **関連 test:** `src/test/unit/appAssetUrl.test.ts`、`src/test/unit/appRuntimeBindings.test.ts`、`src/test/unit/headerComponent.test.ts`、`src/test/unit/uiStore.test.ts`。

## iframe detection と Parent Client protocol

- **主な実装:** `src/lib/embedProtocol.ts` は `ehagaki.embed` / version `1` の envelope、message type、`embedMessageRequiresRequestId()`、`getParentOriginFromSearch()` を定義する。`src/lib/embedMessageTrustGate.ts` は受信 envelope、`event.source === window.parent`、指定された parent origin の照合を行う。
- **public input:** iframe URL の `parentOrigin`。message envelope は `{ namespace, version, type, requestId?, payload? }`。`auth.*`、`rpc.*`、`settings.*`、`storage.*`、`idb.*`、`composer.*` の request/response 系で non-empty `requestId` が必要。
- **flow:** parent sample → iframe window の `postMessage(..., childOrigin)`、または child service → `window.parent.postMessage(..., parentOrigin)`。`IframeMessageService` は `ready`、post result、settings/composer acknowledgement を child から送信する adapter。
- **trust/lifecycle:** `src/lib/iframeMessageService.ts` の `isInIframe()` は cross-origin top access 失敗時も iframe とみなす。`parentOrigin` がない、許可されない、または iframe 外なら送信しない。受信側の各 service は trust gate、payload shape、request ID、timeout/pending map を個別に保持する。
- **関連資料/検証:** `docs/IFRAME_EMBEDDING.md`、`public/embed-parent-client-example.html` / `.js`、`src/test/unit/iframeMessageService.test.ts`、`src/test/unit/embedMessageTrustGate.test.ts`、`src/test/e2e/iframeMessageGate.spec.ts`、`src/test/e2e/embedParentClientExample.spec.ts`。

## Parent Client auth delegation

- **主な実装:** `src/lib/parentClientAuthService.ts` の `ParentClientAuthService` と `ParentClientSignerAdapter`、`src/lib/parentClientAuthCoordinator.ts`、`src/lib/appParentClientSyncController.ts`。`App.svelte` は runtime binding で remote login/logout を controller へ渡す。
- **contract:** child は `ready` を通知し、`auth.request` に対する `auth.result` / `auth.error`、署名等の `rpc.request` に対する `rpc.result` / `rpc.error` を request ID で対応付ける。現在の capability allowlist は `signEvent`、`nip44.encrypt`、`nip44.decrypt` で、既定 request は `signEvent`。
- **ownership/trust:** signer と認証 UI/state は parent-owned、child は validated capability と session を使う。service は parent origin、source、envelope、request kind、pubkey/capability/payload shape を照合し、timeout と pending request を cleanup する。秘密鍵や signing payload を host/child 間 contract に追加しない。
- **関連 test:** `src/test/unit/parentClientAuthService.test.ts`、`src/test/unit/parentClientAuthCoordinator.test.ts`、`src/test/unit/appParentClientSyncController.test.ts`、`src/test/integration/app-parent-client.integration.test.ts`。NIP や署名の内容を変える作業は `ehagaki-nostr` も読む。

## Settings と composer context delegation

- **settings:** `src/lib/embedSettingsService.ts` は trusted parent の `settings.set` を validation して listener へ届ける。`App.svelte` → `createAppEmbedController()` → `settingsStore.applyParentSettings()` が app state と persistence を適用し、`settings.applied` / `settings.error` を同じ request ID で通知する。first-paint URL handling は `src/lib/bootstrap/embedSettingsBootstrap.ts` と `index.html`、runtime update は message service であり、混同しない。
- **composer:** `src/lib/embedComposerContextService.ts` は `composer.setContext` を受信し、`src/lib/embedComposerContextValidation.ts`、`embedComposerContextPatch.ts`、`embedComposerContextApply.ts` が payload を全体検証してから patch/apply する。`AppEmbedController` は bootstrap / parent auth 中の action を保留し、flush 後に `composer.contextApplied` / `composer.contextError` を返す。local user change は `embedComposerContextNotification.ts` 経由で `composer.contextUpdated` を通知する。
- **public input:** composer context は `reply`、`quotes`、`content`、`channel`、任意の一時 `preloadedEvents` を持つ patch payload。URL startup input は `src/lib/urlQueryHandler.ts` と `src/lib/bootstrap/externalInputBootstrap.ts`、runtime change は `composer.setContext`。`preloadedEvents` は最終 hydration targetに対応する署名済みeventだけをplain snapshot化して既存hydrationへ渡し、保存・URL query・`composer.contextUpdated` には使わない。`undefined` と明示的な `null` / empty array の意味は `docs/IFRAME_EMBEDDING.md` と validation/apply test で確認する。
- **関連 test:** `src/test/unit/embedSettingsService.test.ts`、`embedSettingsBootstrap.test.ts`、`embedComposerContextService.test.ts`、`embedComposerContextApply.test.ts`、`embedComposerContextPatch.test.ts`、`embedComposerContextNotification.test.ts`、`embedComposerContextValidation.test.ts`、`externalInputBootstrap.test.ts`、`urlQueryHandler.test.ts`、`appEmbedController.test.ts`、`appRuntimeBindings.test.ts`、`embedParentClientExample.spec.ts`。

## localStorage と IndexedDB delegation

- **storage:** `src/lib/embedStorageService.ts` は iframe 内でのみ `storage.get` / `storage.set` / `storage.remove` を parent に request する。`src/lib/embedStorageKeys.ts` の allowlist 以外は delegation しない。`AppEmbedController.initializeEmbedStorageSync()` は snapshot を local storage に反映し、stored settings を再適用してから allowed keys を mirror する。
- **IndexedDB:** `src/lib/embedIndexedDbService.ts` は `idb.getSnapshot` / `idb.setSnapshot` と `idb.result` / `idb.error` を扱う。現在の `EmbedIndexedDbStoreName` は `uploadDestinations` のみ。`src/lib/bootstrap/uploadDestinationBootstrap.ts` と upload destination repository の caller も確認する。
- **ownership/trust:** child local persistence は app-owned。parent persistence は optional delegated mirror で、host の storage 全体、account、credential、draft、profile/relay cache を渡す contract ではない。双方とも trusted parent、validated payload、request ID、timeout、pending request cleanup を守る。
- **関連資料/検証:** `docs/IFRAME_EMBEDDING.md`、`public/embed-parent-client-example.js`、`src/test/unit/embedStorageService.test.ts`、`src/test/unit/embedIndexedDbService.test.ts`。

## URL query と external input

- **主な実装:** `src/lib/urlQueryHandler.ts` が query を parse/clean up し、`src/lib/bootstrap/externalInputBootstrap.ts` が shared content、composer context、URL input を bootstrap へ適用する。`src/lib/bootstrap/appInitializationBootstrap.ts` は `externalInputEnabled` が true のときだけこれを呼ぶ。
- **runtime差:** standalone/iframe document entry では external input が有効。Web Component は `externalInputEnabled: false` のため URL / share-target input を consumer にしない。Web Component host は `setContext()` / `setSettings()` を使用する。
- **関連 test:** `src/test/unit/urlQueryHandler.test.ts`、`src/test/unit/externalInputBootstrap.test.ts`、iframe parent sample E2E。

## Web Component entrypoint と public API

- **entry/build input:** full entry は `src/web-component/entry.ts`、Host-owned Lite entry は `src/web-component/host-owned-entry.ts`。それぞれ `/web-component/ehagaki-composer.js` と `/web-component/host-owned/ehagaki-composer.js` として同じ `EHAGAKI_COMPOSER_TAG_NAME` (`ehagaki-composer`) を登録する。`src/web-component/distributionRegistration.ts` は document ごとに一方だけを許可し、cross-distribution import を決定論的に reject する。型と API version は `src/web-component/types.ts`。
- **public surface:** `src/web-component/element.ts` の observed attribute は `asset-base` と `auto-login`、対応 property は `assetBase` と `autoLogin`。どちらも mount 時に読み取られ、接続後の変更は次の mount から有効。公開 method は `whenReady(): Promise<void>`、`setContext(context)`、`setSettings(settings)`。`setContext` / `setSettings` は connect 前や ready 前の呼び出しを operation queue に入れる。
- **Host-owned modes:** full は self-publish 専用で、`configureHostOwned()` / `setCustomEmojis()` を公開しない。Lite は `configureHostOwned()` を connection 前に一度だけ必要とし、auth/account/session、relay/NIP-46、event signing/send、history/draft、iframe Parent Client、通常 uploader transport を composition graph に含めない。shared composer UI は `PostComponent.svelte`、Lite root は `src/host-owned-composer-lite/HostOwnedComposerLiteApp.svelte`。
- **events:** `ehagaki-ready`（`apiVersion`）、`ehagaki-initialization-error`（`initialization_failed` / `multiple_instances_unsupported` / `disconnected`）、`ehagaki-post-success`、`ehagaki-post-error`、`ehagaki-composer-context-updated`。`src/web-component/notificationPort.ts` が App notification を composed/bubbling CustomEvent に adapter する。
- **app seam:** `App.svelte` が export する `setEmbedContext()` / `setEmbedSettings()` を element が in-process に使用する。Web Component は Parent Client `postMessage` を使わない。
- **関連資料/検証:** `docs/WEB_COMPONENT.md`、`public/web-component-parent-client-example.html` / `.js`、`src/test/unit/webComponentNotificationPort.test.ts`、`src/test/integration/webComponentSubst.integration.test.ts`、`src/test/e2e/webComponentEmbed.spec.ts`、`webComponentParentClientExample.spec.ts`。

## Web Component lifecycle と instance ownership

- **責務:** `EHagakiComposerElement.connectedCallback()` は one connected instance を許可し、2 個目は `multiple_instances_unsupported` で ready promise を reject する。`disconnectedCallback()` は connection generation を進め、MutationObserver を disconnect、Svelte app を unmount、active slot を release する。
- **ready/error:** mount 後の App `onInitialized` が ready promise を resolve して `ehagaki-ready` を dispatch する。Full で `auto-login` が有効な場合だけ startup auth または guest fallback bootstrap の完了も待つ。未指定の Full と Host-owned Lite の ready timing は従来どおり。mount failure、ready 前 disconnect、同時 primary instance は initialization error を dispatch し promise を reject する。remove 後に replacement を connect するのは既存 contract。
- **host/component boundary:** host は element の creation/removal、size、attribute/property/method/event consumer。component は shadow root、mount target、overlay root、stateful App instance、operation queue、asset observer を所有する。hidden/redisplay と remove/recreate は同じものではない。
- **関連 E2E:** `webComponentEmbed.spec.ts` は second instance rejection、disconnect/recreate、hidden redisplay、ready 前 `setContext`、host/storage/service-worker isolation を確認する。`webComponentParentClientExample.spec.ts` は sample の auto/manual mount と lifecycle control を確認する。

## Web Component storage、auth、navigation の差

- **storage:** `src/lib/appStorage.ts` の `createWebComponentStorage()` は host `localStorage` を versioned `ehagaki.web-component.v1:` namespace に限定する。raw host storage を App に渡さない。
- **auth/navigation/runtime switches:** Full element は runtime を `web-component`、container layout、ShadowRoot/host targets、`serviceWorkerEnabled: false`、`externalInputEnabled: false`、`historyEnabled: false`、`localNsecAuthEnabled: false`、`auto-login` 属性に従う `autoLoginNip07Enabled` に設定する。既定は `false`。有効時は managed restore を既存順序で完了し、正常に未認証となった場合だけ `resolveNip07AutoLoginSession` が NIP-07 fallback を行う。保存済み NIP-07 mismatch で既に得た identity は再問い合わせせず再利用し、restore 基盤異常では fallback しない。Host-owned Lite は属性を許容するが認証を開始せず無視する。NIP-07/NIP-46 の contract 自体は Nostr/auth implementation を確認する。
- **確認対象:** component-only change では、host storage namespace、service worker registration、history behavior、local nsec UI/legacy cleanup を Web Component E2E の該当 case と照合する。

## asset base、Shadow DOM、style surface

- **asset flow:** document app は `import.meta.env.BASE_URL` から `assetBase` を設定する。`src/lib/appAssetUrl.ts` の `resolveAppAssetUrl()` と asset-consuming caller は active runtime base を使う。Web Component は `asset-base` または entry module URL に相対な base を `new URL(..., import.meta.url)` で解決する。full の未指定 fallback semantics は維持する。公式 Full self-publish sample と Lite Host-owned sample/E2E は connection 前に、それぞれの distribution directory を明示する。
- **icons/build transform:** `src/web-component/element.ts` は app CSS を open ShadowRoot に inline し、document-root selector を `:host` / shell 用に transform する。`src/web-component/iconAssets.ts` は build-only icon CSS variable を component `assetBase` の `icons/*.svg` URL に置換する。FFmpeg worker/core/WASM も active asset base の caller を確認する。
- **style API:** host に提供されている theme surface は `getWebComponentThemeCss()` の `--ehagaki-accent-color`、`--ehagaki-base-color`、`--ehagaki-background`、`--ehagaki-text`、`--ehagaki-border`、`--ehagaki-link`、`--ehagaki-input-background`、`--ehagaki-footer-background`、`--ehagaki-dialog-background`、`--ehagaki-font-family`。Shadow root は open。公開 `::part()` API は checkout で確認できない。
- **layout:** component shell は `container-type: inline-size`。container behavior、overlay containment、host width/height、computed styles は `webComponentEmbed.spec.ts` の DOM/geometry assertions を基準に確認する。browser-specific geometry は `ehagaki-browser-debug` の領域。
- **関連 test:** `src/test/unit/appAssetUrl.test.ts`、`webComponentIconAssets.test.ts`、`src/test/e2e/webComponentEmbed.spec.ts`。

## Web Component build、delivery、sample

- **scripts:** `package.json` の `build:web-component` は `scripts/runWebComponentBuild.mjs`、`dev:web-component` は `scripts/devWebComponentSample.mjs` を入口にする。`scripts/webComponentBuildRunner.mjs` は full と Lite output を順に作り、`scripts/hostOwnedLiteGraphGate.mjs` は Lite entry から static/dynamic graph を走査して forbidden dependency を build failure にする。build execution/working directory は `scripts/webComponentBuildWorkingDirectory.mjs`、dev host/proxy config は `scripts/webComponentDevServerConfig.mjs`、output validation は `scripts/verifyWebComponentBuild.mjs`、site assembly は `scripts/assembleWebComponentSite.mjs` を確認する。
- **contract-relevant output:** full は `dist-web-component/ehagaki-composer.js` と `dist-web-component/assets/`、Lite は `dist-web-component/host-owned/ehagaki-composer.js` と `dist-web-component/host-owned/assets/` および `icons/`。host page からの module import、`asset-base`、production/dev sample の URL は distribution 単位でまとめて扱う。
- **sample:** `public/host-owned-composer-lite-example.html` が唯一の Host-owned manual sample で、Lite の `asset-base`、mount/destroy/recreate、Host handoff を示す。Full self-publish と iframe の parent sample はこれと別に管理する。
- **関連 test/config:** `src/test/unit/webComponentDevServerConfig.test.ts`、`webComponentBuildWorkingDirectory.test.ts`、`src/test/e2e/webComponentDevServer.spec.ts`、`playwright.web-component-dev.config.ts`。通常 E2E project は `playwright.config.ts` の desktop Chromium/mobile Chromium/mobile WebKit/desktop Firefox の実際の `testMatch` / `testIgnore` を確認する。

## 検証選択

- message schema、origin/source、request ID、timeout、validation、controller state は unit/integration test を先に選ぶ。
- public iframe contract、real iframe message gate、Web Component registration/public API/Shadow DOM/lifecycle/asset origin は Playwright を使う。project 名だけから browser engine や実端末対応を推測しない。
- `src/test/e2e/webComponentEmbed.spec.ts` は production-style bundle、cross-origin asset base、storage/SW isolation、style/theme, lifecycle、pre-ready API、FFmpeg asset load を横断的に扱う。`src/test/e2e/webComponentParentClientExample.spec.ts` は host sample と responsive/lifecycle contract を扱う。
- Vite entry、Web Component output、asset path、worker/WASM、sample delivery、PWA/service worker に触れた変更は `npm run build` を実行する。document-only map/skill update には application test、Playwright、build は不要。

## 現 checkout で確認できなかった public surface

- Web Component の公開 `::part()` style API。
- Web Component の複数同時接続インスタンスを許可する contract（現実装は one active connected instance）。
- Web Component と parent iframe client 間の `postMessage` contract（Direct Web Component は DOM method/event adapter）。
