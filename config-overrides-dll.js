const path = require("path");
const {
  override,
  addWebpackPlugin,
} = require("customize-cra");
const { DllPlugin } = require("webpack");

const vendors = [
  "react",
  "react-dom",
  "react-router",
  "react-router-dom",
  "echarts",
  "query-string",
  "moment",
  "dayjs",
  "ali-react-table",
  "antd",
  "antd-img-crop",
  "react-sortable-hoc"
]

module.exports = {
  webpack: override(
    function (config) {
      return {
        entry: {
          "lib": vendors
        },
        output: {
          filename: "[name].dll.js",
          path: path.resolve(__dirname, "build"),
          library: "_dll_[name]"
        },
        plugins: [
          new DllPlugin({
            context: __dirname,
            name: "[name]_[hash]",
            path: path.resolve(__dirname, "dll.json")
          })
        ]
      };
    }
  )
};
