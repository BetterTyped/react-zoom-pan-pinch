/* eslint-disable react/no-array-index-key */
import React from "react";

import type { ControlsFnOptionsType } from "./handlers";

import styles from "./docs.module.css";

function parseParam(raw: string) {
  const eqIdx = raw.indexOf("=");
  const colonIdx = raw.indexOf(":");

  if (colonIdx === -1) return { name: raw.trim(), type: "", def: "" };

  const name = raw.slice(0, colonIdx).trim();
  let type: string;
  let def = "";

  if (eqIdx !== -1 && eqIdx > colonIdx) {
    type = raw.slice(colonIdx + 1, eqIdx).trim();
    def = raw.slice(eqIdx + 1).trim();
  } else {
    type = raw.slice(colonIdx + 1).trim();
  }

  return { name, type, def };
}

export function HandlerCards({ rows }: { rows: ControlsFnOptionsType[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>
        <span className={styles.sectionTitleAccent} />
        Handlers
      </div>
      <p className={styles.handlersIntro}>
        Methods available via <strong>render props</strong>,{" "}
        <strong>ref</strong>, or the{" "}
        <span className={styles.handlersIntroHook}>useControls</span> hook. Each
        handler triggers an animated transition on the transform state.
      </p>

      <div className={styles.handlerGrid}>
        {rows.map((row, i) => (
          <div key={i} className={styles.handlerCard}>
            <div className={styles.handlerCardHeader}>
              <span className={styles.handlerName}>
                {row.name}(
                {row.parameters && row.parameters.length > 0 && (
                  <span className={styles.handlerNameParams}>
                    {"{ "}
                    {row.parameters
                      .map((raw) => parseParam(raw).name)
                      .join(", ")}
                    {" }"}
                  </span>
                )}
                )
              </span>
              <span className={styles.handlerBadge}>Method</span>
            </div>

            <div className={styles.handlerCardBody}>
              {row.description && (
                <p className={styles.handlerDescription}>{row.description}</p>
              )}

              {row.parameters && row.parameters.length > 0 && (
                <table className={styles.paramsTable}>
                  <thead>
                    <tr>
                      <th className={styles.paramsTableHeader}>Param</th>
                      <th className={styles.paramsTableHeader}>Type</th>
                      <th className={styles.paramsTableHeader}>Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.parameters.map((raw, j) => {
                      const p = parseParam(raw);
                      return (
                        <tr key={j}>
                          <td className={styles.paramsTableCellName}>
                            {p.name}
                          </td>
                          <td className={styles.paramsTableCellType}>
                            {p.type}
                          </td>
                          <td className={styles.paramsTableCellDefault}>
                            {p.def || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
