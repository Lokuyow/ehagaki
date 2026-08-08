# eHagaki Nostr implementation map

この文書は2026-07-30時点のcheckoutをコードとテストから対応付けた調査用索引である。現在のコードと差がある場合は現在のコードを優先する。

## 使用中のNostr関連ライブラリ

- `nostr-tools`: `^2.23.3`
- `rx-nostr`: `^3.7.4`
- `@rx-nostr/crypto`: `^3.1.6`
- `nip07-awaiter`: `^1.1.0`
- 関連パッケージ: `nostr-zap ^1.3.0`、`nostr-zap-view ^1.4.6`

## 通常投稿

- 機能: 通常のshort text noteを構築し、署名してrelayへ送る。
- 関連NIP: NIP-01。付加tagは各機能のNIPも参照する。
- event kind: `1`
- 主なtag: `t`、`client`、`content-warning`、`emoji`、`imeta`。reply/quote時は`e`、`p`、`q`も加わる。
- 主な実装ファイル: `src/lib/postManager.ts`、`src/lib/postEventBuilder.ts`、`src/lib/signedEventResultValidator.ts`、`src/lib/sessionLiveness.ts`、`src/components/PostComponent.svelte`
- 主な関数または責務: `PostManager.submitPost`が投稿状態とtagを統合してoperation開始時のpubkeyを固定し、`PostEventBuilder.buildEvent`がevent templateを構築し、`PostManager.sendPreparedEvent`が署名前に比較用snapshotとsigner入力用cloneを分離したうえで、active sessionと署名結果のtemplate一致を検証してから`PostEventSender.sendEvent`へ渡す。
- 関連テスト: `src/test/unit/postManager.test.ts`、`src/test/unit/signedEventResultValidator.test.ts`、`src/test/unit/signedEventSessionBoundaries.integration.test.ts`
- 注意点: `PostEventBuilder.buildEvent`はreply/quote系tagを先頭に置く。送信と構築を同じ責務へ戻さない。publish開始前のsession変更は送信を防ぐが、publish成功後はverified event自身のpubkeyでPost History保存を完了させる。

## リプライ

- 機能: kind 1またはkind 42へのreply targetを取得し、thread tagと通知先を構築する。
- 関連NIP: NIP-10。public chatではNIP-28も関係する。
- event kind: 投稿先により`1`または`42`
- 主なtag: marked `e` (`root`、`reply`)、`p`。kind 42ではchannel rootの`e`も必要になる。
- 主な実装ファイル: `src/lib/replyQuoteService.ts`、`src/lib/postManager.ts`、`src/lib/postHistoryNip10Utils.ts`、`src/stores/replyQuoteStore.svelte.ts`
- 主な関数または責務: `ReplyQuoteService.extractThreadInfo`、`buildReplyTags`、`fetchReferencedEventTask`、`parseKind1ThreadReferences`、`parseKind42ThreadReferences`が取得とthread semanticsを分担する。
- 関連テスト: `src/test/unit/replyQuoteService.test.ts`、`src/test/unit/postManager.test.ts`、`src/test/unit/postHistoryNip10Utils.test.ts`、`src/test/unit/replyQuoteStore.test.ts`
- 注意点: root、直接parent、marker、author、relay hintを別々に検証する。kind 42のchannel rootとreply parentを混同しない。

## 引用

- 機能: quote targetを保持し、`q` tagと`nostr:nevent`本文参照を生成・解決する。
- 関連NIP: NIP-18、NIP-21、NIP-19
- event kind: 引用投稿は`1`または`42`。target kindは取得したeventに従う。
- 主なtag: `q` (`event id`, `relay hint`, `author`)。設定により通知用`p`。
- 主な実装ファイル: `src/lib/replyQuoteService.ts`、`src/lib/postManager.ts`、`src/lib/postHistoryQuoteUtils.ts`、`src/lib/postHistoryRelatedTargetDiscoveryAdapter.ts`
- 主な関数または責務: `buildQuoteTags`、`generateNostrUri`、`extractInlineQuoteTags`、`parsePostHistoryQuoteReferences`がtag、URI、表示用referenceを扱う。
- 関連テスト: `src/test/unit/replyQuoteService.test.ts`、`src/test/unit/postManager.test.ts`、`src/test/unit/postHistoryQuoteUtils.test.ts`、`src/test/unit/postHistoryRelatedTargetDiscoveryAdapter.test.ts`
- 注意点: kind 42のquoteはchannel root `e`と`q`を持つが、reply `e`を自動追加しない既存契約がテストされている。同一targetの`q`と通知用`p`はdedupeする。

