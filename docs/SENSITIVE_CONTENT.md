# Sensitive Event形式（実験的仕様）

この文書では、eHagaki独自の実験的なSensitive event形式を説明します。これはeHagaki独自の拡張であり、NIP-36を置き換えるものでも、正式なNIPとして扱うものでもありません。標準のNIP-36 Content Warning形式を既定の送信形式として維持します。設定が変えるのは送信形式だけです。eHagakiは標準形式と、以前のeHagaki独自の本文をtag内に格納する形式の両方を受信できます。

以下ではContent WarningをCWと表記します。

Sensitive eventの本文はeventの`content`フィールドに平文で格納されます。この形式は暗号化ではなく、本文の機密性を保証するものでもありません。対応していないクライアントでは、これらのevent kindが表示されない、または正しく解釈されない場合があります。

## Event kindの一覧

| Kind | 用途 | Content Warningの扱い |
| ---: | --- | --- |
| `1` | 通常のテキストノート、互換通知 | CWがある場合は標準NIP-36形式 |
| `36` | 実験的なSensitive Text Note | CWを明示してSensitive形式で送るトップレベル投稿。本文は`.content`に格納 |
| `1111` | NIP-22 Comment | Sensitive形式を使わないcomment/reply。CW付きreplyを含む場合がある |
| `3636` | 実験的なSensitive Comment | CWを明示してSensitive形式で送るreply。本文は`.content`に格納 |
| `42` | NIP-28 public chat message | 常に標準NIP-36のCW形式 |

eHagakiでは、kind `36`と`3636`は`content-warning` tagがなくてもSensitiveとして扱います。tagがある場合は、標準NIP-36のmetadata形式である`["content-warning"]`または`["content-warning", "reason"]`を使います。新規送信で本文を`content-warning`の第3要素へ入れることはありません。以前のeHagaki独自形式は受信時のみ対応します。

kind `36`の本文は`.content`に保持します。hashtag、media metadata、client metadataなど、通常の投稿metadata tagも含められます。

kind `3636`の本文は`.content`に保持し、NIP-22のroot tagとparent tagを使用します。root scopeには大文字の`E`、`A`、`I`を使い、root kindを`K`で示します。root authorが分かる場合は`P`も付けます。直接のparentには小文字の`e`、`a`、`i`を使い、parent kindを`k`、parent authorを`p`で示します。たとえば、kind `36`のthread内にあるkind `1111` commentへ返信する場合、root kindは`36`、parent kindは`1111`です。

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

NIP-22のaddressable scope（`A`/`a`）とexternal identifier scope（`I`/`i`）にも対応します。addressable parentでは、小文字の`a`参照に、現行versionの小文字`e`参照を併記できます。複数のprimary scopeが曖昧に併記されている場合は受け付けません。

## 送信時の形式

| 対象・投稿内容 | Event kindとtopology |
| --- | --- |
| CWを付けないトップレベル投稿 | kind `1` |
| CW付きトップレベル投稿、設定OFF | 標準NIP-36 tagを付けたkind `1` |
| CW付きトップレベル投稿、Sensitive形式ON | 標準CW metadataを付けたkind `36` |
| kind `1`へのCWなしの通常reply | 設定状態にかかわらず、既存のNIP-10 topologyによるkind `1` |
| 設定OFFでkind `1`へCW付きreply | 標準CW tagを付けたkind `1`、既存のNIP-10 topology |
| 設定ONでkind `1`へCW付きreply | NIP-22 topologyによるkind `3636` |
| kind `36`、`1111`、`3636`へのCWなしの通常reply | NIP-22 topologyによるkind `1111` |
| 設定OFFでkind `36`、`1111`、`3636`へCW付きreply | 標準CW tagを付けたkind `1111`、NIP-22 topology |
| 設定ONでkind `36`、`1111`、`3636`へCW付きreply | NIP-22 topologyによるkind `3636` |
| Public chatへの投稿 | 標準NIP-36形式のkind `42` |

Sensitive event kindは、ユーザーがCWを明示した場合に限り選択されます。`#nsfw` hashtagだけではkind `36`や`3636`になりません。設定がOFFの場合は従来のCWと`nsfw`の連動動作を維持し、Sensitive形式がONの場合はCWと`nsfw` hashtagを独立して扱います。

kind `1`への通常replyは既存のNIP-10形式を維持します。kind `1`へのCW付きreplyでSensitive形式がONの場合はNIP-22を使い、判明しているNIP-10 thread rootを維持しつつ、選択されたkind `1` eventを直接のparentとして示します。NIP-22 commentへのreplyでは、検証済みのroot scopeを引き継ぎ、選択されたcommentを直接のparentにします。選択対象のkindや必要なtopologyを確認できない場合、別形式へ暗黙にfallbackして送信することはありません。

## kind 1の互換companion

kind `36`のcanonical eventをRelayへ送信して成功した後、eHagakiはbest-effortでkind `1`の互換通知を送ります。kind `3636`にはcompanionを作りません。

