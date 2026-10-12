// Standalone benchmark; no fixtures or instrumentation enter the application build.
import { createServer } from "vite";
import { chromium } from "playwright";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const { values } = parseArgs({ options: {
    serve: { type: "boolean", default: false },
    host: { type: "string", default: "127.0.0.1" },
    port: { type: "string", default: "51561" },
    fixture: { type: "string", default: "node_modules/.cache/jsonl-benchmark-fixture.json" },
    jsonl: { type: "string" },
    workers: { type: "string", default: "4" },
    "compare-workers": { type: "boolean", default: false },
    channel: { type: "string" },
} });
const workerCount = Number(values.workers);
if (![1, 2, 4].includes(workerCount)) throw new Error("--workers must be 1, 2, or 4");

// Also serialized into the manual measurement page. All file processing and
// storage stay on the measuring device, in a disposable database per run.
async function measure(file, owner, workerCount = 4) {
    const load = path => import(new URL(`src/lib/${path}.ts`, document.baseURI).href);
    const [serviceModule, dbModule, postsModule, deletionsModule, payloadsModule, rangesModule, scopeModule, verificationModule] = await Promise.all([
        load("postHistoryJsonlImportService"), load("storage/ehagakiDb"),
        load("storage/postHistoryRepository"), load("storage/postHistoryDeletionRequestsRepository"),
        load("storage/sensitivePayloadRepository"), load("storage/postHistoryImportedRangesRepository"),
        load("storage/postHistoryLocalWriteScope"),
        load("postHistoryRawEventVerification"),
    ]);
    const runId = [...crypto.getRandomValues(new Uint32Array(4))].map(value => value.toString(16)).join("-");
    const db = new dbModule.EHagakiDB(`ehagaki-jsonl-benchmark-${runId}`);
    await db.open();
    let postHistoryGetCalls = 0;
    const getPost = db.postHistory.get.bind(db.postHistory);
    db.postHistory.get = (...args) => { postHistoryGetCalls++; return getPost(...args); };
    let candidateAuthorScanCalls = 0;
    const where = db.postHistory.where.bind(db.postHistory);
    db.postHistory.where = (index, ...args) => {
        const clause = where(index, ...args);
        if (index === "pubkeyHex") {
            const equals = clause.equals.bind(clause);
            clause.equals = (...args) => {
                const collection = equals(...args);
                const toArray = collection.toArray.bind(collection);
                collection.toArray = (...args) => { candidateAuthorScanCalls++; return toArray(...args); };
                return collection;
            };
        }
        return clause;
    };
    const posts = new postsModule.DexiePostHistoryRepository(db);
    let repositoryMs = 0;
    const service = new serviceModule.PostHistoryJsonlImportService({
        verificationSessionFactory: options => verificationModule.createPostHistoryJsonlVerificationSession({ ...options, workerCount }),
        postHistoryRepository: { upsertFetchedEvents: async input => {
            const start = performance.now();
            try { return await posts.upsertFetchedEvents(input); }
            finally { repositoryMs += performance.now() - start; }
        } },
        deletionRequestsRepository: new deletionsModule.DexiePostHistoryDeletionRequestsRepository(db),
        sensitivePayloadRepository: new payloadsModule.DexieSensitivePayloadRepository(db),
        importedRangesRepository: new rangesModule.DexiePostHistoryImportedRangesRepository(db),
        getLocalRevision: pubkey => scopeModule.getPostHistoryLocalRevision(db, pubkey),
    });
    const longTasks = [];
    const supportsLongTasks = PerformanceObserver.supportedEntryTypes.includes("longtask");
    const observer = supportsLongTasks ? new PerformanceObserver(list => {
        longTasks.push(...list.getEntries().map(entry => entry.duration));
    }) : null;
    observer?.observe({ type: "longtask" });
    let heartbeat = performance.now(), frame = heartbeat, heartbeatGapMs = 0, frameGapMs = 0, frameId;
    const timer = setInterval(() => {
        const now = performance.now(); heartbeatGapMs = Math.max(heartbeatGapMs, now - heartbeat); heartbeat = now;
    }, 16);
    const onFrame = now => { frameGapMs = Math.max(frameGapMs, now - frame); frame = now; frameId = requestAnimationFrame(onFrame); };
    frameId = requestAnimationFrame(onFrame);
    const started = performance.now();
    try {
        const result = await service.importFile({ file, ownerPubkeyHex: owner, getCurrentPubkeyHex: () => owner });
        const wallMs = performance.now() - started;
        await new Promise(resolve => setTimeout(resolve, 0));
        longTasks.push(...(observer?.takeRecords() ?? []).map(entry => entry.duration));
        return { workerCount, wallMs, repositoryMs, postHistoryGetCalls, candidateAuthorScanCalls, heartbeatGapMs, frameGapMs,
            longTaskCount: supportsLongTasks ? longTasks.length : null,
            longestTaskMs: supportsLongTasks ? Math.max(0, ...longTasks) : null, result };
    } finally {
        clearInterval(timer); cancelAnimationFrame(frameId); observer?.disconnect();
        db.close(); await db.delete();
    }
}

