import React from "react";
import type { ControlsOptionsType } from "./props";
import styles from "./docs.module.css";

type Group = {
  header: ControlsOptionsType | null;
  children: ControlsOptionsType[];
};

export function PropTable({
  rows,
  title,
}: {
  rows: ControlsOptionsType[];
  title: string;
}) {
  const groups: Group[] = [];
  let current: Group | null = null;

  rows.forEach((row) => {
    if (row.isObjectRow) {
      current = { header: row, children: [] };
      groups.push(current);
    } else if (current) {
      current.children.push(row);
    } else {
      groups.push({ header: null, children: [row] });
    }
  });

  let rowIndex = 0;

  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>
        <span className={styles.sectionTitleAccent} />
        {title}
      </div>

      <div className={styles.columnHeader}>
        <span>Property</span>
        <span>Type</span>
        <span>Default</span>
        <span>Description</span>
      </div>

      {groups.map((group, gi) => {
        if (group.header) rowIndex = 0;
        return (
          <div key={gi}>
            {group.header && (
              <div className={styles.groupHeader}>
                <span className={styles.groupName}>
                  {typeof group.header.name === "string"
                    ? group.header.name
                    : (
                        group.header.name as React.ReactElement<{
                          children?: React.ReactNode;
                        }>
                      )?.props?.children ?? ""}
                </span>
                {group.children.length > 0 && (
                  <span className={styles.groupCount}>
                    {group.children.length} props
                  </span>
                )}
              </div>
            )}

            {group.children.map((row, ri) => {
              const isNested = !!group.header;
              const propName =
                typeof row.name === "string" ? row.name : null;
              const isAlt = rowIndex++ % 2 === 1;

              const rowClass = isNested
                ? isAlt
                  ? styles.propRowNestedAlt
                  : styles.propRowNested
                : isAlt
                  ? styles.propRowAlt
                  : styles.propRow;

              return (
                <div key={ri} className={rowClass}>
                  <span className={styles.propName}>
                    {isNested && (
                      <span className={styles.nestDot}>.</span>
                    )}
                    {propName ?? row.name}
                  </span>

                  <span className={styles.typeText}>
                    {row.type.filter(Boolean).join(" | ")}
                  </span>

                  <span>
                    {row.defaultValue && row.defaultValue !== "" ? (
                      <span className={styles.defaultText}>
                        {row.defaultValue}
                      </span>
                    ) : (
                      <span className={styles.defaultEmpty}>—</span>
                    )}
                  </span>

                  <span className={styles.description}>
                    {row.description}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
