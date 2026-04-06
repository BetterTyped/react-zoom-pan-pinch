import React from "react";

export const XRAY_W = 1024;
export const XRAY_H = 1280;

const CX = XRAY_W / 2;

export const ChestXray: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={XRAY_W}
    height={XRAY_H}
    viewBox={`0 0 ${XRAY_W} ${XRAY_H}`}
    style={{ display: "block" }}
  >
    <defs>
      <radialGradient id="xray-bg" cx="50%" cy="44%" r="55%">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#050505" />
      </radialGradient>

      <radialGradient id="lung-l" cx="38%" cy="50%" r="32%">
        <stop offset="0%" stopColor="#222" />
        <stop offset="70%" stopColor="#181818" />
        <stop offset="100%" stopColor="#111" />
      </radialGradient>
      <radialGradient id="lung-r" cx="62%" cy="50%" r="32%">
        <stop offset="0%" stopColor="#222" />
        <stop offset="70%" stopColor="#181818" />
        <stop offset="100%" stopColor="#111" />
      </radialGradient>

      <radialGradient id="heart-g" cx="52%" cy="54%" r="24%">
        <stop offset="0%" stopColor="#444" />
        <stop offset="100%" stopColor="#2a2a2a" />
      </radialGradient>

      <linearGradient id="bone-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bbb" />
        <stop offset="100%" stopColor="#888" />
      </linearGradient>

      <filter id="film-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
        <feColorMatrix
          type="saturate"
          values="0"
          in="noise"
          result="mono"
        />
        <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
      </filter>
    </defs>

    <rect width={XRAY_W} height={XRAY_H} fill="url(#xray-bg)" />

    {/* Soft tissue silhouette */}
    <ellipse cx={CX} cy={540} rx={340} ry={380} fill="#151515" opacity={0.85} />

    {/* Lung fields */}
    <path
      d="M 200 310 C 170 440, 180 680, 280 820 Q 340 870, 400 840 C 440 760, 460 520, 430 350 Q 410 280, 340 260 Q 260 250, 200 310 Z"
      fill="url(#lung-l)"
      opacity={0.8}
    />
    <path
      d="M 824 310 C 854 440, 844 680, 744 820 Q 684 870, 624 840 C 584 760, 564 520, 594 350 Q 614 280, 684 260 Q 764 250, 824 310 Z"
      fill="url(#lung-r)"
      opacity={0.8}
    />

    {/* Mediastinum / heart shadow */}
    <ellipse cx={CX + 20} cy={580} rx={140} ry={160} fill="url(#heart-g)" opacity={0.9} />
    <ellipse cx={CX - 10} cy={520} rx={50} ry={80} fill="#383838" opacity={0.5} />

    {/* Trachea + bronchi */}
    <path
      d={`M ${CX} 180 L ${CX} 360 Q ${CX - 40} 410, ${CX - 100} 450`}
      fill="none"
      stroke="#777"
      strokeWidth={6}
      strokeLinecap="round"
      opacity={0.5}
    />
    <path
      d={`M ${CX} 360 Q ${CX + 40} 410, ${CX + 90} 440`}
      fill="none"
      stroke="#777"
      strokeWidth={5}
      strokeLinecap="round"
      opacity={0.45}
    />

    {/* Spine / vertebrae */}
    {Array.from({ length: 12 }, (_, i) => {
      const y = 260 + i * 58;
      const w = 28 - i * 0.4;
      return (
        <React.Fragment key={`vert-${i}`}>
          <rect
            x={CX - w / 2}
            y={y}
            width={w}
            height={46}
            rx={5}
            fill="url(#bone-fill)"
            opacity={0.55 + i * 0.015}
          />
          <rect
            x={CX - w / 2 + 2}
            y={y + 44}
            width={w - 4}
            height={12}
            rx={3}
            fill="#888"
            opacity={0.3}
          />
        </React.Fragment>
      );
    })}

    {/* Ribs */}
    {Array.from({ length: 10 }, (_, i) => {
      const y = 310 + i * 52;
      const curve = 6 + i * 1.2;
      const span = 180 + i * 14;
      return (
        <React.Fragment key={`rib-${i}`}>
          <path
            d={`M ${CX - 20} ${y} Q ${CX - span * 0.5} ${y + curve}, ${CX - span} ${y + curve * 2.5}`}
            fill="none"
            stroke="url(#bone-fill)"
            strokeWidth={i < 2 ? 3.5 : 3}
            strokeLinecap="round"
            opacity={0.52 + i * 0.02}
          />
          <path
            d={`M ${CX + 20} ${y} Q ${CX + span * 0.5} ${y + curve}, ${CX + span} ${y + curve * 2.5}`}
            fill="none"
            stroke="url(#bone-fill)"
            strokeWidth={i < 2 ? 3.5 : 3}
            strokeLinecap="round"
            opacity={0.52 + i * 0.02}
          />
        </React.Fragment>
      );
    })}

    {/* Clavicles */}
    <path
      d={`M ${CX - 14} 260 Q ${CX - 120} 240, ${CX - 260} 275`}
      fill="none"
      stroke="url(#bone-fill)"
      strokeWidth={5}
      strokeLinecap="round"
      opacity={0.65}
    />
    <path
      d={`M ${CX + 14} 260 Q ${CX + 120} 240, ${CX + 260} 275`}
      fill="none"
      stroke="url(#bone-fill)"
      strokeWidth={5}
      strokeLinecap="round"
      opacity={0.65}
    />

    {/* Scapulae (hints) */}
    <path
      d={`M ${CX - 280} 310 Q ${CX - 320} 420, ${CX - 280} 600`}
      fill="none"
      stroke="#666"
      strokeWidth={3}
      strokeLinecap="round"
      opacity={0.25}
    />
    <path
      d={`M ${CX + 280} 310 Q ${CX + 320} 420, ${CX + 280} 600`}
      fill="none"
      stroke="#666"
      strokeWidth={3}
      strokeLinecap="round"
      opacity={0.25}
    />

    {/* Diaphragm domes */}
    <path
      d={`M 180 830 Q 350 760, ${CX} 820 Q 680 760, 850 830`}
      fill="none"
      stroke="#777"
      strokeWidth={3}
      opacity={0.4}
    />

    {/* Costophrenic angles */}
    <path
      d="M 190 830 Q 210 900, 280 910"
      fill="none"
      stroke="#555"
      strokeWidth={2}
      opacity={0.3}
    />
    <path
      d="M 840 830 Q 820 900, 750 910"
      fill="none"
      stroke="#555"
      strokeWidth={2}
      opacity={0.3}
    />

    {/* Film grain overlay */}
    <rect
      width={XRAY_W}
      height={XRAY_H}
      fill="transparent"
      filter="url(#film-grain)"
      opacity={0.08}
    />

    {/* L marker */}
    <text
      x={XRAY_W - 60}
      y={220}
      fill="#ccc"
      fontSize={32}
      fontWeight={700}
      fontFamily="ui-serif, Georgia, serif"
      opacity={0.75}
    >
      L
    </text>
  </svg>
);
