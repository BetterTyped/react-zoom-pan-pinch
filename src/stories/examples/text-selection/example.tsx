import React from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const SELECTABLE_CLASS = "selectable";

// Zoom is gated behind a modifier so a plain two-finger trackpad swipe pans.
// Keys are matched by their `event.key` name ("Control", not "Ctrl"); a
// trackpad pinch arrives as a wheel event with `ctrlKey` set, so it counts
// as "Control" and zooms too.
const ZOOM_KEYS = ["Meta", "Control"];
const hasZoomKey = (keys: string[]) =>
  ZOOM_KEYS.some((key) => keys.includes(key));

type ModifierState = { meta: boolean; control: boolean };

const IS_MAC =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * Tracks whether Cmd / Ctrl is held. Keyboard events only reach the story
 * iframe when it has focus, so the modifier flags carried by wheel and mouse
 * events are synced as well — the same trick the library uses internally.
 */
const useModifierKeys = () => {
  const [modifiers, setModifiers] = React.useState<ModifierState>({
    meta: false,
    control: false,
  });

  const sync = React.useCallback(
    (event: { metaKey: boolean; ctrlKey: boolean }) => {
      setModifiers((previous) =>
        previous.meta === event.metaKey && previous.control === event.ctrlKey
          ? previous
          : { meta: event.metaKey, control: event.ctrlKey },
      );
    },
    [],
  );

  React.useEffect(() => {
    const reset = () => setModifiers({ meta: false, control: false });
    window.addEventListener("keydown", sync);
    window.addEventListener("keyup", sync);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", sync);
      window.removeEventListener("keyup", sync);
      window.removeEventListener("blur", reset);
    };
  }, [sync]);

  return { modifiers, sync };
};

const keyCapStyle = (active: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "1px 7px",
  borderRadius: 5,
  border: `1px solid ${active ? "#818cf8" : "rgba(255, 255, 255, 0.18)"}`,
  background: active ? "#4f46e5" : "rgba(255, 255, 255, 0.08)",
  color: active ? "#ffffff" : "#e7e5e4",
  fontSize: 11,
  fontWeight: 700,
  fontFamily: "'SF Mono', 'Fira Code', ui-monospace, monospace",
  boxShadow: active ? "0 0 0 3px rgba(129, 140, 248, 0.35)" : "none",
  transition: "all 120ms ease",
});

const legendRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  whiteSpace: "nowrap",
};

const legendLabelStyle: React.CSSProperties = {
  width: 40,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.55)",
};

/**
 * Overlay in the viewer's top-right corner (the control bar sits top-left)
 * showing the gesture map and whether the zoom activation key is held.
 */
const GestureLegend: React.FC<{ modifiers: ModifierState }> = ({
  modifiers,
}) => {
  const zoomKeyHeld = modifiers.meta || modifiers.control;
  const primaryKey = IS_MAC ? "⌘ Cmd" : "Ctrl";

  let status = "No activation key — scroll pans";
  if (zoomKeyHeld && modifiers.meta) status = "Cmd held — scroll zooms";
  if (zoomKeyHeld && !modifiers.meta) {
    status = IS_MAC
      ? "Pinch / Ctrl held — zooming"
      : "Ctrl held — scroll zooms";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        top: 25,
        right: 25,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(15, 15, 20, 0.72)",
        backdropFilter: "blur(16px) saturate(1.6)",
        WebkitBackdropFilter: "blur(16px) saturate(1.6)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
        fontSize: 12,
        color: "#e7e5e4",
        pointerEvents: "none",
      }}
    >
      <div style={legendRowStyle}>
        <span style={legendLabelStyle}>Pan</span>
        <span>two-finger swipe</span>
      </div>
      <div style={legendRowStyle}>
        <span style={legendLabelStyle}>Zoom</span>
        <span>pinch, or</span>
        <span style={keyCapStyle(zoomKeyHeld)}>{primaryKey}</span>
        <span>+ scroll</span>
      </div>
      <div
        style={{
          marginTop: 2,
          paddingTop: 6,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: 11,
          fontWeight: 600,
          whiteSpace: "nowrap",
          color: zoomKeyHeld ? "#a5b4fc" : "rgba(255, 255, 255, 0.5)",
        }}
      >
        {status}
      </div>
    </div>
  );
};

