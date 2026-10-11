import { expect, test } from "@playwright/test";
import { finalizeEvent, generateSecretKey } from "nostr-tools";

const key = generateSecretKey();
const events = [1,6,16,42,1111,5,36].map(kind=>finalizeEvent({kind,content:"fixture",tags:kind===36?[["k","1"]]:[],created_at:123},key));

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
    await expect.poll(()=>page.evaluate(()=>Reflect.get(window,"__JSONL_WORKERS__").terminated)).toBe(1);
    await page.evaluate(()=>{Reflect.get(window,"__JSONL_WORKERS__").hold=false;});
    await open();
    await dialog.locator('input[type="file"]').setInputFiles({name:"fixture.jsonl",mimeType:"application/x-ndjson",buffer:Buffer.from(jsonl)});
    await expect(dialog.getByText("読み込みが完了しました")).toBeVisible();
    expect(await page.evaluate(()=>Reflect.get(window,"__JSONL_WORKERS__"))).toMatchObject({created:2,terminated:2});
});
