# Sensitive Content Payload方式 設計メモ

> **Status:** Implementation target / experimental  
> **Scope:** eHagaki PR #284 で検証中の fail-closed Content Warning 形式  
> **Reference implementation:** SnowCait/nostter PR #2680 が本方式の read-only 対応を実装している。  
> **Relation to previous branch design:** 本書は、PR #284 内で先に実装された `kind 36 / 3636` canonical event + kind 1 companion 方式を置き換える設計とする。未releaseの旧実験方式を互換対象として残さない。

規範的な形式仕様は [Sensitive Content Payload形式](SENSITIVE_CONTENT.md) を参照してください。

## 1. 目的

NIP-36 の `content-warning` は通常 event の `.content` に本文を保持したまま表示制御を行うため、NIP-36 を解釈しない client では Sensitive 本文が通常本文として表示され得る。

本方式では、元 event の kind・identity・topology・tags を維持したまま、Sensitive 本文だけを別の `kind 36` event へ分離する。

狙いは次のとおり。

- Sensitive 非対応 client に本文そのものを通常表示させない
- 元 event kind の identity / topology / subscription semantics を維持する
- 既存 client の `kind 1 / 42 / 1111` subscription を変えない
- 対応 client は Structure event の `c` 参照から必要時だけ本文を取得できる
- reply / reaction / repost / zap / deletion 等の対象を元 event identity に統一する
- writer / reader 双方で実装しやすい単純な2-event modelにする

本方式は暗号化や機密保持を提供しない。`kind 36` payload 自体は通常の plaintext Nostr event であり、それを取得した relay / client には本文が見える。

## 2. 基本モデル

1つの Sensitive 投稿を2 eventで表す。

```text
Structure event
  kind: 元の kind
  content: ""
  tags:
    元の投稿が持つ tags を原則そのまま保持
    content-warning
    c: <kind36-id> + optional relay hint

             │
             │ c
             ▼

Sensitive payload
  kind: 36
  content: Sensitive本文
  tags:
    k: <Structure kind>
```

### 2.1 Structure event

Structure event は、Sensitive化する前に作成される元 event の kind と tags を維持する。

- `.content` だけを空にする
- 元投稿の tags は原則として Structure event に残す
- `content-warning` tag を持つ
- `c` tag で Sensitive payload を参照する
- `c` の第3要素に payload の relay hint を付けられる

```json
["c", "<kind36-event-id>", "<relay-hint>"]
```

Structure event を投稿の canonical identity とする。

したがって、次は Structure event を対象にする。

- event identity / permalink
- thread topology
- reply target
- reaction
- repost
- quote target
- zap
- post history上の投稿identity
- 通常のevent-targeted operation

削除については本文payloadも消す必要があるため、後述のとおり Structure と payload の両方へ deletion request を出す。

### 2.2 Sensitive payload

Sensitive payload は本文保管に責務を限定する。

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "<sensitive-content>",
  "tags": [
    ["k", "<structure-kind>"]
  ]
}
```

writer が生成する payload は原則として、本文と1つの `k` tagだけを持つ。

`k` は payload が対応する Structure event の kind を表す。

例:

- `["k", "1"]` — kind 1 Text Note / NIP-10 reply
- `["k", "42"]` — kind 42 Public Chat Message
- `["k", "1111"]` — kind 1111 NIP-22 Comment

reader は将来拡張を妨げないため、`k` 以外の未知tagが存在するという理由だけでは payload を拒否しない。ただし `k` の個数と値は validation 対象とする。

## 3. Sensitive化しても元kindを変えない

本方式の重要な原則は、Content Warning を理由に event kind を変更しないことである。

```text
通常kind 1投稿          → kind 1 Structure
kind 1へのNIP-10 reply  → kind 1 Structure
Public Chat             → kind 42 Structure
NIP-22 Comment          → kind 1111 Structure
```

つまり、Sensitiveな kind 1 reply を自動的に kind 1111 へ変換しない。

NIP-22 kind 1111 を使うのは、その投稿がSensitive化前からNIP-22 Commentとして作られる場合だけである。

このため、PR #284 内の旧実験方式で導入した Sensitive canonical kind `36` / Sensitive Comment kind `3636` というkind matrixは廃止する。

## 4. Existing NIP-36 との判定

既存 NIP-36 と本方式を明確に区別する。

Structure event が次を満たす場合のみ、本方式の payload reference として扱う。

- 対応する Structure kind である
- `content-warning` tag がある
- `.content === ""`
- 有効な event ID を値に持つ `c` tag がちょうど1つある

一方、`content-warning` があっても `.content` が空でなければ既存 NIP-36 を優先する。

```text
content-warning あり
│
├─ content != ""
│    → 既存 NIP-36
│      event.content を本文として扱う
│      c があっても payload は取得しない
│
└─ content == ""
     + 正規な c tag
     → Sensitive Content Payload方式
