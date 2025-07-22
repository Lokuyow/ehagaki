import { register, init, getLocaleFromNavigator } from "svelte-i18n";

register("ja", () => import("./locales/ja.json"));
register("en", () => import("./locales/en.json"));

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