/* eslint-disable import/no-extraneous-dependencies */
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

const paths = require('../paths');
const { SERVICENOW_INSTANCE } = require('../servicenow-config');
const common = require('./webpack.common');

module.exports = merge(common, {
  devServer: {
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    historyApiFallback: true,
    open: true,
    port: 3000,
    proxy: {
      '*': {
        changeOrigin: true,
        secure: false,
        target: SERVICENOW_INSTANCE,
      }
    },
    static: paths.build,
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      favicon: `${paths.src}/images/favicon.ico`,
      filename: 'index.html',
      template: `${paths.src}/template.html`,
      title: 'React Light',
    }),
    new BundleAnalyzerPlugin({ openAnalyzer: false }),
    new ReactRefreshPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
