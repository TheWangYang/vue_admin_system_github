const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //设置Vue代理服务器（可设置多个）
  devServer: {
    proxy: {
      '/proxy_1': {
        target: 'http://127.0.0.1:8081',
        pathRewrite: {//重写请求路径，将前缀/demo替换为空字符串
          '^/proxy_1':''
        },
        ws: true,//用于支持webSocket
        changeOrigin: true//用于在代理服务器和目标服务器之间决定代理服务器是否说谎，称自己是否和目标服务器端口号一致。
      },

    }
  }
})
