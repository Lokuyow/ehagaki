# eHagaki browser debug map

必要な症状の行から現行 code/test を探すための索引。実装位置は checkout で確認し、計測値や設定一覧をこの文書の仕様とみなさない。計測手順は [計測メモ](measurement.md)、一般的な実行手順は [開発ガイド](../../../guides/development.md) を必要なときに使う。

## 症状からownerを探す

パスは repository root 基準。test は代表例であり、対象の caller/consumer に応じて選ぶ。

| 症状・境界 | 主な owner / 入口 | 代表 test |
| --- | --- | --- |
| Viewport / keyboard geometry | `src/lib/utils/viewportLayout.ts`, `src/stores/uiStore.svelte.ts`, `src/lib/hooks/useComposerLayoutMetrics.svelte.ts` | `src/test/unit/viewportLayout.test.ts`, `src/test/unit/uiStore.test.ts` |
| Editor focus / toolbar tap | `src/lib/utils/keyboardFocusUtils.ts`, `src/lib/utils/appDomUtils.ts`, `src/components/KeyboardButtonBar.svelte` | `src/test/unit/keyboardFocusUtils.test.ts`, `src/test/unit/keyboardButtonBar.test.ts` |
| Touch scroll lock / overscroll | `src/lib/utils/keyboardTouchScrollLock.ts`, `src/components/CustomEmojiPicker.svelte`, `src/components/SuggestionCommandList.svelte` | `src/test/unit/keyboardTouchScrollLock.test.ts` |
| Footer / main / dialog の予約高 | `src/app.css`, `src/stores/uiStore.svelte.ts`, `src/components/FooterComponent.svelte`, `src/components/ComposerTargetDialog.svelte` | `src/test/unit/footerComponent.test.ts`, `src/test/e2e/composerTargetDialog.spec.ts` |
| Dialog / portal / focus / Back | `src/components/DialogWrapper.svelte`, `src/components/ConfirmDialog.svelte`, `src/components/InfoPopoverButton.svelte`, `src/lib/hooks/useDialogHistory.svelte.ts` | `src/test/unit/useDialogHistory.test.ts`, `src/test/e2e/postHistoryDialog.spec.ts` |
| Selection / composition / caret | `src/lib/editor/editorLifecycle.ts`, `src/lib/editor/editorInputGuard.ts`, `src/lib/editor/androidCompositionFix.ts`, `src/lib/editor/toolbarCaretExtension.ts` | `src/test/integration/editor-history.integration.test.ts`, `src/test/e2e/postEditorSending.spec.ts`; document/transaction は [editor 索引](../../ehagaki-editor/references/editor-map.md) |
| Clipboard / paste / drag | `src/lib/editor/clipboardExtension.ts`, `src/lib/editor/editorDomActions.svelte.ts`, `src/lib/editor/mediaPaste.ts`, `src/lib/editor/imageDragDrop.ts`, `src/lib/editor/customEmojiDragDrop.ts` | `src/test/integration/editor-clipboard.integration.test.ts`, `src/test/integration/editor-url-paste.integration.test.ts` |
| iframe の source/origin / focus / storage | `src/lib/embedMessageTrustGate.ts`, `src/lib/iframeMessageService.ts`, `src/lib/appRuntimeBindings.ts` | `src/test/e2e/iframeMessageGate.spec.ts`, `src/test/e2e/embedParentClientExample.spec.ts`; message 契約は [runtime 索引](../../ehagaki-embed-runtime/references/embed-runtime-map.md) |
| Shadow DOM / host geometry / reconnect | `src/web-component/element.ts`, `src/lib/appRuntimeEnvironment.ts`, `src/lib/appAssetUrl.ts` | `src/test/e2e/webComponentEmbed.spec.ts`, `src/test/e2e/webComponentLite.spec.ts`, `src/test/e2e/webComponentParentClientExample.spec.ts` |
| URL / first paint / share input | `src/lib/urlQueryHandler.ts`, `src/lib/bootstrap/externalInputBootstrap.ts`, `src/lib/bootstrap/embedSettingsBootstrap.ts` | `src/test/unit/urlQueryHandler.test.ts`, `src/test/unit/externalInputBootstrap.test.ts`, iframe sample E2E |
| PWA / update / offline / share target | `public/sw.js`, `src/lib/swPrecacheInstall.ts`, `src/lib/bootstrap/serviceWorkerBootstrap.ts`, `src/stores/swStore.svelte.ts`, `src/lib/shareHandler.ts` | `src/test/unit/sw.test.ts`, `src/test/unit/swPrecacheInstall.test.ts`, `src/test/e2e/serviceWorkerUpdate.spec.ts` |
| IndexedDB / upgrade / blocked / 複数context | `src/lib/storage/ehagakiDb.ts`, `src/lib/storage/ehagakiDbConstants.ts`, `src/lib/swIndexedDbSchema.ts`, `src/lib/swIndexedDbOperationUtils.ts`, `src/lib/embedIndexedDbService.ts` | `src/test/unit/ehagakiDb.test.ts`, `src/test/unit/swIndexedDbSchema.test.ts`, `src/test/unit/swIndexedDbOperationUtils.test.ts` |
| Image / video / gallery / fullscreen | `src/components/SvelteImageNode.svelte`, `src/components/SvelteVideoNode.svelte`, `src/components/MediaGallery.svelte`, `src/components/ImageFullscreen.svelte`, `src/lib/hooks/useMediaLoadState.svelte.ts` | `src/test/unit/mediaNodeUtils.test.ts`, `src/test/unit/imageFullscreen.test.ts`, `src/test/integration/editor-media.integration.test.ts` |
| UA 分岐 / API availability | `src/lib/utils/viewportLayout.ts`, `src/lib/utils/keyboardFocusUtils.ts`, `src/lib/utils/appDomUtils.ts`, `src/lib/videoCompression/mediabunnyCompression.ts`, `src/lib/postMediaCacheService.ts` | `src/test/unit/appDomUtils.test.ts`, `src/test/unit/postMediaCacheService.test.ts` |

