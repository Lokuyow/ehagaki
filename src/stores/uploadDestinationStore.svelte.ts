import type { UploadConnectionTestResult, UploadDestination } from "../lib/types";
import { uploadDestinationsRepository } from "../lib/storage/uploadDestinationsRepository";
import { testUploadDestinationConnection } from "../lib/upload/uploadDestinationConnectionTest";
import { resolveUploadDestinationForUse } from "../lib/upload/uploadDestinationResolver";
import { fetchBud03ServerList, publishBud03ServerList } from "../lib/upload/bud03ServerList";
import { NostrAuthService } from "../lib/nostrAuthService";
import { authState } from "./authStore.svelte";
import type { RxNostr } from "rx-nostr";

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

async function load(pubkeyHex: string | null = null): Promise<void> {
    uploadDestinationState.loading = true;
    uploadDestinationState.error = null;

    try {
        const defaultDestination = await uploadDestinationsRepository.getDefault(pubkeyHex);
        const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
        uploadDestinationState.destinations = destinations;
        uploadDestinationState.defaultDestination = destinations.find(
            (destination) => destination.id === defaultDestination.id,
        ) ?? defaultDestination;
    } catch (error) {
        uploadDestinationState.error = error instanceof Error ? error.message : String(error);
    } finally {
        uploadDestinationState.loading = false;
    }
}

export const uploadDestinationStore = {
    get value(): UploadDestinationState {
        return uploadDestinationState;
    },

    async load(pubkeyHex: string | null = null): Promise<void> {
        await load(pubkeyHex);
    },

    async save(destination: UploadDestination): Promise<void> {
        await uploadDestinationsRepository.put(destination);
        await load(destination.pubkeyHex);
    },

    async delete(id: string, pubkeyHex: string | null = null): Promise<void> {
        await uploadDestinationsRepository.delete(id);
        await load(pubkeyHex);
    },

    async setDefault(id: string, pubkeyHex: string | null = null): Promise<void> {
        await uploadDestinationsRepository.setDefault(id, pubkeyHex);
        await load(pubkeyHex);
    },

    async move(id: string, direction: "up" | "down", pubkeyHex: string | null = null): Promise<void> {
        await uploadDestinationsRepository.move(id, direction, pubkeyHex);
        await load(pubkeyHex);
    },

    async fetchBud03(rxNostr: RxNostr, pubkeyHex: string): Promise<void> {
        uploadDestinationState.bud03Fetching = true;
        uploadDestinationState.bud03Status = null;
        uploadDestinationState.error = null;

        try {
            const result = await fetchBud03ServerList({ rxNostr, pubkeyHex });
            if (!result.success) {
                uploadDestinationState.bud03Status = `BUD-03 fetch failed: ${result.error ?? "unknown"}`;
                return;
            }

            await uploadDestinationsRepository.replaceBlossomServers(pubkeyHex, result.servers);
            await load(pubkeyHex);
            uploadDestinationState.bud03Status = `BUD-03 fetched ${result.servers.length} server(s)`;
        } catch (error) {
            uploadDestinationState.error = error instanceof Error ? error.message : String(error);
        } finally {
            uploadDestinationState.bud03Fetching = false;
        }
    },

    async publishBud03(rxNostr: RxNostr, pubkeyHex: string): Promise<void> {
        uploadDestinationState.bud03Publishing = true;
        uploadDestinationState.bud03Status = null;
        uploadDestinationState.error = null;

        try {
            const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
            const servers = destinations
                .filter((destination) => destination.protocol === "blossom" && destination.enabled)
                .map((destination) => destination.serverUrl);
            if (servers.length === 0) {
                uploadDestinationState.bud03Status = "BUD-03 publish skipped: no enabled Blossom servers";
                return;
            }

            const signer = await new NostrAuthService().getEventSigner();
            const result = await publishBud03ServerList({
                rxNostr,
                signer,
                servers,
            });
            uploadDestinationState.bud03Status = result.success
                ? "BUD-03 published"
                : `BUD-03 publish failed: ${result.error ?? "unknown"}`;
        } catch (error) {
            uploadDestinationState.error = error instanceof Error ? error.message : String(error);
        } finally {
            uploadDestinationState.bud03Publishing = false;
        }
    },

    async test(destination: UploadDestination): Promise<UploadConnectionTestResult> {
        const result = await testUploadDestinationConnection(resolveUploadDestinationForUse(destination, {
            pubkeyHex: authState.value.pubkey || null,
            npub: authState.value.npub || null,
        }));
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
            await load(destination.pubkeyHex);
        }

        return result;
    },
};