## リポスト

- 機能: READMEはNIP-18 Reposts対応を掲げる。
- 関連NIP: NIP-18
- event kind: NIP上は`6`またはgeneric repostの`16`が関係するが、現在の実装で構築・取得する箇所は確認できなかった。
- 主なtag: 現在の実装では確認できなかった。
- 主な実装ファイル: 実装ファイルは確認できなかった。`README.md`の対応NIP一覧にのみ記載がある。
- 主な関数または責務: 確認できなかった。
- 関連テスト: kind 6/16またはrepostを対象にするテストは確認できなかった。
- 注意点: 実装済みと推測しない。変更要求では期待するkind、content、`e`/`p`/`a` semanticsを`needs confirmation`として先に確定する。

## NIP-19識別子

- 機能: nsec、npub、nprofile、note、neventをdecode/encodeし、event pointerを入力経路へ変換する。
- 関連NIP: NIP-19
- event kind: pointer自体に固定kindはない。`nevent`のkind hintを検証に使う経路がある。
- 主なtag: なし。pointer内にrelay hint、author hint、kind hintを含み得る。
- 主な実装ファイル: `src/lib/utils/nostrUtils.ts`、`src/lib/eventPointerUtils.ts`、`src/lib/composerTargetUtils.ts`、`src/lib/composerTargetResolver.ts`
- 主な関数または責務: `decodeEventPointerValue`はnote/neventを正規化し、`parseComposerTargetInput`はnote/neventだけをcomposer targetとして受理する。`createComposerTargetResolver`は取得eventをID、author hint、kind hint、署名で検証する。
- 関連テスト: `src/test/unit/nostrUtils.test.ts`、`src/test/unit/eventPointerUtils.test.ts`、`src/test/unit/composerTargetUtils.test.ts`、`src/test/unit/composerTargetResolver.test.ts`
- 注意点: composer targetでは`npub`、`nprofile`、`naddr`を明示的にunsupportedとし、`nsec`をsecret-keyとして分離する。現在のコードに汎用naddr resolverは確認できない。

## nostr: URI

- 機能: NIP-21 URIをquery、embed、composer target、inline quote、post history表示で扱う。
- 関連NIP: NIP-21、NIP-19
- event kind: URIが指すeventに従う。
- 主なtag: inline quoteでは解決結果から`q`、必要に応じて`p`を作る。
- 主な実装ファイル: `src/lib/replyQuoteService.ts`、`src/lib/urlQueryHandler.ts`、`src/lib/embedComposerContextValidation.ts`、`src/lib/embedComposerContextNotification.ts`、`src/lib/composerTargetUtils.ts`、`src/lib/postHistoryQuoteUtils.ts`
- 主な関数または責務: `generateNostrUri`、`extractInlineQuoteTags`、`decodeEventPointerValue`、`parseComposerTargetInput`が生成・decode・入力検証を分担する。
- 関連テスト: `src/test/unit/replyQuoteService.test.ts`、`src/test/unit/urlQueryHandler.test.ts`、`src/test/unit/eventPointerUtils.test.ts`、`src/test/unit/composerTargetUtils.test.ts`、`src/test/unit/postHistoryQuoteUtils.test.ts`
- 注意点: inline quoteの抽出対象はnote/neventである。post history表示でもnaddr URIはquote targetとして解決しないことがテストされている。

## パブリックチャット

