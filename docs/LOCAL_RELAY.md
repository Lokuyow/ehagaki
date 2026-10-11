# Citrine local relay live sync

通常版とPWAの設定で「ローカルリレーURL」を設定します。`ws://` または `wss://` のURLを保存・解除できます。例は `ws://127.0.0.1:4869/` です。実際のURLはCitrine側の設定に合わせてください。設定はこの端末・originの既存localStorageに保存され、アカウント間で共通です。kind 10002や新しいNostr kindには保存しません。iframe、Full Web Component、Host-owned Composer Liteでは利用しません。

履歴は既存IndexedDBを先に表示し、履歴を開く・表示範囲を再取得する・リレーから続きを取得する既存操作に有限のlocal readを並走させます。対象はログイン中のauthorのkind 1 / 6 / 16 / 42 / 1111と、その範囲に必要なkind 5、リンクを検証したkind 36 payloadです。取得済みeventはevent IDで重複なくmergeします。既存の取得上限とpaginationを利用するため、極端な同一秒密度を完全取得する専用algorithmはありません。

external refreshは引き続き動作します。local取得はexternal relay query coverageや`citrine-backup` imported rangeを作りません。既存JSONL import/exportと復元範囲の閲覧は継続できます。local URLをexternal relay集合、publish結果、relay hints、取得provenanceへ追加しません。

eHagakiが生成・検証したsigned eventはlocalへbest-effortで保存します。external syncでauthored historyに採用したeventと、その採用済みの関連payload・有効な削除要求も保存対象です。投稿成功は従来のexternal deliveryだけで決定します。localだけ成功しても投稿成功にはしません。localの停止・拒否・timeout・ブラウザによる接続制限はexternal read/publishを妨げません。接続確認ボタン、local専用sync UI、AUTH署名、offline queue、自動再送、localからexternalへのrebroadcast、完全mirror、Negentropyはありません。

## 自動検証

`npm test`、`npm run check`、`npm run build`に加えて、次でHTTPS通常tabと制御可能なfake WebSocket relayのChromium E2Eを実行します。

```sh
npx playwright test --config=playwright.local-relay.config.ts --reporter=dot
npx playwright test src/test/e2e/postHistoryDialog.spec.ts --project=desktop-chromium --grep Citrine --reporter=dot
```

HTTPSテストserverはOpenSSL（WindowsではGit付属版も利用可）から一時certificateを生成し、trust storeは変更しません。必要なら`EHAGAKI_TEST_OPENSSL`で実行ファイルを指定します。テストは実ユーザーのrelay、account、データを使いません。

## Android Chrome + 実Citrine manual acceptance test

CodexからAndroid実機が利用できない場合は「実機未確認」と報告し、PR作成後・merge前にユーザーが以下をHTTPS通常tabとinstalled PWAの両方で実施します。端末のCitrineと通常のexternal relayを使えるテストaccountを用意します。ブラウザが求めるローカルネットワーク等のpermissionは端末の通常UIで設定します。

1. URLを設定してreload／PWA再起動。設定が保持されることを確認し、解除で空に戻ることを確認して再設定する。
2. Citrineに対象authorのfixtureを用意して、履歴open・表示範囲の再取得・既存「リレーから続きを取得」を操作。対象authored eventが表示され、external履歴更新も続くことを確認する。
3. 同じ取得操作を繰り返す。event IDごとの投稿が重複せず、既存JSONL importの古い履歴も閲覧できることを確認する。
4. eHagakiから投稿。external投稿が成功し、同じsigned event ID・kind・content・tags・pubkey・signatureがCitrineへ保存されることを確認する。Sensitive使用時はリンクしたkind 36も確認する。
5. Citrineを停止して履歴を開き直す／再取得する。IndexedDBの既存履歴とexternal取得が継続することを確認する。
6. Citrine停止中に投稿。external delivery成功で投稿成功になることを確認する。Citrine再起動だけで未保存eventの自動再送やexternalへのrebroadcastが発生しないことを確認する。
