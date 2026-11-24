import { n as e } from "./rolldown-runtime-CwxnZyOB.js";
import { n as t } from "./relayConfigUtils-56ujWwKF.js";
import { n, o as r } from "./ehagakiDb-DuXS0XPm.js";
import { $ as i, A as a, L as o, V as s, tt as c, z as l } from "./postHistoryRepository-Bu2z041i.js";
import { n as u, t as d } from "./postHistoryContextFetchService-DB7akfzB.js";
import { n as f } from "./nip65RelayDirectory-B7gmBLn_.js";
import { p } from "./customEmoji-C4nd4cTR.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveContentPayloadReader.ts
var m = /* @__PURE__ */ e({
	createSensitivePayloadBodyLoader: () => v,
	loadSensitivePayloadContent: () => _,
	loadVerifiedSensitivePayloadEvent: () => g
});
async function h(e, t) {
	return (await c(n, "postHistory").get(e.id))?.deletedAt !== void 0 || (await n.postHistoryDeletionRequests.where("targetEventId").anyOf([e.id, t]).toArray().then((e) => c(n, "postHistoryDeletionRequests").hydrate(e))).some((t) => {
		let n = t.rawEvent;
		return s(n) && n.pubkey === e.pubkey && a(n, {
			id: t.targetEventId,
			pubkey: e.pubkey
		});
	});
}
async function g(e) {
	let { structure: r } = e;
	if (e.signal?.aborted || !s(r)) return null;
	let a = o(r);
	if (!a) return null;
	let c = (await f.getByIds([a.eventId]))[0];
	if (c?.deletedAt !== void 0 || await h(r, a.eventId)) return null;
	if (c) {
		let t = c.rawEvent;
		if (l(r, t, a.eventId)) return e.signal?.aborted ? null : t;
	}
	if (!e.rxNostr || e.signal?.aborted) return null;
	let p = await i(n, r.pubkey), m = {
		ownerPubkeyHex: r.pubkey,
		expectedRevision: p,
		isActive: () => !e.signal?.aborted
	}, g = t.sanitizeExternalRelayUrls([
		...a.relayHint ? [a.relayHint] : [],
		...e.relayHints ?? [],
		...c?.acceptedRelays ?? [],
		...c?.fetchedRelays ?? []
	]), _ = d.fetchEventById(e.rxNostr, {
		eventId: a.eventId,
		relayHints: g,
		relayConfig: e.relayConfig
	}), v = () => _.cancel();
	e.signal?.addEventListener("abort", v, { once: !0 });
	let y = await _.promise.finally(() => e.signal?.removeEventListener("abort", v));
	if (e.signal?.aborted || !y.event || !l(r, y.event, a.eventId)) return null;
	let b = t.sanitizeExternalRelayUrls(y.relayUrl ? [y.relayUrl] : [], { limit: 1 });
	try {
		await f.putCandidate({
			event: y.event,
			fetchedRelays: b,
			relayHints: b,
			localWriteScope: m
		}), u.archiveAdoptedAuthored([{ event: r }], m);
	} catch {}
	let [x] = await f.getByIds([a.eventId]);
	return e.signal?.aborted || x?.deletedAt !== void 0 || await h(r, a.eventId) ? null : y.event;
}
async function _(e) {
	return (await g(e))?.content ?? null;
}
function v(e) {
	if (!e.structure || !o(e.structure)) return;
	let t = e.structure, n = o(t), i = (t) => _({
		structure: e.structure,
		relayHints: e.relayHints,
		rxNostr: e.rxNostr,
		relayConfig: e.relayConfig,
		signal: t
	});
	return i.scope = {
		runtime: e.rxNostr,
		ownerPubkey: e.ownerPubkey
	}, i.loadEmoji = p, i.observe = (e) => {
		let i = r(async () => {
			let [e] = await f.getByIds([n.eventId]);
			return e?.deletedAt !== void 0 || await h(t, n.eventId) ? "deleted" : e ? l(t, e.rawEvent, n.eventId) ? "available" : "invalid" : "missing";
		}).subscribe({
			next: e,
			error: () => e("invalid")
		});
		return () => i.unsubscribe();
	}, i;
}
export { g as n, m as r, v as t };
