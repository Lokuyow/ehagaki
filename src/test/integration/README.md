# 統合テスト

このディレクトリには、複数モジュールの連携やリグレッション防止を目的とした統合テストを置きます。純粋関数や小さなヘルパーは unit 側で検証し、ここでは実際のユーザーフローに近い振る舞いを確認します。

## 現在のテストファイル

- `app-parent-client.integration.test.ts`: App 初期化と parent client 認証連携、postMessage ベースのログインフロー。
- `auth-to-post.integration.test.ts`: 認証状態、投稿バリデーション、イベント構築、MIME 判定の連携。
- `editor-clipboard.integration.test.ts`: クリップボード正規化、URL 判定、ハッシュタグ抽出、下書き HTML ラウンドトリップ。
- `editor-history.integration.test.ts`: カスタム履歴管理、ペースト後の Undo/Redo、履歴グループ分離の回帰防止。
- `editor-link-detection.integration.test.ts`: 動的リンク判定、リンク解除、URL 編集時の再判定。
- `editor-media.integration.test.ts`: 画像サイズ計算、dim パース、ドラッグ判定、インタラクション制御、メディア検出。
- `editor-url-paste.integration.test.ts`: URL 単体・複数 URL・画像 URL のペースト挙動。
- `file-upload-flow.integration.test.ts`: 圧縮、認証ヘッダー生成、アップロード、エラー処理の一連の流れ。
- `multi-image-upload-uniqueid.integration.test.ts`: 複数画像アップロード時の Unique ID、プレースホルダー検索・置換、削除回帰。
- `video-compression.integration.test.ts`: 圧縮設定、実行フロー、エラー処理、中止、フォールバック動作。

`auth-service.integration.test.ts` は現在このディレクトリに存在しません。README を更新する際は、実在する test file 一覧と一致していることを優先してください。

## 実行方法

```bash
# 統合テストをまとめて実行
npm test -- src/test/integration

# 個別ファイルを実行
npm test -- src/test/integration/auth-to-post.integration.test.ts
npm test -- src/test/integration/editor-history.integration.test.ts
```

## 方針

- 実装詳細よりも、複数モジュールを跨ぐ振る舞いを確認する。
- 外部 I/O やブラウザ API は必要最小限だけモックし、アプリ内ロジックはなるべく実装を組み合わせて使う。
- Issue 修正用の統合テストは、どの回帰を防いでいるかが分かる describe 名を残す。
- setup.ts の共通モックと重複するローカルモックは増やしすぎず、必要な依存だけをファイル単位で差し替える。

## 関連ファイル

- `src/test/setup.ts`
- `src/test/helpers.ts`
- `src/test/mocks/pwa-register.ts`
