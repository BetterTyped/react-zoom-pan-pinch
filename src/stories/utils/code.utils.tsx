import React from "react";

type Props = { code: string };

export const Code: React.FC<Props> = ({ code }: Props) => (
  <code
    style={{
      display: "inline",
      padding: "2px 7px",
      borderRadius: 5,
      background: "rgba(30, 30, 50, 0.7)",
      border: "1px solid rgba(255,255,255,0.08)",
      fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: 12,
      color: "#e2e8f0",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}
  >
    {code}
  </code>
);
