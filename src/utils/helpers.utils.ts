export const cancelTimeout = (
  timeout: ReturnType<typeof setTimeout> | null,
) => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
