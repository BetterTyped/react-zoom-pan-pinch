import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import vsLight from "prism-react-renderer/themes/vsLight";

export const Code = ({ code }: { code: string }) => (
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
