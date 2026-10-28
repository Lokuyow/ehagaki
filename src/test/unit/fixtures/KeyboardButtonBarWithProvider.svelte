<script lang="ts">
    import { Tooltip } from "bits-ui";
    import KeyboardButtonBar from "../../../components/KeyboardButtonBar.svelte";

    interface Props {
        showPostButton?: boolean;
        postLoading?: boolean;
    }

    let { showPostButton = true, postLoading }: Props = $props();
</script>

<Tooltip.Provider>
    <KeyboardButtonBar {showPostButton} {postLoading} />
</Tooltip.Provider>
