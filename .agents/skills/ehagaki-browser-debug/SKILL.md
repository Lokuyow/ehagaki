---
name: ehagaki-browser-debug
description: "eHagakiのブラウザ固有または実ブラウザ統合の不具合を、再現・計測・根因特定・最小修正・レビューするときに使用する。対象はモバイルIME、viewport、focus、Dialog/Popover、Tiptap/ProseMirror、touch・clipboard、iframe、IndexedDB/PWA/service worker、media描画、Playwright調査。ブラウザ固有性のない通常のUI、CSS、文言変更には使用しない。"
---

# eHagaki Browser Debug

eHagakiの現在のcheckoutを根拠に、ブラウザ制約とアプリケーション不具合を切り分ける。推測や補償的workaroundではなく、値が最初に不正になる層を特定してから最小の責務を修正する。

## 調査を開始する

1. `AGENTS.md`のVerification、Svelte、Tiptap、Playwright、Bug fixing規則を読む。
2. `package.json`、対象ファイル、そのcaller、関連store/service/hook/controller、関連テストを読む。
3. 対象領域の入口を探すときは[ブラウザ調査マップ](references/browser-debug-map.md)を読む。mapとcheckoutが異なる場合はcheckoutを優先し、ブラウザ責務や主要テストを変更する作業ではmapも更新する。
4. `playwright.config.ts`、対象projectの実際の`browserName`、device descriptor、viewport、baseURL、webServer、testMatch、fixture/harnessを確認する。project名だけからbrowser engineを推測しない。
5. ファイル名、関数名、browser support、library APIを記憶から決めず、現在のコード、ローカル型、既存利用箇所で確認する。

## 再現条件を固定する

次を区別して記録する。

- OS、ブラウザ名とバージョン
- 通常タブまたはPWA、iframe内または単独起動
- portraitまたはlandscape、layout/visual viewportサイズ
- タッチまたはマウス、ソフトキーボードまたは物理キーボード
- 対象inputまたはeditor、再現操作
- 期待結果と実際の結果

再現できない場合は、既存コードと証拠から原因を特定できるかを明示する。原因を特定できなければ本番コードを推測で変更せず、追加で必要な計測または実端末確認を報告する。

## 原因層を分類する

次の層を混同せず、値またはeventが最初に不正になる層を特定する。

1. ブラウザまたはOSの仕様・制約
2. Visual ViewportまたはVirtualKeyboard API
3. CSS layout、fixed/sticky、scroll、overscroll、safe area
4. focus、selection、composition、contenteditable
5. Svelte stateまたはeffect lifecycle
6. bits-uiのportal、focus management、dismiss behavior
7. TiptapまたはProseMirror transaction/plugin
8. iframe、postMessage、origin、親client
9. IndexedDB、Dexie、service worker、cache、stale tab/context
10. media load、intrinsic size、resize、fullscreen/gallery
11. Playwright harness、mock、device emulation自体

ブラウザまたはOSの制約とeHagakiの実装不具合を区別する。プラットフォームが提供しない機能をアプリ実装の失敗と誤認しない一方、対応対象で代替挙動が必要かは既存仕様と要件に基づいて判断する。

## 計測してから修正する

必要な値をばらばらのログではなく、同じeventまたは同じframeの一度のsnapshotとして取得する。

- `window.innerWidth`、`window.innerHeight`、`document.documentElement.clientWidth/clientHeight`
- `visualViewport.width/height/offsetTop/offsetLeft/pageTop`
- VirtualKeyboardの`overlaysContent`と`boundingRect`
- `document.activeElement`、focus対象がeditor内部か通常inputか
- selectionとcomposition状態
- `scrollX`、`scrollY`
- 対象要素の`getBoundingClientRect()`とcomputed style
- 関連CSS custom properties
- Dialog/Popoverのportal位置
- event発生順、rAF前後の値
- `resize`、`scroll`、`geometrychange`、`focus`、`blur`の回数

nsec、秘密鍵、token、署名payload、認証payload、投稿本文などをログ、fixture、trace、screenshot、報告へ含めない。診断ログやtemporary instrumentationは原因確定後に削除する。

## 仮説を反証する

