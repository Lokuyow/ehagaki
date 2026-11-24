// D:/ドキュメント/GitHub/ehagaki/src/lib/postSignerResolver.ts
function e(e, t, n) {
	if (!e) return {
		ok: !1,
		error: n
	};
	let r = e.signEvent;
	return typeof r == "function" ? {
		ok: !0,
		source: t,
		signEvent: r.bind(e)
	} : {
		ok: !1,
		error: "nostr_sign_event_not_supported"
	};
}
function t(t) {
	if (t.authType === "nip07") {
		let e = t.window?.nostr, n = e?.signEvent;
		return typeof n == "function" ? {
			ok: !0,
			source: "nip07",
			signEvent: n.bind(e)
		} : {
			ok: !1,
			error: "nostr_sign_event_not_supported"
		};
	}
	if (t.authType === "nip46") return e(t.nip46Signer, "nip46", "nip46_signer_not_available");
	if (t.authType === "parentClient") return e(t.getParentClientSigner(), "parentClient", "parent_client_signer_not_available");
	if (t.authType !== "nsec") return {
		ok: !1,
		error: "key_not_found"
	};
	let n = t.getStoredSecretKey(t.pubkey);
	return n ? e(t.createSecretKeySigner(n), "secretKey", "nostr_sign_event_not_supported") : {
		ok: !1,
		error: "key_not_found"
	};
}
export { t };
