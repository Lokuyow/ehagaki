const MAX_TRACE_ENTRIES = 600;
const HOST_OPTIONS = Object.freeze({
  contentWarningEnabled: false,
  hashtagPinEnabled: false,
  keyboardButtonBarEnabled: false,
  editorSubmitButtonEnabled: true,
  enterKeyBehavior: "newline",
});
const BUNDLE_URL = new URL("../web-component/host-owned/ehagaki-composer.js", import.meta.url).href;
const ASSET_BASE = new URL("../web-component/host-owned/", import.meta.url).href;
const POINTER_EVENT_TYPES = [
  "pointerdown",
  "pointerup",
  "pointercancel",
  "gotpointercapture",
  "lostpointercapture",
  "touchstart",
  "touchend",
  "touchcancel",
  "mousedown",
  "mouseup",
  "click",
  "focus",
  "blur",
  "focusin",
  "focusout",
];

const pageState = {
  variant: document.documentElement.dataset.variant ?? "unknown",
  viewportMode: document.documentElement.dataset.viewportMode ?? "unknown",
  mountMode: document.body.dataset.mountMode ?? "unknown",
};
const statusElement = document.querySelector("#status");
const traceOutput = document.querySelector("#trace-output");
const mount = document.querySelector("#mount");
const traceRing = new Array(MAX_TRACE_ENTRIES);
let traceCount = 0;
let traceCursor = 0;
let totalTraceEntries = 0;
let hostSubmitCount = 0;
let composer = null;
let shadowRoot = null;
let shell = null;
let editor = null;
let submitButton = null;