const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>JSONL import measurement</title>
<h1>JSONL import measurement</h1>
<p>Each run uses a fresh disposable database and Worker pool. File contents stay on this device.
Select the same file and account public key for comparisons. Keep this tab foreground.</p>
<label>Account public key (64 lowercase hex) <input id="owner" size="64" pattern="[0-9a-f]{64}" required></label>
<label>Workers <select id="workers"><option>1</option><option>2</option><option selected>4</option></select></label>
<p><input id="file" type="file" accept=".jsonl"><button id="run">Measure once</button></p><pre id="output"></pre>
<script type="module">
const measure = ${measure.toString()};
window.measureJsonlImport = measure;
document.querySelector('#run').onclick = async () => {
    const button = document.querySelector('#run'), output = document.querySelector('#output');
    const file = document.querySelector('#file').files[0], owner = document.querySelector('#owner').value;
    if (!file || !/^[0-9a-f]{64}$/.test(owner)) { output.textContent = 'Select a JSONL file and enter its account public key.'; return; }
    button.disabled = true; output.textContent = 'Measuring…';
    try { output.textContent = JSON.stringify(await measure(file, owner, Number(document.querySelector('#workers').value)), null, 2); }
    catch { output.textContent = 'Measurement failed.'; }
    finally { button.disabled = false; }
};
</script>`;
const server = await createServer({ root: fileURLToPath(new URL("../", import.meta.url)), base: "/ehagaki/",
    server: { host: values.host, port: Number(values.port), strictPort: true },
    plugins: [{ name: "jsonl-measurement-page", configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url?.split("?")[0] !== "/ehagaki/jsonl-benchmark.html") return next();
            res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(html);
        });
    } }],
});
await server.listen();
const url = `http://127.0.0.1:${values.port}/ehagaki/jsonl-benchmark.html`;
if (values.serve) {
    console.log(`Measurement page: ${url}`);
    console.log("For another device use this computer's LAN IP and --host 0.0.0.0. Ctrl+C stops the server.");
} else {
    let browser;
    try {
        let fixture;
        let expectedPosts = 10_000;
        if (values.jsonl) {
            // Infer the primary account outside the timer; never print keys or events.
            const counts = new Map();
            for await (const line of createInterface({ input: createReadStream(values.jsonl), crlfDelay: Infinity })) {
                if (!line.trim()) continue;
                let event;
                try { event = JSON.parse(line); }
                catch { throw new Error("Benchmark fixture must contain valid JSON events"); }
                if ([1, 6, 16, 42, 1111].includes(event.kind)) counts.set(event.pubkey, (counts.get(event.pubkey) ?? 0) + 1);
            }
            const [owner, count] = [...counts].sort((a, b) => b[1] - a[1])[0];
            fixture = { owner }; expectedPosts = count;
        } else try { fixture = JSON.parse(await readFile(values.fixture, "utf8")); }
        catch (error) {
            if (error.code !== "ENOENT") throw error;
            const secret = generateSecretKey();
            fixture = { owner: getPublicKey(secret), jsonl: Array.from({ length: 10_000 }, (_, index) => JSON.stringify(
                finalizeEvent({ kind: 1, content: `synthetic-${index}`, tags: [], created_at: 1_700_000_000 + index }, secret),
            )).join("\n") + "\n" };
            await mkdir(fileURLToPath(new URL("../node_modules/.cache/", import.meta.url)), { recursive: true });
            await writeFile(values.fixture, JSON.stringify(fixture));
        }
        browser = await chromium.launch({ headless: true, channel: values.channel });
        console.log(JSON.stringify({ browser: browser.version(), viewport: "1280x720", base: "/ehagaki/", fixture: values.jsonl ? "real JSONL" : "synthetic 10,000 posts", freshPagePerRun: true, warmups: 1, runs: 5 }));
        for (const workers of values["compare-workers"] ? [1, 2, 4] : [workerCount]) for (let run = 0; run < 6; run++) {
            // Release the previous renderer's fixture/module state between large runs.
            const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
            try {
                await page.goto(url);
                await page.waitForFunction(() => typeof window.measureJsonlImport === "function");
                if (values.jsonl) await page.locator('#file').setInputFiles(values.jsonl);
                const measurement = await page.evaluate(async ({fixture, workers}) => window.measureJsonlImport(
                    fixture.jsonl ? new File([fixture.jsonl], "benchmark.jsonl") : document.querySelector('#file').files[0], fixture.owner, workers,
                ), {fixture, workers});
                if (measurement.result.status !== "completed" || measurement.result.insertedPostCount !== expectedPosts) {
                    throw new Error("Unexpected benchmark result");
                }
                console.log(JSON.stringify({ run, warmup: run === 0, ...measurement }));
            } finally { await page.close(); }
        }
    } finally { await browser?.close(); await server.close(); }
}
