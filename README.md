## 学习webpack

### 加载image图像
> 在webpack5之前使用url-loader来加载图片，在webpack5中使用内置的Asset Modules来加载图像资源
webpack5之前
* raw-loader 将文件导入为字符串
* url-loader 将文件作为data URI内联到bundle中
* file-loader 将文件发送到输出目录

webpack5
* asset/resource 发送一个单独的文件并导入URL，之前通过使用file-loader使用
* asset/inline 导出一个资源的data URL,之前通过使用url-loader来使用
* asset/source 导出资源的源代码，之前通过raw-loader实现

```js
module: {
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    type: 'asset',
    generator: {
      filename: 'image/[name].[contenthash:8][ext][query]'
    }
  }
}
```
也可以在output中定义assetModuleFilename设置默认存放位置于文件名格式
```js
output: {
  assetModuleFilename: 'asset/[name].[contenthash:8][ext][query]' 
}
```

### 加载字体或者其他资源
> 可以通过排除其他文件来 表示其他资源
```js
module.exports = {
  rules: [
    {
      exclude: /\.(js|mjs|ejs|jsx|ts|tsx|css|scss|sass|png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    }
  ]
}
```

### 兼容js: 将es6及以上的javascript语法转换为es5
1. babel-loader
安装:
```bash
pnpm install --save-dev babel-loader @babel/core @babel/preset-env
```
2. 需要用到的babel插件
* @babel/plugin-transform-runtim
* @bable/runtime
安装
```bash
pnpm install --save-dev @babel/plugin-transform-runtime
pnpm install --save @babel/runtime
```

webpack.common.js
```js
module.exports = {
  rule: [
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
                {
                  "useBuiltIns": "usage",
                  "corejs": 3
                }
              ]
            ]
          }
        }
      ]
    }
  ]
}
```
这里我们使用了babel的插件，@babel/preset-env,它是转译插件的集合。
比如我们使用了箭头函数，浏览器是不识别的需要转译成普通函数的，所以我们需要添加babel插件：
@babel/plugin-transform-arrow-funtions来处理箭头函数,babel为了简便开发者的使用，将所有
需要转换的es6特性的插件都集合到了@babel/preset-env中。
> 在使用@babel/preset-env我们需要配置corejs属性,什么是corejs?
babel只支持最新语法的转换，比如：extends，但是它没办法支持最新的Api,比如Map,Set,Promise等，需要在不兼容的环境中也支持最新的api，那么则需要通过Polyfill的方式在目标环境中添加缺失的API,这时候我们就需要引入core-js来实验polyfill. `useBuiltIns`则是告诉我们怎么引入Polyfill 
* entry
* usage
但是如果我们使用了其他插件也在原型对象上添加了同名的方法，那么就会出现问题
这时我们则可以使用@babel/plugin-transform-runtime插件，通过引入模块的方式实现polyfill

注意： 还需要在package.json中配置目标浏览器，告诉babel我们需要为哪些浏览器进行polyfill

### 加载css modules
什么是CSS modules?
> 每个CSS都有自己的作用域，CSS文件中的属性在该作用域下是唯一的
在css-loader中添加modules属性
```js
{
  loader: "css-loader",
  options: {
    modules: {
      localIdentName: '[hash:base64:8]',
    }
  }
}
```

### 加载sass

安装
```bash
pnpm  install sass-loader sass --save-dev
```
在config中的rule下添加如下规则
```js
{
  test: /\.(scss|sass)$/,
  use: [
    'sass-loader'
  ]
},
```

### 配置React
> 我们在写代码的时候，使用了jsx/tsx语法，但是浏览器并不认识他们，我们需要将jsx语法进行转换
需要用到babel插件:
```bash
pnpm install --save-dev @babel/preset-react
```

```js
{
  test: /\.jsx$/,
  include: path.resolve(__dirname, './src'),
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          "@babel/preset-env",
          [
            "@babel/preset-react",
            {
              runtime: 'automatic',
            }
          ]
        ]
      }
    }
  ]
}
```
在以前旧版本中，我们在使用jsx语法时，必须要引入：
```js
import React from 'react'
```
在新的版本中，我们将runtime设置为automatic，就可以省略这一步，babel将自动为我们导入jsx转换函数

