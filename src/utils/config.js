
let URL_SAAS ='https://saas-gateway.iblockfinance.com';
 
if(ENV=="prod"){
    URL_SAAS ='https://saas-gateway.iblockfinance.com';
}
if(ENV=="dev"){ 
   URL_SAAS ='http://dev-saas-gateway.qqdcloud.com';
}

if(ENV=="test"){ 
   URL_SAAS ='http://saas-gateway.qqdcloud.com';
}

if(ENV=="release"){ 
   URL_SAAS ='http://test-saas-gateway.qianquduo.com';
}

const APIV1 = process.env.NODE_ENV === 'production' ? `${URL_SAAS}/api/v0.2/auth`:'/api/v0.2/auth'
const APIV2 = process.env.NODE_ENV === 'production' ? `${URL_SAAS}/admin/v0.2/cms`:'/admin/v0.2/cms'

module.exports = {
  name: '布朗客内容管理系统',
  prefix: 'Sass-bronk-Admin',
  footerText: '布朗客内容管理系统  © 2018 乾趣科技',
  logo:'/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',  
  CORS: [],
  baseURL:'/bronk',
  openPages: ['/bronk/login'],
  apiPrefix: '/api/v1',
  appID:localStorage.appId,//"ZZs7mA7PePp9kCIC5OJ1XHtlICS3mULR",
  api: {
    //--------登录
    userCode: `${APIV1}/bg/cas/code`,           //  后台登录
    userSignIn: `${APIV1}/bg/cas/signIn`,
    refreshToken: `${APIV1}/bg/cas/refreshToken`, 
    userLogout: `${APIV1}/bg/cas/signOut`,  
    userReset: `${APIV1}/bg/admin/updatepwd`,    ///admin/updatepwd
    //--------作者管理
    authorAdd: `${APIV2}/authorInfo/add`,
    authorList: `${APIV2}/authorInfo/getList`,
    authorDel: `${APIV2}/authorInfo/del`,
    authorEdit: `${APIV2}/authorInfo/update`,
    authorView: `${APIV2}/authorInfo/getById`,

    //--------栏目管理
    columnAdd: `${APIV2}/column/add`,       //添加
    columnList: `${APIV2}/column/getList`,//栏目列表
    columnDel: `${APIV2}/column/del`,       //删除
    columnUpdata: `${APIV2}/column/update`, //修改
    columnById: `${APIV2}/column/getById`,   //详情
    bgUploadFileAuth: `${APIV2}/upload/uploadFileAuth`, // 图ali凭证
    columnHide:`${APIV2}/column/hide`,   // 隐藏
    //--------评论信息列表管理
    commentGetList: `${APIV2}/comments/getList`,
    commentHide: `${APIV2}/comments/hide`,
    //--------用户信息
    userList:`${APIV1}/bg/user/getList`, //用户列表 
    userAdd: `${APIV1}/bg/user/register`, //1--添加用户
    userModify:`${APIV1}/bg/user/modifyState`, //用户封禁/启用
    //--------发布管理
    resourceGet: `${APIV2}/resource/getList`, //查询分页资源数据  
    resourceAdd: `${APIV2}/resource/add`,        //添加
    resourceUpdate: `${APIV2}/resource/update`,   //修改资源
    resourceupdateSync: `${APIV2}/resource/updateSynchronization`,  //修改资源并同步发布内容
    resourceDel: `${APIV2}/resource/del`,         //删除资源
    resourceUpload: `${APIV2}/resource/upload`,         //资源图片上传
    uploadVideo: `${APIV2}/resource/uploadVideo`,         //视频资源上传
    resourceGetById: `${APIV2}/resource/getById`, //根据ID查询资源信息
    // ------ 发布池
    releaseGet: `${APIV2}/release/getList`, //查询分页资源类型数据
    releaseAdd: `${APIV2}/release/add`,        //  添加
    releaseUpdate: `${APIV2}/release/update`,   //修改站点
    releaseDel: `${APIV2}/release/del`,         //删除站点
    releaseGetById: `${APIV2}/release/getById`, //根据ID查询资源信息  
    // ------- 视频
    videoGet: `${APIV2}/video/getList`, //视频列表
    videoGetById: `${APIV2}/video/getById`, //视频获取
    videoDel: `${APIV2}/video/del`, //视频删除 
    videoHide: `${APIV2}/video/hide`, //视频隐藏 
    videoAdd: `${APIV2}/video/add`,        //添加视频
    videoUpdate: `${APIV2}/video/update`,   //修改视频/upload/getImgUrl
    cmsuploadVideoAuth:`${APIV2}/upload/uploadVideoAuth`,  //阿里凭证  视频
    aliImgUrl:`${APIV2}/upload/getImgUrl`,  //获取图片转换后url
    callbackUploadVideo:`${APIV2}/upload/callbackUploadVideo`,  //视频回调地址
    // -------- z专题
    specialAdd:`${APIV2}/resource/addSync`,  // 添加专题
    specialUpdate:`${APIV2}/release/updateSpecial`,  // 修改专题
    specialTop:`${APIV2}/release/top`,  //专题置顶
    ///
    enterpriseList:`${APIV2}/enterprise/getPage`,  // ,
    enterpriseAdd:`${APIV2}/enterprise/add`,  // ,
    enterpriseEdit:`${APIV2}/enterprise/add`,  // ,
    enterpriseDel:`${APIV2}/enterprise/remove`,  // 
    enterpriseGetById: `${APIV2}/enterprise/getInfo`,  // ,
    //
    personageList:`${APIV2}/industryFigure/getPage`,
    personageAdd:`${APIV2}/industryFigure/add`,
    personageEdit:`${APIV2}/industryFigure/add`,
    personageDel:`${APIV2}/industryFigure/remove`,
    personageGetById:`${APIV2}/industryFigure/getInfo`,
    //
    AgencyList:`${APIV2}/investmentAgency/getPage`,
    AgencyAdd:`${APIV2}/investmentAgency/add`,
    AgencyEdit:`${APIV2}/investmentAgency/add`,
    AgencyDel:`${APIV2}/investmentAgency/remove`,
    AgencyGetById:`${APIV2}/investmentAgency/getInfo`,
    //应用  
    appList: `${APIV1}/bg/app/getList`, // 商户应用管理-分页列表
    appGetById:`${APIV1}/bg/app/getDetail`, //
    appEdit:`${APIV1}/bg/app/edit`, //
    appAdd:`${APIV1}/bg/app/add`, //
    appDel:`${APIV1}/bg/app/remove`, //
    appReset:`${APIV1}/bg/app/resetAppSecret`, //商户应用管理-重置应用appSecret
    addOrUpdateAliCloud:`${APIV1}/bg/app/addOrUpdateAliCloud`, //商户应用管理-应用oss上传key设置、vod上传key设置
    addInfo:`${APIV1}/bg/app/extInfo`, //商户应用管理-根据appId查询应用阿里配置详情
    //管理员管理
    adminList:`${APIV1}/bg/admin/getList`,
    adminAdd:`${APIV1}/bg/admin/add`,
    adminEdit:`${APIV1}/bg/admin/edit`,
    adminModify:`${APIV1}/bg/admin/modifyState`,
    adminReset:`${APIV1}/bg/admin/resetpwd`,
    // /bg/admin/editallrole
    //角色 资源
    roleGetList: `${APIV1}/bg/role/getUserRolelist`,   //角色成员-角色列表
    roleGetPageList: `${APIV1}/bg/role/getList`,    //角色管理根目录-角色列表
    roleAdd: `${APIV1}/bg/role/add`,        // 新增角色（测试通过待联调）
    roleGetById: `${APIV1}/bg/role/add`,    //  没有 详细信息 以及删除一个角色
    roleUpdate: `${APIV1}/bg/role/edit`,       // 角色详情-编辑角色
    roleDel: `${APIV1}/bg/role/delete`,         //移除角色
    role_add_person: `${APIV1}/bg/admin/editrole`,     //编辑成员弹窗-批量编辑角色下的成员   批量添加成员
    roleGetPerson: `${APIV1}/bg/admin/getList`,   //移除角色下单个成员
    roleDelPerson: `${APIV1}/bg/admin/removerole`,   //移除角色下单个成员
    roleResource: `${APIV1}/bg/role/editresource`,   // 授权弹窗-编辑角色下权限清单
    role_personhad: `${APIV1}/bg/admin/editallrole`,   //编辑角色弹窗-批量编辑成员拥有的角色 批量添加角色
    
    roleGetAhtority: `${APIV1}/bg/role/roleresource`,   // 角色 某一个角色下的权限列表
    roleOneresource: `${APIV1}/bg/role/roleresource`,   // 角色 某一个角色下的权限列表
    roleUpdateOneresource: `${APIV1}/bg/role/editoneresource`,   // 角色 编辑一个资源
    roleDelOneresource: `${APIV1}/bg/role/removeresource`,   // 角色 移除一个资源
    resourcegetlist: `${APIV1}/bg/resource/getlist`,     // 资源管理列表 
    resourceadd: `${APIV1}/resource/add`,     //  资源管理根目录-新增资源
    resourceedit: `${APIV1}/resource/edit`,     //  资源管理根目录-bianji 资源
    resourceremove: `${APIV1}/resource/remove`,     //  资源管理根目录-删除资源
    resourcegetall: `${APIV1}/bg/resource/getall`,     //  资源管理 获取全部 资源
  }
}

 