- 機能: channel creation/metadata/messageを解決し、channel context付きkind 42投稿を構築する。
- 関連NIP: NIP-28。replyにはNIP-10、quoteにはNIP-18も関係する。
- event kind: channel creation `40`、metadata `41`、channel message `42`
- 主なtag: kind 41/42のchannelを指す`e`、kind 42 root/reply `e`、通知先`p`、引用`q`
- 主な実装ファイル: `src/lib/channelContextService.ts`、`src/lib/channelContextCoordinator.ts`、`src/lib/channelContextApplyController.ts`、`src/lib/composerTargetResolver.ts`、`src/lib/channelPictureUrlUtils.ts`、`src/components/ChannelPicture.svelte`、`src/lib/postEventBuilder.ts`、`src/lib/postManager.ts`
- 主な関数または責務: `ChannelContextService.resolveChannelContext`とmetadata解決処理がkind 40/41を取得し、`createComposerTargetResolver`がkind 40/42 targetを検証する。検証済みmetadataのpictureは`ChannelPicture`からevent ID付きsame-origin proxyへ渡し、SWが永続`channelMetadata`との一致を毎GETで再確認する。`PostEventBuilder.buildEvent`がkind 42とchannel rootを構築する。
- 関連テスト: `src/test/unit/channelContextService.test.ts`、`src/test/unit/channelContextCoordinator.test.ts`、`src/test/unit/channelContextApplyController.test.ts`、`src/test/unit/composerTargetResolver.test.ts`、`src/test/unit/channelPictureUrlUtils.test.ts`、`src/test/unit/channelPicture.test.ts`、`src/test/unit/swChannelImageCacheUtils.test.ts`、`src/test/unit/postManager.test.ts`、`src/test/e2e/composerTargetDialog.spec.ts`
- 注意点: channel metadata由来relay hint、外部入力relay、write relayはprovenanceが異なる。kind 42のchannel rootをUI表示から推測せずparser結果を使う。URL query、iframe、draftのpicture overrideは検証済みmetadataと同一視せず、チャンネル画像キャッシュへ保存しない。

## Content Warning

- 機能: 投稿へContent WarningとNSFW tagを付与する。
- 関連NIP: NIP-36
- event kind: `1`または`42`
- 主なtag: `content-warning`、`t`=`nsfw`
- 主な実装ファイル: `src/lib/postEventBuilder.ts`、`src/lib/postManager.ts`、`src/components/KeyboardButtonBar.svelte`、`src/components/ReasonInput.svelte`
- 主な関数または責務: `PostEventBuilder.buildEvent`が理由の有無と既存NSFW hashtagを考慮してtagを構築し、`PostManager.submitPost`がstore状態を渡す。
- 関連テスト: `src/test/unit/postManager.test.ts`、`src/test/unit/keyboardButtonBar.test.ts`
- 注意点: Content Warning有効時は`nsfw` hashtagも追加し、既存tagを重複させない。

## カスタム絵文字

- 機能: kind 10030/30030から絵文字セットを取得・cacheし、投稿本文と`emoji` tagへ反映する。
- 関連NIP: NIP-30
- event kind: profile emoji list `10030`、emoji set `30030`、利用先投稿`1`または`42`
- 主なtag: `emoji`、kind 10030からkind 30030を参照する`a`、parameterized eventの`d`
- 主な実装ファイル: `src/lib/customEmoji.ts`、`src/lib/utils/editorDocumentUtils.ts`、`src/lib/postEventBuilder.ts`、`src/lib/storage/emojisRepository.ts`
- 主な関数または責務: `fetchCustomEmojiList`がbackward REQで10030/30030を取得し、`parseEmojiTags`と`getKind10030EmojiSetAddresses`がdescriptorを解釈し、editor extractionと`buildEvent`が利用tagを生成する。
- 関連テスト: `src/test/unit/customEmoji.test.ts`、`src/test/unit/editorDocumentUtils.test.ts`、`src/test/unit/postManager.test.ts`、`src/test/unit/ehagakiDb.test.ts`
- 注意点: shortcodeだけで同名画像を潰さず、選択したURLと必要なset addressを保持する。network testはmockする。

## legacy nsec credential migration

