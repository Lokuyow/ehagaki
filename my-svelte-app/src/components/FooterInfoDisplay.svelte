<script lang="ts">
    import { _ } from "svelte-i18n";

    export let imageSizeInfo: string = "";
    export let imageSizeInfoVisible: boolean = false;
    export let uploadProgress: {
        total: number;
        completed: number;
        failed: number;
        inProgress: boolean;
    } = {
        total: 0,
        completed: 0,
        failed: 0,
        inProgress: false,
    };
</script>

<div class="footer-center">
    {#if uploadProgress.inProgress}
        <div class="upload-progress">
            <div class="progress-text">
                {$_("uploading")}: {uploadProgress.completed}/{uploadProgress.total}
                {#if uploadProgress.failed > 0}
                    ({$_("failed")}: {uploadProgress.failed})
                {/if}
            </div>
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: {Math.round(
                        (uploadProgress.completed / uploadProgress.total) * 100,
                    )}%"
                ></div>
            </div>
        </div>
    {:else if imageSizeInfoVisible}
        <div class="image-size-info">
            {@html imageSizeInfo}
        </div>
    {/if}
</div>

<style>
    .footer-center {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-width: 0;
        height: 100%;
        overflow-y: auto;
    }

    .image-size-info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #2e7d32;
        font-size: 0.8rem;
        white-space: normal;
        word-wrap: break-word;
        text-align: left;
        max-width: 100%;
        line-height: 1.2;
        opacity: 0.9;
        user-select: none;
    }

    .upload-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        max-width: 100%;
    }

    .progress-text {
        font-size: 0.9rem;
        color: #666;
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.2;
    }

    .progress-bar {
        width: 120px;
        height: 10px;
        background-color: #e0e0e0;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: #1da1f2;
        transition: width 0.3s ease;
    }
</style>
