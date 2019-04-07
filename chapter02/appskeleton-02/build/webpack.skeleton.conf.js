/**
 * @file skeleton webpack 配置文件
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const nodeExternals = require('webpack-node-externals')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  target: 'node',
  devtool: false,
  entry: {
    app: './src/entry-skeleton.js'
  },
  output: Object.assign({}, baseWebpackConfig.output, {
    filename: 'skeleton-bundle.js',
    libraryTarget: 'commonjs2'
  }),
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
})
