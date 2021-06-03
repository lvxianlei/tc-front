const path = require('path');
const fs = require('fs');
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
} = require('customize-cra');
const DotenvWebpack = require('dotenv-webpack');
const Dotenv = require('dotenv');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const AppCtxConfigCompiler = require('./compiler/AppCtxConfigCompiler');
const { ModifySourcePlugin } = require('modify-source-webpack-plugin');
const MockWebpackPlugin = require('mock-webpack-plugin');
const mockConfig = require('./mock/config');

module.exports = {
    webpack: override(
        addWebpackModuleRule({ test: /.jsonc$/, use: 'jsonc-loader' }),
        fixBabelImports('antd', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true
        }),
        // fixBabelImports('@ant-design/charts', {
        //     libraryName: '@ant-design/charts',
        //     libraryDirectory: 'es'
        // }),
        addBabelPresets('@babel/preset-react'),
        addBabelPlugin('@babel/plugin-syntax-dynamic-import'),
        addBabelPlugin('@loadable/babel-plugin'),
        addLessLoader({ // modified the theme
            lessOptions: {
                modifyVars: {
                    // '@font-size-base': '12px'
                //     '@primary-color': '#1DA57A',
                //     '@link-color': '#1DA57A',
                //     '@processing-color': '#1DA57A',
                //     '@border-radius-base': '2px'
                },
                javascriptEnabled: true
            }
        }),
        addWebpackPlugin(new DotenvWebpack({
            path: `./env/.${ process.env.NODE_ENV }.env`, // load this now instead of the ones in '.env'
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: true, // hide any errors
            defaults: false // load '.env.defaults' as the default values if empty.
        })),
        addWebpackPlugin(new AntdDayjsWebpackPlugin()),
        addWebpackPlugin(new ModifySourcePlugin({
            rules: [{
                test: /\/ApplicationContext\.ts$/,
                modify: (src, filename) => new AppCtxConfigCompiler().compile(src)
            }]
        })),
        (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'integration')
        ?
        addWebpackPlugin(new MockWebpackPlugin({
            // mock config
            config: mockConfig,
            // mock server port, avoid collision with application port
            port: 3001
        }))
        :
        undefined
    )
    ,
    devServer: overrideDevServer(
        function (config) {
            const proxy = {};
            const envConfig = Dotenv.config({ path: path.join(__dirname, '/env', `.${ process.env.NODE_ENV }.env`) });
            fs.readdirSync(path.join(__dirname, './mock/api/')).forEach((dirname) => {
                const stats = fs.statSync(path.join(__dirname, './mock/api/', dirname));
                if (!stats.isDirectory()) {
                    dirname = dirname.replace(/\.[\w\d]+/, '');
                }
                proxy[`/${ dirname }`] = envConfig.parsed.REQUEST_API_REAL_HOST_NAME; // mock server url
            });
            return Object.assign(config || {}, {
                port: 3000,
                proxy: proxy,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
                }
            });
        },
        watchAll()
    )
};
