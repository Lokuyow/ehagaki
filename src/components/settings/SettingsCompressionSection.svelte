<script lang="ts">
    import { _ } from "svelte-i18n";
    import RadioButton from "../RadioButton.svelte";
    import InfoPopoverButton from "../InfoPopoverButton.svelte";
    import {
        COMPRESSION_OPTIONS_MAP,
        VIDEO_COMPRESSION_OPTIONS_MAP,
    } from "../../lib/constants";

    interface CompressionLevel {
        value: string;
        label?: string;
    }

    interface Props {
        compressionPairs: CompressionLevel[][];
        selectedCompression: string;
        onCompressionChange: (value: string) => void;
        videoCompressionPairs: CompressionLevel[][];
        selectedVideoCompression: string;
        onVideoCompressionChange: (value: string) => void;
    }

    let {
        compressionPairs,
        selectedCompression,
        onCompressionChange,
        videoCompressionPairs,
        selectedVideoCompression,
        onVideoCompressionChange,
    }: Props = $props();
</script>

<!-- 画像圧縮設定セクション -->
<div class="setting-section">
    <div class="setting-row">
        <div class="setting-label-wrapper">
            <span class="setting-label">
                {$_("settingsDialog.image_quality_setting")}
            </span>
            <InfoPopoverButton side="top" ariaLabel="画像圧縮設定の説明">
                <table class="popover-table">
                    <thead>
                        <tr>
                            <th>{$_("settingsDialog.info_header_setting")}</th>
                            <th>{$_("settingsDialog.info_header_pixels")}</th>
                            <th>{$_("settingsDialog.info_header_quality")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{$_("settingsDialog.quality_high")}</td>
                            <td
                                >{COMPRESSION_OPTIONS_MAP.low
                                    .maxWidthOrHeight}px</td
                            >
                            <td
                                >{Math.round(
                                    COMPRESSION_OPTIONS_MAP.low.initialQuality *
                                        100,
                                )}%</td
                            >
                        </tr>
                        <tr>
                            <td>{$_("settingsDialog.quality_medium")}</td>
                            <td
                                >{COMPRESSION_OPTIONS_MAP.medium
                                    .maxWidthOrHeight}px</td
                            >
                            <td
                                >{Math.round(
                                    COMPRESSION_OPTIONS_MAP.medium
                                        .initialQuality * 100,
                                )}%</td
                            >
                        </tr>
                        <tr>
                            <td>{$_("settingsDialog.quality_low")}</td>
                            <td
                                >{COMPRESSION_OPTIONS_MAP.high
                                    .maxWidthOrHeight}px</td
                            >
                            <td
                                >{Math.round(
                                    COMPRESSION_OPTIONS_MAP.high
                                        .initialQuality * 100,
                                )}%</td
                            >
                        </tr>
                    </tbody>
                </table>
            </InfoPopoverButton>
        </div>
        <div class="setting-control radio-group">
            {#each compressionPairs as pair}
                <div class="radio-pair">
                    {#each pair as level}
                        <RadioButton
                            value={level.value}
                            name="compression"
                            checked={selectedCompression === level.value}
                            variant="default"
                            shape="rounded"
                            onChange={onCompressionChange}
                            ariaLabel={level.label}
                        >
                            {level.label}
                        </RadioButton>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<!-- 動画圧縮設定セクション -->
<div class="setting-section">
    <div class="setting-row">
        <div class="setting-label-wrapper">
            <span class="setting-label">
                {$_("settingsDialog.video_quality_setting")}
            </span>
            <InfoPopoverButton side="top" ariaLabel="動画圧縮設定の説明">
                <table class="popover-table">
                    <thead>
                        <tr>
                            <th>{$_("settingsDialog.info_header_setting")}</th>
                            <th>{$_("settingsDialog.info_header_pixels")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{$_("settingsDialog.quality_high")}</td>
                            <td
                                >{VIDEO_COMPRESSION_OPTIONS_MAP.low
                                    .maxSize}px</td
                            >
                        </tr>
                        <tr>
                            <td>{$_("settingsDialog.quality_medium")}</td>
                            <td
                                >{VIDEO_COMPRESSION_OPTIONS_MAP.medium
                                    .maxSize}px</td
                            >
                        </tr>
                        <tr>
                            <td>{$_("settingsDialog.quality_low")}</td>
                            <td
                                >{VIDEO_COMPRESSION_OPTIONS_MAP.high
                                    .maxSize}px</td
                            >
                        </tr>
                    </tbody>
                </table>
            </InfoPopoverButton>
        </div>
        <div class="setting-control radio-group">
            {#each videoCompressionPairs as pair}
                <div class="radio-pair">
                    {#each pair as level}
                        <RadioButton
                            value={level.value}
                            name="videoCompression"
                            checked={selectedVideoCompression === level.value}
                            variant="default"
                            shape="rounded"
                            onChange={onVideoCompressionChange}
                            ariaLabel={level.label}
                        >
                            {level.label}
                        </RadioButton>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .setting-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .setting-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .setting-label {
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.3;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        white-space: pre-line;
    }
    .setting-label-wrapper {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }
    .setting-control {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: fit-content;
    }
    :global(.info-trigger) {
        height: 40px;
        width: 40px;
    }
    :global(.popover-table) {
        border-collapse: collapse;
        font-size: 1rem;

        th,
        td {
            padding: 4px 8px;
            text-align: left;
        }

        th {
            font-weight: 600;
            border-bottom: 1px solid var(--border);
        }

        td {
            font-weight: normal;
        }
    }
    .radio-group {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;

        :global(button) {
            font-size: 0.875rem;
            padding: 10px;
            min-height: 50px;
            min-width: 50px;
            font-weight: normal;
        }
    }
    .radio-pair {
        display: flex;
        gap: 6px;
    }
</style>
