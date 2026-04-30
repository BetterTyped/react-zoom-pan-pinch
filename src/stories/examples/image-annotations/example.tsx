import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { useTransformContext } from "../../../hooks";
import { normalizeArgs, viewerChrome } from "../../utils";
import heroImg from "../../assets/medium-image.jpg";

const font =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const DISPLAY_W = 920;

const LABEL_PRESETS = [
  { name: "Person", color: "#ef4444" },
  { name: "Vehicle", color: "#3b82f6" },
  { name: "Building", color: "#22c55e" },
  { name: "Animal", color: "#f59e0b" },
  { name: "Text", color: "#ec4899" },
  { name: "Defect", color: "#f97316" },
  { name: "Other", color: "#a78bfa" },
];

interface Annotation {
  id: string;
  kind: "pin" | "rect";
  title: string;
  description: string;
  label: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

type PlaceMode = "navigate" | "rect" | "pin";

type DraftShape = {
  kind: "pin" | "rect";
  x: number;
  y: number;
  w: number;
  h: number;
};
type DrawingState = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type ZoomToElement = (target: string | HTMLElement, scale?: number) => void;

function clientToContent(
  clientX: number,
  clientY: number,
  wrapper: HTMLDivElement | null,
  state: { positionX: number; positionY: number; scale: number },
): { x: number; y: number } | null {
  if (!wrapper) return null;
  const r = wrapper.getBoundingClientRect();
  return {
    x: (clientX - r.left - state.positionX) / state.scale,
    y: (clientY - r.top - state.positionY) / state.scale,
  };
}

function newId(): string {
  return `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeRect(d: DrawingState) {
  return {
    x: Math.min(d.startX, d.endX),
    y: Math.min(d.startY, d.endY),
    w: Math.abs(d.endX - d.startX),
    h: Math.abs(d.endY - d.startY),
  };
}

/* ── Mode rail ───────────────────────────────────────────────── */

function ModeRail(props: {
  placeMode: PlaceMode;
  onModeChange: (m: PlaceMode) => void;
}) {
  const { placeMode, onModeChange } = props;
  const modes: {
    id: PlaceMode;
    label: string;
    sub: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "navigate",
      label: "Navigate",
      sub: "Pan & zoom",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2V14M2 8H14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M6.5 3.5L8 2L9.5 3.5M6.5 12.5L8 14L9.5 12.5M3.5 6.5L2 8L3.5 9.5M12.5 6.5L14 8L12.5 9.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "rect",
      label: "Rectangle",
      sub: "Bounding box",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect
            x="2"
            y="3"
            width="12"
            height="10"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="3 2"
          />
          <circle cx="2" cy="3" r="1.5" fill="currentColor" />
          <circle cx="14" cy="3" r="1.5" fill="currentColor" />
          <circle cx="2" cy="13" r="1.5" fill="currentColor" />
          <circle cx="14" cy="13" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "pin",
      label: "Pin",
      sub: "Point marker",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5S12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="6" r="2" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}
    >
      {modes.map((m) => {
        const on = placeMode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 12,
              border: on
                ? "1px solid rgba(167, 139, 250, 0.45)"
                : "1px solid rgba(63, 63, 70, 0.9)",
              background: on
                ? "rgba(109, 40, 217, 0.18)"
                : "rgba(24, 24, 27, 0.65)",
              cursor: "pointer",
              fontFamily: "inherit",
              minWidth: 140,
            }}
          >
            <span
              style={{ color: on ? "#c4b5fd" : "#71717a", display: "flex" }}
            >
              {m.icon}
            </span>
            <span style={{ textAlign: "left" }}>
              <span
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: on ? "#e9d5ff" : "#d4d4d8",
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "#71717a",
                  marginTop: 1,
                }}
              >
                {m.sub}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Annotation markers (rendered on image) ──────────────────── */

function AnnotationMarker(props: {
  annotation: Annotation;
  pinIndex: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { annotation: a, pinIndex, isSelected: sel, onClick } = props;

  if (a.kind === "pin") {
    return (
      <button
        id={`annotation-${a.id}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={{
          position: "absolute",
          left: a.x - 14,
          top: a.y - 14,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: sel ? "3px solid #fbbf24" : `2px solid ${a.color}`,
          background: a.color,
          color: "#fff",
          fontSize: 12,
          fontWeight: 800,
          fontFamily: "inherit",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: sel
            ? `0 0 0 4px rgba(251,191,36,0.25), 0 0 18px ${a.color}60`
            : `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${a.color}40`,
          zIndex: sel ? 8 : 5,
          transition: "box-shadow 0.15s ease, transform 0.15s ease",
          padding: 0,
        }}
      >
        {pinIndex}
      </button>
    );
  }

  return (
    <div
      id={`annotation-${a.id}`}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      style={{
        position: "absolute",
        left: a.x,
        top: a.y,
        width: a.w,
        height: a.h,
        border: sel ? `2.5px solid #fbbf24` : `2px solid ${a.color}`,
        borderRadius: 4,
        background: sel ? `${a.color}18` : `${a.color}10`,
        cursor: "pointer",
        boxShadow: sel
          ? `0 0 0 3px rgba(251,191,36,0.2), 0 0 16px ${a.color}30`
          : "none",
        zIndex: sel ? 8 : 5,
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          padding: "2px 8px",
          borderRadius: "4px 0 4px 0",
          background: a.color,
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: font,
          whiteSpace: "nowrap",
          lineHeight: "16px",
        }}
      >
        {a.label}
      </span>
    </div>
  );
}

