/** @returns {rotate: "-10 50 100", translate: "-36 45.5", skewX: "40", scale: "1 0.5"} */
export function parseTransform(transform: string): Record<string, string> {
  return Array.from(transform.matchAll(/(\w+)\((.+?)\)/gm)).reduce(
    (agg, [, fn, val]) => ({
      ...agg,
      [fn]: val,
    }),
    {},
  );
}
