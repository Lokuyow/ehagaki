import "../../app.css";
import "../../i18n";
import { mount } from "svelte";
import SensitivePayloadHarness from "./SensitivePayloadHarness.svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Sensitive payload harness mount target was not found.");
mount(SensitivePayloadHarness, { target });
