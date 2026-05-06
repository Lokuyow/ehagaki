import type { UploadConnectionTestResult, UploadDestination } from "../lib/types";
import { uploadDestinationsRepository } from "../lib/storage/uploadDestinationsRepository";
import { testUploadDestinationConnection } from "../lib/upload/uploadDestinationConnectionTest";

interface UploadDestinationState {
    destinations: UploadDestination[];
    defaultDestination: UploadDestination | null;
    loading: boolean;
    error: string | null;
    testResults: Record<string, UploadConnectionTestResult>;
}

let uploadDestinationState = $state<UploadDestinationState>({
    destinations: [],
    defaultDestination: null,
    loading: false,
    error: null,
    testResults: {},
});

async function load(pubkeyHex: string | null = null): Promise<void> {
    uploadDestinationState.loading = true;
    uploadDestinationState.error = null;

    try {
        const destinations = await uploadDestinationsRepository.getAll(pubkeyHex);
        const defaultDestination = await uploadDestinationsRepository.getDefault(pubkeyHex);
        uploadDestinationState.destinations = destinations;
        uploadDestinationState.defaultDestination = defaultDestination;
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

    async test(destination: UploadDestination): Promise<UploadConnectionTestResult> {
        const result = await testUploadDestinationConnection(destination);
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
