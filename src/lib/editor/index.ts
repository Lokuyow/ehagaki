// 各機能を分割したExtensionファイルから再エクスポート
export { ContentTrackingExtension } from './contentTracking';
export { MediaPasteExtension } from './mediaPaste';
export { ImageDragDropExtension } from './imageDragDrop';
export { SmartBackspaceExtension } from './smartBackspace';
export { Video } from './videoExtension';
export { ClipboardExtension } from './clipboardExtension';
export { AndroidCompositionFix } from './androidCompositionFix';
export { HashtagSuggestion } from './hashtagSuggestion';

// エディター設定
export { createEditorStore, updateEditorPlaceholder } from './editorConfig';
export type { EditorConfigOptions } from './editorConfig';

// プレースホルダー管理
export {
    insertPlaceholdersIntoEditor,
    generateBlurhashesForPlaceholders,
    replacePlaceholdersWithResults
} from './placeholderManager';