const codeStyle: React.CSSProperties = {
  padding: "2px 6px",
  borderRadius: 4,
  background: "#e7e5e4",
  color: "#c2410c",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "'SF Mono', 'Fira Code', ui-monospace, monospace",
};

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const { modifiers, sync } = useModifierKeys();

  return (
    <div
      style={{ fontFamily: font, maxWidth: 720 }}
      onWheelCapture={sync}
      onMouseMoveCapture={sync}
      onMouseDownCapture={sync}
    >
      <TransformWrapper
        {...normalized}
        centerOnInit
        centerZoomedOut
        panning={{ ...normalized.panning, excluded: [SELECTABLE_CLASS] }}
        wheel={{ ...normalized.wheel, activationKeys: hasZoomKey }}
        trackPadPanning={{
          ...normalized.trackPadPanning,
          disabled: false,
          activationKeys: (keys) => !hasZoomKey(keys),
        }}
      >
        {(utils) => (
          <div style={{ position: "relative" }}>
            <Controls {...utils} />
            <GestureLegend modifiers={modifiers} />
            <TransformComponent
              wrapperStyle={{
                ...viewerChrome,
                width: "100%",
                height: "clamp(420px, 65vh, 600px)",
              }}
              contentStyle={{ width: 640 }}
            >
              <article
                className={SELECTABLE_CLASS}
                style={{
                  width: 640,
                  padding: "44px 48px",
                  boxSizing: "border-box",
                  background: "#fafaf9",
                  borderRadius: 12,
                  color: "#1c1917",
                  userSelect: "text",
                  cursor: "text",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 5,
                    background: "#e0e7ff",
                    color: "#4338ca",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Documentation
                </div>

                <h1
                  style={{
                    margin: "0 0 8px",
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.2,
                    color: "#0c0a09",
                  }}
                >
                  Text Selection
                </h1>

                <p
                  style={{
                    margin: "0 0 24px",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#57534e",
                  }}
                >
                  By default the library disables text selection because
                  click-and-drag is used for panning. To allow text selection
                  inside specific areas, use the{" "}
                  <code style={codeStyle}>panning.excluded</code> option with a
                  CSS class name.
                </p>

                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 8,
                    background: "#1e293b",
                    color: "#e2e8f0",
                    fontFamily:
                      "'SF Mono', 'Fira Code', ui-monospace, monospace",
                    fontSize: 12,
                    lineHeight: 1.7,
                    marginBottom: 24,
                    overflowX: "auto",
                    whiteSpace: "pre",
                  }}
                >
                  {`<TransformWrapper
  panning={{ excluded: ["selectable"] }}
>
  <TransformComponent>
    <article className="selectable">
      <p>You can select this text!</p>
    </article>
  </TransformComponent>
</TransformWrapper>`}
                </div>

                <h2
                  style={{
                    margin: "0 0 12px",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#1c1917",
                  }}
                >
                  How it works
                </h2>

                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#57534e",
                  }}
                >
                  The <code style={codeStyle}>excluded</code> array accepts CSS
                  class names. Any pointer event that originates on — or inside
                  — an element carrying that class is ignored by the panning
                  handler. This lets native browser text selection work normally
                  while all other areas remain pannable.
                </p>

                <ul
                  style={{
                    margin: "0 0 24px",
                    padding: "0 0 0 20px",
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: "#57534e",
                  }}
                >
                  <li>
                    <strong style={{ color: "#1c1917" }}>Click and drag</strong>{" "}
                    on this text to select it — panning is suppressed.
                  </li>
                  <li>
                    <strong style={{ color: "#1c1917" }}>
                      Two-finger swipe
                    </strong>{" "}
                    on the trackpad pans the page.{" "}
                    <strong style={{ color: "#1c1917" }}>Pinch</strong> or{" "}
                    <strong style={{ color: "#1c1917" }}>
                      Cmd/Ctrl + scroll
                    </strong>{" "}
                    zooms in/out (only click-drag is excluded).
                  </li>
                  <li>
                    <strong style={{ color: "#1c1917" }}>Ctrl+A / Cmd+A</strong>{" "}
                    selects all text inside the article.
                  </li>
                </ul>

                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 8,
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#92400e",
                  }}
                >
                  <strong>Tip:</strong> You can combine exclusions — add both{" "}
                  <code
                    style={{
                      ...codeStyle,
                      background: "#fde68a",
                      color: "#78350f",
                    }}
                  >
                    panningDisabled
                  </code>{" "}
                  and{" "}
                  <code
                    style={{
                      ...codeStyle,
                      background: "#fde68a",
                      color: "#78350f",
                    }}
                  >
                    wheelDisabled
                  </code>{" "}
                  to block both gestures on the same element.
                </div>
              </article>
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