## 症状固有の注意点

- Viewport の keyboard activation は editor focus と結び付く。VirtualKeyboard の矩形には visible-frame origin 補正があり、高さだけへ置き換えない。`setupViewportListener()` cleanup は event/rAF、touch scroll lock、`overlaysContent` を解放・復元する。ResizeObserver は作成した effect が disconnect する。
- `activeElement` が body でも selection anchor が editor 内なら active の場合がある。focus utility の一時 `inputmode` 復元を保ち、iOS の programmatic focus を keyboard 抑止と同一視しない。
- Scroll lock は document allowlist と item の `ontouchstart` / `preventDefault()` を併せて調べる。lock の `sync(false)` / `dispose()` と touch end cleanup を保つ。
- `main` と `.main-content` の予約高は異なる。新しい listener を足す前に CSS 変数の producer/consumer を追う。`DialogWrapper` は close 時の自動 focus 復元を抑止しているため、caller の focus callback と bits-ui primitive、history hook を区別する。
- iframe の共通 trust gate は envelope/source/origin の判定を担当し、routing、payload、request ID、pending/timeout は各 service が所有する。Parent Client auth はその共通 helper の対象外。window listener が singleton lifetime であることと、component subscription の cleanup を混同しない。
- Query cleanup は無関係な parameter と base path を保持する。startup query と runtime message の適用・cleanup はそれぞれの owner を使う。
- SW の `controllerchange` と Workbox 通知は共有 reload 制御で重複を除き、承認した page だけ reload する。FFmpeg core は precache 対象外。SW の raw IndexedDB connection は operation 完了時、MessageChannel は response/timeout 時に閉じる。
- App origin の DB upgrade は Service Worker が所有し、window は共有 schema の native version 到達を待つ。表示用履歴の upgrade cleanup と draft/deletion request の保持を分け、`blocked` で open 要求を中断しない。具体的な version/schema は実装と upgrade test を参照する。
- Media の box/intrinsic size、placeholder/loaded、font/metadata load を同じ状態で比較する。PhotoSwipe、drag hook、IntersectionObserver の cleanup をそれぞれの owner に保つ。

## 検証環境の入口

| 確認したいこと | 参照先 |
| --- | --- |
| Engine / device / testMatch / testIgnore | `playwright.config.ts`, `playwright.web-component-dev.config.ts`, `playwright.service-worker.config.ts` |
| Chromium-only mode / override | `scripts/playwrightChromiumOnlyMode.mjs`, `src/test/unit/playwrightChromiumOnlyMode.test.ts` |
| Port / strict server isolation | `scripts/playwrightWorktreePort.ts`, `src/test/unit/playwrightWorktreePort.test.ts` |
| Bundle readiness / dev-server output | `scripts/ensureWebComponentE2EOutput.mjs`, `src/test/e2e/webComponentDevServer.spec.ts` |
| Deterministic app harness / ready state | `src/test/e2e/composerTargetDialog.spec.ts`, `src/test/e2e/postHistoryDialog.spec.ts` と対応 harness |

Engine は config の `browserName` と device 設定から確認する。既存 sample の代表幅の確認を sub-360px 対応の証明にせず、変更する host width と内部 geometry を明示する。Android/iOS IME、browser chrome、PWA standalone UI、WebView、OS clipboard/share sheet は必要な実環境の証拠と emulation を区別する。
