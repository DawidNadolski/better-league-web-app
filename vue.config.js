const { defineConfig } = require('@vue/cli-service')
const path = require('path')

const eslintConfigPath = path.resolve(__dirname, '.eslintrc.js')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('eslint').tap((args) => {
      const options = args[0] || {}
      options.context = path.resolve(__dirname)
      options.overrideConfigFile = eslintConfigPath
      options.threads = false
      return [options]
    })
  },
})
