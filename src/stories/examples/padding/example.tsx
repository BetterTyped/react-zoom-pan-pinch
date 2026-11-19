import React, { useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import {
  Controls,
  FocusChips,
  ToggleIcon,
  normalizeArgs,
  viewerChrome,
} from "../../utils";
import { useTransformComponent } from "../../../hooks";
import exampleImg from "../../assets/medium-image.jpg";

function ModeBadge({ disabled }: { disabled: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
        padding: "5px 12px",
        borderRadius: 8,
        background: "rgba(10, 10, 18, 0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${disabled ? "rgba(239, 68, 68, 0.3)" : "rgba(52, 211, 153, 0.3)"}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: disabled ? "#ef4444" : "#34d399",
          boxShadow: `0 0 8px ${disabled ? "rgba(239,68,68,0.5)" : "rgba(52,211,153,0.5)"}`,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: disabled ? "rgba(239,68,68,0.8)" : "rgba(52,211,153,0.8)",
          letterSpacing: "0.04em",
        }}
      >
        Padding {disabled ? "OFF" : "ON"}
      </span>
    </div>
  );
}

function ScaleBadge() {
  return useTransformComponent(({ state }) => (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 10,
        padding: "5px 12px",
        borderRadius: 8,
        background: "rgba(10, 10, 18, 0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        letterSpacing: "0.02em",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {state.scale.toFixed(2)}x
    </div>
  ));
}

/**
 * How far past the edge the content can be pulled (`autoAlignment.sizeX/Y`).
 * The rubber band only approaches it, so a larger value gives a longer,
 * easier to feel stretch. The library default is 100.
 */
const STRETCH_SIZES = [100, 250, 400];

export const Example: React.FC<any> = (args: any) => {
  const [disablePadding, setDisablePadding] = useState(false);
  const [stretch, setStretch] = useState(250);
  const normalizedArgs = normalizeArgs(args);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper
        {...normalizedArgs}
        autoAlignment={{
          ...normalizedArgs.autoAlignment,
          sizeX: stretch,
          sizeY: stretch,
        }}
        disablePadding={disablePadding}
        key={String(disablePadding)}
      >
        {(utils) => (
          <>
            <Controls
              {...utils}
              extraButtons={[
                {
                  label: disablePadding ? "Enable padding" : "Disable padding",
                  icon: <ToggleIcon />,
                  onClick: () => setDisablePadding((prev) => !prev),
                },
              ]}
            />
            <ModeBadge disabled={disablePadding} />
            <div style={{ position: "relative", display: "inline-block" }}>
              <TransformComponent
                wrapperStyle={{
                  ...viewerChrome,
                  width: "500px",
                  height: "500px",
                  maxWidth: "80vw",
                  maxHeight: "75vh",
                }}
              >
                <img src={exampleImg} alt="" style={{ display: "block" }} />
              </TransformComponent>
              <ScaleBadge />
              {!disablePadding && (
                <FocusChips
                  title="Stretch"
                  position="bottom-left"
                  activeId={String(stretch)}
                  items={STRETCH_SIZES.map((size) => ({
                    id: String(size),
                    label: `${size}px`,
                    hint:
                      size === 100
                        ? "Library default"
                        : "How far past the edge it can be pulled",
                  }))}
                  onSelect={(id) => setStretch(Number(id))}
                />
              )}
            </div>
          </>
        )}
      </TransformWrapper>
      <p
        style={{
          fontSize: "13px",
          color: "#888",
          marginTop: "12px",
          maxWidth: "500px",
          lineHeight: 1.5,
        }}
      >
        {disablePadding ? (
          <>
            <strong>Padding is OFF.</strong> Panning and zooming are strictly
            clamped — the content stops exactly at its edges.
          </>
        ) : (
          <>
            <strong>Padding is ON</strong> (default). Drag the image past an
            edge: it stretches like a rubber band — following at about half the
            pointer&rsquo;s speed, then resisting more the further you pull —
            and springs back when you let go. <strong>Stretch</strong> sets how
            far it can go ({stretch}px now); the band only approaches that
            distance.
          </>
        )}
      </p>
    </div>
  );
};
