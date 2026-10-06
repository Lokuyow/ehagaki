# Sensitive Event形式（実験的仕様）

本書は、kind `36` / `3636`を用いた実験的なSensitive Event相互運用形式を定義します。正式なNIPではなく、NIP-36を置き換えるものでもありません。本文は平文で`.content`に格納されます。

## 規範語

`MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY`はRFC 2119 / RFC 8174に沿う規範語です。本書では大文字表記の場合に限り、ここで定める相互運用要件を示します。

## Event kinds

| Kind | 意味 |
| ---: | --- |
| `1` | Short Text Note / compatibility companion |
| `36` | Sensitive Text Note |
| `1111` | NIP-22 Comment |
| `3636` | Sensitive Comment |
| `42` | NIP-28 Public Chat Message |

kind `36`はNIP-01のregular kindの範囲`4 <= kind < 45`、kind `3636`は`1000 <= kind < 10000`に含まれます。この範囲はNIP-01が定めるRelayの保存上のconventionです。Relayが未知kindを必ず受理・保存するとは限りません。

## Sensitive eventの共通ルール

receiverは、kind `36` / `3636`を`content-warning` tagの有無にかかわらずSensitiveとして扱わなければなりません（MUST）。

本文は`.content`に格納しなければなりません（MUST）。本文を独自tagへ移してはなりません（MUST NOT）。

CW metadataを付ける場合は、標準NIP-36形式を使わなければなりません（MUST）。

Sensitiveなtop-level Text Noteはkind `36`、Sensitive Commentはkind `3636`で送信しなければなりません（MUST）。kind `3636`にはNIP-22のtopologyを使います。

```json
["content-warning"]
```

```json
["content-warning", "reason"]
```

新規senderは、旧形式`["content-warning", "reason", "body"]`を送信してはなりません（MUST NOT）。受信互換については「eHagaki reference implementation」を参照してください。

### Public Chat

CW付きPublic Chatにはkind `42`と標準NIP-36形式を使わなければなりません（MUST）。このextensionではPublic Chat専用のSensitive kindを定義しません。

## Reply mapping / NIP-22

| Parent | Normal reply | Sensitive reply |
| --- | --- | --- |
| kind `1` | kind `1` / NIP-10 | kind `3636` / NIP-22 |
| kind `36` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `1111` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `3636` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |

Sensitive replyを送信するclientは、このmappingに従わなければなりません（MUST）。kind `1`へのnormal replyは、CWの有無にかかわらずNIP-10を維持します。

既存のNIP-10 thread内にあるkind `1`へSensitive replyする場合、senderは既存rootをNIP-22 rootとして維持しなければなりません（MUST）。選択したkind `1` eventをdirect parentにしなければなりません（MUST）。必要なtopologyを確定できない場合、kind `1`へ暗黙にfallbackしてはなりません（MUST NOT）。senderは参照情報を再取得するか、送信を中止すべきです（SHOULD）。

NIP-22では、rootを`E` / `A` / `I`で示し、`K`でkindを指定します。authorが分かる場合は`P`を含めます。direct parentは`e` / `a` / `i`で示し、`k`でkindを指定します。authorが分かる場合は`p`を含めます。有効なaddressable parentを示すlowercase `a`とcurrent-version `e`の併記を、receiverは複数のprimary parentとして拒否してはなりません（MUST NOT）。

例（kind `36` root、kind `1111` direct parent）:

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

## Compatibility companion

top-level kind `36`のpublisherは、任意のkind `1` compatibility companionを送信してもよい（MAY）。kind `3636`にはcompanionを作成してはなりません（MUST NOT）。

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

companionはkind `1`、空の`.content`、canonicalと同一のpubkey、標準形の`content-warning` tagを1つ、`c` tagを1つだけ持ち、その他のtagを含めてはなりません（MUST）。canonical本文、hashtag、quote、media metadata等を複製してはなりません（MUST NOT）。CW reasonは省略できます。

`c` tag keyはこのextension専用ではなく、NIP-34等でも別の意味で使われます。このextensionでは、上記のshapeを持つkind `1` companionの`c`値をcanonical kind `36` event IDへの参照として定義します。receiverは`c` tagだけを根拠にcompanionと判定してはなりません（MUST NOT）。

```json
["c", "<canonical-kind36-event-id>"]
```

```json
["c", "<canonical-kind36-event-id>", "wss://relay.example"]
```

companionを使うpublisherは、canonical kind `36`を先にpublishし、その成功後にcompanionを送信すべきです（SHOULD）。companionの送信失敗を理由にcanonicalの成功を取り消したり、失敗扱いにしたりしてはなりません（MUST NOT）。canonicalにCW metadataがある場合、publisherはcanonicalとcompanionで同じtimestamp / CW metadataを使うべきです（SHOULD）。CW metadataがない場合、publisherはcompanionを省略してもかまいません（MAY）。receiverは、timestampの一致、canonical側のCW tagの有無、reasonの一致をlink validationの条件にしてはなりません（MUST NOT）。

