import { usePostHistoryThreadGraph } from "../../lib/hooks/usePostHistoryThreadGraph.svelte";

export function createPostHistoryThreadGraphHookHarness(
    params: Parameters<typeof usePostHistoryThreadGraph>[0],
) {
    let graph: ReturnType<typeof usePostHistoryThreadGraph> | undefined;
    const dispose = $effect.root(() => {
        graph = usePostHistoryThreadGraph(params);
    });

    return {
        graph: graph!,
        dispose,
    };
}
