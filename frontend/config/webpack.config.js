const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
    const isDevMode = argv.mode === 'development';
    
    return {
        entry: path.resolve(__dirname, '../src/index.jsx'),
        output: {
            path: path.resolve(__dirname, '../public/static/dist/'),
            filename: isDevMode ? 'bundle.[contenthash].js' : 'bundle.[contenthash].js',
            publicPath: '/static/dist/'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                            loader: 'babel-loader',
                            options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ]
        },
        plugins: [
            new Dotenv(),
            new HtmlWebpackPlugin({
                filename: '../../index.html',
                template: path.resolve(__dirname, '../src', 'index.html'),
            }),
            // new CopyPlugin({
            //     patterns: [
            //         { from: path.resolve(__dirname, '../resources/img/'), to: path.resolve('../dist/img/') },
            //     ],
            // }),
        ],
        resolve: {
            extensions: ['.js', '.jsx']
        },
        devServer: {
            historyApiFallback: true,
        },
        devtool: isDevMode ? 'eval-source-map' : 'source-map'
    }
  };