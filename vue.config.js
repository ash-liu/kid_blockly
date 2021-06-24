const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// vue.config.js
module.exports = {
  devServer: {
    port: 3000
  },
  configureWebpack: {
    plugins: [
      // Copy over media resources from the Blockly package
      new CopyPlugin([
        {
          from: path.resolve(__dirname, './node_modules/blockly/media'),
          to: path.resolve(__dirname, 'dist/media')
        }
      ])
    ]
  },
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html'
    },

    serial: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/serial.html',
      // 在 dist/index.html 的输出
      filename: 'serial'
    },

    ws: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/ws.html',
      // 在 dist/index.html 的输出
      filename: 'ws'
    },
  }
}
