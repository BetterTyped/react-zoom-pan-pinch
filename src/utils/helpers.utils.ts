import { baseClasses } from "../constants/state.constants";

const matchPrefix = `.${baseClasses.wrapperClass}`;

export const isExcludedNode = (
  node: HTMLElement,
  excluded: string[],
): boolean => {
  return excluded.some((exclude) =>
    node.matches(
      `${matchPrefix} ${exclude}, ${matchPrefix} .${exclude}, ${matchPrefix} ${exclude} *, ${matchPrefix} .${exclude} *`,
    ),
  );
};

export const cancelTimeout = (
  timeout: ReturnType<typeof setTimeout> | null,
): void => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
