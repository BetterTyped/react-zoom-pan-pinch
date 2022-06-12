// Default CSS definition for TypeScript. Will be overridden with file-specific definitions by Rollup.
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

type SvgrComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>;
