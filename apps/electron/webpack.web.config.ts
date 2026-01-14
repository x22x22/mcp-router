import type { Configuration } from "webpack";
import * as path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

import { rules } from "./webpack.rules";

// Add CSS rule
rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      // PostCSS plugins are defined in postcss.config.js
    },
  ],
});

export const webConfig: Configuration = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./src/renderer.tsx",
  target: "web", // Target web browsers instead of Electron
  output: {
    path: path.resolve(__dirname, ".webpack/renderer"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    modules: [path.resolve(__dirname, "../../node_modules"), "node_modules"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@mcp_router/shared": path.resolve(
        __dirname,
        "../../packages/shared/src",
      ),
      "@mcp_router/platform-api": path.resolve(
        __dirname,
        "../../packages/platform-api/src",
      ),
      "@mcp_router/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@mcp_router/tailwind-config": path.resolve(
        __dirname,
        "../../packages/tailwind-config",
      ),
    },
    fallback: {
      // Provide browser-compatible alternatives for Node.js modules
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      os: false,
    },
  },
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "eval-source-map",
};
