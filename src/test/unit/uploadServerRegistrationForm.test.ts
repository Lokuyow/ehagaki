import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import { readable } from "svelte/store";
import UploadServerRegistration from "../../components/UploadServerRegistration.svelte";
import type { UploadRegistrationView } from "../../lib/upload/uploadServerRegistration";

vi.mock("svelte-i18n", () => ({ _: readable((key: string) => key) }));
function props() {
    return { registration: { target: { domain: "yabu.me", origin: "https://share.yabu.me",
        registrationUrl: "https://share.yabu.me/register", termsUrl: "https://share.yabu.me/api/v2/tos" },
        phase: "offer", policy: { minLength: 3, maxLength: 20 }, error: null } as UploadRegistrationView,
        initialUsername: "Display_Name", onOpen: vi.fn(async () => undefined), onCancel: vi.fn(),
        onRegister: vi.fn(async (_name: string) => undefined), onRefresh: vi.fn(async () => undefined) };
}
const button = (name: string) => screen.getByRole("button", { name: `uploadedMedia.registration.${name}` });

describe("server registration form", () => {
    it("copies the display name on opening, focuses input and preserves edits when the profile changes", async () => {
        const p = props(), { rerender } = render(UploadServerRegistration, p);
        await fireEvent.click(button("open"));
        await rerender({ ...p, registration: { ...p.registration, phase: "ready" } });
        const input = screen.getByRole("textbox", { name: "uploadedMedia.registration.username" });
        expect((input as HTMLInputElement).value).toBe("Display_Name");
        await waitFor(() => expect(document.activeElement).toBe(input));
        await fireEvent.input(input, { target: { value: "edited_name" } });
        await rerender({ ...p, initialUsername: "new_profile", registration: { ...p.registration, phase: "ready" } });
        expect((input as HTMLInputElement).value).toBe("edited_name");
        await fireEvent.submit(input.closest("form")!);
        expect(p.onRegister).toHaveBeenCalledWith("edited_name");
        expect(screen.getByRole("link", { name: "uploadedMedia.registration.terms" }).getAttribute("href")).toBe(p.registration.target.termsUrl);
    });
    it.each(["日本語🎨", "ab", "a".repeat(21), "", "some name"])("requires editing an invalid initial name (%s)", async initialUsername => {
        const p = { ...props(), initialUsername }, { rerender } = render(UploadServerRegistration, p);
        await fireEvent.click(button("open"));
        await rerender({ ...p, registration: { ...p.registration, phase: "ready" } });
        expect((button("submit") as HTMLButtonElement).disabled).toBe(true);
        const input = screen.getByRole("textbox");
        expect(input.getAttribute("aria-invalid")).toBe("true");
        await fireEvent.submit(input.closest("form")!);
        expect(p.onRegister).not.toHaveBeenCalled();
        await fireEvent.input(input, { target: { value: "valid-name" } });
        expect((button("submit") as HTMLButtonElement).disabled).toBe(false);
    });
    it("allows correcting a name conflict and disables repeated submissions while signing", async () => {
        const p = props(), { rerender } = render(UploadServerRegistration, p);
        await fireEvent.click(button("open"));
        await rerender({ ...p, registration: { ...p.registration, phase: "ready" } });
        const input = screen.getByRole("textbox");
        await fireEvent.submit(input.closest("form")!);
        await rerender({ ...p, registration: { ...p.registration, phase: "ready", error: "usernameTaken" } });
        expect(screen.getByRole("alert").textContent).toBe("uploadedMedia.registration.errors.usernameTaken");
        await fireEvent.input(input, { target: { value: "another_name" } });
        expect(screen.queryByRole("alert")).toBeNull();
        await rerender({ ...p, registration: { ...p.registration, phase: "submitting" } });
        expect((input as HTMLInputElement).disabled).toBe(true);
        expect((button("submitting") as HTMLButtonElement).disabled).toBe(true);
        await fireEvent.submit(input.closest("form")!);
        expect(p.onRegister).toHaveBeenCalledOnce();
    });
    it.each(["external", "unknown"] as const)("offers the official site and a list refresh for %s", async phase => {
        const p = props(); p.registration.phase = phase;
        render(UploadServerRegistration, p);
        expect(screen.queryByRole("textbox")).toBeNull();
        const link = screen.getByRole("link", { name: "uploadedMedia.registration.official" });
        expect(link.getAttribute("href")).toBe("https://share.yabu.me/register");
        expect(link.getAttribute("rel")).toContain("noreferrer");
        await fireEvent.click(screen.getByRole("button", { name: "uploadedMedia.refresh" }));
        expect(p.onRefresh).toHaveBeenCalledOnce();
        expect(p.onRegister).not.toHaveBeenCalled();
    });
    it("returns focus to the registration button after cancelling", async () => {
        const p = props(), { rerender } = render(UploadServerRegistration, p);
        await fireEvent.click(button("open"));
        await rerender({ ...p, registration: { ...p.registration, phase: "ready" } });
        p.onCancel.mockImplementation(() => { void rerender(p); });
        await fireEvent.click(screen.getByRole("button", { name: "common.cancel" }));
        expect(p.onCancel).toHaveBeenCalledOnce();
        await waitFor(() => expect(document.activeElement).toBe(button("open")));
    });
});
