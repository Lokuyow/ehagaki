---
name: ehagaki-editor
description: "eHagaki の Tiptap v3 / ProseMirror editor 内部を調査・設計・実装・レビューするときに使用する。extension/plugin、document/selection/transaction、appendTransaction、NodeView、lifecycle、content/state 同期、placeholder、clipboard/paste、media/custom emoji の editor representation を扱う。通常の UI 変更、純粋な NIP 変更、ブラウザ固有の IME/geometry 調査だけには使用しない。"
---

# eHagaki Editor

eHagaki の Tiptap / ProseMirror editor 内部を、現在の checkout を source of truth として扱う。入口、実在する extension、document 表現、state flow、テストは、作業前に [editor map](references/editor-map.md) を読む。map と checkout が異なる場合は checkout を優先する。

## まず document semantics と ownership を確定する

- 見た目や HTML だけから投稿 semantics を推測しない。対象の editor representation、ProseMirror document、application state、最終的な plain-text content のそれぞれについて source of truth と producer/consumer を追う。
- eHagaki は rich representation を editor 内で用いるが、Nostr 投稿 content に独自の rich text や Markdown semantics を足さない。変更前後で既存の plain-text extraction を確認する。
- editor update を state へ流す経路と、application 入力を editor document へ適用する経路を別々に追う。無条件の editor subscription -> store setter -> editor dispatch の循環、二重 source of truth、古い editor instance への更新を作らない。
- embed からの初期 context の public contract や runtime ownership は [ehagaki-embed-runtime](../ehagaki-embed-runtime/SKILL.md) が主である。受領後の document 適用だけをここで扱う。

## extension、plugin、transaction を実装順に追う

1. `editorConfig` の extension registration と明示された priority を確認する。似た parser、normalizer、paste handler、node traversal を追加する前に既存実装を探す。
2. parser、input rule、paste rule、keyboard handler、ProseMirror plugin、decoration、plugin state、`appendTransaction` が対象操作でどう並ぶか、現行コードとテストから確認する。priority や plugin order を変える場合は、その順序に依存する既存挙動を確認する。
3. `descendants()`、`nodesBetween()` などの traversal 中に position-changing transaction を適用しない。変更対象を先に収集し、位置が変わる操作は必要なら後方から適用する。既存の mapping や transaction の方式を優先する。
4. normalization / `appendTransaction` は、document change、changed range、transaction metadata、plugin state、自分自身の transaction、no-op を確認する。同じ document/state を再生成するだけなら `null` を返す。
5. 自動 transaction を追加・変更するときは、user edit、normalization、undo、redo の grouping をテストする。見た目が正しいだけでは完了にしない。

## selection、rendering、lifecycle を守る

- content だけでなく selection、caret、stored marks、focus との境界を確認する。必要のない selection 再設定や programmatic focus を行わない。
- NodeView、inline atom、block node、mark、attrs、parse / render、delete / move、plain-text conversion を一つの contract として追う。gallery、upload workflow、post history、fullscreen は editor 外の owner を保つ。
- editor の作成、subscription、DOM listener、timer / interval、plugin view、Svelte NodeView、destroy を追い、re-mount 時に stale reference が残らないことを確認する。extension `onDestroy` と plugin view の `destroy()` を実装済みの cleanup に従って解放する。
- placeholder の翻訳更新は、現在の Svelte 側の lifecycle と editor instance を起点に確認する。表示を更新するだけの transaction は history に加えず、同じ値なら dispatch しない。

## input の責務を混ぜない

- text / HTML clipboard、file paste、media URL paste、external file drop、editor 内 node drag、suggestion command は別経路として map の実装を確認する。一つの catch-all clipboard handler に統合しない。
- custom emoji、hashtag、link / URL、image、video の document representation と plain-text conversion を変更するときは、対応する parser、input/paste rule、Suggestion、NodeView、transaction、serialization test を併せて確認する。
- composition、native selection、focus、contenteditable、touch drag、OS clipboard、actual DOM geometry の原因調査または証明には [ehagaki-browser-debug](../ehagaki-browser-debug/SKILL.md) を併用する。例えば Android Chrome で日本語変換確定時だけ caret が飛ぶ場合、editor transaction は本 skill、実ブラウザ IME 再現・計測は browser skill が主である。
- NIP-19 / URL を editor document でどう表現・抽出するかは対象にできるが、event kind、NIP 解釈、tag construction、signing、relay publish / subscription は [ehagaki-nostr](../ehagaki-nostr/SKILL.md) が主である。

## 調査、修正、検証

- API 判断が必要なら、`package.json`、local types、現在の repository usage、Context7、必要時の公式資料の順で確認する。一般的な Tiptap / ProseMirror の推奨を eHagaki 固有の ownership に置き換えない。
- 原因を確認する前に timer、arbitrary delay、繰り返しの `requestAnimationFrame`、force focus / blur、forced re-render、duplicate editor state、broad transaction suppression、catch-all normalization、global listener、根拠のない extension priority を加えない。
- pure document transform / classification は unit、extension / plugin / transaction は unit または integration、editor と application state の連携は integration、native selection / composition / clipboard / contenteditable / focus は必要に応じて Playwright または実端末で検証する。jsdom だけで browser-specific behavior を証明しない。
- editor の主要責務、document schema、extension / plugin 構成、plain-text conversion、state synchronization、lifecycle、主要テストを変える作業では、この skill と同じ変更で map を更新する。単なる内部 rename や小さな局所修正では要求しない。

## 発動境界の確認

- custom emoji node 削除 transaction、リンク paste 時の document 変換、placeholder 翻訳が反映されない lifecycle / Svelte 同期は対象である。
- Android Chrome の日本語変換で caret が飛ぶ場合は本 skill を確認し、実ブラウザ IME 調査では browser skill を併用する。
- NIP-10 reply tag marker は Nostr skill が主、Web Component の `setContext()` public API は embed runtime skill が主、投稿ボタンの margin だけの変更は対象外である。
