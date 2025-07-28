import { register, init, getLocaleFromNavigator } from "svelte-i18n";

register("ja", () => import("./lib/i18n/ja.json"));
register("en", () => import("./lib/i18n/en.json"));

const storedLocale = localStorage.getItem("locale");
const navLocale = getLocaleFromNavigator();
const initialLocale =
  storedLocale && (storedLocale === "ja" || storedLocale === "en")
    ? storedLocale
    : navLocale && navLocale.startsWith("ja")
      ? "ja"
      : "en";

init({
    fallbackLocale: "ja",
    initialLocale,
});