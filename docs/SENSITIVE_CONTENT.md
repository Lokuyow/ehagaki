# Sensitive Event Interoperability Format（実験仕様）

本書は、eHagakiから始まったSensitive eventの実験的なwire formatを公開し、他のNostr clientも同じ形式を実装して相互運用できるようにする仕様です。これは正式なNIPではなく、NIP-36を変更・置換するものでもありません。本書はkind `36`と`3636`の利用を実験的に定義しますが、これらがNostr全体で正式に割り当てられたevent kindであることは主張しません。

実装者は本書のwire formatを利用して、受信、reply、publishを段階的に追加できます。すべての機能を一度に実装する必要はありません。Sensitive eventの本文は`.content`にある平文です。この形式は暗号化や機密性を提供する仕組みではありません。

## 規範語

本書で大文字表記する`MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY`は、RFC 2119およびRFC 8174に沿った規範語です。これらの特別な意味は大文字表記の場合に限ります。規範語は本書が定めるSensitive extensionの相互運用要件にのみ適用し、参照するNIPの要件を変更するものではありません。実装製品ごとの挙動は、後半の「eHagaki reference implementation」で規範要件と分けて説明します。

## 目的とtrade-off

標準NIP-36では、eventがSensitiveであることを主に`content-warning` tagで表します。この実験形式では、Sensitiveであることをevent kindでも表します。対応clientは、optional metadata tagがあるかどうかだけに頼らず、kind `36`または`3636`を受信した時点でSensitive eventとして扱えます。

本文は特殊なtagへ移さず、通常のeventと同じ`.content`に格納します。これにより、本文の所在が一貫し、`.content`を使う既存処理との親和性が保たれます。Relayがkind `36`または`3636`を保存・indexしていれば、NIP-50の通常のcontent searchに参加できます。reply/commentはNIP-22のthread topologyを利用し、警告理由などのmetadataには標準NIP-36の`content-warning` tagを併用できます。

top-level kind `36`には、本文を含まないkind `1` compatibility companionを任意で付けられます。kind `1`だけを購読するclientにもSensitive postの存在を知らせられますが、companionは本文を含まないため、未対応clientへ本文を表示するfallbackではありません。

採用時には、次の制約も考慮してください。

- 未対応clientはkind `36` / `3636`を表示しない、または正しく解釈しない場合があります。
- Relayが未知kindを保存する保証はありません。
- NIP-50対応Relayであっても、未知kindを検索indexへ含める保証はありません。
- compatibility companionは本文を含まず、canonical eventの代わりにはなりません。
- 本文は平文です。kindによるSensitive表示はprivacy/security mechanismではありません。

## 段階的なinterop対応

### 1. Receive-only

受信だけの実装では、少なくとも次に対応できます。

- kind `36` / `3636`を受信対象に加える。
- 本文を`.content`から読む。
- `content-warning` tagがなくても、event kindに基づいてSensitiveとして扱う。
- `content-warning` reasonがあれば表示する。
- ユーザーがreveal操作をするまで本文と関連mediaを隠す。

Receive-only対応にcompanion送信やSensitive eventのpublishは必要ありません。

### 2. Replyとinteraction

次の段階では、以下を追加できます。

- kind `36` / `1111` / `3636`へのreplyでNIP-22 topologyを扱う。
- normal replyにはkind `1111`、Sensitive replyにはkind `3636`を選ぶ。
- 検証済みcompanionをcanonical eventへ解決し、新しいinteractionのtargetにはcanonicalを使う。
- quote、reaction、deletionなどのevent-targeted actionをcanonical eventへ向ける。

### 3. Publishing

送信に対応する場合は、以下を実装します。

- top-level Sensitive postにはkind `36`を使う。
- Sensitive Commentにはkind `3636`を使う。
- 本文は`.content`に格納する。
- warning metadataには標準NIP-36の`content-warning`を使う。
- top-level kind `36`にはoptionalなkind `1` compatibility companionを付けられる。

## Event kind

| Kind | 意味 |
| ---: | --- |
| `1` | 通常のShort Text Note、またはoptional compatibility companion |
| `36` | Sensitive Text Note |
| `1111` | NIP-22 Comment |
| `3636` | Sensitive Comment |
| `42` | NIP-28 Public Chat Message |

この形式に対応するreceiverは、kind `36` / `3636`を`content-warning` tagの有無にかかわらずSensitiveとして扱う `MUST`。Sensitive eventの本文は`.content`に格納する `MUST`。本文を独自tagへ移す `MUST NOT`。

