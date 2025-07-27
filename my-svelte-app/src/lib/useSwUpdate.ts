import { writable, get } from "svelte/store";

export const showSwUpdateModal = writable(false);
export const waitingSw = writable<ServiceWorker | null>(null);

export function reloadForSwUpdate() {
  const sw = get(waitingSw);
  if (sw) {
    sw.postMessage({ type: "SKIP_WAITING" });
  }
  showSwUpdateModal.set(false);
  location.reload();
}

export function cancelSwUpdateModal() {
  showSwUpdateModal.set(false);
  waitingSw.set(null);
}

export function handleSwUpdate(sw?: ServiceWorker) {
  if ("serviceWorker" in navigator) {
    if (sw) {
      showSwUpdateModal.set(true);
      waitingSw.set(sw);
    }
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      location.reload();
    });

    navigator.serviceWorker.ready.then((reg) => {
      if (reg && reg.waiting) {
        showSwUpdateModal.set(true);
        waitingSw.set(reg.waiting);
      }
      reg.addEventListener("updatefound", () => {
        const newSw = reg.installing;
        if (newSw) {
          newSw.addEventListener("statechange", () => {
            if (
              newSw.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showSwUpdateModal.set(true);
              waitingSw.set(newSw);
            }
          });
        }
      });
    });
  }
}

export function useSwUpdate() {
  return {
    showSwUpdateModal,
    waitingSw,
    reloadForSwUpdate,
    cancelSwUpdateModal,
    handleSwUpdate,
  };
}
