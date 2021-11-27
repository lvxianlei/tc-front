const path = require("path");
const fs = require("fs");
const {
  override,
  overrideDevServer,
  watchAll,
  fixBabelImports,
  addWebpackPlugin,
  addBabelPresets,
  addBabelPlugin,
  addLessLoader,
  addWebpackModuleRule
} = require("customize-cra");
const DotenvWebpack = require("dotenv-webpack");
const Dotenv = require("dotenv");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const AppCtxConfigCompiler = require("./compiler/AppCtxConfigCompiler");
const { ModifySourcePlugin } = require("modify-source-webpack-plugin");
const MockWebpackPlugin = require("mock-webpack-plugin");
const mockConfig = require("./mock/config");
const { DefinePlugin } = require("webpack")
const envConfig = Dotenv.config({
  path: path.join(__dirname, "/env", `.env.${process.env.REACT_APP_ENV}`),
});
module.exports = {
  webpack: override(
    function (config) {
      const scopePluginIndex = config.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          rcRelevant: {
            name: 'rc-relevant',
            test: /[\\/]node_modules[\\/](@ant-design|rc-table|rc-picker|rc-select|rc-util|rc-menu|rc-tree|rc-pagination|rc-image|rc-virtual-list|rc-textarea|rc-trigger)[\\/]/,
            chunks: 'all',
            priority: 4,
          },
          antd: {
            name: 'antd',
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            chunks: 'all',
            priority: 3,
          },
          vendor: {
            name: 'vendor',
            priority: 2,
            test: /node_modules/,
            // test: /[\\/]node_modules[\\/](react|react-dom|moment|react-document-title|bind-decorator)[\\/]/,
            chunks: 'all',
            minSize: 0,
            minChunks: 2,
          },
          common: {
            name: 'common',
            priority: 1,
            test: /src/,
            chunks: 'all',
            minSize: 0,
            minChunks: 2,
          },
        }
      }
      config.resolve.plugins.splice(scopePluginIndex, 1);
      return config;
    },
    addWebpackModuleRule({ test: /.jsonc$/, use: "jsonc-loader" }),
    fixBabelImports("antd", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    // fixBabelImports('@ant-design/charts', {
    //     libraryName: '@ant-design/charts',
    //     libraryDirectory: 'es'
    // }),
    addBabelPresets("@babel/preset-react"),
    addBabelPlugin("@babel/plugin-syntax-dynamic-import"),
    addBabelPlugin("@loadable/babel-plugin"),
    addLessLoader({
      // modified the theme
      lessOptions: {
        modifyVars: {
          'root-entry-name': 'default',
          '@font-size-base': '12px',
          "@primary-color": "#FF8C00",
          "@descriptions-bg": "#F5F5F5"
          //     '@link-color': '#1DA57A',
          //     '@processing-color': '#1DA57A',
          //     '@border-radius-base': '2px'
        },
        javascriptEnabled: true,
      },
    }),
    addWebpackPlugin(
      new DotenvWebpack({
        path: `./env/.env.${process.env.REACT_APP_ENV}`, // load this now instead of the ones in '.env'
        safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
        silent: true, // hide any errors
        defaults: false, // load '.env.defaults' as the default values if empty.
      })
    ),
    // addWebpackPlugin(
    //   new TerserPlugin({
    //     parallel: true
    //   })
    // ),
    addWebpackPlugin(new AntdDayjsWebpackPlugin()),
    addWebpackPlugin(new DefinePlugin({
      "process.env.REACT_APP_ENV": envConfig.parsed.REQUEST_API_PATH_PREFIX
    })),
    addWebpackPlugin(
      new ModifySourcePlugin({
        rules: [
          {
            test: /\/ApplicationContext\.tsx$/,
            modify: (src, filename) => new AppCtxConfigCompiler().compile(src),
          },
        ],
      })
    ),
    process.env.REACT_APP_ENV === "development"
      ? addWebpackPlugin(
        new MockWebpackPlugin({
          // mock config
          config: mockConfig,
          // mock server port, avoid collision with application port
          port: 3001,
        })
      )
      : undefined
  ),
  devServer: overrideDevServer(function (config) {
    const proxy = {
      "/yapi": {
        target: "http://yapi.saikul.com/mock/652/",
        pathRewrite: { "^/yapi": "" },
        changeOrigin: true,
        secure: false,
      }
    }
    fs.readdirSync(path.join(__dirname, "./mock/api/")).forEach((dirname) => {
      const stats = fs.statSync(path.join(__dirname, "./mock/api/", dirname));
      if (!stats.isDirectory()) {
        dirname = dirname.replace(/\.[\w\d]+/, "");
      }
      proxy[`/${dirname}`] = envConfig.parsed.REQUEST_API_REAL_HOST_NAME; // mock server url
    });
    return Object.assign(config || {}, {
      port: 4000,
      proxy: proxy,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization, Tenant-Id, Sinzetech-Auth",
      },
    });
  }, watchAll()),
};
