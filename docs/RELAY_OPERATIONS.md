# Relay waiting policies

`src/lib/relay/operation.ts` owns application deadlines, phase scheduling, cancellation
and cleanup. An operation has one active timer. Services supply a policy and interpret
the collected data; they do not add a second timeout or a success-settlement delay.
Shared lookup consumers can have their own deadline without cancelling another
consumer's discovery. Publishing passes its operation to discovery and delivery waves.

## Finite REQs

`query.ts` uses the existing rx-nostr transport and verification boundary. Normal list
queries finish after `ceil(targets * 0.6)` distinct relays have sent EOSE and their
verification pipelines have drained, followed by a fixed 300ms grace period. The
normal upper limit is six seconds; existing shorter limits remain. Target URLs are
normalized, deduplicated and fixed at operation start. Failed relays do not reduce
the denominator. Each relay has a separate subscription ID when quorum collection
needs independent verification completion. All terminal sources can finish sooner.

Exact-event lookups still return as soon as the requested verified event is found.
Existing bootstrap first-valid-result paths also retain their early successful return.
Deletion checks, coverage repair and full scans keep their stricter evidence and
existing time budgets. Realtime subscriptions and NIP-46 RPC keep their own lifetimes.

Observable completion can mean a transport timeout; it does not prove EOSE. Early
termination and deadlines retain usable events, but do not create missing-event
negative caches or completed coverage for unverified relays. History coverage continues
to use the actual completed per-relay query bounds and saturation rules. Profile tiers
and custom-emoji list/set fallback share an absolute six-second network budget.

Manual upload-server-list synchronization retains ten seconds for preparation,
four seconds for response, and one 30-second AUTH budget, with an absolute 44-second
cap. Its phase changes use the same operation scheduler. rx-nostr owns AUTH and
retransmission; unrelated traffic and repeated challenges cannot renew the cap.

## Publishing

`publish.ts` separates `acknowledged` from `settled`. Normal callers receive success
at the first accepted ACK. Delivery continues to remaining targets until every
target is terminal, the operation reaches 12 seconds, or AUTH extends it to at most
30 seconds from the original operation start. There is no post-success settle timer.
Pending targets are not reported as timed out in the early result.

PostManager continues NIP-65 recipient discovery and additional delivery after the
first ACK. Sensitive publishing counts a Structure ACK as success; a Payload ACK
alone is insufficient, and each relay must accept its Payload before receiving the
Structure. All stages and waves share the operation's deadline.

Background delivery belongs to the captured session. Clearing the composer, changing
a Reaction target or starting another post does not cancel an acknowledged operation.
Logout, account/runtime replacement and disposal cancel it. This is an in-memory
operation, with no persistent outbox or replay after reload. Local-relay batches retain
their isolated, unauthenticated six-second operation and socket ownership. A local
history page and its related reads share that same six-second budget.

Internal results expose `deliveryPending` and `deliverySettled`; embed wire messages
keep their existing shapes. The UI performs success side effects once. Confirmed late history receipts only
merge into an existing row in the captured local-write generation, so clearing or
deleting history cannot recreate a row. Database schemas do not change.

## Floating delivery progress

The app-owned `useRelayDeliveryFeedback` hook owns one presentation subscription
and its timers. On the TOP composer, the visible mascot represents the newest
operation: a 30%-opacity base with the original SVG colors filling upward. Discovery
leaves it translucent. The mascot briefly pops and glows only on full delivery,
never on timeout restoration; reduced-motion preferences suppress that animation.
When presentation ends, the base restores uniformly rather
than falsely filling incomplete delivery to 100%. Older work never replaces the
newest operation after it retires.

An open owned dialog (including confirmation dialogs), or the mascot-hidden setting,
uses the floating bars instead. Switching surfaces preserves the same rows, dismissal
state and deadlines. The mascot's existing home link and theme colors are preserved;
iframe and Full Web Component share this UI without changing their public contracts.

`deliveryProgress.ts` exposes session-scoped progress from the existing ACK
subscription. Each user operation has one ID, including NIP-65 discovery and
additional delivery waves. Only distinct accepted relays advance progress; Sensitive
delivery requires both Payload and Structure acceptance. Local auxiliary storage,
REQ and NIP-46 RPC do not create delivery toasts.

The app shows at most three text-free, dismissible vertical bars side by side.
Each bar has an unframed, square-cornered 18px-wide track and fills upward from the bottom, with a preferred height of 144px that shrinks
to fit the available space. Discovery is indeterminate;
once targets are fixed, the bars show accepted/target counts. Only fully accepted
delivery with resolved routes fills the bar. Completion holds for 250ms and fades
for 150ms; incomplete delivery fades from its current width over 300ms. These are
presentation timers; the existing network operation alone controls the 12/30s cap.
Dismissing or evicting a toast does not cancel delivery or recreate that toast.
After discovery closes and at least one relay has accepted, 2,500ms without another
acceptance retires the display with a 300ms fade. Duplicate ACKs do not renew this
presentation-only idle wait. Late ACKs still settle and persist normally without
reopening the retired display; transport keeps its existing 12/30s deadline.
Session replacement/reset clears the bars and their presentation timers.

Progress floats above the active surface's footer, within the visual viewport or
owned embed container. A modal owns its toast portal so dismissing progress cannot
close the dialog. Ordinary success and real failure messages remain; partial relay
delivery warnings and late success-message rewrites are removed. Screen readers
receive progress and dismiss labels, and reduced-motion preferences are respected.

## Verification

Deterministic tests cover quorum/grace/deadline scheduling, unrelated subscriptions,
verification drainage, AUTH caps, continued delivery, cancellation and stale receipts.
The real rx-nostr pipeline is tested against synthetic WebSockets. Browser routing,
editor submission, history repair, upload-list synchronization and embedded login use
the existing Playwright harnesses; no real relay or account is required.

The success balloon waits for delivery settlement or the presentation idle timeout.
Composer clearing and host success notifications still happen at the first acceptance.
