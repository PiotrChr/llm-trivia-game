const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = (env, argv) => {
    const isDevMode = argv.mode === 'development';
    
    const getEnvVar = (key) => {
        if (process.env[key]) {
            return JSON.stringify(process.env[key]);
        }

        const dotenv = require('dotenv').config({ path: '../.frontend.env' });
    
        if (!dotenv.parsed || typeof dotenv.parsed !== 'object' || !dotenv.parsed[key]) {
            console.warn(`Environment variable ${key} is not set or .frontend.env file is missing.`);
            return JSON.stringify('');
        }
    
        return JSON.stringify(dotenv.parsed[key]);
    };

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
                {
                    test: /\.svg$/,
                    use: ['file-loader']
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                filename: '../../index.html',
                template: path.resolve(__dirname, '../src', 'index.html'),
            }),
            new webpack.EnvironmentPlugin({
                NODE_ENV: isDevMode ? 'development' : 'production'
            }),
            new webpack.DefinePlugin({
                'process.env.BACKEND_HOST': getEnvVar('BACKEND_HOST'),
                'process.env.BACKEND_PORT_PUBLIC': getEnvVar('BACKEND_PORT_PUBLIC'),
            }),
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