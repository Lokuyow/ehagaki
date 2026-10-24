import type { UploadConnectionTestResult, UploadDestination } from "../lib/types";
import { uploadDestinationsRepository } from "../lib/storage/uploadDestinationsRepository";
import { testUploadDestinationConnection } from "../lib/upload/uploadDestinationConnectionTest";
import { resolveUploadDestinationForUse } from "../lib/upload/uploadDestinationResolver";
import { fetchUploadRelayLists, publishUploadRelayLists, type RelaySyncResults } from "../lib/upload/relayUploadDestinationSync";
import { createUploadAbortError } from "../lib/upload/uploadOperation";
import { NostrAuthService } from "../lib/nostrAuthService";
import { authState } from "./authStore.svelte";
import type { RxNostr } from "rx-nostr";
import { assertActiveSession } from "../lib/sessionLiveness";

interface UploadDestinationState {
    destinations: UploadDestination[];
    defaultDestination: UploadDestination | null;
    loading: boolean;
    error: string | null;
    relaySyncResults: RelaySyncResults | null;
    relayPublishing: boolean;
    relayFetching: boolean;
    testResults: Record<string, UploadConnectionTestResult>;
}

interface AccountScope {
    pubkeyHex: string | null;
    epoch: number;
}

interface LaneScope extends AccountScope {
    generation: number;
}

let uploadDestinationState = $state<UploadDestinationState>({
    destinations: [],
    defaultDestination: null,
    loading: false,
    error: null,
    relaySyncResults: null,
    relayPublishing: false,
    relayFetching: false,
    testResults: {},
});

let activeOwnerPubkey: string | null = null;
let accountEpoch = 0;
let listGeneration = 0;
let configurationRevision = 0;
let activeSync: { kind: "fetch" | "publish"; controller: AbortController } | null = null;
let connectionTestGeneration = 0;

function resetState(): void {
    uploadDestinationState = {
        destinations: [],
        defaultDestination: null,
        loading: false,
        error: null,
        relaySyncResults: null,
        relayPublishing: false,
        relayFetching: false,
        testResults: {},
    };
}

function ensureAccountScope(pubkeyHex: string | null): AccountScope {
    if (activeOwnerPubkey !== pubkeyHex) {
        activeSync?.controller.abort();
        activeSync = null;
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
    activeSync?.controller.abort();
    activeSync = null;
    accountEpoch += 1;
    uploadDestinationState.loading = false;
    uploadDestinationState.relayFetching = false;
    uploadDestinationState.relayPublishing = false;
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

async function synchronize(kind: "fetch" | "publish", rxNostr: RxNostr, pubkeyHex: string): Promise<void> {
    assertActiveSession(authState, pubkeyHex);
    if (activeSync) return;
    const scope = ensureAccountScope(pubkeyHex);
    const controller = new AbortController();
    const operation = { kind, controller };
    activeSync = operation;
    const revision = configurationRevision;
    const assertCurrent = () => {
        assertActiveSession(authState, pubkeyHex);
        if (!isCurrentAccount(scope) || activeSync !== operation || controller.signal.aborted
            || (kind === "fetch" && configurationRevision !== revision)) throw createUploadAbortError();
    };
    uploadDestinationState.relayFetching = kind === "fetch";
    uploadDestinationState.relayPublishing = kind === "publish";
    uploadDestinationState.relaySyncResults = null;
    uploadDestinationState.error = null;
    const context = { rxNostr, pubkeyHex, signal: controller.signal, assertCurrent, fetch: globalThis.fetch.bind(globalThis) };
    try {
        if (kind === "fetch") {
            const { results, updates } = await fetchUploadRelayLists(context);
            assertCurrent();
            if (updates.blossom !== undefined || updates.nip96 !== undefined) {
                // Invalidate pending list reads before committing a newer settings snapshot.
                listGeneration++;
                const destinations = await uploadDestinationsRepository.applyRelayServerLists(pubkeyHex, updates, assertCurrent);
                assertCurrent();
                uploadDestinationState.destinations = destinations;
                uploadDestinationState.defaultDestination = destinations.find(destination => destination.enabled && destination.isDefault) ?? null;
                uploadDestinationState.loading = false;
            }
            uploadDestinationState.relaySyncResults = results;
        } else {
            const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
            assertCurrent();
            const authService = new NostrAuthService({ expectedPubkey: pubkeyHex, signal: controller.signal });
            const results = await publishUploadRelayLists({ ...context, destinations, getSigner: () => authService.getEventSigner(pubkeyHex) });
            assertCurrent();
            uploadDestinationState.relaySyncResults = results;
        }
    } catch {
        if (isCurrentAccount(scope) && activeSync === operation) {
            const reason = configurationRevision !== revision ? "settings_changed" : "request_failed";
            uploadDestinationState.relaySyncResults = { blossom: { status: "failed", reason }, nip96: { status: "failed", reason } };
        }
    } finally {
        controller.abort();
        if (isCurrentAccount(scope) && activeSync === operation) {
            activeSync = null;
            uploadDestinationState.relayFetching = false;
            uploadDestinationState.relayPublishing = false;
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
        configurationRevision++;
        if (activeSync?.kind === "fetch") activeSync.controller.abort();
        const accountScope = ensureAccountScope(destination.pubkeyHex);
        await uploadDestinationsRepository.put(destination);
        if (!isCurrentAccount(accountScope)) return;

        await load(destination.pubkeyHex);
    },

    async delete(id: string, pubkeyHex: string | null = null): Promise<void> {
        configurationRevision++;
        if (activeSync?.kind === "fetch") activeSync.controller.abort();
        const accountScope = ensureAccountScope(pubkeyHex);
        await uploadDestinationsRepository.delete(id);
        if (!isCurrentAccount(accountScope)) return;

        await load(pubkeyHex);
    },

    async setDefault(id: string, pubkeyHex: string | null = null): Promise<void> {
        configurationRevision++;
        if (activeSync?.kind === "fetch") activeSync.controller.abort();
        const accountScope = ensureAccountScope(pubkeyHex);
        await uploadDestinationsRepository.setDefault(id, pubkeyHex);
        if (!isCurrentAccount(accountScope)) return;

        await load(pubkeyHex);
    },

    async move(id: string, direction: "up" | "down", pubkeyHex: string | null = null): Promise<void> {
        configurationRevision++;
        if (activeSync?.kind === "fetch") activeSync.controller.abort();
        const accountScope = ensureAccountScope(pubkeyHex);
        await uploadDestinationsRepository.move(id, direction, pubkeyHex);
        if (!isCurrentAccount(accountScope)) return;

        await load(pubkeyHex);
    },

    async fetchFromRelays(rxNostr: RxNostr, pubkeyHex: string): Promise<void> { await synchronize("fetch", rxNostr, pubkeyHex); },
    async publishToRelays(rxNostr: RxNostr, pubkeyHex: string): Promise<void> { await synchronize("publish", rxNostr, pubkeyHex); },

    async test(destination: UploadDestination): Promise<UploadConnectionTestResult> {
        const scope = beginConnectionTest(destination.pubkeyHex);
        const revision = configurationRevision;
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
            try {
                await uploadDestinationsRepository.updateTestCapabilities(destination, result.capabilities, () => {
                    if (!isCurrentConnectionTest(scope) || configurationRevision !== revision) throw createUploadAbortError();
                });
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") return result;
                throw error;
            }
            if (!isCurrentConnectionTest(scope)) return result;

            await load(destination.pubkeyHex);
        }

        return result;
    },
};
