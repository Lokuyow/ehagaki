# eHagaki editor map

この map は調査時点の checkout を索引化したものである。実装が移動または変更されている場合は、現在の code、caller / callee、test を優先する。

## Entry point, lifecycle, and ownership

- `src/components/PostComponent.svelte` が Svelte の composer owner である。`onMount` で `initializeEditor()` を呼び、`EditorContent` に store を渡す。editor store の subscription で `currentEditor`、`editorIsEmpty`、`currentEditorStore` を更新し、`transaction` listener で空状態を追跡する。Web Component の場合は同じ TipTap `Editor.isEmpty` の追跡結果を optional callback へ通知する。cleanup では listener を外して `cleanupEditor()` を呼ぶ。
- `src/lib/editor/editorLifecycle.ts` は editor store 作成、DOM action の listener setup、submitter 登録、container への `__uploadFiles`、`__currentEditor`、`__hasStoredKey`、`__postStatus`、`__submitPost` の配線を担当する。`cleanupEditor()` は event listener と両 subscription を解放し、現在の instance だけを `currentEditorStore` から除去して destroy し、container property と submitter を解放する。これにより remount が destroyed view を更新しない。
- `src/stores/editorStore.svelte.ts` は module-scoped `currentEditorStore`、`editorState`、placeholder text と post submitter を保持する。editor document の owner ではなく、`editorState.content` は UI の即時状態である。
- `src/test/unit/editorLifecycle.test.ts` は current instance / submitter を release する cleanup と、古い cleanup が新しい instance を消さないことを検証する。

## Creation, configuration, and document schema

- `src/lib/editor/editorConfig.ts:createEditorStore()` は `svelte-tiptap` の `createEditor()` で初期 document を JSON の空 paragraph として作成する。`onCreate` は placeholder state と `window.__currentEditor` を設定し、`onDestroy` は後者を消す。
- StarterKit は paragraph class、UndoRedo (`depth: 100`, `newGroupDelay: 500`) と Dropcursor を設定し、heading、blockquote、style marks、list、horizontal rule、hard break、既定 Link を無効にする。`ShiftEnterToParagraph` は Shift+Enter を `splitBlock()` にする。Host-owned Lite の `enterKeyBehavior: "submit"` のみ、`SubmitOnPlainEnter` が高優先度の editor-local plugin として modifierなしの Enter を投稿へ委譲する。Shift+Enter、Ctrl/Cmd+Enter、Alt+Enter、IME composition中の Enter はこの plugin が処理せず既存経路へ委譲する。投稿 content に Markdown / rich-text semantics を追加しない。
- Link は独自に登録され、`autolink` と `linkOnPaste` は無効である。HTTP(S) validation と rendering はここ、動的な link conversion は ContentTracking が担当する。
- Image は block node view (`SvelteImageNode.svelte`) で、`src`、`blurhash`、`isPlaceholder`、`dim`、`size`、`uploadProtocol`、`alt` attrs を持つ。custom emoji に該当する HTML は Image parser から除外される。`Video` (`videoExtension.ts`) は block node、`src` と `isPlaceholder` attrs、`SvelteVideoNode.svelte` node view を持つ。
- `CustomEmoji` (`customEmojiExtension.ts`) は `inline` / `atom` / `selectable` / `draggable` node で、`identityKey`、`shortcode`、`src`、`setAddress` attrs を持つ。modern `img[data-custom-emoji]` と legacy `img.custom-emoji-inline[alt]` を parse し、`SvelteCustomEmojiNode.svelte` が node view を描画する。input rule と paste rule は known shortcode だけを atom に変換する。
- `UniqueID` (`uniqueIdExtension.ts`) は priority `10000` で image / video の `data-id` を parse/render し、create と document changes 後に欠損・重複 ID を補う。own metadata `__uniqueIDTransaction`、no-step guard、`addToHistory: false` が loop と history pollution を防ぐ。

## Extension order and interaction boundaries