## NIP-36 metadata

kind `36` / `3636`にCW metadataを付ける場合、送信clientは標準NIP-36の形式を使う `MUST`。

reasonがない場合:

```json
["content-warning"]
```

reasonがある場合:

```json
["content-warning", "reason"]
```

この実験形式の送信で、本文を第3要素へ入れる`["content-warning", "reason", "body"]`形式を使う `MUST NOT`。この旧eHagaki形式は受信互換のためだけに後述のreference implementationが扱います。

## kind 36 — Sensitive Text Note

kind `36`はSensitiveなtop-level Text Noteを表します。送信clientはevent kindを`36`にし、次のようにeventを構築する `MUST`。

- event kindは`36`。
- 本文は`.content`に格納する。
- 本文をcompatibility companionへ複製しない。

hashtag、media metadata、client metadataなど、通常のnoteに付けられるtagは追加して`MAY`。

## kind 3636 — Sensitive Comment

kind `3636`はSensitive Commentを表します。送信clientはSensitive Commentのevent kindを`3636`とし、本文を`.content`に格納し、thread topologyにNIP-22を使用する `MUST`。

root scopeにはNIP-22の大文字tag `E` / `A` / `I`を使い、root kindは`K`で示します。root authorが利用可能な場合は`P`を含めます。直接のparentには小文字tag `e` / `a` / `i`を使い、parent kindは`k`で示します。parent authorが利用可能な場合は`p`を含めます。本書はNIP-22のscopeやtag全般を再定義せず、このextensionでの利用を定めます。

たとえば、kind `36`をroot、kind `1111`を直接のparentとするreplyの参照tagは次のようになります。

```json
[
  ["E", "<root-event-id>", "<relay-hint>", "<root-author>"],
  ["K", "36"],
  ["P", "<root-author>"],
  ["e", "<parent-event-id>", "<relay-hint>", "<parent-author>"],
  ["k", "1111"],
  ["p", "<parent-author>"]
]
```

## Reply kindの選択

ここでnormal replyはSensitive reply形式を使わないreplyを指します。kind `1`へのnormal replyは、CW metadataの有無にかかわらず、既存のNIP-10形式を維持します。normal replyにCWを付ける場合は標準NIP-36 metadataを使います。Sensitive replyをこのformatで送るclientは次のmappingに従う `MUST`。

| Parent | Normal reply | Sensitive reply |
| --- | --- | --- |
| kind `1` | kind `1` / NIP-10 | kind `3636` / NIP-22 |
| kind `36` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `1111` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `3636` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |

既存のNIP-10 thread内にあるkind `1`へSensitive replyする場合、senderは既存thread rootをNIP-22 rootとして維持し、選択したkind `1` eventを直接のparentにする `MUST`。必要なrootまたはparent topologyを安全に確定できない場合、kind `1`へ暗黙にfallbackする `MUST NOT`。senderは参照情報を再取得するか、送信を中止する `SHOULD`。

## Addressable parentの`a` + `e`

NIP-22のaddressable parentでは、小文字`a`がprimary parent scopeを示し、小文字`e`がそのaddressable eventのcurrent versionを参照する形で併記される場合があります。Receiverは、この有効な`a` + `e` combinationを複数primary parentと誤認してrejectする `MUST NOT`。

この有効な組み合わせ以外に、複数のprimary scopeが曖昧に併記されたeventをreceiverはrejectして`MAY`。この形式では、有効なaddressable version pairと曖昧な複数scopeを区別します。

## Public Chat

このextensionはPublic Chat専用のSensitive kindを定義しません。CW付きPublic Chat messageはkind `42`と標準NIP-36形式を使う `MUST`。

## Compatibility companion

kind `36`のpublisherはoptionalなkind `1` compatibility companionを送って`MAY`。kind `3636`にはcompanionを作成する `MUST NOT`。

以下はcompanionのwire fieldsの例です。Nostr event envelopeの`id`、`pubkey`、`created_at`、`sig`は省略しています。`content-warning`のreasonはoptionalです。

```json
{
  "kind": 1,
  "content": "",
  "tags": [
    ["content-warning", "reason"],
    ["c", "<canonical-kind36-event-id>", "<optional-relay-hint>"]
  ]
}
```

Companionは次を満たす `MUST`。

- kindは`1`。
- `.content`は空文字列。
- canonical eventと同じpubkey。
- `content-warning` tagを1つだけ含み、標準NIP-36の形を使う。
- `c` tagを1つだけ含む。
- 上記以外のtagを含まない。

