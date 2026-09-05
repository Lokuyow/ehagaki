---
name: ehagaki-nostr
description: "eHagakiのNostrプロトコルまたはNostrデータフローを設計・実装・レビューする際に使用する。NIP、event kind/tag、nostr-tools、rx-nostr、reply/quote/repost、NIP-19/21、relay REQ・購読・AUTH、NIP-07/46、profile、public chat、NIP-94/96/98、Blossomを対象とする。Nostrと無関係なUI、CSS、レイアウト、文言変更には使用しない。"
---

# eHagaki Nostr

eHagakiの既存境界と実装済みライブラリAPIを基準に、Nostr関連の変更を設計・実装・レビューする。

## 調査を開始する

1. 変更に関係するNIPと実際のevent kindを特定する。NIP番号だけで判断しない。
2. 対象となるtag、marker、author、relay hint、contentの意味と必須・任意条件を整理する。
3. `rg`でeHagaki内の既存builder、resolver、adapter、service、utility、caller、testを検索する。
4. `package.json`を読み、実際に使用中の`nostr-tools`、`rx-nostr`、`@rx-nostr/crypto`、関連ライブラリとバージョンを確認する。古いAPIの記憶だけで実装しない。
5. 変更領域の入口や既存テストを探す必要がある場合は、[references/implementation-map.md](references/implementation-map.md)を読む。記載と現在のコードが異なる場合は現在のコードを優先する。
6. NIPが定めるwire semantics、`nostr-tools`が担うcodec・署名補助、`rx-nostr`が担うrelay transport・Observable、`@rx-nostr/crypto`が担う検証・秘密鍵署名、eHagaki独自の状態・永続化・UI調整を区別する。

## 既存境界に沿って設計する

1. 既存のbuilder、resolver、adapter、service、utilityがある場合は再利用し、UIやcomponentからNostrライブラリを直接呼ばない。
2. eventの構築とeventの取得を同じ責務へまとめない。
3. discovery、descriptor生成、fetch、cache、renderingを必要以上に結合しない。
4. NIPの仕様とeHagaki固有の仕様を分けて記述する。UI表示からプロトコル仕様を推測しない。
5. `nostr-tools`と`rx-nostr`の責務を混同しない。
6. iframeまたはDirect Web Componentを含む場合も、event、tag、signer、relay、subscriptionのprotocol semanticsはこのSkillで扱い、browser realm、postMessage/WebSocket interception、Shadow DOM、geometry、mount/disconnect lifecycleの観測は[ehagaki-browser-debug](../ehagaki-browser-debug/SKILL.md)へ分離する。
7. 一時的な互換処理やフォールバックは、仕様、対応ブラウザ、再現ログ、既存互換契約のいずれかで必要性を示せる場合だけ追加する。
8. 曖昧さはまずuser/task context、現在のrepository、適用されるNIP・protocol仕様から解消する。それでも未解決で、event semantics、互換性、安全性などの結果を実質的に変える選択だけを、`AGENTS.md`の確認条件に従い`needs confirmation`として扱う。

## 取得と購読を検証する

1. event取得ごとに、一回取得か継続購読かを明示する。
2. `createRxBackwardReq`と`createRxForwardReq`の選択、REQ filter、relay選択、EOSEまたは完了条件、timeout、cancel、unsubscribeの所有者を確認する。
3. Observableやsubscriptionの所有者と終了条件を明確にし、component破棄、scope変更、account変更、成功、失敗、timeoutの各経路で解放する。
4. 複数relayから返る同一eventをevent IDなどの既存キーでdedupeし、同じ状態遷移・永続化・通知を重複実行しない。
5. cacheのfreshness、negative cache、invalidate、retry、同時要求の共有、stale async resultの所有権を確認する。
6. real relayに依存する不安定なテストを追加しない。REQ、packet、EOSE、error、timeoutを決定論的にmockする。

## eventとtagを検証する

1. kind、content、tagの順序と重複規則を確認する。
2. NIP-10に関係する変更ではroot、parent/reply、marker、author、relay hintを個別に確認する。
3. quote、public chat、NIP-19 pointerでは、event IDだけでなくauthor hint、kind hint、relay hintの検証とsanitize境界を確認する。
4. eventやtag構築の変更には、順序、marker、root、parent、author、relay hint、重複排除を直接検証するprotocol-focused testを追加または更新する。
5. signerが署名するkindを増やす場合は、`NIP46_REQUESTED_PERMISSIONS`と関連テストが実際の署名範囲に一致するか確認する。

## 秘密情報を保護する

1. nsec、秘密鍵、NIP-46 payload、署名要求の本文、認証tokenをログ、fixture、snapshot、screenshot、reportへ残さない。
2. 認証エラーを調査するときも、kind、件数、長さ、状態、秘密を含まない識別情報だけを記録する。
3. 署名者のpubkey、session pubkey、pointerのauthor hint、relay-bound AUTH情報の一致検証を弱めない。

## 変更とレビューを完了する

1. 最小の既存責務へ変更を置き、無関係なrefactorを混ぜない。
2. protocol semantics、subscription lifecycle、dedupe、cache、securityの観点でdiffをレビューする。
3. Nostr関連の責務、主要ファイル、event kind、tag semantics、対応NIP、関連テストを変更した場合は、`references/implementation-map.md`を同じ変更内で更新する。
4. 共通の必須検証、検証を追加・反復する条件、結果の報告は`AGENTS.md`のVerificationに従う。
5. URLクエリ、iframe、ダイアログ操作、アカウント切替、IndexedDBを含むブラウザ内フローは、下位レベルのテストでは受け入れ条件を証明できない場合にPlaywrightで検証する。
6. protocol semanticsだけの変更にはPlaywrightを追加せず、unit testまたはcomponent testで検証する。
