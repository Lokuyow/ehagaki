# Sensitive Content Payload形式（実験的仕様）

本書はeHagaki独自の実験的な拡張を説明します。正式なNIPではなく、NIP-36を変更・置換する仕様でもありません。

## Motivation

NIP-36では本文を通常のevent kindの`.content`に平文で保持し、`content-warning` tagでSensitiveであることを示します。そのtagを解釈しないclientでは、CW本文が通常の投稿としてそのまま表示される場合があります。本形式では元のevent kindを維持しながら本文をkind `36`のpayloadへ分けるため、対応clientは本文の描画前にStructureを識別・filterできます。本文を特殊tagへ移さずpayloadの`.content`に保持でき、kind `1` Structure自体でkind `1`を購読するclientへ投稿の存在を知らせられます。

## Event format

Sensitive Content Payload形式では、CW付きの元eventをStructure、kind `36`を本文payloadとして送ります。Structureのkindと通常tagは元eventから維持し、`.content`を空にしてpayloadを指す`c` tagを加えます。

| Event | Kind | 用途 |
| --- | ---: | --- |
| Structure | `1`、`42`、`1111` | 通常の本文以外のmetadata、CW、reply／channel topologyを保持 |
| Payload | `36` | Sensitive本文を`.content`に保持 |

Structureには標準NIP-36の`content-warning` tagを使います。reasonがない場合は`["content-warning"]`です。`c` tagはpayload event IDと任意のrelay hintを持ちます。PayloadにはStructureのkindを示す`k` tagを1つ付けます。

kind `1`の例:

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

```json
{
  "kind": 36,
  "content": "Sensitive本文",
  "tags": [["k", "1"]]
}
```

Payload本文は通常どおり`.content`に格納します。`q`、`p`、`e`、`imeta`、`emoji`、`client`など元eventのtagはStructure側に残し、payloadへ複製しません。

## Receiver validation and identity

receiverは、上記形式に合うkind `1`、`42`、`1111`のeventだけをpayload方式のStructure候補として扱います。`c` tagだけでpayload方式またはevent associationを成立させてはなりません（MUST NOT）。

payloadをStructureの本文として使う前に、Structureとpayloadの組で次を検証します。

- Structureとpayloadそれぞれのevent IDとsignatureが有効である
- Structureの`c`参照IDがpayloadのevent IDと一致する
- payloadのkindが`36`である
- Structureとpayloadのpubkeyが同一である
- payloadに`k` tagがちょうど1つあり、その値がStructure kindの文字列表現と一致する

timestamp、CW reasonの一致、payload取得元のRelayはassociationの条件ではありません。relay hintはpayload取得に使えますが、payloadの存在や真正性を証明しません。

Structureをcanonical eventとして扱います。新しく作成するreply、quote、reaction、deletion等のevent-targeted interactionはStructureを対象にします。payloadは単独では通常投稿として表示せず、Structureとのpair検証が通らない場合は本文へ昇格させません。

## Replies

Sensitive化を理由に元のevent kindやreply topologyを変更しません。

| 投稿先 | Structure kind / topology |
| --- | --- |
| kind `1`の投稿・NIP-10 reply | kind `1` / NIP-10 |
| kind `42`のPublic Chat message | kind `42` / NIP-28 |
| NIP-22 comment | kind `1111` / NIP-22 |

kind `1`への通常replyはNIP-10を維持します。kind `1111`へのcomment replyはNIP-22を使います。addressable parentでは有効な`a`とcurrent-version `e`の併記を受理し、NIP-22のrootとdirect parentを区別します。

## NIP-36 compatibility

通常のNIP-36形式は`.content`をCW本文として扱います。旧`content-warning[2]`本文形式は受信互換のためだけに解釈し、新規送信には使いません。本文を含まないStructureと`c`参照がある場合は、payloadをpair検証してから表示します。

## Search and deletion

payload本文はkind `36`の`.content`にあるため、NIP-50の通常の全文検索対象となる構造です。ただしRelayがkind `36`を検索用にindexすることまでは保証されません。

NIP-09 deletionはcanonicalなStructureを対象とし、検証済みpairがある場合はpayloadも対象へ含めます。payloadへの削除がRelayへ届かない場合など、payloadがRelay上に残ることがあります。third-party interactionがpayloadを直接参照している場合、自動的にStructure向けへ変換しません。

kind `36`等をrepostする場合、NIP-18ではkind `6`ではなくgeneric repost kind `16`の対象となります。

## Security

本形式は暗号化やconfidentiality mechanismではありません。Sensitive本文はkind `36` eventの`.content`に平文で格納され、eventを取得できる人は読めます。
