<script lang="ts">
import { onMount } from 'svelte';
import { usePostEventOperations } from '../../../lib/hooks/usePostEventOperations.svelte';
let { ready, active }: { ready: (value: ReturnType<typeof usePostEventOperations>) => void; active: () => boolean } = $props();
const operations = usePostEventOperations(() => undefined, () => active());
onMount(() => ready(operations));
</script>
