<script lang="ts">
    interface Props {
        label: string;
        tone: "muted" | "danger";
        className?: string;
    }

    let { label, tone, className = "" }: Props = $props();
</script>

<span
    class={`post-history-status-pill post-history-status-pill-${tone} ${className}`.trim()}
    aria-label={label}
    title={label}
>
    {label}
</span>

<style>
    .post-history-status-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 18px;
        padding: 0 8px;
        border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
        border-radius: 999px;
        background: color-mix(in srgb, currentColor 8%, transparent);
        font-size: 0.72rem;
        line-height: 1;
        white-space: nowrap;
    }

    .post-history-status-pill-muted {
        color: var(--text-muted, currentColor);
    }

    .post-history-status-pill-danger {
        color: var(--destructive-fg, currentColor);
    }
</style>
