let path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}


module.exports = {
  lintOnSave: false,
  devServer: {
    // string | Object 代理设置
    proxy: {

            // 接口是 '/repos' 开头的才用代理
            '/videoapi': {
                target: 'http://www.dev-zuma.com', // 目标地址
                ws: true,
                secure: false,
                changeOrigin: true, // 是否改变源地址
                pathRewrite: {"^/videoapi": ""}

            },
      // 接口是 '/repos' 开头的才用代理
      '/products': {
        target: 'http://www.dev-zuma.com', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: { "^/products": "" }

      },
      '/services': {
        target: 'http://www.dev-zuma.com', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: { "^/services": "" }

      },
      '/music': {
        target: 'http://www.dev-zuma.com', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: { "^/music": "" }

      },
      '/newscontent': {
        target: 'http://www.dev-zuma.com', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: { "^/newscontent": "" }

      },
      '/Blogcontent': {
        target: 'http://www.dev-zuma.com', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: { "^/Blogcontent": "" }

      },
      '/passportapi': {
        target: 'http://www.dev-zuma.com', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {"^/passportapi": ""}

    },
      '/WebsiteCon': {
        target: 'http://www.dev-zuma.com', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {"^/WebsiteCon": ""}

    },
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('components', resolve('src/components')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('common', resolve('src/common'))//common/images/1212.png

  },

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  }
}
