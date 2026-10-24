// D:/ドキュメント/GitHub/ehagaki/node_modules/@jsquash/webp/meta.js
var e = {
	quality: 75,
	target_size: 0,
	target_PSNR: 0,
	method: 4,
	sns_strength: 50,
	filter_strength: 60,
	filter_sharpness: 0,
	filter_type: 1,
	partitions: 0,
	segments: 4,
	pass: 1,
	show_compressed: 0,
	preprocessing: 0,
	autofilter: 0,
	partition_limit: 0,
	alpha_compression: 1,
	alpha_filtering: 1,
	alpha_quality: 100,
	lossless: 0,
	exact: 0,
	image_hint: 0,
	emulate_jpeg_size: 0,
	thread_level: 0,
	low_memory: 0,
	near_lossless: 100,
	use_delta_palette: 0,
	use_sharp_yuv: 0
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/@jsquash/webp/utils.js
function t(e, t, n = {}) {
	let r;
	return t && (r = (e, n) => {
		let r = new WebAssembly.Instance(t, e);
		return n(r), r.exports;
	}), e({
		noInitialRun: !0,
		instantiateWasm: r,
		...n
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/wasm-feature-detect/dist/esm/index.js
var n = async () => WebAssembly.validate(new Uint8Array([
	0,
	97,
	115,
	109,
	1,
	0,
	0,
	0,
	1,
	5,
	1,
	96,
	0,
	1,
	123,
	3,
	2,
	1,
	0,
	10,
	10,
	1,
	8,
	0,
	65,
	0,
	253,
	15,
	253,
	98,
	11
])), r;
async function i(e, i) {
	let a = e, o = i;
	return arguments.length === 1 && !(e instanceof WebAssembly.Module) && (a = void 0, o = e), await n() ? (r = t((await import("./webp_enc_simd-DBws9_u9.js")).default, a, o), r) : (r = t((await import("./webp_enc-DHfkhBTp.js")).default, a, o), r);
}
async function a(t, n = {}) {
	r ||= i();
	let a = {
		...e,
		...n
	}, o = (await r).encode(t.data, t.width, t.height, a);
	if (!o) throw Error("Encoding error.");
	return o.buffer;
}
export { a as encode };
