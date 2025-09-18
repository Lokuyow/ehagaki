import { register, init, getLocaleFromNavigator, locale } from "svelte-i18n";

register("ja", () => import("./lib/i18n/ja.json"));
register("en", () => import("./lib/i18n/en.json"));

// ロケール判定ロジックを関数として抽出
export function determineInitialLocale(): string {
  const storedLocale = localStorage.getItem("locale");
  const navLocale = getLocaleFromNavigator();
  return storedLocale && (storedLocale === "ja" || storedLocale === "en")
    ? storedLocale
    : navLocale && navLocale.startsWith("ja")
      ? "ja"
      : "en";
}

const initialLocale = determineInitialLocale();

// 同期的に初期化を完了
init({
  fallbackLocale: "ja",
  initialLocale,
  loadingDelay: 0, // 追加: ローディング遅延をゼロに
});

// ロケールを即座に設定（ブラウザ更新時の一瞬の英語表示を防ぐ）
locale.set(initialLocale);