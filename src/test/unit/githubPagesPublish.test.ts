import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { expect, it } from "vitest";

const run = promisify(execFile);

it("publishes underscore-prefixed precache assets with Jekyll disabled", async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), "ehagaki-pages-"));
    try {
        const remote = join(temporaryRoot, "remote.git");
        const cache = join(temporaryRoot, "cache");
        const asset = "assets/__vite-browser-external-bridge-AbCd1234.js";
        const body = "export default {};";
        await mkdir(join(temporaryRoot, "dist", "assets"), { recursive: true });
        await writeFile(join(temporaryRoot, "dist", asset), body);
        await writeFile(join(temporaryRoot, "dist", "index.html"), "<!doctype html>");
        await run("git", ["init", "--bare", remote]);

        const { scripts } = JSON.parse(await readFile(resolve("package.json"), "utf8"));
        const [command, ...args] = scripts.deploy.split(/\s+/);
        expect(command).toBe("gh-pages");
        // Exercise the real deploy options against an isolated local repository.
        // Never push or use the application's origin remote in this test.
        await run(process.execPath, [
            resolve("node_modules/gh-pages/bin/gh-pages.js"), ...args,
            "--repo", pathToFileURL(remote).href, "--no-push",
            "--user", "Pages test <pages-test@example.invalid>",
        ], {
            cwd: temporaryRoot,
            env: { ...process.env, CACHE_DIR: cache },
        });

        const cacheDirectory = join(cache, "gh-pages");
        const clones = await readdir(cacheDirectory);
        expect(clones).toHaveLength(1);
        const clone = join(cacheDirectory, clones[0]);
        const { stdout } = await run("git", ["-C", clone, "ls-tree", "-r", "--name-only", "HEAD"]);
        expect(stdout.trim().split(/\r?\n/)).toEqual([".nojekyll", asset, "index.html"]);
        expect(await readFile(join(clone, asset), "utf8")).toBe(body);
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});
