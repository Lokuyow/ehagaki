# 動画圧縮機能

## 概要

ffmpeg.wasmを利用したクライアントサイド動画圧縮機能を実装しました。
この機能により、動画をアップロードする前にブラウザ内で圧縮し、アップロード時間とサーバー負荷を削減できます。

## 🐛 修正履歴

### 2025年10月5日 - Viteビルドエラーの修正

**問題**: `The file does not exist at "node_modules/.vite/deps/worker.js"` エラーが発生

**原因**:
1. FFmpeg.wasmがCDNから動的にワーカーファイルを読み込もうとしていた
2. Viteの依存関係最適化がFFmpegのワーカーファイルを正しく処理できなかった

**修正内容**:
1. `@ffmpeg/core@0.12.6`をdevDependencyとして追加
2. FFmpegのコアファイル（`ffmpeg-core.js`, `ffmpeg-core.wasm`）を`public/ffmpeg-core/`にコピー
3. `videoCompressionService.ts`をCDNではなくローカルファイルから読み込むように変更
4. `package.json`に`prebuild`スクリプトを追加して、ビルド前に自動コピー
5. `vite.config.ts`に`optimizeDeps.exclude`と`worker.format`設定を追加
6. `.gitignore`に`public/ffmpeg-core`を追加

これにより、開発環境でもビルド環境でも安定してFFmpegが動作するようになりました。

### 2025年10月5日 - FFmpeg読み込みエラーの修正（toBlobURL問題）

**問題**: `Error: failed to import ffmpeg-core.js` エラーが発生

**原因**:
`toBlobURL()`はCDNからファイルを取得してBlob URLに変換する関数ですが、ローカルのpublicフォルダのファイルに対して使用すると失敗します。

**修正内容**:
1. `videoCompressionService.ts`から`toBlobURL`のインポートと使用を削除
2. FFmpegのロード時に直接URLパスを指定するように変更:
   ```typescript
   // 修正前
   coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
   
   // 修正後
   coreURL: `${baseURL}/ffmpeg-core.js`,
   ```
3. デバッグ用のログ出力を追加（開発環境のみ）

これにより、publicフォルダのファイルが正しく読み込まれ、FFmpegが正常に動作するようになりました。

### 2025年10月5日 - プレースホルダー置換問題の修正

**問題**: 動画を選択しても圧縮が完了せず、動画ノードがプレースホルダー状態のまま表示されていた

**原因**:
1. 動画ノードに`isPlaceholder`属性が定義されていなかった
2. 画像ノードと異なり、明示的なプレースホルダーフラグがなかった
3. ノード属性の更新が正しく反映されていなかった

**修正内容**:
1. `videoExtension.ts`に`isPlaceholder`属性を追加
2. `uploadHelper.ts`で動画ノード作成時に`isPlaceholder: true`を設定
3. `uploadHelper.ts`でプレースホルダー置換時に`isPlaceholder: false`を設定
4. `SvelteVideoNode.svelte`のプレースホルダー判定ロジックを改善
5. デバッグログを追加（開発環境のみ）

これにより、動画ノードが画像ノードと同じ仕組みでプレースホルダーから実際のURLに正しく置き換わるようになりました。

### 2025年10月6日 - 圧縮設定の統一

**問題**: 画像圧縮と動画圧縮の設定が異なり、ユーザビリティが低下していた

**原因**:
1. 動画圧縮の最初のオプションが "skip" でラベルが "圧縮しない"
2. 画像圧縮の最初のオプションが "none" でラベルが "無圧縮"
3. 設定ダイアログでの表示が統一されていなかった

**修正内容**:
1. `VIDEO_COMPRESSION_OPTIONS_MAP` で `"skip"` を `"none"` に変更
2. `constants.ts` の `getVideoCompressionLevels()` で最初のオプションを `"compression_none"` に統一
3. i18nファイルでラベルを統一:
   - 圧縮なし
   - 低圧縮（高画質）
   - 中圧縮（中画質）
   - 高圧縮（低画質）
