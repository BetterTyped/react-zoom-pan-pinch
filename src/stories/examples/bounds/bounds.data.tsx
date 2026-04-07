import React from "react";

const SIZE = 1200;

export const contentSize = SIZE;

function Landmark({
  x,
  y,
  color,
  size,
  label,
}: {
  x: number;
  y: number;
  color: string;
  size: number;
  label: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 30px ${color}44`,
        userSelect: "none",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function BoundsContent() {
  return (
    <div
      style={{
        position: "relative",
        width: SIZE + 300,
        height: SIZE + 300,
        margin: -150,
        background:
          "linear-gradient(135deg, #1a1a3e 0%, #0f2027 40%, #203a43 70%, #2c5364 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "150px",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <Landmark
        x={150 + 80}
        y={150 + 80}
        color="#667eea"
        size={100}
        label="Start"
      />
      <Landmark
        x={150 + 300}
        y={150 + 150}
        color="#43e97b"
        size={80}
        label="Park"
      />
      <Landmark
        x={150 + 150}
        y={150 + 350}
        color="#4facfe"
        size={90}
        label="Lake"
      />
      <Landmark
        x={150 + 500}
        y={150 + 100}
        color="#f093fb"
        size={70}
        label="Shops"
      />
      <Landmark
        x={150 + 400}
        y={150 + 400}
        color="#fa709a"
        size={110}
        label="Plaza"
      />
      <Landmark
        x={150 + 700}
        y={150 + 200}
        color="#f6d365"
        size={85}
        label="Market"
      />
      <Landmark
        x={150 + 200}
        y={150 + 600}
        color="#a18cd1"
        size={75}
        label="Museum"
      />
      <Landmark
        x={150 + 600}
        y={150 + 550}
        color="#0acffe"
        size={95}
        label="Arena"
      />
      <Landmark
        x={150 + 850}
        y={150 + 400}
        color="#ff9a9e"
        size={80}
        label="Tower"
      />
      <Landmark
        x={150 + 900}
        y={150 + 700}
        color="#fccb90"
        size={90}
        label="Harbor"
      />
      <Landmark
        x={150 + 350}
        y={150 + 800}
        color="#c471f5"
        size={85}
        label="Temple"
      />
      <Landmark
        x={150 + 700}
        y={150 + 850}
        color="#48c6ef"
        size={70}
        label="Bridge"
      />
      <Landmark
        x={150 + 1000}
        y={150 + 150}
        color="#30cfd0"
        size={75}
        label="North"
      />
      <Landmark
        x={150 + 1000}
        y={150 + 600}
        color="#e0c3fc"
        size={80}
        label="East"
      />
      <Landmark
        x={150 + 150}
        y={150 + 950}
        color="#89f7fe"
        size={70}
        label="South"
      />
      <Landmark
        x={150 + 950}
        y={150 + 950}
        color="#feada6"
        size={90}
        label="Corner"
      />
    </div>
  );
}
