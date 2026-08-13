import { access, cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceDirectory = join(repositoryRoot, "dist-web-component");
const siteDirectory = join(repositoryRoot, "dist", "web-component");

await access(join(sourceDirectory, "ehagaki-composer.js"));
await rm(siteDirectory, { recursive: true, force: true });
await mkdir(siteDirectory, { recursive: true });
await cp(sourceDirectory, siteDirectory, { recursive: true });

console.log(`Assembled Web Component distribution at ${siteDirectory}`);
