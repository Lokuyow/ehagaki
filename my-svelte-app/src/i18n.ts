import { register, init, getLocaleFromNavigator, addMessages } from "svelte-i18n";

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

addMessages('en', {
  // ...existing translations...
  shared_image_received: 'Shared image received and uploaded',
  processing_shared_image: 'Processing shared image...',
});

addMessages('ja', {
  // ...existing translations...
  shared_image_received: '共有画像を受信してアップロードしました',
  processing_shared_image: '共有画像を処理しています...',
});