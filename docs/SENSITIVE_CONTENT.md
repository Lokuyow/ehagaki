# Sensitive Event Format (Experimental)

This document describes eHagaki's experimental Sensitive event format. It is an eHagaki extension, not a replacement for NIP-36 or a claim of formal NIP support. The standard NIP-36 Content Warning format remains the default. The setting changes sending only; eHagaki reads both the standard format and the legacy eHagaki body-in-tag format.

Sensitive event bodies remain plaintext in the event's `content` field. The format is not encryption or a confidentiality mechanism. A client that does not understand these event kinds may not display or interpret them correctly.

## Event kinds

| Kind | Use | Content Warning behavior |
| ---: | --- | --- |
| `1` | Ordinary text note and compatibility notice | Standard NIP-36 when a warning is present |
| `36` | Experimental Sensitive Text Note | A top-level post sent with Sensitive format and an explicit CW; body is in `.content` |
| `1111` | NIP-22 Comment | A comment/reply sent without Sensitive format, including a CW reply where applicable |
| `3636` | Experimental Sensitive Comment | A reply sent with Sensitive format and an explicit CW; body is in `.content` |
| `42` | NIP-28 public chat message | Always uses the standard NIP-36 CW format |

Kinds `36` and `3636` are treated as Sensitive by eHagaki even when a `content-warning` tag is absent. When present, the tag uses standard NIP-36 metadata: `["content-warning"]` or `["content-warning", "reason"]`. New sends do not put the body in a third `content-warning` element. That older eHagaki-specific shape is supported for receiving only.

Kind `36` keeps the post body in `.content`. It may also include ordinary post metadata tags such as hashtags, media metadata, and client metadata.

Kind `3636` keeps the comment body in `.content` and uses NIP-22 root and parent tags. Root scope tags use uppercase `E`, `A`, or `I`, with `K` for the root kind and `P` when the root author is available. Direct-parent tags use lowercase `e`, `a`, or `i`, with `k` for the parent kind and `p` for the parent author. For example, a comment replying to a kind `1111` comment in a kind `36` thread has root kind `36` and parent kind `1111`:

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

NIP-22 addressable and external-identifier scopes (`A`/`a` and `I`/`i`) are also supported. For an addressable parent, a lowercase `a` reference may be accompanied by the current-version lowercase `e` reference. Ambiguous multiple primary scopes are rejected.

## Sending behavior

| Target and composition | Event kind and topology |
| --- | --- |
| Top-level post without an explicit CW | Kind `1` |
| Top-level post with an explicit CW, setting off | Kind `1` with standard NIP-36 tags |
| Top-level post with an explicit CW, Sensitive format on | Kind `36` with standard CW metadata |
| Reply to a kind `1` post without Sensitive format | Kind `1` with the existing NIP-10 reply topology |
| CW reply to a kind `1` post with Sensitive format on | Kind `3636` with NIP-22 topology |
| Reply to kind `36`, `1111`, or `3636` without Sensitive format | Kind `1111` with NIP-22 topology |
| CW reply to kind `36`, `1111`, or `3636` with Sensitive format on | Kind `3636` with NIP-22 topology |
| Public chat | Kind `42` with standard NIP-36 behavior |

Sensitive event kinds are selected only when the user explicitly enables a CW. A `#nsfw` hashtag by itself does not select kind `36` or `3636`. The setting's existing CW/`nsfw` coupling behavior is preserved when the setting is off; with Sensitive format on, CW and the `nsfw` hashtag are independent.

An ordinary reply to a kind `1` post keeps the existing NIP-10 behavior. A CW reply to a kind `1` post uses NIP-22 and preserves the known NIP-10 thread root while identifying the selected kind `1` event as the direct parent. Replies to NIP-22 comments preserve their validated root scope and update the direct parent to the selected comment. If the selected target's kind or required topology cannot be established, eHagaki does not silently fall back to a different reply format.

## Kind 1 compatibility companion

After publishing a kind `36` canonical event successfully, eHagaki best-effort publishes a kind `1` compatibility notice. No companion is created for kind `3636`.

A companion has an empty `.content`, the same author, a standard `content-warning` metadata tag, and one `c` tag pointing to the canonical kind `36` event. The `c` tag is an eHagaki extension, not a standard NIP-36 tag. Its optional relay hint is only a discovery hint; it does not prove that the canonical event was fetched from that relay. The companion contains no body, hashtag, quote, or media tags. eHagaki currently creates it with the canonical event's timestamp and CW metadata.

