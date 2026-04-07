import React, { useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { normalizeArgs } from "../../utils";

const productImg = "https://images.pexels.com/photos/29306504/pexels-photo-29306504.jpeg";

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/* ── Data ──────────────────────────────────────────────────── */

const SAUCES = [
  { name: "Garlic", value: "#fefce8" },
  { name: "Spicy", value: "#dc2626" },
  { name: "Yogurt", value: "#e2e8f0" },
  { name: "BBQ", value: "#78350f" },
];

const PORTIONS = ["S", "M", "L", "XL"] as const;

/* ── Icons ─────────────────────────────────────────────────── */

const ZoomInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 12L16 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 6V10M6 8H10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 12L16 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6 8H10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M3 3V7H7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 11A6 6 0 1 0 5 5L3 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill={filled ? "currentColor" : "none"}
  >
    <path
      d="M9 15.5S2 11 2 6.5C2 4 4 2.5 6 2.5C7.5 2.5 8.5 3.5 9 4.5C9.5 3.5 10.5 2.5 12 2.5C14 2.5 16 4 16 6.5C16 11 9 15.5 9 15.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = ({ full }: { full: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <path
      d="M7 1L8.8 5.1L13.2 5.6L9.9 8.5L10.8 12.9L7 10.7L3.2 12.9L4.1 8.5L0.8 5.6L5.2 5.1L7 1Z"
      fill={full ? "#f59e0b" : "rgba(255,255,255,0.1)"}
      stroke={full ? "#f59e0b" : "rgba(255,255,255,0.15)"}
      strokeWidth="0.8"
    />
  </svg>
);

/* ── Product image viewer ──────────────────────────────────── */

const zoomBtnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 9,
  border: "none",
  background: "transparent",
  color: "rgba(255,255,255,0.75)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  transition: "background 0.15s",
};

function ImageViewer({ args }: { args: Record<string, unknown> }) {
  const normalized = normalizeArgs(args);

  return (
    <TransformWrapper
      {...normalized}
      initialScale={1}
      minScale={0.5}
      maxScale={6}
      centerOnInit
      centerZoomedOut
      doubleClick={{ step: 0.5 }}
      wheel={{ step: 0.08 }}
    >
      {({ zoomIn, zoomOut, resetTransform, instance }) => {
        const { scale } = instance.state;
        const isZoomed = scale > 1.05;

        return (
          <div style={{ position: "relative" }}>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: 16,
                overflow: "hidden",
                background: "#0c0c14",
                cursor: isZoomed ? "grab" : "zoom-in",
              }}
            >
              <img
                src={productImg}
                alt="Döner Kebab"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
            </TransformComponent>

            {/* Zoom controls */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                display: "flex",
                gap: 4,
                padding: 4,
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.55)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => zoomIn()}
                style={zoomBtnStyle}
                title="Zoom in"
                aria-label="Zoom in"
              >
                <ZoomInIcon />
              </button>
              <button
                type="button"
                onClick={() => zoomOut()}
                style={zoomBtnStyle}
                title="Zoom out"
                aria-label="Zoom out"
              >
                <ZoomOutIcon />
              </button>
              {isZoomed && (
                <button
                  type="button"
                  onClick={() => resetTransform()}
                  style={zoomBtnStyle}
                  title="Reset zoom"
                  aria-label="Reset zoom"
                >
                  <ResetIcon />
                </button>
              )}
            </div>

            {/* Zoom hint */}
            {!isZoomed && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  padding: "5px 10px",
                  borderRadius: 8,
                  background: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(8px)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: font,
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <ZoomInIcon />
                Scroll or pinch to zoom
              </div>
            )}

            {/* Zoom level badge */}
            {isZoomed && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: "rgba(0, 0, 0, 0.55)",
                  backdropFilter: "blur(8px)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: font,
                  fontVariantNumeric: "tabular-nums",
                  pointerEvents: "none",
                }}
              >
                {scale.toFixed(1)}×
              </div>
            )}
          </div>
        );
      }}
    </TransformWrapper>
  );
}

