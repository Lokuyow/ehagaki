<script lang="ts">
    import { RadioGroup } from "bits-ui";
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
    <div class="setting-row compression-setting-row">
        <div class="setting-label-wrapper">
            <div class="setting-label-with-icon">
                <span
                    class="setting-menu-icon setting-menu-mask-icon image-quality-icon"
                    aria-hidden="true"
                ></span>
                <span class="setting-label">
                    {$_("settingsDialog.image_quality_setting")}
                </span>
            </div>
            <InfoPopoverButton
                side="top"
                ariaLabel={$_("settingsDialog.image_compression_settings_description")}
            >
                <table class="popover-table">
                    <thead>
                        <tr>
                            <th>{$_("settingsDialog.info_header_setting")}</th>
                            <th>{$_("settingsDialog.info_header_short_edge")}</th>
                            <th>{$_("settingsDialog.info_header_quality")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{$_("settingsDialog.quality_high")}</td>
                            <td
                                >{COMPRESSION_OPTIONS_MAP.high
                                    .maxShortEdge}px</td
                            >
                            <td
                                >{Math.round(
                                    COMPRESSION_OPTIONS_MAP.high
                                        .quality * 100,
                                )}%</td
                            >
                        </tr>
                        <tr>
                            <td>{$_("settingsDialog.quality_medium")}</td>
                            <td
                                >{COMPRESSION_OPTIONS_MAP.medium
                                    .maxShortEdge}px</td
                            >
                            <td
                                >{Math.round(
                                    COMPRESSION_OPTIONS_MAP.medium
                                        .quality * 100,
                                )}%</td
                            >
                        </tr>
                        <tr>
                            <td>{$_("settingsDialog.quality_low")}</td>
                            <td
                                >{COMPRESSION_OPTIONS_MAP.low
                                    .maxShortEdge}px</td
                            >
                            <td
                                >{Math.round(
                                    COMPRESSION_OPTIONS_MAP.low.quality *
                                        100,
                                )}%</td
                            >
                        </tr>
                    </tbody>
                </table>
            </InfoPopoverButton>
        </div>
        <RadioGroup.Root
            class="setting-control radio-group"
            name="compression"
            orientation="horizontal"
            value={selectedCompression}
            aria-label={$_("settingsDialog.image_quality_setting")}
            onValueChange={onCompressionChange}
        >
            {#each compressionPairs as pair}
                <div class="radio-pair">
                    {#each pair as level}
                        <RadioButton
                            value={level.value}
                            variant="default"
                            shape="rounded"
                            ariaLabel={level.label}
                        >
                            {level.label}
                        </RadioButton>
                    {/each}
                </div>
            {/each}
        </RadioGroup.Root>
    </div>
</div>

<!-- 動画圧縮設定セクション -->
<div class="setting-section">
    <div class="setting-row compression-setting-row">
        <div class="setting-label-wrapper">
            <div class="setting-label-with-icon">
                <span
                    class="setting-menu-icon setting-menu-mask-icon video-quality-icon"
                    aria-hidden="true"
                ></span>
                <span class="setting-label">
                    {$_("settingsDialog.video_quality_setting")}
                </span>
            </div>
            <InfoPopoverButton
                side="top"
                ariaLabel={$_("settingsDialog.video_compression_settings_description")}
            >
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
                                >{VIDEO_COMPRESSION_OPTIONS_MAP.high
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
                                >{VIDEO_COMPRESSION_OPTIONS_MAP.low
                                    .maxSize}px</td
                            >
                        </tr>
                    </tbody>
                </table>
            </InfoPopoverButton>
        </div>
        <RadioGroup.Root
            class="setting-control radio-group"
            name="videoCompression"
            orientation="horizontal"
            value={selectedVideoCompression}
            aria-label={$_("settingsDialog.video_quality_setting")}
            onValueChange={onVideoCompressionChange}
        >
            {#each videoCompressionPairs as pair}
                <div class="radio-pair">
                    {#each pair as level}
                        <RadioButton
                            value={level.value}
                            variant="default"
                            shape="rounded"
                            ariaLabel={level.label}
                        >
                            {level.label}
                        </RadioButton>
                    {/each}
                </div>
            {/each}
        </RadioGroup.Root>
    </div>
</div>

<style>
    .setting-label-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
        flex: 1 1 auto;
        min-width: 0;
    }

    .setting-label-with-icon {
        flex: 0 1 auto;
        max-width: calc(100% - 48px);
    }

    .image-quality-icon {
        mask-image: url("/icons/image_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .video-quality-icon {
        mask-image: url("/icons/movie_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
    }

    @media (max-width: 430px) {
        .compression-setting-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
        }

        :global(.compression-setting-row > .setting-control.radio-group) {
            width: 100%;
            justify-content: flex-end;
            margin-block: 0;
        }
    }

    :global(.popover-table) {
        border-collapse: collapse;
        font-size: 1rem;

        th,
        td {
            padding: 4px 8px;
            text-align: start;
        }

        th {
            font-weight: 600;
            border-bottom: 1px solid var(--border);
        }

        td {
            font-weight: normal;
        }
    }
    :global(.radio-group) {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;

        :global(button) {
            font-size: 0.875rem;
            padding: 10px;
            min-height: 50px;
            min-width: 44px;
            font-weight: normal;
        }
    }
    .radio-pair {
        display: flex;
        gap: 4px;
    }
</style>