- 機能: 旧single-accountの`nostr-secret-key`を、nsec自身から導出したpubkeyのcredential、`nsec` account record、activation policyに沿うactive pointerへ安全に移行する。
- 関連NIP: nsecのdecode/identity導出はNIP-19。migrationはrelay eventを生成・取得しない。
- 主な実装ファイル: `src/lib/legacyNsecMigration.ts`、`src/lib/authService.ts`、`src/lib/keyManager.svelte.ts`、`src/lib/accountManager.ts`。
- 主な関数または責務: `captureLegacyNsecMigrationSnapshot`がaccount listとactive pointerをstrictに取得し、`migrateLegacyNsec`がcredential readback、account record readback、activation policy、legacy削除を順に所有する。`AuthService.initializeAuth`はsnapshot後にNIP-07/NIP-46の旧single-account移行を必要時だけ実行し、nsec migrationの後に既存managed restoreへ進む。
- 関連テスト: `src/test/unit/legacyNsecMigration.test.ts`、`src/test/unit/keyManager.test.ts`、`src/test/unit/accountManager.test.ts`、`src/test/unit/authService.initialize.test.ts`。
- 注意点: profile/relay storage keyのsuffixをidentity根拠に使わない。legacy credentialはすべての永続条件をreadbackで確認するまで削除しない。既存の有効なactive pointerはtypeにかかわらずmigration中に維持し、Parent clientは起動時managed restore候補へ追加しない。

## NIP-07

- 機能: browser extensionを待機し、公開鍵取得とevent署名を行う。
- 関連NIP: NIP-07
- event kind: 署名対象に従う。
- 主なtag: 署名対象eventに従う。
- 主な実装ファイル: `src/lib/nip07AuthService.ts`、`src/lib/nostrAuthService.ts`、`src/lib/authService.ts`
- 主な関数または責務: `Nip07AuthService.waitForExtension`、`authenticate`、`signEvent`が`nip07-awaiter`とcaptured `window.nostr`を扱い、`NostrAuthService.getEventSigner`が共通Signer境界へ接続する。
- 関連テスト: `src/test/unit/nip07AuthService.test.ts`、`src/test/unit/nostrAuthService.test.ts`、`src/test/unit/authService.authenticate.test.ts`
- 注意点: extension注入待機と署名を独自pollingへ置き換えない。session pubkeyと署名者pubkeyの一致検証を保つ。

## NIP-46

- 機能: bunker/Nostr Connect接続、session復元、remote signer署名、relay選択、接続状態管理を行う。
- 関連NIP: NIP-46
- event kind: NIP-46 transport eventは`24133`。eHagakiが要求する署名範囲は`1`、`5`、`42`、`10063`、`22242`、`27235`、`24242`。
- 主なtag: NIP-46接続で利用する`p`、Nostr Connect URIのrelay/secret/metadata、各署名対象eventのtag
- 主な実装ファイル: `src/lib/nip46Service.ts`、`src/lib/nip46AuthFlowCoordinator.ts`、`src/lib/nip46PendingOperationUtils.ts`、`src/lib/nip46ConnectUiUtils.ts`、`src/lib/authService.ts`
- 主な関数または責務: `Nip46Service.connect`、`startNostrConnect`、`reconnect`、`ensureConnection`、`getSignerForSession`、`disconnect`と`Nip46SignerAdapter.signEvent`が接続、同一sessionのruntime signer復旧、Signer adapterを分担する。fresh `BunkerSigner`はglobal commit前にdirect `get_public_key`でlive user identityを確認し、`reconnect`と`rebuildConnection`はcandidate-firstで進める。rebuildはsession/runtime/persistence bindingのsnapshot所有権を確認し、snapshot bindingへのsession保存成功後にcandidateをcommitする。remote signer pubkeyをuser identityへfallbackしない。`NIP46_REQUESTED_PERMISSIONS`が要求権限のsource of truthである。
- 関連テスト: `src/test/unit/nip46Service.test.ts`、`src/test/unit/nip46AuthFlowCoordinator.test.ts`、`src/test/unit/nip46PendingOperationUtils.test.ts`、`src/test/unit/nip46ConnectUiUtils.test.ts`、`src/test/unit/loginDialog.test.ts`
- 注意点: 接続確認と`get_public_key`検証を混同しない。payload、secret、署名要求本文をログやfixtureへ残さない。`Nip46WebSocket`にはrelay互換目的の`limit:0`補正があるため、根拠なく一般化しない。

## プロフィール取得

