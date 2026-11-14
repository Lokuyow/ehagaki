<script lang="ts">
    import type { DateValue } from "@internationalized/date";
    import { DatePicker } from "bits-ui";
    import { _, locale } from "svelte-i18n";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
    import Button from "./Button.svelte";

    interface Props {
        value: DateValue | undefined;
        placeholder: DateValue | undefined;
        open: boolean;
        onSubmit: () => void;
        onClose: () => void;
    }

    let {
        value = $bindable(),
        placeholder = $bindable(),
        open = $bindable(),
        onSubmit,
        onClose,
    }: Props = $props();

    const overlayTarget = getAppRuntimeEnvironment().overlayTarget;

    function shiftYear(offsetYears: number): void {
        const source = placeholder ?? value;
        if (!source || offsetYears === 0) {
            return;
        }

        placeholder = source.add({ years: offsetYears });
    }
</script>

<div class="post-history-utility-panel">
    <div
        class="post-history-utility-label"
        id="post-history-jump-date-label"
    >
        {$_("postHistory.jumpToDateLabel")}
    </div>
    <div class="post-history-utility-controls">
        <DatePicker.Root
            bind:value
            bind:placeholder
            bind:open
            locale={$locale ?? undefined}
            calendarLabel={$_("postHistory.jumpToDateLabel")}
        >
            <DatePicker.Input
                aria-labelledby="post-history-jump-date-label"
                class="post-history-date-picker-input"
            >
                {#snippet children({ segments })}
                    {#each segments as segment, segmentIndex (`${segment.part}-${segmentIndex}`)}
                        <DatePicker.Segment
                            class="post-history-date-picker-segment"
                            part={segment.part}
                        >
                            {segment.value}
                        </DatePicker.Segment>
                    {/each}
                {/snippet}
            </DatePicker.Input>
            <DatePicker.Trigger
                class="post-history-date-picker-trigger"
                aria-label={$_("postHistory.jumpToDate")}
            >
                <div
                    class="calendar-icon svg-icon"
                    aria-hidden="true"
                ></div>
            </DatePicker.Trigger>
            <DatePicker.Portal to={overlayTarget}>
                <DatePicker.Content
                    sideOffset={8}
                    class="post-history-date-picker-content"
                >
                    <DatePicker.Calendar
                        class="post-history-date-picker-calendar"
                    >
                        {#snippet children({ months, weekdays })}
                            <DatePicker.Header
                                class="post-history-date-picker-header"
                            >
                                <button
                                    type="button"
                                    class="post-history-date-picker-year-nav"
                                    aria-label="Previous year"
                                    onclick={() =>
                                        shiftYear(-1)}
                                >
                                    <span
                                        class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                                <DatePicker.PrevButton
                                    class="post-history-date-picker-nav"
                                    aria-label="Previous month"
                                >
                                    <span
                                        class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon"
                                        aria-hidden="true"
                                    ></span>
                                </DatePicker.PrevButton>
                                <DatePicker.Heading
                                    class="post-history-date-picker-heading"
                                />
                                <DatePicker.NextButton
                                    class="post-history-date-picker-nav"
                                    aria-label="Next month"
                                >
                                    <span
                                        class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon"
                                        aria-hidden="true"
                                    ></span>
                                </DatePicker.NextButton>
                                <button
                                    type="button"
                                    class="post-history-date-picker-year-nav"
                                    aria-label="Next year"
                                    onclick={() =>
                                        shiftYear(1)}
                                >
                                    <span
                                        class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            </DatePicker.Header>
                            {#each months as month, monthIndex (`${month.value.toString()}-${monthIndex}`)}
                                <DatePicker.Grid
                                    class="post-history-date-picker-grid"
                                >
                                    <DatePicker.GridHead>
                                        <DatePicker.GridRow>
                                            {#each weekdays as weekday, weekdayIndex (`${weekday}-${weekdayIndex}`)}
                                                <DatePicker.HeadCell
                                                    class="post-history-date-picker-weekday"
                                                >
                                                    {weekday}
                                                </DatePicker.HeadCell>
                                            {/each}
                                        </DatePicker.GridRow>
                                    </DatePicker.GridHead>
                                    <DatePicker.GridBody>
                                        {#each month.weeks as week, weekIndex (`${month.value.toString()}-week-${weekIndex}`)}
                                            <DatePicker.GridRow>
                                                {#each week as dateValue, dateIndex (`${dateValue.toString()}-${dateIndex}`)}
                                                    <DatePicker.Cell
                                                        date={dateValue}
                                                        month={month.value}
                                                    >
                                                        <DatePicker.Day
                                                            class="post-history-date-picker-day"
                                                        >
                                                            {dateValue.day}
                                                        </DatePicker.Day>
                                                    </DatePicker.Cell>
                                                {/each}
                                            </DatePicker.GridRow>
                                        {/each}
                                    </DatePicker.GridBody>
                                </DatePicker.Grid>
                            {/each}
                        {/snippet}
                    </DatePicker.Calendar>
                </DatePicker.Content>
            </DatePicker.Portal>
        </DatePicker.Root>
        <Button
            type="button"
            variant="primary"
            contentLayout="icon"
            shape="square"
            ariaLabel={$_("postHistory.jumpToDateSubmit")}
            className="post-history-utility-button post-history-utility-submit-button"
            onClick={onSubmit}
        >
            <div class="jump-icon svg-icon" aria-hidden="true"></div>
        </Button>
        <Button
            type="button"
            variant="default"
            contentLayout="icon"
            shape="square"
            ariaLabel={$_("postHistory.hideJumpToDate")}
            className="post-history-utility-button post-history-utility-close-button"
            onClick={onClose}
        >
            <div class="xmark-icon svg-icon" aria-hidden="true"></div>
        </Button>
    </div>
</div>

<style>
    .post-history-utility-panel {
        display: flex;
        flex-direction: column;
        padding: 6px 16px 6px;
        border-bottom: 1px solid var(--border-hr);
        gap: 2px;
    }

    .post-history-utility-label {
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-utility-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
    }

    :global(.post-history-date-picker-input) {
        display: inline-flex;
        align-items: stretch;
        gap: 2px;
        min-width: 0;
        padding: 6px;
        height: 40px;
        border: 1px solid var(--border-hr);
        background: var(--background);
        color: var(--text);
        font: inherit;
    }

    :global(.post-history-date-picker-segment) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1ch;
        height: auto;
        color: var(--text-muted);

        &[role="spinbutton"] {
            min-width: 3ch;
        }

        &[data-segment="year"] {
            min-width: 5ch;
        }
    }

    :global(.post-history-date-picker-trigger) {
        flex: 0 0 auto;
        min-width: 40px;
        min-height: 40px;
        padding: 0;
    }

    :global(.post-history-date-picker-trigger .svg-icon) {
        mask-image: url("/icons/calendar_today_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 24px;
        height: 24px;
    }

    :global(.post-history-date-picker-content) {
        z-index: 110;
        background-color: var(--dialog-bg2);
        border: 1px solid var(--border-soft);
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 12px 28px rgb(0 0 0 / 0.16);
    }

    :global(.post-history-date-picker-calendar) {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    :global(.post-history-date-picker-header) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    :global(.post-history-date-picker-heading) {
        flex: 1 1 auto;
        text-align: center;
        font-size: 0.9rem;
        font-weight: 600;
    }

    :global(.post-history-date-picker-nav),
    :global(.post-history-date-picker-year-nav) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border: 1px solid var(--border-soft);
        border-radius: 6px;
        background-color: var(--btn-bg2);
        color: var(--text);
    }

    :global(.post-history-date-picker-nav-icon),
    :global(.post-history-date-picker-year-nav-icon) {
        width: 24px;
        height: 24px;
        background-color: currentColor;
    }

    :global(.post-history-date-picker-nav-icon-left) {
        margin-inline-end: 1px;
        mask-image: url("/icons/keyboard_arrow_left_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-date-picker-nav-icon-right) {
        margin-inline-start: 1px;
        mask-image: url("/icons/keyboard_arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-date-picker-year-nav-icon-left) {
        mask-image: url("/icons/keyboard_double_arrow_left_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-date-picker-year-nav-icon-right) {
        mask-image: url("/icons/keyboard_double_arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-date-picker-grid) {
        border-collapse: separate;
        border-spacing: 2px;
    }

    :global(.post-history-date-picker-weekday) {
        color: var(--text-muted);
        font-size: 0.74rem;
        font-weight: 500;
        text-align: center;
    }

    :global(.post-history-date-picker-day) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        font-size: 0.86rem;
    }

    :global(.post-history-date-picker-day[data-selected]) {
        background: color-mix(in srgb, var(--theme), white 10%);
        color: white;
    }

    :global(.post-history-date-picker-day[data-disabled]) {
        opacity: 0.45;
    }

    :global(.post-history-utility-button) {
        height: auto;
        min-height: 40px;
        white-space: nowrap;
    }

    :global(.post-history-utility-button.post-history-utility-submit-button),
    :global(.post-history-utility-button.post-history-utility-close-button) {
        min-width: 70px;
        min-height: 40px;
    }

    .jump-icon {
        mask-image: url("/icons/keyboard_tab_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-utility-close-button) .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
</style>
