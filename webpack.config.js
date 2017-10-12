const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: [path.resolve(__dirname, "src", "app.jsx")],
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    resolve:{
        extensions:[".ts", ".tsx", ".js", ".jsx", ".scss"]        
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.jsx/,
                include: path.resolve(__dirname, "src"),
                exclude: path.resolve(__dirname, "node_modules"),
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["react", "es2015", "stage-0"],
                        plugins: [
                            "transform-decorators-legacy"
                        ]
                    }
                }
            },
            {
                test: /\.js/,
                include: path.resolve(__dirname, "src"),
                exclude: path.resolve(__dirname, "node_modules"),                
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["react", "es2015", "stage-0"],
                        plugins: [
                            "syntax-object-rest-spread",
                            "transform-object-rest-spread",
                            "transform-decorators-legacy",
                            "transform-runtime",
                            ["import", {"libraryName": "antd","style": "css"}]
                        ]
                    }
                }
            },
            {
                test: /\.scss/,
                loader: ["style-loader", "css-loader", "sass-loader"],
                include: path.resolve(__dirname, "src/styles"),
                exclude: path.resolve(__dirname, "node_modules"),
                
            },
            {
                test: /\.scss/,
                include: [
                    path.resolve(__dirname, 'src/views'),
                    path.resolve(__dirname, 'src/components'),
                    path.resolve(__dirname, 'src/layouts'),
                ],
                exclude: path.resolve(__dirname, "node_modules"),                
                use:[{
                        loader: "style-loader"
                    },{
                        loader: "typings-for-css-modules-loader",
                        options: {
                            modules: true,
                            localIdentName: "[name]__[local]--[hash:base64:5]",
                            namedExport: true
                        }
                    },{
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.css/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg)$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "images/[name].[ext]"
                }
            }
        ]
    },
    devServer: {
        contentBase: "./src",
        historyApiFallback:{
            index: "index.html"
        },
        publicPath: "/build",
        inline: true,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};