## Companion validation / canonical identity

candidateはkind `1`で、空の`.content`、標準形の`content-warning` tagを1つ、`c` tagを1つだけ持ち、その他のtagを含まないものです。candidateをcanonicalへ解決するreceiverは、次の項目を検証しなければなりません（MUST）。

- companionのevent IDとsignatureが有効であること。
- `c` reference IDとcanonical event IDが一致すること。
- canonicalのkindが`36`であり、event IDとsignatureが有効であること。
- canonicalとcompanionのpubkeyが同一であること。

canonical側のCW tagの有無、reasonの一致、timestampの一致は、link validationの必須条件ではありません。

検証済みcompanionをcanonicalへ解決したclientは、新たなreply、quote、reaction、deletion等のevent-targeted interactionでcanonicalを対象にすべきです（SHOULD）。既存のthird-party interactionがcompanion IDを参照している場合、それをcanonical向けに自動変換してはなりません（MUST NOT）。canonicalが見つからない、無効、削除済み、または取得できない場合、companionを通常のkind `1` noteへ昇格・表示してはなりません（MUST NOT）。

## Relay provenance / search

receiverは、次の情報をcanonicalのrelay hintまたはRelay evidenceとして利用してもよい（MAY）。

- `c` tagに含まれるrelay hint。
- canonicalを実際に返したRelay。
- canonicalのlocal record自身が保持するRelay evidence。

companionを返しただけのRelayや、companion pointer / sourceだけに由来する情報をcanonicalのprovenanceとして扱ってはなりません（MUST NOT）。relay hintは取得成功や真正性を証明するものではありません。

本文は`.content`に格納されます。NIP-50では、Relayは`.content`を検索対象とすべきとされ、他のfieldを検索対象にしてもよいとされています。Relayがkind `36` / `3636`を保存・indexしていれば、本文は通常の検索対象になります。ただし、NIP-50対応Relayが両kindをindexする保証はありません。clientは必ず検索できると仮定してはなりません（MUST NOT）。kind whitelist等はRelayの実装方針に依存します。

## Deletion / repost

削除にはNIP-09 kind `5`を使います。senderはcanonical event IDを`e`、実際のkindを`k`で示すべきです（SHOULD）。論理上の投稿を削除する場合はcanonicalを対象にすべきです（SHOULD）。Relayに残ったcompanionから削除済みcanonicalを復元したり、companionを通常noteとして表示したりしてはなりません（MUST NOT）。

kind `36` / `3636`をrepostする場合、NIP-18 generic repost kind `16`を使わなければなりません（MUST）。kind `6`として扱ってはなりません（MUST NOT）。

## Security

`.content`は平文です。SensitiveはUI上の表示制御であり、暗号化や秘匿を行うものではありません。raw eventを取得できれば本文を読めます。`c` tagだけではcanonicalの真正性を証明できません。event ID、signature、同一pubkeyを検証してください。relay hintは信頼の根拠ではありません。

Sensitiveに対応するclientは、ユーザーが表示を許可するまでkind `36` / `3636`の本文と関連mediaを通常表示すべきではありません（SHOULD NOT）。

## 実装レベル

### Receive-only

- kind `36` / `3636`を受信し、本文を`.content`から読む。
- kindに基づいてSensitive表示し、任意のNIP-36 reasonを扱う。

### Interaction

Receive-onlyに加えて、NIP-22、kind `1111` / `3636`のreply選択、companion解決、canonicalを対象にしたactionに対応します。

### Publishing

kind `36` / `3636`、標準NIP-36 metadata、任意のkind `1` companionを送信します。

## eHagaki reference implementation

以下はeHagaki固有の挙動であり、上記のprotocol要件ではありません。

- Sensitive形式はopt-inで、標準NIP-36形式が既定です。
- legacy `content-warning[2]`本文形式は受信互換のみで、新規送信には使いません。
- top-level kind `36`の成功後にcompanionをbest-effortで送信します。永続的なretry queueはありません。
- kind `3636`にはcompanionを付けません。
- `#nsfw`だけではSensitive kindへ切り替えません。
- 受信挙動は設定に依存せず、repost UIはありません。

## References

- [NIP-01: Basic protocol flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-09: Event deletion](https://github.com/nostr-protocol/nips/blob/master/09.md)
- [NIP-10: Text notes and threads](https://github.com/nostr-protocol/nips/blob/master/10.md)
- [NIP-18: Reposts](https://github.com/nostr-protocol/nips/blob/master/18.md)
- [NIP-22: Comments](https://github.com/nostr-protocol/nips/blob/master/22.md)
- [NIP-28: Public chat](https://github.com/nostr-protocol/nips/blob/master/28.md)
- [NIP-34: Git stuff](https://github.com/nostr-protocol/nips/blob/master/34.md)
- [NIP-36: Sensitive content / Content Warning](https://github.com/nostr-protocol/nips/blob/master/36.md)
- [NIP-50: Search Capability](https://github.com/nostr-protocol/nips/blob/master/50.md)
- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html) / [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174.html)
