const path = require('path')
const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, '')
]
let HOST = process.argv.splice(2)[0] || 'prod';
 
  let  authURL ="https://saas-gateway.qianquduo.com" 
 if(HOST=='dev'){
    authURL = "http://saas-gateway.qqdcloud.com" 
 
}
if(HOST=='release'){
   authURL = "http://test-saas-gateway.qianquduo.com"   
}
 
export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  theme: "./theme.config.js",
  /*publicPath: `/xh_admin/`,
  outputPath: `./dist/xh_admin/`,*/
  publicPath: `/${version}/`,
  outputPath: `./dist/${version}`,
  // 接口代理示例
  proxy: {
    "/api/v0.2/auth": {
      "target":`${authURL}`,
      "changeOrigin": true,
      "pathRewrite": { "^/api/v0.2/auth" : "/api/v0.2/auth" } 
    },
    "/admin/v0.2/cms": {
      "target":`${authURL}`,
      "changeOrigin": true,
      "pathRewrite": { "^/admin/v0.2/cms" : "/admin/v0.2/cms" } 
    }
  },
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    },
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    }
  },
  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  },
  "define": {
    "ENV": HOST
  },
}


