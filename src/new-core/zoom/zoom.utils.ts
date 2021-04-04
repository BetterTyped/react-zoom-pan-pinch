export const isZoomAllowed = () => {
  // Check if it's possible to perform wheel event
  if (!isAllowed) return;
  // Event ctrlKey detects if touchpad action is executing wheel or pinch gesture
  if (!wheelEnabled && !event.ctrlKey) return;
  if (!touchPadEnabled && event.ctrlKey) return;
};