/* ── Draft form ──────────────────────────────────────────────── */

function DraftForm(props: {
  draft: DraftShape;
  anchor: { left: number; top: number };
  onCommit: (title: string, description: string, labelIdx: number) => void;
  onCancel: () => void;
}) {
  const { draft, anchor, onCommit, onCancel } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labelIdx, setLabelIdx] = useState(0);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      style={{
        position: "absolute",
        left: anchor.left + 14,
        top: anchor.top,
        zIndex: 25,
        width: 280,
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        style={{
          borderRadius: 14,
          padding: 2,
          background:
            "linear-gradient(135deg, rgba(167,139,250,0.5), rgba(96,165,250,0.4))",
        }}
      >
        <div
          style={{
            borderRadius: 12,
            background: "rgba(9, 9, 11, 0.97)",
            border: "1px solid rgba(63, 63, 70, 0.8)",
            padding: "14px 14px 12px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              marginBottom: 10,
            }}
          >
            {draft.kind === "rect" ? "New bounding box" : "New pin"}
          </div>

          {/* eslint-disable jsx-a11y/no-autofocus */}
          <input
            autoFocus
            value={title}
            placeholder="Title (e.g. Main subject)"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancel();
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 10px",
              borderRadius: 8,
              border: "1px solid #3f3f46",
              background: "#18181b",
              color: "#fafafa",
              fontSize: 13,
              fontFamily: "inherit",
              marginBottom: 8,
            }}
          />
          {/* eslint-enable jsx-a11y/no-autofocus */}

          <textarea
            value={description}
            placeholder="Description (optional)"
            rows={2}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancel();
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 10px",
              borderRadius: 8,
              border: "1px solid #3f3f46",
              background: "#18181b",
              color: "#fafafa",
              fontSize: 13,
              fontFamily: "inherit",
              resize: "none",
              marginBottom: 10,
            }}
          />

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#71717a",
                marginBottom: 6,
              }}
            >
              Label
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {LABEL_PRESETS.map((p, i) => {
                const on = labelIdx === i;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setLabelIdx(i)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: on
                        ? `1.5px solid ${p.color}`
                        : "1px solid #3f3f46",
                      background: on ? `${p.color}22` : "transparent",
                      color: on ? p.color : "#a1a1aa",
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1px solid #3f3f46",
                background: "transparent",
                color: "#a1a1aa",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                onCommit(title || "Untitled", description, labelIdx)
              }
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Detail popup ────────────────────────────────────────────── */

function DetailPopup(props: {
  annotation: Annotation;
  anchor: { left: number; top: number };
  onClose: () => void;
  onDelete: () => void;
}) {
  const { annotation: a, anchor, onClose, onDelete } = props;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      style={{
        position: "absolute",
        left: anchor.left + 14,
        top: anchor.top,
        zIndex: 25,
        width: 260,
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        style={{
          borderRadius: 14,
          background: "rgba(9, 9, 11, 0.96)",
          border: "1px solid rgba(63, 63, 70, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background: `${a.color}12`,
            borderBottom: "1px solid rgba(63,63,70,0.6)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 10px",
              borderRadius: 6,
              background: a.color,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: font,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
                opacity: 0.6,
              }}
            />
            {a.label}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "none",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
                stroke="#a1a1aa"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "12px 14px" }}>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: 15,
              fontWeight: 700,
              color: "#f4f4f5",
              fontFamily: font,
            }}
          >
            {a.title}
          </h3>
          {a.description && (
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#a1a1aa",
                fontFamily: font,
              }}
            >
              {a.description}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(39,39,42,0.5)",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#71717a",
                  marginBottom: 2,
                }}
              >
                Position
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#d4d4d8",
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                {Math.round(a.x)}, {Math.round(a.y)}
              </div>
            </div>
            {a.kind === "rect" && (
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#71717a",
                    marginBottom: 2,
                  }}
                >
                  Size
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#d4d4d8",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {Math.round(a.w)} × {Math.round(a.h)}
                </div>
              </div>
            )}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#71717a",
                  marginBottom: 2,
                }}
              >
                Type
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#d4d4d8" }}>
                {a.kind === "rect" ? "Bounding box" : "Point marker"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onDelete}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)",
              color: "#fca5a5",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Delete annotation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Annotation canvas ───────────────────────────────────────── */

