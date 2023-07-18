const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const scenes = [
  "architecture-environment",
  "asset-container",
  "baked-lights",
  "moving-object-shadows",
  "testing",
  "load-s3",
];



module.exports = {
  entry: {
    engine: path.join(path.resolve() + "/src/engine.js"),
    ...scenes.reduce(
      (a, c) => ({
        ...a,
        [c]: {
          import: path.join(path.resolve() + `/src/scenes/${c}.js`),
          dependOn: "engine",
        },
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
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|ogg|mp3|wav)$/i,
        use: [{ loader: "file-loader" }],
      },
    ],
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
  plugins: [
    ...scenes.map(
      (scene) =>
        new HtmlWebpackPlugin({
          template: path.join(path.resolve() + "/public/index.html"),
          filename: `${scene}.html`,
          chunks: ["engine", scene],
        })
    ),
    new Dotenv({
      path: "./.env.local",
    }),
  ],
  mode: "development",
};
