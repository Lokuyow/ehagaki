<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        value: string; // 必須: ラジオボタンの値
        name: string; // 必須: グループ名
        checked?: boolean; // 選択状態
        disabled?: boolean;
        variant?:
            | "default"
            | "primary"
            | "danger"
            | "secondary"
            | "warning"
            | "header";
        shape?: "square" | "rounded" | "pill" | "circle";
        className?: string;
        ariaLabel?: string;
        style?: string;
        children?: import("svelte").Snippet;
        onChange?: (value: string) => void; // 選択変更時のコールバック
    }

    let {
        value,
        name,
        checked = false,
        disabled = false,
        variant = "default",
        shape = "rounded",
        className = "",
        ariaLabel = "",
        style = "",
        children,
        onChange,
    }: Props = $props();

    let inputElement: HTMLInputElement;

    function handleButtonClick() {
        if (!disabled && inputElement) {
            inputElement.click(); // inputをプログラム的にクリック
        }
    }

    function handleInputChange() {
        if (onChange) onChange(value);
    }
</script>

<!-- 隠れたラジオボタン -->
<input
    type="radio"
    {value}
    {name}
    {checked}
    {disabled}
    bind:this={inputElement}
    onchange={handleInputChange}
    style="display: none;"
/>

<!-- Button.svelteで見た目を制御 -->
<Button
    {variant}
    {shape}
    {className}
    {ariaLabel}
    {style}
    {disabled}
    selected={checked}
    onClick={handleButtonClick}
>
    {@render children?.()}
</Button>
