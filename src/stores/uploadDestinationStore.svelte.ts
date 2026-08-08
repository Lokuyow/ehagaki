import type { UploadConnectionTestResult, UploadDestination } from "../lib/types";
import { uploadDestinationsRepository } from "../lib/storage/uploadDestinationsRepository";
import { testUploadDestinationConnection } from "../lib/upload/uploadDestinationConnectionTest";
import { resolveUploadDestinationForUse } from "../lib/upload/uploadDestinationResolver";
import { fetchBud03ServerList, publishBud03ServerList } from "../lib/upload/bud03ServerList";
import { NostrAuthService } from "../lib/nostrAuthService";
import { authState } from "./authStore.svelte";
import type { RxNostr } from "rx-nostr";
import { assertActiveSession } from "../lib/sessionLiveness";

interface UploadDestinationState {
    destinations: UploadDestination[];
    defaultDestination: UploadDestination | null;
    loading: boolean;
    error: string | null;
    bud03Status: string | null;
    bud03Publishing: boolean;
    bud03Fetching: boolean;
    testResults: Record<string, UploadConnectionTestResult>;
}

interface AccountScope {
    pubkeyHex: string | null;
    epoch: number;
}

interface LaneScope extends AccountScope {
    generation: number;
}

interface Bud03Scope extends LaneScope {
    statusGeneration: number;
}

let uploadDestinationState = $state<UploadDestinationState>({
    destinations: [],
    defaultDestination: null,
    loading: false,
    error: null,
    bud03Status: null,
    bud03Publishing: false,
    bud03Fetching: false,
    testResults: {},
});

let activeOwnerPubkey: string | null = null;
let accountEpoch = 0;
let listGeneration = 0;
let bud03FetchGeneration = 0;
let bud03PublishGeneration = 0;
let connectionTestGeneration = 0;
let bud03StatusGeneration = 0;

function resetState(): void {
    uploadDestinationState = {
        destinations: [],
        defaultDestination: null,
        loading: false,
        error: null,
        bud03Status: null,
        bud03Publishing: false,
        bud03Fetching: false,
        testResults: {},
    };
}

function ensureAccountScope(pubkeyHex: string | null): AccountScope {
    if (activeOwnerPubkey !== pubkeyHex) {
        activeOwnerPubkey = pubkeyHex;
        accountEpoch += 1;
        resetState();
    }

    return { pubkeyHex, epoch: accountEpoch };
}

function isCurrentAccount(scope: AccountScope): boolean {
    return activeOwnerPubkey === scope.pubkeyHex && accountEpoch === scope.epoch;
}

function invalidatePendingOperations(): void {
    accountEpoch += 1;
    uploadDestinationState.loading = false;
    uploadDestinationState.bud03Fetching = false;
    uploadDestinationState.bud03Publishing = false;
}

function beginListOperation(pubkeyHex: string | null): LaneScope {
    return {
        ...ensureAccountScope(pubkeyHex),
        generation: ++listGeneration,
    };
}

function isCurrentListOperation(scope: LaneScope): boolean {
    return isCurrentAccount(scope) && listGeneration === scope.generation;
}

function beginBud03Fetch(pubkeyHex: string): Bud03Scope {
    return {
        ...ensureAccountScope(pubkeyHex),
        generation: ++bud03FetchGeneration,
        statusGeneration: ++bud03StatusGeneration,
    };
}

function isCurrentBud03Fetch(scope: Bud03Scope): boolean {
    return isCurrentAccount(scope) && bud03FetchGeneration === scope.generation;
}

function beginBud03Publish(pubkeyHex: string): Bud03Scope {
    return {
        ...ensureAccountScope(pubkeyHex),
        generation: ++bud03PublishGeneration,
        statusGeneration: ++bud03StatusGeneration,
    };
}

function isCurrentBud03Publish(scope: Bud03Scope): boolean {
    return isCurrentAccount(scope) && bud03PublishGeneration === scope.generation;
}

function isCurrentBud03Status(scope: Bud03Scope): boolean {
    return isCurrentAccount(scope) && bud03StatusGeneration === scope.statusGeneration;
}

function beginConnectionTest(pubkeyHex: string | null): LaneScope {
    return {
        ...ensureAccountScope(pubkeyHex),
        generation: ++connectionTestGeneration,
    };
}

function isCurrentConnectionTest(scope: LaneScope): boolean {
    return isCurrentAccount(scope) && connectionTestGeneration === scope.generation;
}

async function load(pubkeyHex: string | null = null): Promise<void> {
    const scope = beginListOperation(pubkeyHex);
    uploadDestinationState.loading = true;
    uploadDestinationState.error = null;

    try {
        const defaultDestination = await uploadDestinationsRepository.getDefault(pubkeyHex);
        if (!isCurrentListOperation(scope)) return;

        const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
        if (!isCurrentListOperation(scope)) return;

        uploadDestinationState.destinations = destinations;
        uploadDestinationState.defaultDestination = destinations.find(
            (destination) => destination.id === defaultDestination.id,
        ) ?? defaultDestination;
    } catch (error) {
        if (!isCurrentListOperation(scope)) return;

        uploadDestinationState.error = error instanceof Error ? error.message : String(error);
    } finally {
        if (isCurrentListOperation(scope)) {
            uploadDestinationState.loading = false;
        }
    }
}