function AnnotationCanvas(props: {
  imgSize: { w: number; h: number };
  setImgSize: React.Dispatch<React.SetStateAction<{ w: number; h: number }>>;
  annotations: Annotation[];
  addAnnotation: (a: Annotation) => void;
  draft: DraftShape | null;
  setDraft: React.Dispatch<React.SetStateAction<DraftShape | null>>;
  placeMode: PlaceMode;
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  onDelete: (id: string) => void;
}) {
  const {
    imgSize,
    setImgSize,
    annotations,
    addAnnotation,
    draft,
    setDraft,
    placeMode,
    selectedId,
    setSelectedId,
    onDelete,
  } = props;

  const instance = useTransformContext();
  const [drawing, setDrawing] = useState<DrawingState | null>(null);

  const pinCount = useMemo(() => {
    const map = new Map<string, number>();
    let n = 0;
    annotations.forEach((a) => {
      if (a.kind === "pin") {
        n += 1;
        map.set(a.id, n);
      }
    });
    return map;
  }, [annotations]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (placeMode !== "rect") return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const pt = clientToContent(
        e.clientX,
        e.clientY,
        instance.wrapperComponent,
        instance.state,
      );
      if (!pt) return;
      setDrawing({ startX: pt.x, startY: pt.y, endX: pt.x, endY: pt.y });
    },
    [placeMode, instance],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawing) return;
      const pt = clientToContent(
        e.clientX,
        e.clientY,
        instance.wrapperComponent,
        instance.state,
      );
      if (pt)
        setDrawing((prev) =>
          prev ? { ...prev, endX: pt.x, endY: pt.y } : null,
        );
    },
    [drawing, instance],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      if (!drawing) return;
      const r = normalizeRect(drawing);
      setDrawing(null);
      if (r.w > 10 && r.h > 10) {
        setDraft({ kind: "rect", ...r });
        setSelectedId(null);
      }
    },
    [drawing, setDraft, setSelectedId],
  );

  const handlePinClick = useCallback(
    (e: React.MouseEvent) => {
      if (placeMode !== "pin") return;
      e.stopPropagation();
      const pt = clientToContent(
        e.clientX,
        e.clientY,
        instance.wrapperComponent,
        instance.state,
      );
      if (!pt) return;
      if (pt.x < 0 || pt.y < 0 || pt.x > imgSize.w || pt.y > imgSize.h) return;
      setDraft({ kind: "pin", x: pt.x, y: pt.y, w: 0, h: 0 });
      setSelectedId(null);
    },
    [placeMode, instance, imgSize, setDraft, setSelectedId],
  );

  const commitDraft = useCallback(
    (title: string, description: string, labelIdx: number) => {
      if (!draft) return;
      const preset = LABEL_PRESETS[labelIdx] ?? LABEL_PRESETS[0];
      const ann: Annotation = {
        id: newId(),
        kind: draft.kind,
        title,
        description,
        label: preset.name,
        color: preset.color,
        x: draft.x,
        y: draft.y,
        w: draft.w,
        h: draft.h,
      };
      addAnnotation(ann);
    },
    [draft, addAnnotation],
  );

  const selectedAnnotation =
    annotations.find((a) => a.id === selectedId) ?? null;
  const drawPreview = drawing ? normalizeRect(drawing) : null;

  const [txState, setTxState] = useState({
    positionX: instance.state.positionX,
    positionY: instance.state.positionY,
    scale: instance.state.scale,
  });

  useEffect(() => {
    return instance.onChange((ref) => {
      setTxState({
        positionX: ref.state.positionX,
        positionY: ref.state.positionY,
        scale: ref.state.scale,
      });
    });
  }, [instance]);

  const contentToScreen = useCallback(
    (cx: number, cy: number) => ({
      left: cx * txState.scale + txState.positionX,
      top: cy * txState.scale + txState.positionY,
    }),
    [txState],
  );

  const popupAnchor = useMemo(() => {
    if (draft) {
      const ax = draft.kind === "rect" ? draft.x + draft.w : draft.x;
      const ay = draft.y;
      return contentToScreen(ax, ay);
    }
    if (selectedAnnotation) {
      const ax =
        selectedAnnotation.kind === "rect"
          ? selectedAnnotation.x + selectedAnnotation.w
          : selectedAnnotation.x;
      const ay = selectedAnnotation.y;
      return contentToScreen(ax, ay);
    }
    return null;
  }, [draft, selectedAnnotation, contentToScreen]);

  return (
    <div style={{ position: "relative" }}>
      <TransformComponent
        wrapperStyle={{
          width: "min(920px, calc(100vw - 120px))",
          height: "min(560px, 62vh)",
          ...viewerChrome,
          overflow: "hidden",
        }}
        contentStyle={{ width: imgSize.w, height: imgSize.h }}
      >
        <div
          role="button"
          tabIndex={0}
          style={{
            position: "relative",
            width: imgSize.w,
            height: imgSize.h,
            background: "#18181b",
          }}
          onClick={() => {
            setSelectedId(null);
            setDraft(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedId(null);
              setDraft(null);
            }
          }}
        >
          <img
            src={heroImg}
            alt="Labeling target"
            draggable={false}
            onLoad={(e) => {
              const im = e.currentTarget;
              setImgSize({
                w: DISPLAY_W,
                h: Math.round((im.naturalHeight / im.naturalWidth) * DISPLAY_W),
              });
            }}
            style={{ width: DISPLAY_W, height: "auto", display: "block" }}
          />

          {/* Rendered annotations */}
          {annotations.map((a) => (
            <AnnotationMarker
              key={a.id}
              annotation={a}
              pinIndex={pinCount.get(a.id) ?? 0}
              isSelected={selectedId === a.id}
              onClick={() => {
                setSelectedId(a.id);
                setDraft(null);
              }}
            />
          ))}

          {/* Drawing preview (live rect while dragging) */}
          {drawPreview && (
            <div
              style={{
                position: "absolute",
                left: drawPreview.x,
                top: drawPreview.y,
                width: drawPreview.w,
                height: drawPreview.h,
                border: "2px dashed rgba(167, 139, 250, 0.85)",
                borderRadius: 4,
                background: "rgba(167, 139, 250, 0.08)",
                pointerEvents: "none",
                zIndex: 15,
              }}
            />
          )}

          {/* Overlay for placement (pin click or rect drawing) */}
          {placeMode !== "navigate" && !draft && (
            <div
              role="button"
              tabIndex={-1}
              aria-label="Click to annotate"
              onClick={placeMode === "pin" ? handlePinClick : undefined}
              onKeyDown={() => {}}
              onPointerDown={
                placeMode === "rect" ? handlePointerDown : undefined
              }
              onPointerMove={
                placeMode === "rect" ? handlePointerMove : undefined
              }
              onPointerUp={placeMode === "rect" ? handlePointerUp : undefined}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                cursor: "crosshair",
                background:
                  placeMode === "rect"
                    ? "rgba(167, 139, 250, 0.03)"
                    : "rgba(244, 63, 94, 0.03)",
                border: "none",
                padding: 0,
                outline: "none",
                touchAction: "none",
              }}
            />
          )}

          {/* Draft marker preview (visible while form is open) */}
          {draft && draft.kind === "rect" && (
            <div
              style={{
                position: "absolute",
                left: draft.x,
                top: draft.y,
                width: draft.w,
                height: draft.h,
                border: "2px dashed rgba(167, 139, 250, 0.85)",
                borderRadius: 4,
                background: "rgba(167, 139, 250, 0.1)",
                pointerEvents: "none",
                zIndex: 15,
              }}
            />
          )}
          {draft && draft.kind === "pin" && (
            <div
              style={{
                position: "absolute",
                left: draft.x - 14,
                top: draft.y - 14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "2px dashed rgba(167, 139, 250, 0.85)",
                background: "rgba(167, 139, 250, 0.25)",
                pointerEvents: "none",
                zIndex: 15,
                boxShadow: "0 0 12px rgba(167, 139, 250, 0.3)",
              }}
            />
          )}
        </div>
      </TransformComponent>

      {/* Floating popups — rendered outside the transform so they don't
          scale/clip, but anchored to the annotation's screen position. */}
      {draft && popupAnchor && (
        <DraftForm
          draft={draft}
          anchor={popupAnchor}
          onCommit={commitDraft}
          onCancel={() => setDraft(null)}
        />
      )}

      {selectedAnnotation && !draft && popupAnchor && (
        <DetailPopup
          annotation={selectedAnnotation}
          anchor={popupAnchor}
          onClose={() => setSelectedId(null)}
          onDelete={() => onDelete(selectedAnnotation.id)}
        />
      )}
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────── */

