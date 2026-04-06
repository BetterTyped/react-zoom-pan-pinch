import React, { useCallback, useMemo, useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { useTransformContext } from "../../../hooks";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";

import heroImg from "../../assets/medium-image.jpg";

const font =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const DISPLAY_W = 920;

export type AnnotationKind = "pin" | "label";

export interface Annotation {
  id: string;
  kind: AnnotationKind;
  x: number;
  y: number;
  text: string;
}

type PlaceMode = "navigate" | "pin" | "label";

type DraftState = {
  x: number;
  y: number;
  kind: AnnotationKind;
};

function clientToContent(
  clientX: number,
  clientY: number,
  wrapper: HTMLDivElement | null,
  state: { positionX: number; positionY: number; scale: number },
): { x: number; y: number } | null {
  if (!wrapper) return null;
  const r = wrapper.getBoundingClientRect();
  const wx = clientX - r.left;
  const wy = clientY - r.top;
  return {
    x: (wx - state.positionX) / state.scale,
    y: (wy - state.positionY) / state.scale,
  };
}

function newId(): string {
  return `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type ZoomToElement = (target: string | HTMLElement, scale?: number) => void;

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [placeMode, setPlaceMode] = useState<PlaceMode>("navigate");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({
    w: DISPLAY_W,
    h: Math.round(DISPLAY_W * 0.66),
  });

  const panningDisabled = placeMode !== "navigate";

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
          Design review
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
          Annotate the frame
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            color: "rgba(161, 161, 170, 0.95)",
            maxWidth: 560,
            lineHeight: 1.5,
          }}
        >
          Pan and zoom freely, then switch to{" "}
          <strong style={{ color: "#e4e4e7" }}>Pin</strong> or{" "}
          <strong style={{ color: "#e4e4e7" }}>Label</strong> and click where you
          want a note. Coordinates respect the current transform.
        </p>
      </header>

      <TransformWrapper
        {...normalized}
        centerOnInit
        limitToBounds
        centerZoomedOut
        doubleClick={{ disabled: true }}
        panning={{
          ...normalized.panning,
          disabled: panningDisabled,
        }}
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
                }}
              />
              <Controls {...utils} position="top-left" />

              <TransformViewport
                utils={utils}
                imgSize={imgSize}
                setImgSize={setImgSize}
                annotations={annotations}
                setAnnotations={setAnnotations}
                draft={draft}
                setDraft={setDraft}
                placeMode={placeMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            </div>

            <Sidebar
              annotations={annotations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              zoomToElement={utils.zoomToElement}
              onDelete={(id) => {
                setAnnotations((prev) => prev.filter((a) => a.id !== id));
                if (selectedId === id) setSelectedId(null);
              }}
            />
          </div>
        )}
      </TransformWrapper>
    </div>
  );
}

function ModeRail(props: {
  placeMode: PlaceMode;
  onModeChange: (m: PlaceMode) => void;
}) {
  const { placeMode, onModeChange } = props;
  const modes: { id: PlaceMode; label: string; sub: string }[] = [
    { id: "navigate", label: "Navigate", sub: "Pan · zoom" },
    { id: "pin", label: "Pin", sub: "Numbered callout" },
    { id: "label", label: "Label", sub: "Text on image" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
      }}
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
              flexDirection: "column",
              alignItems: "flex-start",
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
              textAlign: "left",
              minWidth: 120,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: on ? "#e9d5ff" : "#d4d4d8",
              }}
            >
              {m.label}
            </span>
            <span style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>
              {m.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type Utils = {
  zoomToElement: ZoomToElement;
};

function TransformViewport(props: {
  utils: Utils;
  imgSize: { w: number; h: number };
  setImgSize: React.Dispatch<React.SetStateAction<{ w: number; h: number }>>;
  annotations: Annotation[];
  setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
  draft: DraftState | null;
  setDraft: React.Dispatch<React.SetStateAction<DraftState | null>>;
  placeMode: PlaceMode;
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const {
    utils,
    imgSize,
    setImgSize,
    annotations,
    setAnnotations,
    draft,
    setDraft,
    placeMode,
    selectedId,
    setSelectedId,
  } = props;

  const instance = useTransformContext();

  const commitDraft = useCallback(
    (text: string) => {
      if (!draft || !text.trim()) {
        setDraft(null);
        return;
      }
      const ann: Annotation = {
        id: newId(),
        kind: draft.kind,
        x: draft.x,
        y: draft.y,
        text: text.trim(),
      };
      setAnnotations((prev) => [...prev, ann]);
      setSelectedId(ann.id);
      setDraft(null);
      requestAnimationFrame(() =>
        utils.zoomToElement(`annotation-${ann.id}`, 2.2),
      );
    },
    [draft, setAnnotations, setDraft, setSelectedId, utils],
  );

  const onPlacementClick = useCallback(
    (e: React.MouseEvent) => {
      if (placeMode === "navigate") return;
      const pt = clientToContent(
        e.clientX,
        e.clientY,
        instance.wrapperComponent,
        instance.state,
      );
      if (!pt) return;
      if (pt.x < 0 || pt.y < 0 || pt.x > imgSize.w || pt.y > imgSize.h) return;
      setDraft({
        x: pt.x,
        y: pt.y,
        kind: placeMode === "pin" ? "pin" : "label",
      });
    },
    [placeMode, instance, imgSize.w, imgSize.h, setDraft],
  );

  const pinIndex = useMemo(() => {
    const map = new Map<string, number>();
    let n = 0;
    for (const a of annotations) {
      if (a.kind === "pin") {
        n += 1;
        map.set(a.id, n);
      }
    }
    return map;
  }, [annotations]);

  return (
    <TransformComponent
      wrapperStyle={{
        width: "min(920px, calc(100vw - 120px))",
        height: "min(520px, 58vh)",
        ...viewerChrome,
        overflow: "hidden",
      }}
      contentStyle={{
        width: imgSize.w,
        height: imgSize.h,
      }}
    >
      <div
        style={{
          position: "relative",
          width: imgSize.w,
          height: imgSize.h,
          background: "#18181b",
        }}
      >
        <img
          src={heroImg}
          alt="Mood board"
          draggable={false}
          onLoad={(e) => {
            const im = e.currentTarget;
            const h = Math.round(
              (im.naturalHeight / im.naturalWidth) * DISPLAY_W,
            );
            setImgSize({ w: DISPLAY_W, h });
          }}
          style={{
            width: DISPLAY_W,
            height: "auto",
            display: "block",
          }}
        />

        {annotations.map((a) => {
          const idx = pinIndex.get(a.id);
          const sel = selectedId === a.id;
          return (
            <div
              key={a.id}
              id={`annotation-${a.id}`}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              {a.kind === "pin" ? (
                <button
                  type="button"
                  title={a.text}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setSelectedId(a.id);
                  }}
                  style={{
                    position: "absolute",
                    left: a.x,
                    top: a.y,
                    width: 32,
                    height: 32,
                    marginLeft: -16,
                    marginTop: -16,
                    borderRadius: "50%",
                    border: sel
                      ? "3px solid #fbbf24"
                      : "2px solid rgba(255,255,255,0.35)",
                    background:
                      "linear-gradient(145deg, #f43f5e 0%, #be123c 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 800,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: sel
                      ? "0 0 0 4px rgba(251, 191, 36, 0.25), 0 8px 24px rgba(0,0,0,0.4)"
                      : "0 4px 16px rgba(0,0,0,0.35)",
                    zIndex: sel ? 8 : 5,
                    transition: "box-shadow 0.15s ease, transform 0.15s ease",
                  }}
                >
                  {idx}
                </button>
              ) : (
                <button
                  type="button"
                  title={a.text}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setSelectedId(a.id);
                  }}
                  style={{
                    position: "absolute",
                    left: a.x,
                    top: a.y,
                    transform: "translate(-50%, -100%) translateY(-8px)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: sel
                      ? "1px solid rgba(251, 191, 36, 0.7)"
                      : "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(9, 9, 11, 0.88)",
                    backdropFilter: "blur(8px)",
                    color: "#fafafa",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    maxWidth: 220,
                    textAlign: "left",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
                    zIndex: sel ? 8 : 5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {a.text}
                </button>
              )}
            </div>
          );
        })}

        {placeMode !== "navigate" && !draft && (
          <button
            type="button"
            aria-label="Click to place annotation"
            onClick={onPlacementClick}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              cursor: "crosshair",
              background: "rgba(244, 63, 94, 0.04)",
              border: "none",
              padding: 0,
            }}
          />
        )}

        {draft && (
          <DraftPopover
            draft={draft}
            onCommit={commitDraft}
            onCancel={() => setDraft(null)}
            pinNumber={
              draft.kind === "pin"
                ? annotations.filter((x) => x.kind === "pin").length + 1
                : undefined
            }
          />
        )}
      </div>
    </TransformComponent>
  );
}

function DraftPopover(props: {
  draft: DraftState;
  onCommit: (text: string) => void;
  onCancel: () => void;
  pinNumber?: number;
}) {
  const { draft, onCommit, onCancel, pinNumber } = props;
  const [value, setValue] = useState("");

  return (
    <div
      style={{
        position: "absolute",
        left: draft.x,
        top: draft.y,
        zIndex: 20,
        transform: "translate(-50%, 12px)",
        minWidth: 220,
        maxWidth: 280,
      }}
    >
      <div
        style={{
          borderRadius: 12,
          padding: 2,
          background:
            "linear-gradient(135deg, rgba(244,63,94,0.5), rgba(167,139,250,0.4))",
        }}
      >
        <div
          style={{
            borderRadius: 10,
            background: "rgba(9, 9, 11, 0.96)",
            border: "1px solid rgba(63, 63, 70, 0.8)",
            padding: "12px 12px 10px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              marginBottom: 8,
            }}
          >
            {draft.kind === "pin" ? `Pin ${pinNumber ?? ""}` : "New label"}
          </div>
          <input
            autoFocus
            value={value}
            placeholder={
              draft.kind === "pin" ? "e.g. Crop tighter here" : "Visible caption"
            }
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommit(value);
              if (e.key === "Escape") onCancel();
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 10px",
              borderRadius: 8,
              border: "1px solid #3f3f46",
              background: "#18181b",
              color: "#fafafa",
              fontSize: 13,
              fontFamily: "inherit",
              marginBottom: 10,
            }}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "6px 12px",
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
              onClick={() => onCommit(value)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #e11d48, #be123c)",
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

function Sidebar(props: {
  annotations: Annotation[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  zoomToElement: ZoomToElement;
}) {
  const { annotations, selectedId, onSelect, onDelete, zoomToElement } = props;

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
        maxHeight: 560,
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
        Thread ({annotations.length})
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
          No notes yet. Choose <strong style={{ color: "#a1a1aa" }}>Pin</strong>{" "}
          or <strong style={{ color: "#a1a1aa" }}>Label</strong>, then click the
          image.
        </p>
      )}

      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {annotations.map((a) => {
          const sel = selectedId === a.id;
          return (
            <li
              key={a.id}
              style={{
                marginBottom: 8,
                borderRadius: 10,
                border: sel
                  ? "1px solid rgba(251, 191, 36, 0.45)"
                  : "1px solid transparent",
                background: sel
                  ? "rgba(113, 63, 18, 0.15)"
                  : "rgba(39, 39, 42, 0.5)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "10px 12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(a.id)}
                    style={{
                      border: "none",
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: a.kind === "pin" ? "#fb7185" : "#c4b5fd",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                  >
                    {a.kind === "pin" ? "Pin" : "Label"}
                  </button>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(a.id);
                        requestAnimationFrame(() =>
                          zoomToElement(`annotation-${a.id}`, 2.4),
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
                      Remove
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(a.id)}
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
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#e4e4e7",
                      lineHeight: 1.45,
                    }}
                  >
                    {a.text}
                  </p>
                  <div
                    style={{ fontSize: 11, color: "#52525b", marginTop: 6 }}
                  >
                    {Math.round(a.x)}, {Math.round(a.y)} px
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
