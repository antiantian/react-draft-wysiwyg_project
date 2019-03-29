/* global window */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types' 
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Layout, Loader } from 'components'
import { classnames, config,compareUp } from 'utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import '../themes/index.less'
import './app.less'
import Error from './error'
import { routerRedux } from 'dva/router'
import axios from 'axios'
import qs from 'qs'
import ResetPwd from  './resetPwd'
import lodash from 'lodash'  
import {message} from 'antd'
const { prefix, openPages,api } = config

const { Header, Bread, Footer, Sider, styles } = Layout
let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions,resetPwdvisible,defaulkeys ,confirmDirty,commonToken} = app
  
  if(!app){
      dispatch(routerRedux.push({
          pathname: '/bronk/homepage',
        }))
  }
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
   
 const detailExp = (item,path) => {
    let haddetail=false;
    let data=[];
    if(item.details){
       data=item.details.split(',')
    }
    if(data.length>0){
        for(let i=0;i<data.length;i++){
          let valpath=pathToRegexp(data[i]).exec(path);
          if(valpath){
            haddetail=true   
          }
       }
    }
  
   return   haddetail
 }
  let newP=lodash.cloneDeep(menu);  
 newP.sort(compareUp('sequence'))
  const current = menu.filter(  //父路由或者 details路由 pathToRegexp( item.details ||'').exec(pathname)
    item => pathToRegexp( item.route ||'').exec(pathname) || detailExp(item,pathname)
  )

  let  hadRoot=true;
  if(current.length>0){
    pathname= current[0].route
  }
  // console.log(11111)
  //   console.log(pathname)
  // console.log(current)
  // console.log(pathname.indexOf("homepage"))
  // 判断  当前的 导航 有没有在权限列表里 
  if(!current||current.length<=0){
       if(pathname!="/" || pathname!="/bronk/homepage"){
           hadRoot=false
      }else if(pathname.indexOf("homepage")>0){
          pathname="/bronk/homepage"
     } else{
         pathname="/"
     }
     
  }

  const href = window.location.href
console.log(lastHref , href)
  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    menu,
    user,
    location,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    resetPwd(){
       dispatch({ type: 'app/updateState',payload:{resetPwdvisible:true,defaulkeys:['resetPwd']} })  
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const siderProps = {
    menu:newP,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }
   const modalProps = {
    app,
    dispatch,
    confirmDirty,
    visible: resetPwdvisible,
    title: '修改密码',
    item:{},
    destroyOnClose:true,
    wrapClassName: 'vertical-center-modal',
    onOk (datas) {  
      dispatch({
        type: 'app/reset',
        payload: datas,
      })
    },
    onCancel () {
      dispatch({
        type: 'app/updateState',payload:{resetPwdvisible:false,defaulkeys:[]} 
       })
    },
  }
  const breadProps = {
    menu,
    location,
  }
 
  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }
  return (
    <div>
     <ResetPwd  {...modalProps} />
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>布朗客内容管理系统</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
        {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
          {siderProps.menu.length === 0 ? null : <Sider {...siderProps} />}
        </aside> : ''}
        <div className={styles.main} style={{display:'flex',flex:1,flexDirection:'column',}}>
          <Header {...headerProps} />
          <Bread {...breadProps} />
          
          <div className={styles.container} style={{display:'flex',flex:1}}>
            <div className={styles.content} style={{flex:1,display: 'flex',overflow:'auto'}}>
              {hadRoot?children:<Error/>}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))



//标签页响应判断
var i = 1800;
var timer = null;

var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 
'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

var onVisibilityChange = function () {
  if(window.location.pathname=="/bronk/homepage"){
    return
  }
  if (!document[hiddenProperty]) {//响应标签
    clearInterval(timer);
    i=1800;
  } else {//不响应标签
    timer = setInterval(function () {
      i--;
      //console.log(i);
      if (i <= 0) {
       // hashHistory.push('/homepage');
         message.warning('token失效，重新登陆');
         clearInterval(timer);
         localStorage.clear();
         history.push('/bronk/homepage')
         window.location.reload()
      }
    }, 1000);
  }
}

//当前页点击响应
function ScreenSaver(settings) {
  this.settings = settings;

  this.nTimeout = this.settings.timeout;

  document.body.screenSaver = this;
  // link in to body events 
 // document.body.onmousemove = ScreenSaver.prototype.onevent;
  document.body.onmousedown = ScreenSaver.prototype.onevent;
  document.body.onkeydown = ScreenSaver.prototype.onevent;
  document.body.onkeypress = ScreenSaver.prototype.onevent;

  var pThis = this;
  var f = function () { pThis.timeout(); }
  this.timerID = window.setTimeout(f, this.nTimeout);
}
ScreenSaver.prototype.timeout = function () {
   if(window.location.pathname=="/bronk/homepage"){
    return
  }
  if (!saver) {
    console.log(111111112333333333333)
     message.warning('token失效，重新登陆');
     localStorage.clear();
     history.push('/bronk/homepage')
     window.location.reload()
  }
}
ScreenSaver.prototype.signal = function () {
   if(window.location.pathname=="/bronk/homepage"){
     return
   }

   var timeNOW =  (new Date()).getTime();  //当前时间
   if(localStorage.timeNOW){
       if(timeNOW-localStorage.timeNOW<2000){
           localStorage.timeNOW=(new Date()).getTime()
           return  
       }else{
           localStorage.timeNOW=(new Date()).getTime()
       }
   }else{
      localStorage.timeNOW=(new Date()).getTime()
   }
  if (saver) {

     saver.stop();
     requireAuth();
  }

  window.clearTimeout(this.timerID);

  var pThis = this;
  var f = function () { pThis.timeout(); }
  this.timerID = window.setTimeout(f, this.nTimeout);
}
ScreenSaver.prototype.stop= function () {
     saver=null;
}
ScreenSaver.prototype.onevent = function (e) {
  this.screenSaver.signal();
}

var saver;
function initScreenSaver() {
  saver = new ScreenSaver({ timeout:1800000});
}

initScreenSaver();

document.addEventListener(visibilityChangeEvent, onVisibilityChange);

function requireAuth() {
    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // axios.defaults.transformRequest=[
    //       function(data) {
    //         //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
    //         //data.strSQL = base64encode(data.strSQL);
    //         //由于使用的form-data传数据所以要格式化
    //         data = qs.stringify(data);
    //         return data;
    //       }
    //     ]
    // axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    //   axios.defaults.transformRequest=[
    //       function(data) {
    //         //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
    //           data = JSON.stringify(data);
    //         //由于使用的form-data传数据所以要格式化
    //         return data;
    //       }
    //     ]
    axios.post(api.refreshToken,{
        refreshToken:localStorage.refreshToken
    })
    .then(function(res){
   
         if(res.data.code==200){
            var timestamp = (new Date()).getTime();  //当前时间
            var autuTime=res.data.data.tokenInfo.expiry*1000;  //过期时间
            if(localStorage.autuTime&&timestamp>localStorage.autuTime){  
               message.warning('token失效，重新登陆');
              localStorage.clear();
             history.push('/bronk/homepage')
             window.location.reload()
            }else{
                 localStorage.autuTime=autuTime;
                 initScreenSaver() 
            } 
         }
          
   
    })
    .catch(function(err){
        console.log(err);
    })
}