function Sidebar(props: {
  annotations: Annotation[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  zoomToElement: ZoomToElement;
}) {
  const { annotations, selectedId, onSelect, onDelete, zoomToElement } = props;

  const pinCount = useRef(0);

  return (
    <aside
      style={{
        flex: "1 1 280px",
        minWidth: 260,
        maxWidth: 360,
        borderRadius: 14,
        background: "rgba(24, 24, 27, 0.75)",
        border: "1px solid rgba(63, 63, 70, 0.75)",
        padding: "16px 16px 14px",
        maxHeight: 600,
        overflow: "auto",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#71717a",
          marginBottom: 12,
        }}
      >
        Annotations ({annotations.length})
      </div>

      {annotations.length === 0 && (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#71717a",
            lineHeight: 1.55,
          }}
        >
          No annotations yet. Switch to{" "}
          <strong style={{ color: "#a1a1aa" }}>Rectangle</strong> or{" "}
          <strong style={{ color: "#a1a1aa" }}>Pin</strong> and draw on the
          image.
        </p>
      )}

      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {(() => {
          pinCount.current = 0;
          return null;
        })()}
        {annotations.map((a) => {
          const sel = selectedId === a.id;
          let idx: number | undefined;
          if (a.kind === "pin") {
            pinCount.current += 1;
            idx = pinCount.current;
          }
          return (
            <li
              key={a.id}
              style={{
                marginBottom: 8,
                borderRadius: 10,
                overflow: "hidden",
                border: sel
                  ? "1px solid rgba(251,191,36,0.45)"
                  : "1px solid transparent",
                background: sel ? "rgba(113,63,18,0.15)" : "rgba(39,39,42,0.5)",
              }}
            >
              <div style={{ padding: "10px 12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 5,
                        background: `${a.color}22`,
                        color: a.color,
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: font,
                      }}
                    >
                      {a.label}
                    </span>
                    <span style={{ fontSize: 10, color: "#52525b" }}>
                      {a.kind === "rect" ? "Box" : `Pin #${idx}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(a.id);
                        requestAnimationFrame(() =>
                          zoomToElement(`annotation-${a.id}`, 1.8),
                        );
                      }}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#a78bfa",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Focus
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(a.id);
                      }}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#71717a",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelect(a.id);
                    requestAnimationFrame(() =>
                      zoomToElement(`annotation-${a.id}`, 1.8),
                    );
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#e4e4e7",
                      marginBottom: 2,
                    }}
                  >
                    {a.title}
                  </div>
                  {a.description && (
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 12,
                        color: "#71717a",
                        lineHeight: 1.4,
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: "#52525b",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {Math.round(a.x)},{Math.round(a.y)}
                    {a.kind === "rect"
                      ? ` · ${Math.round(a.w)}×${Math.round(a.h)}`
                      : " px"}
                  </div>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/* ── Main component ──────────────────────────────────────────── */

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [draft, setDraft] = useState<DraftShape | null>(null);
  const [placeMode, setPlaceMode] = useState<PlaceMode>("navigate");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({
    w: DISPLAY_W,
    h: Math.round(DISPLAY_W * 0.66),
  });

  const panningDisabled = placeMode !== "navigate";

  const addAnnotation = useCallback((ann: Annotation) => {
    setAnnotations((prev) => [...prev, ann]);
    setSelectedId(ann.id);
    setDraft(null);
  }, []);

  const deleteAnnotation = useCallback(
    (id: string) => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId],
  );

  return (
    <div
      style={{
        fontFamily: font,
        background:
          "linear-gradient(165deg, #0c0a14 0%, #151022 40%, #0a0812 100%)",
        padding: "20px 22px 28px",
        borderRadius: 16,
        boxSizing: "border-box",
      }}
    >
      <header style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(167, 139, 250, 0.85)",
            marginBottom: 6,
          }}
        >
          Image labeling tool
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.2rem, 2.2vw, 1.55rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#f4f4f5",
          }}
        >
          Annotate &amp; detect
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            color: "rgba(161, 161, 170, 0.95)",
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          Use <strong style={{ color: "#e4e4e7" }}>Rectangle</strong> to draw
          bounding boxes for object detection, or{" "}
          <strong style={{ color: "#e4e4e7" }}>Pin</strong> to mark a specific
          point. Click any annotation to see its details.
        </p>
      </header>

      <TransformWrapper
        {...normalized}
        centerOnInit
        limitToBounds
        centerZoomedOut
        doubleClick={{ disabled: true }}
        panning={{ ...normalized.panning, disabled: panningDisabled }}
      >
        {(utils) => (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            <div style={{ position: "relative" }}>
              <ModeRail
                placeMode={placeMode}
                onModeChange={(m) => {
                  setPlaceMode(m);
                  setDraft(null);
                  setSelectedId(null);
                }}
              />

              <AnnotationCanvas
                imgSize={imgSize}
                setImgSize={setImgSize}
                annotations={annotations}
                addAnnotation={addAnnotation}
                draft={draft}
                setDraft={setDraft}
                placeMode={placeMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onDelete={deleteAnnotation}
              />
            </div>

            <Sidebar
              annotations={annotations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={deleteAnnotation}
              zoomToElement={utils.zoomToElement}
            />
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