4. `SettingsDialog.svelte` で既存ユーザーの移行処理を追加（`"skip"` → `"none"`）
5. テストファイルを修正して `"skip"` を `"none"` に変更

これにより、画像圧縮と動画圧縮の設定が完全に統一され、ユーザビリティが向上しました。

## 実装の特徴

### 最小限の変更
- 既存の画像圧縮アーキテクチャを踏襲
- `ImageCompressionService`と並列に`VideoCompressionService`を配置
- `FileUploadManager`でファイルタイプに応じて適切なサービスを選択

### シングルスレッド版を採用
- `@ffmpeg/ffmpeg@0.12.10`のシングルスレッド版を使用
- マルチスレッド版よりも互換性が高く、安定動作
- SharedArrayBufferの要件がないため、多くの環境で動作

### 圧縮レベル

#### none (圧縮なし)
- 圧縮処理をスキップ
- 元のファイルをそのままアップロード

#### low (低圧縮（高画質）)
- CRF: 20
- プリセット: superfast
- 最大画素数: 1280px

#### medium (中圧縮（中画質）) - デフォルト
- CRF: 26
- プリセット: superfast
- 最大画素数: 640px

#### high (高圧縮（低画質）)
- CRF: 28
- プリセット: medium
- 最大画素数: 320px

## 技術的詳細

### ファイル構成

```
src/lib/
  videoCompressionService.ts  # 動画圧縮サービス（新規）
  fileUploadManager.ts        # 画像・動画両対応に更新
  constants.ts                # 設定追加

src/components/
  SettingsDialog.svelte       # UI設定追加
  SvelteVideoNode.svelte      # 動画プレースホルダー表示

src/lib/i18n/
  ja.json                     # 日本語翻訳
  en.json                     # 英語翻訳
```

### 圧縮処理フロー

1. ユーザーが動画ファイルを選択
2. `FileUploadManager.uploadFile()`が呼ばれる
3. ファイルタイプが`video/*`の場合、`VideoCompressionService`を使用
4. FFmpegをロード（初回のみ、以降はキャッシュ）
5. H.264/AACで圧縮（MP4コンテナ）
6. 圧縮後のファイルサイズが元より大きい場合は元のファイルを使用
7. アップロード

### 最適化ポイント

- **1MB未満のファイルはスキップ**: 小さなファイルは圧縮効果が薄いため処理しない
- **遅延ロード**: FFmpegは初回圧縮時のみロード
- **ローカルファイル利用**: public/ffmpeg-core/から必要なファイルをロード
- **faststart**: ストリーミング再生に最適化

## 使用方法

### 設定画面から

1. 設定ダイアログを開く
2. 「動画圧縮設定」セクションで圧縮レベルを選択
3. 選択は自動的に保存される

### 動画アップロード

1. 通常通り動画ファイルを選択またはドラッグ&ドロップ
2. 圧縮設定に応じて自動的に圧縮される
3. プレースホルダーが表示され、アップロード進行状況を確認できる

## パフォーマンス

- **初回ロード**: 約2-3秒（FFmpegのダウンロード）
- **圧縮速度**: 動画の長さと圧縮レベルに依存
  - 1分の動画、medium設定: 約10-30秒
  - より短い動画やfastプリセットではより高速

## ブラウザ互換性

- Chrome/Edge 90+
- Firefox 90+
- Safari 15.2+
- Opera 76+

WebAssembly対応ブラウザであれば動作します。

## 制限事項

- 非常に大きな動画（例: 1GB以上）は処理に時間がかかる可能性があります
- モバイルデバイスではメモリ制限により大きな動画の圧縮に失敗する可能性があります
- 圧縮中はブラウザのメインスレッドがブロックされる可能性があります

## 今後の改善案

- Web Worker対応でUIブロックを防ぐ
- 圧縮進捗表示
- カスタム圧縮設定（解像度、ビットレートなど）
- 複数動画の同時圧縮