function round(value) {
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

function safeElementName(value) {
  if (value === window) return "window";
  if (value === document) return "document";
  if (value instanceof ShadowRoot) return "shadow-root";
  if (!(value instanceof Element)) return value?.nodeName?.toLowerCase?.() ?? null;

  const tag = value.tagName.toLowerCase();
  const id = value.id ? `#${value.id.replace(/[^a-zA-Z0-9_-]/g, "_")}` : "";
  const classNames = [...value.classList]
    .filter((className) => /^[a-zA-Z0-9_-]+$/.test(className))
    .slice(0, 4)
    .map((className) => `.${className}`)
    .join("");
  return `${tag}${id}${classNames}`;
}

function rectFor(element) {
  if (!(element instanceof Element)) return null;
  const rect = element.getBoundingClientRect();
  return {
    x: round(rect.x),
    y: round(rect.y),
    top: round(rect.top),
    right: round(rect.right),
    bottom: round(rect.bottom),
    left: round(rect.left),
    width: round(rect.width),
    height: round(rect.height),
  };
}

function virtualKeyboardState() {
  const virtualKeyboard = navigator.virtualKeyboard;
  if (!virtualKeyboard) {
    return { available: false, overlaysContent: null, boundingRect: null };
  }

  let overlaysContent = null;
  let boundingRect = null;
  try {
    overlaysContent = virtualKeyboard.overlaysContent;
  } catch {
    overlaysContent = "unavailable";
  }
  try {
    const rect = virtualKeyboard.boundingRect;
    boundingRect = rect
      ? {
          x: round(rect.x),
          y: round(rect.y),
          top: round(rect.top),
          right: round(rect.right),
          bottom: round(rect.bottom),
          left: round(rect.left),
          width: round(rect.width),
          height: round(rect.height),
        }
      : null;
  } catch {
    boundingRect = "unavailable";
  }
  return { available: true, overlaysContent, boundingRect };
}

function eventCoordinates(event) {
  if (event instanceof PointerEvent || event instanceof MouseEvent) {
    return { clientX: round(event.clientX), clientY: round(event.clientY) };
  }
  if (event instanceof TouchEvent) {
    const touch = event.changedTouches[0] ?? event.touches[0];
    return touch
      ? { clientX: round(touch.clientX), clientY: round(touch.clientY) }
      : null;
  }
  return null;
}

function hitTest(coordinates) {
  if (!coordinates || coordinates.clientX === null || coordinates.clientY === null) {
    return { document: null, shadowRoot: null };
  }
  const { clientX, clientY } = coordinates;
  let shadowTarget = null;
  try {
    shadowTarget = shadowRoot?.elementFromPoint?.(clientX, clientY) ?? null;
  } catch {
    shadowTarget = null;
  }
  return {
    document: safeElementName(document.elementFromPoint(clientX, clientY)),
    shadowRoot: safeElementName(shadowTarget),
  };
}

function snapshot(coordinates = null) {
  const visualViewport = window.visualViewport;
  const keyboardHeightRaw = shell
    ? getComputedStyle(shell).getPropertyValue("--keyboard-height").trim()
    : "";
  const keyboardHeight = Number.parseFloat(keyboardHeightRaw);
  return {
    activeElement: {
      document: safeElementName(document.activeElement),
      shadowRoot: safeElementName(shadowRoot?.activeElement ?? null),
    },
    editorInputMode: editor?.getAttribute("inputmode") ?? null,
    shellKeyboardHeight: Number.isFinite(keyboardHeight) ? keyboardHeight : 0,
    shellKeyboardVisible: Number.isFinite(keyboardHeight) && keyboardHeight > 80,
    virtualKeyboard: virtualKeyboardState(),
    viewport: {
      innerWidth: round(window.innerWidth),
      innerHeight: round(window.innerHeight),
      documentClientWidth: round(document.documentElement.clientWidth),
      documentClientHeight: round(document.documentElement.clientHeight),
      scrollX: round(window.scrollX),
      scrollY: round(window.scrollY),
      visual: visualViewport
        ? {
            width: round(visualViewport.width),
            height: round(visualViewport.height),
            offsetLeft: round(visualViewport.offsetLeft),
            offsetTop: round(visualViewport.offsetTop),
            pageLeft: round(visualViewport.pageLeft),
            pageTop: round(visualViewport.pageTop),
            scale: round(visualViewport.scale),
          }
        : null,
    },
    rects: {
      mount: rectFor(mount),
      composer: rectFor(composer),
      editor: rectFor(editor),
      submitButton: rectFor(submitButton),
    },
    coordinates,
    hitTest: hitTest(coordinates),
    hostSubmitCount,
  };
}

function appendTrace(kind, details = {}, coordinates = null) {
  const entry = {
    sequence: totalTraceEntries + 1,
    time: round(performance.now()),
    kind,
    ...details,
    snapshot: snapshot(coordinates),
  };
  traceRing[traceCursor] = entry;
  traceCursor = (traceCursor + 1) % MAX_TRACE_ENTRIES;
  traceCount = Math.min(traceCount + 1, MAX_TRACE_ENTRIES);
  totalTraceEntries += 1;
}

function orderedTraceEntries() {
  const start = (traceCursor - traceCount + MAX_TRACE_ENTRIES) % MAX_TRACE_ENTRIES;
  return Array.from({ length: traceCount }, (_, index) => traceRing[(start + index) % MAX_TRACE_ENTRIES]);
}

function recordEvent(event, listenerScope, listenerPhase) {
  const coordinates = eventCoordinates(event);
  const path = typeof event.composedPath === "function"
    ? event.composedPath().slice(0, 10).map(safeElementName)
    : [];
  appendTrace("dom-event", {
    event: event.type,
    listenerScope,
    listenerPhase,
    eventPhase: event.eventPhase,
    target: safeElementName(event.target),
    currentTarget: safeElementName(event.currentTarget),
    composedPath: path,
    isTrusted: event.isTrusted,
    cancelable: event.cancelable,
    defaultPrevented: event.defaultPrevented,
    pointerType: event instanceof PointerEvent ? event.pointerType : null,
    pointerId: event instanceof PointerEvent ? event.pointerId : null,
    buttons: event instanceof PointerEvent || event instanceof MouseEvent ? event.buttons : null,
    relatedTarget: "relatedTarget" in event ? safeElementName(event.relatedTarget) : null,
  }, coordinates);
}

function installPassiveDomListeners(target, listenerScope) {
  for (const eventName of POINTER_EVENT_TYPES) {
    target.addEventListener(
      eventName,
      (event) => recordEvent(event, listenerScope, "capture"),
      { capture: true, passive: true },
    );
    target.addEventListener(
      eventName,
      (event) => recordEvent(event, listenerScope, "bubble"),
      { capture: false, passive: true },
    );
  }
}

function installViewportListeners() {
  window.addEventListener(
    "resize",
    () => appendTrace("viewport-event", { source: "window", event: "resize" }),
    { passive: true },
  );
  window.visualViewport?.addEventListener(
    "resize",
    () => appendTrace("viewport-event", { source: "visualViewport", event: "resize" }),
    { passive: true },
  );
  window.visualViewport?.addEventListener(
    "scroll",
    () => appendTrace("viewport-event", { source: "visualViewport", event: "scroll" }),
    { passive: true },
  );
  navigator.virtualKeyboard?.addEventListener(
    "geometrychange",
    () => appendTrace("viewport-event", { source: "virtualKeyboard", event: "geometrychange" }),
    { passive: true },
  );
}

function installInputModeObserver() {
  if (!editor) return;
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      appendTrace("inputmode-mutation", {
        oldValue: record.oldValue,
        newValue: editor?.getAttribute("inputmode") ?? null,
      });
    }
  });
  observer.observe(editor, {
    attributes: true,
    attributeFilter: ["inputmode"],
    attributeOldValue: true,
  });
}

