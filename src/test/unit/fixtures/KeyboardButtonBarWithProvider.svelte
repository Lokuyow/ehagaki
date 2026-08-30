<script lang="ts">
    import { Tooltip } from "bits-ui";
    import KeyboardButtonBar from "../../../components/KeyboardButtonBar.svelte";

    interface Props {
        showPostButton?: boolean;
    }

    let { showPostButton = true }: Props = $props();
</script>

<Tooltip.Provider>
    <KeyboardButtonBar {showPostButton} />
</Tooltip.Provider>