companionは`.content`が空で、canonicalと同じauthorを持ち、標準の`content-warning` metadata tagと、canonical kind `36` eventを参照する`c` tagを1つだけ含みます。`c` tagはeHagaki独自の拡張であり、標準NIP-36 tagではありません。任意のrelay hintは取得先のヒントに過ぎず、そのrelayからcanonical eventを取得した証拠にはなりません。companionには本文、hashtag、quote、media tagを複製しません。eHagakiは現在、canonical eventと同じtimestampおよびCW metadataを付けてcompanionを生成します。

互換通知はcanonical eventのpublish成功後にだけ送ります。companionの署名またはpublishが失敗してもcanonical投稿を取り消さず、canonical投稿の成功処理を再実行しません。永続的な再試行queueはありません。

### companionの受信と解決

companion候補として扱うのは、署名済みkind `1` eventで`.content`が空、`content-warning` tagが1つ、`c` tagが1つだけあり、その他のtagを含まないものです。CW tagは標準reason要素までを持てます。`c` tagには有効なcanonical event IDがあり、relay hintを含む場合があります。

候補とcanonical eventのlinkは、次の条件を満たす場合に成立します。

- `c`の参照IDとcanonical event IDが一致する
- 対象eventがkind `36`である
- 両eventのevent IDとsignatureが有効である
- 両eventのpubkeyが同じである

canonical eventにCW tagがあること、companionのreasonがcanonical側と一致すること、timestampが一致することは、link成立の条件ではありません。

解決後のUI targetとauthor表示にはcanonical eventを使います。canonical eventのRelay取得先を探す際に使えるのは、companionの`c` tagにあるhint、canonical eventを実際に返したRelay、またはローカルcanonical record自身に付いたRelay情報だけです。companionの取得元Relayやpointerのprovenanceを、canonical eventを取得した証拠として扱いません。canonical eventが見つからない、無効、削除済み、または解決できない場合、companionだけを通常投稿として表示することはありません。

## Content Warningの受信とプレビュー

受信時の解釈はSensitive送信設定に左右されません。`content-warning` tagに第3要素が存在する場合は、空文字列であってもその要素を保護された本文として扱います。第3要素が存在しない場合は、eventの`.content`を保護された本文として扱います。このため標準NIP-36 eventは従来どおり表示でき、以前のeHagaki独自tag内本文形式も読み取れます。kind `36`と`3636`はCW metadataがなくてもkindに基づいてSensitive previewとして扱います。previewでは、ユーザーが明示的に表示操作をするまで本文と関連mediaを描画しません。

## 返信・引用・その他のinteraction

companionへの参照が解決されたreplyやquoteでは、検証済みのcanonical kind `36` eventをtargetとして使います。本文中のすべての`nostr:` URIを取得する必要はありません。解決できない本文中URIは入力どおり保持し、投稿を妨げません。第三者のinteractionがcompanionを直接参照している場合、その参照を書き換えたりcanonical eventへのinteractionとして数えたりしません。

eHagakiにrepost機能はありません。NIP-18ではkind `1`以外のeventをrepostするときはkind `16`を使います。kind `36`をkind `6`へ変換することはありません。

## 削除ライフサイクル

削除対象はcanonical kind `36` eventです。NIP-09のkind `5` requestでは、canonical event IDを`e` tagで参照し、kindを`k`=`36`で示します。eHagakiはcompanion IDの永続alias、queue、逆引き用`#c` lookupを持たないため、canonical削除後も対応するkind `1` companionがRelay上に残る場合があります。

残存companionは、canonicalではない空本文の互換artifactです。canonical eventが削除済みまたは取得不能の場合、companionを通常投稿へ昇格したり、削除済みcanonical eventを復元するために使ったりしません。

## 検索とプライバシー

本文は`.content`にあるため、そのevent kindをindexするRelayでは通常の全文検索対象になり得ます。ただし、すべてのRelayがkind `36`や`3636`をindexすることをNIP-50は保証しません。本文は暗号化されません。raw eventを読める人は`.content`から本文を読めます。

## 互換性の要点

- 標準NIP-36のkind `1`/`42`形式を既定として維持し、引き続き受信できます。
- 実験的なSensitive設定が変えるのは送信形式だけです。受信は設定に依存しません。
- 新規Sensitive送信はkind `36`または`3636`を使い、本文を`.content`に保持します。
- `content-warning[2]`に本文を格納する旧eHagaki形式は受信互換として維持し、新規送信には使いません。
- kind `36`投稿には空本文のkind `1`互換通知が付く場合がありますが、canonical eventの代わりにはなりません。
- Sensitive eventの本文は平文であり、暗号化も秘匿もされません。

## 参考仕様

- [NIP-01: Basic protocol flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-09: Event deletion](https://github.com/nostr-protocol/nips/blob/master/09.md)
- [NIP-10: Text notes and threads](https://github.com/nostr-protocol/nips/blob/master/10.md)
- [NIP-18: Reposts](https://github.com/nostr-protocol/nips/blob/master/18.md)
- [NIP-22: Comments](https://github.com/nostr-protocol/nips/blob/master/22.md)
- [NIP-28: Public chat](https://github.com/nostr-protocol/nips/blob/master/28.md)
- [NIP-36: Sensitive content / Content Warning](https://github.com/nostr-protocol/nips/blob/master/36.md)
- [NIP-50: Search Capability](https://github.com/nostr-protocol/nips/blob/master/50.md)