- 機能: kind 0 metadataをrelayから取得し、比較、cache、IndexedDB永続化、subscriber通知を行う。
- 関連NIP: NIP-01。relay tier解決にはNIP-65も関係する。
- event kind: profile metadata `0`、relay list metadata `10002`
- 主なtag: kind 0自体の主要情報はJSON `content`。REQは`authors`、`kinds`、`until`、`limit`を使う。
- 主な実装ファイル: `src/lib/profileManager.ts`、`src/lib/profileMetadataCache.svelte.ts`、`src/lib/relayProfileService.ts`、`src/lib/profileEventComparison.ts`、`src/lib/storage/profilesRepository.ts`
- 主な関数または責務: `ProfileNetworkFetcher.fetchFromNetwork`、`ProfileManager`、`profileMetadataCache`、`RelayProfileService.fetchProfileRealtime`/`subscribeProfile`がnetwork、selection、cache、購読を分担する。
- 関連テスト: `src/test/unit/profileManager.test.ts`、`src/test/unit/profileMetadataCache.test.ts`、`src/test/unit/relayProfileService.test.ts`、`src/test/unit/profileEventComparison.test.ts`、`src/test/unit/profilesRepository.test.ts`、`src/test/unit/ProfileComponent.test.ts`
- 注意点: 複数relayのkind 0はevent freshnessと署名検証を考慮し、negative cache、同時要求共有、timeout、unsubscribeを保つ。

## 関連イベント取得

- 機能: reply parent、quote target、deletion requestなどpost historyの関連eventを発見・取得・cache・表示状態へ解決する。
- 関連NIP: NIP-09、NIP-10、NIP-18、NIP-21
- event kind: target `1`/`42`など、deletion request `5`
- 主なtag: replyの`e`/`p`、quoteの`q`、deletionの`e`/`a`
- 主な実装ファイル: `src/lib/postHistoryRelatedTargetDiscoveryAdapter.ts`、`src/lib/postHistoryRelatedTargetResolver.svelte.ts`、`src/lib/postHistoryContextFetchService.ts`、`src/lib/postHistoryDeletionFetchService.ts`、`src/lib/storage/postHistoryRepository.ts`
- 主な関数または責務: discovery adapterが`RelatedTargetDescriptor`を生成し、`createPostHistoryRelatedTargetResolver`がlocal-first lookup、network fetch、deletion check、profile sync、scope cancelを調整する。
- 関連テスト: `src/test/unit/postHistoryRelatedTargetDiscoveryAdapter.test.ts`、`src/test/unit/postHistoryRelatedTargetResolver.test.ts`、`src/test/unit/postHistoryRelatedEventCard.test.ts`、`src/test/e2e/postHistoryDialog.spec.ts`
- 注意点: discovery、descriptor、fetch、cache、renderingの境界を維持する。target ID単位のpending共有とscope generationでstale completionを防ぐ。

## 投稿履歴JSONLインポートと削除要求

