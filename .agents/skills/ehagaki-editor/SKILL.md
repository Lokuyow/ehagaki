---
name: ehagaki-editor
description: "eHagaki の Tiptap/ProseMirror document・transaction・editor lifecycle を調査・変更・レビューする。"
---

# eHagaki Editor

document の内容、transaction、入力処理、editor instance の生存期間を扱うときに使う。周辺の投稿 UI だけの変更や、抽出後の Nostr protocol 解釈は対象外。

## Document と owner

- editor の rich representation と最終投稿の plain text を区別する。独自の rich-text/Markdown semantics を足さず、representation を変更する場合は既存の plain-text extraction まで整合させる。
- document が内容の owner であり、debounce された application/UI state を投稿時の document の代替にしない。editor → state と外部入力 → document を区別し、subscription → store setter → dispatch の循環や二重 source of truth を作らない。
- posting UI、gallery、upload workflow/result messaging、post history、fullscreen は editor 外の owner に保つ。editor 内 paste/drop は既存の入力経路を使い、text/HTML、file、media URL、internal node drag を catch-all handler に統合しない。

## Transaction と lifecycle の制約

- `descendants()` / `nodesBetween()` 等の traversal 中に document を変更したり position-changing transaction を適用しない。変更を先に収集し、既存の mapping または適切な適用順で位置を保つ。テストにも同じ制約が適用される。
- normalization / `appendTransaction` は自身の transaction と no-op を再処理しない。同じ document/state にしかならない場合は `null` を返す。自動 transaction の変更では user edit・normalization・undo/redo grouping を検証する。
- extension registration/priority は入力処理順に影響する。順序を変える場合は対象 parser、paste rule、plugin の既存依存を確認し、根拠なく priority や broad transaction suppression を追加しない。
- content、selection/caret、stored marks の整合を保ち、不要な selection 再設定や focus/blur を加えない。NodeView の parse/render、move/delete、serialization は一つの document contract として扱う。
- destroy では listener、timer、subscription、plugin view、Svelte NodeView と editor 参照を解放する。古い instance の cleanup が新しい instance を消したり、remount 後に destroyed view を更新したりしない。
- placeholder 翻訳更新は現行 Svelte lifecycle と live editor instance に従う。表示だけの transaction は history に加えず、同じ値なら dispatch しない。

## 必要な詳細への入口

owner や既存実装/test が不明な場合だけ [editor 索引](references/editor-map.md#変更する挙動から探す) の該当行を使う。入力経路・undo/composition・Reaction の固有条件は [注意点](references/editor-map.md#入力とtransactionの注意点) を参照する。一般的な検証量は [開発ガイド](../../guides/development.md) が所有する。

native composition/selection/clipboard/focus/geometry の再現・計測が必要なら [browser debug](../ehagaki-browser-debug/SKILL.md) を併用する。embed input の public contract は [embed runtime](../ehagaki-embed-runtime/SKILL.md)、抽出後の event/tag/signing/relay semantics は [Nostr](../ehagaki-nostr/SKILL.md) が所有する。
