import "../../app.css";
import "../../i18n";
import { mount } from "svelte";
import ComposerTargetDialogHarness from "./ComposerTargetDialogHarness.svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Harness mount target was not found.");

mount(ComposerTargetDialogHarness, { target });