### 配置Typescript
> 浏览器是不支持ts的语法的，我们需要先将ts文件进行编译，转换为js后浏览器才能够识别。
```bash
pnpm install --save-dev @babel/preset-typescript
```
使用
```js
{
  test: /\.(js|ts)?$/,
  include: path.resolve(__dirname, './src'),
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          "@babel/preset-env",
          [
            "@babel/preset-react",
            {
              runtime: 'automatic',
            }
          ],
          "@babel/preset-typescript",
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
},
```
此外还需要在项目根目录下添加tsconfig.json

```js
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
  },
  "include": [
    "src",
  ]
}
```

### 配置Eslint
语法规范很重要！！！
安装
```bash
pnpm install -D eslint eslint-webpack-plugin
pnpm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm install -D eslint-config-airbnb eslint-config-airbnb-typescript
pnpm install -D eslint-plugin-import eslint-plugin-jsx-a11y
pnpm install -D eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```
> 这里选用的是eslint-config-airbnb配置，其对jsx、Hooks、Typescript等都有良好的支持，也是当前比较流行的，严格的eslint校验之一.
接下来，创建Eslint配置文件.eslintrc.js
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [".*", "webpack", "public", "node_modules", "dist"], // 忽略指定文件夹或文件
  rules: {
    // 在这里添加需要覆盖的规则
    "react/function-component-definition": 0,
    "quotes": ["error", "single"],
    "jsx-quotes": ["error", "prefer-single"]
  }
};
```
到这里eslin配置完成，但是需要我们每次都运行命令去检查和修复代码的问题，这样比较麻烦，所以我们使用webpack的插件：eslint-webpack-plugin来自动查找和修复代码中的问题：
```js
{
    plugins: [
        new ESLintPlugin({
          extensions: ['.tsx', '.ts', '.js', '.jsx'],
          fix: true, // 自动修复错误代码
        }),
    ]
}
```


### 优化
在开发的时候，我们需要查看代码具体的报错信息，往往需要定位到哪一行，所以采用sourcemap进行优化

#### sourcemap

```js
devtool: 'cheap-module-source-map'
```
配置好后，当代码报错，浏览器中就会显示报错的代码的准确信息。

#### 配置缓存
当我们启动项目时，每次都会重新构建所有的文件，但是有的文件是长期不变的，比如说在node_modules中的文件，并不需要每次都重新构建。

那么我们就讲这些长期不变的文件进行缓存：

```js
cache: {
  type: "filesystem", // 使用文件缓存
},
```
在下一次启动的时候，webpack首先会去读取缓存中的文件，以此来提高构建的速度。
babel同样是具有缓存的，
```js
{
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  }
}
```
缓存的文件默认会在node_modules下的.cache文件夹下。

### 开启HRM模块热更新
```js
devServer: {
    hot: true
}
```
在需要热更新的文件中添加以下代码：
```js
if(module && module.hot) {
  module.hot.accept() // 接受自更新
}
```
但是在我们开发过程中不可能每个文件手动添加，而且在打包上线的时候是不需要热更新的代码的。所以出现了一些自动添加热更新函数的插件：
* React Hot Loader: 支持实时调整React组件
* Vue Loader: 此loader支持 vue 组件的 HMR，提供开箱即用体验。
* Elm Hot webpack Loader...
对于React来说，已经不使用React Hot Loader这个loader，而是使用react-refresh.

### 打包优化
#### 抽离CSS
mini-css-extract-plugin 插件会将js中的css提取到单独的css文件中，并且支持css和sourcemaps的按需加载。
```bash
pnpm install --save-dev mini-css-extract-plugin
```
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css从js中分离为单独的css文件
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            isEnvProduction ? 
            MiniCssExtractPlugin.loader: 
            'style-loader',
            'css-loader'
        ],
      },
    ]
  },
  plugins: [
      new MiniCssExtractPlugin(),
  ]
}
```
通过环境区别，在开发环境使用style-loader，在生产环境使用mini-css-extract-plugin

### 代码分离
使用splitChunks：
```js
{
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}
```
### 最小化入口chunk的体积
通过配置optimization.runtimeChunk，将入口文件中运行时的代码提出来单独创建一个chunk，减小入口chunk的体积。
```js
{
  optimization: {
      runtimeChunk: 'single'
  }
}
```
### 压缩js
通常压缩js代码我们会使用terser-webpack-plugin，在webpack5中已经内置了该插件，当mode为production时会自动启用。

### 压缩css
我们会使用css-minimizer-webpack-plugin插件。
```bash
pnpm install css-minimizer-webpack-plugin --save-dev
```
使用
```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); 
module.exports = {
  optimization: {
    minimizer: [
        new CssMinimizerPlugin();
        '...'
    ],
  },
};
```
这里注意一点，如果我们只想添加额外的插件与默认插件一起使用，需要添加'...'，表示添加默认插件。

