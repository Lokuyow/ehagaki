# 依存関係の更新

2026-10-23の更新では、セキュリティ修正、実行環境、アプリ依存、動画処理、型・テスト基盤、ビルド基盤を順に検証しました。

## 実行環境と固定する依存

- Node.jsは[`.node-version`](../.node-version)、npmは[`package.json`](../package.json)の`packageManager`を正とします。GitHub Actionsもこの指定を参照します。
- Node.js 24系に合わせ、`@types/node`も24系を使用します。
- TypeScriptは6系を使用します。現在の`svelte-check` 4.7.7のpeer dependencyはTypeScript 5/6で、7系は対応範囲外です。
- `rx-nostr` 3.7.8と`patch-package` 8.0.1は、[ACK分離パッチと検証器](RX_NOSTR_PATCH.md)の契約として固定しています。
- Playwrightは[Windows ChromiumのTCPパッチ](PLAYWRIGHT_WINDOWS_TCP_PATCH.md)に合わせて1.59.1に固定しています。1.64.1ではWindows WebKitのJSONL復元後の履歴テストが失敗しました。更新前のコード・アプリ依存でもPlaywrightだけを1.64.1にすると同じ失敗が再現し、1.59.1では成功したため、今回は更新を見送ります。
- `mediabunny`と`@mediabunny/aac-encoder`は同じ1.62.1に固定し、一緒に更新します。

## インストールスクリプトとoverride

npm 12は、依存のインストールスクリプトを`allowScripts`に従って実行します。現在は内容を確認した`esbuild@0.28.2`のバイナリー導入・検証を許可し、ビルドに不要な`es5-ext`のpostinstallを拒否しています。更新時にはスクリプトとバージョンを確認して許可のピンを更新します。

`esbuild`はCSS圧縮とService Workerのブラウザープローブ構築に使う直接のdevDependencyです。Vite 8の間接依存には頼りません。`svelte-i18n` 4.0.1が宣言する旧esbuildには監査警告があるため、その依存経路だけを`$esbuild`で同じ版へ揃えています。svelte-i18nの配布済みruntime/CLIはesbuildをimportせず、翻訳抽出CLIの実行も確認しています。

`serialize-javascript`は7.1.3以上の7系を使用します。以前の全体向けesbuild 0.25系overrideは廃止しています。

## ビルドとブラウザー互換性

Vite 8の`rolldownOptions`と`codeSplitting`を使用します。JS/CSSのブラウザー対象は[`scripts/browserTargets.ts`](../scripts/browserTargets.ts)に集約し、従来のChrome/Edge 107、Firefox 104、Safari 16を維持します。

CSS圧縮は従来のesbuildを明示します。新しい既定のLightning CSSによる`light-dark()`の変換が、実行時の`color-scheme`切り替えと衝突するためです。既存の色値とShadow DOMのテーマ切り替えを維持します。

固定legacy bridgeのハッシュ検証、Full/Liteの依存グラフ検証、base path、Workerのハッシュ付きURL、AAC encoderの動的importは維持します。

`vite-plugin-static-copy` 4系ではコピー元のディレクトリ構造が保存されるため、Web Componentのアイコンには`rename.stripBase`を明示し、従来の配布URLを維持します。

Windowsの並列E2Eではビルド記録の`rename`が`EPERM`になったため、既存のビルドロック内でキャッシュ記録を直接保存します。不完全なJSONは従来どおりキャッシュミスとして扱います。古い記録からの再構築を4プロセス同時に実行し、全呼び出しの成功と記録の整合性を確認しています。

## 監査警告と検証

更新後の`npm audit --omit=dev`は警告0件です。全依存では、修正版が公開されていない`braces` 3.0.3に由来するhighの警告が9パッケージに残っています。主な経路は次のとおりです。

- `patch-package → find-yarn-workspace-root → micromatch → braces`
- `gh-pages → globby → fast-glob → micromatch → braces`
- `vite-plugin-static-copy → chokidar → braces`

これらは開発・ビルド・デプロイ用の依存です。監査の提案する旧版へのダウングレードは適用せず、上流の修正版を待ちます。警告の範囲は[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)と、その時点の`npm audit`で再確認してください。

依存更新時には`npm ci`、`npm ls --depth=0`、`npm run validate`を実行します。ブラウザーに広く影響する更新では二段階の`npm run test:e2e:agent`、HTTPSの`npm run test:e2e:local-relay`、別の本番ビルドを使う`npm run test:e2e:sw`も実行します。全エンジンを選ぶ場合は`EHAGAKI_E2E_ALL_BROWSERS=1`を設定します。詳細は[開発・検証ガイド](../.agents/guides/development.md)を参照してください。

通常E2Eの`videoCompression.spec.ts`は一時ディレクトリへ本番ビルドし、生成した短い動画で、圧縮・映像/音声のデコード・進捗・AAC fallback・キャンセル・エンコード未対応時の原本保持を検証します。実機のキーボード、PWA UI、各OS固有の動作はエミュレーションとは区別して報告します。

## 今回の検証結果

2026-10-23、Windowsの最終構成で確認しています。ブラウザーの実行は`EHAGAKI_E2E_ALL_BROWSERS=1`、再試行0回で、既存の条件付きスキップは追加・変更していません。

| 確認 | 結果 |
| --- | --- |
| クリーンインストールと依存ツリー | `npm ci`・`npm ls --depth=0`成功、既存の2パッチ適用・検証成功 |
| `npm run validate` | 5,459件成功・既存スキップ1件、型チェック・全ビルド・差分チェック成功 |
| Web Component開発サーバーE2E | 1件成功 |
| 通常E2Eの全構成 | 940件成功・既存スキップ32件、失敗0件 |
| HTTPS local relay E2E | Chromiumで24件成功 |
| 本番Service Worker E2E | Chromium・Firefox・WebKitで42件成功 |
| 表示 | 360px/1100pxの履歴画面、320pxの宛先ダイアログを目視確認。Reduced Motionは既存E2Eで確認 |

通常E2Eは、デスクトップ/モバイルのChromium、Android相当のChromium、モバイル相当のWebKit、Firefoxの構成を含みます。Ubuntu上のCIと実端末は未実施です。