Companionにcanonical本文、hashtag、quote、media metadataなどを複製する `MUST NOT`。

`c` tagは次のいずれかです。

```json
["c", "<canonical-kind36-event-id>"]
```

```json
["c", "<canonical-kind36-event-id>", "wss://relay.example"]
```

`c` tagはこのexperimental format固有であり、標準NIPのtagではありません。relay hintはcanonical eventのdiscoveryに使える情報ですが、eventのauthenticityや取得provenanceを証明しません。

### Companion publishing lifecycle

Companionを利用するpublisherは、canonical kind `36`を先にpublishし、canonicalのpublish成功後にcompanionを送る `SHOULD`。companionのpublish失敗を理由にcanonical publishの成功をrollbackしたり、失敗扱いにしたりする `MUST NOT`。Companionは補助eventであり、canonical dataではありません。

Canonical eventにCW metadataがある場合、publisherはcanonicalとcompanionで同じtimestampとCW metadataを使う `SHOULD`。CanonicalにCW metadataがない場合、companionはoptionalなのでpublisherは省略して`MAY`。ReceiverはtimestampやCW metadataの一致をlink validationの条件にする `MUST NOT`。

### Companion candidateとlink検証

Companionのwire shapeが一致することだけでは、参照先とのlinkは証明されません。Receiverがcompatibility companion candidateとして扱うeventは、次のshapeに一致する `MUST`。

- kind `1`で、`.content`が空。
- `content-warning` tagをちょうど1つ含み、その要素数は標準NIP-36のreasonなし／ありの形である。
- `c` tagをちょうど1つ含み、tag全体はevent IDとoptional relay hintからなる。
- 上記以外のtagを含まない。

`c` tagのevent IDが有効な形式であることを確認した後、candidateをcanonical kind `36`へ解決するreceiverは、次のすべてを検証する `MUST`。ここで有効なevent IDとは、event fieldsから検証したNIP-01 event IDと一致するIDを指します。

- companion自身のevent IDが有効である。
- companionのsignatureが有効である。
- `c` reference IDとcanonical event IDが一致する。
- canonical eventのkindが`36`である。
- canonical event IDが有効である。
- canonical eventのsignatureが有効である。
- canonical eventとcompanionのpubkeyが同一である。

Link成立の条件としてcanonical側にCW tagがあること、warning reasonが一致すること、timestampが一致することをreceiverが要求する `MUST NOT`。

## Relay provenance

canonical eventの取得先を探すhint、またはそのeventについて記録するRelay evidenceとして、receiverは次を利用して`MAY`。

- `c` tagに含まれるcanonical event用relay hint。
- canonical eventを実際に返したRelay。
- canonical eventを表すlocal record自身が保持するRelay evidence。

Companionを返しただけのRelayや、companion pointer/sourceだけに由来するprovenanceをcanonical eventの取得evidenceとして扱う `MUST NOT`。同じRelayがcanonical eventも実際に返した場合、そのcanonical取得は独立したevidenceとして扱えます。`c` tagのhint自体も、取得成功やauthenticityの証明にはなりません。

## Canonical identityとinteraction

Companionを検証し、canonical kind `36`へ正常に解決したclientは、新しく生成するevent-targeted interactionにcanonical eventを使う `SHOULD`。対象にはreply、quote、reaction、deletion、event referenceなどが含まれます。

第三者clientがcompanion IDを対象として既に生成したinteractionを、receiverがcanonical eventへのinteractionとして自動的に書き換える `MUST NOT`。

Canonical eventがmissing、invalid、deleted、または取得できない場合、companionを通常kind `1` noteへ昇格して表示する `MUST NOT`。clientは「Sensitive post unavailable」などのplaceholderを表示して`MAY`。

## SearchとRelay interoperability

本文は`.content`に格納されます。NIP-50ではRelayがeventの`.content`に対してmatchingすることが`SHOULD`、他fieldを検索することが`MAY`とされています。Relayがkind `36` / `3636`を保存・indexしていれば、この本文は通常の全文検索へ参加できます。

例:

```json
{
  "kinds": [36],
  "search": "example text"
}
```

このextensionに対応するclientは、NIP-50対応Relayが必ずkind `36` / `3636`をindexする、または未知kindを自動的にindexすると仮定する `MUST NOT`。Relayごとにkind whitelistやindexing policyが異なる場合があります。この仕様は特定Relayの検索結果を保証しません。

## Deletion

