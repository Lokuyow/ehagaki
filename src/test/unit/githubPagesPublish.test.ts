import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { expect, it } from "vitest";

const run = promisify(execFile);

it.each([false, true])("publishes underscore assets and replaces a large existing site: %s", async (existingSite) => {
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
        let previousCommit: string | undefined;
        if (existingSite) {
            const seed = join(temporaryRoot, "seed");
            await mkdir(join(seed, "assets"), { recursive: true });
            // More than 32,767 characters when gh-pages expands git rm's arguments.
            for (let index = 0; index < 500; index++) {
                await writeFile(join(seed, "assets", `old-chunk-${index}-${"x".repeat(60)}.js`), "old");
            }
            await run("git", ["init", "--initial-branch=gh-pages", seed]);
            await run("git", ["-C", seed, "add", "."]);
            await run("git", [
                "-C", seed, "-c", "user.name=Pages test", "-c", "user.email=pages-test@example.invalid",
                "-c", "commit.gpgsign=false", "commit", "-m", "Previous site",
            ]);
            previousCommit = (await run("git", ["-C", seed, "rev-parse", "HEAD"])).stdout.trim();
            await run("git", ["-C", seed, "push", pathToFileURL(remote).href, "HEAD:gh-pages"]);
        }

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
        if (previousCommit) {
            expect((await run("git", ["-C", clone, "rev-parse", "HEAD^"])).stdout.trim()).toBe(previousCommit);
        }
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});
