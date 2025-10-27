# エディター履歴管理 テストドキュメント

## 概要

このドキュメントは、エディターの履歴管理機能に関するテストスイートについて説明します。

## 修正された問題

**Issue**: エディターに文字入力→テキストをペースト→改行→文字入力 の操作で、最初に入力した文字が後の文字入力で全て上書きされる

**根本原因**:
- ProseMirrorの`History`拡張は、`newGroupDelay`（デフォルト500ms）以内の連続トランザクションを同じ履歴グループにまとめる
- ペースト操作が前後の入力と同じ履歴グループに統合されていた
- Ctrl+Zで元に戻すと、グループ全体（最初の入力+ペースト）が一緒に消えてしまう

**修正内容**:
1. `CustomHistoryPlugin` を作成してペースト前後の入力を独立させる
2. `clipboardExtension.ts` でペースト時に `rebased: 0` と `setTime()` を設定
3. `contentTracking.ts` でペースト直後のURL変換をスキップ
4. `editorStore.svelte.ts` で `newGroupDelay: 300` に設定

## テストファイル構成

### ユニットテスト

#### 1. `customHistoryPlugin.test.ts` (11テスト)

CustomHistoryPluginの個別機能をテストします。

**テストカテゴリ:**
- ペースト操作の検出
  - `paste` メタデータの検出
  - `uiEvent=paste` メタデータの検出
  - 通常のトランザクションは検出されないこと

- 履歴グループ制御メタデータ
  - `rebased=0` の設定
  - `setTime()` の設定
  - `addToHistory=true` の設定

- タイムスタンプ計算
  - ペースト直後100ms以内の入力判定
  - ペースト後100ms以降の入力判定

- トランザクションの`docChanged`フラグ
  - テキスト挿入でtrueになること
  - メタデータのみでfalseであること
  - ペースト操作でtrueになること

#### 2. `clipboardExtension-history.test.ts` (17テスト)

ClipboardExtensionの履歴管理機能をテストします。

**テストカテゴリ:**
- ペースト時のメタデータ設定
  - `paste` メタデータ
  - `addToHistory` メタデータ
  - `rebased=0` メタデータ
  - タイムスタンプ
  - すべてのメタデータの同時設定

- メタデータの組み合わせ効果
  - `rebased=0 + setTime()` の効果
  - CustomHistoryPluginでの検出可能性

- トランザクションの状態
  - `docChanged` フラグ
  - `steps` の記録

- ペーストテキストの処理
  - 単一行・複数行の処理

- タイムスタンプの精度
  - 連続操作のタイムスタンプの差

- エラーケース
  - 空のテキスト
  - メタデータのみのトランザクション

- Android Gboard対応
  - `processPastedText` の動作

#### 3. `contentTracking-history.test.ts` (18テスト)

ContentTrackingのappendTransaction履歴管理をテストします。

**テストカテゴリ:**
- ペースト操作の検出
  - `paste` メタデータの検出
  - 複数トランザクションからの検出
  - 通常トランザクションとの区別

- `docChanged` フラグの検証
  - trueの場合の検出
  - falseの場合の検出

- appendTransactionの戻り値
  - ペースト時は `null` を返す
  - 通常時はトランザクションを返す

- `addToHistory` メタデータの設定
  - `addToHistory: false` の設定
  - 元の履歴への統合

- ペースト直後のURL変換スキップ
  - ペースト時はスキップ
  - 通常入力時は実行

- 複数トランザクションの処理
- 開発モードのログ出力
- エッジケース

### 統合テスト

#### `editor-history.integration.test.ts` (10テスト)

エディターの履歴管理の統合的な動作をテストします。

**テストカテゴリ:**
- 基本的な履歴操作 (2テスト)
- ペースト操作の履歴管理 (2テスト)
- 高速入力時のペースト操作（Issue修正の検証） (3テスト)
- 複雑なシナリオ (1テスト)
- エッジケース (2テスト)

## テスト実行方法

### すべての履歴管理関連テストを実行
```bash
npm test -- customHistoryPlugin clipboardExtension-history contentTracking-history editor-history.integration
```

### 個別実行
```bash
# ユニットテスト
npm test -- customHistoryPlugin.test
npm test -- clipboardExtension-history.test
npm test -- contentTracking-history.test

# 統合テスト
npm test -- editor-history.integration.test
```

## テスト結果

すべてのテストが合格しています:
- ユニットテスト: 46テスト合格
- 統合テスト: 10テスト合格
- **合計: 56テスト合格**

## ProseMirror / Tiptap v2 の重要な仕様

### History拡張の動作

1. **newGroupDelay**: この時間内の連続トランザクションは同じ履歴グループにまとめられる
2. **appendTransaction**: 元のトランザクションに付随する変更として扱われ、同じ履歴グループに統合される
3. **rebased メタデータ**: `rebased: 0` を設定すると、前のトランザクションとの統合を防ぎ、新しい履歴グループを開始
4. **setTime()**: トランザクションのタイムスタンプを更新し、newGroupDelayの判定に影響

### メタデータの役割

- **`paste: true`**: ペースト操作であることを示す（CustomHistoryPluginで判定）
- **`addToHistory: true`**: 履歴に記録する
- **`addToHistory: false`**: 元のトランザクションと統合（appendTransactionで使用）
- **`rebased: 0`**: 強制的に新しい履歴グループを開始
- **`uiEvent: 'paste'`**: ブラウザのペーストイベント（代替判定）

## カバレッジ

これらのテストは以下をカバーしています:

1. ✅ ペースト操作の独立した履歴管理
2. ✅ ペースト前後の入力の独立性
3. ✅ 高速入力時の正確な履歴記録
4. ✅ メタデータの正確な設定
5. ✅ appendTransactionの正しい動作
6. ✅ タイムスタンプ管理
7. ✅ エッジケースの処理
8. ✅ Android Gboard対応

## 将来の拡張

今後、以下の機能を追加する際は、対応するテストも追加してください:

- 画像/動画のペースト履歴管理
- リッチテキスト（太字、イタリック）のペースト
- 複数選択範囲のペースト
- IME入力との統合

## 参考資料

- [ProseMirror History Guide](https://prosemirror.net/docs/guide/#history)
- [Tiptap v2 History Extension](https://tiptap.dev/api/extensions/history)
- [ProseMirror Transaction API](https://prosemirror.net/docs/ref/#state.Transaction)