### dll
使用DllPlugin将不会频繁更改的代码单独打包生成一个文件，可以提高打包时的构建速度。

使用： 首先我们新建一个webapck.dll.js文件，将会不频繁更改的包添加在入口：

```js
const paths = require('./paths');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: {
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    path: paths.dllPath,
    filename: paths.dllFilename,
    library: '[name]_dll_library'
  },
  plugins: [
    // 使用DllPlugin插件编译上面配置的NPM包
    // 会生成一个json文件，里面是关于dll.js的一些配置信息
    new webpack.DllPlugin({
      path: paths.dllJsonPath,
      name: '[name]_dll_library'
    })
  ]
};
```
然后我们在package.json处添加打包命令：
```js
{
  "name": "webpack5",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "dll": "webpack --config ./webpack/webpack.dll.js"
    ...
  },
  ...
}
```

### tree-shaking
关于树摇，简单的理解的话就是再打包的时候将没有使用的js代码排除掉。
开启树摇：只需要将mode设置为production，tree shaking就会自动开启。

### 清除未使用的css
清除未使用的css，可以理解为css的tree shaking，我们使用purgecss来实现。因为我们经常会使用css模块，所以需要安装@fullhuman/postcss-purgecss
```bash
pnpm install -D @fullhuman/postcss-purgecss
```
```js
{
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        ...
        isEnvProduction && 
        [
          '@fullhuman/postcss-purgecss', // 删除未使用的css
          {
            content: [ paths.appHtml, ...glob.sync(path.join(paths.appSrc, '/**/*.{tsx,ts,js,jsx}'), { nodir: true }) ],
          }
        ]
      ].filter(Boolean),
    },
  }
},
```
在postcss-loader添加该插件就可以了。

### 开启多线程
我们可以在工作比较繁重，花费时间比较久的操作中，使用thread-loader开启多线程构建，能够提高构建速度。
```bash
pnpm install --save-dev thread-loader
```
使用
```js
{
  test: /\.(js|jsx|ts|tsx)$/,
  include: paths.appSrc,
  use: [
    {
      loader: "thread-loader", 
      options: {
        workers: 2,
        workerParallelJobs: 2
      },
    },
  ]
}
```
> webpack官网提到node-sass中有个来自 Node.js 线程池的阻塞线程的 bug。 当使用 thread-loader时，需要设置  workerParallelJobs: 2。

### 打包清空原来的文件夹
在webpack5之前我们使用clean-webpack-plugin来清除输出文件夹，在webpack5自带了清除功能。
```js
output: {
    clean: true,
}
```
### 懒加载
懒加载也可以叫做按需加载，本质是将文件中的不会立即使用到的模块进行分离，当在使用到的时候才会去加载该模块，这样的做法会大大的减小入口文件的体积，让加载速度更快。使用方式则是用import动态导入的方式实现懒加载。
```js
import('demo.js')
 .then({default: res} => {
     ...
 });
```
当webpack打包时，就会将demo文件单独打包成一个文件，当被使用时才会去加载。可以使用魔法注释去指定chunk的名称与文件的加载方式。
```js
//指定chunk名称：
import(/* webpackChunkName: "demo_chunk" */ 'demo.js')
 .then({default: res} => {
     ...
 });
```
```js
//指定加载方式
import(
   /* webpackPreload: "demo_chunk", webpackPrefetch: true */
   'demo.js'
)
 .then({default: res} => {
     ...
 });
```
我们来看下两种加载方式的区别：
1. prefetch：会在浏览器空闲时提前加载文件
2. preload: 会立即加载文件

### 使用CDN加速
打包完成后，可以将静态资源上传到CDN，通过CDN加速来提升资源的加载速度。
```js
output: {
    publicPath: isEnvProduction ? 'https://CDNxxx.com' : '', 
},
```
通过配置publicPath来设置cdn域名。


### 浏览器缓存
浏览器缓存，就是在第一次加载页面后，会加载相应的资源，在下一次进入页面时会从浏览器缓存中去读取资源，加载速度更快。
webpack能够根据文件的内容生成相应的hash值，当内容变化hash才会改变。
```js
module.exports = {
  output: {
    filename: isEnvProduction
      ? "[name].[contenthash].bundle.js"
      : "[name].bundle.js",
  },
};
```