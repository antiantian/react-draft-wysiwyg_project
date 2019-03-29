import { routerRedux } from 'dva/router'
import { login ,SAASsignIn, SAAScode} from 'services/login'
import {message} from 'antd'
import axios from 'axios'
export default {
  namespace: 'login',
  state: {},
  effects: {
    *SAAScodeBySms({
      payload,
    }, { put, call, select }) {
      console.log(payload)
      const data = yield call(SAAScode, payload)
      if (data.code==200) {
          yield put({
              type: 'updateState',
              payload:{
                code:data.data.code
              }
          }) 
          yield put({   //登陆
                type: 'SAASsignIn',
                payload:{
                  code:data.data.code
                }
            })
          
      } 
    },
    *SAASsignIn({
      payload,
    }, { put, call, select }) {
      const data = yield call(SAASsignIn, payload)
      if (data.code==200) {  //登陆成功   
          //成功  继续登录
          if(data.data.jwtAuthorization){
             localStorage.loginToken = data.data.jwtAuthorization;
             localStorage.merAccessId = data.data.merAccessId;
             localStorage.refreshToken = data.data.tokenInfo.refreshToken;
             localStorage.loginMess = JSON.stringify(data.data);
             localStorage.appId = data.data.appId;
             yield put({ type: 'app/loginToken',payload:{
              commonToken:data.data.jwtAuthorization,
              refreshToken:data.data.tokenInfo.refreshToken,
              loginMess:data.data} }) 
           }
           yield put({ type: 'app/query',payload:{data} })
           const { locationQuery } = yield select(_ => _.app)
           const { from } = locationQuery
          
          if (from && from !== '/bronk/login') {

            yield put(routerRedux.push(from))
            // yield put({
            //       type: 'querySummary'
            //     })
          } else {
            yield put(routerRedux.push('/bronk/homepage'))
          }
      } 
    },
 
  },

}