- 機能: Nostr JSONLをstreamingで検証し、現在のアカウントによるkind 1/42を投稿履歴へ統合し、kind 5の有効な`e`タグを削除要求として保存する。対象未取得の削除要求はpendingとして保持し、実際の対象eventとauthorが一致した時点で検証済みへ昇格する。
- 関連NIP: NIP-01、NIP-09、NIP-28。
- event kind: 投稿履歴対象`1`/`42`、将来の削除要求保持対象`6`/`7`/`16`/`20`/`21`/`22`、deletion request `5`。
- 主なtag: kind 5の`e`と任意の`k`。Phase 1のJSONLインポートでは`e`に64文字の小文字16進event IDだけを受理し、対象未取得時は正常な`k`がすべて保存対象外kindの場合だけ削除要求を除外する。
- 主な実装ファイル: `src/lib/postHistoryJsonlImportService.ts`、`src/lib/postHistoryJsonlExportService.ts`、`src/lib/postHistoryDeletionUtils.ts`、`src/lib/storage/postHistoryRepository.ts`、`src/lib/storage/postHistoryDeletionRequestsRepository.ts`、`src/lib/postDeletionService.ts`、`src/lib/signedEventResultValidator.ts`、`src/lib/sessionLiveness.ts`、`src/components/PostHistoryImportDialog.svelte`、`src/components/PostHistoryDialog.svelte`。
- 主な関数または責務: `postHistoryRawEventVerification.ts`が投稿履歴専用のRxNostr `use()`境界（RxNostrの署名検証後にstructureとevent ID一致を補完）と非永続attestationを担う。local signerとJSONL importはsymbolやライブラリ検証cacheを引き継がないplain NIP-01 snapshotで完全検証し、構造不正な外部signer結果は例外を漏らさず検証失敗として返す。repositoryはattestationがなければ完全検証fallbackを行い、recordのoptionalな`rawEventVerification`で保存済みrawの検証規則versionを保持する。`PostHistoryJsonlImportService.importFile`がfatal UTF-8 decode、行分類、ファイル全体のevent ID重複排除、500 event単位のflushを担う。`postHistoryJsonlExportEngine.ts`がlegacy migration、raw整合性確認、partial集計、stable sort、chunked JSONL/Blob生成の共有実装であり、production `postHistoryJsonlExportWorker.ts`と互換用`PostHistoryJsonlExportService.exportForPubkey`が同じengineを呼ぶ。`upsertImportedDeletionEvents`がJSONL由来kind 5をpendingまたは検証済みとして保存し、`saveLocalDeletion`がpublish成功後のkind 5 raw eventと投稿削除状態を同一transactionで保存する。`getDeletedTargets`は`targetVerified !== false`の削除要求だけを既存resolverへ返す。
- 関連テスト: `src/test/unit/postHistoryRawEventVerification.test.ts`、`src/test/unit/postHistorySignerVerification.integration.test.ts`、`src/test/unit/postHistoryRawEventAttestationRepository.integration.test.ts`、`src/test/unit/postHistoryJsonlExportEngine.test.ts`、`src/test/unit/postHistoryJsonlImportService.test.ts`、`src/test/unit/postHistoryJsonlExportService.test.ts`、`src/test/unit/postHistoryDeletionRequestsRepository.test.ts`、`src/test/unit/postHistoryRepository.test.ts`、`src/test/unit/postHistoryRelatedTargetResolver.test.ts`、`src/test/unit/postHistoryImportDialog.test.ts`、`src/test/unit/postHistoryDialog.test.ts`、`src/test/e2e/postHistoryDialog.spec.ts`。
- 注意点: 削除要求の`deletedAt`はNostr秒、投稿履歴の`deletedAt`はミリ秒であり、適用境界だけで1000倍する。`k`なし、不正`k`あり、保存対象kindと対象外kindの混在は対象kind不明としてpending保存し、対象event実体があれば申告`k`より実kindを優先する。`targetVerified`なしの既存recordは後方互換上検証済みとして扱い、pendingを`authorHint`だけの事前削除判定へ流さない。local deletionはsigner呼び出し前の独立snapshotに対して署名結果を検証し、publish開始前のsessionも確認するが、publish成功後のsession変更だけを理由に`saveLocalDeletion`を中止しない。JSONL由来relay URLは追加せず、object store・索引・DB versionを増やさない。

## relay管理

- 機能: relay設定を保存し、NIP-65 relay list metadataとlegacy kind 3を取得してrx-nostrへ反映する。
- 関連NIP: NIP-65、NIP-02、NIP-42
- event kind: relay list metadata `10002`、legacy contact list `3`、relay AUTH `22242`
- 主なtag: NIP-65の`r` (`read`/`write`)、kind 3 content内のrelay map、AUTHの`relay`/`challenge`
- 主な実装ファイル: `src/lib/relayManager.ts`、`src/lib/relayConfigUtils.ts`、`src/lib/storage/relayConfigsRepository.ts`、`src/lib/bootstrap/authBootstrap.ts`、`src/lib/nostrAuthService.ts`
- 主な関数または責務: `RelayNetworkFetcher.fetchKind10002`/`fetchKind3`、`RelayManager.fetchUserRelays`、`RelayConfigUtils`が取得・fallback・正規化を担い、`initializeNostrSession`がverifierとNIP-42 authenticator付きrx-nostr sessionを作る。
- 関連テスト: `src/test/unit/relayManager.test.ts`、`src/test/unit/relayConfigUtils.test.ts`、`src/test/unit/authBootstrap.test.ts`、`src/test/unit/nostrAuthService.test.ts`
- 注意点: external relay hintと保存済みread/write relayを混同しない。NIP-42 transport/retryはrx-nostrに任せ、AUTH eventをbound relayとsession signerへ結び付ける。

## ファイルメタデータ

