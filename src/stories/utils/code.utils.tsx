/* eslint-disable react/no-array-index-key */
import React from "react";
// import { Highlight, defaultProps, themes } from "prism-react-renderer";

type Props = { code: string };

export const Code: React.FC<Props> = ({ code }: Props) => (
  <pre>
    <code>{code}</code>
  </pre>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // <Highlight
  //   {...defaultProps}
  //   code={code}
  //   theme={themes.shadesOfPurple}
  //   language="tsx"
  // >
  //   {({ className, style, tokens, getLineProps, getTokenProps }) => (
  //     <pre className={className} style={style}>
  //       {tokens.map((line, i) => (
  //         <div key={i} {...getLineProps({ line, key: i })}>
  //           {line.map((token, key) => (
  //             <span key={key} {...getTokenProps({ token, key })} />
  //           ))}
  //         </div>
  //       ))}
  //     </pre>
  //   )}
  // </Highlight>
);
