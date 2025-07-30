import { writable, get } from "svelte/store";

export const showSwUpdateModal = writable(false);
export const waitingSw = writable<ServiceWorker | null>(null);

// 高速化: 更新プロセス即時実行
export function reloadForSwUpdate() {
  const sw = get(waitingSw);
  if (sw) {
    sw.postMessage({ type: "SKIP_WAITING" });
  }
  showSwUpdateModal.set(false);

  // サービスワーカーの更新後、controllerchangeで自動リロード
  if (!navigator.serviceWorker.controller) {
    location.reload();
  }
}

export function cancelSwUpdateModal() {
  showSwUpdateModal.set(false);
  waitingSw.set(null);
}

// サービスワーカーの更新を検知し、すぐに通知する
export function handleSwUpdate(sw?: ServiceWorker) {
  if ("serviceWorker" in navigator) {
    if (sw) {
      // 既に待機中のSWがある場合は即時表示
      showSwUpdateModal.set(true);
      waitingSw.set(sw);
      return;
    }

    // controllerchangeイベントでページを即時リロード
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      location.reload();
    });

    // 既存のSWをチェック（できるだけ早く）
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg && reg.waiting) {
        showSwUpdateModal.set(true);
        waitingSw.set(reg.waiting);
      }

      // 新しいSWの監視も設定
      if (reg) {
        if (reg.installing) {
          const newSw = reg.installing;
          newSw.addEventListener("statechange", () => {
            if (newSw.state === "installed") {
              showSwUpdateModal.set(true);
              waitingSw.set(newSw);
            }
          });
        }

        reg.addEventListener("updatefound", () => {
          const newSw = reg.installing;
          if (newSw) {
            newSw.addEventListener("statechange", () => {
              if (newSw.state === "installed") {
                // すぐに更新通知
                showSwUpdateModal.set(true);
                waitingSw.set(newSw);
              }
            });
          }
        });
      }
    });
  }
}

// 手動でサービスワーカーの更新をチェック
export function checkForUpdates() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        reg.update();
      }
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
    checkForUpdates,
  };
}
