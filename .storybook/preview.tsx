import React from "react";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Docs",
          "Basic",
          ["Image", "*"],
          "Advanced",
          "Components",
          "Examples",
          "Hooks",
        ],
      },
    },
  },
};

export default preview;
