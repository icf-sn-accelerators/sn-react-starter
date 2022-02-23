/* eslint-disable import/no-extraneous-dependencies */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin: ManifestPlugin } = require('webpack-manifest-plugin');
const { merge } = require('webpack-merge');

const paths = require('../paths');
const { ASSETS_API_PATH, CSS_API_PATH, JS_API_PATH, IMG_API_PATH,  } = require('../servicenow-config');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    path: paths.build,
    publicPath: '/',
    filename: `${JS_API_PATH}/[name]-[contenthash]-bundle-js`,
  },
  plugins: [
    new ManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: `${CSS_API_PATH}/[name]-[contenthash]-css`,
      chunkFilename: `${CSS_API_PATH}/[id]-css`,
    }),
    new HtmlWebpackPlugin({
      title: 'React Light',
      favicon: `${paths.src}/images/favicon.ico`,
      template: `${paths.src}/sn-template.html`,
      filename: 'index.html',
      xhtml: true,
      extensionRegexp: /[.-](css|js|mjs)(\?|$)/,
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: `${IMG_API_PATH}[name]-[hash]-[ext]`,
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
        generator: {
          filename: `${ASSETS_API_PATH}[name]-[hash]-[ext]`,
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    runtimeChunk: {
      name: 'runtime',
    },
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
