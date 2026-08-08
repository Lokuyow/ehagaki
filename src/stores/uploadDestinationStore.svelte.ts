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

interface UploadDestinationOperationScope {
    pubkeyHex: string | null;
    generation: number;
}

let activeOperation: UploadDestinationOperationScope = {
    pubkeyHex: null,
    generation: 0,
};

function beginOperation(pubkeyHex: string | null): UploadDestinationOperationScope {
    const ownerChanged = activeOperation.pubkeyHex !== pubkeyHex;
    activeOperation = {
        pubkeyHex,
        generation: activeOperation.generation + 1,
    };
    uploadDestinationState.bud03Status = null;
    uploadDestinationState.bud03Publishing = false;
    uploadDestinationState.bud03Fetching = false;
    if (ownerChanged) {
        uploadDestinationState.destinations = [];
        uploadDestinationState.defaultDestination = null;
        uploadDestinationState.error = null;
        uploadDestinationState.testResults = {};
    }
    return activeOperation;
}

function isCurrentOperation(scope: UploadDestinationOperationScope): boolean {
    return activeOperation.pubkeyHex === scope.pubkeyHex
        && activeOperation.generation === scope.generation;
}

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

async function load(
    pubkeyHex: string | null = null,
    scope: UploadDestinationOperationScope = beginOperation(pubkeyHex),
): Promise<void> {
    if (!isCurrentOperation(scope)) return;

    uploadDestinationState.loading = true;
    uploadDestinationState.error = null;

    try {
        const defaultDestination = await uploadDestinationsRepository.getDefault(pubkeyHex);
        if (!isCurrentOperation(scope)) return;

        const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
        if (!isCurrentOperation(scope)) return;

        uploadDestinationState.destinations = destinations;
        uploadDestinationState.defaultDestination = destinations.find(
            (destination) => destination.id === defaultDestination.id,
        ) ?? defaultDestination;
    } catch (error) {
        if (!isCurrentOperation(scope)) return;

        uploadDestinationState.error = error instanceof Error ? error.message : String(error);
    } finally {
        if (isCurrentOperation(scope)) {
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

    reset(): void {
        beginOperation(null);
        resetState();
    },

    async save(destination: UploadDestination): Promise<void> {
        const scope = beginOperation(destination.pubkeyHex);
        await uploadDestinationsRepository.put(destination);
        if (!isCurrentOperation(scope)) return;

        await load(destination.pubkeyHex, scope);
    },

    async delete(id: string, pubkeyHex: string | null = null): Promise<void> {
        const scope = beginOperation(pubkeyHex);
        await uploadDestinationsRepository.delete(id);
        if (!isCurrentOperation(scope)) return;

        await load(pubkeyHex, scope);
    },

    async setDefault(id: string, pubkeyHex: string | null = null): Promise<void> {
        const scope = beginOperation(pubkeyHex);
        await uploadDestinationsRepository.setDefault(id, pubkeyHex);
        if (!isCurrentOperation(scope)) return;

        await load(pubkeyHex, scope);
    },

    async move(id: string, direction: "up" | "down", pubkeyHex: string | null = null): Promise<void> {
        const scope = beginOperation(pubkeyHex);
        await uploadDestinationsRepository.move(id, direction, pubkeyHex);
        if (!isCurrentOperation(scope)) return;

        await load(pubkeyHex, scope);
    },

    async fetchBud03(rxNostr: RxNostr, pubkeyHex: string): Promise<void> {
        const scope = beginOperation(pubkeyHex);
        uploadDestinationState.bud03Fetching = true;
        uploadDestinationState.bud03Status = null;
        uploadDestinationState.error = null;

        try {
            const result = await fetchBud03ServerList({ rxNostr, pubkeyHex });
            if (!isCurrentOperation(scope)) return;

            if (!result.success) {
                uploadDestinationState.bud03Status = `BUD-03 fetch failed: ${result.error ?? "unknown"}`;
                return;
            }

            await uploadDestinationsRepository.replaceBlossomServers(pubkeyHex, result.servers);
            if (!isCurrentOperation(scope)) return;

            await load(pubkeyHex, scope);
            if (!isCurrentOperation(scope)) return;

            uploadDestinationState.bud03Status = `BUD-03 fetched ${result.servers.length} server(s)`;
        } catch (error) {
            if (!isCurrentOperation(scope)) return;

            uploadDestinationState.error = error instanceof Error ? error.message : String(error);
        } finally {
            if (isCurrentOperation(scope)) {
                uploadDestinationState.bud03Fetching = false;
            }
        }
    },

    async publishBud03(rxNostr: RxNostr, pubkeyHex: string): Promise<void> {
        const scope = beginOperation(pubkeyHex);
        uploadDestinationState.bud03Publishing = true;
        uploadDestinationState.bud03Status = null;
        uploadDestinationState.error = null;

        try {
            const assertSession = () => assertActiveSession(authState, pubkeyHex);
            assertSession();
            const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
            if (!isCurrentOperation(scope)) return;

            assertSession();
            const servers = destinations
                .filter((destination) => destination.protocol === "blossom" && destination.enabled)
                .map((destination) => destination.serverUrl);
            if (servers.length === 0) {
                uploadDestinationState.bud03Status = "BUD-03 publish skipped: no enabled Blossom servers";
                return;
            }

            const signer = await new NostrAuthService().getEventSigner(pubkeyHex);
            if (!isCurrentOperation(scope)) return;

            assertSession();
            const result = await publishBud03ServerList({
                rxNostr,
                signer,
                servers,
                expectedPubkey: pubkeyHex,
                assertSession,
            });
            if (!isCurrentOperation(scope)) return;

            uploadDestinationState.bud03Status = result.success
                ? "BUD-03 published"
                : `BUD-03 publish failed: ${result.error ?? "unknown"}`;
        } catch (error) {
            if (!isCurrentOperation(scope)) return;

            uploadDestinationState.error = error instanceof Error ? error.message : String(error);
        } finally {
            if (isCurrentOperation(scope)) {
                uploadDestinationState.bud03Publishing = false;
            }
        }
    },

    async test(destination: UploadDestination): Promise<UploadConnectionTestResult> {
        const scope = beginOperation(destination.pubkeyHex);
        const result = await testUploadDestinationConnection(resolveUploadDestinationForUse(destination, {
            pubkeyHex: authState.value.pubkey || null,
            npub: authState.value.npub || null,
        }));
        if (!isCurrentOperation(scope)) return result;

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
            if (!isCurrentOperation(scope)) return result;

            await load(destination.pubkeyHex, scope);
        }

        return result;
    },
};
