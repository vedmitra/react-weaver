const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = (env, argv) => {
  const {
    hmr,
    environment,
    mode,
    release
  } = argv
  const config = (
    !release
      ? (
        hmr
          ? getHmrConfig(mode)
          : getDevelopmentConfig(mode)
      )
      : getProductionConfig(mode)
  )
  return config
}

function getHmrConfig(mode) {
  const config = getDevelopmentConfig(mode)
  return {
    ...config,
    entry: ['react-hot-loader/patch', './examples/index'],
    devServer: {
      host: '0.0.0.0',
      port: 3000,
      publicPath: '/',
      compress: true,
      hot: true,
    },
  }
}

function getDevelopmentConfig(mode = 'development') {
  const config = getBaseConfig()
  return {
    ...config,
    entry: './examples/index',
    mode,
    devtool: 'eval-source-map',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
    }
  }
}

function getProductionConfig(mode = 'production') {
  const config = getBaseConfig()
  return {
    ...config,
    entry: './examples/index',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, './dist'),
      publicPath: '/static/',
    },
    mode,
    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.js$/,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            ecma: 6,
            compress: {
              pure_funcs: [
                'console.debug',
              ],
            },
          },
        }),
      ],
    },
    plugins: [
      // TODO: Just want the environment, probably should factor out
      // into a function.
      config.plugins[1],
      new CleanWebpackPlugin(),
    ]
  }
}

function getBaseConfig() {
  return {
    target: 'web',
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(jpe?g|png|woff|woff2|eot|ttf|otf|svg)$/,
          loader: 'url-loader?limit=100000',
        }
      ]
    },
    resolve: {
      mainFields: ['browser', 'module', 'main'],
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'react-weaver': path.resolve(__dirname, '../src'),
        'react-dom': '@hot-loader/react-dom',
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        meta: {
          viewport: 'width=device-width initial-scale=1'
        }
      }),
      // TODO: Keep this at index 1, but we could use a nicer way to
      // share this with other things like Storybook.
      new webpack.EnvironmentPlugin([
      ])
    ]
  }
}