export const uploadDestinationStore = {
    get value(): UploadDestinationState {
        return uploadDestinationState;
    },

    async load(pubkeyHex: string | null = null): Promise<void> {
        await load(pubkeyHex);
    },

    invalidatePendingOperations(): void {
        invalidatePendingOperations();
    },

    reset(): void {
        invalidatePendingOperations();
        activeOwnerPubkey = null;
        resetState();
    },

    async save(destination: UploadDestination): Promise<void> {
        const accountScope = ensureAccountScope(destination.pubkeyHex);
        await uploadDestinationsRepository.put(destination);
        if (!isCurrentAccount(accountScope)) return;

        await load(destination.pubkeyHex);
    },

    async delete(id: string, pubkeyHex: string | null = null): Promise<void> {
        const accountScope = ensureAccountScope(pubkeyHex);
        await uploadDestinationsRepository.delete(id);
        if (!isCurrentAccount(accountScope)) return;

        await load(pubkeyHex);
    },

    async setDefault(id: string, pubkeyHex: string | null = null): Promise<void> {
        const accountScope = ensureAccountScope(pubkeyHex);
        await uploadDestinationsRepository.setDefault(id, pubkeyHex);
        if (!isCurrentAccount(accountScope)) return;

        await load(pubkeyHex);
    },

    async move(id: string, direction: "up" | "down", pubkeyHex: string | null = null): Promise<void> {
        const accountScope = ensureAccountScope(pubkeyHex);
        await uploadDestinationsRepository.move(id, direction, pubkeyHex);
        if (!isCurrentAccount(accountScope)) return;

        await load(pubkeyHex);
    },

    async fetchBud03(rxNostr: RxNostr, pubkeyHex: string): Promise<void> {
        const scope = beginBud03Fetch(pubkeyHex);
        uploadDestinationState.bud03Fetching = true;
        if (isCurrentBud03Status(scope)) {
            uploadDestinationState.bud03Status = null;
        }
        uploadDestinationState.error = null;

        try {
            const result = await fetchBud03ServerList({ rxNostr, pubkeyHex });
            if (!isCurrentBud03Fetch(scope)) return;

            if (!result.success) {
                if (isCurrentBud03Status(scope)) {
                    uploadDestinationState.bud03Status = `BUD-03 fetch failed: ${result.error ?? "unknown"}`;
                }
                return;
            }

            await uploadDestinationsRepository.replaceBlossomServers(pubkeyHex, result.servers);
            if (!isCurrentBud03Fetch(scope)) return;

            await load(pubkeyHex);
            if (!isCurrentBud03Fetch(scope)) return;

            if (isCurrentBud03Status(scope)) {
                uploadDestinationState.bud03Status = `BUD-03 fetched ${result.servers.length} server(s)`;
            }
        } catch (error) {
            if (!isCurrentBud03Fetch(scope)) return;

            uploadDestinationState.error = error instanceof Error ? error.message : String(error);
        } finally {
            if (isCurrentBud03Fetch(scope)) {
                uploadDestinationState.bud03Fetching = false;
            }
        }
    },

    async publishBud03(rxNostr: RxNostr, pubkeyHex: string): Promise<void> {
        const scope = beginBud03Publish(pubkeyHex);
        uploadDestinationState.bud03Publishing = true;
        if (isCurrentBud03Status(scope)) {
            uploadDestinationState.bud03Status = null;
        }
        uploadDestinationState.error = null;

        try {
            const assertSession = () => assertActiveSession(authState, pubkeyHex);
            assertSession();
            const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
            if (!isCurrentBud03Publish(scope)) return;

            assertSession();
            const servers = destinations
                .filter((destination) => destination.protocol === "blossom" && destination.enabled)
                .map((destination) => destination.serverUrl);
            if (servers.length === 0) {
                if (isCurrentBud03Status(scope)) {
                    uploadDestinationState.bud03Status = "BUD-03 publish skipped: no enabled Blossom servers";
                }
                return;
            }

            const signer = await new NostrAuthService().getEventSigner(pubkeyHex);
            if (!isCurrentBud03Publish(scope)) return;

            assertSession();
            const result = await publishBud03ServerList({
                rxNostr,
                signer,
                servers,
                expectedPubkey: pubkeyHex,
                assertSession,
            });
            if (!isCurrentBud03Publish(scope)) return;

            if (isCurrentBud03Status(scope)) {
                uploadDestinationState.bud03Status = result.success
                    ? "BUD-03 published"
                    : `BUD-03 publish failed: ${result.error ?? "unknown"}`;
            }
        } catch (error) {
            if (!isCurrentBud03Publish(scope)) return;

            uploadDestinationState.error = error instanceof Error ? error.message : String(error);
        } finally {
            if (isCurrentBud03Publish(scope)) {
                uploadDestinationState.bud03Publishing = false;
            }
        }
    },

    async test(destination: UploadDestination): Promise<UploadConnectionTestResult> {
        const scope = beginConnectionTest(destination.pubkeyHex);
        const result = await testUploadDestinationConnection(resolveUploadDestinationForUse(destination, {
            pubkeyHex: authState.value.pubkey || null,
            npub: authState.value.npub || null,
        }));
        if (!isCurrentConnectionTest(scope)) return result;

        uploadDestinationState.testResults = {
            ...uploadDestinationState.testResults,
            [destination.id]: result,
        };

        if (result.capabilities) {
            await uploadDestinationsRepository.put({
                ...destination,
                capabilities: result.capabilities,
                updatedAt: Date.now(),
            });
            if (!isCurrentConnectionTest(scope)) return result;

            await load(destination.pubkeyHex);
        }

        return result;
    },
};