`editorConfig.ts` の registration 順は実際の ordering dependency である。submit-on-Enter時のみ `SubmitOnPlainEnter` を先頭に追加し、StarterKit、Link、Image、UniqueID、Focus、`GapCursorFocusReset`、`ShiftEnterToParagraph`、`ContentTrackingExtension`、`HashtagSuggestion`、Video、CustomEmoji、`CustomEmojiSuggestion`、`ToolbarCaretExtension`、`ClipboardExtension`、`MediaPasteExtension`、`ImageDragDropExtension`、`CustomEmojiDragDropExtension`、`SmartBackspaceExtension`、`AndroidCompositionFix`、Placeholder の順へ続く。

- `ClipboardExtension` は MediaPaste より先に登録され、`enablePasteRules` は `clipboardExtension` と `customEmoji` のみである。順序を変更する前に text / file / URL / emoji paste の consumer を確認する。
- `GapCursorFocusReset` は media NodeSelection の visual focus と editor 外クリック / touch の selection reset を管理する。document listener を `onDestroy` で外す。
- `ToolbarCaretExtension` は plugin metadata keyed by its `PluginKey` と widget decoration を用いる。`showToolbarCaret()` と focus handler の transaction は `addToHistory: false` である。
- `SmartBackspaceExtension` は先頭の空 paragraph と後続 image の限定された Backspace case を処理する。

## Transactions, normalization, decorations, and history

- `src/lib/editor/contentTracking.ts:ContentTrackingExtension` は三つの plugin を作る。hashtag decoration、URL / image conversion の `appendTransaction`、debounced content update tracker である。
- hashtag decoration は `getChangedRange()` と `getChangedTextBlocks()` で affected textblock だけを再計算し、`DecorationSet.map()` で既存 decoration を mapping する。
- URL normalization は changed document transaction だけを扱い、`content-tracking-normalized` metadata を持つ自身の transaction を再処理しない。変更範囲を先に収集し、`collectBlockChanges()` の remove mark / add mark / image replacement を position 降順で適用する。`processUrlsAndImages()` が document を変えない場合は `null` を返す。
- paste transaction (`paste` metadata) は link conversion を行うが image URL conversion を skip する。返却する normalization transaction は `addToHistory: false` と content-tracking metadata を設定する。undo / redo の grouping を変えるときは `src/test/integration/editor-history.integration.test.ts` と URL paste coverage を確認する。
- content update tracker は doc change ごとに以前の timeout を clear し、`CONTENT_TRACKING_CONFIG.DEBOUNCE_DELAY`（現在 300ms）後に hashtag data を更新して `window` の `editor-content-changed` event に extracted plain text を載せる。extension destroy は timeout を clear する。

## Editor-to-application flow and reverse inputs

- document -> application: ContentTracking の `editor-content-changed` -> `editorDomActions.svelte.ts:setupEventListeners()` -> `PostComponent` の `onContentUpdate: updateEditorContent` -> `editorState.content` / `hasImage` / `canPost`。media flag は current editor document を `hasMediaInDoc()` で調べる。これは debounce された UI tracking path である。
- document -> post: `PostComponent:submitPost()` -> `PostManager:preparePostPayload()` -> `extractPostContentWithEmojiTags()` / `extractPostContentFromDoc()`。投稿時は document から再抽出する。gallery mode では gallery URL をこの content に加える。
- `src/lib/utils/editorDocumentUtils.ts` は paragraph / text / customEmoji / image / video を投稿用 `content` に直列化する。blocks は newline で結合され、media は `src`、custom emoji は `:shortcode:` と deduplicated `emoji` tags になる。shortcode collision は alias で回避する。変更には `src/test/unit/editorDocumentUtils.test.ts` と `src/test/unit/customEmoji.test.ts` を確認する。
- application -> document: `PostComponent` の `insertTextContent()`（replace）、`appendSharedTextContent()`（append）、`loadDraftContent()`（sanitize した draft HTML）、`appendMediaToEditor()`、`insertCustomEmoji()` が command / transaction を dispatch する。`App.svelte` は draft、share、URL query、embed composer context の入口からこれらを呼ぶ。embed public input contract は embed runtime skill が主である。

## Placeholder and localization