- 機能: NIP-96応答のfile metadataを解析し、投稿用`imeta` tagを生成する。
- 関連NIP: NIP-94、NIP-92
- event kind: NIP-94 file metadata `1063`はserver応答の`nip94_event`として扱う。eHagakiがkind 1063をpublishする処理は確認できなかった。`imeta`の利用先は`1`/`42`。
- 主なtag: NIP-94応答の`url`、`m`、`x`、`ox`、`size`、`dim`、`blurhash`、`alt`など。投稿側は`imeta`。
- 主な実装ファイル: `src/lib/upload/Nip96UploadAdapter.ts`、`src/lib/upload/BlossomUploadAdapter.ts`、`src/lib/tags/imetaTag.ts`、`src/lib/uploadImetaUtils.ts`、`src/lib/postEventBuilder.ts`
- 主な関数または責務: `Nip96UploadAdapter.upload`は最初のNIP-94 `url`をNIP-96限定policyで検証し、literal fragmentだけを除いた同じURLをavailability、result、投稿用metadataへ渡す。`createImetaTag`と`generateDevImetaTags`が投稿用metadataを作る。
- 関連テスト: `src/test/unit/nip96UploadAdapter.test.ts`、`src/test/unit/nip96UrlPolicy.test.ts`、`src/test/unit/uploadedMediaAvailability.test.ts`、`src/test/unit/blossomUploadAdapter.test.ts`、`src/test/unit/uploadImetaUtils.test.ts`、`src/test/unit/postManager.test.ts`
- 注意点: server descriptor、投稿用imeta、event kind 1063のpublishを同一機能とみなさない。NIP-94 URLはquery-sensitiveな公開CDN URLを許可するが、相対・非HTTP・userinfo・未信頼local/private URLはavailability前に拒否する。

## 読み取り専用投稿コンテンツ表示

- 機能: 投稿履歴本体、投稿履歴内の関連投稿カード、composerのreply/quote preview、composer target dialogで、本文、通常リンク、NIP-30 custom emoji、画像gallery、動画、その他mediaを同じrender modelから表示する。
- 関連NIP: 本文と通常URLはNIP-01、custom emojiはNIP-30、`imeta`はNIP-92が関係する。
- event kind: 主に`1`と`42`。composer targetは取得済みevent kindに従うが、kind 40のJSON contentは投稿本文previewとして表示しない。
- 主なtag: `emoji`、`imeta`。
- 主な実装ファイル: `src/lib/postContentPreview.ts`、`src/lib/postHistoryMediaUtils.ts`、`src/lib/postHistoryDialogUtils.ts`、`src/components/PostContentPreview.svelte`、`src/components/PostHistoryPreviewContent.svelte`、`src/components/PostHistoryMediaList.svelte`。
- 主な関数または責務: `buildPostContentRenderModel`はmedia抽出用`sourceContent`と本文segment用`displayContent`を分離し、`media`省略時だけ`content`/`tags`からdescriptorを構築する。明示された`media`は空配列も含めて正とし、保存済みMIME、Blurhash、dim、alt、size、upload protocolを維持する。表示面はprofile、日時、操作、折りたたみ、fullscreen viewer状態を所有する。
- 関連テスト: `src/test/unit/postContentPreview.test.ts`、`src/test/unit/postHistoryMediaUtils.test.ts`、`src/test/unit/postHistoryDialogUtils.test.ts`、`src/test/unit/postHistoryMediaList.test.ts`、`src/test/unit/postHistoryPreviewContent.test.ts`、`src/test/unit/replyQuotePreview.test.ts`、`src/test/unit/composerTargetDialog.test.ts`、`src/test/e2e/composerTargetDialog.spec.ts`。
- 注意点: 現在は投稿内の全画像を1galleryへ集約し、既存の抽出順、URL重複排除、1〜10枚以上のrow構成、全画像を対象にするfullscreen順を維持する。本文に存在しない`imeta`も表示対象に残すのはNIP-92の必須動作ではなく、既存eHagaki dataとの互換性維持である。

## upload認証

