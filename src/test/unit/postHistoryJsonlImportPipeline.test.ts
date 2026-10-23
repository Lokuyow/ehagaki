import { describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { PostHistoryJsonlImportService, POST_HISTORY_JSONL_IMPORT_QUEUE_SIZE } from "../../lib/postHistoryJsonlImportService";
import { createPostHistoryJsonlVerificationSession } from "../../lib/postHistoryRawEventVerification";
import { PostHistoryLocalWriteStaleError } from "../../lib/storage/postHistoryLocalWriteScope";
import { PostHistoryJsonlVerificationWorkerMock as MockWorker } from "../mocks/postHistoryJsonlVerificationWorker";

const key = generateSecretKey();
const owner = getPublicKey(key);
const post = finalizeEvent({kind:1,content:"post",tags:[],created_at:100},key);
const payload = finalizeEvent({kind:36,content:"payload",tags:[["k","1"]],created_at:101},key);
const deletion = finalizeEvent({kind:5,content:"",tags:[["e",post.id]],created_at:102},key);
const other = finalizeEvent({kind:1,content:"other",tags:[],created_at:100},generateSecretKey());
const unsupported = finalizeEvent({kind:7,content:"",tags:[],created_at:100},key);
const lines = [post,payload,deletion,post,{...post,sig:"g".repeat(128)},other,unsupported].map(e=>JSON.stringify(e)).concat("{malformed");
const bytes = new TextEncoder().encode(lines.join("\n")+"\n");

function setup(worker = new MockWorker(), data = bytes, workerCount: 1 | 2 | 4 = 1) {
    const workers = [worker, ...Array.from({length:workerCount-1},()=>new MockWorker())];
    workers.forEach(worker=>{worker.hold=true;});
    let nextWorker = 0;
    let currentOwner = owner, revision = 0;
    const controller = new AbortController();
    const posts = vi.fn(async (input:{events:unknown[]})=>({insertedCount:input.events.length,updatedCount:0,unchangedCount:0,appliedDeletionCount:0}));
    const deletions = vi.fn(async (input:{deletionEvents:unknown[]})=>({insertedCount:input.deletionEvents.length,updatedCount:0,unchangedCount:0,ignoredCount:0,appliedDeletionCount:0}));
    const payloads = vi.fn(async ()=>undefined);
    const ranges = vi.fn(async (_scope: { isActive: () => boolean })=>true);
    const getRevision = vi.fn(async()=>revision);
    const service = new PostHistoryJsonlImportService({
        verificationSessionFactory:options=>createPostHistoryJsonlVerificationSession({...options,workerCount,workerFactory:()=>workers[nextWorker++]}),
        getLocalRevision:getRevision,
        postHistoryRepository:{upsertFetchedEvents:posts},deletionRequestsRepository:{upsertImportedDeletionEvents:deletions},
        sensitivePayloadRepository:{putCandidate:payloads},importedRangesRepository:{record:ranges},
    });
    let streamController!: ReadableStreamDefaultController<Uint8Array<ArrayBuffer>>;
    const stream = new ReadableStream<Uint8Array<ArrayBuffer>>({start(c){streamController=c;c.enqueue(data);}});
    const run = () => service.importFile({file:{name:"citrine-1700000000000.jsonl",size:data.length,stream:()=>stream},ownerPubkeyHex:owner,getCurrentPubkeyHex:()=>currentOwner,signal:controller.signal});
    return {worker,workers,controller,posts,deletions,payloads,ranges,getRevision,run,streamController,setOwner:()=>{currentOwner=other.pubkey;},setRevision:()=>{revision++;}};
}

describe("bounded JSONL pipeline",()=>{
    it.each(["read","decode"])("drains all submitted classifications after %s failure",async failure=>{
        const h=setup();const result=h.run();
        await vi.waitFor(()=>expect(h.worker.requests).toHaveLength(5));
        if(failure==="read")h.streamController.error(new Error("read failed"));
        else h.streamController.enqueue(new Uint8Array([0xff]));
        h.worker.deliveries.reverse();h.worker.release();
        expect(await result).toMatchObject({status:"partial",nonEmptyLineCount:8,insertedPostCount:1,savedPayloadCandidateCount:1,insertedDeletionRequestCount:1,fileDuplicateCount:1,invalidIdOrSignatureCount:1,invalidJsonCount:1,otherAccountCount:1,unsupportedKindCount:1});
        expect(h.posts.mock.calls[0][0].events).toHaveLength(1);
        expect(h.ranges).not.toHaveBeenCalled();expect(h.worker.terminated).toBe(true);
    });

    it.each(["worker","abort","account","revision"])("does not drain pending lines on %s stop after read failure",async reason=>{
        const h=setup();const result=h.run();
        await vi.waitFor(()=>expect(h.worker.requests).toHaveLength(5));
        h.streamController.error(new Error("read failed"));
        if(reason==="worker")h.worker.dispatchEvent(new Event("error"));
        else if(reason==="abort")h.controller.abort();
        else if(reason==="account")h.setOwner();
        else h.setRevision();
        h.worker.release();
        expect(await result).toMatchObject({status:reason==="worker"?"partial":reason==="account"?"account-changed":"cancelled",invalidIdOrSignatureCount:0,insertedPostCount:0,savedPayloadCandidateCount:0});
        expect(h.posts).not.toHaveBeenCalled();expect(h.deletions).not.toHaveBeenCalled();expect(h.payloads).not.toHaveBeenCalled();expect(h.ranges).not.toHaveBeenCalled();
    });

    it("caps pending requests and saves only the consumed prefix on host fatal",async()=>{
        const worker=new MockWorker();
        const send=worker.postMessage.bind(worker);
        vi.spyOn(worker,"postMessage").mockImplementation(message=>{
            worker.hold=message!=="ping"&&message.reqId>1;send(message);
        });
        const input=new TextEncoder().encode(Array.from({length:100},()=>JSON.stringify(post)).join("\n"));
        const h=setup(worker,input);
        const result=h.run();
        await vi.waitFor(()=>expect(worker.requests.length).toBe(POST_HISTORY_JSONL_IMPORT_QUEUE_SIZE+1));
        worker.reply({reqId:worker.requests[1].reqId,ok:false,error:"runtime failure"});
        const summary=await result;
        expect(summary).toMatchObject({status:"partial",insertedPostCount:1,invalidIdOrSignatureCount:0,uniquePostEventCount:1});
        expect(h.deletions).not.toHaveBeenCalled();expect(h.payloads).not.toHaveBeenCalled();
    });

    it("reports startup failure before reading any input",async()=>{
        const stream=vi.fn();
        const service=new PostHistoryJsonlImportService({getLocalRevision:async()=>0,verificationSessionFactory:()=>{throw new Error("Worker unavailable");}});
        const result=await service.importFile({file:{size:10,stream},ownerPubkeyHex:owner,getCurrentPubkeyHex:()=>owner});
        expect(result).toMatchObject({status:"failed",nonEmptyLineCount:0,invalidIdOrSignatureCount:0});expect(stream).not.toHaveBeenCalled();
    });

    it.each(["worker","abort","account","revision"])("stops an already-started input-failure drain on %s",async reason=>{
        const h=setup();const result=h.run();
        await vi.waitFor(()=>expect(h.worker.requests).toHaveLength(5));
        h.streamController.enqueue(new Uint8Array([0xff]));
        h.worker.deliveries.shift()!();
        await vi.waitFor(()=>expect(h.getRevision.mock.calls.length).toBeGreaterThanOrEqual(3));
        if(reason==="worker")h.worker.dispatchEvent(new Event("messageerror"));
        else if(reason==="abort")h.controller.abort();else if(reason==="account")h.setOwner();else h.setRevision();
        h.worker.release();
        const summary=await result;
        expect(summary.status).toBe(reason==="worker"?"partial":reason==="account"?"account-changed":"cancelled");
        expect(summary.savedPayloadCandidateCount).toBe(0);expect(summary.insertedDeletionRequestCount).toBe(0);
        expect(summary.insertedPostCount).toBe(reason==="worker"?1:0);
        expect(h.ranges).not.toHaveBeenCalled();
    });

    it("isolates two concurrent imports and disposes both Workers",async()=>{
        const first=setup(),second=setup();const results=[first.run(),second.run()];
        await vi.waitFor(()=>expect([first.worker.requests.length,second.worker.requests.length]).toEqual([5,5]));
        first.controller.abort();second.streamController.close();second.worker.release();
        expect((await Promise.all(results)).map(r=>r.status)).toEqual(["cancelled","partial"]);
        expect(first.posts).not.toHaveBeenCalled();expect(second.posts).toHaveBeenCalledOnce();
        expect(first.worker.terminated&&second.worker.terminated).toBe(true);
    });

    it.each(["flush", "range"])("keeps a Worker fatal during final %s out of restoration continuity", async phase => {
        const h = setup(new MockWorker(), new TextEncoder().encode(JSON.stringify(post)));
        if (phase === "flush") {
            h.posts.mockImplementationOnce(async input => {
                h.worker.dispatchEvent(new Event("error"));
                return { insertedCount: input.events.length, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 };
            });
        } else {
            h.ranges.mockImplementationOnce(async scope => {
                h.worker.dispatchEvent(new Event("error"));
                expect(scope.isActive()).toBe(false);
                throw new PostHistoryLocalWriteStaleError();
            });
        }
        const result = h.run();
        h.streamController.close();
        await vi.waitFor(() => expect(h.worker.requests).toHaveLength(1));
        h.worker.release();
        expect(await result).toMatchObject({ status: "partial", insertedPostCount: 1, invalidIdOrSignatureCount: 0 });
        if (phase === "flush") expect(h.ranges).not.toHaveBeenCalled();
        expect(h.worker.terminated).toBe(true);
    });
});

describe.each([2,4] as const)("JSONL pipeline with %i Workers", workerCount => {
    it.each(["read","decode"])("drains all submitted lines in file order after %s failure", async failure => {
        const h=setup(new MockWorker(),bytes,workerCount); const result=h.run();
        await vi.waitFor(()=>expect(h.workers.flatMap(worker=>worker.requests)).toHaveLength(5));
        if(failure==="read")h.streamController.error(new Error("read failed"));
        else h.streamController.enqueue(new Uint8Array([0xff]));
        // Deliver later workers and later requests first.
        for(const worker of [...h.workers].reverse()){worker.deliveries.reverse();worker.release();}
        expect(await result).toMatchObject({status:"partial",nonEmptyLineCount:8,insertedPostCount:1,savedPayloadCandidateCount:1,insertedDeletionRequestCount:1,fileDuplicateCount:1,invalidIdOrSignatureCount:1,invalidJsonCount:1,otherAccountCount:1,unsupportedKindCount:1});
        expect(h.ranges).not.toHaveBeenCalled();
        expect(h.workers.every(worker=>worker.terminated)).toBe(true);
    });

    it.each(["worker","abort","account","revision"])("stops an input-failure drain on %s without consuming ahead results", async reason => {
        const h=setup(new MockWorker(),bytes,workerCount); const result=h.run();
        await vi.waitFor(()=>expect(h.workers.flatMap(worker=>worker.requests)).toHaveLength(5));
        h.streamController.error(new Error("read failed"));
        h.worker.deliveries.shift()!();
        await vi.waitFor(()=>expect(h.getRevision.mock.calls.length).toBeGreaterThanOrEqual(3));
        if(reason==="worker")h.workers.at(-1)!.dispatchEvent(new Event("messageerror"));
        else if(reason==="abort")h.controller.abort();else if(reason==="account")h.setOwner();else h.setRevision();
        h.workers.forEach(worker=>worker.release());
        expect(await result).toMatchObject({status:reason==="worker"?"partial":reason==="account"?"account-changed":"cancelled",insertedPostCount:reason==="worker"?1:0,savedPayloadCandidateCount:0,insertedDeletionRequestCount:0,invalidIdOrSignatureCount:0});
        expect(h.ranges).not.toHaveBeenCalled();
        expect(h.workers.every(worker=>worker.terminated)).toBe(true);
    });

    it("keeps a global queue of 32 and saves only the consumed prefix on another child's fatal", async () => {
        const input=new TextEncoder().encode(Array.from({length:100},()=>JSON.stringify(post)).join("\n"));
        const h=setup(new MockWorker(),input,workerCount); const result=h.run();
        await vi.waitFor(()=>expect(h.workers.flatMap(worker=>worker.requests)).toHaveLength(32));
        // Responses ahead of the blocked first line must not be counted/saved.
        h.workers[1].reply({reqId:1,ok:true});
        expect(h.posts).not.toHaveBeenCalled();
        h.worker.deliveries.shift()!();
        // The first two lines can now be consumed, but no additional line.
        await vi.waitFor(()=>expect(h.workers.flatMap(worker=>worker.requests)).toHaveLength(34));
        h.workers.at(-1)!.dispatchEvent(new Event("error"));
        expect(await result).toMatchObject({status:"partial",insertedPostCount:1,fileDuplicateCount:1,invalidIdOrSignatureCount:0});
        expect(h.workers.every(worker=>worker.terminated)).toBe(true);
    });

    it("preserves file-order batches of 500 across reverse child responses", async () => {
        const posts=Array.from({length:501},(_,index)=>finalizeEvent({kind:1,content:String(index),tags:[],created_at:index+100},key));
        const h=setup(new MockWorker(),new TextEncoder().encode(posts.map(post=>JSON.stringify(post)).join("\n")),workerCount);
        const saved: string[] = [];
        h.posts.mockImplementation(async input=>{
            saved.push(...input.events.map(event=>(event as {event:{content:string}}).event.content));
            return {insertedCount:input.events.length,updatedCount:0,unchangedCount:0,appliedDeletionCount:0};
        });
        const result=h.run();h.streamController.close();
        await vi.waitFor(()=>expect(h.workers.flatMap(worker=>worker.requests)).toHaveLength(32));
        h.workers.forEach(worker=>{worker.hold=false;});
        for(const worker of [...h.workers].reverse()){worker.deliveries.reverse();worker.release();}
        expect(await result).toMatchObject({status:"completed",insertedPostCount:501});
        expect(h.posts.mock.calls.map(([input])=>input.events.length)).toEqual([500,1]);
        expect(saved).toEqual(posts.map(post=>post.content));
        expect(h.ranges).toHaveBeenCalledOnce();
    });
});
