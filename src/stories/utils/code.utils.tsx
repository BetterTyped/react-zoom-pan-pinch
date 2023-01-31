/* eslint-disable react/no-array-index-key */
import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import vsLight from "prism-react-renderer/themes/vsLight";

type Props = { code: string };

export const Code: React.FC<Props> = ({ code }: Props) => (
  <Highlight {...defaultProps} code={code} theme={vsLight} language="tsx">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre className={className} style={style}>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
