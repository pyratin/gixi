import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const pathGet = (index = 0, pathFragment = '') =>
  path.join(
    process.cwd(),
    ['source', 'target'][index],
    'browser',
    pathFragment
  );

const exclude = [/node_modules/];

/** @type {webpack.Configuration & webpackDevServer.Configuration} */
export default {
  entry: pathGet(0),
  output: { path: pathGet(1), filename: '[name].js', publicPath: '/' },
  plugins: [
    new HtmlWebpackPlugin({ template: pathGet(0, 'index.html') }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: /** @type {CopyWebpackPlugin.Pattern[]} */ (
        /** @type {unknown} */ (
          ['asset'].map((pathFragment) => ({
            ...Object.fromEntries(
              ['from', 'to'].map((key, index) => [
                key,
                pathGet(index, pathFragment)
              ])
            ),
            noErrorOnMissing: true
          }))
        )
      )
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude,
        resolve: { fullySpecified: false },
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        exclude,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: { namedExport: false, exportLocalsConvention: 'as-is' }
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  devServer: { hot: true, liveReload: true, historyApiFallback: true },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: { test: exclude[0], name: 'vendor', enforce: true }
      }
    }
  },
  resolve: {
    alias: {
      'react-reconciler/constants': 'react-reconciler/constants.js'
    }
  }
};