Sensitive canonical eventの削除にはNIP-09 kind `5`を使用します。送信clientはcanonical event IDを`e` tagで参照し、削除対象の実際のkindを`k` tagで示す `SHOULD`。kind `36`のlogical postを削除するときは、canonical kind `36`を対象とする `SHOULD`。

Companion IDの永続alias、queue、`#c`逆引きを持たないclientでは、companionがRelay上に残る場合があります。残存companionから削除済みcanonicalを復元したり、companionを通常noteとして表示したりする `MUST NOT`。

## Quoteとrepost

Companionがcanonical eventへ解決済みの場合、quoteなどのevent referenceにはcanonicalを使う `SHOULD`。

kind `36` / `3636`はkind `1`ではありません。NIP-18 repostを実装する場合はgeneric repostのkind `16`を使う `MUST`。kind `6` repostとして扱う `MUST NOT`。

## Privacyとsecurity considerations

Sensitive eventの`.content`はplaintextです。Sensitiveはclient UI上の表示制御を表すもので、暗号化やconfidentialityを提供しません。Relay operator、raw event viewer、またはeventを取得できる未対応clientなどは本文を直接読めます。

`c` tagだけではcanonical eventのauthenticityを証明できません。Receiverはevent IDとsignatureを検証し、canonical eventとcompanionのpubkeyが一致することを確認する必要があります。同一pubkeyの確認は、別authorが作ったeventをcompanionとしてcanonicalへ結び付けるspoofingを防ぐために重要です。relay hintはtrust anchorではありません。

Sensitive表示に対応するclientは、kind `36` / `3636`の本文と関連mediaを、ユーザーの明示操作前に通常表示しない `SHOULD`。これはUI上の安全策であり、raw eventへのアクセス制御や暗号学的な機密性を意味しません。

## 最小interop要件

以下のchecklistは段階的な対応範囲を示します。すべての項目を一度に実装しなくてもreceive interoperabilityを始められます。

### Receive-only

- kind `36` / `3636`を受信する。
- 本文を`.content`から取得する。
- kindだけでもSensitiveとして扱う。
- optionalな標準NIP-36 reasonに対応する。
- reveal操作まで本文と関連mediaを隠す。

### Full interaction

Receive-only項目に加えて:

- NIP-22 reply topologyを扱う。
- kind `1111` / `3636`のreply kind選択を行う。
- companionのshapeとcanonical linkを検証して解決する。
- 新しいinteractionにcanonical targetを使う。

### Publishing

Publishingへ対応する場合は:

- top-level Sensitive postにkind `36`を使う。
- Sensitive Commentにkind `3636`を使う。
- 本文を`.content`に保持し、標準NIP-36 metadataを使う。
- optionalなkind `1` compatibility companionを送れる。

## eHagaki reference implementation

ここでは本書のprotocol要件と区別して、現時点のeHagakiの製品挙動を記載します。以下はこのprotocol全体で他clientに要求される動作ではありません。

- Sensitive形式は設定からopt-inし、標準NIP-36形式をdefaultとして維持します。
- 以前の`content-warning[2]`本文形式は受信互換として読み取り、新規送信には使いません。第3要素の有無で本文を選び、要素が空でも`.content`へfallbackしません。
- 標準`content-warning` tagを持つkind `36`のcanonical publish成功後に、本文を含まないkind `1` companionをbest-effortで送ります。durable retry queueはありません。
- kind `3636`にはcompanionを作りません。
- `#nsfw`単独ではkind `36` / `3636`へ切り替えません。
- 受信・previewの動作はSensitive送信設定に依存しません。
- repost UIは提供していません。

## 参考仕様

- [NIP-01: Basic protocol flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-09: Event deletion](https://github.com/nostr-protocol/nips/blob/master/09.md)
- [NIP-10: Text notes and threads](https://github.com/nostr-protocol/nips/blob/master/10.md)
- [NIP-18: Reposts](https://github.com/nostr-protocol/nips/blob/master/18.md)
- [NIP-22: Comments](https://github.com/nostr-protocol/nips/blob/master/22.md)
- [NIP-28: Public chat](https://github.com/nostr-protocol/nips/blob/master/28.md)
- [NIP-36: Sensitive content / Content Warning](https://github.com/nostr-protocol/nips/blob/master/36.md)
- [NIP-50: Search Capability](https://github.com/nostr-protocol/nips/blob/master/50.md)
- [RFC 2119: Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119.html)
- [RFC 8174: Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://www.rfc-editor.org/rfc/rfc8174.html)
