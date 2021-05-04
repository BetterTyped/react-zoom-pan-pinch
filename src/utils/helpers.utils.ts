export const isExcludedNode = (
  node: HTMLElement,
  excluded: string[],
): boolean => {
  const targetTagName = node.tagName.toUpperCase();
  const isExcludedTag = excluded.find(
    (tag) => tag.toUpperCase() === targetTagName,
  );

  if (isExcludedTag) return true;

  const isExcludedClassName = excluded.find((tag) =>
    node.classList.contains(tag),
  );

  if (isExcludedClassName) return true;

  return false;
};

export const cancelTimeout = (
  timeout: ReturnType<typeof setTimeout> | null,
): void => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
