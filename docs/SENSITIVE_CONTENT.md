# Sensitive Event形式（実験的仕様）

本書はkind `36` / `3636`を用いた実験的なSensitive Event相互運用形式を定義します。正式なNIPではなく、NIP-36を置き換えるものではありません。本文はplaintextの`.content`に格納されます。

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

kind `36`はNIP-01のregular kind範囲`4 <= kind < 45`、kind `3636`は`1000 <= kind < 10000`に含まれます。未知kindをRelayが受理・保存する保証はありません。

## Sensitive eventの共通ルール

receiverはkind `36` / `3636`を`content-warning` tagの有無にかかわらずSensitiveとして扱う `MUST`。本文は`.content`に格納する `MUST`。本文を独自tagへ移す `MUST NOT`。CW metadataを付ける場合は標準NIP-36形式を使う `MUST`。

Sensitiveなtop-level Text Noteはkind `36`、Sensitive Commentはkind `3636`で送る `MUST`。kind `3636`はNIP-22 topologyを使います。

```json
["content-warning"]
```

```json
["content-warning", "reason"]
```

新規senderは旧形式`["content-warning", "reason", "body"]`を送る `MUST NOT`。その受信互換は「eHagaki reference implementation」に記載します。

### Public Chat

CW付きPublic Chatはkind `42`と標準NIP-36形式を使う `MUST`。このextensionはPublic Chat専用Sensitive kindを定義しません。

## Reply mapping / NIP-22

| Parent | Normal reply | Sensitive reply |
| --- | --- | --- |
| kind `1` | kind `1` / NIP-10 | kind `3636` / NIP-22 |
| kind `36` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `1111` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `3636` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |

Sensitive reply senderはこのmappingに従う `MUST`。kind `1`へのnormal replyはCWの有無にかかわらずNIP-10を維持します。

既存NIP-10 thread内のkind `1`へSensitive replyする場合、senderは既存rootをNIP-22 rootとして維持し、選択したkind `1` eventをdirect parentとする `MUST`。topologyを確定できない場合にkind `1`へsilent fallbackする `MUST NOT`。senderは参照情報を再取得するか送信を中止する `SHOULD`。

NIP-22ではrootに`E` / `A` / `I`と`K`を使い、authorが分かる場合は`P`を含めます。direct parentには`e` / `a` / `i`と`k`を使い、authorが分かる場合は`p`を含めます。addressable parentの有効なlowercase `a` + current-version `e`併記を、receiverは複数primary parentとしてrejectする `MUST NOT`。

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

top-level kind `36` publisherはoptionalなkind `1` compatibility companionを送って`MAY`。kind `3636`にはcompanionを作成する `MUST NOT`。

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

companionはkind `1`、空の`.content`、canonicalと同一pubkey、ちょうど1つの標準形`content-warning` tagと1つの`c` tagで構成し、その他のtagを含めない `MUST`。canonical本文、hashtag、quote、media metadata等を複製する `MUST NOT`。CW reasonは省略できます。

`c` tag keyはこのextension専用ではなく、NIP-34等でも別の意味で使われます。このextensionでは、上記shapeのkind `1` companionに限り、`c`の値をcanonical kind `36` event IDとして扱います。receiverは`c` tag単独でcompanionと判定する `MUST NOT`。

```json
["c", "<canonical-kind36-event-id>"]
```

```json
["c", "<canonical-kind36-event-id>", "wss://relay.example"]
```

companionを使うpublisherはcanonical kind `36`を先にpublishし、成功後にcompanionを送る `SHOULD`。companionの失敗でcanonicalの成功をrollbackまたは失敗扱いにする `MUST NOT`。canonicalにCW metadataがある場合、canonicalとcompanionは同じtimestamp / CW metadataを使う `SHOULD`。CW metadataがない場合、publisherはcompanionを省略して`MAY`。receiverはtimestamp一致、canonical側CW tagの存在、reason一致をlink validation条件にする `MUST NOT`。

## Companion validation / canonical identity

candidateはkind `1`、空の`.content`、ちょうど1つの標準形`content-warning` tag、ちょうど1つの`c` tagを持ち、その他のtagを含まないものです。canonicalへ解決するreceiverは次を検証する `MUST`:

- companionのevent IDとsignatureが有効である。
- `c` reference IDがcanonical event IDと一致する。
- canonical kindが`36`で、event IDとsignatureが有効である。
- canonicalとcompanionのpubkeyが同一である。

canonical側のCW tag、reason一致、timestamp一致は必須条件ではありません。

解決済みcompanionを扱うclientは、新しいreply、quote、reaction、deletion等のevent-targeted interactionにcanonicalを使う `SHOULD`。既存のthird-party interactionがcompanion IDを参照していても、自動でcanonical向けに書き換える `MUST NOT`。canonicalがmissing、invalid、deleted、または取得不能の場合、companionを通常kind `1` noteへ昇格・表示する `MUST NOT`。

## Relay provenance / search

canonicalのhintまたはRelay evidenceには、`c` tagのrelay hint、canonicalを実際に返したRelay、canonicalのlocal record自身が持つRelay evidenceを利用して`MAY`。companionを返しただけのRelayやcompanion pointer/source由来の情報を、canonicalのprovenanceとして扱う `MUST NOT`。relay hintは取得成功やauthenticityの証明ではありません。

本文は`.content`にあります。NIP-50ではRelayが`.content`にmatchingすることが`SHOULD`、他fieldの検索は`MAY`です。kind `36` / `3636`をRelayが保存・indexすれば通常検索できますが、NIP-50対応Relayが両kindをindexする保証はありません。clientは必ず検索可能と仮定する `MUST NOT`。kind whitelist等はRelay実装に依存します。

## Deletion / repost

削除にはNIP-09 kind `5`を使い、canonical event IDを`e`、実際のkindを`k`で参照する `SHOULD`。logical postの削除対象はcanonicalとする `SHOULD`。companionはRelay上に残る場合があります。残存companionから削除済みcanonicalを復元したり、companionを通常noteとして表示したりする `MUST NOT`。

kind `36` / `3636`のrepostにはNIP-18 generic repost kind `16`を使う `MUST`。kind `6`として扱う `MUST NOT`。

## Security

`.content`はplaintextです。SensitiveはUI上の表示制御であり、暗号化・秘匿ではありません。raw eventを取得できれば本文を読めます。`c` tagだけではcanonical authenticityを証明しません。event ID、signature、同一pubkeyを検証してください。relay hintはtrust anchorではありません。

Sensitive対応clientは、ユーザーがrevealするまでkind `36` / `3636`の本文と関連mediaを通常表示しない `SHOULD`。

## 実装レベル

### Receive-only

- kind `36` / `3636`を受信し、本文を`.content`から読む。
- kindに基づいてSensitive表示し、optionalなNIP-36 reasonを扱う。

### Interaction

Receive-onlyに加えて、NIP-22、kind `1111` / `3636`のreply選択、companion解決、canonical-target actionに対応します。

### Publishing

kind `36` / `3636`、標準NIP-36 metadata、optionalなkind `1` companionを送信します。

## eHagaki reference implementation

以下はeHagaki固有の挙動であり、上記protocol要件ではありません。

- Sensitive形式はopt-inで、標準NIP-36形式がdefaultです。
- legacy `content-warning[2]` body形式は受信互換のみで、新規送信しません。
- top-level kind `36`の成功後にcompanionをbest-effort送信します。durable retry queueはありません。
- kind `3636`にcompanionはありません。
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
