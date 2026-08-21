---
name: ehagaki-embed-runtime
description: "eHagaki の standalone・iframe・Web Component 間の runtime 境界と埋め込み契約を扱う。Custom Element API/lifecycle、Parent Client/postMessage/origin、auth・settings・composer context・storage delegation、asset/base path、Shadow DOM、embed sample/E2E を調査・設計・実装・レビューするときに使用する。通常の standalone UI 変更、純粋な NIP 変更、ブラウザ固有の IME/geometry 調査には使用しない。"
---

# eHagaki Embed Runtime

eHagaki の standalone、iframe、Direct Web Component の公開契約と runtime ownership を、現在の checkout を根拠に扱う。入口、公開 API、message producer/consumer、sample、テストの索引は [embed runtime map](references/embed-runtime-map.md) を読む。map と checkout が異なる場合は、現在のコードを優先する。

## 対象を切り分ける

変更前に対象 runtime を確定する。`AppRuntimeEnvironment.runtimeKind`、各 iframe service の実際の iframe 判定、Web Component entrypoint を source of truth とし、DOM 形状や layout から推測しない。複数 runtime に影響する変更では、共通の App 側責務と runtime 固有の adapter/entrypoint を分けて caller・callee・テストまで追う。

- standalone / iframe の document entry は `src/main.ts`、Direct Web Component は `src/web-component/entry.ts` と `element.ts` から始める。
- iframe の Parent Client、settings、composer context、storage、IndexedDB delegation はそれぞれ独立した service を持つ。いずれも同じ `postMessage` を使うからといって、勝手に一つの transport や state に統合しない。
- Web Component は host page と同じ Window realm で動き、`postMessage` の代わりに public method と composed DOM event を使う。Shadow DOM 内の app-owned DOM と host document の責務を混同しない。

## public contract を先に確認する

内部実装より先に、現在提供している contract の producer と consumer を確認する。

- iframe は `embedProtocol.ts` の namespace/version/envelope、message type、`requestId` 要否、payload validation を起点に、service・controller・`public/embed-parent-client-example.*`・関連 test を揃えて確認する。
- 親との通信では `parentOrigin`、`event.origin`、`event.source`、envelope/schema、capability、request ID、timeout、pending request cleanup を確認する。embed の利便性を理由に既存 validation を省略しない。
- Web Component は tag、attribute/property、`whenReady()`、public method、event、ready/error、single-instance と reconnect 契約を `src/web-component/types.ts`、`element.ts`、`docs/WEB_COMPONENT.md`、sample/E2E で突き合わせる。実装にない attribute、event、`::part()` surface、複数 instance 対応を新しい仕様として足さない。
- URL query、external input、settings bootstrap、runtime message は別の入力経路である。parser、bootstrap、controller、runtime service、sample の一部だけを変えない。

## ownership と lifecycle を守る

値または副作用ごとに app-owned、host-owned、delegated、shared contract のいずれかを実装から特定する。parent client に委譲する state に、根拠なく local fallback・二重 source of truth・standalone global state を追加しない。

- Web Component では connect / ready / disconnect / remove / recreate、Svelte mount/unmount、listener/observer、queued operation、pending ready promise、single-instance slot を追う。iframe service では listener registration、request timeout、pending request、disconnect cleanup の owner を追う。
- 初期化中または parent auth 中に保留する composer context は、既存 controller の queue/flush 境界を保つ。任意の timer や global workaround を追加しない。
- runtime 固有の機能制御（service worker、external input、history、local nsec auth、storage namespace、layout/overlay/theme target）は `AppRuntimeEnvironment` と各 entrypoint で確認し、別 runtime へ漏らさない。

## asset と style の境界を守る

asset URL は active runtime の `assetBase` と `resolveAppAssetUrl()` を起点に追う。Vite の document base path と Web Component bundle の `asset-base` は同じ値であるとは限らない。host origin の root-relative asset、host global CSS、または偶然の document layout に依存する変更をしない。

Web Component の open Shadow DOM、CSS transform、`:host`、component container、overlay target、実在する `--ehagaki-*` custom properties を確認する。公開 `::part()` API は現在確認できないため、必要性が明示されない限り導入しない。container/viewport、focus、portal geometry、browser engine 差を実ブラウザで再現・計測する必要がある場合は [ehagaki-browser-debug](../ehagaki-browser-debug/SKILL.md) を併用する。

## Nostr とブラウザ固有調査の境界

親 signer への delegation、request/response transport、runtime ownership はこの skill が扱う。event kind、tag、relay、署名内容、NIP-07/NIP-46 の protocol semantics は [ehagaki-nostr](../ehagaki-nostr/SKILL.md) を主として併用する。

iOS Safari 固有の focus、IME、VisualViewport、touch/scroll、browser engine の layout/geometry は `ehagaki-browser-debug` を併用する。本 skill はそれらの現象に関係する embed contract と owner を扱うが、browser 固有の再現・計測手順を重複して定義しない。

## 最小の owner を変更し、検証する

runtime 判定、transport、auth delegation、settings/storage、Custom Element、asset resolution、build/sample のうち問題がある最小 owner を変更する。iframe 固有の問題を `App.svelte` の global workaround にせず、共通責務の問題を runtime ごとの duplicate implementation で隠さない。互換性や versioning policy は、現在の code、docs、sample、test、明示された要件から判断し、記憶だけで決めない。

- runtime boundary の変更は、map に挙がる直接の unit/integration test と、必要なら real iframe / Web Component を使う Playwright を選ぶ。asset base、bundle entry、Web Component dev/production sample、service worker、generated output に触れる場合は `npm run build` を実行する。
- Svelte/Vite/Playwright 等の現在の API が判断に影響するときは、`package.json`、local type、project usage、必要なら Context7 の順に確認する。eHagaki 固有 contract は repository code を source of truth とする。
- secret、nsec、private key、authentication payload、token、署名 payload を log、fixture、trace、screenshot、report に残さない。

主要な runtime responsibility、public contract、entrypoint、ownership/security boundary、関連 test が変わる変更では、この skill と同じ変更で [embed runtime map](references/embed-runtime-map.md) も更新する。単なる内部リファクタリングだけで map 更新を要求しない。
