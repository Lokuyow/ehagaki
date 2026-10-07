# Sensitive Content Payload形式（実験的仕様）

本書は、eHagaki独自の実験的なSensitive Content Payload形式を定義します。正式なNIPではなく、NIP-36を変更・置換するものでもありません。

本文中の **MUST**、**MUST NOT**、**SHOULD**、**SHOULD NOT**、**MAY** は相互運用上の要件を示します。

設計の背景と検討内容は [Sensitive Content Payload方式 設計メモ](SENSITIVE_CONTENT_PAYLOAD_DESIGN.md) を参照してください。

## Motivation

NIP-36ではSensitive本文を通常eventの`.content`に保持したまま`content-warning` tagで表示制御します。そのため、NIP-36を解釈しないclientではSensitive本文が通常本文として表示される場合があります。

本形式では、元eventのkind・identity・topology・metadataを維持したまま、Sensitive本文だけをkind `36`の別eventへ分離します。

本形式は暗号化やconfidentiality mechanismではありません。kind `36` payloadの`.content`はplaintextであり、payloadを取得できるrelayやclientは本文を読めます。

## Event model

1つのSensitive投稿は、**Structure event**と**Sensitive payload**の2eventで表します。

### Structure event

Structure eventは投稿のcanonical eventです。

WriterはStructureについて、以下を満たさなければなりません（MUST）。

- kindはSensitive化前の元event kindを維持する
- `.content`は空文字列`""`にする
- 標準NIP-36の`content-warning` tagを持たせる
- Sensitive payloadを参照する`c` tagをちょうど1つ持たせる
- thread、reply、quote、hashtag、custom emoji、media metadata、client metadata等、元eventの通常tagはStructure側に保持する

初期仕様で対応するStructure kindは次の3つだけです。

- kind `1`
- kind `42`
- kind `1111`

Sensitive化を理由にevent kindを変更してはなりません（MUST NOT）。例えばkind `1`のNIP-10 replyはSensitive化後もkind `1`のままです。

`c` tagは次の形式です。

```json
["c", "<payload-event-id>", "<optional-relay-hint>"]
```

`c[1]`はpayload event IDです。`c[2]`にはoptional relay hintを指定できます。

Writerは可能であれば、実際にpayloadをacceptしたrelayの1つを`c[2]`へ入れるべきです（SHOULD）。Readerはrelay hintをauthenticityの証明として扱ってはなりません（MUST NOT）。

### Sensitive payload

Sensitive payloadは本文だけを保持するkind `36` eventです。

Writerが生成するpayloadは次を満たさなければなりません（MUST）。

- `kind`は`36`
- `.content`にSensitive本文を格納する
- Structureと同じpubkeyで署名する
- `k` tagをちょうど1つ持たせる
- `k`の値はStructure kindの10進文字列表現にする

```json
{
  "kind": 36,
  "content": "Sensitive本文",
  "tags": [["k", "1"]]
}
```

WriterはpayloadへStructure側のmetadata tagを複製すべきではありません（SHOULD NOT）。

Readerは将来拡張のため、payloadに未知の追加tagが存在するという理由だけでpayloadを拒否すべきではありません（SHOULD NOT）。ただし`k` tagの個数と値は必ず検証しなければなりません（MUST）。

## Detection and NIP-36 precedence

Readerはeventを本形式のStructure候補として扱う前に、以下をすべて満たすことを確認しなければなりません（MUST）。

- kindが`1`、`42`、`1111`のいずれか
- `content-warning` tagが存在する
- `.content === ""`
- 有効なevent IDを値に持つ`c` tagがちょうど1つ存在する

`content-warning` tagがあっても`.content`が空でない場合、Readerは通常のNIP-36 eventとして扱わなければなりません（MUST）。その場合、`c` tagが存在しても本形式のpayload取得を開始してはなりません（MUST NOT）。

`c` tagだけを根拠に本形式またはStructure/payload associationを成立させてはなりません（MUST NOT）。

## Payload validation

Readerはpayload本文をStructureの本文として使用する前に、少なくとも以下をすべて検証しなければなりません（MUST）。

- Structure eventのIDとsignatureが有効である
- Structureの`c` tagがちょうど1つである
- `c[1]`が有効なevent IDである
- 取得したpayloadのIDが`c[1]`と一致する
- payload eventのIDとsignatureが有効である
- `payload.kind === 36`
- `payload.pubkey === structure.pubkey`
- payloadの`k` tagがちょうど1つである
- `payload.k === String(structure.kind)`

timestamp、CW reasonの一致、payload取得元relayはassociation条件ではありません。

payloadを取得できない場合、またはvalidationに失敗した場合、Readerはfail closedしなければなりません（MUST）。未検証payloadの本文、Structureの空`.content`、その他の代替本文へfallbackしてSensitive本文を表示してはなりません（MUST NOT）。

## Canonical identity and rendering

Structure eventをcanonical postとして扱わなければなりません（MUST）。

以下はStructure eventを対象にします。

- permalink / event identity
- thread topology
- reply target
- quote target
- reaction
- repost
- zap
- post history上の投稿identity
- その他の通常のevent-targeted operation

payloadを取得・表示しても、client内部の投稿identityをkind `36`へ置き換えてはなりません（MUST NOT）。

Sensitive-aware clientは検証済みpayloadを表示するとき、次の組合せを使わなければなりません（MUST）。

