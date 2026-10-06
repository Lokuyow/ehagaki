# Sensitive Event形式（実験的仕様）

本書は、kind `36` / `3636`を用いた実験的なSensitive Event形式を定義します。正式なNIPではなく、NIP-36を置き換えるものではありません。本文は平文で`.content`に格納されます。

`MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY`はRFC 2119 / RFC 8174の意味で使用します。

## Motivation

NIP-36は通常のevent kindの`.content`に本文を平文で保持し、`content-warning` tagでSensitiveであることを示します。そのため、CWを解釈しないclientでは本文が通常の投稿として表示される場合があります。この形式はkind `36` / `3636`でもSensitiveを示すため、対応clientは本文を描画する前にkindで識別・filterできます。本文は通常どおり`.content`に保持でき、任意のkind `1` companionで本文を複製せずkind `1`購読clientへSensitive eventの存在を知らせられます。

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

top-level kind `36`のpublisherはkind `1` companionを送信してもよい（MAY）。kind `3636`には作成してはならない（MUST NOT）。companionはkind `1`、空の`.content`、canonicalと同一pubkey、標準形の`content-warning`を1つ、規定形式の`c`を1つだけ持たなければなりません（MUST）。その他のtagを含めてはなりません（MUST NOT）。canonical本文、hashtag、quote、media metadata等を複製してはなりません（MUST NOT）。

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

`c` tag keyはNIP-34等でも別の意味で使われます。このcompanionの`c` tagは`["c", "<canonical-kind36-event-id>"]`または`["c", "<canonical-kind36-event-id>", "<relay-hint>"]`の形式でなければならず（MUST）、canonical kind `36` event IDを示します。receiverは`c` tagだけでcompanionと判定してはなりません（MUST NOT）。

receiverは上記formatに一致するeventのみをcompanion candidateとして扱います。canonicalへ解決する際はcompanionとcanonical双方のevent ID / signature、`c` referenceとcanonical IDの一致、canonical kind `36`、両eventの同一pubkeyを検証しなければなりません（MUST）。timestamp、canonical側CW metadataの有無、reasonの一致をvalidation条件にしてはなりません（MUST NOT）。

解決後に新しく生成するevent-targeted interactionはcanonicalを対象にすべきです（SHOULD）。canonicalが見つからない、無効、削除済み、または取得できない場合、companionを通常のkind `1`として表示してはなりません（MUST NOT）。

`c` tagのrelay hintはcanonical取得に利用してもよい（MAY）が、canonicalの存在や真正性を証明するものではありません。

## Other interactions

本文は`.content`に格納されます。Relayがkind `36` / `3636`を保存・indexすればNIP-50検索の対象になりますが、clientはNIP-50対応Relayが両kindを必ずindexすると仮定してはなりません（MUST NOT）。

削除にはNIP-09 kind `5`を使い、canonical IDを`e`、実際のkindを`k`で参照すべきです（SHOULD）。論理上の投稿はcanonicalを対象に削除すべきです（SHOULD）。残存companionを通常noteとして表示してはなりません（MUST NOT）。

kind `36` / `3636`のrepostにはNIP-18 kind `16`を使わなければならず（MUST）、kind `6`として扱ってはなりません（MUST NOT）。

## Security

`.content`は平文です。SensitiveはUI上の表示制御であり、暗号化ではありません。`c` tagだけではcanonicalの真正性を証明できないため、event ID、signature、同一pubkeyを検証します。relay hintは信頼の根拠ではありません。Sensitive対応clientは、ユーザーが表示を許可するまで本文と関連mediaを通常表示すべきではありません（SHOULD NOT）。

## References

- [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md), [NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md), [NIP-10](https://github.com/nostr-protocol/nips/blob/master/10.md), [NIP-18](https://github.com/nostr-protocol/nips/blob/master/18.md), [NIP-22](https://github.com/nostr-protocol/nips/blob/master/22.md)
- [NIP-34](https://github.com/nostr-protocol/nips/blob/master/34.md), [NIP-36](https://github.com/nostr-protocol/nips/blob/master/36.md), [NIP-50](https://github.com/nostr-protocol/nips/blob/master/50.md)
- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html) / [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174.html)
