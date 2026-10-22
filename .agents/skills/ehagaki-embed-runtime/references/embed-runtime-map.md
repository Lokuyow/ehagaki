# eHagaki embed runtime map

公開契約は [iframe docs](../../../../docs/IFRAME_EMBEDDING.md) と [Web Component docs](../../../../docs/WEB_COMPONENT.md)、現在の実装は code/types/tests で確認する。この索引には method/message/attribute の全一覧や既定値を複製しない。パスは repository root 基準。

## 契約からownerを探す

| 契約・変更する境界 | 主な owner / 入口 | 代表 test / sample |
| --- | --- | --- |
| Document entry / runtime switches | `src/main.ts`, `src/lib/appRuntimeEnvironment.ts`, `src/lib/bootstrap/appInitializationBootstrap.ts`, `src/lib/appRuntimeBindings.ts` | `src/test/unit/appRuntimeBindings.test.ts`, `src/test/unit/appAssetUrl.test.ts` |
| iframe envelope / parent trust / 一時 Relay Config | `src/lib/embedProtocol.ts`, `src/lib/embedMessageTrustGate.ts`, `src/lib/iframeMessageService.ts` と `src/main.ts` の bootstrap | `src/test/unit/embedMessageTrustGate.test.ts`, `src/test/e2e/iframeMessageGate.spec.ts`, `public/embed-parent-client-example.js` |
| Parent Client auth / signer delegation | `src/lib/parentClientAuthService.ts`, `src/lib/parentClientAuthCoordinator.ts`, `src/lib/appParentClientSyncController.ts` | `src/test/unit/parentClientAuthService.test.ts`, `src/test/integration/app-parent-client.integration.test.ts` |
| Settings / composer context / preload | `src/lib/embedSettingsService.ts`, `src/lib/embedComposerContextService.ts`, `src/lib/embedComposerContextValidation.ts`, `src/lib/embedComposerContextApply.ts`, `src/lib/appEmbedController.ts` | `src/test/unit/embedComposerContextValidation.test.ts`, `src/test/unit/embedComposerContextApply.test.ts`, `src/test/unit/appEmbedController.test.ts` |
| Storage / IndexedDB delegation | `src/lib/embedStorageService.ts`, `src/lib/embedStorageKeys.ts`, `src/lib/embedIndexedDbService.ts`, `src/lib/bootstrap/uploadDestinationBootstrap.ts` | `src/test/unit/embedStorageService.test.ts`, `src/test/unit/embedIndexedDbService.test.ts` |
| Startup query / external input | `src/lib/urlQueryHandler.ts`, `src/lib/bootstrap/externalInputBootstrap.ts`, `src/lib/bootstrap/embedSettingsBootstrap.ts` | `src/test/unit/urlQueryHandler.test.ts`, `src/test/unit/externalInputBootstrap.test.ts`, `src/test/e2e/embedParentClientExample.spec.ts` |
| Full / Lite registration / public methods/events | `src/web-component/entry.ts`, `src/web-component/host-owned-entry.ts`, `src/web-component/element.ts`, `src/web-component/distributionRegistration.ts`, `src/web-component/types.ts`, `src/web-component/notificationPort.ts` | `src/test/unit/webComponentNotificationPort.test.ts`, `src/test/integration/webComponentSubst.integration.test.ts`, `src/test/e2e/webComponentEmbed.spec.ts` |
| Ready / disconnect / instance ownership | `src/web-component/element.ts`, `src/host-owned-composer-lite/HostOwnedComposerLiteApp.svelte`, `src/components/PostComponent.svelte` | `src/test/e2e/webComponentLite.spec.ts`, `src/test/e2e/webComponentParentClientExample.spec.ts` |
| Storage namespace / auth / navigation isolation | `src/lib/appStorage.ts`, `src/lib/appRuntimeEnvironment.ts`, `src/lib/bootstrap/nip07AutoLoginBootstrap.ts` と各 entry | `src/test/e2e/webComponentEmbed.spec.ts`, `src/test/unit/nip07AutoLoginBootstrap.test.ts` |

## 初期化とownershipの注意点