function traceDocument() {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    variant: pageState,
    bundleUrl: BUNDLE_URL,
    assetBase: ASSET_BASE,
    hostOptions: HOST_OPTIONS,
    environment: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      devicePixelRatio: window.devicePixelRatio,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        orientationType: screen.orientation?.type ?? null,
        orientationAngle: screen.orientation?.angle ?? null,
      },
      secureContext: window.isSecureContext,
      path: location.pathname,
    },
    totalTraceEntries,
    droppedTraceEntries: Math.max(0, totalTraceEntries - traceCount),
    hostSubmitCount,
    finalSnapshot: snapshot(),
    entries: orderedTraceEntries(),
  };
}

function jsonTrace() {
  return JSON.stringify(traceDocument(), null, 2);
}

function scheduleAfterGesture(action) {
  window.setTimeout(action, 0);
}

document.querySelector("#dump-trace").addEventListener("click", () => {
  scheduleAfterGesture(() => {
    traceOutput.textContent = jsonTrace();
  });
}, { passive: true });

document.querySelector("#download-trace").addEventListener("click", () => {
  scheduleAfterGesture(() => {
    const blob = new Blob([jsonTrace()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ehagaki-android-trace-${pageState.variant.toLowerCase()}-${Date.now()}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  });
}, { passive: true });

document.querySelector("#clear-trace").addEventListener("click", () => {
  scheduleAfterGesture(() => {
    traceCount = 0;
    traceCursor = 0;
    totalTraceEntries = 0;
    traceOutput.textContent = "Trace buffer cleared.";
    appendTrace("trace-cleared");
  });
}, { passive: true });

async function initialize() {
  statusElement.textContent = "loading shared Host-owned Lite bundle";
  await import(BUNDLE_URL);

  composer = document.createElement("ehagaki-composer");
  composer.id = "composer";
  composer.assetBase = ASSET_BASE;
  composer.configureHostOwned({
    ...HOST_OPTIONS,
    async submit(_output, { signal }) {
      hostSubmitCount += 1;
      appendTrace("host-submit-callback", {
        callbackCount: hostSubmitCount,
        signalAborted: signal.aborted,
      });
      return { eventId: "d".repeat(64) };
    },
  });
  for (const eventName of [
    "ehagaki-post-success",
    "ehagaki-post-error",
    "ehagaki-initialization-error",
  ]) {
    composer.addEventListener(eventName, (event) => {
      appendTrace("composer-event", {
        event: eventName,
        errorCode: eventName === "ehagaki-post-error" ? event.detail?.code ?? null : null,
      });
    }, { passive: true });
  }

  mount.append(composer);
  await composer.whenReady();
  shadowRoot = composer.shadowRoot;
  shell = shadowRoot?.querySelector(".ehagaki-web-component-shell") ?? null;
  editor = shadowRoot?.querySelector(".tiptap-editor") ?? null;
  submitButton = shadowRoot?.querySelector(".editor-submit-button") ?? null;
  if (!shadowRoot || !shell || !editor || !submitButton) {
    throw new Error("Diagnostic targets were not found after whenReady().");
  }

  installPassiveDomListeners(document, "document");
  installPassiveDomListeners(shadowRoot, "shadowRoot");
  installViewportListeners();
  installInputModeObserver();
  appendTrace("diagnostic-ready");

  window.__EHAGAKI_ANDROID_DIAGNOSTIC__ = Object.freeze({
    ready: true,
    variant: Object.freeze({ ...pageState }),
    bundleUrl: BUNDLE_URL,
    assetBase: ASSET_BASE,
    hostOptions: HOST_OPTIONS,
    getTrace: traceDocument,
  });
  document.documentElement.dataset.diagnosticReady = "true";
  statusElement.textContent = `ready | variant ${pageState.variant} | ${pageState.viewportMode} | ${pageState.mountMode}`;
}

initialize().catch((error) => {
  statusElement.textContent = `initialization failed: ${error?.message ?? String(error)}`;
  document.documentElement.dataset.diagnosticReady = "error";
});
