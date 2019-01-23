const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, opts) => {
    const config = {
        entry: {
            app: path.resolve(__dirname, '../src/app/main.ts'),
        },
        mode: opts.mode || 'development',
        module: {
            rules: [
                { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
                { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
                { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
                { test: /assets(\/|\\)/, type: 'javascript/auto', loader: 'file-loader?name=assets/[hash].[ext]' },
                { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
                { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
                { test: /p2\.js$/, loader: 'expose-loader?p2' },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                pixi: path.join(__dirname, '../node_modules/phaser-ce/build/custom/pixi.js'),
                phaser: path.join(__dirname, '../node_modules/phaser-ce/build/custom/phaser-split.js'),
                p2: path.join(__dirname, '../node_modules/phaser-ce/build/custom/p2.js'),
                assets: path.join(__dirname, '../assets/')
            }
        },
        output: {
            filename: '[name].[contentHash].js',
            path: path.resolve(__dirname, '../build/app')
        },
        optimization: {},
        plugins: []
    };

    if (opts.mode && opts.mode === 'development') {
        config.devtool = 'inline-source-map';

        if (opts.serve) {
            config.devServer = {
                contentBase: path.resolve(__dirname, '../build'),
                compress: true,
                port: 9000
            }
        }
    } else {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin())
    }

    config.plugins.push(new HtmlWebpackPlugin());

    return config;
};