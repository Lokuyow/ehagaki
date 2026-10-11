import { mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("rx-nostr patch install/build guard", () => {
    it.each(["valid", "manifest-version", "lock-version", "nested-version", "installed-version", "missing-patch", "artifact-drift", "unpatched"])("%s is checked in an isolated installation", mode => {
        const root = mkdtempSync(resolve(tmpdir(), "ehagaki-rx-patch-"));
        try {
            mkdirSync(resolve(root, "scripts")); mkdirSync(resolve(root, "node_modules/rx-nostr"), { recursive: true });
            for (const file of ["package.json", "package-lock.json", "scripts/verifyRxNostrPatch.mjs"])
                cpSync(file, resolve(root, file));
            cpSync("patches", resolve(root, "patches"), { recursive: true });
            for (const file of ["package.json", "src/rx-nostr/rx-nostr.ts", "dist/rx-nostr.js", "dist/rx-nostr.cjs", "dist/rx-nostr.umd.cjs"]) {
                mkdirSync(resolve(root, "node_modules/rx-nostr", file, ".."), { recursive: true });
                cpSync(resolve("node_modules/rx-nostr", file), resolve(root, "node_modules/rx-nostr", file));
            }
            const editJson = (file: string, change: (json: any) => void) => {
                const path = resolve(root, file); const json = JSON.parse(readFileSync(path, "utf8"));
                change(json); writeFileSync(path, JSON.stringify(json));
            };
            if (mode === "manifest-version") editJson("package.json", json => { json.dependencies["rx-nostr"] = "^3.7.8"; });
            if (mode === "lock-version") editJson("package-lock.json", json => { json.packages["node_modules/rx-nostr"].version = "3.7.9"; });
            if (mode === "nested-version") editJson("package-lock.json", json => { json.packages["node_modules/example/node_modules/rx-nostr"] = { version: "3.7.8" }; });
            if (mode === "installed-version") editJson("node_modules/rx-nostr/package.json", json => { json.version = "3.7.9"; });
            if (mode === "missing-patch") rmSync(resolve(root, "patches/rx-nostr+3.7.8.patch"));
            if (mode === "artifact-drift" || mode === "unpatched") {
                const file = resolve(root, "node_modules/rx-nostr/dist/rx-nostr.js");
                const content = readFileSync(file, "utf8");
                writeFileSync(file, mode === "artifact-drift" ? content + "\n// fixture drift\n"
                    : content.replace("eventId2 === event.id && targetRelayUrls.has(from)", "eventId2 === event.id"));
            }
            const result = spawnSync(process.execPath, [resolve(root, "scripts/verifyRxNostrPatch.mjs")], { encoding: "utf8" });
            expect(result.status).toBe(mode === "valid" ? 0 : 1);
            expect(mode === "valid" ? result.stdout : result.stderr).toContain("[rx-nostr-patch]");
        } finally { rmSync(root, { recursive: true, force: true }); }
    });
});