```

これにより既存 NIP-36 event を誤って payload方式として解釈しない。

## 5. Supported Structure kinds

初期実装の対象は次に限定する。

- kind 1
- kind 42
- kind 1111

「任意の Nostr event をすべて kind 36 payload方式へ変換できる」とは定義しない。

元 event の `.content` 自体に protocol semantics があるkindでは、`.content`を空にすると元仕様を壊す可能性があるため、対応kind追加時に個別検討する。

例えば kind 7 reaction は `.content` に reaction value を持つので、今回の対象外とする。

## 6. ルートkind 1の例

### Structure event

```json
{
  "id": "<kind1-id>",
  "pubkey": "<author>",
  "kind": 1,
  "content": "",
  "tags": [
    ["t", "example"],
    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

### Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "Sensitiveな本文",
  "tags": [
    ["k", "1"]
  ]
}
```

## 7. kind 1 NIP-10 replyの例

Sensitive化してもkind 1 replyのkindとNIP-10 topologyを維持する。

### Structure event

```json
{
  "id": "<reply-id>",
  "pubkey": "<author>",
  "kind": 1,
  "content": "",
  "tags": [
    ["e", "<root-id>", "<root-relay>", "root"],
    ["e", "<parent-id>", "<parent-relay>", "reply"],
    ["p", "<parent-author>"],
    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

### Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "Sensitiveな返信本文",
  "tags": [
    ["k", "1"]
  ]
}
```

## 8. NIP-22 Commentの例

元投稿がNIP-22 Commentの場合だけ、Structure eventはkind 1111とする。

NIP-22 topologyはすべて Structure event 側に保持する。

### Structure event

```json
{
  "id": "<kind1111-id>",
  "pubkey": "<author>",
  "kind": 1111,
  "content": "",
  "tags": [
    ["E", "<root-id>", "<root-relay-hint>", "<root-author>"],
    ["K", "1"],
    ["P", "<root-author>", "<root-relay-hint>"],
    ["e", "<parent-id>", "<parent-relay-hint>", "<parent-author>"],
    ["k", "1"],
    ["p", "<parent-author>", "<parent-relay-hint>"],
    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

### Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "SensitiveなNIP-22 Comment本文",
  "tags": [
    ["k", "1111"]
  ]
}
```

kind 1111上の `k` と kind 36上の `k` は別eventで別の意味を持つ。

- kind 1111 の `k` — NIP-22 direct parent kind
- kind 36 の `k` — payloadに対応するStructure kind

同一event内で競合しない。

## 9. Public Chatの例

### Structure event

```json
{
  "id": "<kind42-id>",
  "pubkey": "<author>",
  "kind": 42,
  "content": "",
  "tags": [
    ["e", "<channel-id>", "<relay-hint>", "root"],
    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

### Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "Sensitiveなチャット本文",
  "tags": [
    ["k", "42"]
  ]
}
```

## 10. Tag placement

初期仕様ではtag分類を最小化し、**Sensitive化前の元eventに付くtagは原則すべてStructure eventへ残す**。

例:

- NIP-10 / NIP-22 / NIP-28 のthread・channel topology tags
- `p`
- `q`
- `t`
- `emoji`
- `imeta`
- `client`
- その他、元eventに通常付与されるtag
- `content-warning`
- payload参照用の `c`

Sensitive payloadにwriterが付けるtagは原則 `k` のみとする。

### 10.1 描画時の解釈

Sensitive-aware clientは、表示時に次の組合せで解釈する。

```text
投稿identity / topology / metadata = Structure event
表示本文                         = payload.content
本文描画に使うtags                = Structure event.tags
```

つまり、`emoji` や `imeta` も Structure eventに残し、取得したpayload本文を描画する際にStructureのtagsを使う。

この単純化により、clientはtagを2event間でmerge・分類する必要がなく、既存のevent metadata処理をほぼ維持できる。

### 10.2 NIP-92 `imeta` について

通常のNIP-92では `imeta` は同じeventの `.content` にあるmedia URLと対応する。

本方式ではStructureの `.content` は空で、media URLはpayload `.content` にある一方、`imeta` はStructure側に残る。この点は通常のNIP-92 event内対応関係から外れる、本実験形式固有のcross-event interpretationである。

Sensitive-aware clientは、Structure eventの `imeta` を、検証済みpayload `.content` 内のURLに対するmetadataとして扱う。

Sensitive非対応clientや通常のNIP-92実装が、Structure上のunmatched `imeta` を無視しても問題ない設計とする。

### 10.3 `emoji` について

同様に、Structure eventの `emoji` tagを、検証済みpayload `.content` 内の `:shortcode:` 描画に使用する。

payload側へ `emoji` tagを移さないことで、対応clientがpayload tagsを別途rendererへmergeする必要をなくす。

## 11. `content-warning` reason

`content-warning` と optional reason はStructure eventだけに置く。

payloadへ複製しない。

これによりStructureとpayloadでreasonが食い違う状態を定義する必要がなくなる。

## 12. Payload referenceとrelay hint

Structure eventの `c` tagはpayload IDを参照する。

```json
["c", "<kind36-id>", "wss://relay.example.com"]
```

- `c[1]` はpayload event ID
- `c[2]` はoptional relay hint
- relay hintは取得先候補でありauthenticityの証明ではない

writerは可能であれば、payloadを実際にacceptしたrelayの1つをhintに使う。

reader側で受理するrelay URLのscheme / sanitization policyはclient実装のsecurity policyとして扱い、protocol上でnostter固有の `wss://` 制約を一般化しない。

## 13. Subscriptionと取得経路

### 13.1 Baseline

Sensitive-aware clientも既存のStructure kind subscriptionをそのまま使う。

```json
{"kinds":[1]}
{"kinds":[42]}
{"kinds":[1111]}
```

基本取得経路は次とする。

```text
Structure eventを通常subscriptionで取得
↓
content-warning + cを認識
↓
必要になった時点でcのevent IDを取得
↓
payloadをvalidation
↓
表示
```

kind 36の常時購読はbaseline要件ではない。

### 13.2 Optional direct kind 36 discovery

`kind 36 + #k` subscriptionや `#c` reverse lookupは将来拡張として可能だが、初期protocol / eHagaki実装の必須経路にはしない。

SnowCait/nostter PR #2680 でもdirect kind 36 subscriptionと `#c` reverse lookupは実装していない。

## 14. Payload validation

Structure eventが `c` で参照するeventをSensitive payloadとして採用するには、少なくとも次を検証する。

- Structure event自体が通常どおり有効なsigned eventである
- `c` tagがちょうど1つ
- `c[1]` が有効なevent ID
- 取得した `payload.id` が `c[1]` と一致
- payload event自体のID / signatureが有効
- `payload.kind === 36`
- `payload.pubkey === structure.pubkey`
- payloadの `k` tagがちょうど1つ
- `payload.k === String(structure.kind)`

例:

```text
kind 1    --c--> kind 36 / k=1      OK
kind 42   --c--> kind 36 / k=42     OK
kind 1111 --c--> kind 36 / k=1111   OK

kind 1    --c--> kind 36 / k=1111   NG
```

取得不能またはvalidation failure時はfail closedとし、Sensitive本文を表示しない。

Structure eventの空 `.content` や別の本文へfallbackしない。

## 15. Canonical identity

Structure eventをcanonical postとする。

```text
kind 1 / 42 / 1111
= 投稿そのもの
= canonical event ID
= thread / reaction / repost / quote / zap 等のtarget

         │
         │ c
         ▼

kind 36
= Sensitive body payload
```

payloadを取得して本文を表示しても、client内部のevent identityをkind 36へ置き換えない。

SnowCait/nostter PR #2680も `item.event` をStructure eventのまま維持している。

## 16. Publish order / failure semantics

2 eventはrelay上でatomicにpublishできないため、writerの送信順序を定義する。

### 16.1 基本手順

```text
1. Sensitive化前の元event内容・tags・target状態をsnapshot
2. kind 36 payloadを構築・署名
3. payloadを対象write relay群へpublish
4. payloadが1 relay以上にacceptされたことを確認
5. payload IDと、実際にpayloadをacceptしたrelayのhintからStructure eventを構築
6. Structure eventを署名
7. payloadをacceptしたrelay群へStructure eventをpublish
8. Structureも1 relay以上にacceptされたら投稿成功
```

Structureがpayload IDを参照するためpayloadは先に署名する必要がある。

また、実際にpayloadを保存したrelayを `c` hintへ入れるため、Structureの署名はpayload publish結果確定後になる。

### 16.2 payload publish失敗

payloadが1 relayにもacceptされなければStructureをpublishしない。

投稿全体を失敗とする。

### 16.3 payload成功 / Structure失敗

payload成功後にStructure署名またはpublishが失敗した場合、既にpublish済みのpayloadをatomic rollbackすることはできない。

この場合:

- 投稿全体は成功扱いにしない
- editor内容を通常の投稿成功としてclearしない
- partial publishとしてユーザーへ失敗を通知できるようにする
- 自動kind 5 deletionをtransaction rollbackの代用として送らない

孤児payloadは通常subscription対象ではないため、通常のtimeline投稿としては扱われない。

## 17. Read-side relay discovery

readerのpayload取得候補は、少なくとも次を利用できる。

- `c` relay hint
- Structure eventを実際に取得したrelay
- local cache / post historyにpayloadの既知relay evidenceがある場合はそのrelay

SnowCait/nostter PR #2680では `c` hint ∪ Structure seen-on relaysをnormalize / deduplicateし、default read relaysを自動追加しない。

このlazy on-show取得やcandidate選択は有力なreference behaviorだが、protocol上の全client共通MUSTとはしない。

## 18. Local post history / cache

表示上はStructure eventだけを1投稿として扱う。

```text
Structure event
→ visible post history record / canonical post

kind 36 payload
→ auxiliary related data / cache
→ 独立した投稿行として表示しない
```

自分が投稿したpayload本文を毎回relayから再取得しなくてよいよう、eHagakiは既存の責務に沿った方法でpayloadをローカル保存・再利用する。

保存場所や内部schemaはrepository調査で既存設計に合わせて決める。新しい永続化層をprotocol都合だけで決め打ちしない。

export / importがpost history raw eventを扱う場合は、Structureとpayloadの関係および削除状態を壊さないことを確認する。

## 19. Deletion

通常のevent-targeted operationはStructureをtargetにするが、削除ではSensitive本文そのものを持つpayloadにもdeletion requestを送る。

同じauthorであることを検証済みのStructure / payloadに対し、1つのkind 5 eventで両方を参照できる。

概念例:

```json
{
  "kind": 5,
  "content": "",
  "tags": [
    ["e", "<structure-id>"],
    ["e", "<payload-id>"],
    ["k", "1"],
    ["k", "36"]
  ]
}
```

NIP-09のdeletion requestは全relay / clientからの物理削除を保証しないため、UI上も通常のNIP-09と同じ保証範囲として扱う。

payloadが取得・検証できない場合に、未検証のIDを同一authorのpayloadと仮定して削除対象へ追加してはならない。

## 20. 旧 `kind 36 / 3636 + companion` 方式の扱い

PR #284内で先に実装された次の実験方式は、新方式へ置き換える。

- kind 36をcanonical Sensitive Text Noteとする方式
- kind 3636をSensitive Commentとする方式
- kind 36を指す空content kind 1 companion
- Sensitive化を理由にkind 1 replyをNIP-22 / 3636へ変換するkind matrix

これらは未releaseのbranch-local experimental designなので、将来利用を推測したlegacy compatibility pathを残さない。

一方、次は別物なので維持する。

- 通常のNIP-36 `content-warning`
- repositoryで既に明示的に維持対象となっている既存receive compatibility
- Sensitive機能OFF時の既存投稿semantics

## 21. eHagaki writerが生成する最終形

### kind 1例

```json
{
  "kind": 1,
  "content": "",
  "tags": [
    ["t", "cats"],
    ["emoji", "blobcat", "https://example.com/blobcat.png"],
    [
      "imeta",
      "url https://example.com/cat.jpg",
      "m image/jpeg",
      "dim 1920x1080"
    ],
    ["content-warning", "reason"],
    ["c", "<payload-id>", "wss://relay.example.com"]
  ]
}
```

```json
{
  "kind": 36,
  "content": "猫です :blobcat:\nhttps://example.com/cat.jpg",
  "tags": [
    ["k", "1"]
  ]
}
```

対応clientはStructureのtagsを維持したまま、表示本文だけを検証済みpayload `.content` に置き換える。

## 22. Reference implementation: nostter PR #2680

SnowCait/nostter PR #2680 は本方式のread-only対応を実装している。

確認済みの主な判断:

- 対応Structure kindは `1 / 42 / 1111`
- `.content === ""` の場合のみpayload方式として解釈
- non-empty `.content` は既存NIP-36を優先
- `c` tagはちょうど1つ必要
- Structure eventをcanonical identityとして維持
- kind 36は表示本文payloadとして扱う
- payloadはreveal時にon-demand fetch
- relay candidateは `c` hint ∪ Structure seen-on relays
- payload ID / kind / pubkey / `k` を検証
- invalid / unavailableはfail closed
- direct kind 36 subscriptionは未実装
- `#c` reverse lookupは未実装
- write pathは変更なし

nostterの実装はprotocolの最終仕様そのものではないが、Structure identityを維持してpayload本文だけを差し替えるread-side modelの有力なreference implementationである。

## 23. 実装前に残る事項

protocol / product behaviorとして実装を止める未決定事項は原則解消済みとする。

残るのはrepository-localな実装判断である。

例:

- 既存builder / submit flowを2-event publishへどう分割するか
- payloadを既存のlocal history / related-event / cache責務のどこへ保持するか
- partial publishを既存error model / notification UIへどう統合するか
- deletion serviceのmulti-target化を既存repository責務へどう組み込むか
- export / import、post history、reply / quote preview等で必要なprojectionをどこで行うか

これらはローカルrepository調査に基づくPlanで確定する。

## 24. 参照する既存NIP

- NIP-01 — Basic protocol flow description
- NIP-09 — Event Deletion Request
- NIP-10 — Text Notes and Threads
- NIP-18 — Reposts / Quote Reposts
- NIP-22 — Comment
- NIP-25 — Reactions
- NIP-28 — Public Chat
- NIP-30 — Custom Emoji
- NIP-36 — Sensitive Content / content-warning
- NIP-92 — Media Attachments Metadata (`imeta`)

本書は上記NIP自体の変更を提案するものではなく、Sensitive本文分離方式の実験設計を定義する。
