/**
 * Splits an array into consecutive chunks of `size` items (the last chunk may
 * be shorter). Dependency-free so storage, worker and repair code can use it.
 */
export function chunkArray<T>(array: readonly T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let index = 0; index < array.length; index += size) {
        chunks.push(array.slice(index, index + size));
    }
    return chunks;
}
