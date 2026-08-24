/** The shared Composer's full-only dynamic import is unreachable in Lite. */
export async function uploadFiles(): Promise<never> {
    throw new Error("Normal upload transport is unavailable in Host-owned Composer Lite.");
}
