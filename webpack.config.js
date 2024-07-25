const path = require("path");
const Dotenv = require("dotenv-webpack");
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "client/index.js"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
    port: 3000,
    open: true,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:8080",
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      fs: false,
      os: false,
      path: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/i,
        use: {
          loader: "file-loader",
        },
      },
    ],
  },
  plugins: [new Dotenv()],
};
