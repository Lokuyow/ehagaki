import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { createPostHistoryJsonlVerificationSession, isCurrentPostHistoryRawEventAttestation } from "../../lib/postHistoryRawEventVerification";
import { PostHistoryJsonlVerificationWorkerMock as MockWorker } from "../mocks/postHistoryJsonlVerificationWorker";

const signed = finalizeEvent({kind:1,content:"signed fixture",tags:[["t","test"]],created_at:123}, generateSecretKey());
afterEach(() => { vi.useRealTimers(); });

describe("JSONL verification session", () => {
    it("waits for pong before sending events, and attests its isolated snapshot", async () => {
        const worker = new MockWorker();
        vi.spyOn(worker, "postMessage").mockImplementationOnce(() => undefined);
        const session = createPostHistoryJsonlVerificationSession({workerFactory:()=>worker});
        const source = {...signed,tags:signed.tags.map(t=>[...t])};
        const result = session.verify(source);
        source.content = "changed during startup";
        source.tags[0][1] = "changed";
        await Promise.resolve();
        expect(worker.requests).toHaveLength(0);
        worker.reply("pong");
        const attested = await result;
        expect(attested?.event.content).toBe(signed.content);
        expect(attested?.event.tags).toEqual(signed.tags);
        expect(isCurrentPostHistoryRawEventAttestation(attested!.event, attested!.attestation)).toBe(true);
        attested!.event.sig = "0".repeat(128);
        expect(isCurrentPostHistoryRawEventAttestation(attested!.event, attested!.attestation)).toBe(false);
        session.dispose();
        expect(worker.terminated).toBe(true);
    });

    it("rejects cached invalid input without killing the Worker", async () => {
        const worker = new MockWorker();
        const session = createPostHistoryJsonlVerificationSession({workerFactory:()=>worker});
        expect(await session.verify({...signed,sig:"g".repeat(128)})).toBeNull();
        expect(await session.verify({...signed,sig:"0".repeat(128)})).toBeNull();
        expect(await session.verify({...signed})).not.toBeNull();
        session.dispose();
    });

    it.each(["error", "messageerror", "host error", "dispose", "abort"])("ends pending operations immediately on %s", async reason => {
        const worker = new MockWorker(); worker.hold = true;
        const controller = new AbortController();
        const session = createPostHistoryJsonlVerificationSession({workerFactory:()=>worker,signal:controller.signal});
        await session.ready;
        const operations = [session.verify(signed), session.verify(signed)];
        const settled = Promise.allSettled(operations);
        await vi.waitFor(()=>expect(worker.requests).toHaveLength(2));
        if(reason === "abort") controller.abort();
        else if(reason === "dispose") session.dispose();
        else if(reason === "host error") worker.reply({reqId:worker.requests[0].reqId,ok:false,error:"unexpected failure"});
        else worker.dispatchEvent(new Event(reason));
        expect((await settled).map(r=>r.status)).toEqual(["rejected","rejected"]);
        expect(worker.terminated).toBe(true);
        worker.release();
        await expect(session.verify(signed)).rejects.toThrow();
        session.dispose();
    });

    it("owns readiness and pending-request deadlines", async () => {
        vi.useFakeTimers();
        const booting = new MockWorker();
        vi.spyOn(booting,"postMessage").mockImplementation(()=>undefined);
        const first = createPostHistoryJsonlVerificationSession({workerFactory:()=>booting});
        const readiness = expect(first.ready).rejects.toThrow("readiness_timeout");
        await vi.advanceTimersByTimeAsync(10000); await readiness;
        expect(booting.terminated).toBe(true);

        const worker = new MockWorker(); worker.hold = true;
        const session = createPostHistoryJsonlVerificationSession({workerFactory:()=>worker});
        worker.reply("pong"); await vi.advanceTimersByTimeAsync(0); await session.ready;
        const verification = expect(session.verify(signed)).rejects.toThrow("verification_timeout");
        await vi.advanceTimersByTimeAsync(10000); await verification;
        expect(worker.terminated).toBe(true);
    });

    it("fails startup without invoking a main-thread signature fallback", async () => {
        const worker = new MockWorker();
        vi.spyOn(worker,"postMessage").mockImplementation(()=>{throw new Error("startup failure");});
        const session = createPostHistoryJsonlVerificationSession({workerFactory:()=>worker});
        await expect(session.ready).rejects.toThrow("worker_failed");
        await expect(session.verify(signed)).rejects.toThrow("worker_failed");
        expect(worker.requests).toHaveLength(0);
        expect(worker.terminated).toBe(true);
    });

    it("treats a rejected client request as fatal and observes later responses", async () => {
        const worker = new MockWorker();
        const fatal = vi.fn();
        const session = createPostHistoryJsonlVerificationSession({ workerFactory: () => worker, onFatal: fatal });
        await session.ready;
        vi.spyOn(worker, "postMessage").mockImplementation(() => { throw new Error("transport failure"); });
        await expect(session.verify(signed)).rejects.toThrow("worker_verification_failed");
        worker.reply({ reqId: 1, ok: true });
        await expect(session.verify(signed)).rejects.toThrow("worker_verification_failed");
        expect(fatal).toHaveBeenCalledOnce();
        expect(worker.terminated).toBe(true);
    });
});