- 機能: NIP-96 endpoint discovery/uploadとNIP-98 Authorizationを行い、Blossomでは別の認証eventを使う。
- 関連NIP: NIP-96、NIP-98。Blossom側はBUD-11/BUD-03でありNIP-98と混同しない。
- event kind: NIP-98 `27235`、Blossom authorization `24242`、BUD-03 server list `10063`
- 主なtag: NIP-98のURL/HTTP method/payload関連tagは`nostr-tools/nip98`へ委譲する。Blossomは`expiration`、`t`、任意の`x`。BUD-03はserver `r`。
- 主な実装ファイル: `src/lib/nostrAuthService.ts`、`src/lib/signedEventResultValidator.ts`、`src/lib/sessionLiveness.ts`、`src/lib/upload/Nip96UploadAdapter.ts`、`src/lib/upload/nip96UrlPolicy.ts`、`src/lib/upload/uploadDestinationPresets.ts`、`src/lib/upload/uploadDestinationResolver.ts`、`src/lib/upload/BlossomUploadAdapter.ts`、`src/lib/upload/bud03ServerList.ts`、`src/lib/upload/uploadAdapterRegistry.ts`
- 主な関数または責務: `NostrAuthService.buildAuthHeader`は`nostr-tools/nip98.getToken`を使い、NIP-98/BUD-11 signerをoperation開始時のactive pubkeyにboundする。共通signer wrapper、Blossom adapter、BUD-03 publishはraw signer呼び出し前に比較用snapshotとsigner入力用cloneを分離し、返却eventのID・署名・template完全一致を検証する。NIP-96 adapterはcanonicalized upload URLをPOST tokenと初回fetchへ共通利用し、全NIP-96 POSTで`redirect: "error"`を指定する。初回requestのnetwork rejectionはredirect専用と断定せず、安全停止errorへ変換する。presetは固定`serverUrl`／表示nameと、実行時のdirect `resolvedUploadUrl`を分離し、resolverは安全に識別できるlegacy presetだけを永続化せずdirect URLへ解決する。明示upload originとsame-originのprocessing URLだけにGET tokenを付け、public HTTPS cross-origin processingは認証なしでpollする。discoveryはconnection test内でredirect拒否・delegation depth/loop検証を行う。`buildBlossomAuthorizationHeader`はkind 24242を構築し、Blossom custom HTTP境界は署名失敗を空AuthorizationのPUTに変換しない。BUD-03 publishも固定pubkeyとtemplate contractの検証後だけrelay送信する。
- 関連テスト: `src/test/unit/nostrAuthService.test.ts`、`src/test/unit/nip96UploadAdapter.test.ts`、`src/test/unit/uploadDestinationPresets.test.ts`、`src/test/unit/uploadDestinationResolver.test.ts`、`src/test/unit/uploadDestinationsRepository.test.ts`、`src/test/unit/blossomUploadAdapter.test.ts`、`src/test/unit/bud03ServerList.test.ts`、`src/test/unit/signedEventResultValidator.test.ts`、`src/test/unit/signedEventSessionBoundaries.integration.test.ts`、`src/test/integration/file-upload-flow.integration.test.ts`、`src/test/integration/nip96UploadRedirectPhaseB.integration.test.ts`
- 注意点: tokenをログやfixtureへ残さない。same-origin processingでは既存どおり短いpolling中に同じGET tokenを再利用し、cross-origin processingへの自動署名はしない。BUD-11のBase64 token wire formatは本作業では変更しない。preset ID、順序、既存表示nameは維持し、custom／Protocol変更済み／未知URLのdestinationを暗黙に解決しない。Blossom uploadのredirect挙動、NIP-96 discovery、processing、media URL policyを変更しない。NIP-96とBlossomの認証方式を統合しない。

## 横断的な購読・テスト境界

- 一回取得は主に`createRxBackwardReq`を使い、`emit`後に`over()`し、成功・EOSE・error・timeout・cancelで`unsubscribe()`する。
- 継続購読は`src/lib/postHistoryAuthoredPostsRealtimeService.ts`と`src/lib/postHistoryInboundInteractionsRealtimeService.ts`で`createRxForwardReq`を使う。所有hookとvisibility/account lifecycleを確認する。
- relay横断取得、retry、可視範囲repairは`src/lib/postHistoryRelayFetchService.ts`などpost history専用serviceへ分離されている。汎用化前に既存scopeを確認する。
- application codeのNostr/TypeScript変更では対象unit/component testを先に実行し、原則`npm test`と`npm run check`まで広げる。実relayへ接続するテストは追加しない。
- browser固有のcomposer targetとpost history表示は既存の`src/test/e2e/composerTargetDialog.spec.ts`、`src/test/e2e/postHistoryDialog.spec.ts`を使う。protocol-only変更のためだけにPlaywrightを追加しない。