/* ── Main product card ─────────────────────────────────────── */

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const [selectedSauce, setSelectedSauce] = useState(0);
  const [selectedPortion, setSelectedPortion] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div
      style={{
        fontFamily: font,
        maxWidth: 880,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
          borderRadius: 20,
          background:
            "linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(10, 10, 20, 0.8))",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: 24,
          boxShadow:
            "0 24px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        {/* Left: image viewer */}
        <ImageViewer args={args} />

        {/* Right: product info */}
        <div style={{ padding: "8px 0" }}>
          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(52, 211, 153, 0.9)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Best Seller
          </span>

          {/* Title */}
          <h2
            style={{
              margin: "0 0 6px",
              fontSize: 26,
              fontWeight: 800,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Signature Döner Kebab
          </h2>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <StarIcon key={n} full={n <= 5} />
              ))}
            </div>
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 500,
              }}
            >
              4.8 · 342 reviews
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "-0.02em",
              }}
            >
              $12.99
            </span>
            <span
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.3)",
                textDecoration: "line-through",
                fontWeight: 500,
              }}
            >
              $15.99
            </span>
            <span
              style={{
                padding: "3px 8px",
                borderRadius: 6,
                background: "rgba(239, 68, 68, 0.15)",
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(248, 113, 113, 0.9)",
              }}
            >
              -19%
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 13,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Tender slices of seasoned lamb and chicken, slow-roasted on a
            vertical spit, wrapped in warm handmade flatbread with crisp
            lettuce, tomatoes, onions, and your choice of sauce. Zoom into
            the image to see every juicy detail up close.
          </p>

          {/* Sauce selector */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Sauce ·{" "}
              <span style={{ color: "rgba(255,255,255,0.8)" }}>
                {SAUCES[selectedSauce].name}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {SAUCES.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSelectedSauce(i)}
                  title={s.name}
                  aria-label={`Select sauce ${s.name}`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border:
                      selectedSauce === i
                        ? "2px solid rgba(255,255,255,0.7)"
                        : "2px solid rgba(255,255,255,0.1)",
                    background: s.value,
                    cursor: "pointer",
                    padding: 0,
                    boxShadow:
                      selectedSauce === i
                        ? "0 0 0 3px rgba(99, 102, 241, 0.35)"
                        : "none",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Portion selector */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Portion ·{" "}
              <span style={{ color: "rgba(255,255,255,0.8)" }}>
                {PORTIONS[selectedPortion]}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {PORTIONS.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPortion(i)}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    border:
                      selectedPortion === i
                        ? "1.5px solid rgba(99, 102, 241, 0.6)"
                        : "1.5px solid rgba(255,255,255,0.08)",
                    background:
                      selectedPortion === i
                        ? "rgba(99, 102, 241, 0.15)"
                        : "rgba(255,255,255,0.03)",
                    color:
                      selectedPortion === i
                        ? "rgba(165, 180, 252, 0.95)"
                        : "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: font,
                    cursor: "pointer",
                    padding: 0,
                    transition:
                      "border-color 0.15s, background 0.15s, color 0.15s",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "14px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: font,
                cursor: "pointer",
                boxShadow:
                  "0 4px 16px rgba(99, 102, 241, 0.3), 0 1px 3px rgba(0,0,0,0.2)",
                letterSpacing: "-0.01em",
              }}
            >
              Add to Order
            </button>
            <button
              type="button"
              onClick={() => setWishlisted(!wishlisted)}
              aria-label={
                wishlisted ? "Remove from favorites" : "Add to favorites"
              }
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.08)",
                background: wishlisted
                  ? "rgba(239, 68, 68, 0.12)"
                  : "rgba(255,255,255,0.03)",
                color: wishlisted
                  ? "rgba(248, 113, 113, 0.9)"
                  : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
                borderColor: wishlisted
                  ? "rgba(248, 113, 113, 0.25)"
                  : "rgba(255,255,255,0.08)",
                flexShrink: 0,
              }}
            >
              <HeartIcon filled={wishlisted} />
            </button>
          </div>

          {/* Delivery info */}
          <div
            style={{
              marginTop: 18,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              display: "flex",
              gap: 16,
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
            }}
          >
            <span>🕐 25-35 min delivery</span>
            <span>🔥 Made fresh to order</span>
            <span>✓ Available now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
