<script lang="ts">
    import { setContext } from 'svelte';

    const TIPTAP_NODE_VIEW = 'TipTapNodeView';

    interface Props {
        component: any;
        props?: Record<string, unknown>;
    }

    let { component: Component, props = {} }: Props = $props();

    setContext(TIPTAP_NODE_VIEW, {
        onDragStart: () => {},
    });
</script>

<Component {...props} />
