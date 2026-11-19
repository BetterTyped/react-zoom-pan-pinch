/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
  /**
   * The compiled CSS, exported by rollup-plugin-postcss with `inject: false`.
   * Undefined under bundlers that load CSS themselves (Storybook).
   */
  export const stylesheet: string | undefined;
}
declare module "*.svg" {
  import React = require("react");

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";

type SvgrComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>;
