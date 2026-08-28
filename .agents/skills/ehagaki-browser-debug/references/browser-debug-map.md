# eHagaki browser debug map

この索引は現在のcheckoutを調査するための入口を整理したものである。記載と現在のコードが異なる場合は、現在のコードを優先する。

## 目次

- [Viewportとkeyboard geometry](#viewportとkeyboard-geometry)
- [Editor focus判定](#editor-focus判定)
- [Touch scroll lock](#touch-scroll-lock)
- [Root、main、footer、button bar、dialog用CSS変数](#rootmainfooterbutton-bardialog用css変数)
- [Dialog、Popover、portal、focus管理](#dialogpopoverportalfocus管理)
- [Tiptap、ProseMirror、selection、composition](#tiptapprosemirrorselectioncomposition)
- [Paste、clipboard、drag-and-drop](#pasteclipboarddrag-and-drop)
- [Iframe、postMessage、親client](#iframepostmessage親client)
- [Direct Web Component、Shadow DOM、host geometry](#direct-web-componentshadow-domhost-geometry)
- [URL queryと外部入力](#url-queryと外部入力)
- [PWA、share target、service worker](#pwashare-targetservice-worker)
- [IndexedDB、Dexie、複数context](#indexeddbdexie複数context)
- [画像、動画、gallery、preview](#画像動画gallerypreview)
- [Browser detectionとruntime feature detection](#browser-detectionとruntime-feature-detection)
- [Playwright config、projects、fixture、harness](#playwright-configprojectsfixtureharness)
- [関連テストの選択](#関連テストの選択)

## Viewportとkeyboard geometry

- **主な症状または責務:** ソフトキーボード表示時のfooter/button bar位置、main高さ、dialog中心、iPhone Safariのauto-pan、Android ChromeのVirtualKeyboard矩形を同期する。
- **主な実装ファイル:** `src/stores/uiStore.svelte.ts`、`src/lib/utils/viewportLayout.ts`、`src/lib/hooks/useComposerLayoutMetrics.svelte.ts`、`src/components/CustomEmojiPicker.svelte`、`src/App.svelte`。
- **主な関数、store、hook、controller:** `setupViewportListener()`、`syncLayoutCssVariables()`、`getLayoutViewportHeight()`、`getEffectiveViewportOffsetTop()`、`getVirtualKeyboardLayoutInset()`、`useComposerLayoutMetrics()`、`keyboardHeightStore`、`bottomPositionStore`。
- **Event source:** `visualViewport.resize/scroll`、`window.resize/scroll`、VirtualKeyboard `geometrychange`、document `focusin/focusout/selectionchange`、`ResizeObserver`、rAF。
- **StateまたはCSS変数:** `lastViewportHeight`、`lastViewportOffsetTop`、`keyboardHeight`、`bottomPosition`と、`--keyboard-height`、`--keyboard-button-bar-bottom`、`--main-content-keyboard-adjustment`、`--mobile-dialog-*`。
- **Cleanup所有者:** `useComposerLayoutMetrics()`の`$effect`が`setupViewportListener()`のcleanupを返す。listener cleanupはevent、rAF、touch scroll lock、VirtualKeyboard `overlaysContent`を復元する。各`ResizeObserver`は対応する`$effect`がdisconnectする。
- **関連テスト:** `src/test/unit/viewportLayout.test.ts`、`src/test/unit/uiStore.test.ts`、`src/test/unit/composerLayoutUtils.test.ts`、`src/test/unit/keyboardButtonBar.test.ts`、`src/test/e2e/composerTargetDialog.spec.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** 実DOMの高さ、dialog配置、viewport resizeを確認するならPlaywright。Android IME、iOS keyboard、VirtualKeyboard実geometry、browser chrome、PWA standaloneは実端末が必要。
- **注意点:** keyboard open判定はeditor focusでactivationを絞る。VirtualKeyboard矩形にはlegacy visible-frame origin補正があるため、単純に`height`だけを採用しない。

## Editor focus判定

- **主な症状または責務:** keyboard layoutを投稿editorだけへ適用する判定、selectionがeditor内に残るケース、toolbar操作時のfocus/IME維持を扱う。
- **主な実装ファイル:** `src/lib/utils/keyboardFocusUtils.ts`、`src/lib/utils/appDomUtils.ts`、`src/stores/uiStore.svelte.ts`、`src/components/KeyboardButtonBar.svelte`、`src/components/CustomEmojiPicker.svelte`、`src/components/SuggestionCommandList.svelte`。
- **主な関数、store、hook、controller:** `isPostEditorFocusActive()`、`POST_EDITOR_ROOT_SELECTOR`、`preventKeyboardFocusChange()`、`preserveKeyboardForScrollableTouch()`、`focusEditorWithoutKeyboardForCurrentTap()`、`isIosTouchDevice()`、`blurEditorAndBody()`。
- **Event source:** `activeElement`、Selection API、`focusin/focusout/selectionchange`、`touchstart`、touch pointer event、button press。
- **StateまたはCSS変数:** `[data-post-editor-root]`、`.tiptap-editor`、一時`inputmode="none"`、`suppressedEditor`、`restoreTimeoutId`、`--keyboard-height`。
- **Cleanup所有者:** focus utilityの400ms timeoutが`inputmode`を復元する。viewport側のdocument listenerは`setupViewportListener()` cleanupが解除する。
- **関連テスト:** `src/test/unit/keyboardFocusUtils.test.ts`、`src/test/unit/keyboardButtonBar.test.ts`、`src/test/unit/replyQuotePreview.test.ts`、`src/test/unit/uiStore.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** bits-ui dialogを跨ぐfocus復元、mobile toolbar tap、selectionとkeyboardの共存はPlaywright。実IMEの開閉維持は実端末。
- **注意点:** `activeElement`が`body`等でもselection anchorがeditor内ならactiveと判定する。iOSではprogrammatic focusによるkeyboard抑止を同等に扱わない。

## Touch scroll lock

- **主な症状または責務:** keyboard表示中のdocument scrollを抑えつつ、composer、editor、emoji/suggestionの内部scrollと先頭でのpull-to-refreshを保持する。
- **主な実装ファイル:** `src/lib/utils/keyboardTouchScrollLock.ts`、`src/stores/uiStore.svelte.ts`、`src/components/CustomEmojiPicker.svelte`、`src/components/SuggestionCommandList.svelte`、`src/App.svelte`。
- **主な関数、store、hook、controller:** `createKeyboardTouchScrollLock()`、`resolveTouchScrollElements()`、`canScrollElementInDirection()`、`preserveKeyboardForScrollableTouch()`。
- **Event source:** document `touchstart/touchmove/touchend/touchcancel`、scroll elementの`scrollTop/scrollHeight/clientHeight`。
- **StateまたはCSS変数:** closure内`locked`、`touchTarget`、`lastClientY`。許可surfaceは`.custom-emoji-scroll-viewport`、`.suggestion-command-viewport`、`.tiptap-editor`、`.composer-scroll-region`。
- **Cleanup所有者:** `createKeyboardTouchScrollLock().sync(false)`または`dispose()`。`setupViewportListener()` cleanupもsingleton lockをdisposeする。
- **関連テスト:** `src/test/unit/keyboardTouchScrollLock.test.ts`、`src/test/unit/keyboardFocusUtils.test.ts`、`src/test/unit/uiStore.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** native scrolling、overscroll chain、pull-to-refresh、touch inertia、keyboard維持は実ブラウザ。OS pull-to-refreshは実端末優先。
- **注意点:** document allowlistだけでなく、item側`ontouchstart`が`preventDefault()`していないかも確認する。

## Root、main、footer、button bar、dialog用CSS変数

- **主な症状または責務:** root/body/mainの高さとoverflow、footer/reason input/button bar、mobile dialogの表示領域を同じviewport stateから描画する。
- **主な実装ファイル:** `src/app.css`、`src/stores/uiStore.svelte.ts`、`src/App.svelte`、`src/components/FooterComponent.svelte`、`src/components/KeyboardButtonBar.svelte`、`src/components/ReasonInput.svelte`、`src/components/ComposerTargetDialog.svelte`。
- **主な関数、store、hook、controller:** `syncLayoutCssVariables()`、`reasonInputVisibleStore`、`keyboardHeightStore`、`bottomPositionStore`。
- **Event source:** viewport/keyboard/focus同期、content-warning表示変更、component render。
- **StateまたはCSS変数:** `--app-root-height/top/overflow-y`、`--app-main-height`、`--app-body-*`、`--app-overlay-position`、`--app-overscroll-behavior`、`--footer-*`、`--keyboard-*`、`--reason-input-*`、`--composer-bottom-reserved-height`、`--mobile-dialog-*`。`layoutCapabilities.hasKeyboardButtonBar` はバー DOM の有無と実効バー高さを共有予約値へ反映する。`ComposerTargetDialog.svelte`は`env(safe-area-inset-top/bottom)`も使う。
- **Cleanup所有者:** CSS変数はrootへ維持され、次の`syncLayoutCssVariables()`で正規値へ戻る。browser listenerの所有者は`setupViewportListener()`。
- **関連テスト:** `src/test/unit/uiStore.test.ts`、`src/test/unit/footerComponent.test.ts`、`src/test/unit/keyboardButtonBar.test.ts`、`src/test/e2e/composerTargetDialog.spec.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** fixed要素の実配置、overflow、safe area、短いviewport、landscapeはPlaywright。browser UIやkeyboard overlay込みは実端末。
- **注意点:** `main`と`.main-content`は異なる予約高を使う。dialogだけに別listenerを増やす前に既存CSS変数のproducer-to-consumerを追う。

## Dialog、Popover、portal、focus管理

- **主な症状または責務:** standard dialog、confirm dialog、popoverのportal layering、focus trap、自動focus、outside/Escape dismiss、history backを扱う。
- **主な実装ファイル:** `src/components/DialogWrapper.svelte`、`src/components/ConfirmDialog.svelte`、`src/components/InfoPopoverButton.svelte`、`src/lib/hooks/useDialogHistory.svelte.ts`、各dialog consumer。
- **主な関数、store、hook、controller:** `handleOpenAutoFocus()`、`handleCloseAutoFocus()`、`useDialogHistory()`、bits-ui `Dialog`、`AlertDialog`、`Popover`。
- **Event source:** open state、`onOpenAutoFocus/onCloseAutoFocus`、pointer outside、Escape、`popstate`、trigger click/tap。
- **StateまたはCSS変数:** `contentRef`、`trapFocus`、`initialFocus`、`--bits-dialog-depth`、`.dialog-overlay`、`.dialog`、`.popover-content`、application dialog stateは`src/stores/dialogStore.svelte.ts`。
- **Cleanup所有者:** bits-ui Root/Portalがprimitiveのlistenerを所有する。`useDialogHistory()`はcomponent lifecycleで`popstate`を解除する。caller固有のfocus callbackはcallerが所有する。
- **関連テスト:** `src/test/unit/confirmDialog.test.ts`、`src/test/unit/useDialogHistory.test.ts`、`src/test/unit/loginDialog.test.ts`、`src/test/unit/composerTargetDialog.test.ts`、`src/test/unit/postHistoryDialog*.test.ts`、`src/test/e2e/composerTargetDialog.spec.ts`、`src/test/e2e/postHistoryDialog.spec.ts`、`src/test/e2e/webComponentEmbed.spec.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** focus trap、portal z-order、overlay click、Escape、nested dialog、戻る操作、mobile viewport内配置はPlaywright。
- **注意点:** `DialogWrapper`はclose時の自動focus復元を抑止している。focus defectを隠すためにtrapやopen autofocusを無条件停止しない。

## Tiptap、ProseMirror、selection、composition

- **主な症状または責務:** plain-text posting semantics、extension順、transaction、selection、Android composition keepalive、editor lifecycleを扱う。
- **主な実装ファイル:** `src/lib/editor/editorConfig.ts`、`src/lib/editor/editorLifecycle.ts`、`src/lib/editor/contentTracking.ts`、`src/lib/editor/androidCompositionFix.ts`、`src/lib/editor/toolbarCaretExtension.ts`、`src/components/PostComponent.svelte`。
- **主な関数、store、hook、controller:** `createEditorStore()`、`initializeEditor()`、`cleanupEditor()`、`ContentTrackingExtension`、`AndroidCompositionFix`、Tiptap `onSelectionUpdate/onCreate/onDestroy`。
- **Event source:** ProseMirror transaction、selection update、`compositionstart/compositionupdate/compositionend`、editor create/update/destroy、keyboard input。
- **StateまたはCSS変数:** EditorState/Selection、plugin storage、`currentEditorStore`、`editorState`、`data-post-editor-root`、`.tiptap-editor`。
- **Cleanup所有者:** `cleanupEditor()`がDOM listener、store subscription、editor instance、container付加propertyを解放する。各extensionの`onDestroy()`がinterval/listener/plugin-owned stateを解放する。
- **関連テスト:** `src/test/unit/editorConfig.test.ts`、`src/test/unit/editorConfigLinkClick.test.ts`、`src/test/unit/editorDocumentUtils.test.ts`、`src/test/integration/editor-history.integration.test.ts`、`src/test/integration/editor-link-detection.integration.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** IME/composition、native selection、contenteditable、undo grouping、mobile caret、browser crash/blank renderは実ブラウザ。Android/iOS IMEは実端末。
- **注意点:** document traversal中にposition-changing transactionを適用しない。変更を収集して後ろから適用し、appendTransaction loop/no-op/undo groupingを確認する。

## Paste、clipboard、drag-and-drop

- **主な症状または責務:** text/HTML/files/media URLのpaste、copy serialization、PC/タッチの画像・custom emoji移動、外部file dropを分離する。
- **主な実装ファイル:** `src/lib/editor/clipboardExtension.ts`、`src/lib/editor/mediaPaste.ts`、`src/lib/editor/editorDomActions.svelte.ts`、`src/lib/editor/imageDragDrop.ts`、`src/lib/editor/customEmojiDragDrop.ts`、`src/lib/utils/clipboardUtils.ts`、`src/lib/utils/mediaNodeUtils.ts`。
- **主な関数、store、hook、controller:** `ClipboardExtension`、`MediaPasteExtension`、`fileDropAction()`、`pasteAction()`、`touchAction()`、`ImageDragDropExtension`、`CustomEmojiDragDropExtension`、`tryCopyToClipboard()`。
- **Event source:** `paste`、ClipboardData/DataTransfer、`dragstart/dragover/dragleave/drop/dragend`、custom touch drag event、`touchmove/touchend`、`elementFromPoint()`。
- **StateまたはCSS変数:** ProseMirror selection/transaction、`imageDragState`、`customEmojiDragState`、`.drag-over`、`.drop-zone-indicator`、temporary drag preview DOM。
- **Cleanup所有者:** Svelte actionsの`destroy()`、extension plugin viewの`destroy()`、`cleanupEventListeners()`、touch end処理がlistener、interval、preview/highlightを解放する。
- **関連テスト:** `src/test/integration/editor-clipboard.integration.test.ts`、`src/test/integration/editor-url-paste.integration.test.ts`、`src/test/integration/editor-media.integration.test.ts`、`src/test/unit/editorDomActions.test.ts`、`src/test/unit/imagePaste.test.ts`、`src/test/unit/clipboardUtils.test.ts`、`src/test/unit/mediaNodeUtils.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** OS clipboard permission、native paste payload、contenteditable drop position、touch drag、pointer captureは実ブラウザ。端末clipboard/share sheetは実端末。
- **注意点:** file pasteはDOM action、text pasteはClipboardExtension、media URLはMediaPasteExtensionという既存分担を崩さない。診断用clipboard dumpに投稿本文や秘密情報を残さない。

## Iframe、postMessage、親client

- **主な症状または責務:** trusted parent origin、message envelope、requestId、remote auth/settings/composer context、親委譲storage/IndexedDBを扱う。
- **主な実装ファイル:** `src/lib/embedProtocol.ts`、`src/lib/iframeMessageService.ts`、`src/lib/parentClientAuthService.ts`、`src/lib/embedComposerContextService.ts`、`src/lib/embedSettingsService.ts`、`src/lib/embedStorageService.ts`、`src/lib/embedIndexedDbService.ts`、`src/lib/appEmbedController.ts`、`src/lib/appRuntimeBindings.ts`、`public/embed-parent-client-example.js`。
- **主な関数、store、hook、controller:** `getParentOriginFromSearch()`、`isEmbedMessageEnvelope()`、`getTrustedParentEmbedMessage()`、各serviceの`initialize()`/`handleMessage`、`createAppEmbedController()`、`setupAppRuntimeBindings()`。
- **Event source:** `window.message`、`window.parent.postMessage()`、request timeout、remote login/logout/settings/context event。
- **StateまたはCSS変数:** `trustedParentOrigin`、`pendingRequests`、listener Set、controller pending action、namespace/version/requestId/capability payload。
- **Cleanup所有者:** `setupAppRuntimeBindings()` cleanupがremote listener subscriptionを解除する。request timeoutは各serviceがclearする。service singletonのwindow `message` listenerは一度登録して存続する現行設計。
- **関連テスト:** `src/test/integration/app-parent-client.integration.test.ts`、`src/test/unit/iframeMessageService.test.ts`、`src/test/unit/parentClientAuthService.test.ts`、`src/test/unit/appEmbedController.test.ts`、`src/test/unit/embedComposerContextService.test.ts`、`src/test/unit/embedSettingsService.test.ts`、`src/test/unit/embedStorageService.test.ts`、`src/test/unit/embedIndexedDbService.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** real iframe source/origin、sandbox/Permissions Policy、storage partitioning、parent navigation、focus境界はbrowser harnessが必要。
- **注意点:** composer context、settings、storage、IndexedDBは共通の受信 trust gate で envelope・exact parent source・exact trusted origin だけを判定し、routing、requestId、payload、pending map、lifecycleは各serviceが所有する。Parent clientはこのhelper対象外であり、queryで確立したparent origin契約も維持する。`event.source`と`event.origin`の検証を弱めない。親sample、protocol、parser/bootstrap、testsを同じcontract surfaceとして確認する。

## Direct Web Component、Shadow DOM、host geometry

- **主な症状または責務:** host pageに直接配置した`<ehagaki-composer>`のShadow DOM、container-bound layout、host/component geometry、overlay、asset origin、mount/disconnect/reconnectを調査する。iframeの別document/postMessage経路とは分ける。
- **主な実装ファイル:** `src/web-component/element.ts`、`src/web-component/entry.ts`、`src/web-component/types.ts`、`src/web-component/iconAssets.ts`、`src/lib/appRuntimeEnvironment.ts`、`src/lib/appAssetUrl.ts`、`src/components/DialogWrapper.svelte`、`src/stores/uiStore.svelte.ts`。
- **主な関数、store、hook、controller:** `EHagakiComposerElement.connectedCallback()`、`disconnectedCallback()`、`whenReady()`、`mountApp()`、`configureAppRuntimeEnvironment()`、`getAppRuntimeEnvironment()`、`applyWebComponentIconAssetUrls()`。現在のruntimeは`layoutMode: "container"`、`runtimeKind: "web-component"`で、`domRoot`はopen ShadowRoot、mount/layout/style/overlay targetはcomponent shell内に設定される。
- **Lifecycleと認証境界:** module-levelのactive instanceにより同じdocumentの接続済みinstanceを1つに制限する。connection generation、Svelte unmount、MutationObserver、pending `whenReady()` rejectionをdisconnect/reconnectごとに確認する。Web Component runtimeではService Worker、external input、history、local nsec authを無効化し、NIP-07/NIP-46などのprotocol semanticsはNostr mapを参照する。
- **Geometryの計測:** host documentのviewport、`ehagaki-composer` host element、Shadow DOMのshell/app/overlay/dialog/footerを別々に`getBoundingClientRect()`とcomputed styleで確認する。`container-type: inline-size`、component width/height、`--app-overlay-position`、DialogWrapperのcontainer-layout absolute positioningを確認し、Shadow DOMだけでfixed要素がhost-relativeになると仮定しない。
- **Assetの調査入口:** 接続前に設定する`asset-base`属性または`assetBase` property、component origin、`assets/`、`icons/`、FFmpeg class-worker/core/WASMのrequestとCORSを確認する。`webComponentDevServer.spec.ts`はlocal proxy/watchとasset配信、`ensureWebComponentE2EOutput.mjs`はfingerprint付きproduction output準備を担う。
- **関連テスト:** `src/test/e2e/webComponentEmbed.spec.ts`はcross-origin host/component、host WebSocket interception、Shadow DOM、storage/SW、container geometry、portal dialog、asset、lifecycle、NIP-07/NIP-46 availabilityを確認する。`src/test/e2e/webComponentParentClientExample.spec.ts`はassembled production sample、public API、host側responsive layout、360/390px代表幅、destroy/recreateとmanual modeを確認する。`src/test/e2e/webComponentDevServer.spec.ts`、`src/test/unit/webComponentDevServerConfig.test.ts`、`src/test/unit/webComponentBuildWorkingDirectory.test.ts`、`src/test/unit/webComponentIconAssets.test.ts`も入口にする。
- **注意点:** 現在のpublic sample E2Eは360/390pxを代表幅として確認するが、360px未満のiframe/Web Componentを既存E2Eで直接検証しているわけではない。embedの360px未満対応方針に対する追加検証ではhost widthとcomponent内部geometryを明示する。公開`::part()`契約はなく、local nsec入力・復元もWeb Componentの契約ではない。

## URL queryと外部入力

- **主な症状または責務:** `content`、reply/quote/channel、embed settings、`shared=true`を起動時に読み、既存composer stateへ適用して消費済みqueryだけを削除する。
- **主な実装ファイル:** `src/lib/urlQueryHandler.ts`、`src/lib/bootstrap/externalInputBootstrap.ts`、`src/lib/bootstrap/embedSettingsBootstrap.ts`、`src/lib/fileUploadManager.ts`、`src/App.svelte`、`src/main.ts`。
- **主な関数、store、hook、controller:** `getContentFromUrlQuery()`、`getReplyQuoteFromUrlQuery()`、`getChannelFromUrlQuery()`、`cleanupAllQueryParams()`、`runExternalInputBootstrap()`、`applyEmbedSettingsBootstrap()`。
- **Event source:** initial `window.location.search`、share-target redirect、iframe bootstrap、`history.replaceState()`。
- **StateまたはCSS変数:** URLSearchParams、shared content store、reply/quote store、channel context、settings stores。
- **Cleanup所有者:** `runExternalInputBootstrap()`が最後に`cleanupAllQueryParams()`を呼ぶ。embed setting queryは`applyEmbedSettingsBootstrap()`が個別にcleanupする。
- **関連テスト:** `src/test/unit/urlQueryHandler.test.ts`、`src/test/unit/externalInputBootstrap.test.ts`、`src/test/unit/embedSettingsBootstrap.test.ts`、`src/test/unit/fileUploadManager.test.ts`、`src/test/integration/app-parent-client.integration.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** navigation/history、URL encoding、iframe URL、share-target起動、first paint settingはbrowser integrationが必要。
- **注意点:** base pathを保持し、query cleanupが無関係なparameterを落とさないことを確認する。external relayやoriginのsanitizeを弱めない。

## PWA、share target、service worker

- **主な症状または責務:** injectManifest、prompt update、precache/runtime cache、share target POST、既存client focus/notify、新規client open、SW-client MessageChannelを扱う。
- **主な実装ファイル:** `vite.config.ts`、`public/sw.js`、`src/main.ts`、`src/stores/swStore.svelte.ts`、`src/lib/shareHandler.ts`、`src/lib/utils/swCommunication.ts`、`src/lib/swClientUtils.ts`、`src/lib/swListenerUtils.ts`、`src/lib/swMessageDispatchUtils.ts`。
- **主な関数、store、hook、controller:** VitePWA `injectManifest`、`useRegisterSW()`、`createAcceptedServiceWorkerUpdateReloadController()`、`getSharedMediaWithFallback()`、`redirectToAvailableSharedClient()`、`focusAndNotifySharedClient()`、`registerServiceWorkerEventListeners()`、`ChannelImageCacheController`、`ChannelPicture`。
- **Event source:** SW `install/activate/fetch/message`、manifest share-target POST、`controllerchange`、registration update、MessageChannel response、`EHAGAKI_DB_UPGRADE_BLOCKED`／`EHAGAKI_DB_UPGRADE_UNBLOCKED`。
- **StateまたはCSS変数:** SW version/cache names、precache manifest、`ServiceWorkerState.sharedMediaCache`、`swUpdateStatus`、`dbUpgradeBlocked`、更新を承認した現在ページだけが保持するreload許可、shared media IndexedDB record、`channelImageCacheMeta`。DB blockedはSW更新statusと分離し、blockedだった同一openの成功通知だけで解除する。チャンネル画像はmount時のSW control状態を固定し、表示途中の`controllerchange`ではproxyへ切り替えない。
- **Cleanup所有者:** SW event listenerはworker lifetime。MessageChannelはresponse/timeoutでportをcloseする。`controllerchange` listenerはresolve/timeoutで解除する。
- **関連テスト:** `src/test/unit/sw.test.ts`、`src/test/unit/swListenerUtils.test.ts`、`src/test/unit/swMessageDispatchUtils.test.ts`、`src/test/unit/swClientUtils.test.ts`、`src/test/unit/shareHandler.test.ts`、`src/test/unit/fileUploadManager.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** install/update/offline/cache、share sheetからのPOST、standalone window reuse、stale worker/clientはinstalled PWAまたは専用browser環境が必要。
- **注意点:** `vite.config.ts`のbaseはVercel以外`/ehagaki/`。`ffmpeg-core/**/*`はprecache対象外。prompt更新は固定timerではなくWorkboxのcontrol change完了後に、承認したページだけをreloadする。SW変更ではmirrored unit testsと`npm run build`を必ず確認する。

## IndexedDB、Dexie、複数context

- **主な症状または責務:** appとservice workerで同一DB schemaを共有し、draft/profile/relay/shared media/post history/cache等を永続化する。iframeではupload destination snapshotを親へ委譲できる。
- **主な実装ファイル:** `src/lib/storage/ehagakiDb.ts`、`src/lib/storage/ehagakiDbConstants.ts`、各`src/lib/storage/*Repository.ts`、`src/lib/swIndexedDbSchema.ts`、`src/lib/swIndexedDbOperationUtils.ts`、`public/sw.js`、`src/lib/embedIndexedDbService.ts`。
- **主な関数、store、hook、controller:** `EHagakiDB`、`ehagakiDb`、`EHAGAKI_DB_NAME`、`EHAGAKI_DB_VERSION`、`POST_HISTORY_TIMELINE_INDEX`、repository methods、`ensureCurrentEHagakiDbSchema()`、SW IndexedDB manager、`EmbedIndexedDbService`。
- **Event source:** Dexie query/transaction/`versionchange`/`blocked`、raw IndexedDB `open/upgradeneeded/blocked/success/error`、SW fetch/message、iframe request/response、account reset。
- **StateまたはCSS変数:** DB name `eHagakiDB`、logical version `15`／native version `150`、postHistory timeline index `[pubkeyHex+postedAt+createdAt+eventId]`、object stores/indexes、fixed shared media record `latest`、repository caches/pending requests、Dexie `ready`とraw open successで解除されるDB upgrade blocked表示。
- **Cleanup所有者:** repository testsとaccount resetはDBをcloseする。SW raw IndexedDB helperはoperation完了時にcloseする。iframe request timeoutはserviceがclearする。
- **関連テスト:** `src/test/unit/ehagakiDb.test.ts`、各repository test、`src/test/unit/swIndexedDbSchema.test.ts`、`src/test/unit/swIndexedDbOperationUtils.test.ts`、`src/test/unit/sw.test.ts`、`src/test/unit/embedIndexedDbService.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** upgrade中の複数tab、stale worker、versionchange/blocked、storage partitioning、iframe delegation、reload後の永続化はbrowser integrationが必要。
- **注意点:** schema/versionを重複追加しない。DexieとSW raw IndexedDBの全open caller、既存installed worker、stale tabを同じ契約として確認する。データ削除をmigration代替にしない。

## 画像、動画、gallery、preview

- **主な症状または責務:** intrinsic/display size、load/error placeholder、editor media node、gallery reorder/scroll、post-history preview、PhotoSwipe fullscreenを扱う。
- **主な実装ファイル:** `src/components/SvelteImageNode.svelte`、`src/components/SvelteVideoNode.svelte`、`src/components/MediaGallery.svelte`、`src/components/MediaGalleryItem.svelte`、`src/components/PostHistoryMediaList.svelte`、`src/components/ImageFullscreen.svelte`、`src/lib/hooks/useMediaLoadState.svelte.ts`、`src/lib/hooks/inViewportAction.svelte.ts`、`src/lib/utils/mediaNodeUtils.ts`、`src/lib/utils/fullscreenViewerUtils.ts`、`src/lib/postMediaCacheService.ts`。
- **主な関数、store、hook、controller:** `calculateImageDisplaySize()`、`useMediaLoadState()`、`inViewportAction()`、`consumeMediaGalleryWheelScroll()`、`buildFullscreenViewerDataSource()`、PhotoSwipe instance、`mediaGalleryStore`。
- **Event source:** image `load/error`、video `loadeddata/loadedmetadata`、Resize/IntersectionObserver、wheel、touch/drag/drop、fullscreen/popstate、media fetch/cache。
- **StateまたはCSS変数:** natural/intrinsic dimensions、display dimensions、load state、gallery item order、drag preview、fullscreen media list/index、post media cache state。
- **Cleanup所有者:** component `$effect`/`onDestroy`、IntersectionObserver action、gallery touch end/wheel effect、image drag hook、PhotoSwipe `destroy`と`popstate` cleanup。
- **関連テスト:** `src/test/unit/mediaNodeUtils.test.ts`、`src/test/unit/mediaGalleryWheelUtils.test.ts`、`src/test/unit/imageFullscreen.test.ts`、`src/test/unit/postHistoryMediaList.test.ts`、`src/test/integration/editor-media.integration.test.ts`、両Playwright specのmedia/overflow/fullscreen coverage。
- **Playwrightまたは実端末確認が必要になる条件:** actual rendered size、object-fit、layout collapse、video controls、touch reorder、PhotoSwipe focus/history、media visibilityはPlaywright。platform video/fullscreen UIは実端末。
- **注意点:** screenshotだけでなくcontainer/mediaのboxとcomputed styleを測る。network、font、metadata/load完了を固定し、placeholderとloaded状態を分ける。

## Browser detectionとruntime feature detection

- **主な症状または責務:** 非PWA iPhone Safari、非PWA Android Chrome、touch device、iOS touch、Android composition、Android Firefox video fallback、secure-context cacheを限定する。
- **主な実装ファイル:** `src/lib/utils/viewportLayout.ts`、`src/lib/utils/keyboardFocusUtils.ts`、`src/lib/utils/appDomUtils.ts`、`src/lib/editor/androidCompositionFix.ts`、`src/lib/videoCompression/mediabunnyCompression.ts`、`src/lib/postMediaCacheService.ts`。
- **主な関数、store、hook、controller:** `isNonPwaIPhoneSafari()`、`isNonPwaAndroidChrome()`、`isIosTouchDevice()`、`isTouchDevice()`、`AndroidCompositionFix`、runtime `typeof`/capability checks。
- **Event source:** `navigator.userAgent/platform/maxTouchPoints`、`matchMedia('(display-mode: standalone)')`、`navigator.standalone`、`globalThis.isSecureContext`、API presence。
- **StateまたはCSS変数:** browser/PWA classification result、VirtualKeyboard capability、touch capability、WebCodecs fallback choice。
- **Cleanup所有者:** detectionはpureまたはmodule state。Android composition listener/intervalだけextension `onDestroy()`が所有する。
- **関連テスト:** `src/test/unit/viewportLayout.test.ts`、`src/test/unit/keyboardFocusUtils.test.ts`、`src/test/unit/appDomUtils.test.ts`、`src/test/unit/uiStore.test.ts`、`src/test/unit/postMediaCacheService.test.ts`。
- **Playwrightまたは実端末確認が必要になる条件:** UA overrideだけで再現できないAPI availability、secure context、PWA display mode、WebView、vendor UIは実環境が必要。
- **注意点:** UAを追加する前にfeature detectionで足りるか確認する。Playwright device descriptorのUAはOS機能まで提供しない。

## Playwright config、projects、fixture、harness

- **主な症状または責務:** dialog、focus、history、overflow、geometry、media表示を決定論的な実ブラウザで検証する。
- **主な実装ファイル:** `playwright.config.ts`、`playwright.web-component-dev.config.ts`、`scripts/playwrightWorktreePort.ts`、`scripts/ensureWebComponentE2EOutput.mjs`、`src/test/e2e/composerTargetDialog.spec.ts`、`src/test/e2e/postHistoryDialog.spec.ts`、`src/test/e2e/webComponentDevServer.spec.ts`、`src/test/e2e/webComponentEmbed.spec.ts`、`src/test/e2e/webComponentParentClientExample.spec.ts`。
- **主な関数、store、hook、controller:** Playwright標準`test` fixtureの`page`と`isMobile`、各`gotoHarness()`、window上の`__COMPOSER_TARGET_HARNESS__`/`__POST_HISTORY_HARNESS__` ready state。独立したcustom fixture moduleは現checkoutにない。
- **Event source:** page navigation、role/label locator操作、keyboard/tap/click、route mock、viewport resize、popup/history、DOM evaluation。
- **StateまたはCSS変数:** 通常configは`fullyParallel: false`、`workers: 2`、`locale=ja-JP`、trace `on-first-retry`。`desktop-chromium`と`mobile-chromium`は`webComponentDevServer.spec.ts`を`testIgnore`する。`mobile-webkit`の`testMatch`は`composerTargetDialog.spec.ts`、`webComponentEmbed.spec.ts`、`webComponentParentClientExample.spec.ts`、`postEditorSending.spec.ts`、`desktop-firefox`の`testMatch`は`webComponentEmbed.spec.ts`だけである。Web Component dev-server configは`webServer: undefined`、`workers: 1`、専用projectで`webComponentDevServer.spec.ts`だけを実行する。
- **Portとserver:** `EHAGAKI_E2E_PORT`が指定された場合は検証済みの明示portを使う。未指定時はconfig load時に自動portを生成し、同一Playwright process内では内部の自動port環境値を通じて再利用する。baseURL、ready URL、Vite commandは同じresolved portを使い、Vite commandは`127.0.0.1`と`--strictPort`を指定し、`reuseExistingServer: false`で既存serverを再利用しない。worktree rootから決定的にportを算出する方式ではない。
- **Cleanup所有者:** Playwright runnerがpage/contextを破棄し、route/popupはtestがcloseする。temporary artifactは調査完了時に削除する。
- **関連テスト:** `src/test/unit/playwrightWorktreePort.test.ts`がport override、自動port共有、config project、strict port、server再利用設定を確認する。`src/test/e2e/composerTargetDialog.spec.ts`と`src/test/e2e/postHistoryDialog.spec.ts`は通常harness、Web Component系3 specはembed/sample/dev-serverの各境界を確認する。unit/component mock基盤は`src/test/setup.ts`と`src/test/mocks/`。
- **Playwrightまたは実端末確認が必要になる条件:** config上の全projectは実browser engineでDOMを描画するが、IME/browser chrome/PWA standalone/WebViewは実端末確認を別途行う。
- **注意点:** `desktop-chromium`は`Desktop Chrome` descriptor。`mobile-chromium`は`iPhone 13` descriptorをChromiumのdefault engineで実行する。`mobile-webkit`だけが`browserName: 'webkit'`を明示する。device descriptorはbrowser engine/viewport/touch等のemulationであり、実端末のIME、browser chrome、PWA standalone、WebViewを証明しない。

## 関連テストの選択

- **主な症状または責務:** 原因層に対応する最小テストから、必要なbrowser proofへ段階的に広げる。
- **主な実装ファイル:** `src/test/unit/`、`src/test/integration/`、`src/test/e2e/`、`src/test/setup.ts`、`src/test/helpers.ts`、`src/test/mocks/`。
- **主な関数、store、hook、controller:** Vitest、Testing Library、fake-indexeddb、Playwright test runner。
- **Event source:** mocked DOM/API event、Svelte component event、ProseMirror transaction、browser event。
- **StateまたはCSS変数:** test-local store mock、fake IndexedDB、harness state、browser DOM/computed layout。
- **Cleanup所有者:** Vitest `afterEach`/component cleanup、repository `db.close()`、Playwright runner。fake timerとTesting Library waitの組合せを明示的に処理する。
- **関連テスト:** geometry/focusは`viewportLayout`、`uiStore`、`keyboardFocusUtils`、`keyboardTouchScrollLock`。dialogは`composerTargetDialog`、`postHistoryDialog*`、`useDialogHistory`。editorは`editor-*` integration。iframe/PWA/DB/mediaは各同名unit/integrationとE2E。
- **Playwrightまたは実端末確認が必要になる条件:** jsdom/happy-domがlayout、selection、focus trap、media、touch、clipboardをモデル化できないときにPlaywrightへ上げる。OS UI/APIが必要なら実端末へ上げる。
- **注意点:** persistent E2Eは外部network、real account、secret、local user dataへ依存させない。調査だけのharness/spec/screenshot/traceをcommitしない。
