/* eslint-disable react/no-array-index-key, no-nested-ternary */
import React from "react";

import styles from "./docs.module.css";

export type DocTableColumn = {
  header: string;
  style?: "name" | "type" | "default" | "text";
};

export function DocTable({
  columns,
  rows,
}: {
  columns: DocTableColumn[];
  rows: string[][];
}) {
  return (
    <table className={styles.docTable}>
      <thead>
        <tr className={styles.docTableHeadRow}>
          {columns.map((col, i) => (
            <th key={i} className={styles.docTableTh}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr
            key={ri}
            className={
              ri % 2 === 1 ? styles.docTableRowAlt : styles.docTableRow
            }
          >
            {row.map((cell, ci) => {
              const colStyle =
                columns[ci]?.style ?? (ci === 0 ? "name" : "text");
              const cls =
                colStyle === "name"
                  ? styles.docTableCellName
                  : colStyle === "type"
                    ? styles.docTableCellType
                    : colStyle === "default"
                      ? styles.docTableCellDefault
                      : styles.docTableCellText;
              return (
                <td key={ci} className={cls}>
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
