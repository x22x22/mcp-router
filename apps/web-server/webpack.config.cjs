const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack rules
const rules = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
        configFile: path.resolve(__dirname, "../electron/tsconfig.json"),
      },
    },
  },
  {
    test: /\.css$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      {
        loader: "postcss-loader",
      },
    ],
  },
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    type: "asset/resource",
  },
];

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: path.resolve(__dirname, "src/renderer-web.tsx"),
  output: {
    path: path.resolve(__dirname, "dist/public"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },
  module: {
    rules,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../electron/src/index.html"),
      filename: "index.html",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".css", ".json"],
    modules: [path.resolve(__dirname, "../../node_modules"), "node_modules"],
    alias: {
      "@": path.resolve(__dirname, "../electron/src"),
      "@mcp_router/shared": path.resolve(
        __dirname,
        "../../packages/shared/src",
      ),
      "@mcp_router/remote-api-types": path.resolve(
        __dirname,
        "../../packages/remote-api-types/src",
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
      // Polyfills for Node.js modules not available in browser
      "path": false,
      "fs": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
    },
  },
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "eval-source-map",
};