- `PostComponent` の Svelte effect は translated `editorPlaceholderText` を `updatePlaceholderText()` に渡す。store は live current editor があると `updateEditorPlaceholder()` を呼ぶ。
- `editorConfig.ts:updateEditorPlaceholder()` は `__placeholderState`、Placeholder extension option、既存 `[data-placeholder]` を更新する。同じ state / DOM value なら no-op、再描画 transaction は `addToHistory: false`。`src/test/unit/editorConfig.test.ts` が dispatch と no-op を検証する。

## Clipboard, paste, drag, and composition

- `ClipboardExtension` は plain text を normalized lines / paragraph Slice にし、`paste`、`uiEvent: paste`、`addToHistory: true` を set して dispatch する。file clipboard は次の owner へ委譲し、rich HTML は default handling に委譲する。copy は paragraph / image / video を plain text へ serialise する。`src/test/integration/editor-clipboard.integration.test.ts` が paragraph、HTML、history behavior を扱う。
- `editorDomActions.svelte.ts:pasteAction()` は image file clipboard を upload handler へ渡し、text paste を ClipboardExtension へ残す。`fileDropAction()` は external file drop を upload handler へ、internal `application/x-tiptap-node` drag を ProseMirror plugin へ残す。
- `MediaPasteExtension` は pasted / typed media URL を image or video node（free placement）または media gallery（gallery mode）に移す。text URL の link / image conversion は ContentTracking の別経路である。`src/test/integration/editor-media.integration.test.ts`、`src/test/unit/imagePaste.test.ts`、`src/test/integration/editor-url-paste.integration.test.ts` を参照する。
- `ImageDragDropExtension` と `CustomEmojiDragDropExtension` は plugin state、widget decorations、internal MIME、touch custom events、plugin-view listener cleanup を担当する。position-changing moves は `src/lib/utils/editorNodeActions.ts` の `moveImageNode()` / `moveCustomEmojiNode()` が dispatch する。custom emoji move は node selection を設定する。native/touch contenteditable drag の再現や geometry は browser debug skill を併用する。
- `AndroidCompositionFix` は Android のみで composition start/end listener と 4秒 keepalive interval を管理し、destroy 時に interval / listeners を解除する。IME / caret browser difference の証明はこの extension の unit reasoning だけで完結させない。

## Suggestions and NodeView rendering

- `HashtagSuggestion` は `#` と IndexedDB-backed `getSuggestions()` を使い、選択時に range を `#value ` へ置換する。
- `CustomEmojiSuggestion` は `:` trigger と URL-like segment exclusion を使い、candidate を customEmoji atom へ置換して選択 callback を呼ぶ。
- `suggestionRenderer.ts:createSuggestionRenderer()` は Svelte component を runtime overlay target へ mount / unmount し、start / update / key command / exit を所有する。位置は client rect と viewport を使う。overlay / geometry の問題は browser skill に切り出す。
- Svelte image / video / custom emoji NodeView の interaction、drag cleanup、selection interaction を変える場合は、対応 node extension と `src/lib/hooks/useImageDrag.svelte.ts` / `useCustomEmojiDrag.svelte.ts`、`src/lib/utils/mediaNodeUtils.ts` まで caller / callee を追う。

## Test map and escalation

- Unit: `editorConfig.test.ts`、`editorLifecycle.test.ts`、`editorDocumentUtils.test.ts`、`editorNodeActions.test.ts`、`editorDomActions.test.ts`、`editorUrlUtils.test.ts`、`imagePaste.test.ts`、`insertTextContent.test.ts`、`customEmoji.test.ts`、`customEmojiInsertion.test.ts`。
- Integration: `editor-history.integration.test.ts`、`editor-clipboard.integration.test.ts`、`editor-media.integration.test.ts`、`editor-link-detection.integration.test.ts`、`editor-url-paste.integration.test.ts`、`multi-image-upload-uniqueid.integration.test.ts`。
- Playwright: `postEditorSending.spec.ts` proves live contenteditable sending / placeholder behavior; `customEmojiPicker.spec.ts` covers picker runtime behavior rather than generic editor transaction semantics. Add E2E only when editor unit/integration tests cannot prove native selection, composition, clipboard, focus, contenteditable, touch drag, or geometry behavior.
- Android/iOS IME, native selection, browser clipboard, focus, touch caret, actual geometry, PWA / WebView behavior require `ehagaki-browser-debug`; device emulation is not real-device evidence.