The compatibility notice is sent only after canonical publication succeeds. Companion signing or publication is best-effort: its failure does not undo the canonical post or repeat the canonical success transition. There is no durable retry queue.

### Receiving and resolving companions

eHagaki treats an event as a companion candidate only when it is a signed kind `1` event with empty content, exactly one `content-warning` tag, exactly one `c` tag, and no other tags. The CW tag has at most the standard reason element; the `c` tag contains a valid canonical event ID and may contain a relay hint.

A candidate links to a canonical event only when all of these checks pass:

- the `c` reference ID matches the canonical event ID;
- the target is kind `36`;
- both events have valid event IDs and signatures; and
- both events have the same author.

The receiver does not require the canonical event to contain a CW tag, nor does it require the companion's reason or timestamp to match the canonical event. Those properties are not part of link validation.

Once resolved, UI targets and author presentation use the canonical event. Relay evidence for that canonical target comes only from its `c` hint, a relay that actually returned the canonical event, or relay evidence attached to a local canonical record. The companion's source relay and pointer provenance are not treated as evidence that the canonical event was fetched there. A companion by itself is not displayed as a normal post when its canonical event is missing, deleted, or cannot be resolved.

## Receiving and previewing Content Warnings

The receiving rules do not depend on the Sensitive sending setting. For a `content-warning` tag, eHagaki uses its third element as the protected body when that element exists, including when it is the empty string. If there is no third element, eHagaki uses the event's `.content` as the protected body. Thus standard NIP-36 events continue to work, and old eHagaki body-in-tag events remain readable. Kinds `36` and `3636` are previewed as Sensitive based on kind even if their CW metadata is absent. The preview requires an explicit reveal action before rendering protected text and related media.

## Replies, quotes, and interactions

Replies and quotes that resolve to a companion use its validated canonical kind `36` event as the target. eHagaki does not require every `nostr:` URI in a body to be fetched; unresolved body references remain as authored and do not block posting. Existing third-party interactions that point to a companion are not rewritten or counted as canonical-event interactions.

eHagaki does not provide a repost action. Under NIP-18, reposting an event other than kind `1` requires kind `16`; eHagaki does not convert kind `36` into a kind `6` repost.

## Deletion lifecycle

Deletion targets the canonical kind `36` event. The NIP-09 kind `5` request references the canonical event ID with an `e` tag and identifies its kind with `k`=`36`. eHagaki does not maintain a persistent companion-ID alias, queue, or reverse `#c` lookup, so a matching kind `1` companion may remain on relays after canonical deletion.

A remaining companion is a noncanonical, empty-body compatibility artifact. If its canonical event is deleted or unavailable, eHagaki does not promote the companion into a normal post or use it to restore the deleted canonical event.

## Search and privacy

Because the body is in `.content`, it can participate in ordinary full-text search on relays that index the event kind. NIP-50 does not guarantee that every relay indexes every event kind. The body is not encrypted: anyone who can read the raw event can read its `.content`.

## Compatibility summary

- The standard NIP-36 kind `1`/`42` format remains the default and remains readable.
- The experimental Sensitive setting affects sending only; receiving does not depend on the setting.
- New Sensitive sends use kind `36` or `3636` and keep the body in `.content`.
- The legacy eHagaki format that stored the body in `content-warning[2]` remains readable but is not newly sent.
- A kind `36` post may have an empty-body kind `1` compatibility notice; it is never a substitute for the canonical event.
- Sensitive event bodies are plaintext, not encrypted or secret.

## References

- [NIP-01: Basic protocol flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-09: Event deletion](https://github.com/nostr-protocol/nips/blob/master/09.md)
- [NIP-10: Text notes and threads](https://github.com/nostr-protocol/nips/blob/master/10.md)
- [NIP-18: Reposts](https://github.com/nostr-protocol/nips/blob/master/18.md)
- [NIP-22: Comments](https://github.com/nostr-protocol/nips/blob/master/22.md)
- [NIP-28: Public chat](https://github.com/nostr-protocol/nips/blob/master/28.md)
- [NIP-36: Sensitive content / Content Warning](https://github.com/nostr-protocol/nips/blob/master/36.md)
- [NIP-50: 검색 / Search](https://github.com/nostr-protocol/nips/blob/master/50.md)
