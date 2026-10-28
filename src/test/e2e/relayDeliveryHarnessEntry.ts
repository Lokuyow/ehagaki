import "../../app.css";
import "../../i18n";
import { mount } from "svelte";
import { configureAppRuntimeEnvironment } from "../../lib/appRuntimeEnvironment";
const params = new URLSearchParams(location.search);
if (params.has("frame")) {
    document.getElementById("app")?.remove();
    const frame = document.createElement("iframe");
    frame.src = `relay-delivery-playwright.html?theme=${params.get("theme") ?? "light"}${params.has("mascot") ? "&mascot=1" : ""}`;
    frame.style.cssText = "width:280px;height:340px;margin:40px;border:1px solid gray";
    document.body.append(frame);
} else {
    document.documentElement.className = params.get("theme") ?? "light";
    document.documentElement.style.colorScheme = params.get("theme") === "dark" ? "dark" : "light";
    const target = document.getElementById("app")!;
    const container = params.has("container");
    if (container) target.style.cssText = "position:relative;width:280px;height:340px;margin:40px;overflow:hidden;background:var(--bg)";
    configureAppRuntimeEnvironment({ runtimeKind: container ? "web-component" : window.top === window ? "standalone" : "iframe",
        layoutMode: container ? "container" : "viewport", layoutTarget: container ? target : document.body,
        overlayTarget: container ? target : document.body, domRoot: document });
    const { default: Harness } = await import("./RelayDeliveryHarness.svelte");
    mount(Harness, { target });
}
