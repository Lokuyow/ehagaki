# Sensitive Event形式（実験的仕様）

本書は、kind `36` / `3636`を用いる実験的なSensitive Event形式を定義します。正式なNIPではなく、NIP-36を置き換えるものではありません。

## Motivation

NIP-36は通常のevent kindの`.content`に本文を平文で保持し、`content-warning` tagでSensitiveであることを示します。そのtagを解釈しないclientでは、本文が通常の投稿として表示される場合があります。この形式ではkind `36` / `3636`自体でもSensitiveを示すため、対応clientは本文の描画前にkindで識別できます。本文は通常どおり`.content`に保持し、任意のkind `1` companionで本文を複製せず、kind `1`を購読するclientへ存在を知らせられます。

## Event kinds

- kind `36`: Sensitive Text Note
- kind `3636`: Sensitive Comment

kind `36` / `3636`は`content-warning` tagの有無にかかわらずSensitiveとして扱わなければなりません（MUST）。本文は`.content`に格納しなければならず（MUST）、独自tagへ移してはなりません（MUST NOT）。CW metadataを付ける場合は標準NIP-36形式を使わなければなりません（MUST）。kind `3636`はNIP-22 comment topologyを使わなければなりません（MUST）。

## Replies

| Parent | Normal reply | Sensitive reply |
| --- | --- | --- |
| kind `1` | kind `1` / NIP-10 | kind `3636` / NIP-22 |
| kind `36` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `1111` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |
| kind `3636` | kind `1111` / NIP-22 | kind `3636` / NIP-22 |

Sensitive reply senderはmappingに従わなければなりません（MUST）。kind `1` thread内のeventへSensitive replyする場合、既存rootをNIP-22 rootとして使い、選択したkind `1` eventをdirect parentとします。

## Compatibility companion

top-level kind `36`にはkind `1` companionを付けてもよい（MAY）。kind `3636`にはcompanionを作成してはなりません（MUST NOT）。

```json
{
  "kind": 1,
  "content": "",
  "tags": [
    ["content-warning", "reason"],
    ["c", "<kind-36-event-id>", "<optional-relay-hint>"]
  ]
}
```

companionは空の`.content`、canonicalと同一pubkey、標準形の`content-warning` tagを1つ、規定形の`c` tagを1つ持たなければなりません（MUST）。`c`はcanonical kind `36` event IDを指し、optionalなrelay hintを含めてもよい（MAY）。companionはcanonical本文を持たず、上記以外のcontentやmetadataを複製してはなりません（MUST NOT）。

receiverは上記formatに一致するkind `1` eventのみをcompanionとして扱います。canonicalへ解決するとき、`c`が指すeventのkindが`36`であり、canonicalとcompanionのpubkeyが同一であることを確認しなければなりません（MUST）。canonicalへ解決した後の新しいevent-targeted interactionはcanonicalを対象にすべきです（SHOULD）。canonicalが見つからない、無効、削除済み、または取得できない場合、companionを通常のkind `1` noteとして表示してはなりません（MUST NOT）。relay hintはcanonical取得に利用してもよい（MAY）が、canonicalの存在や真正性を証明しません。

## Security

Sensitive Eventは暗号化ではありません。本文は`.content`に平文で格納されるため、eventを取得できる第三者は読むことができます。
