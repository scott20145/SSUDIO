import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as HappyPack from 'happypack';
import * as HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
    entry: path.join(__dirname, 'src/app.ts'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.scss'],
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'lib')
        ],
        alias: {
            assets: path.join(__dirname, 'assets/'),
        }
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: true,
            watch: ['./src'] // optional but improves performance (less stat calls)
        }),
        new HappyPack({
            id: 'ts',
            loaders: [
                {
                    path: 'ts-loader',
                    query: { happyPackMode: true }
                }
            ]
        }),
        new HtmlWebpackPlugin({
            version: JSON.stringify(require("./package.json").version),
            template: path.join(__dirname, 'src/index.html')
        }),
        new CopyWebpackPlugin([{
            from: 'assets',
            to: 'assets'
        }]),
        new ExtractTextPlugin('bundle.css')
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        host: '127.0.0.1',
        port: 7002,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'happypack/loader?id=ts',
                exclude: '/node_modules/'
            },
            {
                test: /assets(\/|\\)/,
                use: 'file-loader?name=assets/[hash].[ext]'
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'resolve-url-loader', 'sass-loader']
                }),
            }
        ]
    },
    devtool: 'eval'
};

export default config;