1. 一度に一つの仮説だけを扱う。
2. 最小の計測、unit test、component test、またはPlaywright操作で反証する。
3. DOM入力、state、CSS変数、computed style、geometryの順に追い、値が最初に変わる地点を見つける。
4. 非同期処理ではowner、generation、abort/unsubscribe、cleanup、stale completionを確認する。
5. focus、selection、resize、scroll、geometrychangeへ依存する場合はevent列とrAF境界を確認する。
6. 正常なsibling pathがある場合は、入力、state遷移、event順、cleanupの差を比較する。
7. 原因が確定するまで本番コードを変更しない。

## 回避策を制限する

原因と必要性を証拠で示せない限り、次を追加しない。

- 任意のpx offset、不明なdelay/timer、複数回の`requestAnimationFrame`
- focus suppression、強制blur、強制再描画、broad invalidation
- user agent判定、duplicate state、catch-all fallback
- blanket `overflow: hidden`、無制限なz-index増加
- browser全体へ影響するglobal listener

既存UA判定やブラウザ別処理を変更する場合は、対象browser family、通常タブとPWAの差、feature detection、既存テスト、実測結果を確認する。

## 最小の責務へ修正する

1. geometry計算は既存viewport utilityを優先する。
2. focus分類は既存focus utilityを優先する。
3. UI stateとbrowser event listenerを無秩序に混ぜない。
4. component、hook、controller、store、utility、editor extensionの既存責務を維持する。
5. application-wideな副作用をcomponent局所のworkaroundとして追加しない。
6. Dialogの問題をeditor側で修正せず、editorの問題をglobal viewport stateで隠さない。
7. browser差を一般的なproduct behaviorへ昇格させない。
8. 無関係なrefactor、discarded hypothesis、temporary harnessを最終diffへ残さない。

## 検証レベルを選ぶ

- 純粋なgeometry、分類、変換はunit testで検証する。
- Svelte state、DOM event wiring、component behaviorはcomponent testで検証する。
- Dialog操作、URL query、iframe、IndexedDB、focus遷移、layout、media描画などのbrowser integrationはPlaywrightで検証する。
- protocol semanticsだけの変更にはPlaywrightを追加しない。
- 実ブラウザでしか成立しない回帰は、決定論的に再現できる場合にpersistent E2Eを検討する。
- 調査専用のspec、HTML、script、screenshot、traceは完了時に削除する。
- 実装変更では対象テストから始め、`AGENTS.md`に従い原則`npm test`まで広げる。Svelte/TypeScript変更では`npm run check`、PWA/SW/build境界では`npm run build`も実行する。

Playwrightのdevice設定はuser agent、viewport、screen、touch等のemulationにすぎない。Android IME、iOS Safari keyboard、VirtualKeyboard APIの実geometry、ブラウザ下部バー、PWA standalone固有UI、WebView固有挙動を同一とは扱わない。必要な実端末確認を実行できなければ、未確認と明記する。

## Playwright調査の品質を保つ

1. 既存fixtureとharnessを優先する。
2. role、label、text、test idなどの安定したlocatorを使い、generated classへ依存しない。
3. geometry問題は`boundingBox()`、DOMRect、computed styleを数値で確認する。screenshotだけで原因を確定しない。
4. animation終了、network mock、font、media loadの前提を固定する。
5. flakyなsleepではなく状態またはeventを待つ。
6. desktop、mobile、browser projectの実設定を確認する。
7. 実行したproject、viewport、操作、観測結果を報告する。

## Context7と一次資料を使う

Svelte 5、Tiptap v3、ProseMirror、bits-ui、Playwright、Dexie、Vite/PWA関連ライブラリの現行APIが判断に影響し、Context7 MCPが利用可能なら使う。

1. 先に`package.json`、ローカル型、既存利用箇所を確認する。
2. 現在使用中のmajor versionに対応する資料を使う。
3. eHagaki固有の挙動はrepository codeをsource of truthとする。
4. Web API仕様やbrowser compatibilityは必要に応じて公式仕様またはブラウザ公式資料でも確認する。
5. Context7だけを根拠にbrowser-specific workaroundを追加しない。
6. 適切なlibraryを解決できなければ、その事実を報告して信頼できる一次資料を使う。

## 完了時に報告する

- 再現条件
- root causeと、問題が最初に発生した層
- 修正した責務、成立理由、保持した既存挙動
- browser/OS固有の制限と残るリスク
- temporary instrumentationとdiscarded hypothesisを削除したこと
- 実行したunit、component、Playwright、`check`、`build`と結果
- 実行していない確認と理由、実端末確認の有無
