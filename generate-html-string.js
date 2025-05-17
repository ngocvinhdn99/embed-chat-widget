import { readFileSync, writeFileSync } from "fs";
import { minify } from "html-minifier";

const minifyOptions = {
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
};

// Generate widget HTML string
const widgetHtml = readFileSync("./src/html/widget.html").toString();
writeFileSync(
  "./src/html/widget-string.ts",
  `export const widgetHTML = \`${minify(widgetHtml, minifyOptions)}\`;\n`
);

// Generate button HTML string
const buttonHtml = readFileSync("./src/html/button.html").toString();
writeFileSync(
  "./src/html/button-string.ts",
  `export const buttonHTML = \`${minify(buttonHtml, minifyOptions)}\`;\n`
);