- Runtime configuration は module-level。document / Full / Lite の各 entry が App import より先に設定し、host-owned と app-owned の graph を分ける。iframe は document entry を使い、Direct Web Component は同じ Window realm の DOM method/event を使う。
- iframe の `hostRelayConfig=1` は App import 前の fail-close bootstrap。trust、payload、request ID、timeout の失敗は document lifetime の terminal state で、保存済み relay・auth/account/guest・通常 fallback graph を起動しない。marker なしの経路へ広げない。
- Parent signer と認証 UI/state は parent-owned。capability、pubkey、request kind/result を既存 service で照合する。共通 trust gate は envelope/source/origin に留め、各 service の payload/pending/timeout を統合しない。
- Composer context は全体検証後に patch/apply し、bootstrap/parent auth 中は controller の queue/flush に従う。一時 `preloadedEvents` は verified snapshot、`preloadedProfiles` は author identity と owner token に結び付く表示 snapshot。URL・永続化・context notification へ流さない。Web Component の profile snapshot は operation queue へ入れる前に detach し、caller mutation を持ち込まない。
- Child の local persistence と parent の optional delegated mirror は別責務。storage allowlist を保ち、新しい key の request を既存 strict Host 用 batch に混ぜない。IndexedDB delegation は upload destination の公開契約に限定し、credential/draft/profile/relay cache や host 全 storage へ広げない。
- Full は self-publish、Lite は host submit/media handoff を所有する。Lite の immutable configuration は接続前に確定し、未指定 optional feature を UI/出力で有効化しない。Full の headless `uploadFile()` は ready 後だけ実行し、operation queue や Composer state を経由させない。両 distribution は同一 tag を使い、cross-distribution import を許可しない。
- Ready は App 初期化と最初の editor 状態通知に従い、Full の opt-in auto-login 完了、Lite auto-grow の有効な初回計測も待つ。hidden host の invalid/zero size に fallback ready を出さない。disconnect は generation、pending promise/queue、observer、mount、instance slot を既存 owner で解放する。hidden/redisplay と remove/recreate を区別する。
- Lite preferred height は intrinsic content/reservation の通知であり、最終 definite height は Host が採用・clamp・無視を決める。editor 自身の scroll と Composer 全体の overflow を混同しない。具体的な input validation と default は Web Component docs と test を確認する。
- Full の auth restore は既存順序を保ち、後続候補が成功すれば途中の基盤異常だけで止めない。全候補の正常失敗時だけ opt-in NIP-07 fallback を行い、基盤異常を含む全失敗では行わない。取得済み identity は再利用する。Lite は auth を起動しない。Web Component の namespaced storage、SW/external input/history/local nsec の無効化を他 runtime と混ぜない。

## assetと配信の入口

| 境界 | 参照先 |
| --- | --- |
| Runtime asset base / icon rewrite / Shadow DOM style | `src/lib/appAssetUrl.ts`, `src/web-component/iconAssets.ts`, `src/web-component/element.ts`, `src/test/unit/webComponentIconAssets.test.ts` |
| Full/Lite build / working directory / output validation | `scripts/runWebComponentBuild.mjs`, `scripts/webComponentBuildRunner.mjs`, `scripts/webComponentBuildWorkingDirectory.mjs`, `scripts/verifyWebComponentBuild.mjs` |
| Lite forbidden graph | `scripts/hostOwnedLiteGraphGate.mjs` |
| Dev proxy / site assembly | `scripts/devWebComponentSample.mjs`, `scripts/webComponentDevServerConfig.mjs`, `scripts/assembleWebComponentSite.mjs`, `src/test/e2e/webComponentDevServer.spec.ts` |
| Host samples | `public/web-component-parent-client-example.html`, `public/host-owned-composer-lite-example.html` と対応 JS |

Document Vite base と component distribution の `asset-base` を同一視せず、active runtime の `resolveAppAssetUrl()` を使う。Full の未指定時 base 解決と、sample の connection 前の明示指定を区別する。FFmpeg worker/core/WASM、icons、dynamic chunks も同じ distribution の配信境界で確認する。

公開 CSS custom properties は Web Component docs を参照する。open ShadowRoot、container/overlay containment、host size を明示して計測し、未公開 `::part()`、複数同時接続 instance、Web Component 向け Parent Client `postMessage` を既存契約とみなさない。

Origin/message の純粋検証は unit/integration、実 iframe gate、registration、Shadow DOM、lifecycle、cross-origin assets は対応 E2E が入口。検証コマンド・build の条件は [開発ガイド](../../../guides/development.md)、geometry/focus の実測は [browser 索引](../../ehagaki-browser-debug/references/browser-debug-map.md) を使う。