```text
identity / topology / metadata = Structure event
表示本文                       = verified payload.content
本文描画に使うtags              = Structure event.tags
```

したがって、`q`、`p`、`e`、`t`、`emoji`、`imeta`、`client`等はStructure側のものを使用します。

`imeta`をpayload本文内media URLへ適用する場合、それは通常のNIP-92同一event関係ではなく、本実験形式固有のcross-event interpretationです。

## Replies and topology

Sensitive化しても既存のreply topologyを維持しなければなりません（MUST）。

| 投稿種別 | Structure kind / topology |
| --- | --- |
| kind `1`投稿・NIP-10 reply | kind `1` / NIP-10 |
| Public Chat | kind `42` / NIP-28 |
| NIP-22 Comment | kind `1111` / NIP-22 |

kind `1` replyをSensitive化したことだけを理由にkind `1111`へ変換してはなりません（MUST NOT）。

## Publishing

2eventをrelayへatomicにpublishすることはできないため、WriterはpayloadをStructureより先にpublishしなければなりません（MUST）。

推奨される送信順序は次のとおりです。

1. Sensitive化前の元event内容・tags・target状態を確定する
2. kind `36` payloadを構築・署名する
3. payloadをwrite relayへpublishする
4. 少なくとも1 relayがpayloadをacceptしたことを確認する
5. payload IDとrelay hintを使ってStructureを構築・署名する
6. payloadをacceptしたrelay群へStructureをpublishする
7. 少なくとも1 relayがStructureをacceptしたら投稿成功とする

payloadが1 relayにもacceptされなかった場合、WriterはStructureをpublishしてはなりません（MUST NOT）。

payload publish後にStructureの署名またはpublishが失敗した場合、Writerは投稿全体を成功扱いにしてはなりません（MUST NOT）。すでにpublish済みのpayloadをtransaction rollbackの代わりに自動kind `5`で削除すべきではありません（SHOULD NOT）。

## Subscription and retrieval

ReaderはStructure kindの通常subscriptionをそのまま使用できます。

```json
{"kinds":[1]}
{"kinds":[42]}
{"kinds":[1111]}
```

kind `36`の常時subscription、`#k`によるdirect discovery、`#c` reverse lookupは本形式の必須要件ではありません。

ReaderはStructureを取得し、CWをrevealする等payload本文が必要になった時点で`c[1]`のevent IDを取得してもよいです（MAY）。payload取得候補には`c` relay hint、Structureを実際に取得したrelay、既知のlocal relay evidence等を利用できます（MAY）。

## NIP-36 compatibility

通常のNIP-36 eventでは`.content`をCW本文として扱います。

eHagakiの旧`content-warning[2]`本文形式は受信互換として解釈してもよいですが（MAY）、新規Writerはこの形式を生成してはなりません（MUST NOT）。

PR #284内で先に試された次の未release形式は本仕様には含まれません。

- kind `36`をcanonical Sensitive Text Noteとする方式
- kind `3636`をSensitive Commentとする方式
- kind `36`を指す空content kind `1` companion
- Sensitive化を理由にkind `1` replyをkind `3636`へ変換する方式

実装はこれらのbranch-local旧方式を互換対象として扱う必要はありません。

## Deletion

通常のevent-targeted operationはStructureを対象にしますが、削除ではSensitive本文を持つpayloadも対象にするべきです（SHOULD）。

Structureとpayloadが同一authorの検証済みpairである場合、1つのNIP-09 kind `5` eventからStructureとpayloadの両方を参照できます。

payloadを取得・検証できない場合、未検証のpayload IDを同一authorのeventと仮定して削除対象へ追加してはなりません（MUST NOT）。

NIP-09 deletion requestはrelayやclientからの物理削除を保証しません。

## Search

payload本文はkind `36` eventの`.content`にあるため、relayがkind `36`をindexする場合はNIP-50等の全文検索対象になり得ます。

Relayがkind `36`を検索indexへ含めることは本仕様では保証しません。

Structure本文は空であるため、Structure kindだけを対象とした通常の全文検索でSensitive本文が見つかることを期待してはなりません（MUST NOT）。

## Security and privacy

本形式は暗号化を提供しません。

Sensitive本文を秘密情報として扱ってはなりません（MUST NOT）。payloadを取得できるrelay、client、observerはplaintext本文を読むことができます。

Readerは`c` relay hintやpayload取得元relayを、Structure/payload associationの真正性根拠として扱ってはなりません（MUST NOT）。associationはevent ID、signature、kind、pubkey、`k` tagの検証によって成立させなければなりません（MUST）。

## Example

kind `1` Structure:

```json
{
  "kind": 1,
  "content": "",
  "tags": [
    ["t", "cats"],
    ["content-warning", "reason"],
    ["c", "<payload-id>", "wss://relay.example.com"]
  ]
}
```

Sensitive payload:

```json
{
  "kind": 36,
  "content": "Sensitive本文",
  "tags": [
    ["k", "1"]
  ]
}
```

## References

- NIP-01 — Basic protocol flow description
- NIP-09 — Event Deletion Request
- NIP-10 — Text Notes and Threads
- NIP-18 — Reposts / Quote Reposts
- NIP-22 — Comment
- NIP-28 — Public Chat
- NIP-30 — Custom Emoji
- NIP-36 — Sensitive Content / Content Warning
- NIP-50 — Search Capability
- NIP-92 — Media Attachments Metadata
