const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  return {
    mode: webpackEnv,
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        // 不同浏览器对css的支持是不一样的，所以我们需要postcss-loader来作兼容
        {test: /.css$/i, use:["style-loader","css-loader", {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                [
                  'postcss-preset-env', {
                    autoprefixer: {
                      flexbox: 'no-2009'
                    },
                    state: 3
                  }
                ]
              ]
            }
          }
        }]},
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: 'asset',
          generator: {
            filename: 'image/[name].[contenthash:8][ext][query]'
          }
        },
        {
          exclude: /\.(js|mjs|ejs|jsx|ts|tsx|css|scss|sass|png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, './src'),
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                  ]
                ],
                plugins: [
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      "helper": true,
                      "regenerator": true
                    }
                  ]
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.ejs')
      })
    ]
  }
}