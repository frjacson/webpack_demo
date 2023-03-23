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

