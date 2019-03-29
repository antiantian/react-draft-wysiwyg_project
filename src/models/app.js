/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout ,reset,refreshT} from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'
import routes from '../routerpath'
import {message} from 'antd'
import modelExtend from 'dva-model-extend'
import { pageModel } from './common'
const { prefix } = config
let dataPATH =[] ;
routes.map((item)=>{
   dataPATH.push(item.path) ;
})
export default modelExtend(pageModel, {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [{
        id: 1,
        icon: 'laptop',
        name: '后台首页',
        route: '/bronk/homepage',
      }, {
                      id: '14', 
                      name: '发布管理',
                    },
                    {  ///bronk/video
                      id: '141',
                      mpid: '14',
                      name: '投稿管理',
                      route: '/bronk/submission/detail',
              
                       authority:{
                        list:['增加','修改','审核','隐藏','同步发布']
                      }
                    }],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: '后台首页',
        route: '/bronk/homepage',
      }, {
                      id: '14', 
                      name: '发布管理',
                    },
                    {  ///bronk/video
                      id: '141',
                      mpid: '14',
                      name: '投稿管理',
                       route: '/bronk/submission/detail',
                       authority:{
                        list:['增加','修改','审核','隐藏','同步发布']
                      }
                    }
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    commonToken:null,
  },
  subscriptions: {
 
     setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        // console.log(location.pathname)
                //控制按钮
          // dispatch({
          //     type: 'setConcom',
          //     payload:{location}
          //  })
          console.log(location)
         if (location.pathname !== '/bronk/homepage'&&location.pathname !=='/') {
            dispatch({  //token刷新
                type: 'refreshT'
            })
         }
             
        
        if( localStorage.loginToken){   //根据 localstorage存储token  
           dispatch({ type: 'loginToken',payload:{commonToken:localStorage.loginToken,refreshToken:localStorage.refreshToken} }) 
        }
        if(localStorage.loginMess){   //根据 localstorage存储token
           
           let messages = JSON.parse(localStorage.loginMess)
 
           dispatch({ 
                type: 'updateState',
                payload:{
                  user:{
                    username:messages.userName
                  }
                } 
              })

           let memus = messages.authList?messages.authList.list:null;  //

            var typeL= Object.prototype.toString.call(memus);
            if(!memus||typeL=='[object String]'||memus.length==0){
                memus=[
                    {
                      id: 1,
                      icon: 'dashboard',
                      name: '后台首页',
                      route: '/bronk/homepage',
                    },
                  ]
            }
           //过滤掉不显示的导航
           const parents = memus.filter((item)=>{
                return !item.route || item.route==''
            })
           memus=memus.filter((item)=>{
                return item.route!=="/bronk/oldbronk"  && item.route!== "/bronk/pad-fg" && item.route!=="/bronk/pad-bronk" && item.route!=="/bronk/sale"
           })
            memus=memus.filter((item)=>{
                return dataPATH.includes(item.route) 
           })
          let parentIDS  = [];  //父id
          let arrs = memus.filter((item)=>{
              if(!parentIDS.includes(item.mpid)){
                  parentIDS.push(item.mpid)
              }
               
          })
          let parArr = parents.filter((item)=>{
             return parentIDS.includes(item.id)   
          })
           if(memus){
             
             const  audit = [
                    {
                       id: '100000',
                      name: '工作台',
                      route: '/bronk/homepage'
                    },
               
                   
             ] 
            // memus.push.apply(memus,audit);
             memus.push.apply(memus,parArr);
             let indexme = memus.filter((item)=>{
                   return item.route==="/bronk/homepage"
             })
            console.log(indexme)
             if(!indexme||indexme.length==0){
                indexme =[{
                      id: '100000',
                      name: '工作台',
                      route: '/bronk/homepage',
                      sequence:0,
                    }]
             }
             indexme[0].sequence=0;
             indexme[0].icon='dashboard';
            let indexother = memus.filter((item)=>{
                   return item.route!=="/bronk/homepage"
             })
             indexother.unshift(indexme[0]);
             memus=indexother
             console.log(memus)
             memus.push({
                      id: '100001',
                      name: '工作台',
                      route: '/bronk/comment/detail',
                      sequence:0,
                    })
             
             dispatch({ 
                type: 'updateState',
                payload:{
                  user:{
                    username:messages.userName
                  },
                  menu:memus,
                  permissions:{
                    visit:memus
                  }
                } 
              })  
           }  
        }
       
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },
 
   
    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {
 
      * refreshT ({payload}, { call, put, select }) {
          var {refreshToken} = yield select(_ => _.app)
          //console.log(localStorage.autuTime)
          if(!localStorage.refreshToken){
             return
          }
          const data = yield call(refreshT, {refreshToken:localStorage.refreshToken})
          if(data.code==200){
               var timestamp = (new Date()).getTime();  //当前时间
                var autuTime=data.data.tokenInfo.expiry*1000;  //过期时间
                if(localStorage.autuTime&&timestamp>localStorage.autuTime){  
                   message.success('token失效,请重新登陆')
                   localStorage.clear();
                   yield put({ type: 'loginToken',payload:{commonToken:null,refreshToken:null} }) 
                   yield put({ type: 'query' })
                }else{
                   localStorage.autuTime=autuTime;
               }
          }

    },
    * reset ({payload}, { call, put, select }) {
        const data = yield call(reset, payload)
        if(data.code==200){
            message.success('修改成功')
            
            yield put({ type: 'updateState', payload: {defaulkeys:[],resetPwdvisible:false} })
            localStorage.clear();
            yield put({ type: 'loginToken',payload:{commonToken:null,refreshToken:null} }) 
            yield put({ type: 'query' })
        } 
    },
    * query ({
       payload = {} ,
    }, { call, put, select }) {
      var {commonToken,menu} = yield select(_ => _.app)
      const { locationPathname } = yield select(_ => _.app)
      const {data} =payload;

      if (commonToken) {
    
        if (location.pathname === '/bronk/login'||location.pathname === '/') {
          console.log(1111111111111111)
          yield put(routerRedux.push({
            pathname: '/bronk/homepage',
          }))
        }
      }
      else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        console.log(2222222222222)
        console.log(queryString.stringify({
              from: locationPathname,
            }))
          yield put(routerRedux.push({
            pathname: '/bronk/homepage',   //pathname: '/login',
            search: queryString.stringify({
              from: locationPathname,
            }),
          }))
      }
    },
 
 * logout ({
      payload={},
    }, { call, put,select }) {
      var {commonToken} = yield select(_ => _.app)
       
      const data = yield call(logout, {})
      if(data.code==200){
          localStorage.clear();
          yield put({ type: 'loginToken',payload:{commonToken:null,refreshToken:null} }) 
          yield put({ type: 'query' })
      }else{
        localStorage.clear();
          yield put({ type: 'loginToken',payload:{commonToken:null,refreshToken:null} }) 
          yield put({ type: 'query' })
          throw data
      }
    },
    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
    loginToken (state, { payload}) {
        return {
          ...state,
          ...payload,
        }
    }
  },
})
