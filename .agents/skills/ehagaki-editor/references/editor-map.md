# eHagaki editor map

必要な挙動から現行 owner と代表 test を探す索引。パスは repository root 基準。schema の属性一覧、extension の全登録順、設定値は現在の実装で確認する。

## 変更する挙動から探す

| 挙動 | 主な owner / 入口 | 代表 test |
| --- | --- | --- |
| Mount / remount / submitter / cleanup | `src/components/PostComponent.svelte`, `src/lib/editor/editorLifecycle.ts`, `src/stores/editorStore.svelte.ts` | `src/test/unit/editorLifecycle.test.ts`, `src/test/unit/editorDomActions.test.ts` |
| Schema / node parse-render / extension 順 | `src/lib/editor/editorConfig.ts`, `src/lib/editor/customEmojiExtension.ts`, `src/lib/editor/videoExtension.ts`, `src/lib/editor/uniqueIdExtension.ts` | `src/test/unit/editorConfig.test.ts`, `src/test/unit/customEmoji.test.ts` |
| Normalization / decorations / undo-redo | `src/lib/editor/contentTracking.ts`, `src/lib/utils/editorNodeActions.ts` | `src/test/integration/editor-history.integration.test.ts`, `src/test/integration/editor-url-paste.integration.test.ts`, `src/test/unit/editorNodeActions.test.ts` |
| Document → UI / 投稿本文 / 外部からの挿入 | `src/components/PostComponent.svelte`, `src/lib/editor/editorDomActions.svelte.ts`, `src/lib/utils/editorDocumentUtils.ts`, `src/lib/postManager.ts` | `src/test/unit/editorDocumentUtils.test.ts`, `src/test/unit/insertTextContent.test.ts` |
| Placeholder / 翻訳更新 | `src/lib/editor/editorConfig.ts`, `src/stores/editorStore.svelte.ts`, `src/components/PostComponent.svelte` | `src/test/unit/editorConfig.test.ts`, `src/test/e2e/postEditorSending.spec.ts` |
| Text / HTML / file / media URL paste | `src/lib/editor/clipboardExtension.ts`, `src/lib/editor/clipboardTextCleanup.ts`, `src/lib/editor/mediaPaste.ts`, `src/lib/editor/editorDomActions.svelte.ts` | `src/test/unit/clipboardTextCleanup.test.ts`, `src/test/integration/editor-clipboard.integration.test.ts`, `src/test/integration/editor-url-paste.integration.test.ts`, `src/test/integration/editor-media.integration.test.ts` |
| Internal drag / NodeView / selection | `src/lib/editor/imageDragDrop.ts`, `src/lib/editor/customEmojiDragDrop.ts`, `src/lib/utils/editorNodeActions.ts`, `src/lib/hooks/useImageDrag.svelte.ts`, `src/lib/hooks/useCustomEmojiDrag.svelte.ts` | `src/test/unit/editorNodeActions.test.ts`, `src/test/unit/mediaNodeUtils.test.ts`, `src/test/unit/customEmojiInsertion.test.ts` |
| Suggestion / overlay / caret | `src/lib/editor/suggestionRenderer.ts`, `src/lib/editor/toolbarCaretExtension.ts` と関連 extension/NodeView | `src/test/e2e/customEmojiPicker.spec.ts`; native geometry は [browser 索引](../../ehagaki-browser-debug/references/browser-debug-map.md) |
| Composition / submit 中の入力 | `src/lib/editor/editorInputGuard.ts`, `src/lib/editor/androidCompositionFix.ts`, `src/components/PostComponent.svelte` | `src/test/e2e/postEditorSending.spec.ts` と対応 integration test |
| Reaction の document / input mode | `src/lib/reactionValue.ts`, `src/lib/editor/reactionInput.ts`, `src/lib/reactionMediaController.ts`, `src/components/PostComponent.svelte` | `src/test/integration/reactionInput.integration.test.ts`, `src/test/unit/reactionUploadedValue.test.ts`, `src/test/e2e/postReaction.spec.ts` |

## 入力とtransactionの注意点

- `PostComponent` は editor の subscription と transaction listener を所有する。`editorState.content` は debounce された UI projection であり、投稿本文は live document から再抽出する。`canPost` の同期再計算を debounced update で上書きしない。外部入力は既存の replace/append/draft/media/emoji command を使う。
- ContentTracking の URL normalization は own metadata と no-op を除外し、変更を収集して position を保って適用する。paste 時の link conversion と image URL conversion の違いを保つ。`addToHistory: false` や paste metadata だけで独立した undo group を保証したとみなさず、user edit と normalization の undo/redo を integration test で確認する。UniqueID の own transaction/no-step guard と表示用 caret/placeholder transaction の非履歴化も保つ。
- Clipboard の投稿本文 source は `text/plain`。HTML 付き通常 paste の限定的な marker cleanup と、plain-only/explicit plain の改行正規化を分ける。HTML-only/file は既存 owner へ委譲する。DOM action の file paste/drop、MediaPaste の URL、internal node drag を一つの handler にしない。extension 登録順だけから ProseMirror handler の実行順を推測しない。
- Composition の generation/ID と stale transaction の扱いは `EditorInputGuard` の plugin state / submitted composition controller が所有する。Android の listener/keepalive は `AndroidCompositionFix` が解放し、controller から private state を変更しない。iPhone Safari の success 時 blur/clear/retire は順序を保持する。実 IME の結果は [browser Skill](../../ehagaki-browser-debug/SKILL.md) の証拠境界に従う。
- Reaction は隣接 text を結合した書記素数と customEmoji token で検証し、開始時の invalid document/media を破壊しない。session 所有画像の shortcode mode と通常 single-value mode は同じ最新 mode 判定を transaction filter / IME reconciliation / submit で使う。shortcode の編集は単一 paragraph の text とし、rich node/改行を拒否するが文字数・regex 制限は加えない。送信時の raw 空白拒否と外側 colon 正規化を編集制限と混同しない。画像削除で本文を truncate せず、composition 中は送信しない。送信時は live document を再検証し、Picker usage は実際に挿入できた場合だけ記録する。
- Cleanup は古い instance が新しい current editor を消さないように行う。NodeView、plugin view、suggestion の Svelte mount、DOM action の listener/timer と container property は作成した owner が解放する。placeholder の翻訳更新は live instance へ同値 no-op・非履歴 transaction で反映する。

公開 embed input は [runtime 索引](../../ehagaki-embed-runtime/references/embed-runtime-map.md)、抽出後の event/tag/signing は [Nostr 索引](../../ehagaki-nostr/references/implementation-map.md) を必要な場合に参照する。入力や editor 内部を変更しない周辺 UI にはこの索引を一律適用しない。
