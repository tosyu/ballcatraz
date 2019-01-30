const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function fromRoot() {
    const args = [].slice.call(arguments);
    return path.join.apply(path, ([__dirname, '..', ].concat(args)));
}

module.exports = (env, opts) => {
    const config = {
        entry: {
            app: fromRoot('src/app/main.ts'),
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
            extensions: ['.ts', '.js', 'map'],
            alias: {
                pixi: fromRoot('node_modules/phaser-ce/build/custom/pixi.js'),
                phaser: fromRoot('node_modules/phaser-ce/build/custom/phaser-split.js'),
                p2: fromRoot('node_modules/phaser-ce/build/custom/p2.js'),
                assets: fromRoot('build/app/assets'),
            }
        },
        output: {
            filename: '[name].js',
            path: fromRoot('build/app'),
        },
        optimization: {},
        plugins: []
    };

    if (opts.mode && opts.mode === 'development') {
        config.devtool = 'inline-source-map';

        if (opts.serve) {
            console.log('enabling webserver');
            config.devServer = {
                contentBase: [
                    fromRoot('build/app'),
                    fromRoot('build/app/assets')
                ],
                compress: true,
                port: 9000
            }
        }
    } else {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin())
    }

    config.plugins.push(new HtmlWebpackPlugin());
    config.plugins.push(new CopyWebpackPlugin(
        [
            {from: 'assets/**/*', context: fromRoot('src')}
        ],
        {}
    ));

    return config;
};