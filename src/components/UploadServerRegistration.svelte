<script lang="ts">
    import { tick } from "svelte";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { isUploadRegistrationUsernameValid, type UploadRegistrationView } from "../lib/upload/uploadServerRegistration";

    interface Props {
        registration: UploadRegistrationView;
        initialUsername: string;
        onOpen: () => Promise<void>;
        onCancel: () => void;
        onRegister: (username: string) => Promise<void>;
        onRefresh: () => Promise<void>;
    }
    let { registration, initialUsername, onOpen, onCancel, onRegister, onRefresh }: Props = $props();
    const inputId = $props.id();
    let username = $state("");
    let submittedUsername = $state("");
    let input: HTMLInputElement | undefined = $state();
    let section: HTMLElement | undefined = $state();
    const busy = $derived(registration.phase === "submitting");
    const valid = $derived(!!registration.policy && isUploadRegistrationUsernameValid(username, registration.policy));
    const error = $derived(registration.error &&
        (!["usernameTaken", "invalidUsername"].includes(registration.error) || username === submittedUsername)
        ? registration.error : null);

    function open() {
        username = initialUsername.trim();
        submittedUsername = "";
        void onOpen();
    }
    function cancel() {
        onCancel();
        void tick().then(() => section?.querySelector("button")?.focus({ preventScroll: true }));
    }
    $effect(() => {
        if (registration.phase === "ready") void tick().then(() => input?.focus({ preventScroll: true }));
    });
</script>

<section class="registration" bind:this={section} aria-label={$_("uploadedMedia.registration.title")}>
    {#if registration.phase === "offer"}
        <p>{$_("uploadedMedia.registration.offer")}</p>
        <div><Button onClick={open}>{$_("uploadedMedia.registration.open")}</Button></div>
    {:else}
        <p class="target">{registration.target.domain}</p>
        {#if registration.phase === "loading"}
            <LoadingPlaceholder showLoader text={true} />
            <Button onClick={cancel}>{$_("common.cancel")}</Button>
        {:else if registration.phase === "external"}
            <p role="status">{$_("uploadedMedia.registration.external")}</p>
            <a href={registration.target.registrationUrl} target="_blank" rel="noopener noreferrer">{$_("uploadedMedia.registration.official")}</a>
            <Button onClick={() => onRefresh()}>{$_("uploadedMedia.refresh")}</Button>
        {:else if registration.phase === "unknown"}
            <p role="alert">{$_("uploadedMedia.registration.errors.unknownRegistration")}</p>
            <Button onClick={() => onRefresh()}>{$_("uploadedMedia.refresh")}</Button>
            <a href={registration.target.registrationUrl} target="_blank" rel="noopener noreferrer">{$_("uploadedMedia.registration.official")}</a>
        {:else}
            <form onsubmit={(event) => {
                event.preventDefault();
                if (valid && !busy) { submittedUsername = username; void onRegister(username); }
            }} aria-busy={busy}>
                <label for={inputId}>{$_("uploadedMedia.registration.username")}</label>
                <input id={inputId} bind:this={input} bind:value={username} disabled={busy}
                    aria-describedby={`${inputId}-help${error ? ` ${inputId}-error` : ""}`}
                    aria-invalid={!valid || !!error && ["invalidUsername", "usernameTaken"].includes(error)}
                    autocomplete="off" autocapitalize="none" spellcheck={false} required />
                <p id={`${inputId}-help`}>{$_("uploadedMedia.registration.usernameHelp", { values: {
                    min: registration.policy!.minLength, max: registration.policy!.maxLength,
                } })}</p>
                <p>{$_("uploadedMedia.registration.agreement")}
                    <a href={registration.target.termsUrl} target="_blank" rel="noopener noreferrer">{$_("uploadedMedia.registration.terms")}</a>
                </p>
                {#if error}<p id={`${inputId}-error`} role="alert">{$_(`uploadedMedia.registration.errors.${error}`)}</p>{/if}
                <div class="actions">
                    <Button type="submit" disabled={!valid || busy}>{$_(busy ? "uploadedMedia.registration.submitting" : "uploadedMedia.registration.submit")}</Button>
                    <Button onClick={cancel}>{$_("common.cancel")}</Button>
                </div>
            </form>
        {/if}
    {/if}
</section>

<style>
    .registration { margin: 8px 12px; padding: 12px; border: 1px solid var(--border); border-radius: 6px; min-width: 0; overflow-wrap: anywhere; }
    form, .registration { display: flex; flex-direction: column; gap: 8px; }
    p { margin: 0; }
    .target { font-weight: bold; }
    input { box-sizing: border-box; width: 100%; min-width: 0; padding: 8px; min-height: 44px; font: inherit;
        color: var(--text); background: var(--dialog-bg); border: 1px solid var(--border); border-radius: 4px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
