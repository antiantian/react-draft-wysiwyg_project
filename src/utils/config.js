
let URL_SAAS =' ';
 
if(ENV=="prod"){
    URL_SAAS =' ';
}
if(ENV=="dev"){ 
   URL_SAAS =' ';
}

if(ENV=="test"){ 
   URL_SAAS =' ';
}

if(ENV=="release"){ 
   URL_SAAS =' ';
}

const APIV1 = process.env.NODE_ENV === 'production' ? `${URL_SAAS}/api/v0.2/auth`:'/api/v0.2/auth'
const APIV2 = process.env.NODE_ENV === 'production' ? `${URL_SAAS}/admin/v0.2/cms`:'/admin/v0.2/cms'

module.exports = {
  name: ' 内容管理系统',
  prefix: 'Sass-bronk-Admin',
  footerText: ' 内容管理系统  ',
  logo:'/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',  
  CORS: [],
  baseURL:'/bronk',
  openPages: ['/bronk/login'],
  apiPrefix: '/api/v1',
  appID:localStorage.appId,//" ",
  api: {
    //--------登录
    userCode: `${APIV1}/bg/cas/code`,           //  后台登录
    userSignIn: `${APIV1}/bg/cas/signIn`,
    refreshToken: `${APIV1}/bg/cas/refreshToken`, 
    userLogout: `${APIV1}/bg/cas/signOut`,  
  
    resourceremove: `${APIV1}/resource/remove`,     //  资源管理根目录-删除资源
    resourcegetall: `${APIV1}/bg/resource/getall`,     //  资源管理 获取全部 资源
  }
}

 

