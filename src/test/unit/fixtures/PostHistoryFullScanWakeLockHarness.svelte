<script lang="ts">
    import { untrack } from "svelte";
    import PostHistoryRelayFullScanDialog from "../../../components/PostHistoryRelayFullScanDialog.svelte";
    import { usePostHistoryRelayFullScan } from "../../../lib/hooks/usePostHistoryRelayFullScan.svelte";
    import type { PostHistoryFullScanResult, PostHistoryFullScanScope } from "../../../lib/postHistoryRelayFullScanService";
    interface Props {
        show: boolean;
        scope: PostHistoryFullScanScope;
        onSettled: (result: PostHistoryFullScanResult) => Promise<void>;
        onReady: (scan: ReturnType<typeof usePostHistoryRelayFullScan>) => void;
    }
    let { show, scope, onSettled, onReady }: Props = $props();
    const scan = usePostHistoryRelayFullScan({ getShow: () => show, getScope: () => scope,
        onSettled: result => onSettled(result) });
    untrack(() => onReady(scan));
</script>

<PostHistoryRelayFullScanDialog open={scan.state.open} running={scan.state.running}
    canStart={true} progress={scan.state.progress} result={scan.state.result}
    elapsedMs={scan.state.elapsedMs} onOpenChange={scan.setOpen}
    onStart={() => void scan.start()} onCancel={scan.cancel} />
