<script lang="ts">
    export let type: "success" | "error" = "success";
    export let message: string = "";
</script>

<div class="balloon-message-wrapper {type}">
    <div class="balloon-message">{message}</div>
</div>

<style>
    .balloon-message-wrapper {
        position: absolute;
        left: 66px;
        display: flex;
        align-items: center;
        max-width: 150px;
        height: 100%;
        z-index: 2;
        pointer-events: none;
    }
    .balloon-message {
        position: relative;
        background: #fff;
        border: 2px solid #e0e0e0;
        border-radius: 16px;
        padding: 8px 10px;
        font-size: 1rem;
        color: #333;
        margin: auto 0 auto 8px;
        white-space: nowrap;
    }
    .balloon-message-wrapper.error .balloon-message {
        background: #ffebee;
        color: #c62828;
        border-color: #ffcdd2;
    }
    .balloon-message-wrapper.success .balloon-message {
        background: hsl(125, 39%, 92%);
        color: hsl(123, 46%, 28%);
        border-color: hsl(125, 39%, 80%);
    }
    .balloon-message::after {
        content: "";
        position: absolute;
        left: -16px;
        top: 12px;
        transform: rotate(-8deg);
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-right: 12px solid #fff;
        filter: drop-shadow(-1px 0 0 #e0e0e0);
        z-index: 1;
    }
    .balloon-message-wrapper.error .balloon-message::after {
        border-right: 12px solid #ffebee;
        filter: drop-shadow(-1px 0 0 #ffcdd2);
    }
    .balloon-message-wrapper.success .balloon-message::after {
        border-right: 12px solid hsl(125, 39%, 90%);
        filter: drop-shadow(-1px 0 0 hsl(125, 39%, 80%));
    }
</style>
