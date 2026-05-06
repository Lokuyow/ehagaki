import { NostrAuthService } from "../nostrAuthService";
import type { UploadConnectionTestResult, UploadDestination } from "../types";
import { getUploadAdapter } from "./uploadAdapterRegistry";

export async function testUploadDestinationConnection(
    destination: UploadDestination,
    dependencies: {
        fetch?: typeof fetch;
        authService?: NostrAuthService;
    } = {},
): Promise<UploadConnectionTestResult> {
    try {
        const adapter = getUploadAdapter(destination.protocol);
        return await adapter.testConnection({
            destination,
            fetch: dependencies.fetch ?? window.fetch.bind(window),
            authService: dependencies.authService ?? new NostrAuthService(),
        });
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : String(error),
        };
    }
}
