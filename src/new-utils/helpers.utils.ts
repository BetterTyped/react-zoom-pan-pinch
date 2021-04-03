export const cancelTimeout = (
  timeout: ReturnType<typeof setTimeout> | null,
) => {
  if (timeout) {
    cancelTimeout(timeout);
  }
};
