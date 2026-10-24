export type ManualE2eOs = "auto" | "ubuntu" | "windows" | "both";
export type ManualE2eProject =
    | "all"
    | "desktop-chromium"
    | "mobile-chromium"
    | "android-chromium"
    | "mobile-webkit"
    | "desktop-firefox"
    | "desktop-firefox-editor-paste";

export interface ManualE2eWorkflowInput {
    os?: string;
    specs?: string;
    project?: string;
    grep?: string;
    repeat?: string;
}

export interface ManualE2eRunner {
    os: "ubuntu-latest" | "windows-latest";
    engines: "all" | "chromium";
    all_browsers: "1" | "0";
}

export interface ResolvedManualE2eInputs {
    focused: boolean;
    os: ManualE2eOs;
    specs: string[];
    project: ManualE2eProject;
    grep: string;
    repeat: 1 | 3 | 5;
    runners: ManualE2eRunner[];
}

const PROJECTS: readonly ManualE2eProject[] = [
    "all",
    "desktop-chromium",
    "mobile-chromium",
    "android-chromium",
    "mobile-webkit",
    "desktop-firefox",
    "desktop-firefox-editor-paste",
];
const SPEC_FILTER = /^(?:src\/test\/e2e\/)?(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.spec\.ts(?::[1-9]\d*)?$/;

function parseSpecs(value: string): string[] {
    const specs = value.trim().split(/\s+/).filter(Boolean);
    for (const spec of specs) {
        if (!SPEC_FILTER.test(spec) || spec.split("/").some((segment) => segment === "..")) {
            throw new Error(`Invalid E2E spec path: ${spec}`);
        }
    }
    return specs;
}

export function resolveManualE2eInputs(input: ManualE2eWorkflowInput): ResolvedManualE2eInputs {
    const os = input.os || "auto";
    if (os !== "auto" && os !== "ubuntu" && os !== "windows" && os !== "both") {
        throw new Error("e2e_os must be auto, ubuntu, windows, or both");
    }

    const project = input.project || "all";
    if (!PROJECTS.includes(project as ManualE2eProject)) {
        throw new Error(`Unsupported Playwright project: ${project}`);
    }

    const repeatValue = input.repeat || "1";
    if (repeatValue !== "1" && repeatValue !== "3" && repeatValue !== "5") {
        throw new Error("e2e_repeat must be 1, 3, or 5");
    }
    const repeat = Number(repeatValue) as 1 | 3 | 5;
    const specs = parseSpecs(input.specs || "");
    const grep = input.grep || "";
    if (repeat > 1 && specs.length === 0 && grep === "") {
        throw new Error("Repeated E2E runs require e2e_specs or e2e_grep");
    }

    const filtersE2e = specs.length > 0 || grep !== "" || project !== "all" || repeat > 1;
    const focused = filtersE2e || os === "ubuntu" || os === "windows";
    const selectedOs = os === "auto"
        ? focused ? ["ubuntu"] : ["ubuntu", "windows"]
        : os === "both" ? ["ubuntu", "windows"] : [os];

    const needsNonChromium = project === "mobile-webkit"
        || project === "desktop-firefox"
        || project === "desktop-firefox-editor-paste";
    if (selectedOs.includes("windows") && needsNonChromium) {
        throw new Error(`${project} is available only on Ubuntu`);
    }

    const runners: ManualE2eRunner[] = selectedOs.map((runnerOs) => runnerOs === "windows"
        ? { os: "windows-latest", engines: "chromium", all_browsers: "0" }
        : { os: "ubuntu-latest", engines: "all", all_browsers: "1" });

    return {
        focused,
        os,
        specs,
        project: project as ManualE2eProject,
        grep,
        repeat,
        runners,
    };
}
