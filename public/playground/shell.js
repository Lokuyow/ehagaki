// Small shared helpers for the eHagaki Playground pages.
// This module must not import or define <ehagaki-composer>: each page loads
// exactly one embed distribution (iframe / Full / Lite) in its own document.

/** Theme presets shared by the Playground pages (accent / base). */
export const THEME_PRESETS = Object.freeze({
    azure: Object.freeze({ label: "Azure", accent: "#005FCC", base: "#0077FF" }),
    rose: Object.freeze({ label: "Rose", accent: "#B4233C", base: "#FF3B5C" }),
    forest: Object.freeze({ label: "Forest", accent: "#1F7A4D", base: "#00A86B" }),
    amber: Object.freeze({ label: "Amber", accent: "#8A5700", base: "#F2B000" }),
});

function readCopyText(target) {
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
        return target.value;
    }
    return target.textContent ?? "";
}

async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.setAttribute("readonly", "");
    scratch.style.position = "fixed";
    scratch.style.opacity = "0";
    document.body.append(scratch);
    scratch.select();
    try {
        document.execCommand("copy");
    } finally {
        scratch.remove();
    }
}

/** Buttons with data-copy-target="<id>" copy that element's text or value. */
function bindCopyButtons(root = document) {
    for (const button of root.querySelectorAll("button[data-copy-target]")) {
        const label = button.textContent;
        let resetTimer = 0;
        button.addEventListener("click", async () => {
            const target = document.getElementById(button.dataset.copyTarget ?? "");
            if (!target) return;
            try {
                await writeClipboard(readCopyText(target));
                button.textContent = "コピーしました";
            } catch {
                button.textContent = "コピーできませんでした";
            }
            window.clearTimeout(resetTimer);
            resetTimer = window.setTimeout(() => {
                button.textContent = label;
            }, 1600);
        });
    }
}

/** role="tablist" groups whose tabs control role="tabpanel" elements. */
function bindTabLists(root = document) {
    for (const list of root.querySelectorAll("[role=tablist][data-pg-tabs]")) {
        const tabs = Array.from(list.querySelectorAll("[role=tab]"));
        const select = (selected) => {
            for (const tab of tabs) {
                const active = tab === selected;
                tab.setAttribute("aria-selected", String(active));
                tab.tabIndex = active ? 0 : -1;
                const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
                if (panel) panel.hidden = !active;
            }
        };
        list.addEventListener("click", (event) => {
            const tab = event.target instanceof Element ? event.target.closest("[role=tab]") : null;
            if (tab && tabs.includes(tab)) select(tab);
        });
        list.addEventListener("keydown", (event) => {
            const index = tabs.indexOf(document.activeElement);
            if (index < 0) return;
            let next = -1;
            if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
            if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = tabs.length - 1;
            if (next < 0) return;
            event.preventDefault();
            select(tabs[next]);
            tabs[next].focus();
        });
    }
}

bindCopyButtons();
bindTabLists();
