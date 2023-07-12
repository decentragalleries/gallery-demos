const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const scenes = [
  "architecture-environment",
  "asset-container",
  "baked-lights",
  "skybox",
  "testing",
];

module.exports = {
  entry: {
    engine: path.join(path.resolve() + "/src/engine.js"),
    ...scenes.reduce(
      (a, c) => ({
        ...a,
        [c]: path.join(path.resolve() + `/src/scenes/${c}.js`),
      }),
      {}
    ),
  },
  output: {
    filename: "[name].bundle.js", //name for the js file that is created/compiled in memory
    clean: true,
  },
  resolve: {
    extensions: [".js"],
  },
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    static: path.join(path.resolve() + "/public"), //tells webpack to serve from the public folder
    hot: true,
    devMiddleware: {
      publicPath: "/",
    },
  },
  plugins: scenes.map(
    (scene) =>
      new HtmlWebpackPlugin({
        template: path.join(path.resolve() + "/public/index.html"),
        filename: `${scene}.html`,
        chunks: ["engine", scene],
      })
  ),
  mode: "development",
};
