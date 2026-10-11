import { expect, test } from "@playwright/test";
import { finalizeEvent, generateSecretKey } from "nostr-tools";

const key = generateSecretKey();
const events = [1,6,16,42,1111,5,36].map(kind=>finalizeEvent({kind,content:"fixture",tags:kind===36?[["k","1"]]:[],created_at:123},key));

test("JSONL dialog ETA waits for saved samples and uses recent throughput", async ({ page }) => {
    await page.route(/\/src\/lib\/postHistoryJsonlImportService\.ts(?:\?|$)/, async route => {
        const response = await route.fetch();
        await route.fulfill({ response, body: `${await response.text()}
postHistoryJsonlImportService.importFile = input => new Promise(resolve => {
    const result = createEmptyResult();
    window.__JSONL_ETA_TEST__.emit = (bytes, saved) => {
        result.insertedPostCount = saved;
        input.onProgress({ result: { ...result }, processedBytes: bytes, totalBytes: 1000 });
    };
    input.signal.addEventListener('abort', () => resolve({ ...result, status: 'cancelled' }), { once: true });
});` });
    });
    await page.goto("post-history-dialog-playwright.html");
    await page.waitForFunction(() => Reflect.get(window, "__POST_HISTORY_HARNESS__")?.ready);
    await page.getByRole("button", { name: "投稿履歴メニューを開く" }).click();
    await page.getByRole("menuitem", { name: "JSONLをインポート" }).click();
    const dialog = page.locator(".post-history-import-dialog");
    await page.evaluate(() => {
        const state = { now: 0 };
        Reflect.set(window, "__JSONL_ETA_TEST__", state);
        Object.defineProperty(performance, "now", { configurable: true, value: () => state.now });
    });
    await dialog.locator('input[type="file"]').setInputFiles({ name: "fixture.jsonl", mimeType: "application/x-ndjson", buffer: Buffer.from("fixture") });
    await page.waitForFunction(() => typeof Reflect.get(window, "__JSONL_ETA_TEST__").emit === "function");
    const eta = dialog.locator(".import-progress-metric").filter({ hasText: "推定残り時間" });
    const progress = (now: number, bytes: number, saved: number) => page.evaluate(({ now, bytes, saved }) => {
        const state = Reflect.get(window, "__JSONL_ETA_TEST__"); state.now = now; state.emit(bytes, saved);
    }, { now, bytes, saved });
    await progress(1000, 710, 0);
    await progress(2000, 720, 0);
    await progress(3000, 730, 0);
    await expect(eta).toContainText("計算中");
    await progress(4000, 740, 500);
    await progress(5000, 745, 500);
    await expect(eta).toContainText("計算中");
    await progress(6000, 750, 500);
    await expect(eta).toContainText("0:50");
    await progress(14_000, 766, 1000);
    await progress(15_000, 768, 1000);
    await progress(16_000, 770, 1000);
    await expect(eta).toContainText("1:55");
    await dialog.getByRole("button", { name: "閉じる" }).click();
});

test("JSONL real Worker fully verifies all import kinds and survives invalid crypto fields",async({page})=>{
    await page.route("**/post-history-dialog-playwright.html",route=>route.fulfill({contentType:"text/html",body:"<!doctype html><title>Worker probe</title>"}));
    await page.goto("post-history-dialog-playwright.html");
    const result = await page.evaluate(async events=>{
        const moduleURL=new URL("src/lib/postHistoryRawEventVerification.ts",document.baseURI).href;
        const {createPostHistoryJsonlVerificationSession,isCurrentPostHistoryRawEventAttestation}=await import(moduleURL) as typeof import("../../lib/postHistoryRawEventVerification");
        const session=createPostHistoryJsonlVerificationSession();
        try {
            await session.ready;
            const outcomes=[];
            for(const event of [...events,{...events[0],id:"0".repeat(64)},{...events[0],sig:"g".repeat(128)},{...events[0],sig:"0".repeat(128)},{...events[0],sig:"00"},events[0]]) {
                const verified=await session.verify(event);
                outcomes.push(verified!==null&&isCurrentPostHistoryRawEventAttestation(verified.event,verified.attestation));
            }
            return outcomes;
        } finally {session.dispose();}
    },events);
    expect(result).toEqual([true,true,true,true,true,true,true,false,false,false,false,true]);
});

