export const isExcludedNode = (
  node: HTMLElement,
  excluded: string[],
): boolean => {
  return excluded.some((exclude) =>
    node.matches(`${exclude}, .${exclude}, ${exclude} *, .${exclude} *`),
  );
};

export const cancelTimeout = (
  timeout: ReturnType<typeof setTimeout> | null,
): void => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
