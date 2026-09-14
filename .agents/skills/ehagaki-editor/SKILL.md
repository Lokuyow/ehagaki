---
name: ehagaki-editor
description: "eHagaki の Tiptap/ProseMirror document・transaction・editor lifecycle を調査・変更・レビューする。周辺 UI のみの変更や Nostr protocol の解釈は対象外。"
---

# eHagaki Editor

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

owner や既存実装/test が不明な場合だけ [editor map](references/editor-map.md) の該当節を読む。map 全体の事前読了は不要であり、現在の checkout が優先される。

- schema/serialization: `Creation, configuration, and document schema` と `Editor-to-application flow and reverse inputs`。
- plugin 順や undo/redo: `Extension order and interaction boundaries` と `Transactions, normalization, decorations, and history`。
- remount、placeholder、paste/drag、NodeView: それぞれの lifecycle/localization/input/rendering 節。

native composition/selection/clipboard/focus/geometry の再現・計測が必要なら [browser debug](../ehagaki-browser-debug/SKILL.md) を併用する。embed input の public contract は [embed runtime](../ehagaki-embed-runtime/SKILL.md)、抽出後の event/tag/signing/relay semantics は [Nostr](../ehagaki-nostr/SKILL.md) が所有する。
