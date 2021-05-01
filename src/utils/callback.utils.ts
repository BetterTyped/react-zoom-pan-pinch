export const handleCallback = (
  callback: (context: any) => void,
  context: any,
) => {
  if (callback && typeof callback === "function") {
    callback(context);
  }
};