test("JSONL dialog close terminates a pending real Worker and reopen imports normally",async({page})=>{
    await page.addInitScript(()=>{
        const stats={created:0,terminated:0,held:0,hold:true};
        const NativeWorker=Worker;
        class TrackingWorker extends NativeWorker {
            tracked:boolean;
            constructor(url:string|URL,options?:WorkerOptions){super(url,options);this.tracked=String(url).includes("postHistoryJsonlVerificationWorker");if(this.tracked)stats.created++;}
            postMessage(message:unknown,transfer?:Transferable[]|StructuredSerializeOptions):void {
                if(this.tracked&&stats.hold&&typeof message==="object"&&message!==null&&"reqId" in message){stats.held++;return;}
                if(Array.isArray(transfer))super.postMessage(message,transfer);else super.postMessage(message,transfer);
            }
            terminate():void{if(this.tracked)stats.terminated++;super.terminate();}
        }
        Reflect.set(window,"Worker",TrackingWorker);Reflect.set(window,"__JSONL_WORKERS__",stats);
    });
    await page.goto("post-history-dialog-playwright.html");
    await page.waitForFunction(()=>Reflect.get(window,"__POST_HISTORY_HARNESS__")?.ready);
    const jsonl=await page.evaluate(()=>String(Reflect.get(window,"__POST_HISTORY_HARNESS__").importEventJsonl));
    const open=async()=>{
        await page.getByRole("button",{name:"投稿履歴メニューを開く"}).click();
        await page.getByRole("menuitem",{name:"JSONLをインポート"}).click();
    };
    await open();
    const dialog=page.locator(".post-history-import-dialog");
    await dialog.locator('input[type="file"]').setInputFiles({name:"fixture.jsonl",mimeType:"application/x-ndjson",buffer:Buffer.from(jsonl)});
    await expect.poll(()=>page.evaluate(()=>Reflect.get(window,"__JSONL_WORKERS__").held)).toBe(1);
    await dialog.getByRole("button",{name:"閉じる"}).click();
    await expect.poll(()=>page.evaluate(()=>Reflect.get(window,"__JSONL_WORKERS__").terminated)).toBe(4);
    await page.evaluate(()=>{Reflect.get(window,"__JSONL_WORKERS__").hold=false;});
    await open();
    await dialog.locator('input[type="file"]').setInputFiles({name:"fixture.jsonl",mimeType:"application/x-ndjson",buffer:Buffer.from(jsonl)});
    await expect(dialog.getByText("読み込みが完了しました")).toBeVisible();
    expect(await page.evaluate(()=>Reflect.get(window,"__JSONL_WORKERS__"))).toMatchObject({created:8,terminated:8});
});

test("JSONL real Worker pool handles child failure, abort, and atomic startup failure", async ({page}) => {
    await page.route("**/post-history-dialog-playwright.html", route=>route.fulfill({contentType:"text/html",body:"<!doctype html><title>Worker failure probe</title>"}));
    await page.goto("post-history-dialog-playwright.html");
    const outcomes = await page.evaluate(async event => {
        const {createPostHistoryJsonlVerificationSession} = await import(new URL("src/lib/postHistoryRawEventVerification.ts",document.baseURI).href) as typeof import("../../lib/postHistoryRawEventVerification");
        const NativeWorker=Worker;
        const outcomes=[];
        for(const reason of ["error","messageerror","host error","abort","creation","start"]) {
            const workers: TrackingWorker[]=[];
            let attempts=0, fatalCount=0, cleanedAtFatal=false;
            class TrackingWorker extends NativeWorker {
                terminated=false;
                requests=0;
                constructor(url:string|URL,options?:WorkerOptions) {
                    attempts++;
                    if(reason==="creation"&&attempts===3)throw new Error("creation failed");
                    super(url,options);workers.push(this);
                }
                override postMessage(message:unknown):void {
                    if(message==="ping") {
                        if(reason==="start"&&workers.length===3)throw new Error("start failed");
                        super.postMessage(message);
                    } else this.requests++;
                }
                override terminate():void{this.terminated=true;super.terminate();}
            }
            Reflect.set(window,"Worker",TrackingWorker);
            const controller=new AbortController();
            const session=createPostHistoryJsonlVerificationSession({signal:controller.signal,onFatal:()=>{fatalCount++;cleanedAtFatal=workers.every(worker=>worker.terminated);}});
            if(reason==="creation"||reason==="start") {
                const ready=await Promise.allSettled([session.ready]);
                outcomes.push({reason,attempts,created:workers.length,ready:ready[0].status,fatalCount,cleanedAtFatal,terminated:workers.every(worker=>worker.terminated)});
            } else {
                await session.ready;
                const pending=Promise.allSettled(Array.from({length:8},()=>session.verify(event)));
                while(workers.some(worker=>worker.requests!==2))await new Promise(resolve=>setTimeout(resolve,0));
                workers[0].dispatchEvent(new MessageEvent("message",{data:{reqId:1,ok:false}}));
                if(reason==="abort")controller.abort();
                else if(reason==="host error")workers[3].dispatchEvent(new MessageEvent("message",{data:{reqId:1,ok:false,error:"unexpected failure"}}));
                else workers[3].dispatchEvent(new Event(reason));
                const results=await pending;
                outcomes.push({reason,attempts,created:workers.length,rejected:results.filter(result=>result.status==="rejected").length,fatalCount,cleanedAtFatal,terminated:workers.every(worker=>worker.terminated)});
            }
            session.dispose();
        }
        Reflect.set(window,"Worker",NativeWorker);
        return outcomes;
    },events[0]);
    expect(outcomes).toEqual([
        ...["error","messageerror","host error"].map(reason=>({reason,attempts:4,created:4,rejected:8,fatalCount:1,cleanedAtFatal:true,terminated:true})),
        {reason:"abort",attempts:4,created:4,rejected:8,fatalCount:0,cleanedAtFatal:false,terminated:true},
        {reason:"creation",attempts:3,created:2,ready:"rejected",fatalCount:1,cleanedAtFatal:true,terminated:true},
        {reason:"start",attempts:3,created:3,ready:"rejected",fatalCount:1,cleanedAtFatal:true,terminated:true},
    ]);
});
