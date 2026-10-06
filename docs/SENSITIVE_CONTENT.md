# Sensitive Event形式（実験的仕様）

本書は、kind `36` / `3636`を用いた実験的なSensitive Event形式を定義します。正式なNIPではなく、NIP-36を置き換えるものではありません。本文は平文で`.content`に格納されます。

`MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY`はRFC 2119 / RFC 8174の意味で使用します。

## Event kinds

| Kind | 意味 |
| ---: | --- |
| `1` | Short Text Note / compatibility companion |
| `36` | Sensitive Text Note |
| `1111` | NIP-22 Comment |
| `3636` | Sensitive Comment |

kind `36` / `3636`はいずれもNIP-01のregular eventです（kind `36`: `4 <= kind < 45`、kind `3636`: `1000 <= kind < 10000`）。ただし、各Relayによる未知kindの受理、保存、indexは保証されません。

## Events

receiverはkind `36` / `3636`をCW tagの有無にかかわらずSensitiveとして扱わなければなりません（MUST）。本文は`.content`に格納しなければならず（MUST）、独自tagへ移してはなりません（MUST NOT）。

CW metadataを付ける場合は標準NIP-36形式を使わなければなりません（MUST）。reasonがない場合:

```json
["content-warning"]
```

reasonがある場合:

```json
["content-warning", "reason"]
```

Sensitive Text Noteにはkind `36`を、Sensitive Commentにはkind `3636`を使わなければなりません（MUST）。kind `3636`はNIP-22 topologyを使わなければなりません（MUST）。

## Replies

| Parent | Normal reply | Sensitive reply |
| --- | --- | --- |
| kind `1` | kind `1` / NIP-10 | kind `3636` / NIP-22 |
| kind `36` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `1111` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `3636` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |

Sensitive reply senderはこのmappingに従わなければなりません（MUST）。kind `1`へのnormal replyはNIP-10を維持します。NIP-10 thread内のkind `1`へSensitive replyする場合、既存rootをNIP-22 rootとして維持し、選択eventをdirect parentにしなければなりません（MUST）。必要なtopologyを確定できない場合、kind `1`へ暗黙にfallbackしてはならず（MUST NOT）、参照情報を再取得するか送信を中止すべきです（SHOULD）。

addressable parentの有効なlowercase `a` + current-version `e`併記を、複数primary parentとして拒否してはなりません（MUST NOT）。

## Compatibility companion

top-level kind `36`のpublisherはkind `1` companionを送信してもよく（MAY）。kind `3636`にはcompanionを作成してはなりません（MUST NOT）。companionはkind `1`、空の`.content`、canonicalと同一pubkey、標準形の`content-warning`を1つ、`c`を1つだけ持たなければなりません（MUST）。

その他のtagを含めてはなりません（MUST NOT）。canonical本文、hashtag、quote、media metadata等を複製してはなりません（MUST NOT）。

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

`c` tag keyはNIP-34等でも別の意味で使われます。このcompanion shapeではcanonical kind `36` event IDを示します。`c` tagは`["c", "<canonical-kind36-event-id>"]`または`["c", "<canonical-kind36-event-id>", "<relay-hint>"]`のいずれかでなければなりません（MUST）。第2要素はcanonical event ID、第3要素は任意のrelay hintであり、これ以上の要素は定義しません。receiverは`c` tagだけでcompanionと判定してはなりません（MUST NOT）。

publisherはcanonical kind `36`を先に送信し、成功後にcompanionを送るべきです（SHOULD）。companionの送信失敗でcanonicalを失敗扱いにしてはなりません（MUST NOT）。canonicalにCW metadataがある場合、両eventで同じtimestamp / CW metadataを使うべきです（SHOULD）。canonicalにCW metadataがない場合、companionを省略してもよい（MAY）。

candidateはkind `1`、空の`.content`、標準形の`content-warning`を1つ、上記のvalid shapeに合う`c`を1つだけ持ち、その他のtagを含まないeventです。receiverはcompanionとcanonicalのevent ID / signature、`c` referenceとcanonical IDの一致、canonical kind `36`、両eventの同一pubkeyを検証しなければなりません（MUST）。timestamp、canonical側CW metadata、reasonの一致を検証条件にしてはなりません（MUST NOT）。

解決後の新しいreply、quote、reaction、deletion、event referenceはcanonicalを対象にすべきです（SHOULD）。既存のthird-party interactionをcanonical向けに書き換えてはならず（MUST NOT）、canonicalが見つからない、無効、削除済み、または取得できない場合、companionを通常のkind `1`として表示してはなりません（MUST NOT）。

canonicalの取得hintには`c` relay hintを利用してもよい（MAY）。Relay evidenceには、canonicalを実際に返したRelayまたはcanonical local record自身のevidenceを利用してもよい（MAY）。companionを返しただけのRelayをcanonical provenanceとして扱ってはなりません（MUST NOT）。

## Other interactions

本文は`.content`に格納されます。Relayがkind `36` / `3636`を保存・indexすればNIP-50検索の対象になりますが、clientはNIP-50対応Relayが両kindを必ずindexすると仮定してはなりません（MUST NOT）。

削除にはNIP-09 kind `5`を使い、canonical IDを`e`、実際のkindを`k`で参照すべきです（SHOULD）。論理上の投稿はcanonicalを対象に削除すべきです（SHOULD）。残存companionを通常noteとして表示してはなりません（MUST NOT）。

kind `36` / `3636`のrepostにはNIP-18 kind `16`を使わなければならず（MUST）、kind `6`として扱ってはなりません（MUST NOT）。

## Security

`.content`は平文です。SensitiveはUI上の表示制御であり、暗号化ではありません。`c` tagだけではcanonicalの真正性を証明できないため、event ID、signature、同一pubkeyを検証します。relay hintは信頼の根拠ではありません。Sensitive対応clientは、ユーザーが表示を許可するまで本文と関連mediaを通常表示すべきではありません（SHOULD NOT）。

## References

- [NIP-01: Basic protocol flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-09: Event deletion](https://github.com/nostr-protocol/nips/blob/master/09.md)
- [NIP-10: Text notes and threads](https://github.com/nostr-protocol/nips/blob/master/10.md)
- [NIP-18: Reposts](https://github.com/nostr-protocol/nips/blob/master/18.md)
- [NIP-22: Comments](https://github.com/nostr-protocol/nips/blob/master/22.md)
- [NIP-34: Git stuff](https://github.com/nostr-protocol/nips/blob/master/34.md)
- [NIP-36: Sensitive content / Content Warning](https://github.com/nostr-protocol/nips/blob/master/36.md)
- [NIP-50: Search Capability](https://github.com/nostr-protocol/nips/blob/master/50.md)
- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html) / [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174.html)
