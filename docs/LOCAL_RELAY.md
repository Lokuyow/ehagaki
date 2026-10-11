# Citrine local relay live sync

通常版とPWAの設定で「ローカルリレーURL」を設定します。`ws://` または `wss://` のURLを保存・解除できます。例は `ws://127.0.0.1:4869/` です。実際のURLはCitrine側の設定に合わせてください。設定はこの端末・originの既存localStorageに保存され、アカウント間で共通です。kind 10002や新しいNostr kindには保存しません。iframe、Full Web Component、Host-owned Composer Liteでは利用しません。

履歴は既存IndexedDBを先に表示し、履歴を開く・表示範囲を再取得する・リレーから続きを取得する既存操作に有限のlocal readを並走させます。対象はログイン中のauthorのkind 1 / 6 / 16 / 42 / 1111と、その範囲に必要なkind 5、リンクを検証したkind 36 payloadです。取得済みeventはevent IDで重複なくmergeします。既存の取得上限とpaginationを利用するため、極端な同一秒密度を完全取得する専用algorithmはありません。

external refreshは引き続き動作します。local取得はexternal relay query coverageや`citrine-backup` imported rangeを作りません。既存JSONL import/exportと復元範囲の閲覧は継続できます。local URLをexternal relay集合、publish結果、relay hints、取得provenanceへ追加しません。

正常EOSEと検証完了を満たしたlocal有限REQの範囲は、listingのメモリ内だけで閲覧continuityへ追加します。external quorum・復元範囲と隣接する範囲は連結し、穴は跨ぎません。limit到達時の最古秒は取得完了範囲に含めず、次のinclusive `until`で再取得します。saturated pageのcursorが前回より古くならなければ、現行algorithmでは進行不能としてlocal continuationを停止します。relay全体の枯渇を証明したことにはせず、取得済み範囲を保持し、同じboundsのmanual REQを発行し続けません。

localとexternalは独立したcursorと処理中フラグを持ちます。先に正常結果を画面へcommitした側で既存操作を完了し、もう一方は取消せず継続します。片側の失敗は成功した履歴をfailureへ変えず、遅いexternal head取得がolder windowを最新50件へ巻き戻すこともありません。local閲覧範囲をexternal query planning/cursor/quorumへ流用しません。履歴close/destroy・owner/URL/runtime変更・service session取消/再作成・履歴clearによるDB revision変更（別tabを含む）でlocal範囲・cursor・continuation・進捗cacheを破棄します。clear後にdialogを開いたままなら、次のmanual取得がlatestから範囲を再構築します。

eHagakiが生成・検証したsigned eventはexternal publish成功後だけlocalへbest-effortで保存します。通常投稿・Repost・削除がexternalで失敗した場合はlocal保存を試行しません。Sensitiveはoverall external operation成功後に、実際に署名・送信したpayloadとstructureを1 batchでコピーします。途中stageだけ成功した場合はコピーしません。local ACKはexternal成功レスポンス・履歴保存を遅延させず、structure生成や`c` tagのrelay hintにも使いません。external syncでauthored historyに採用したeventと、その採用済みの関連payload・有効な削除要求も保存対象です。投稿成功は従来のexternal deliveryだけで決定します。localの停止・拒否・timeout・ブラウザによる接続制限はexternal read/publishを妨げません。接続確認ボタン、local専用sync UI、AUTH署名、offline queue、自動再送、localからexternalへのrebroadcast、完全mirror、Negentropyはありません。

Citrine v3.2.0の接続直後の`AUTH` challengeは単独では失敗にせず、REQ/EVENTを継続します。NIP-42認証handshakeは行わず、AUTH eventの生成・署名・送信や認証後retryはありません。実際の`CLOSED auth-required:`はlocal read失敗、対象EVENTへの`OK false`はlocal保存失敗として処理します。

external採用batchのarchiveは、authored event・対応payload・deletionを選別してevent IDでdedupeした後、1つのlocal client/socketからまとめて送信します。in-flightの重複IDも再送せず、ACK完了・期限・session取消でclientを破棄します。external publish/persistenceはこのlocal ACKを待ちません。batchは一回のbest-effort送信で、永続queueやretry・delivery stateを作りません。

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
4. eHagakiから投稿し、投稿履歴を開く前にCitrineを確認。external投稿成功後、同じsigned event ID・kind・content・tags・pubkey・signatureが保存されることを確認する。Sensitive使用時はstructureとリンクしたkind 36も確認する。Repostと削除もexternal成功後に対応kind 6/16、kind 5が保存されることを確認する。
5. Citrineを停止して履歴を開き直す／再取得する。IndexedDBの既存履歴とexternal取得が継続することを確認する。
6. Citrine停止中に投稿。external delivery成功で投稿成功になることを確認する。Citrine再起動だけで未保存eventの自動再送やexternalへのrebroadcastが発生しないことを確認する。
7. テストaccountのexternal write先をすべて接続不能にし、Citrineを起動した状態で投稿。投稿失敗となり、Citrineへその新規eventがコピーされないことを確認してexternal設定を戻す。
8. Aggregator OFFのCitrineに複数ページ（目安360件以上）のauthored履歴を用意し、localhost通信を保ったままexternal通信を使えなくする。eHagakiの履歴をclearして開き直し、scrollと「リレーから続きを取得」でlatest→older→olderと最古まで進める。external timeoutを待たされず、重複・巻き戻りがないことを確認する。
9. Citrine停止・external復旧でもolder取得が継続することを確認する。再度clearした場合、URL変更・account switch後にも古いlocal cursor/範囲が残らないことを確認する。同一秒にlimitを超える履歴がある場合は、その境界を完全取得済みとせずlocal older取得が停止し、external継続が残っていれば操作可能なことを確認する。
