import { createPostHistoryJsonlVerificationSession, isCurrentPostHistoryRawEventAttestation } from "../../lib/postHistoryRawEventVerification";
import type { NostrEvent } from "../../lib/types";

export async function runJsonlImportWorkerProbe(workerURL: string, events: NostrEvent[]) {
    let workerCount = 0;
    const session = createPostHistoryJsonlVerificationSession({workerFactory:()=>{
        workerCount += 1;
        return new Worker(workerURL,{type:"module"});
    }});
    try {
        await session.ready;
        const results = [];
        for (const event of events) {
            const result = await session.verify(event);
            results.push(result !== null && isCurrentPostHistoryRawEventAttestation(result.event,result.attestation));
        }
        return {workerCount,results};
    } finally { session.dispose(); }
}

Reflect.set(window,"__JSONL_WORKER_PROBE__",runJsonlImportWorkerProbe);
