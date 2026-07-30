import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const expectedManifestDigest =
    "ffca05a036796b6a17ef7fb57363d8e06f4c5ad002b011675dcbbadc30f2a801";
const manifestBytes = await readFile(
    resolve("legacy-bridge", "manifest.json"),
);
const manifestDigest = createHash("sha256")
    .update(manifestBytes)
    .digest("hex");
if (manifestDigest !== expectedManifestDigest) {
    throw new Error(
        "Fixed legacy manifest digest changed; compatibility review is required",
    );
}
const manifest = JSON.parse(manifestBytes.toString("utf8"));
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

for (const asset of manifest.assets) {
    const headers = bypassSecret
        ? { "x-vercel-protection-bypass": bypassSecret }
        : undefined;
    const response = await fetch(asset.sourceUrl, {
        headers,
        redirect: "follow",
    });
    if (!response.ok) {
        throw new Error(`${asset.path}: remote status ${response.status}`);
    }

    const requestedUrl = new URL(asset.sourceUrl);
    const finalUrl = new URL(response.url);
    const sourceBaseUrl = new URL(manifest.sourceBaseUrl);
    if (
        finalUrl.origin !== sourceBaseUrl.origin ||
        finalUrl.pathname !== requestedUrl.pathname ||
        finalUrl.search !== requestedUrl.search
    ) {
        throw new Error(`${asset.path}: unexpected final response URL`);
    }

    const contentType = (response.headers.get("content-type") ?? "")
        .split(";", 1)[0]
        .trim()
        .toLowerCase();
    if (contentType !== asset.contentType || contentType === "text/html") {
        throw new Error(`${asset.path}: remote content type ${contentType}`);
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (bytes.byteLength !== asset.byteSize || digest !== asset.sha256) {
        throw new Error(`${asset.path}: remote bytes do not match the manifest`);
    }


    const checkedInBytes = new Uint8Array(
        await readFile(resolve("legacy-bridge", asset.path)),
    );
    const checkedInDigest = createHash("sha256")
        .update(checkedInBytes)
        .digest("hex");
    if (
        checkedInBytes.byteLength !== asset.byteSize ||
        checkedInDigest !== asset.sha256 ||
        !Buffer.from(checkedInBytes).equals(Buffer.from(bytes))
    ) {
        throw new Error(`${asset.path}: checked-in bytes do not match remote`);
    }
}

console.log(
    `Verified ${manifest.assets.length} fixed legacy assets from ${manifest.sourceDeploymentId} (${manifest.totalBytes} bytes).`,
);
